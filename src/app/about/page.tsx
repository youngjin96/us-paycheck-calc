import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/Prose";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.name} — who builds these calculators and why.`,
  alternates: { canonical: absoluteUrl("/about/") },
};

export default function AboutPage() {
  return (
    <PageShell
      title={`About ${SITE.name}`}
      lede="Paycheck calculators that show their work, and include the deductions most tools quietly skip."
    >
      <h2>Why this site exists</h2>
      <p>
        Most free paycheck calculators handle federal tax and FICA correctly and then stop. They miss the state
        payroll programs that come out of real pay stubs — California&apos;s uncapped disability insurance,
        Washington&apos;s two mandatory premiums, New Jersey&apos;s three separate employee contributions. For
        someone earning well, those lines add up to more than a thousand dollars a year, and their absence is why
        an online estimate and an actual paycheck so often disagree.
      </p>
      <p>
        We wanted a calculator that got those details right, published the rates it uses, and named its sources.
      </p>

      <h2>How it works</h2>
      <p>
        Everything runs in your browser. There is no account, no email gate, and no server receiving your salary —
        the site is static files. You can read exactly how the numbers are produced on the{" "}
        <Link href="/methodology/">methodology page</Link>, including the approximations we make and why.
      </p>

      <h2>What we are not</h2>
      <p>
        We are not accountants, and this site is not tax advice. It is a well-sourced estimate to help you sanity-check
        a pay stub, compare a job offer across states, or plan a move. For anything with money on the line, talk to a
        CPA or enrolled agent.
      </p>

      <h2>How this site is funded</h2>
      <p>
        {SITE.name} is free and supported by display advertising. Ads never influence the figures we publish. See our{" "}
        <Link href="/privacy/">privacy policy</Link> for how advertising cookies work.
      </p>

      <h2>Corrections and feedback</h2>
      <p>
        Rates change every year and sometimes mid-year. If you find a figure that does not match your state&apos;s
        published guidance, <Link href="/contact/">let us know</Link> with a source and we will correct it.
      </p>
    </PageShell>
  );
}
