import type { MetadataRoute } from "next";
import { SITE, absoluteUrl } from "@/lib/site";

// 정적 export 에서 파일로 뽑히도록 강제한다
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // 실험 배포는 통째로 크롤링을 막는다
  if (SITE.noindex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
