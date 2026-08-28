import { FICA_2026 } from "./fica";
import { getStateByCode } from "@/data/states";
import { marginalRate } from "./federal";
import { stateBracketsFor } from "./state";
import type { FilingStatus } from "./types";

/**
 * IRS 추가급여(supplemental wages) 정률법.
 * 연간 누적 추가급여 $1,000,000 까지는 22%, 초과분은 37% 를 원천징수한다.
 */
export const SUPPLEMENTAL_FEDERAL_RATE = 0.22;
export const SUPPLEMENTAL_FEDERAL_RATE_HIGH = 0.37;
export const SUPPLEMENTAL_THRESHOLD = 1_000_000;

export type BonusInput = {
  bonus: number;
  /** 보너스를 제외한 연봉 — FICA 상한 도달 여부 판단에 쓴다 */
  baseSalary: number;
  stateCode: string;
  filingStatus: FilingStatus;
};

export type BonusResult = {
  bonus: number;
  federal: number;
  socialSecurity: number;
  medicare: number;
  additionalMedicare: number;
  stateTax: number;
  /** 주가 별도 추가급여 요율을 공표하지 않아 한계세율로 근사했는지 */
  stateRateIsEstimate: boolean;
  stateRate: number;
  totalWithheld: number;
  net: number;
  effectiveRate: number;
};

export function calculateBonus({ bonus, baseSalary, stateCode, filingStatus }: BonusInput): BonusResult {
  const gross = Math.max(0, bonus);

  const federal =
    gross <= SUPPLEMENTAL_THRESHOLD
      ? gross * SUPPLEMENTAL_FEDERAL_RATE
      : SUPPLEMENTAL_THRESHOLD * SUPPLEMENTAL_FEDERAL_RATE +
        (gross - SUPPLEMENTAL_THRESHOLD) * SUPPLEMENTAL_FEDERAL_RATE_HIGH;

  // 사회보장세는 기본급으로 이미 채운 만큼을 빼고 남은 한도에만 부과된다
  const ssRemaining = Math.max(0, FICA_2026.socialSecurityWageBase - Math.max(0, baseSalary));
  const socialSecurity = Math.min(gross, ssRemaining) * FICA_2026.socialSecurityRate;

  const medicare = gross * FICA_2026.medicareRate;

  const totalWages = Math.max(0, baseSalary) + gross;
  const threshold = FICA_2026.additionalMedicareWithholdingThreshold;
  const addlBase = Math.max(0, totalWages - Math.max(threshold, Math.max(0, baseSalary)));
  const additionalMedicare = addlBase * FICA_2026.additionalMedicareRate;

  const state = getStateByCode(stateCode);
  let stateRate = 0;
  let stateRateIsEstimate = false;

  if (state?.hasIncomeTax) {
    if (state.supplementalRate !== undefined) {
      stateRate = state.supplementalRate;
    } else if (state.flatRate !== undefined) {
      stateRate = state.flatRate;
    } else {
      // 공표 요율이 없으면 기본급 기준 한계세율로 근사한다
      const brackets = stateBracketsFor(state, filingStatus);
      stateRate = brackets ? marginalRate(Math.max(0, baseSalary), brackets) : 0;
      stateRateIsEstimate = true;
    }
  }

  const stateTax = gross * stateRate;
  const totalWithheld = federal + socialSecurity + medicare + additionalMedicare + stateTax;

  return {
    bonus: gross,
    federal,
    socialSecurity,
    medicare,
    additionalMedicare,
    stateTax,
    stateRateIsEstimate,
    stateRate,
    totalWithheld,
    net: gross - totalWithheld,
    effectiveRate: gross > 0 ? totalWithheld / gross : 0,
  };
}
