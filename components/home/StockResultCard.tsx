'use client';

import AdfitBanner from '@/components/ads/AdfitBanner';
import CoupangBanner from '@/components/ads/CoupangBanner';

// 광고 단위 ID
const ADFIT_MOBILE_320 = process.env.NEXT_PUBLIC_ADFIT_MOBILE_BANNER || 'DAN-lx9Cj2krmA4R3Rp0';

interface ValuationCompare {
  industryName: string;
  myValue: number;
  industryAvg: number;
  diffPercent: number;
  label: '저평가' | '적정' | '고평가';
  color: 'blue' | 'gray' | 'red';
}

interface CompanyOverview {
  headline: string;
  detail: string;
}

interface StockResult {
  code: string; name: string; market: string;
  industryName: string | null;
  companyOverview: CompanyOverview | null;
  price: number; change: number; changePercent: number;
  openToday: number; highToday: number; lowToday: number;
  marketCap: string; volume: number; volumeRatio: number;
  high52w: number; low52w: number; pricePos: number;
  per: number; pbr: number; dividendYield: number;
  foreignOwnership: number; institutionOwnership: number; individualOwnership: number;
  foreign5d: number; institution5d: number; individual5d: number;
  foreignConsecutiveDays: number; institutionConsecutiveDays: number;
  perCompare: ValuationCompare | null;
  pbrCompare: ValuationCompare | null;
  aiBriefing: { signal1: string; signal2: string; signal3: string } | null;
  latestNews: { title: string; time: string; url: string } | null;
  aiNewsAnalysis: {
    comment: string;
    selectedNews: Array<{
      title: string;
      time: string;
      url: string;
      daysAgo: number;
    }>;
  } | null;
  // ⭐ V2: DART 공시 + 구글뉴스 통합
  aiNewsV2: {
    comment: string;
    filings: Array<{
      title: string;
      date: string;
      url: string;
      daysAgo: number;
      reportName: string;
    }>;
    newsItems: Array<{
      title: string;
      link: string;
      source: string;
      daysAgo: number;
    }>;
    hasData: boolean;
  } | null;
  riskSignal: {
    hasRisk: boolean;
    level: 'critical_unbuyable' | 'critical' | 'warning' | 'caution' | 'info' | null;
    items: Array<{
      level?: string;
      type: string;
      label: string;
      color: 'black' | 'red' | 'orange' | 'amber' | 'gray' | 'blue';
      description: string;
      caution?: string;
    }>;
  };
}

function fmt(n: number) { return n.toLocaleString('ko-KR'); }

export default function StockResultCard({ data, onClose }: {
  data: StockResult; onClose: () => void;
}) {
  const posLabel =
    data.pricePos <= 20 ? '저점 근처' :
    data.pricePos <= 40 ? '저점~중간' :
    data.pricePos <= 60 ? '중간 구간' :
    data.pricePos <= 80 ? '중간~고점' : '고점 근처';

  const fromLow = data.low52w > 0
    ? Math.round(((data.price - data.low52w) / data.low52w) * 100)
    : 0;
  const fromHigh = data.high52w > 0
    ? Math.round(((data.price - data.high52w) / data.high52w) * 100)
    : 0;

  return (
    <div style={{ animation: 'slideDown 0.25s ease' }}>
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}`}</style>

      {/* ⭐ 종목 정보 카드 - AI 브리핑과 통일된 시그니처 디자인 */}
      <div className="bg-emerald-900 rounded-2xl border-2 border-amber-400 p-4 mb-3">
        {/* 라벨 (AI 브리핑과 동일 스타일) */}
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-amber-400 rounded-md px-2.5 py-1 flex items-center gap-1.5 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-900"></div>
            <span className="text-[10px] font-semibold text-emerald-900">종목 정보</span>
          </div>
          <span className="text-[9px] text-emerald-300">{data.market} · {data.code}</span>
        </div>

        {/* 종목명 */}
        <div className="text-[26px] font-medium text-white mb-3 leading-tight">{data.name}</div>

        {/* 업종 + 시총 */}
        <div className="flex items-center gap-2 pb-3 border-b border-amber-400/30 mb-3">
          {data.industryName && (
            <>
              <span className="bg-amber-400 text-emerald-900 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                {data.industryName}
              </span>
              <span className="text-emerald-400/40 text-[11px]">·</span>
            </>
          )}
          <span className="text-[12px] text-emerald-200">
            시총 <strong className="text-white font-medium">{data.marketCap}</strong>
          </span>
        </div>

        {/* 사업 분야 (AI 브리핑과 같은 동그라미 형식) */}
        {data.companyOverview ? (
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px]">💼</span>
            </div>
            <div>
              <div className="text-[10px] font-medium text-amber-300 mb-0.5">사업 분야</div>
              <div className="text-[13px] text-white font-medium leading-snug mb-0.5">
                {data.companyOverview.headline}
              </div>
              <div className="text-[11px] text-emerald-200">
                {data.companyOverview.detail}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px]">💼</span>
            </div>
            <div>
              <div className="text-[10px] font-medium text-amber-300 mb-0.5">사업 분야</div>
              <div className="text-[12px] text-emerald-200">
                {data.industryName ? `${data.industryName} 분야 기업` : '한국 상장 기업'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI 브리핑 - 메인 무기 (기존 스타일 유지) */}
      <div className="bg-emerald-900 rounded-2xl p-4 mb-3 border-2 border-amber-400">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-amber-400 rounded-md px-2.5 py-1 flex items-center gap-1.5 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-900"></div>
            <span className="text-[10px] font-semibold text-emerald-900">AI 브리핑</span>
          </div>
          <span className="text-[9px] text-emerald-300">공개 데이터 자동 요약 · 참고용</span>
        </div>
        {data.aiBriefing ? (
          <div className="space-y-2">
            {[
              { num: '①', label: '수급',   text: data.aiBriefing.signal1 },
              { num: '②', label: '거래량', text: data.aiBriefing.signal2 },
              { num: '③', label: '밸류',   text: data.aiBriefing.signal3 },
            ].map(({ num, label, text }) => (
              <div key={label} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[9px] font-medium text-amber-300">{num}</span>
                </div>
                <div>
                  <span className="text-[10px] font-medium text-emerald-300 mr-1.5">{label}</span>
                  <span className="text-[12px] text-white leading-snug">{text}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-emerald-200">
            {data.market} 상장 · 공개 데이터 분석 준비 중
          </p>
        )}
        <p className="text-[9px] text-emerald-400/50 mt-2">
          ※ 공개 시장 데이터 자동 요약 · 투자 권유 아님
        </p>
      </div>

      {/* 위험신호 - 5단계 레벨 (의미별 색상 유지) */}
      {data.riskSignal?.hasRisk && (() => {
        const level = data.riskSignal.level;
        const styles: Record<string, any> = {
          critical_unbuyable: {
            bg: 'bg-slate-900', border: 'border-slate-900', iconBg: 'bg-red-600',
            titleColor: 'text-white', descColor: 'text-red-300',
            title: '🚨 매수 불가 종목', subtitle: '거래 자체가 정지되었거나 상장폐지 진행 중',
            cardBg: 'bg-slate-800', cardText: 'text-white',
          },
          critical: {
            bg: 'bg-red-50', border: 'border-red-500', iconBg: 'bg-red-600',
            titleColor: 'text-red-900', descColor: 'text-red-700',
            title: `매우 위험 ${data.riskSignal.items.length}건`, subtitle: '투자 시 매우 큰 위험이 따를 수 있습니다',
            cardBg: 'bg-white', cardText: 'text-slate-800',
          },
          warning: {
            bg: 'bg-orange-50', border: 'border-orange-500', iconBg: 'bg-orange-500',
            titleColor: 'text-orange-900', descColor: 'text-orange-700',
            title: `투자 경고 ${data.riskSignal.items.length}건`, subtitle: '주가 변동이 크거나 위험성이 있는 종목',
            cardBg: 'bg-white', cardText: 'text-slate-800',
          },
          caution: {
            bg: 'bg-amber-50', border: 'border-amber-400', iconBg: 'bg-amber-500',
            titleColor: 'text-amber-900', descColor: 'text-amber-700',
            title: `투자 주의 ${data.riskSignal.items.length}건`, subtitle: '투자 위험성을 검토하세요',
            cardBg: 'bg-white', cardText: 'text-slate-800',
          },
          info: {
            bg: 'bg-slate-50', border: 'border-slate-300', iconBg: 'bg-slate-500',
            titleColor: 'text-slate-900', descColor: 'text-slate-700',
            title: '특이 종목 안내', subtitle: '일반 종목과 성격이 다른 종목',
            cardBg: 'bg-white', cardText: 'text-slate-800',
          },
        };
        const s = styles[level || 'info'] || styles.info;
        const itemColors: Record<string, string> = {
          black: 'bg-slate-900 text-white', red: 'bg-red-600 text-white',
          orange: 'bg-orange-500 text-white', amber: 'bg-amber-500 text-white',
          gray: 'bg-slate-500 text-white', blue: 'bg-blue-500 text-white',
        };
        const borderColors: Record<string, string> = {
          black: 'border-slate-900', red: 'border-red-600',
          orange: 'border-orange-500', amber: 'border-amber-500',
          gray: 'border-slate-500', blue: 'border-blue-500',
        };

        return (
          <div className={`${s.bg} border-2 ${s.border} rounded-2xl p-4 mb-3`}>
            <div className="flex items-center gap-2 mb-2.5">
              <div className={`w-7 h-7 ${s.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className={`text-[13px] font-medium ${s.titleColor}`}>{s.title}</div>
                <div className={`text-[10px] ${s.descColor}`}>{s.subtitle}</div>
              </div>
            </div>
            <div className="space-y-1.5">
              {data.riskSignal.items.map((r, i) => (
                <div key={i} className={`${s.cardBg} rounded-lg p-2.5 border-l-[3px] ${borderColors[r.color] || 'border-slate-500'}`}>
                  <div className="flex items-start gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 ${itemColors[r.color] || 'bg-slate-500 text-white'} rounded-full font-medium flex-shrink-0`}>
                      {r.label}
                    </span>
                    <span className={`text-[11px] leading-snug font-medium ${s.cardText}`}>{r.description}</span>
                  </div>
                  {r.caution && (
                    <div className={`text-[10px] ml-1 ${level === 'critical_unbuyable' ? 'text-red-200' : 'text-slate-500'}`}>※ {r.caution}</div>
                  )}
                </div>
              ))}
            </div>
            <div className={`text-[9px] mt-2 text-right ${level === 'critical_unbuyable' ? 'text-slate-400' : 'text-slate-500'}`}>
              출처: 한국거래소 KRX 공식 데이터
            </div>
          </div>
        );
      })()}

      {/* ⭐ 광고 슬롯 1 - 위험신호 후 (모바일 + PC) - 쿠팡 사각 300×250 */}
      <div className="mb-3 flex justify-center">
        <CoupangBanner variant="square" subId="result-after-risk" />
      </div>

      {/* 1년 가격 위치 - 흰색 카드 (가독성, 시각적 휴식) */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="text-[12px] font-medium text-slate-800 mb-3 flex items-center gap-1.5">
          <span>📊</span> 1년 가격 위치
        </div>

        {/* 게이지 위 큰 인포 */}
        <div className="flex items-center justify-center gap-6 py-3 mb-4 border-y border-slate-100">
          <div className="text-center">
            <div className="text-[10px] text-red-700 font-medium mb-1">최저 대비</div>
            <div className="text-[24px] font-bold text-red-600 leading-none">
              {fromLow >= 0 ? '+' : ''}{fromLow}%
            </div>
          </div>
          <div className="w-px h-10 bg-slate-200"></div>
          <div className="text-center">
            <div className="text-[10px] text-blue-800 font-medium mb-1">최고 대비</div>
            <div className="text-[24px] font-bold text-blue-600 leading-none">
              {fromHigh >= 0 ? '+' : ''}{fromHigh}%
            </div>
          </div>
        </div>

        {/* 게이지 */}
        <div className="relative h-3 rounded-full overflow-visible mb-3"
          style={{ background: 'linear-gradient(to right,#1d4ed8,#9ca3af 50%,#dc2626)' }}>
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-[3px] border-emerald-700 rounded-full"
            style={{ left: `clamp(0px, calc(${data.pricePos}% - 8px), calc(100% - 16px))` }} />
        </div>

        {/* 최저/최고 */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-[9px] text-blue-600 font-medium">최저</div>
            <div className="text-[11px] font-medium">{fmt(data.low52w)}원</div>
          </div>
          <div className="bg-slate-100 rounded-full px-3 py-0.5">
            <span className="text-[11px] font-medium text-slate-700">{posLabel}</span>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-red-500 font-medium">최고</div>
            <div className="text-[11px] font-medium">{fmt(data.high52w)}원</div>
          </div>
        </div>

        {/* 현재가 - 게이지 아래 그린 박스 */}
        <div className="bg-emerald-50 rounded-xl p-3 mb-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[10px] text-emerald-700 font-medium mb-0.5">💰 현재가</div>
              <div className="flex items-baseline gap-1">
                <span className="text-[20px] font-semibold text-emerald-900 leading-none">{fmt(data.price)}</span>
                <span className="text-[12px] text-emerald-700">원</span>
              </div>
            </div>
            <span className="text-[9px] text-emerald-600/70">약 15~20분 지연</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center mt-2">
          ※ 최신 실시간 가격은 증권사 앱에서 확인하세요
        </p>
      </div>

      {/* ⭐ AI 뉴스 카드 V2 - DART 공시 + 구글 뉴스 + AI 분석 */}
      {(() => {
        // V2 데이터 우선
        if (data.aiNewsV2 && data.aiNewsV2.hasData) {
          const v2 = data.aiNewsV2;
          const hasFilings = v2.filings.length > 0;
          const hasNews = v2.newsItems.length > 0;

          return (
            <div className="bg-emerald-900 rounded-2xl border-2 border-amber-400 p-4 mb-3">
              {/* 라벨 */}
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-amber-400 rounded-md px-2.5 py-1 flex items-center gap-1.5 flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-900"></div>
                  <span className="text-[10px] font-semibold text-emerald-900">AI 뉴스</span>
                </div>
                <span className="text-[9px] text-emerald-300">공시 + 시장 뉴스 · AI 분석</span>
              </div>

              {/* AI 종합 코멘트 */}
              <div className="flex items-start gap-2 mb-3 pb-3 border-b border-amber-400/30">
                <div className="w-5 h-5 rounded-full bg-amber-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px]">💡</span>
                </div>
                <div>
                  <div className="text-[10px] font-medium text-amber-300 mb-0.5">종합 코멘트</div>
                  <div className="text-[12px] text-white leading-snug font-medium">
                    {v2.comment}
                  </div>
                </div>
              </div>

              {/* 공식 공시 (DART) */}
              {hasFilings && (
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[9px] text-amber-300 font-semibold">📋 공식 공시 (DART)</span>
                  </div>
                  <div className="space-y-1.5">
                    {v2.filings.map((filing, i) => (
                      <a
                        key={i}
                        href={filing.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 hover:bg-emerald-800/40 rounded-lg p-1.5 -mx-1.5 transition-colors no-underline block"
                      >
                        <div className="w-5 h-5 rounded-full bg-amber-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[9px] font-medium text-amber-300">
                            {i === 0 ? '①' : '②'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-white leading-snug m-0 line-clamp-2 font-medium">
                            {filing.title}
                          </p>
                          <p className="text-[9px] text-emerald-300 m-0 mt-0.5">
                            {filing.daysAgo === 0 ? '오늘' : `${filing.daysAgo}일 전`} · 금융감독원 DART
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 시장 뉴스 (구글 뉴스) */}
              {hasNews && (
                <div className={hasFilings ? 'pt-2 border-t border-amber-400/20' : ''}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[9px] text-amber-300 font-semibold">📰 시장 뉴스</span>
                  </div>
                  <div className="space-y-1.5">
                    {v2.newsItems.map((news, i) => (
                      <a
                        key={i}
                        href={news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 hover:bg-emerald-800/40 rounded-lg p-1.5 -mx-1.5 transition-colors no-underline block"
                      >
                        <div className="w-5 h-5 rounded-full bg-amber-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[9px] font-medium text-amber-300">
                            {hasFilings
                              ? (i === 0 ? '③' : i === 1 ? '④' : '⑤')
                              : (i === 0 ? '①' : i === 1 ? '②' : '③')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-white leading-snug m-0 line-clamp-2 font-medium">
                            {news.title}
                          </p>
                          <p className="text-[9px] text-emerald-300 m-0 mt-0.5">
                            {news.daysAgo === 0 ? '오늘' : `${news.daysAgo}일 전`}
                            {news.source ? ` · ${news.source}` : ' · 구글 뉴스'}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[9px] text-emerald-400/50 mt-3">
                ※ DART 공시 + 구글 뉴스 + AI 분석 · 투자 권유 아님
              </p>
            </div>
          );
        }

        // V2 데이터 없음 - latestNews라도 표시
        if (data.latestNews) {
          return (
            <div className="bg-emerald-900 rounded-2xl border-2 border-amber-400 p-4 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-amber-400 rounded-md px-2.5 py-1 flex items-center gap-1.5 flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-900"></div>
                  <span className="text-[10px] font-semibold text-emerald-900">AI 뉴스</span>
                </div>
                <span className="text-[9px] text-emerald-300">최신 뉴스</span>
              </div>

              <a href={data.latestNews.url} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-2 no-underline block">
                <div className="w-5 h-5 rounded-full bg-amber-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px]">📰</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-white leading-snug m-0 line-clamp-2 font-medium">
                    {data.latestNews.title}
                  </p>
                  <p className="text-[9px] text-emerald-300 m-0 mt-0.5">
                    {data.latestNews.time}
                  </p>
                </div>
              </a>

              <p className="text-[9px] text-emerald-400/50 mt-3">
                ※ 단일 뉴스 · 투자 권유 아님
              </p>
            </div>
          );
        }

        // 모두 실패 - 안내
        return (
          <div className="bg-emerald-900 rounded-2xl border-2 border-amber-400 p-4 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-amber-400 rounded-md px-2.5 py-1 flex items-center gap-1.5 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-900"></div>
                <span className="text-[10px] font-semibold text-emerald-900">AI 뉴스</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px]">📭</span>
              </div>
              <div>
                <div className="text-[12px] text-white leading-snug font-medium mb-1">
                  최근 7일 공시·뉴스가 없습니다
                </div>
                <div className="text-[10px] text-emerald-300">
                  DART 또는 포털에서 직접 검색해보세요
                </div>
              </div>
            </div>

            <p className="text-[9px] text-emerald-400/50 mt-3">
              ※ DART 공시 + 구글 뉴스 검색 결과
            </p>
          </div>
        );
      })()}

      {/* ⭐ 광고 슬롯 2 - 1년 가격 후 (모바일 + PC) - 쿠팡 와이드 680×140 */}
      <div className="mb-3">
        <CoupangBanner variant="wide" subId="result-after-chart" />
      </div>

      {/* 핵심 지표 - 흰색 카드들 */}
      <div className="text-[11px] font-medium text-slate-400 mb-2 px-0.5">핵심 지표</div>
      <div className="grid grid-cols-2 gap-2 mb-3">

        {/* PER */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span style={{ fontSize: 13 }}>💼</span>
            <span className="text-[10px] text-slate-500 font-medium">PER</span>
          </div>
          {data.per > 0 ? (
            <>
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-[26px] font-medium text-slate-800 leading-none">{data.per.toFixed(1)}</span>
                <span className="text-[13px] text-slate-400">배</span>
              </div>
              {data.perCompare ? (
                <>
                  <div className="text-[10px] text-slate-500 mb-1">
                    {data.perCompare.industryName} 평균 {data.perCompare.industryAvg.toFixed(1)}배
                  </div>
                  <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
                    data.perCompare.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                    data.perCompare.color === 'red' ? 'bg-red-50 text-red-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {data.perCompare.diffPercent > 0 ? '+' : ''}{data.perCompare.diffPercent}% {data.perCompare.label}
                  </span>
                </>
              ) : (
                <div className="text-[10px] text-slate-500">이익 대비 주가</div>
              )}
            </>
          ) : (
            <>
              <div className="text-[22px] font-medium text-slate-300 leading-none mb-1.5">적자</div>
              <div className="text-[10px] text-slate-400">현재 순손실 상태</div>
            </>
          )}
        </div>

        {/* PBR */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span style={{ fontSize: 13 }}>📈</span>
            <span className="text-[10px] text-slate-500 font-medium">PBR</span>
          </div>
          {data.pbr > 0 ? (
            <>
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-[26px] font-medium text-slate-800 leading-none">{data.pbr.toFixed(1)}</span>
                <span className="text-[13px] text-slate-400">배</span>
              </div>
              {data.pbrCompare ? (
                <>
                  <div className="text-[10px] text-slate-500 mb-1">
                    {data.pbrCompare.industryName} 평균 {data.pbrCompare.industryAvg.toFixed(1)}배
                  </div>
                  <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
                    data.pbrCompare.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                    data.pbrCompare.color === 'red' ? 'bg-red-50 text-red-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {data.pbrCompare.diffPercent > 0 ? '+' : ''}{data.pbrCompare.diffPercent}% {data.pbrCompare.label}
                  </span>
                </>
              ) : (
                <div className="text-[10px] text-slate-500">자산 대비 주가</div>
              )}
            </>
          ) : (
            <>
              <div className="text-[22px] font-medium text-slate-300 leading-none mb-1.5">-</div>
              <div className="text-[10px] text-slate-400">데이터 없음</div>
            </>
          )}
        </div>

        {/* 외국인 보유율 */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span style={{ fontSize: 13 }}>🌐</span>
            <span className="text-[10px] text-slate-500 font-medium">외국인 보유율</span>
          </div>
          {data.foreignOwnership > 0 ? (
            <>
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className={`text-[26px] font-medium leading-none ${
                  data.foreignOwnership >= 50 ? 'text-red-600' :
                  data.foreignOwnership >= 30 ? 'text-slate-700' : 'text-slate-600'
                }`}>{data.foreignOwnership.toFixed(1)}</span>
                <span className="text-[13px] text-slate-400">%</span>
              </div>
              <div className="text-[10px] text-slate-500">
                {data.foreignOwnership >= 50 ? '외국인 과반 보유' :
                 data.foreignOwnership >= 30 ? '외국인 비중 높음' : '외국인 비중 낮음'}
              </div>
            </>
          ) : (
            <>
              <div className="text-[22px] font-medium text-slate-300 leading-none mb-1.5">-</div>
              <div className="text-[10px] text-slate-400">데이터 없음</div>
            </>
          )}
        </div>

        {/* 배당률 */}
        {data.dividendYield > 0 ? (
          <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-100">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span style={{ fontSize: 13 }}>💰</span>
              <span className="text-[10px] text-emerald-700 font-medium">배당률</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1.5">
              <span className={`text-[26px] font-medium leading-none ${
                data.dividendYield >= 4 ? 'text-red-600' :
                data.dividendYield >= 2 ? 'text-emerald-700' : 'text-slate-600'
              }`}>{data.dividendYield.toFixed(1)}</span>
              <span className="text-[13px] text-emerald-600">%</span>
            </div>
            <div className="text-[10px] text-emerald-600">
              {data.dividendYield >= 4 ? '고배당 주목' :
               data.dividendYield >= 2 ? '적정 배당' : '낮은 배당'}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span style={{ fontSize: 13 }}>💰</span>
              <span className="text-[10px] text-slate-400 font-medium">배당률</span>
            </div>
            <div className="text-[22px] font-medium text-slate-300 leading-none mb-1.5">-</div>
            <div className="text-[10px] text-slate-400">무배당</div>
          </div>
        )}
      </div>

      <div className="text-center text-[10px] text-slate-400 py-1">
        ※ 공개 데이터 요약 · 약 15~20분 지연 · 투자 자문 아님 · 판단은 본인 책임
      </div>

      {/* ⭐ 광고 슬롯 3 - 핵심 지표 후 (모바일 전용 애드핏 320×100) */}
      <div className="lg:hidden mt-3 mb-3 flex justify-center">
        <AdfitBanner adUnit={ADFIT_MOBILE_320} width={320} height={100} />
      </div>

      {/* ⭐ 광고 슬롯 4 - 페이지 끝 쿠팡 사각 300×250 (모바일 + PC) */}
      <div className="mt-3 mb-3 flex justify-center">
        <CoupangBanner variant="square" subId="result-bottom" />
      </div>
    </div>
  );
}
