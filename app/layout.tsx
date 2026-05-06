import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadingProgress from '@/components/common/LoadingProgress';
import AdfitBanner from '@/components/ads/AdfitBanner';
import CoupangBanner from '@/components/ads/CoupangBanner';
import './globals.css';

export const metadata: Metadata = {
  title: '1MINSTOCK | 1분이면 끝나는 종목 분석',
  description: '위험 신호부터 외국인 동향까지, 핵심만 모아 한 화면에. 관리·환기종목 자동 감지, PER/PBR/실적까지 한 카드에.',
  keywords: '주식, 종목 분석, 관리종목, 환기종목, 외국인 매매, PER, PBR, 시가총액, 실적발표',
  authors: [{ name: '벨롱스' }],
  openGraph: {
    title: '1MINSTOCK | 1분이면 끝나는 종목 분석',
    description: '위험 신호부터 외국인 동향까지, 핵심만 모아 한 화면에.',
    url: 'https://1minstock.com',
    siteName: '1MINSTOCK',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '1MINSTOCK | 1분이면 끝나는 종목 분석',
    description: '위험 신호부터 외국인 동향까지, 핵심만 모아 한 화면에.',
  },
  robots: {
    index: true,
    follow: true,
  },
  // ⭐ 검색엔진 도메인 소유권 인증
  verification: {
    google: '_tNatl-zq2FkCGHWgcAgHUl5He0jrb3upznlRbuIO3M',
    other: {
      'naver-site-verification': '108cb99db7a77718bc4e2d4bef8dece74748db16',
    },
  },
};

const ADFIT_SIDEBAR_TOP = process.env.NEXT_PUBLIC_ADFIT_SIDEBAR_TOP || 'DAN-lLo0fplyrA1YBk9Q';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 카카오 애드핏 SDK - 최신 공식 URL (kakaocdn.net) */}
        <script
          async
          type="text/javascript"
          src="//t1.kakaocdn.net/kas/static/ba.min.js"
        />
      </head>
      <body className="bg-bg-page">
        <Suspense fallback={null}>
          <LoadingProgress />
        </Suspense>

        {/* 헤더 - 전체 너비 단독 영역 (광고와 분리) */}
        <header className="sticky top-0 z-40 bg-bg-page/95 backdrop-blur-sm border-b border-emerald-700/[0.06]">
          <div className="max-w-6xl mx-auto">
            <Header />
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className="max-w-6xl mx-auto px-4 py-4">
          <div className="lg:grid lg:grid-cols-[1fr_336px] lg:gap-8">

            {/* 메인 영역 */}
            <div className="max-w-[760px] mx-auto w-full lg:mx-0">
              {children}
              <Footer />
            </div>

            {/* 우측 광고 (PC만) - 광고 2개로 정리 */}
            <aside className="hidden lg:flex lg:flex-col lg:gap-4">

              {/* 우측 상단 애드핏 - 300×250 (Above the Fold) 🟢 */}
              <div className="bg-white rounded-xl p-2 shadow-sm">
                <AdfitBanner
                  adUnit={ADFIT_SIDEBAR_TOP}
                  width={300}
                  height={250}
                />
              </div>

              {/* 우측 sticky 쿠팡 - 300×250 캐러셀 🟦 */}
              <div className="ad-sticky ad-sticky-middle">
                <div className="bg-white rounded-xl p-2 shadow-sm">
                  <CoupangBanner
                    variant="square"
                    subId="sidebar-sticky"
                  />
                </div>
              </div>
            </aside>
          </div>
        </main>
      </body>
    </html>
  );
}
