import type { Bracket, FilingStatus } from "./types";

/**
 * 2026 과세연도 연방 소득세 구간 — IRS Rev. Proc. 2025-32.
 * `upTo` 는 해당 구간의 과세표준 상한.
 */
export const FEDERAL_BRACKETS_2026: Record<FilingStatus, Bracket[]> = {
  single: [
    { rate: 0.1, upTo: 12_400 },
    { rate: 0.12, upTo: 50_400 },
    { rate: 0.22, upTo: 105_700 },
    { rate: 0.24, upTo: 201_775 },
    { rate: 0.32, upTo: 256_225 },
    { rate: 0.35, upTo: 640_600 },
    { rate: 0.37, upTo: null },
  ],
  married: [
    { rate: 0.1, upTo: 24_800 },
    { rate: 0.12, upTo: 100_800 },
    { rate: 0.22, upTo: 211_400 },
    { rate: 0.24, upTo: 403_550 },
    { rate: 0.32, upTo: 512_450 },
    { rate: 0.35, upTo: 768_700 },
    { rate: 0.37, upTo: null },
  ],
  marriedSeparately: [
    { rate: 0.1, upTo: 12_400 },
    { rate: 0.12, upTo: 50_400 },
    { rate: 0.22, upTo: 105_700 },
    { rate: 0.24, upTo: 201_775 },
    { rate: 0.32, upTo: 256_225 },
    { rate: 0.35, upTo: 384_350 },
    { rate: 0.37, upTo: null },
  ],
  headOfHousehold: [
    { rate: 0.1, upTo: 17_700 },
    { rate: 0.12, upTo: 67_450 },
    { rate: 0.22, upTo: 105_700 },
    { rate: 0.24, upTo: 201_775 },
    { rate: 0.32, upTo: 256_200 },
    { rate: 0.35, upTo: 640_600 },
    { rate: 0.37, upTo: null },
  ],
};

/** 2026 표준공제 — IRS Rev. Proc. 2025-32. */
export const FEDERAL_STANDARD_DEDUCTION_2026: Record<FilingStatus, number> = {
  single: 16_100,
  married: 32_200,
  marriedSeparately: 16_100,
  headOfHousehold: 24_150,
};

export const TAX_YEAR = 2026;

/**
 * 누진 구간에 따른 세액. 과세표준이 음수면 0.
 * 구간별로 "그 구간에 들어간 금액 × 그 구간 세율" 을 누적한다.
 */
export function taxFromBrackets(taxableIncome: number, brackets: Bracket[]): number {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  let lowerBound = 0;

  for (const bracket of brackets) {
    const upperBound = bracket.upTo ?? Infinity;
    if (taxableIncome <= lowerBound) break;

    const amountInBracket = Math.min(taxableIncome, upperBound) - lowerBound;
    tax += amountInBracket * bracket.rate;
    lowerBound = upperBound;
  }

  return tax;
}

/** 과세표준이 속한 최고 구간의 세율. */
export function marginalRate(taxableIncome: number, brackets: Bracket[]): number {
  if (taxableIncome <= 0) return brackets[0].rate;

  let lowerBound = 0;
  for (const bracket of brackets) {
    const upperBound = bracket.upTo ?? Infinity;
    if (taxableIncome > lowerBound && taxableIncome <= upperBound) return bracket.rate;
    lowerBound = upperBound;
  }
  return brackets[brackets.length - 1].rate;
}

export function federalIncomeTax(taxableIncome: number, status: FilingStatus): number {
  return taxFromBrackets(taxableIncome, FEDERAL_BRACKETS_2026[status]);
}
