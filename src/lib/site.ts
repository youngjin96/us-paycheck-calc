const DEFAULT_SITE_URL = "https://example.com";

/**
 * 사이트 URL 정규화.
 *
 * CI 에서 미설정 변수는 undefined 가 아니라 **빈 문자열**로 전달된다.
 * `??` 로는 걸러지지 않아 new URL("") 이 터지므로, 값이 실제로 URL 로
 * 파싱되는지까지 확인하고 안 되면 기본값으로 되돌린다.
 */
export function resolveSiteUrl(raw: string | undefined): string {
  const trimmed = (raw ?? "").trim().replace(/\/+$/, "");
  if (!trimmed) return DEFAULT_SITE_URL;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return DEFAULT_SITE_URL;
    return trimmed;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

/**
 * 사이트 전역 설정. 도메인이 정해지면 NEXT_PUBLIC_SITE_URL 만 바꾸면 된다.
 */
export const SITE = {
  name: "PaycheckLab",
  tagline: "2026 US paycheck & tax calculators",
  description:
    "Free 2026 take-home pay calculators for all 50 states. See exactly how federal tax, FICA, state income tax and state payroll deductions hit your paycheck.",
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  /** 애드센스 게시자 ID (pub-XXXXXXXXXXXXXXXX). 미설정 시 광고 스크립트와 ads.txt 를 넣지 않는다. */
  adsenseId: (process.env.NEXT_PUBLIC_ADSENSE_ID ?? "").trim(),
  contactEmail: "hello@example.com",
  taxYear: 2026,
  /**
   * 검색엔진 색인 차단.
   *
   * 임시 호스트(github.io 등)에 올린 실험 배포가 색인되면, 나중에 실제 도메인으로
   * 옮길 때 같은 콘텐츠가 두 URL 에 존재해 신호가 갈린다. 실 도메인 배포에서만
   * 이 값을 비워둘 것.
   */
  noindex: (process.env.NEXT_PUBLIC_NOINDEX ?? "").trim() === "1",
} as const;

export function absoluteUrl(path: string): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
