import type { Metadata } from "next";
import { PageShell } from "@/components/Prose";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `How to reach ${SITE.name} with corrections, questions, or business enquiries.`,
  alternates: { canonical: absoluteUrl("/contact/") },
};

export default function ContactPage() {
  return (
    <PageShell title="Contact" lede="Corrections are especially welcome — please include a source we can verify.">
      <h2>Email</h2>
      <p>
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
      </p>
      <p>We read everything and usually reply within a few business days.</p>

      <h2>Reporting an incorrect rate</h2>
      <p>To make a correction quick to verify, it helps to include:</p>
      <ul>
        <li>The page and the specific figure that looks wrong</li>
        <li>The correct figure, and the tax year it applies to</li>
        <li>A link to the state or federal agency page that publishes it</li>
      </ul>
      <p>
        We prioritise corrections to rates and wage bases above everything else — a wrong number is worse than a
        missing feature.
      </p>

      <h2>Privacy requests</h2>
      <p>
        For questions about data and advertising cookies, or to make a request under GDPR or the CCPA, email the
        address above with &ldquo;Privacy&rdquo; in the subject line.
      </p>
    </PageShell>
  );
}
