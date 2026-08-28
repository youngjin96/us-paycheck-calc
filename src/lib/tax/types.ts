export const FILING_STATUSES = [
  "single",
  "married",
  "marriedSeparately",
  "headOfHousehold",
] as const;

export type FilingStatus = (typeof FILING_STATUSES)[number];

export const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: "Single",
  married: "Married filing jointly",
  marriedSeparately: "Married filing separately",
  headOfHousehold: "Head of household",
};

export const PAY_FREQUENCIES = [
  "annual",
  "monthly",
  "semimonthly",
  "biweekly",
  "weekly",
] as const;

export type PayFrequency = (typeof PAY_FREQUENCIES)[number];

/** 연간 급여 지급 횟수. 연봉 → 회차별 금액 환산의 기준. */
export const PERIODS_PER_YEAR: Record<PayFrequency, number> = {
  annual: 1,
  monthly: 12,
  semimonthly: 24,
  biweekly: 26,
  weekly: 52,
};

export const PAY_FREQUENCY_LABELS: Record<PayFrequency, string> = {
  annual: "Annually",
  monthly: "Monthly",
  semimonthly: "Semi-monthly (24×)",
  biweekly: "Bi-weekly (26×)",
  weekly: "Weekly (52×)",
};

/**
 * 누진세 구간. `upTo` 는 이 구간의 **상한**(포함)이고, 최상위 구간은 null.
 * 반드시 오름차순으로 정렬되어 있어야 한다.
 */
export type Bracket = {
  rate: number;
  upTo: number | null;
};

/** 급여에서 원천징수되는 주(state) 단위 항목 — SDI, PFL, UI 등. */
export type PayrollItem = {
  key: string;
  label: string;
  /** 소수 비율. 1.3% → 0.013 */
  rate: number;
  /** 과세 상한 임금. null 이면 무제한 */
  wageBase: number | null;
  /** 연간 납부 상한액(있는 경우). wageBase 와 함께 쓰이면 더 작은 쪽이 적용된다. */
  maxAnnual?: number;
  description: string;
};

/**
 * 지역(시·카운티) 소득세.
 *
 * 지자체마다 과세표준이 다르다는 점이 중요하다.
 * - `gross`        : 총급여에 그대로 부과 (필라델피아 Wage Tax, PA EIT)
 * - `stateTaxable` : 주 과세표준에 부과 (NYC)
 * - `stateTax`     : 주 소득세액에 대한 부가세 (용커스)
 */
export type LocalTax = {
  key: string;
  label: string;
  base: "gross" | "stateTaxable" | "stateTax";
  flatRate: number;
  description: string;
};

export type StateTax = {
  /** 2자리 우편 약어 */
  code: string;
  name: string;
  /** URL 세그먼트 — /paycheck/<slug>/ */
  slug: string;
  hasIncomeTax: boolean;
  /** 단일세율 주 */
  flatRate?: number;
  /** 누진세율 주 */
  brackets?: Record<FilingStatus, Bracket[]>;
  standardDeduction?: Partial<Record<FilingStatus, number>>;
  /** 과세표준에서 빼는 인적공제 (IL, NJ 방식) */
  exemptionDeduction?: Partial<Record<FilingStatus, number>>;
  /** 산출세액에서 빼는 인적공제 세액공제 (CA, NY 방식) */
  exemptionCredit?: Partial<Record<FilingStatus, number>>;
  /** 부양가족 1인당 추가 공제/세액공제 */
  perDependentCredit?: number;
  perDependentDeduction?: number;
  /**
   * 401(k) 등 세전 은퇴 기여를 주 소득세에서 공제해주지 **않는** 주.
   * 펜실베이니아가 대표적으로, 기여 시점에 과세한다.
   */
  taxes401kContributions?: boolean;
  /**
   * 보너스 등 추가급여(supplemental wages)에 적용하는 정률 원천징수율.
   * 별도 요율을 공표하지 않는 주는 undefined 로 두고, 일반 한계세율로 근사한다.
   */
  supplementalRate?: number;
  payrollItems: PayrollItem[];
  localTaxes?: LocalTax[];
};

export type TaxInput = {
  /** 급여 지급 회차당 총급여 */
  grossPerPeriod: number;
  payFrequency: PayFrequency;
  filingStatus: FilingStatus;
  stateCode: string;
  /** 선택한 지역세 key (예: "nyc") */
  localTaxKey?: string;
  /** 401(k) 등 세전 은퇴 기여 — 연방/주 소득세는 면제, FICA 는 과세 */
  retirement401kPerPeriod?: number;
  /** 건강보험료·HSA·FSA 등 Section 125 세전 공제 — 소득세·FICA 모두 면제 */
  preTaxBenefitsPerPeriod?: number;
  /** 세후 공제 (Roth 401k, 노조회비 등) */
  postTaxDeductionsPerPeriod?: number;
  /** 부양가족 수 */
  dependents?: number;
};

export type LineItem = {
  key: string;
  label: string;
  annual: number;
  perPeriod: number;
  /** 총급여 대비 비율 */
  shareOfGross: number;
  description?: string;
};

export type TaxResult = {
  grossAnnual: number;
  grossPerPeriod: number;
  periodsPerYear: number;

  federalTaxableIncome: number;
  stateTaxableIncome: number;

  federal: LineItem;
  socialSecurity: LineItem;
  medicare: LineItem;
  additionalMedicare: LineItem;
  stateIncome: LineItem;
  localIncome: LineItem;
  statePayroll: LineItem[];
  preTaxDeductions: LineItem;
  postTaxDeductions: LineItem;

  /** 세금 합계 (공제 제외) */
  totalTaxAnnual: number;
  totalTaxPerPeriod: number;

  takeHomeAnnual: number;
  takeHomePerPeriod: number;

  /** 총급여 대비 실효세율 */
  effectiveTaxRate: number;
  /** 연방 소득세 최고 한계세율 */
  marginalFederalRate: number;
  /** 총급여 대비 실수령 비율 */
  takeHomeRate: number;
};
