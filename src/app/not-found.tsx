import Link from "next/link";
import { STATES } from "@/data/states";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-[13px] font-medium uppercase tracking-wide text-text-faint">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Page not found</h1>
      <p className="mt-3 text-[17px] leading-relaxed text-text-muted">
        That page does not exist. Try one of the calculators instead.
      </p>
      <ul className="mt-6 space-y-2 text-[15px]">
        {[
          { href: "/", label: "Take-home pay calculator" },
          { href: "/salary-to-hourly/", label: "Salary to hourly converter" },
          { href: "/bonus-tax/", label: "Bonus tax calculator" },
        ].map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-accent underline underline-offset-2">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-[13px] uppercase tracking-wide text-text-faint">By state</p>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[15px]">
        {STATES.map((s) => (
          <li key={s.code}>
            <Link href={`/paycheck/${s.slug}/`} className="text-text-muted transition hover:text-text">
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
