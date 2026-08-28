import type { MetadataRoute } from "next";
import { STATES } from "@/data/states";
import { absoluteUrl } from "@/lib/site";

/** 정적 export 시 빌드 타임에 sitemap.xml 로 출력된다. */
// 정적 export 에서 파일로 뽑히도록 강제한다
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const tools = ["/", "/salary-to-hourly/", "/bonus-tax/"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.9,
  }));

  const statePages = STATES.map((s) => ({
    url: absoluteUrl(`/paycheck/${s.slug}/`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const info = ["/methodology/", "/about/", "/contact/", "/privacy/", "/disclaimer/"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [...tools, ...statePages, ...info];
}
