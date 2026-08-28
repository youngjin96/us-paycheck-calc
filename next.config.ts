import type { NextConfig } from "next";

/**
 * 정적 호스팅(GitHub Pages / Cloudflare Pages) 배포용 설정.
 *
 * - output: "export"  → 서버 없이 out/ 에 정적 HTML 을 뽑는다
 * - trailingSlash     → /paycheck/california/index.html 로 나와야 404 없이 서빙된다
 * - basePath          → 프로젝트 저장소(username.github.io/<repo>)로 배포할 때만 채운다
 *                       커스텀 도메인을 붙이면 비워둘 것 (ads.txt 가 루트에 있어야 함)
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: {
    // 정적 호스팅에는 이미지 최적화 서버가 없다
    unoptimized: true,
  },
};

export default nextConfig;
