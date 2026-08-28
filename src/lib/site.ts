/**
 * 사이트 전역 설정. 도메인이 정해지면 NEXT_PUBLIC_SITE_URL 만 바꾸면 된다.
 */
export const SITE = {
  name: "PaycheckLab",
  tagline: "2026 US paycheck & tax calculators",
  description:
    "Free 2026 take-home pay calculators for all 50 states. See exactly how federal tax, FICA, state income tax and state payroll deductions hit your paycheck.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/+$/, ""),
  /** 애드센스 게시자 ID (pub-XXXXXXXXXXXXXXXX). 미설정 시 광고 스크립트와 ads.txt 를 넣지 않는다. */
  adsenseId: process.env.NEXT_PUBLIC_ADSENSE_ID ?? "",
  contactEmail: "hello@example.com",
  taxYear: 2026,
} as const;

export function absoluteUrl(path: string): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
