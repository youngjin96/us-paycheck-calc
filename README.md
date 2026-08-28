# US Paycheck & Tax Calculator (가칭)

미국 급여·세금 계산 유틸리티 사이트. **영어권(주로 US) 검색 유입 → 애드센스 수익**을 전제로 만든다.

핵심 전략은 "AI가 대신 답해줄 수 없는 것"에 붙는 것이다.

1. **사용자 입력이 필요** — 급여를 넣어야 답이 나오므로 AI Overviews 가 결과를 가로채지 못한다
2. **매년 바뀌는 데이터** — 연방/주 세율, 공제 한도, Social Security wage base → 재방문·재크롤 발생
3. **주(state)별로 답이 갈림** — 50개 주 × 시나리오로 페이지가 자연 증식

CPC 가 가장 높은 카테고리(personal finance)이면서 계산기라는 형태 덕분에 방어력이 있는 조합.

---

## 기술 스택

| | |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router) + TypeScript |
| 스타일 | Tailwind CSS v4 |
| 빌드 | **정적 export** (`output: "export"`) — 서버·DB·런타임 API 없음 |
| 계산 | 100% 클라이언트 사이드 JS |
| 데이터 | 저장소 안의 JSON (연 1회 갱신) |
| 배포 | GitHub Actions → GitHub Pages 또는 Cloudflare Pages |

### 왜 서버가 없는가

세율표는 **연 1회 바뀌는 정적 데이터**라 런타임 조회가 필요 없다. 빌드 타임에
JSON 을 읽어 페이지를 찍으면 끝이다. 부가 효과로 *"당신의 급여 정보는 서버로 전송되지
않습니다"* 라는 신뢰 요소가 생기는데, 개인 재무 정보를 입력받는 사이트에서 이건 꽤 크다.

### 왜 Astro 가 아니라 Next 인가

`lotto-stats` 에서 동일한 구조(정적 export + Pages + 애드센스 + 대량 페이지 생성)를
이미 검증했다. 새 프레임워크를 익히는 비용보다 검증된 파이프라인 재사용이 낫다.

---

## 배포 / 도메인

> **커스텀 도메인이 사실상 필수다.**

애드센스는 도메인 **루트**의 `ads.txt` 를 요구한다.
`username.github.io/<repo>/` 형태(프로젝트 저장소)로 배포하면
`username.github.io/ads.txt` 를 만들 수 없어 승인이 막힌다.
그리고 사용자 Pages 저장소(`youngjin96.github.io`) 슬롯은 이미 `lotto-stats` 가 쓰고 있다.

→ 도메인 구매(연 $10~15) 후 아래 중 하나:

- **GitHub Pages + 커스텀 도메인** — `public/CNAME` 추가, `NEXT_PUBLIC_BASE_PATH` 비움
- **Cloudflare Pages** (권장) — 무제한 대역폭, `_redirects`/`_headers` 로 301·캐시 제어,
  상용 이용 제약 없음. 워크플로는 동일하게 git push → 자동 빌드

`NEXT_PUBLIC_BASE_PATH` 를 비워두면 어느 쪽이든 루트 배포로 동작한다.

---

## 데이터 소스 (연 1회 갱신)

| 항목 | 출처 |
| --- | --- |
| 연방 세율·표준공제 | IRS Rev. Proc. (연간 물가연동 조정) |
| 연방 원천징수 | IRS Publication 15-T |
| Social Security wage base | SSA 연간 발표 |
| FICA | SS 6.2% (wage base 까지) + Medicare 1.45% + $200k 초과분 0.9% |
| 주 소득세 | 각 주 Department of Revenue 원천징수 표 |
| 지방세 | NYC, Philadelphia 등 city/local tax 개별 확인 |

`data/` 에 연도별 JSON 으로 보관하고, 과거 연도 페이지는 그대로 남겨 롱테일 유입을 받는다.

---

## 로드맵

### Phase 1 — 애드센스 승인용 (페이지 10~15개)

> 페이지 수를 먼저 늘리지 않는다. 템플릿에 숫자만 바꿔 50개 주를 찍어내면
> Google 의 **scaled content abuse** 정책과 애드센스 thin content 반려에 걸린다.
> 각 주 페이지에는 그 주에만 해당하는 실질적 내용(주 소득세 유무, city tax,
> 특수 공제, 실업보험 요율)이 있어야 한다.

- [ ] 메인 take-home paycheck calculator (연방 + FICA)
- [ ] 검색량 상위 주 5~8개 (CA / TX / NY / FL / IL / WA / NJ / PA)
- [ ] salary ↔ hourly 변환
- [ ] bonus tax withholding
- [ ] About / Privacy Policy / Contact / Disclaimer (애드센스 필수)

### Phase 2 — 확장

- [ ] 50개 주 전체
- [ ] 1099 vs W-2 비교
- [ ] Roth 전환, RSU 세금
- [ ] 연도별 아카이브 페이지

### Phase 3 — 수익 최적화

- [ ] 애드센스 → 월 1만 세션 시 Mediavine Journey → 10만 PV 시 Raptive

---

## 개발

```bash
npm run dev      # 개발 서버
npm run build    # out/ 에 정적 파일 생성
npx serve out    # 빌드 결과 미리보기
```

## 체크리스트 (애드센스)

- [ ] 커스텀 도메인 연결
- [ ] `ads.txt` 루트 배포 (빌드 스크립트로 생성)
- [ ] Privacy Policy — 쿠키/개인화 광고 고지 포함
- [ ] GDPR/CCPA 동의 배너 (EU·CA 트래픽 대비)
- [ ] 각 계산기 페이지에 "세무 자문이 아님" disclaimer
- [ ] Google Search Console 등록 + sitemap 제출
