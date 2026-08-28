import Link from "next/link";
import { STATES } from "@/data/states";
import { calculatePaycheck } from "@/lib/tax/calculate";
import { formatCurrency, formatPercent } from "@/lib/tax/format";
import type { FilingStatus } from "@/lib/tax/types";

/**
 * 빌드 타임에 실제 계산 엔진을 돌려 주별 실수령액을 비교한다.
 * 하드코딩한 표가 아니라 계산 결과이므로 세율 데이터를 갱신하면 함께 바뀐다.
 */
export default function StateComparison({
  salary = 100_000,
  filingStatus = "single",
  highlightCode,
}: {
  salary?: number;
  filingStatus?: FilingStatus;
  highlightCode?: string;
}) {
  const rows = STATES.map((state) => {
    const result = calculatePaycheck({
      grossPerPeriod: salary,
      payFrequency: "annual",
      filingStatus,
      stateCode: state.code,
    });
    return { state, result };
  }).sort((a, b) => b.result.takeHomeAnnual - a.result.takeHomeAnnual);

  const best = rows[0].result.takeHomeAnnual;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-[14px]">
        <caption className="sr-only">
          Estimated annual take-home pay on a {formatCurrency(salary)} salary by state
        </caption>
        <thead>
          <tr className="border-b border-border text-left text-[12px] uppercase tracking-wide text-text-faint">
            <th scope="col" className="py-2 font-medium">State</th>
            <th scope="col" className="py-2 text-right font-medium">Take-home</th>
            <th scope="col" className="py-2 text-right font-medium">Effective rate</th>
            <th scope="col" className="py-2 text-right font-medium">vs. best</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ state, result }) => {
            const gap = result.takeHomeAnnual - best;
            const highlighted = state.code === highlightCode;
            return (
              <tr
                key={state.code}
                className={`border-b border-border/60 ${highlighted ? "bg-accent-soft" : ""}`}
              >
                <th scope="row" className="py-2.5 text-left font-normal">
                  <Link href={`/paycheck/${state.slug}/`} className="transition hover:text-accent">
                    {state.name}
                  </Link>
                  {!state.hasIncomeTax && (
                    <span className="ml-2 rounded-full bg-bg-subtle px-1.5 py-0.5 text-[11px] text-text-faint">
                      no income tax
                    </span>
                  )}
                </th>
                <td className="py-2.5 text-right font-medium tnum">{formatCurrency(result.takeHomeAnnual)}</td>
                <td className="py-2.5 text-right tnum text-text-muted">
                  {formatPercent(result.effectiveTaxRate, 1)}
                </td>
                <td className="py-2.5 text-right tnum text-text-muted">
                  {gap === 0 ? "—" : formatCurrency(gap)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
