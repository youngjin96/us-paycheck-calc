import type { Metadata } from "next";
import { PageShell } from "@/components/Prose";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} handles data, cookies, and advertising. Salary figures you enter never leave your browser.`,
  alternates: { canonical: absoluteUrl("/privacy/") },
};

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy policy"
      lede="Short version: the numbers you type into our calculators never leave your browser. Advertising cookies are a separate matter, and we explain them below."
    >
      <p className="text-[13px] text-text-faint">Last updated: {new Date().getFullYear()}</p>

      <h2>Calculator inputs are never transmitted</h2>
      <p>
        Every calculation on this site runs as JavaScript in your own browser. Salaries, deductions, filing status,
        and any other figure you enter are processed locally and are never sent to us, stored, or logged. This site
        is served as static files and has no backend that could receive them.
      </p>

      <h2>Information we collect</h2>
      <p>
        We do not ask you to create an account and we do not collect names, email addresses, or payment details
        unless you choose to email us. Like most websites, our host and our analytics and advertising partners may
        automatically receive standard technical information when you visit:
      </p>
      <ul>
        <li>IP address and approximate region derived from it</li>
        <li>Browser type, operating system, and device category</li>
        <li>Pages viewed, time of visit, and referring page</li>
      </ul>

      <h2>Cookies and advertising</h2>
      <p>
        This site is free because it carries display advertising served by Google AdSense. Google and its partners
        use cookies and similar technologies to serve ads based on your prior visits to this and other websites.
      </p>
      <ul>
        <li>
          Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your
          visits to this site and other sites on the internet.
        </li>
        <li>
          You can opt out of personalised advertising by visiting{" "}
          <a href="https://www.google.com/settings/ads" rel="nofollow noopener" target="_blank">
            Google Ads Settings
          </a>
          .
        </li>
        <li>
          You can opt out of third-party vendor cookies more broadly at{" "}
          <a href="https://www.aboutads.info/choices/" rel="nofollow noopener" target="_blank">
            aboutads.info/choices
          </a>{" "}
          or{" "}
          <a href="https://optout.networkadvertising.org/" rel="nofollow noopener" target="_blank">
            optout.networkadvertising.org
          </a>
          .
        </li>
        <li>
          Third-party vendors we do not control may also serve ads on this site and set their own cookies. We do not
          have access to or control over those cookies.
        </li>
      </ul>
      <p>
        Most browsers let you block or delete cookies through their settings. Blocking advertising cookies does not
        affect any calculator on this site.
      </p>

      <h2>Visitors in the European Economic Area and the United Kingdom</h2>
      <p>
        Where required, we present a consent notice before setting non-essential cookies, and personalised
        advertising is only enabled if you consent. You may withdraw consent at any time through the consent
        control, and you have the right to access, correct, or delete personal data held about you, and to lodge a
        complaint with your supervisory authority.
      </p>

      <h2>California residents</h2>
      <p>
        We do not sell personal information in the ordinary sense of the word. However, the sharing of identifiers
        with advertising partners for personalised advertising may constitute a &ldquo;sale&rdquo; or
        &ldquo;sharing&rdquo; under the California Consumer Privacy Act. California residents may opt out of
        personalised advertising using the links above, or by emailing us at{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>

      <h2>Analytics</h2>
      <p>
        We may use privacy-respecting analytics to understand which pages are useful. Analytics data is aggregated
        and is never joined to anything you enter into a calculator.
      </p>

      <h2>Children</h2>
      <p>
        This site is intended for a general adult audience and is not directed at children under 13. We do not
        knowingly collect personal information from children.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We will update this page if our practices change, and will revise the date at the top when we do.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or privacy requests: <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </PageShell>
  );
}
