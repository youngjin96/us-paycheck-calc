import type { Metadata } from "next";
import SalaryConverter from "@/components/SalaryConverter";
import Faq from "@/components/Faq";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Salary to Hourly Calculator — Convert Pay With Taxes",
  description:
    "Convert an annual salary to an hourly rate and back, then see the after-tax equivalent for 2026. Adjust hours per week and unpaid weeks off.",
  alternates: { canonical: absoluteUrl("/salary-to-hourly/") },
};

const FAQS = [
  {
    q: "How do I convert my salary to an hourly rate?",
    a: "Divide your annual salary by the number of hours you actually work in a year. The common shortcut is to divide by 2,080 — that is 40 hours a week for 52 weeks. If you take unpaid time off, reduce the weeks accordingly: 50 weeks gives 2,000 hours.",
  },
  {
    q: "Should I use 2,080 hours or something else?",
    a: "2,080 works for salaried employees with paid vacation, because you are paid for all 52 weeks. Contractors and hourly workers who are not paid for time off should use their actual paid hours, which is usually closer to 1,900–2,000.",
  },
  {
    q: "Why is my after-tax hourly rate so much lower?",
    a: "Federal income tax, Social Security and Medicare together take roughly 20–25% of a mid-range salary before any state tax. On a $85,000 salary in a no-income-tax state, a $40.87 gross hourly rate is closer to $32 after tax.",
  },
  {
    q: "Does overtime change the calculation?",
    a: "This converter assumes a consistent schedule. Overtime paid at 1.5× raises your annual total without raising your base rate, so enter your expected total hours and total pay for the most accurate comparison.",
  },
];

export default function SalaryToHourlyPage() {
  return (
    <>
      <section className="border-b border-border bg-bg-subtle">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Salary to hourly calculator
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-text-muted">
            Convert between an annual salary and an hourly rate, with the after-tax equivalent for 2026 so you can
            compare offers on the number that actually lands in your account.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <SalaryConverter />

        <section className="prose-block mt-16 max-w-3xl">
          <h2>Why the hourly number matters when comparing offers</h2>
          <p>
            A salaried role at $95,000 that reliably runs 50-hour weeks pays less per hour than an $85,000 role at
            40 hours. Converting to an hourly rate makes that visible, and converting to an{" "}
            <em>after-tax</em> hourly rate makes it comparable across states.
          </p>
          <p>
            The same logic applies to contract work. A contractor billing $60 an hour is not automatically ahead of
            a $110,000 salaried employee — the contractor pays both halves of FICA as self-employment tax and
            funds their own benefits.
          </p>

          <h2>Standard hour conventions</h2>
          <ul>
            <li><strong>2,080 hours</strong> — 40 hours × 52 weeks. The default for salaried employees with paid leave.</li>
            <li><strong>2,000 hours</strong> — 40 hours × 50 weeks. Common for contractors assuming two unpaid weeks.</li>
            <li><strong>1,920 hours</strong> — 40 hours × 48 weeks. Assumes a month of unpaid time off.</li>
          </ul>
        </section>

        <section className="mt-16 max-w-3xl">
          <Faq items={FAQS} />
        </section>
      </div>
    </>
  );
}
