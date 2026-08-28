import { marginalRate, taxFromBrackets } from "./federal";
import type { Bracket, FilingStatus, LocalTax, PayrollItem, StateTax } from "./types";

/**
 * 주별 누진세 표. 대부분의 주는 부부개별/세대주 표를 따로 두지 않거나
 * single 표와 동일하므로, 비어 있으면 single 표로 대체한다.
 * (이 근사는 각 페이지 Methodology 에 명시한다.)
 */
export function stateBracketsFor(state: StateTax, status: FilingStatus): Bracket[] | undefined {
  if (!state.brackets) return undefined;
  const own = state.brackets[status];
  if (own && own.length > 0) return own;
  return status === "married" ? state.brackets.married : state.brackets.single;
}

export type StateTaxBreakdown = {
  taxableIncome: number;
  incomeTax: number;
  marginalRate: number;
  localTax: number;
  payroll: { item: PayrollItem; amount: number }[];
};

export type StateTaxArgs = {
  state: StateTax;
  status: FilingStatus;
  grossAnnual: number;
  /** 401(k) 등 세전 은퇴 기여 (연간) */
  retirement401k: number;
  /** Section 125 세전 복리후생 (연간) */
  preTaxBenefits: number;
  dependents: number;
  localTaxKey?: string;
};

/** 임금 상한과 연간 납부 상한을 모두 반영한 주 급여공제 항목 계산. */
export function payrollItemAmount(item: PayrollItem, grossAnnual: number): number {
  const base = item.wageBase === null ? grossAnnual : Math.min(grossAnnual, item.wageBase);
  const amount = base * item.rate;
  return item.maxAnnual !== undefined ? Math.min(amount, item.maxAnnual) : amount;
}

function localTaxAmount(
  local: LocalTax,
  { grossAnnual, stateTaxable, stateIncomeTax }: { grossAnnual: number; stateTaxable: number; stateIncomeTax: number },
): number {
  switch (local.base) {
    case "gross":
      return grossAnnual * local.flatRate;
    case "stateTaxable":
      return Math.max(0, stateTaxable) * local.flatRate;
    case "stateTax":
      return stateIncomeTax * local.flatRate;
  }
}

export function calculateStateTax(args: StateTaxArgs): StateTaxBreakdown {
  const { state, status, grossAnnual, retirement401k, preTaxBenefits, dependents, localTaxKey } = args;

  const payroll = state.payrollItems.map((item) => ({
    item,
    amount: payrollItemAmount(item, grossAnnual),
  }));

  if (!state.hasIncomeTax) {
    return { taxableIncome: 0, incomeTax: 0, marginalRate: 0, localTax: 0, payroll };
  }

  // 세전 공제 반영. PA 처럼 401(k) 기여를 과세하는 주는 그 부분을 빼지 않는다.
  const deductible401k = state.taxes401kContributions ? 0 : retirement401k;
  let taxable = grossAnnual - deductible401k - preTaxBenefits;

  taxable -= state.standardDeduction?.[status] ?? 0;
  taxable -= state.exemptionDeduction?.[status] ?? 0;
  taxable -= dependents * (state.perDependentDeduction ?? 0);
  taxable = Math.max(0, taxable);

  const brackets = stateBracketsFor(state, status);
  let incomeTax = 0;
  let rate = 0;

  if (brackets) {
    incomeTax = taxFromBrackets(taxable, brackets);
    rate = marginalRate(taxable, brackets);
  } else if (state.flatRate !== undefined) {
    incomeTax = taxable * state.flatRate;
    rate = state.flatRate;
  }

  // 세액공제는 산출세액에서 차감하되 0 아래로 내려가지 않는다
  const credits = (state.exemptionCredit?.[status] ?? 0) + dependents * (state.perDependentCredit ?? 0);
  incomeTax = Math.max(0, incomeTax - credits);

  const local = state.localTaxes?.find((l) => l.key === localTaxKey);
  const localTax = local
    ? localTaxAmount(local, { grossAnnual, stateTaxable: taxable, stateIncomeTax: incomeTax })
    : 0;

  return { taxableIncome: taxable, incomeTax, marginalRate: rate, localTax, payroll };
}
