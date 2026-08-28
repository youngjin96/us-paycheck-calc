import type { ReactNode } from "react";

/** 법적 고지·설명 문단용 공통 래퍼. */
export function PageShell({
  title,
  lede,
  children,
  wide = false,
}: {
  title: string;
  lede?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`mx-auto px-4 py-10 sm:px-6 sm:py-14 ${wide ? "max-w-6xl" : "max-w-3xl"}`}>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {lede && <p className="mt-3 text-[17px] leading-relaxed text-text-muted">{lede}</p>}
      <div className="prose-block mt-8">{children}</div>
    </div>
  );
}
