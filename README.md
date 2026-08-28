# PaycheckLab — US Paycheck & Tax Calculator

미국 급여·세금 계산 유틸리티 사이트. **영어권(주로 US) 검색 유입 → 애드센스 수익**을 전제로 만든다.

핵심 전략은 "AI가 대신 답해줄 수 없는 것"에 붙는 것이다.

1. **사용자 입력이 필요** — 급여를 넣어야 답이 나오므로 AI Overviews 가 결과를 가로채지 못한다
2. **매년 바뀌는 데이터** — 연방/주 세율, 공제 한도, Social Security wage base → 재방문·재크롤 발생
3. **주(state)별로 답이 갈림** — 50개 주 × 시나리오로 페이지가 자연 증식

차별화 포인트는 **대부분의 무료 계산기가 빼먹는 주 급여공제 항목**이다.
캘리포니아 SDI(임금상한 없음), 워싱턴 PFML·WA Cares, 뉴저지의 3중 공제, 펜실베이니아의
401(k) 과세 — 이것들이 실제 pay stub 과 온라인 계산기가 안 맞는 이유다.

---

## 현재 상태

| | |
| --- | --- |
| 페이지 | 21개 정적 페이지 (계산기 3 + 주별 8 + 안내 5 + 시스템) |
| 대상 주 | CA, TX, NY, FL, IL, WA, NJ, PA |
| 과세연도 | 2026 |
| 테스트 | 25개 (계산 엔진) |
| 배포 | 미배포 — 도메인 결정 대기 |

## 기술 스택

| | |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router) + TypeScript |
| 스타일 | Tailwind CSS v4 (CSS 변수 기반 라이트/다크 테마) |
| 빌드 | **정적 export** (`output: "export"`) — 서버·DB·런타임 API 없음 |
| 계산 | 100% 클라이언트 사이드 JS |
| 테스트 | Vitest |
| 배포 | GitHub Actions → Cloudflare Pages |

### 왜 서버가 없는가

세율표는 **연 1회 바뀌는 정적 데이터**라 런타임 조회가 필요 없다. 부가 효과로
*"입력한 급여 정보가 서버로 전송되지 않습니다"* 라는 신뢰 요소가 생기는데,
개인 재무 정보를 입력받는 사이트에서 이건 꽤 크다. 마케팅 문구가 아니라 사실이다 —
보낼 백엔드 자체가 없다.

---

## 구조

```
src/
  lib/tax/
    types.ts       세금 관련 타입 정의
    federal.ts     2026 연방 구간·표준공제, 누진 계산
    fica.ts        Social Security / Medicare
    state.ts       주 소득세·지역세·급여공제 계산
    bonus.ts       추가급여(보너스) 정률 원천징수
    calculate.ts   오케스트레이터 — 급여 명세 한 회차를 세목별로 분해
    format.ts      통화·비율 포맷
    calculate.test.ts
  data/
    states.ts         주별 세율·임금상한 설정 (2026)
    state-content.ts  주별 편집 콘텐츠 (thin content 방지)
  components/
    PaycheckCalculator.tsx  메인 계산기 (client)
    BonusCalculator.tsx
    SalaryConverter.tsx
    StateComparison.tsx     빌드 타임에 엔진을 돌려 주별 비교표 생성
    Faq.tsx                 FAQPage 구조화 데이터 포함
  app/
    page.tsx                  메인 계산기
    paycheck/[state]/         주별 페이지 (generateStaticParams)
    salary-to-hourly/
    bonus-tax/
    methodology/ about/ contact/ privacy/ disclaimer/
    sitemap.ts robots.ts
```

### 계산 로직에서 중요한 부분

세목마다 과세표준이 다르다는 점을 정확히 구현했다. 이게 다른 계산기와 갈리는 지점이다.

- **401(k)** — 소득세는 줄이지만 FICA 는 줄이지 않는다. 단, **펜실베이니아는 주 소득세도 줄지 않는다**
- **Section 125** (건강보험료·HSA·FSA) — 소득세와 FICA 를 모두 줄인다
- **지역세 과세표준이 제각각** — 필라델피아 Wage Tax 는 총급여, NYC 는 주 과세표준, 용커스는 주 세액의 16.75%
- **임금상한** — SS $184,500, NJ UI $44,800 vs TDI/FLI $171,100, NY PFL 은 연 $411.91 상한

---

## 데이터 정확성

**[DATA-SOURCES.md](./DATA-SOURCES.md) 에 모든 수치의 출처와 검증 상태를 정리했다.**
✅ 검증됨 / ⚠️ 출시 전 1차 출처 확인 필요로 구분되어 있으니, **배포 전에 ⚠️ 항목을 처리할 것.**

테스트는 손으로 계산한 기대값과 대조한다. 예를 들어 뉴저지 TDI 최대 부담액이
공표치 $325.09 와 일치하는지 검증하는 식으로, 요율과 임금상한을 교차 확인한다.

```bash
npm test
```

---

## 개발

```bash
npm run dev      # 개발 서버
npm test         # 계산 엔진 테스트
npm run build    # out/ 에 정적 파일 생성
npm run preview  # 빌드 결과 미리보기
```

### 환경 변수

`.env.example` 참고. 로컬에서는 `.env.local` 에 둔다.

| 변수 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | canonical URL·sitemap·OG 태그 |
| `NEXT_PUBLIC_ADSENSE_ID` | 설정 시 광고 스크립트 + `ads.txt` 자동 생성 |
| `NEXT_PUBLIC_BASE_PATH` | GitHub Pages **프로젝트** 저장소 배포 시에만 |

---

## 배포 / 도메인

> **커스텀 도메인이 사실상 필수다.**

애드센스는 도메인 **루트**의 `ads.txt` 를 요구한다. `username.github.io/<repo>/` 형태로
배포하면 `username.github.io/ads.txt` 를 만들 수 없어 승인이 막힌다. 그리고 사용자
Pages 저장소(`youngjin96.github.io`) 슬롯은 이미 `lotto-stats` 가 쓰고 있다.

→ 도메인 구매 후 **Cloudflare Pages** 권장 (무제한 대역폭, `_headers`/`_redirects` 지원,
상용 이용 제약 없음). `.github/workflows/deploy.yml` 이 준비되어 있고, 아래만 등록하면 된다.

| 종류 | 이름 |
| --- | --- |
| Secret | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` |
| Variable | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADSENSE_ID` (승인 후) |

---

## 로드맵

### Phase 1 — 애드센스 승인 (현재)

- [x] 계산기 3종 (급여·시급환산·보너스)
- [x] 주별 페이지 8개 — 각 주 고유 내용 포함
- [x] Methodology / About / Contact / Privacy / Disclaimer
- [x] sitemap.xml, robots.txt, ads.txt 자동 생성
- [ ] DATA-SOURCES.md 의 ⚠️ 항목 1차 출처 검증
- [ ] 도메인 구매 + Cloudflare Pages 연결
- [ ] GDPR/CCPA 동의 배너
- [ ] Search Console 등록 + sitemap 제출
- [ ] 애드센스 신청

> **주 확장은 승인 이후에.** 템플릿에 숫자만 바꿔 50개 주를 찍어내면 Google 의
> scaled content abuse 정책과 애드센스 thin content 반려에 걸린다. 각 주 페이지에는
> `state-content.ts` 처럼 그 주에서만 성립하는 내용이 있어야 한다.

### Phase 2 — 확장

- [ ] 50개 주 전체 (주당 고유 콘텐츠 확보 전제)
- [ ] 1099 vs W-2 비교
- [ ] 연도별 아카이브 (`data/2026.ts`, `data/2027.ts` 로 분리 리팩터링 필요)
- [ ] RSU·Roth 전환 계산기

### Phase 3 — 수익 최적화

- [ ] 애드센스 → 월 1만 세션 시 Mediavine Journey → 10만 PV 시 Raptive
