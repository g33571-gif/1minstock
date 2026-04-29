import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadingProgress from '@/components/common/LoadingProgress';
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <script 
          async 
          src="//t1.daumcdn.net/kas/static/ba.min.js"
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
        
        {/* 메인 콘텐츠 영역 - 헤더 아래부터 광고 시작 */}
        <main className="max-w-6xl mx-auto px-4 py-4">
          <div className="lg:grid lg:grid-cols-[1fr_336px] lg:gap-8">
            
            {/* 메인 영역 */}
            <div className="max-w-[760px] mx-auto w-full lg:mx-0">
              {children}
              <Footer />
            </div>

            {/* 우측 광고 (PC만) - 헤더 아래부터 시작 */}
            <aside className="hidden lg:flex lg:flex-col lg:gap-4">
              {/* 우측 상단 광고 (Static) - 336x280 */}
              <div className="bg-bg-subtle border border-dashed border-slate-300 rounded-xl p-3 text-center">
                <div className="text-[10px] text-slate-500 font-semibold mb-1">AD · 광고</div>
                <div className="text-xs text-slate-400 flex items-center justify-center" style={{ minHeight: '280px' }}>
                  [ 336×280 ]
                </div>
              </div>
              
              {/* 우측 중간 광고 (Sticky) - 300x600 */}
              <div className="ad-sticky ad-sticky-middle">
                <div className="bg-bg-subtle border border-dashed border-slate-300 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-slate-500 font-semibold mb-1">AD · 광고</div>
                  <div className="text-xs text-slate-400 flex items-center justify-center" style={{ minHeight: '600px' }}>
                    [ 300×600 ]
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </body>
    </html>
  );
}
