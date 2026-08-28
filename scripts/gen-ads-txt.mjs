#!/usr/bin/env node
/**
 * public/ads.txt 생성.
 *
 * 애드센스는 **도메인 루트**의 ads.txt 를 요구한다. 프로젝트 저장소로
 * GitHub Pages 에 올리면 사이트가 /<repo>/ 하위에 놓여 루트에 파일을 둘 수 없으므로,
 * 커스텀 도메인이나 Cloudflare Pages 로 루트 배포해야 한다.
 *
 * NEXT_PUBLIC_ADSENSE_ID 가 없으면 아무것도 만들지 않는다 (승인 전 상태).
 */
import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const publisherId = (process.env.NEXT_PUBLIC_ADSENSE_ID ?? "").trim();
const target = path.join(process.cwd(), "public", "ads.txt");

if (!publisherId) {
  if (existsSync(target)) await rm(target);
  console.log("[ads.txt] NEXT_PUBLIC_ADSENSE_ID 미설정 — 건너뜀");
  process.exit(0);
}

if (!/^pub-\d{16}$/.test(publisherId)) {
  console.error(`[ads.txt] 잘못된 게시자 ID 형식: "${publisherId}" (pub- + 숫자 16자리여야 함)`);
  process.exit(1);
}

await mkdir(path.dirname(target), { recursive: true });
await writeFile(target, `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, "utf8");
console.log(`[ads.txt] 생성 완료 — ${publisherId}`);
