import type { StateTax } from "@/lib/tax/types";

/**
 * 2026 과세연도 주별 세금 설정.
 *
 * 출처와 검증 상태는 DATA-SOURCES.md 에 정리되어 있다.
 * 새 주를 추가할 때는 반드시 해당 주 Department of Revenue 의
 * 원천징수 표를 1차 출처로 확인할 것.
 *
 * 누진세 주의 headOfHousehold / marriedSeparately 는 별도 표를 두지 않고
 * single 표를 사용한다(주별로 HoH 표가 없거나 single 과 동일한 경우가 많다).
 * 이 근사는 각 주 페이지의 Methodology 에 명시한다.
 */
export const STATES: StateTax[] = [
  {
    code: "CA",
    name: "California",
    slug: "california",
    hasIncomeTax: true,
    brackets: {
      single: [
        { rate: 0.01, upTo: 11_079 },
        { rate: 0.02, upTo: 26_264 },
        { rate: 0.04, upTo: 41_452 },
        { rate: 0.06, upTo: 57_542 },
        { rate: 0.08, upTo: 72_724 },
        { rate: 0.093, upTo: 371_479 },
        { rate: 0.103, upTo: 445_771 },
        { rate: 0.113, upTo: 742_953 },
        { rate: 0.123, upTo: 1_000_000 },
        { rate: 0.133, upTo: null },
      ],
      married: [
        { rate: 0.01, upTo: 22_158 },
        { rate: 0.02, upTo: 52_528 },
        { rate: 0.04, upTo: 82_904 },
        { rate: 0.06, upTo: 115_084 },
        { rate: 0.08, upTo: 145_448 },
        { rate: 0.093, upTo: 742_958 },
        { rate: 0.103, upTo: 891_542 },
        { rate: 0.113, upTo: 1_485_906 },
        { rate: 0.123, upTo: 2_000_000 },
        { rate: 0.133, upTo: null },
      ],
      marriedSeparately: [],
      headOfHousehold: [],
    },
    standardDeduction: { single: 5_706, married: 11_412, marriedSeparately: 5_706, headOfHousehold: 11_412 },
    exemptionCredit: { single: 153, married: 306, marriedSeparately: 153, headOfHousehold: 153 },
    supplementalRate: 0.1023,
    perDependentCredit: 475,
    payrollItems: [
      {
        key: "ca-sdi",
        label: "CA SDI",
        rate: 0.013,
        wageBase: null,
        description:
          "State Disability Insurance. SB 951 로 2024년부터 임금 상한이 없어져, 소득이 아무리 높아도 전액에 부과된다.",
      },
    ],
  },
  {
    code: "TX",
    name: "Texas",
    slug: "texas",
    hasIncomeTax: false,
    payrollItems: [],
  },
  {
    code: "NY",
    name: "New York",
    slug: "new-york",
    hasIncomeTax: true,
    brackets: {
      single: [
        { rate: 0.039, upTo: 8_500 },
        { rate: 0.044, upTo: 11_700 },
        { rate: 0.0515, upTo: 13_900 },
        { rate: 0.054, upTo: 80_650 },
        { rate: 0.059, upTo: 215_400 },
        { rate: 0.0685, upTo: 1_077_550 },
        { rate: 0.0965, upTo: 5_000_000 },
        { rate: 0.103, upTo: 25_000_000 },
        { rate: 0.109, upTo: null },
      ],
      married: [
        { rate: 0.039, upTo: 17_150 },
        { rate: 0.044, upTo: 23_600 },
        { rate: 0.0515, upTo: 27_900 },
        { rate: 0.054, upTo: 161_550 },
        { rate: 0.059, upTo: 323_200 },
        { rate: 0.0685, upTo: 2_155_350 },
        { rate: 0.0965, upTo: 5_000_000 },
        { rate: 0.103, upTo: 25_000_000 },
        { rate: 0.109, upTo: null },
      ],
      marriedSeparately: [],
      headOfHousehold: [],
    },
    standardDeduction: { single: 8_000, married: 16_050, marriedSeparately: 8_000, headOfHousehold: 11_200 },
    supplementalRate: 0.117,
    payrollItems: [
      {
        key: "ny-pfl",
        label: "NY Paid Family Leave",
        rate: 0.00432,
        wageBase: null,
        maxAnnual: 411.91,
        description:
          "주 평균 주급(NYSAWW)에 연동된 상한이 있어, 연 $411.91 를 넘지 않는다.",
      },
    ],
    localTaxes: [
      {
        key: "nyc",
        label: "New York City",
        base: "stateTaxable",
        flatRate: 0.03876,
        description:
          "NYC 거주자에게 부과되는 시 소득세. 실제로는 3.078%~3.876% 누진이며, 여기서는 보수적으로 최고 구간 세율을 적용한다.",
      },
      {
        key: "yonkers",
        label: "Yonkers",
        base: "stateTax",
        flatRate: 0.1675,
        description: "용커스 거주자 부가세. 뉴욕주 소득세액의 16.75% 가 추가된다.",
      },
    ],
  },
  {
    code: "FL",
    name: "Florida",
    slug: "florida",
    hasIncomeTax: false,
    payrollItems: [],
  },
  {
    code: "IL",
    name: "Illinois",
    slug: "illinois",
    hasIncomeTax: true,
    flatRate: 0.0495,
    supplementalRate: 0.0495,
    exemptionDeduction: { single: 2_925, married: 5_850, marriedSeparately: 2_925, headOfHousehold: 2_925 },
    perDependentDeduction: 2_925,
    payrollItems: [],
  },
  {
    code: "WA",
    name: "Washington",
    slug: "washington",
    hasIncomeTax: false,
    payrollItems: [
      {
        key: "wa-pfml",
        label: "WA Paid Family & Medical Leave",
        // 총 보험료 1.13% 중 근로자 부담 71.43%
        rate: 0.0080716,
        wageBase: 184_500,
        description:
          "2026년 총 요율이 0.92% → 1.13% 로 올랐다. 근로자가 71.43% 를 부담하며, 사회보장세와 같은 임금 상한이 적용된다.",
      },
      {
        key: "wa-cares",
        label: "WA Cares Fund",
        rate: 0.0058,
        wageBase: null,
        description:
          "장기요양보험. 전액 근로자 부담이며 임금 상한이 없다. 면제 승인을 받은 근로자는 제외된다.",
      },
    ],
  },
  {
    code: "NJ",
    name: "New Jersey",
    slug: "new-jersey",
    hasIncomeTax: true,
    brackets: {
      single: [
        { rate: 0.014, upTo: 20_000 },
        { rate: 0.0175, upTo: 35_000 },
        { rate: 0.035, upTo: 40_000 },
        { rate: 0.05525, upTo: 75_000 },
        { rate: 0.0637, upTo: 500_000 },
        { rate: 0.0897, upTo: 1_000_000 },
        { rate: 0.1075, upTo: null },
      ],
      married: [
        { rate: 0.014, upTo: 20_000 },
        { rate: 0.0175, upTo: 50_000 },
        { rate: 0.0245, upTo: 70_000 },
        { rate: 0.035, upTo: 80_000 },
        { rate: 0.05525, upTo: 150_000 },
        { rate: 0.0637, upTo: 500_000 },
        { rate: 0.0897, upTo: 1_000_000 },
        { rate: 0.1075, upTo: null },
      ],
      marriedSeparately: [],
      headOfHousehold: [],
    },
    exemptionDeduction: { single: 1_000, married: 2_000, marriedSeparately: 1_000, headOfHousehold: 1_000 },
    perDependentDeduction: 1_500,
    payrollItems: [
      {
        key: "nj-ui",
        label: "NJ UI / WF / SWF",
        rate: 0.00425,
        wageBase: 44_800,
        description:
          "실업보험·인력개발기금·보충인력기금 근로자 부담분. 임금 상한이 $44,800 로 낮아 중간소득 이상에서는 금방 상한에 걸린다.",
      },
      {
        key: "nj-tdi",
        label: "NJ Temporary Disability",
        rate: 0.0019,
        wageBase: 171_100,
        description: "2026년 요율이 0.23% → 0.19% 로 인하됐다.",
      },
      {
        key: "nj-fli",
        label: "NJ Family Leave Insurance",
        rate: 0.0023,
        wageBase: 171_100,
        description: "2026년 요율이 0.33% → 0.23% 로 인하됐다.",
      },
    ],
  },
  {
    code: "PA",
    name: "Pennsylvania",
    slug: "pennsylvania",
    hasIncomeTax: true,
    flatRate: 0.0307,
    supplementalRate: 0.0307,
    // PA 는 401(k) 기여금을 기여 시점에 과세한다 — 연방과 다른 드문 케이스
    taxes401kContributions: true,
    payrollItems: [
      {
        key: "pa-uc",
        label: "PA Unemployment Compensation",
        rate: 0.0007,
        wageBase: null,
        description: "펜실베이니아는 드물게 근로자에게도 실업보험료를 부과한다. 임금 상한이 없다.",
      },
    ],
    localTaxes: [
      {
        key: "philadelphia",
        label: "Philadelphia",
        base: "gross",
        // 2026-07-01 부로 인하 (직전 3.74%). 5년 감세 계획에 따라 3.70% 까지 내려간다
        flatRate: 0.03735,
        description: "필라델피아 거주자 Wage Tax (2026-07-01 시행). 비거주자는 3.425% 가 적용된다.",
      },
      {
        key: "pa-eit-1",
        label: "Typical suburban EIT (1%)",
        base: "gross",
        flatRate: 0.01,
        description:
          "필라델피아 외 대부분의 시·학군은 1% 안팎의 Earned Income Tax 를 부과한다. 정확한 요율은 거주 지자체에 따라 다르다.",
      },
    ],
  },
];

export const STATES_BY_CODE: Record<string, StateTax> = Object.fromEntries(
  STATES.map((s) => [s.code, s]),
);

export const STATES_BY_SLUG: Record<string, StateTax> = Object.fromEntries(
  STATES.map((s) => [s.slug, s]),
);

export const NO_INCOME_TAX_STATES = STATES.filter((s) => !s.hasIncomeTax);

export function getStateByCode(code: string): StateTax | undefined {
  return STATES_BY_CODE[code.toUpperCase()];
}

export function getStateBySlug(slug: string): StateTax | undefined {
  return STATES_BY_SLUG[slug];
}
