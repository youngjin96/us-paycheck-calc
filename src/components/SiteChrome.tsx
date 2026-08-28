import Link from "next/link";
import { SITE } from "@/lib/site";
import { STATES } from "@/data/states";

const TOOLS = [
  // short 는 좁은 화면용 — 전체 라벨을 쓰면 헤더가 넘쳐 페이지에 가로 스크롤이 생긴다
  { href: "/", label: "Paycheck calculator", short: "Paycheck" },
  { href: "/salary-to-hourly/", label: "Salary to hourly", short: "Hourly" },
  { href: "/bonus-tax/", label: "Bonus tax", short: "Bonus" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-6">
        <Link href="/" className="flex min-w-0 items-baseline gap-2 font-semibold tracking-tight">
          <span className="text-[17px]">{SITE.name}</span>
          <span className="hidden text-[12px] font-normal text-text-faint sm:inline">{SITE.taxYear} tax year</span>
        </Link>
        <nav aria-label="Primary" className="flex shrink-0 items-center gap-0.5 text-[14px] sm:gap-1">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="whitespace-nowrap rounded-md px-2 py-1.5 text-text-muted transition hover:bg-bg-subtle hover:text-text sm:px-2.5"
            >
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-bg-subtle">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-semibold">{SITE.name}</p>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-text-muted">
              Free, transparent paycheck math for the {SITE.taxYear} tax year. Every rate we use is documented and
              sourced.
            </p>
          </div>

          <nav aria-label="Calculators">
            <p className="text-[12px] font-medium uppercase tracking-wide text-text-faint">Calculators</p>
            <ul className="mt-3 space-y-2 text-[14px]">
              {TOOLS.map((t) => (
                <li key={t.href}>
                  <Link href={t.href} className="text-text-muted transition hover:text-text">
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site">
            <p className="text-[12px] font-medium uppercase tracking-wide text-text-faint">Site</p>
            <ul className="mt-3 space-y-2 text-[14px]">
              {[
                { href: "/methodology/", label: "Methodology & sources" },
                { href: "/about/", label: "About" },
                { href: "/contact/", label: "Contact" },
                { href: "/privacy/", label: "Privacy policy" },
                { href: "/disclaimer/", label: "Disclaimer" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-text-muted transition hover:text-text">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-[12px] font-medium uppercase tracking-wide text-text-faint">By state</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[14px]">
            {STATES.map((s) => (
              <li key={s.code}>
                <Link href={`/paycheck/${s.slug}/`} className="text-text-muted transition hover:text-text">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-[12px] leading-relaxed text-text-faint">
          © {new Date().getFullYear()} {SITE.name}. Estimates only — not tax, legal, or financial advice. Verify
          against IRS and state guidance before acting.
        </p>
      </div>
    </footer>
  );
}
