import {
  FEDERAL_STANDARD_DEDUCTION_2026,
  federalIncomeTax,
  marginalRate,
  FEDERAL_BRACKETS_2026,
} from "./federal";
import { additionalMedicareTax, medicareTax, socialSecurityTax } from "./fica";
import { calculateStateTax } from "./state";
import { getStateByCode } from "@/data/states";
import type { LineItem, TaxInput, TaxResult } from "./types";
import { PERIODS_PER_YEAR } from "./types";

function lineItem(
  key: string,
  label: string,
  annual: number,
  periods: number,
  grossAnnual: number,
  description?: string,
): LineItem {
  return {
    key,
    label,
    annual,
    perPeriod: annual / periods,
    shareOfGross: grossAnnual > 0 ? annual / grossAnnual : 0,
    description,
  };
}

/**
 * 급여 명세 한 회차를 세목별로 분해한다.
 *
 * 접근 방식: 회차 금액을 연간으로 환산 → 연간 세액을 계산 → 다시 회차로 나눈다.
 * IRS Publication 15-T 의 percentage method 를 그대로 구현하지 않고 연간 세액을
 * 균등 배분하는 방식으로, W-4 설정에 따른 실제 원천징수액과는 차이가 날 수 있다.
 * 이 근사의 한계는 Methodology 섹션에 명시한다.
 */
export function calculatePaycheck(input: TaxInput): TaxResult {
  const periods = PERIODS_PER_YEAR[input.payFrequency];
  const grossAnnual = Math.max(0, input.grossPerPeriod) * periods;

  const retirement401k = Math.max(0, input.retirement401kPerPeriod ?? 0) * periods;
  const preTaxBenefits = Math.max(0, input.preTaxBenefitsPerPeriod ?? 0) * periods;
  const postTaxDeductions = Math.max(0, input.postTaxDeductionsPerPeriod ?? 0) * periods;
  const dependents = Math.max(0, input.dependents ?? 0);

  // 401(k) 는 소득세는 이연되지만 FICA 는 부과된다. Section 125 복리후생은 둘 다 면제.
  const ficaWages = Math.max(0, grossAnnual - preTaxBenefits);

  const federalTaxable = Math.max(
    0,
    grossAnnual - retirement401k - preTaxBenefits - FEDERAL_STANDARD_DEDUCTION_2026[input.filingStatus],
  );

  const federalTax = federalIncomeTax(federalTaxable, input.filingStatus);
  const ss = socialSecurityTax(ficaWages);
  const medicare = medicareTax(ficaWages);
  const addlMedicare = additionalMedicareTax(ficaWages);

  const state = getStateByCode(input.stateCode);
  const stateResult = state
    ? calculateStateTax({
        state,
        status: input.filingStatus,
        grossAnnual,
        retirement401k,
        preTaxBenefits,
        dependents,
        localTaxKey: input.localTaxKey,
      })
    : { taxableIncome: 0, incomeTax: 0, marginalRate: 0, localTax: 0, payroll: [] };

  const statePayrollTotal = stateResult.payroll.reduce((sum, p) => sum + p.amount, 0);

  const totalTaxAnnual =
    federalTax + ss + medicare + addlMedicare + stateResult.incomeTax + stateResult.localTax + statePayrollTotal;

  const takeHomeAnnual = grossAnnual - totalTaxAnnual - retirement401k - preTaxBenefits - postTaxDeductions;

  const li = (key: string, label: string, annual: number, description?: string) =>
    lineItem(key, label, annual, periods, grossAnnual, description);

  return {
    grossAnnual,
    grossPerPeriod: grossAnnual / periods,
    periodsPerYear: periods,

    federalTaxableIncome: federalTaxable,
    stateTaxableIncome: stateResult.taxableIncome,

    federal: li("federal", "Federal income tax", federalTax),
    socialSecurity: li("social-security", "Social Security", ss),
    medicare: li("medicare", "Medicare", medicare),
    additionalMedicare: li("additional-medicare", "Additional Medicare", addlMedicare),
    stateIncome: li("state-income", state ? `${state.name} income tax` : "State income tax", stateResult.incomeTax),
    localIncome: li("local-income", "Local income tax", stateResult.localTax),
    statePayroll: stateResult.payroll.map((p) => li(p.item.key, p.item.label, p.amount, p.item.description)),
    preTaxDeductions: li("pre-tax", "Pre-tax deductions", retirement401k + preTaxBenefits),
    postTaxDeductions: li("post-tax", "Post-tax deductions", postTaxDeductions),

    totalTaxAnnual,
    totalTaxPerPeriod: totalTaxAnnual / periods,

    takeHomeAnnual,
    takeHomePerPeriod: takeHomeAnnual / periods,

    effectiveTaxRate: grossAnnual > 0 ? totalTaxAnnual / grossAnnual : 0,
    marginalFederalRate: marginalRate(federalTaxable, FEDERAL_BRACKETS_2026[input.filingStatus]),
    takeHomeRate: grossAnnual > 0 ? takeHomeAnnual / grossAnnual : 0,
  };
}
