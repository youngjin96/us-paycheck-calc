import type { Metadata } from "next";
import BonusCalculator from "@/components/BonusCalculator";
import Faq from "@/components/Faq";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bonus Tax Calculator 2026 — How Much of Your Bonus You Keep",
  description:
    "Work out how much tax is withheld from a bonus in 2026. Federal supplemental rate of 22%, FICA, and state withholding, with the amount you actually receive.",
  alternates: { canonical: absoluteUrl("/bonus-tax/") },
};

const FAQS = [
  {
    q: "Are bonuses taxed at a higher rate?",
    a: "No — they are withheld at a different rate, which is not the same thing. The IRS lets employers withhold a flat 22% from supplemental wages such as bonuses, rising to 37% on amounts above $1 million in a year. Your bonus is still ordinary income and is taxed at your normal rates when you file. If 22% was more than your real marginal rate, the excess comes back as a refund.",
  },
  {
    q: "Why did I only receive about 60% of my bonus?",
    a: "A typical bonus loses 22% to federal withholding, 7.65% to Social Security and Medicare, and anywhere from 0% to over 10% to state withholding. In California, the combined rate on a bonus is roughly 40%. That is withholding, not final tax.",
  },
  {
    q: "What is the aggregate method?",
    a: "Instead of the flat 22%, an employer can add the bonus to your most recent regular paycheck and withhold as if that combined amount were your normal pay. This usually withholds more, because the combined amount lands in a higher bracket. Employers choose which method to use; this calculator models the flat percentage method, which is the more common choice.",
  },
  {
    q: "Can I avoid tax on my bonus by putting it in my 401(k)?",
    a: "You can defer the income tax by directing the bonus into a traditional 401(k), subject to the annual contribution limit. FICA still applies — Social Security and Medicare are withheld on 401(k) contributions regardless.",
  },
];

export default function BonusTaxPage() {
  return (
    <>
      <section className="border-b border-border bg-bg-subtle">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">Bonus tax calculator</h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-text-muted">
            Bonuses are withheld at a flat federal rate, not at your marginal rate. See what is taken out and what
            actually reaches your account.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <BonusCalculator />

        <section className="prose-block mt-16 max-w-3xl">
          <h2>Withholding is not the same as tax owed</h2>
          <p>
            This is the single most misunderstood thing about bonuses. Your employer withholds a flat 22% because
            the IRS permits a simplified percentage method for supplemental wages — not because bonuses are taxed
            more heavily. When you file your return, the bonus is added to your ordinary income and taxed at your
            normal bracket.
          </p>
          <p>
            If your marginal rate is 12%, over-withholding at 22% means a larger refund. If your marginal rate is
            32%, the flat 22% under-withholds and you may owe at filing time.
          </p>

          <h2>Where the Social Security cap helps</h2>
          <p>
            A bonus paid late in the year is often cheaper than the same bonus paid in January. Once your
            year-to-date wages pass the Social Security wage base of $184,500, the 6.2% stops. A December bonus for
            a high earner can escape it entirely — which is why the base salary field above matters.
          </p>

          <h2>State treatment varies</h2>
          <p>
            Some states publish their own flat supplemental rate — California uses 10.23% for bonuses, New York
            11.7%. Flat-tax states simply apply their normal rate. States without a published supplemental rate
            use their regular withholding tables, and we estimate those using your marginal rate.
          </p>
        </section>

        <section className="mt-16 max-w-3xl">
          <Faq items={FAQS} />
        </section>
      </div>
    </>
  );
}
