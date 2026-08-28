"use client";

import { useMemo, useState } from "react";
import { calculatePaycheck } from "@/lib/tax/calculate";
import { formatCurrency, formatCurrencyCents } from "@/lib/tax/format";
import { STATES } from "@/data/states";

const inputClass =
  "w-full rounded-[var(--radius-base)] border border-border bg-surface px-3 py-2.5 text-[15px] text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
const labelClass = "mb-1.5 block text-[13px] font-medium text-text-muted";

export default function SalaryConverter() {
  const [mode, setMode] = useState<"salaryToHourly" | "hourlyToSalary">("salaryToHourly");
  const [salary, setSalary] = useState(85_000);
  const [hourly, setHourly] = useState(40);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);
  const [stateCode, setStateCode] = useState("TX");

  const hoursPerYear = Math.max(1, hoursPerWeek * weeksPerYear);
  const annual = mode === "salaryToHourly" ? salary : hourly * hoursPerYear;
  const rate = mode === "salaryToHourly" ? salary / hoursPerYear : hourly;

  const net = useMemo(
    () =>
      calculatePaycheck({
        grossPerPeriod: annual,
        payFrequency: "annual",
        filingStatus: "single",
        stateCode,
      }),
    [annual, stateCode],
  );

  const stats = [
    { label: "Hourly", value: formatCurrencyCents(rate) },
    { label: "Daily (8h)", value: formatCurrencyCents(rate * 8) },
    { label: "Weekly", value: formatCurrencyCents(rate * hoursPerWeek) },
    { label: "Bi-weekly", value: formatCurrencyCents((annual / 26)) },
    { label: "Monthly", value: formatCurrencyCents(annual / 12) },
    { label: "Annual", value: formatCurrency(annual) },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8">
      <section aria-label="Conversion inputs" className="min-w-0 self-start rounded-xl border border-border bg-bg-subtle p-5 sm:p-6">
        <div
          role="tablist"
          aria-label="Conversion direction"
          className="mb-5 grid grid-cols-2 gap-1 rounded-[var(--radius-base)] border border-border bg-surface p-1"
        >
          {([
            ["salaryToHourly", "Salary → hourly"],
            ["hourlyToSalary", "Hourly → salary"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={mode === value}
              type="button"
              onClick={() => setMode(value)}
              className={`rounded-md px-3 py-2 text-[14px] font-medium transition ${
                mode === value ? "bg-accent text-white" : "text-text-muted hover:text-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {mode === "salaryToHourly" ? (
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="salary">Annual salary</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint">$</span>
                <input
                  id="salary" type="number" min={0} step={1000} inputMode="decimal"
                  className={`${inputClass} pl-7 tnum`} value={salary === 0 ? "" : salary}
                  onChange={(e) => setSalary(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
            </div>
          ) : (
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="hourly">Hourly rate</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint">$</span>
                <input
                  id="hourly" type="number" min={0} step={0.5} inputMode="decimal"
                  className={`${inputClass} pl-7 tnum`} value={hourly === 0 ? "" : hourly}
                  onChange={(e) => setHourly(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="hpw">Hours per week</label>
            <input
              id="hpw" type="number" min={1} max={168} className={`${inputClass} tnum`} value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Math.max(1, Math.min(168, Number(e.target.value) || 1)))}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="wpy">Weeks per year</label>
            <input
              id="wpy" type="number" min={1} max={52} className={`${inputClass} tnum`} value={weeksPerYear}
              onChange={(e) => setWeeksPerYear(Math.max(1, Math.min(52, Number(e.target.value) || 1)))}
            />
            <p className="mt-1 text-[12px] leading-snug text-text-faint">
              Use 50 if you take two unpaid weeks off.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="conv-state">State (for take-home)</label>
            <select id="conv-state" className={inputClass} value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
              {STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section aria-label="Conversion results" aria-live="polite" className="min-w-0 rounded-xl border border-border bg-surface p-5 sm:p-6">
        <p className="text-[13px] font-medium uppercase tracking-wide text-text-faint">Equivalent pay</p>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="text-[13px] text-text-faint">{s.label}</dt>
              <dd className="mt-0.5 text-[17px] font-semibold tnum">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 border-t border-border pt-5">
          <p className="text-[13px] font-medium uppercase tracking-wide text-text-faint">After tax (single filer)</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-accent tnum">
            {formatCurrencyCents(net.takeHomeAnnual / hoursPerYear)}
            <span className="ml-1.5 text-[15px] font-normal text-text-muted">per hour</span>
          </p>
          <p className="mt-1 text-[14px] text-text-muted tnum">
            {formatCurrency(net.takeHomeAnnual)} a year take-home
          </p>
        </div>
      </section>
    </div>
  );
}
