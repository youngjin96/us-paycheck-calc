import type { Metadata } from "next";
import { PageShell } from "@/components/Prose";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Methodology & Sources",
  description:
    "How our 2026 paycheck calculations work, every rate we use, where each figure comes from, and the approximations we make.",
  alternates: { canonical: absoluteUrl("/methodology/") },
};

export default function MethodologyPage() {
  return (
    <PageShell
      title="Methodology & sources"
      lede={`Every number this site produces comes from published ${SITE.taxYear} rates. Here is exactly how the calculation works and where each figure comes from.`}
    >
      <h2>The calculation, step by step</h2>
      <ol>
        <li>Your pay is annualised using the pay frequency you select.</li>
        <li>
          Pre-tax deductions are subtracted. Traditional 401(k) contributions reduce income tax but not FICA;
          Section 125 benefits such as health premiums, HSA and FSA reduce both.
        </li>
        <li>The federal standard deduction for your filing status is subtracted to get federal taxable income.</li>
        <li>Federal tax is computed bracket by bracket, then FICA on your FICA wages.</li>
        <li>
          State taxable income is computed separately, because states apply their own deductions and exemptions —
          and in Pennsylvania&apos;s case, do not exempt 401(k) contributions at all.
        </li>
        <li>State payroll programs and any local income tax are applied.</li>
        <li>The annual total is divided back down to your pay period.</li>
      </ol>

      <h2>Sources</h2>
      <ul>
        <li>
          <strong>Federal brackets and standard deduction</strong> — IRS Revenue Procedure 2025-32, the annual
          inflation adjustment for the {SITE.taxYear} tax year.
        </li>
        <li>
          <strong>FICA</strong> — Social Security Administration announcement of the {SITE.taxYear} wage base
          ($184,500) and IRS Topic No. 751 for rates.
        </li>
        <li>
          <strong>State income tax</strong> — each state&apos;s Department of Revenue withholding tables, cross-checked
          against the Tax Foundation&apos;s annual state income tax survey.
        </li>
        <li>
          <strong>State payroll programs</strong> — the administering agency in each state: California EDD, New York
          Workers&apos; Compensation Board, New Jersey Department of Labor, Washington Employment Security Department.
        </li>
      </ul>

      <h2>Approximations we make, and why</h2>

      <h3>We estimate annual tax liability, not your employer&apos;s withholding</h3>
      <p>
        Employers withhold using the percentage method in IRS Publication 15-T, which is driven by the Form W-4 you
        filed — including any extra withholding, multiple-jobs adjustment, or dependent credits you claimed. We
        compute your actual annual tax instead. For most people the two are close, but if you deliberately over- or
        under-withhold on your W-4, your real paycheck will differ.
      </p>

      <h3>Head of household and married filing separately use single-filer state tables</h3>
      <p>
        Many states publish only two schedules. Where a state does not publish a distinct head of household or
        married filing separately table, we apply the single schedule. Federal calculations always use the correct
        table for your status.
      </p>

      <h3>New York City tax uses the top resident rate</h3>
      <p>
        The NYC resident tax is mildly graduated from 3.078% to 3.876%, with the top rate reaching most full-time
        workers. We apply 3.876%, which slightly overstates the tax for low incomes.
      </p>

      <h3>We do not model credits, itemised deductions, or other income</h3>
      <p>
        The Child Tax Credit, Earned Income Tax Credit, itemised deductions, capital gains, self-employment income,
        and the additional standard deduction for filers over 65 are all outside the scope of a paycheck
        calculator. If any of these apply to you, your annual tax bill will differ from the estimate here.
      </p>

      <h3>Local taxes beyond the ones listed</h3>
      <p>
        Several states permit municipal income taxes we do not enumerate — Ohio and Michigan in particular have
        hundreds of local jurisdictions. Where we do model a local tax, we say which base it applies to, because
        this varies: Philadelphia&apos;s Wage Tax is charged on gross pay with no deductions, while New York
        City&apos;s tax is charged on state taxable income.
      </p>

      <h2>Your data stays in your browser</h2>
      <p>
        All calculations run as JavaScript in your browser. Salary figures are never transmitted to us, stored, or
        logged — this site is served as static files and has no backend to send them to.
      </p>

      <h2>Corrections</h2>
      <p>
        Tax rates change, and we would rather be corrected than wrong. If a figure here does not match your state&apos;s
        published guidance, tell us and include the source — we will fix it.
      </p>
    </PageShell>
  );
}
