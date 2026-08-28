import type { FilingStatus } from "./types";

/**
 * 2026 FICA 상수.
 *
 * 주의: Additional Medicare Tax 의 **원천징수** 기준은 필링 상태와 무관하게
 * $200,000 이다 (고용주는 배우자 소득을 모르기 때문). 실제 확정 신고 시에는
 * 부부합산 $250,000 / 부부개별 $125,000 기준으로 정산된다.
 */
export const FICA_2026 = {
  socialSecurityRate: 0.062,
  socialSecurityWageBase: 184_500,
  medicareRate: 0.0145,
  additionalMedicareRate: 0.009,
  additionalMedicareWithholdingThreshold: 200_000,
  /** 확정 신고 기준 임계값 — 참고용 표시에 쓴다 */
  additionalMedicareFilingThreshold: {
    single: 200_000,
    married: 250_000,
    marriedSeparately: 125_000,
    headOfHousehold: 200_000,
  } as Record<FilingStatus, number>,
} as const;

export function socialSecurityTax(ficaWages: number): number {
  return Math.max(0, Math.min(ficaWages, FICA_2026.socialSecurityWageBase)) * FICA_2026.socialSecurityRate;
}

export function medicareTax(ficaWages: number): number {
  return Math.max(0, ficaWages) * FICA_2026.medicareRate;
}

/** 원천징수 기준(단일 $200k)으로 계산한 추가 메디케어세. */
export function additionalMedicareTax(ficaWages: number): number {
  const excess = ficaWages - FICA_2026.additionalMedicareWithholdingThreshold;
  return excess > 0 ? excess * FICA_2026.additionalMedicareRate : 0;
}
