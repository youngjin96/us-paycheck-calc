"use client";

import { useMemo, useState } from "react";
import { calculatePaycheck } from "@/lib/tax/calculate";
import { formatCurrency, formatCurrencyCents, formatPercent, formatRate } from "@/lib/tax/format";
import { STATES, getStateByCode } from "@/data/states";
import { SITE } from "@/lib/site";
import {
  FILING_STATUSES,
  FILING_STATUS_LABELS,
  PAY_FREQUENCIES,
  PAY_FREQUENCY_LABELS,
  type FilingStatus,
  type LineItem,
  type PayFrequency,
} from "@/lib/tax/types";

type Props = {
  /** 주 페이지에서는 주를 고정하고 선택기를 숨긴다 */
  lockedStateCode?: string;
  defaultAnnualSalary?: number;
};

const inputClass =
  "w-full rounded-[var(--radius-base)] border border-border bg-surface px-3 py-2.5 text-[15px] text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

const labelClass = "mb-1.5 block text-[13px] font-medium text-text-muted";

function Money({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint">$</span>
        <input
          id={id}
          type="number"
          min={0}
          step={100}
          inputMode="decimal"
          className={`${inputClass} pl-7 tnum`}
          value={value === 0 ? "" : value}
          placeholder="0"
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        />
      </div>
      {hint && <p className="mt-1 text-[12px] leading-snug text-text-faint">{hint}</p>}
    </div>
  );
}

export default function PaycheckCalculator({ lockedStateCode, defaultAnnualSalary = 85_000 }: Props) {
  const [payFrequency, setPayFrequency] = useState<PayFrequency>("annual");
  const [gross, setGross] = useState(defaultAnnualSalary);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [stateCode, setStateCode] = useState(lockedStateCode ?? "CA");
  const [localTaxKey, setLocalTaxKey] = useState("");
  const [dependents, setDependents] = useState(0);
  const [retirement, setRetirement] = useState(0);
  const [preTax, setPreTax] = useState(0);
  const [postTax, setPostTax] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeState = getStateByCode(stateCode);
  const localOptions = activeState?.localTaxes ?? [];

  const result = useMemo(
    () =>
      calculatePaycheck({
        grossPerPeriod: gross,
        payFrequency,
        filingStatus,
        stateCode,
        localTaxKey: localTaxKey || undefined,
        dependents,
        retirement401kPerPeriod: retirement,
        preTaxBenefitsPerPeriod: preTax,
        postTaxDeductionsPerPeriod: postTax,
      }),
    [gross, payFrequency, filingStatus, stateCode, localTaxKey, dependents, retirement, preTax, postTax],
  );

  /** 급여 주기를 바꿀 때 연 환산액을 유지해 사용자가 다시 입력하지 않게 한다. */
  function changeFrequency(next: PayFrequency) {
    const annualised = result.grossAnnual;
    const periods = { annual: 1, monthly: 12, semimonthly: 24, biweekly: 26, weekly: 52 }[next];
    setPayFrequency(next);
    setGross(Math.round((annualised / periods) * 100) / 100);
  }

  function changeState(next: string) {
    setStateCode(next);
    setLocalTaxKey("");
  }

  const taxRows: LineItem[] = [
    result.federal,
    result.socialSecurity,
    result.medicare,
    ...(result.additionalMedicare.annual > 0 ? [result.additionalMedicare] : []),
    ...(result.stateIncome.annual > 0 ? [result.stateIncome] : []),
    ...(result.localIncome.annual > 0 ? [result.localIncome] : []),
    ...result.statePayroll.filter((p) => p.annual > 0),
  ];

  const deductionsTotal = result.preTaxDeductions.annual + result.postTaxDeductions.annual;
  // 연간 지급이면 회차 = 연간이라 같은 숫자가 두 번 나온다
  const showAnnualColumn = payFrequency !== "annual";
  const periodLabel = payFrequency === "annual" ? "year" : PAY_FREQUENCY_LABELS[payFrequency].toLowerCase();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8">
      {/* ── 입력 ── */}
      <section
        aria-label="Paycheck inputs"
        className="min-w-0 self-start rounded-xl border border-border bg-bg-subtle p-5 sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Money id="gross" label="Gross pay" value={gross} onChange={setGross} />

          <div>
            <label className={labelClass} htmlFor="frequency">
              Pay frequency
            </label>
            <select
              id="frequency"
              className={inputClass}
              value={payFrequency}
              onChange={(e) => changeFrequency(e.target.value as PayFrequency)}
            >
              {PAY_FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {PAY_FREQUENCY_LABELS[f]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="filing">
              Filing status
            </label>
            <select
              id="filing"
              className={inputClass}
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
            >
              {FILING_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {FILING_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          {lockedStateCode ? (
            <div>
              <span className={labelClass}>State</span>
              <div className="rounded-[var(--radius-base)] border border-border bg-surface px-3 py-2.5 text-[15px]">
                {activeState?.name}
              </div>
            </div>
          ) : (
            <div>
              <label className={labelClass} htmlFor="state">
                State
              </label>
              <select id="state" className={inputClass} value={stateCode} onChange={(e) => changeState(e.target.value)}>
                {STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {localOptions.length > 0 && (
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="local">
                City / local tax
              </label>
              <select id="local" className={inputClass} value={localTaxKey} onChange={(e) => setLocalTaxKey(e.target.value)}>
                <option value="">None — elsewhere in {activeState?.name}</option>
                {localOptions.map((l) => (
                  <option key={l.key} value={l.key}>
                    {l.label} ({formatRate(l.flatRate)})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="mt-5 flex w-full items-center justify-between rounded-[var(--radius-base)] border border-border px-3 py-2 text-[13px] font-medium text-text-muted transition hover:border-border-strong hover:text-text"
          aria-expanded={showAdvanced}
        >
          <span>Deductions &amp; dependents</span>
          <span aria-hidden className="text-text-faint">{showAdvanced ? "−" : "+"}</span>
        </button>

        {showAdvanced && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Money
              id="retirement"
              label={`401(k) contribution per ${payFrequency === "annual" ? "year" : "period"}`}
              value={retirement}
              onChange={setRetirement}
              hint="Cuts income tax, but FICA still applies."
            />
            <Money
              id="pretax"
              label="Pre-tax benefits"
              value={preTax}
              onChange={setPreTax}
              hint="Health premiums, HSA, FSA. Exempt from income tax and FICA."
            />
            <Money
              id="posttax"
              label="Post-tax deductions"
              value={postTax}
              onChange={setPostTax}
              hint="Roth 401(k), union dues, garnishments."
            />
            <div>
              <label className={labelClass} htmlFor="dependents">
                Dependents
              </label>
              <input
                id="dependents"
                type="number"
                min={0}
                max={15}
                className={`${inputClass} tnum`}
                value={dependents}
                onChange={(e) => setDependents(Math.max(0, Math.min(15, Number(e.target.value) || 0)))}
              />
              <p className="mt-1 text-[12px] leading-snug text-text-faint">
                Used for state exemptions and credits only.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ── 결과 ── */}
      <section aria-label="Results" aria-live="polite" className="min-w-0 rounded-xl border border-border bg-surface p-5 sm:p-6">
        <p className="text-[13px] font-medium uppercase tracking-wide text-text-faint">
          Take-home pay per {periodLabel}
        </p>
        <p className="mt-1 text-4xl font-semibold tracking-tight text-accent tnum sm:text-5xl">
          {formatCurrencyCents(result.takeHomePerPeriod)}
        </p>
        <p className="mt-1.5 text-[14px] text-text-muted tnum">
          {formatCurrency(result.takeHomeAnnual)} a year · {formatPercent(result.takeHomeRate, 1)} of gross
        </p>

        {/* 총급여가 어디로 가는지 한눈에 */}
        <div className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full bg-bg-subtle" role="img"
          aria-label={`Take-home ${formatPercent(result.takeHomeRate, 0)}, taxes ${formatPercent(result.effectiveTaxRate, 0)}`}>
          <div className="bg-accent" style={{ width: `${result.takeHomeRate * 100}%` }} />
          <div className="bg-danger" style={{ width: `${result.effectiveTaxRate * 100}%` }} />
          <div
            className="bg-border-strong"
            style={{ width: `${result.grossAnnual > 0 ? (deductionsTotal / result.grossAnnual) * 100 : 0}%` }}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-text-faint">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-accent" /> Take-home
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-danger" /> Taxes
          </span>
          {deductionsTotal > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-border-strong" /> Deductions
            </span>
          )}
        </div>

        <div className="mt-6 overflow-x-auto">
        <table className="w-full text-[14px]">
          <caption className="sr-only">Paycheck breakdown</caption>
          <thead>
            <tr className="border-b border-border text-left text-[12px] uppercase tracking-wide text-text-faint">
              <th scope="col" className="pb-2 font-medium">Item</th>
              <th scope="col" className="pb-2 text-right font-medium">Per {payFrequency === "annual" ? "year" : "period"}</th>
              {showAnnualColumn && (
                <th scope="col" className="hidden pb-2 text-right font-medium sm:table-cell">Annual</th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/60">
              <th scope="row" className="py-2.5 text-left font-medium">Gross pay</th>
              <td className="py-2.5 text-right tnum">{formatCurrencyCents(result.grossPerPeriod)}</td>
              {showAnnualColumn && (
                <td className="hidden py-2.5 text-right tnum text-text-muted sm:table-cell">
                  {formatCurrency(result.grossAnnual)}
                </td>
              )}
            </tr>

            {taxRows.map((row) => (
              <tr key={row.key} className="border-b border-border/60">
                <th scope="row" className="py-2.5 text-left font-normal text-text-muted">
                  {row.label}
                  <span className="ml-2 text-[12px] text-text-faint tnum">{formatPercent(row.shareOfGross, 1)}</span>
                </th>
                <td className="py-2.5 text-right tnum text-danger">−{formatCurrencyCents(row.perPeriod)}</td>
                {showAnnualColumn && (
                  <td className="hidden py-2.5 text-right tnum text-text-muted sm:table-cell">
                    −{formatCurrency(row.annual)}
                  </td>
                )}
              </tr>
            ))}

            {result.preTaxDeductions.annual > 0 && (
              <tr className="border-b border-border/60">
                <th scope="row" className="py-2.5 text-left font-normal text-text-muted">Pre-tax deductions</th>
                <td className="py-2.5 text-right tnum">−{formatCurrencyCents(result.preTaxDeductions.perPeriod)}</td>
                {showAnnualColumn && (
                  <td className="hidden py-2.5 text-right tnum text-text-muted sm:table-cell">
                    −{formatCurrency(result.preTaxDeductions.annual)}
                  </td>
                )}
              </tr>
            )}
            {result.postTaxDeductions.annual > 0 && (
              <tr className="border-b border-border/60">
                <th scope="row" className="py-2.5 text-left font-normal text-text-muted">Post-tax deductions</th>
                <td className="py-2.5 text-right tnum">−{formatCurrencyCents(result.postTaxDeductions.perPeriod)}</td>
                {showAnnualColumn && (
                  <td className="hidden py-2.5 text-right tnum text-text-muted sm:table-cell">
                    −{formatCurrency(result.postTaxDeductions.annual)}
                  </td>
                )}
              </tr>
            )}

            <tr>
              <th scope="row" className="py-3 text-left font-semibold">Take-home pay</th>
              <td className="py-3 text-right font-semibold tnum text-accent">
                {formatCurrencyCents(result.takeHomePerPeriod)}
              </td>
              {showAnnualColumn && (
                <td className="hidden py-3 text-right font-semibold tnum text-accent sm:table-cell">
                  {formatCurrency(result.takeHomeAnnual)}
                </td>
              )}
            </tr>
          </tbody>
        </table>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-[13px] sm:grid-cols-3">
          <div>
            <dt className="text-text-faint">Effective tax rate</dt>
            <dd className="mt-0.5 font-semibold tnum">{formatPercent(result.effectiveTaxRate, 1)}</dd>
          </div>
          <div>
            <dt className="text-text-faint">Federal marginal rate</dt>
            <dd className="mt-0.5 font-semibold tnum">{formatPercent(result.marginalFederalRate, 0)}</dd>
          </div>
          <div>
            <dt className="text-text-faint">Federal taxable income</dt>
            <dd className="mt-0.5 font-semibold tnum">{formatCurrency(result.federalTaxableIncome)}</dd>
          </div>
        </dl>

        <p className="mt-4 text-[12px] leading-relaxed text-text-faint">
          Estimates for the {SITE.taxYear} tax year. Your employer withholds using your Form W-4, so real
          paychecks can differ. Not tax advice.
        </p>
      </section>
    </div>
  );
}
