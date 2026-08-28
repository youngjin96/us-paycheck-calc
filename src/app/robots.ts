import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// 정적 export 에서 파일로 뽑히도록 강제한다
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
