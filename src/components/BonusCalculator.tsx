"use client";

import { useMemo, useState } from "react";
import { calculateBonus } from "@/lib/tax/bonus";
import { formatCurrency, formatPercent, formatRate } from "@/lib/tax/format";
import { STATES } from "@/data/states";
import { FILING_STATUSES, FILING_STATUS_LABELS, type FilingStatus } from "@/lib/tax/types";

const inputClass =
  "w-full rounded-[var(--radius-base)] border border-border bg-surface px-3 py-2.5 text-[15px] text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
const labelClass = "mb-1.5 block text-[13px] font-medium text-text-muted";

export default function BonusCalculator() {
  const [bonus, setBonus] = useState(10_000);
  const [baseSalary, setBaseSalary] = useState(85_000);
  const [stateCode, setStateCode] = useState("CA");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");

  const r = useMemo(
    () => calculateBonus({ bonus, baseSalary, stateCode, filingStatus }),
    [bonus, baseSalary, stateCode, filingStatus],
  );

  const rows = [
    { label: "Federal (supplemental rate)", value: r.federal },
    { label: "Social Security", value: r.socialSecurity },
    { label: "Medicare", value: r.medicare },
    ...(r.additionalMedicare > 0 ? [{ label: "Additional Medicare", value: r.additionalMedicare }] : []),
    ...(r.stateTax > 0
      ? [{ label: `State tax (${formatRate(r.stateRate)}${r.stateRateIsEstimate ? ", estimated" : ""})`, value: r.stateTax }]
      : []),
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8">
      <section aria-label="Bonus inputs" className="min-w-0 self-start rounded-xl border border-border bg-bg-subtle p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="bonus">Bonus amount</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint">$</span>
              <input
                id="bonus" type="number" min={0} step={500} inputMode="decimal"
                className={`${inputClass} pl-7 tnum`}
                value={bonus === 0 ? "" : bonus}
                onChange={(e) => setBonus(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="base">Annual base salary</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint">$</span>
              <input
                id="base" type="number" min={0} step={1000} inputMode="decimal"
                className={`${inputClass} pl-7 tnum`}
                value={baseSalary === 0 ? "" : baseSalary}
                onChange={(e) => setBaseSalary(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <p className="mt-1 text-[12px] leading-snug text-text-faint">
              Used to check whether you have already hit the Social Security wage cap.
            </p>
          </div>
          <div>
            <label className={labelClass} htmlFor="bonus-state">State</label>
            <select id="bonus-state" className={inputClass} value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
              {STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="bonus-filing">Filing status</label>
            <select
              id="bonus-filing" className={inputClass} value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
            >
              {FILING_STATUSES.map((s) => (
                <option key={s} value={s}>{FILING_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section aria-label="Bonus results" aria-live="polite" className="min-w-0 rounded-xl border border-border bg-surface p-5 sm:p-6">
        <p className="text-[13px] font-medium uppercase tracking-wide text-text-faint">You actually receive</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight text-accent tnum sm:text-5xl">
          {formatCurrency(r.net)}
        </p>
        <p className="mt-1.5 text-[14px] text-text-muted tnum">
          {formatPercent(r.effectiveRate, 1)} withheld from a {formatCurrency(r.bonus)} bonus
        </p>

        <div className="mt-6 overflow-x-auto">
        <table className="w-full text-[14px]">
          <caption className="sr-only">Bonus withholding breakdown</caption>
          <tbody>
            <tr className="border-b border-border/60">
              <th scope="row" className="py-2.5 text-left font-medium">Bonus</th>
              <td className="py-2.5 text-right tnum">{formatCurrency(r.bonus)}</td>
            </tr>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border/60">
                <th scope="row" className="py-2.5 text-left font-normal text-text-muted">{row.label}</th>
                <td className="py-2.5 text-right tnum text-danger">−{formatCurrency(row.value)}</td>
              </tr>
            ))}
            <tr>
              <th scope="row" className="py-3 text-left font-semibold">Net bonus</th>
              <td className="py-3 text-right font-semibold tnum text-accent">{formatCurrency(r.net)}</td>
            </tr>
          </tbody>
        </table>
        </div>

        <p className="mt-4 text-[12px] leading-relaxed text-text-faint">
          Withholding is not the same as the tax you owe. If the flat 22% is higher than your real marginal rate,
          you get the difference back when you file.
        </p>
      </section>
    </div>
  );
}
