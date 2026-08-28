import { describe, expect, it } from "vitest";
import { calculatePaycheck } from "./calculate";
import { federalIncomeTax } from "./federal";
import type { TaxInput } from "./types";

/** 연봉 기준 기본 입력 — 테스트마다 필요한 부분만 덮어쓴다. */
function annual(gross: number, overrides: Partial<TaxInput> = {}): TaxInput {
  return {
    grossPerPeriod: gross,
    payFrequency: "annual",
    filingStatus: "single",
    stateCode: "TX",
    ...overrides,
  };
}

const cents = (n: number) => Math.round(n * 100) / 100;

describe("연방 소득세", () => {
  it("단독 신고 $100k — 구간별로 손계산한 값과 일치한다", () => {
    // 과세표준 100,000 - 16,100 = 83,900
    //   10% × 12,400            =  1,240
    //   12% × (50,400-12,400)   =  4,560
    //   22% × (83,900-50,400)   =  7,370
    expect(federalIncomeTax(83_900, "single")).toBeCloseTo(13_170, 6);
  });

  it("표준공제보다 적게 벌면 세금이 0 이다", () => {
    expect(federalIncomeTax(0, "single")).toBe(0);
    expect(calculatePaycheck(annual(12_000)).federal.annual).toBe(0);
  });

  it("부부합산은 같은 소득에서 단독보다 세금이 적다", () => {
    const single = calculatePaycheck(annual(150_000, { filingStatus: "single" }));
    const married = calculatePaycheck(annual(150_000, { filingStatus: "married" }));
    expect(married.federal.annual).toBeLessThan(single.federal.annual);
  });
});

describe("FICA", () => {
  it("$100k — 사회보장세 6.2%, 메디케어 1.45%", () => {
    const r = calculatePaycheck(annual(100_000));
    expect(r.socialSecurity.annual).toBeCloseTo(6_200, 6);
    expect(r.medicare.annual).toBeCloseTo(1_450, 6);
    expect(r.additionalMedicare.annual).toBe(0);
  });

  it("사회보장세는 2026 임금 상한 $184,500 에서 멈춘다", () => {
    const r = calculatePaycheck(annual(250_000));
    expect(r.socialSecurity.annual).toBeCloseTo(184_500 * 0.062, 6); // 11,439
    expect(r.medicare.annual).toBeCloseTo(250_000 * 0.0145, 6); // 상한 없음
  });

  it("$200k 초과분에 추가 메디케어세 0.9% 가 붙는다", () => {
    expect(calculatePaycheck(annual(200_000)).additionalMedicare.annual).toBe(0);
    expect(calculatePaycheck(annual(250_000)).additionalMedicare.annual).toBeCloseTo(450, 6);
  });
});

describe("세전 공제의 서로 다른 취급", () => {
  it("401(k) 는 소득세만 줄이고 FICA 는 줄이지 않는다", () => {
    const base = calculatePaycheck(annual(100_000));
    const with401k = calculatePaycheck(annual(100_000, { retirement401kPerPeriod: 10_000 }));

    expect(with401k.federal.annual).toBeLessThan(base.federal.annual);
    expect(with401k.socialSecurity.annual).toBeCloseTo(base.socialSecurity.annual, 6);
    expect(with401k.medicare.annual).toBeCloseTo(base.medicare.annual, 6);
  });

  it("Section 125 복리후생은 소득세와 FICA 를 모두 줄인다", () => {
    const r = calculatePaycheck(annual(100_000, { preTaxBenefitsPerPeriod: 5_000 }));
    expect(r.socialSecurity.annual).toBeCloseTo(95_000 * 0.062, 6);
    expect(r.medicare.annual).toBeCloseTo(95_000 * 0.0145, 6);
    // 과세표준 100,000 - 5,000 - 16,100 = 78,900
    expect(r.federal.annual).toBeCloseTo(federalIncomeTax(78_900, "single"), 6);
  });
});

describe("주별 소득세", () => {
  it("텍사스는 주 소득세도 주 급여공제도 없다", () => {
    const r = calculatePaycheck(annual(100_000, { stateCode: "TX" }));
    expect(r.stateIncome.annual).toBe(0);
    expect(r.statePayroll).toHaveLength(0);
    // 실수령 = 총급여 - 연방 - SS - 메디케어
    expect(cents(r.takeHomeAnnual)).toBe(cents(100_000 - 13_170 - 6_200 - 1_450));
  });

  it("캘리포니아 단독 $100k — 손계산 $5,054.98 (인적 세액공제 $153 차감 후)", () => {
    // 과세표준 100,000 - 5,706(표준공제) = 94,294
    //   1%×11,079 + 2%×15,185 + 4%×15,188 + 6%×16,090 + 8%×15,182 + 9.3%×21,570
    //   = 5,207.98, 세액공제 153 차감 → 5,054.98
    const r = calculatePaycheck(annual(100_000, { stateCode: "CA" }));
    expect(r.stateIncome.annual).toBeCloseTo(5_054.98, 2);
  });

  it("일리노이는 인적공제 후 4.95% 정률", () => {
    const r = calculatePaycheck(annual(100_000, { stateCode: "IL" }));
    expect(r.stateIncome.annual).toBeCloseTo((100_000 - 2_925) * 0.0495, 6);
  });

  it("부양가족은 일리노이 인적공제를 늘려 세금을 줄인다", () => {
    const none = calculatePaycheck(annual(100_000, { stateCode: "IL" }));
    const two = calculatePaycheck(annual(100_000, { stateCode: "IL", dependents: 2 }));
    expect(two.stateIncome.annual).toBeCloseTo(none.stateIncome.annual - 2 * 2_925 * 0.0495, 6);
  });

  it("펜실베이니아는 401(k) 기여금을 공제해주지 않는다", () => {
    const pa = calculatePaycheck(annual(100_000, { stateCode: "PA", retirement401kPerPeriod: 10_000 }));
    // 401k 를 넣어도 과세표준은 총급여 그대로
    expect(pa.stateIncome.annual).toBeCloseTo(100_000 * 0.0307, 6);

    const il = calculatePaycheck(annual(100_000, { stateCode: "IL", retirement401kPerPeriod: 10_000 }));
    expect(il.stateIncome.annual).toBeCloseTo((100_000 - 10_000 - 2_925) * 0.0495, 6);
  });
});

describe("주 급여공제 항목", () => {
  it("캘리포니아 SDI 는 임금 상한이 없다", () => {
    const r = calculatePaycheck(annual(300_000, { stateCode: "CA" }));
    const sdi = r.statePayroll.find((p) => p.key === "ca-sdi");
    expect(sdi?.annual).toBeCloseTo(300_000 * 0.013, 6); // 3,900
  });

  it("뉴욕 PFL 은 연 $411.91 에서 상한에 걸린다", () => {
    const r = calculatePaycheck(annual(200_000, { stateCode: "NY" }));
    expect(r.statePayroll.find((p) => p.key === "ny-pfl")?.annual).toBeCloseTo(411.91, 2);
  });

  it("뉴저지 TDI 최대 부담액은 공표치 $325.09 와 일치한다", () => {
    const r = calculatePaycheck(annual(200_000, { stateCode: "NJ" }));
    expect(r.statePayroll.find((p) => p.key === "nj-tdi")?.annual).toBeCloseTo(325.09, 2);
    // UI 는 임금 상한이 $44,800 으로 훨씬 낮다
    expect(r.statePayroll.find((p) => p.key === "nj-ui")?.annual).toBeCloseTo(44_800 * 0.00425, 2);
  });

  it("워싱턴은 소득세가 없어도 PFML·WA Cares 가 빠진다", () => {
    const r = calculatePaycheck(annual(100_000, { stateCode: "WA" }));
    expect(r.stateIncome.annual).toBe(0);
    expect(r.statePayroll.map((p) => p.key)).toEqual(["wa-pfml", "wa-cares"]);
    expect(r.statePayroll.find((p) => p.key === "wa-cares")?.annual).toBeCloseTo(580, 6);
  });
});

describe("지역 소득세", () => {
  it("NYC 는 주 과세표준에 부과된다", () => {
    const withCity = calculatePaycheck(annual(100_000, { stateCode: "NY", localTaxKey: "nyc" }));
    expect(withCity.localIncome.annual).toBeCloseTo(withCity.stateTaxableIncome * 0.03876, 6);
  });

  it("용커스는 주 세액에 대한 부가세다", () => {
    const r = calculatePaycheck(annual(100_000, { stateCode: "NY", localTaxKey: "yonkers" }));
    expect(r.localIncome.annual).toBeCloseTo(r.stateIncome.annual * 0.1675, 6);
  });

  it("필라델피아 Wage Tax 는 공제 전 총급여에 부과된다", () => {
    const r = calculatePaycheck(
      annual(100_000, { stateCode: "PA", localTaxKey: "philadelphia", retirement401kPerPeriod: 10_000 }),
    );
    expect(r.localIncome.annual).toBeCloseTo(100_000 * 0.03735, 6);
  });

  it("지역세를 고르지 않으면 0 이다", () => {
    expect(calculatePaycheck(annual(100_000, { stateCode: "NY" })).localIncome.annual).toBe(0);
  });
});

describe("급여 주기", () => {
  it("격주 지급은 26 회차로 환산된다", () => {
    const r = calculatePaycheck({
      grossPerPeriod: 3_000,
      payFrequency: "biweekly",
      filingStatus: "single",
      stateCode: "TX",
    });
    expect(r.periodsPerYear).toBe(26);
    expect(r.grossAnnual).toBe(78_000);
    expect(r.takeHomePerPeriod).toBeCloseTo(r.takeHomeAnnual / 26, 6);
  });

  it("주기가 달라도 연간 세액은 같다", () => {
    const a = calculatePaycheck(annual(78_000));
    const b = calculatePaycheck({
      grossPerPeriod: 1_500,
      payFrequency: "weekly",
      filingStatus: "single",
      stateCode: "TX",
    });
    expect(b.grossAnnual).toBe(78_000);
    expect(b.totalTaxAnnual).toBeCloseTo(a.totalTaxAnnual, 6);
  });
});

describe("합계 정합성", () => {
  it("총급여 = 세금 + 공제 + 실수령", () => {
    const r = calculatePaycheck(
      annual(185_000, {
        stateCode: "CA",
        filingStatus: "married",
        retirement401kPerPeriod: 12_000,
        preTaxBenefitsPerPeriod: 4_800,
        postTaxDeductionsPerPeriod: 1_200,
        dependents: 2,
      }),
    );

    const sum =
      r.totalTaxAnnual + r.preTaxDeductions.annual + r.postTaxDeductions.annual + r.takeHomeAnnual;
    expect(cents(sum)).toBe(cents(r.grossAnnual));
  });

  it("소득이 0 이면 모든 값이 0 이고 NaN 이 생기지 않는다", () => {
    const r = calculatePaycheck(annual(0, { stateCode: "CA" }));
    expect(r.totalTaxAnnual).toBe(0);
    expect(r.takeHomeAnnual).toBe(0);
    expect(r.effectiveTaxRate).toBe(0);
    expect(Number.isNaN(r.takeHomeRate)).toBe(false);
  });
});
