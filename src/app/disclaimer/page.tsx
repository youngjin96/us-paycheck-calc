import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/Prose";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `${SITE.name} provides estimates for informational purposes only and is not tax, legal, or financial advice.`,
  alternates: { canonical: absoluteUrl("/disclaimer/") },
};

export default function DisclaimerPage() {
  return (
    <PageShell title="Disclaimer" lede="Estimates for information only. Not tax, legal, or financial advice.">
      <h2>Not professional advice</h2>
      <p>
        {SITE.name} provides general information and estimates about United States payroll taxes. Nothing on this
        site is tax, legal, accounting, or financial advice, and no client or advisory relationship is created by
        using it. Consult a qualified professional — a CPA, enrolled agent, or attorney — before acting on anything
        you read here.
      </p>

      <h2>Estimates, not withholding statements</h2>
      <p>
        Our calculators estimate annual tax liability spread across your pay periods. Your employer withholds using
        the method in IRS Publication 15-T and the Form W-4 you filed, which can produce different amounts. Do not
        use this site to verify the accuracy of your employer&apos;s payroll, to prepare a tax return, or to decide
        how much to withhold. See our <Link href="/methodology/">methodology</Link> for the specific approximations
        involved.
      </p>

      <h2>Accuracy and currency of rates</h2>
      <p>
        Tax rates, wage bases, and thresholds change — sometimes mid-year and sometimes retroactively. While we
        source figures from official publications and update them when we learn of changes, we make no warranty that
        every figure is current or correct. Always verify against the IRS and your state revenue agency.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        This site is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied. To the fullest
        extent permitted by law, {SITE.name} and its operators are not liable for any loss or damage arising from
        reliance on the information or calculations provided here.
      </p>

      <h2>External links</h2>
      <p>
        We link to government and third-party resources for verification. We do not control those sites and are not
        responsible for their content or accuracy.
      </p>
    </PageShell>
  );
}
