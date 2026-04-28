# 1MINSTOCK

> 1분이면 끝나는 종목 분석 — 위험 신호부터 외국인 동향까지

## 🎯 프로젝트 개요

- **도메인**: 1minstock.com
- **운영**: 벨롱스
- **문의**: 77rrr11@gmail.com
- **기술 스택**: Next.js 14 + React 18 + TypeScript + Tailwind CSS

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 `.env.local`로 복사하고 값을 입력하세요.

```bash
cp .env.example .env.local
```

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인 가능.

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
app/                          # Next.js App Router
├── layout.tsx               # 전체 레이아웃 (헤더+푸터+광고)
├── page.tsx                 # 메인 페이지
├── globals.css              # 전역 스타일
├── [stockCode]/page.tsx     # 종목 상세 (예: /005930)
├── search/page.tsx          # 검색 결과
├── terms/page.tsx           # 이용약관
├── privacy/page.tsx         # 개인정보 처리방침
├── not-found.tsx            # 404
├── robots.ts                # robots.txt
├── sitemap.ts               # sitemap.xml
└── api/
    └── market-indices/      # 시장 지수 API

components/
├── common/                  # 공통 (Logo, Disclaimer)
├── layout/                  # 레이아웃 (Header, Footer, AdSlot)
├── home/                    # 메인 페이지
└── stock/                   # 종목 상세 (14개 섹션)

lib/
├── types.ts                 # 데이터 타입 정의
├── utils.ts                 # 유틸 함수
└── mockData.ts              # 임시 데이터 (개발용)
```

## 🎨 디자인 시스템

### 시그니처 컬러

- **메인**: `#047857` (Emerald Green)
- **액센트**: `#F59E0B` (Amber Gold)
- **상승/매수**: `#DC2626` (한국식 빨강)
- **하락/매도**: `#1E40AF` (한국식 파랑)

### 타이포그래피

- **폰트**: Pretendard Variable
- **본문**: 14-15px
- **제목**: 18px (semibold)
- **가격**: 24-26px (semibold)

## 📊 광고 배치

### 모바일 (3개 슬롯, 모두 Static)
- 헤더 아래 (320×100)
- 본문 중간 (320×100)
- 가치 제안 후 (320×100)

### PC (4개 슬롯, 부분 Sticky)
- 좌측 사이드 (300×600) — Sticky
- 우측 상단 (300×250) — Static
- 우측 중간 (300×250) — Sticky
- 본문 가로 (728×90) — Static

## ⚖️ 법적 안전성

- ✅ 이용약관 (`/terms`)
- ✅ 개인정보 처리방침 (`/privacy`)
- ✅ 면책 문구 모든 페이지
- ✅ 사업자 정보 (벨롱스, 77rrr11@gmail.com)
- ✅ 데이터 출처 명시 (네이버/DART/KIND)
- ✅ 광고 라벨 ("AD · 광고")

## 🚢 배포 (Vercel)

### 1. GitHub 푸시

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercel 연동

1. https://vercel.com 접속
2. Import Project → GitHub 저장소 선택
3. 환경 변수 설정 (.env.example 참고)
4. Deploy

### 3. 도메인 연결

1. Vercel 프로젝트 → Settings → Domains
2. `1minstock.com` 추가
3. Gabia에서 DNS 설정:
   - A 레코드: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`

## 📋 향후 작업 (TODO)

### Phase 2: 실제 데이터 연동
- [ ] 네이버 금융 크롤링 (lib/crawlers/naver.ts)
- [ ] DART API 연동 (lib/crawlers/dart.ts)
- [ ] KRX KIND 거래소 정보 (lib/crawlers/kind.ts)
- [ ] Vercel KV 캐싱
- [ ] Cron 작업 (일일 데이터 업데이트)

### Phase 3: 추가 기능
- [ ] 검색 자동완성
- [ ] 즐겨찾기 (쿠키)
- [ ] 다크모드
- [ ] 알림 구독

### Phase 4: 광고 활성화
- [ ] Kakao AdFit 코드 적용
- [ ] Google AdSense 신청 → 승인 후 활성화

## 📞 문의

- 운영: 벨롱스
- 이메일: 77rrr11@gmail.com

---

© 2026 1MINSTOCK. All rights reserved.
