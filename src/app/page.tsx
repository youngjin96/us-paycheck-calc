import type { Metadata } from "next";
import Link from "next/link";
import PaycheckCalculator from "@/components/PaycheckCalculator";
import StateComparison from "@/components/StateComparison";
import Faq from "@/components/Faq";
import { FICA_2026 } from "@/lib/tax/fica";
import { FEDERAL_STANDARD_DEDUCTION_2026 } from "@/lib/tax/federal";
import { formatCurrency } from "@/lib/tax/format";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "2026 Take-Home Pay Calculator — Paycheck After Taxes by State",
  description:
    "Calculate your 2026 take-home pay after federal tax, Social Security, Medicare, state income tax and state payroll deductions. Updated for the 2026 tax year.",
  alternates: { canonical: absoluteUrl("/") },
};

const FAQS = [
  {
    q: "How much of my paycheck goes to taxes in 2026?",
    a: "For a typical single filer earning $85,000, roughly 22% to 30% of gross pay goes to taxes depending on the state. Federal income tax and FICA account for most of it; state income tax adds anywhere from nothing in Texas or Florida to about 6% in California at that income.",
  },
  {
    q: "What changed for the 2026 tax year?",
    a: "Federal brackets and the standard deduction rose about 2.7% for inflation. The Social Security wage base increased to $184,500 from $176,100. Several states adjusted rates: California's SDI rose to 1.3%, Washington's Paid Family and Medical Leave premium rose to 1.13%, and New Jersey cut both its disability and family leave rates.",
  },
  {
    q: "Why is my actual paycheck different from this estimate?",
    a: "Employers withhold using the IRS percentage method in Publication 15-T, driven by the Form W-4 you filed. That method can front-load or spread withholding differently from a flat annual calculation, and any extra withholding you requested on your W-4 is not reflected here. This calculator estimates your actual annual tax liability rather than reproducing your employer's withholding formula.",
  },
  {
    q: "Does a 401(k) contribution reduce my Social Security and Medicare tax?",
    a: "No. Traditional 401(k) contributions are exempt from federal and most state income tax, but they remain subject to FICA. Section 125 benefits such as health insurance premiums, HSA and FSA contributions are exempt from both, which is why they reduce your total tax more per dollar.",
  },
  {
    q: "Is the additional Medicare tax withheld based on my filing status?",
    a: "No. Employers withhold the extra 0.9% once your wages with that employer exceed $200,000, regardless of filing status, because they cannot see your spouse's income. The true thresholds are $250,000 for joint filers and $125,000 for married filing separately, and any difference is settled on your tax return.",
  },
];

export default function Home() {
  return (
    <>
      <section className="border-b border-border bg-bg-subtle">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            2026 take-home pay calculator
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-text-muted">
            See exactly what comes out of your paycheck — federal income tax, Social Security, Medicare, state
            income tax, and the state payroll deductions most calculators leave out. Nothing you enter leaves
            your browser.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <PaycheckCalculator />

        <section className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight">Take-home pay on $100,000 by state</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-muted">
            A single filer with no pre-tax deductions, {SITE.taxYear} rates. These figures are produced by the same
            engine that powers the calculator above, not copied from a table.
          </p>
          <div className="mt-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
            <StateComparison salary={100_000} />
          </div>
        </section>

        <section className="prose-block mt-16 max-w-3xl">
          <h2>What actually comes out of a US paycheck</h2>
          <p>
            Every paycheck in the United States is reduced by at least three federal items, and in most states by
            two or three more. Understanding which is which explains why two people on the same salary can take
            home very different amounts.
          </p>

          <h3>Federal income tax</h3>
          <p>
            Charged on your taxable income — gross pay minus pre-tax deductions and the standard deduction, which
            for {SITE.taxYear} is {formatCurrency(FEDERAL_STANDARD_DEDUCTION_2026.single)} for single filers and{" "}
            {formatCurrency(FEDERAL_STANDARD_DEDUCTION_2026.married)} for married couples filing jointly. Rates
            climb through seven brackets from 10% to 37%. Only the income inside each bracket is taxed at that
            bracket&apos;s rate, so moving into a higher bracket never reduces your take-home pay.
          </p>

          <h3>Social Security and Medicare (FICA)</h3>
          <p>
            Social Security takes 6.2% of wages up to {formatCurrency(FICA_2026.socialSecurityWageBase)} in{" "}
            {SITE.taxYear}, after which it stops entirely. Medicare takes 1.45% with no ceiling, plus an
            additional 0.9% on wages above {formatCurrency(FICA_2026.additionalMedicareWithholdingThreshold)}.
            High earners therefore see their paycheck jump partway through the year as the Social Security cap is
            reached.
          </p>

          <h3>State income tax</h3>
          <p>
            Eight states — Alaska, Florida, Nevada, South Dakota, Tennessee, Texas, Washington and Wyoming — levy
            no income tax on wages. Others range from Pennsylvania&apos;s flat 3.07% to California&apos;s 13.3%
            top rate. A few states also allow cities to tax income, most notably New York City and Philadelphia.
          </p>

          <h3>State payroll programs</h3>
          <p>
            This is the layer most calculators skip. California withholds 1.3% for disability insurance with no
            wage cap. Washington has no income tax but takes both a paid leave premium and a long-term care
            premium. New Jersey withholds three separate contributions with two different wage bases. These can
            easily exceed 1% of gross pay.
          </p>
          <p>
            <Link href="/methodology/">Read the full methodology and sources →</Link>
          </p>
        </section>

        <section className="mt-16 max-w-3xl">
          <Faq items={FAQS} />
        </section>
      </div>
    </>
  );
}
