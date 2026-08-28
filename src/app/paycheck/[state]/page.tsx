import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PaycheckCalculator from "@/components/PaycheckCalculator";
import StateComparison from "@/components/StateComparison";
import Faq from "@/components/Faq";
import { STATES, getStateBySlug } from "@/data/states";
import { STATE_CONTENT } from "@/data/state-content";
import { stateBracketsFor } from "@/lib/tax/state";
import { calculatePaycheck } from "@/lib/tax/calculate";
import { formatCurrency, formatPercent, formatRate } from "@/lib/tax/format";
import { SITE, absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return STATES.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return {};

  const title = `${state.name} Paycheck Calculator ${SITE.taxYear} — Take-Home Pay After Taxes`;
  const description = STATE_CONTENT[state.code]?.lede ?? `Calculate ${state.name} take-home pay for ${SITE.taxYear}.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/paycheck/${state.slug}/`) },
    openGraph: { title, description, url: absoluteUrl(`/paycheck/${state.slug}/`) },
  };
}

const SAMPLE_SALARIES = [50_000, 75_000, 100_000, 150_000, 250_000];

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  const content = STATE_CONTENT[state.code];
  const brackets = stateBracketsFor(state, "single");

  const salaryRows = SAMPLE_SALARIES.map((salary) => ({
    salary,
    result: calculatePaycheck({
      grossPerPeriod: salary,
      payFrequency: "annual",
      filingStatus: "single",
      stateCode: state.code,
    }),
  }));

  return (
    <>
      <section className="border-b border-border bg-bg-subtle">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-3 text-[13px] text-text-faint">
            <Link href="/" className="transition hover:text-text">
              Calculators
            </Link>
            <span className="mx-1.5">/</span>
            <span>{state.name}</span>
          </nav>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {state.name} paycheck calculator
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-text-muted">{content.lede}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <PaycheckCalculator lockedStateCode={state.code} />

        <section className="prose-block mt-16 max-w-3xl">
          <h2>How {state.name} taxes your paycheck</h2>
          {content.intro.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tight">What makes {state.name} different</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {content.keyPoints.map((point) => (
              <div key={point.title} className="rounded-xl border border-border bg-surface p-5">
                <h3 className="font-medium">{point.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-text-muted">{point.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 세율 표 ── */}
        <section className="mt-14 max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tight">
            {state.name} {SITE.taxYear} rates
          </h2>

          {state.hasIncomeTax ? (
            <div className="mt-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
              <h3 className="text-[15px] font-medium">Income tax</h3>
              {state.flatRate !== undefined ? (
                <p className="mt-2 text-[15px] text-text-muted">
                  Flat <strong className="text-text">{formatRate(state.flatRate)}</strong> on all taxable income.
                </p>
              ) : (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[360px] text-[14px]">
                    <caption className="sr-only">{state.name} income tax brackets, single filer</caption>
                    <thead>
                      <tr className="border-b border-border text-left text-[12px] uppercase tracking-wide text-text-faint">
                        <th scope="col" className="py-2 font-medium">Taxable income (single)</th>
                        <th scope="col" className="py-2 text-right font-medium">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brackets?.map((b, i) => {
                        const lower = i === 0 ? 0 : (brackets[i - 1].upTo ?? 0);
                        return (
                          <tr key={b.rate} className="border-b border-border/60">
                            <td className="py-2 tnum text-text-muted">
                              {formatCurrency(lower)}
                              {b.upTo === null ? " and up" : ` – ${formatCurrency(b.upTo)}`}
                            </td>
                            <td className="py-2 text-right font-medium tnum">{formatRate(b.rate)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {state.standardDeduction?.single !== undefined && (
                <p className="mt-3 text-[13px] text-text-faint">
                  Standard deduction: {formatCurrency(state.standardDeduction.single)} single /{" "}
                  {formatCurrency(state.standardDeduction.married ?? 0)} married filing jointly.
                </p>
              )}
              {state.exemptionDeduction?.single !== undefined && (
                <p className="mt-1 text-[13px] text-text-faint">
                  Personal exemption: {formatCurrency(state.exemptionDeduction.single)} per filer
                  {state.perDependentDeduction
                    ? `, ${formatCurrency(state.perDependentDeduction)} per dependent`
                    : ""}
                  .
                </p>
              )}
              {state.exemptionCredit?.single !== undefined && (
                <p className="mt-1 text-[13px] text-text-faint">
                  Personal exemption credit: {formatCurrency(state.exemptionCredit.single)} single /{" "}
                  {formatCurrency(state.exemptionCredit.married ?? 0)} joint
                  {state.perDependentCredit ? `, ${formatCurrency(state.perDependentCredit)} per dependent` : ""}.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
              <h3 className="text-[15px] font-medium">Income tax</h3>
              <p className="mt-2 text-[15px] text-text-muted">
                {state.name} levies no individual income tax on wages.
              </p>
            </div>
          )}

          {state.payrollItems.length > 0 && (
            <div className="mt-4 rounded-xl border border-border bg-surface p-5 sm:p-6">
              <h3 className="text-[15px] font-medium">Employee payroll deductions</h3>
              <dl className="mt-3 space-y-4">
                {state.payrollItems.map((item) => (
                  <div key={item.key}>
                    <dt className="flex flex-wrap items-baseline gap-x-2 text-[15px] font-medium">
                      {item.label}
                      <span className="tnum text-accent">{formatRate(item.rate)}</span>
                      <span className="text-[13px] font-normal text-text-faint tnum">
                        {item.maxAnnual !== undefined
                          ? `max ${formatCurrency(item.maxAnnual)}/yr`
                          : item.wageBase === null
                            ? "no wage cap"
                            : `up to ${formatCurrency(item.wageBase)}`}
                      </span>
                    </dt>
                    <dd className="mt-1 text-[14px] leading-relaxed text-text-muted">{item.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {state.localTaxes && state.localTaxes.length > 0 && (
            <div className="mt-4 rounded-xl border border-border bg-surface p-5 sm:p-6">
              <h3 className="text-[15px] font-medium">Local income taxes</h3>
              <dl className="mt-3 space-y-4">
                {state.localTaxes.map((local) => (
                  <div key={local.key}>
                    <dt className="flex flex-wrap items-baseline gap-x-2 text-[15px] font-medium">
                      {local.label}
                      <span className="tnum text-accent">{formatRate(local.flatRate)}</span>
                      <span className="text-[13px] font-normal text-text-faint">
                        {local.base === "gross"
                          ? "on gross wages"
                          : local.base === "stateTax"
                            ? "of state tax owed"
                            : "on state taxable income"}
                      </span>
                    </dt>
                    <dd className="mt-1 text-[14px] leading-relaxed text-text-muted">{local.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </section>

        {/* ── 소득 구간별 실수령 ── */}
        <section className="mt-14 max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tight">
            {state.name} take-home pay by salary
          </h2>
          <p className="mt-2 text-[15px] text-text-muted">
            Single filer, no pre-tax deductions, {SITE.taxYear} rates.
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-surface p-5 sm:p-6">
            <table className="w-full min-w-[460px] text-[14px]">
              <caption className="sr-only">{state.name} take-home pay at different salary levels</caption>
              <thead>
                <tr className="border-b border-border text-left text-[12px] uppercase tracking-wide text-text-faint">
                  <th scope="col" className="py-2 font-medium">Gross salary</th>
                  <th scope="col" className="py-2 text-right font-medium">Take-home</th>
                  <th scope="col" className="py-2 text-right font-medium">Monthly</th>
                  <th scope="col" className="py-2 text-right font-medium">Effective rate</th>
                </tr>
              </thead>
              <tbody>
                {salaryRows.map(({ salary, result }) => (
                  <tr key={salary} className="border-b border-border/60">
                    <th scope="row" className="py-2.5 text-left font-normal tnum">{formatCurrency(salary)}</th>
                    <td className="py-2.5 text-right font-medium tnum">{formatCurrency(result.takeHomeAnnual)}</td>
                    <td className="py-2.5 text-right tnum text-text-muted">
                      {formatCurrency(result.takeHomeAnnual / 12)}
                    </td>
                    <td className="py-2.5 text-right tnum text-text-muted">
                      {formatPercent(result.effectiveTaxRate, 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight">How {state.name} compares</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-text-muted">
            Annual take-home on a $100,000 salary, single filer.
          </p>
          <div className="mt-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
            <StateComparison salary={100_000} highlightCode={state.code} />
          </div>
        </section>

        <section className="mt-16 max-w-3xl">
          <Faq items={content.faqs} heading={`${state.name} paycheck questions`} />
        </section>

        <p className="mt-10 max-w-3xl text-[13px] leading-relaxed text-text-faint">
          Figures are estimates for the {SITE.taxYear} tax year based on published rates. Actual withholding
          depends on your Form W-4 and your employer&apos;s payroll system.{" "}
          <Link href="/methodology/" className="text-accent underline underline-offset-2">
            See our methodology and sources
          </Link>
          . This is not tax advice.
        </p>
      </div>
    </>
  );
}
