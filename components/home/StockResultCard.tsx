'use client';

import { useEffect, useState } from 'react';
import { getMarketStatus, MarketStatusInfo } from '@/lib/marketStatus';

interface ValuationCompare {
  industryName: string;
  myValue: number;
  industryAvg: number;
  diffPercent: number;
  label: '저평가' | '적정' | '고평가';
  color: 'blue' | 'gray' | 'red';
}

interface StockResult {
  code: string; name: string; market: string;
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
  riskSignal: {
    hasRisk: boolean;
    items: Array<{ type: string; label: string; description: string }>;
  };
}

function fmt(n: number) { return n.toLocaleString('ko-KR'); }

function fmtAmt(n: number) {
  const abs = Math.abs(n);
  const sign = n >= 0 ? '+' : '-';
  if (abs >= 100_000_000_000) return `${sign}${(abs/100_000_000_000).toFixed(1)}조`;
  if (abs >= 100_000_000)     return `${sign}${(abs/100_000_000).toFixed(1)}억`;
  if (abs >= 10_000)           return `${sign}${(abs/10_000).toFixed(0)}만`;
  return n !== 0 ? `${sign}${abs.toLocaleString('ko-KR')}` : '-';
}

function SupplyBar({ label, days, amount, max }: {
  label: string; days: number; amount: number; max: number;
}) {
  const isBuy = amount >= 0;
  const pct = max > 0 ? Math.min(100, Math.abs(amount) / max * 100) : 0;
  const color = isBuy ? '#dc2626' : '#1d4ed8';
  const bgColor = isBuy ? 'bg-red-50' : 'bg-blue-50';
  const txtColor = isBuy ? 'text-red-700' : 'text-blue-700';

  return (
    <div className="mb-2.5">
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-medium text-slate-800 min-w-[40px]">{label}</span>
          {days > 0 && amount !== 0 && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${bgColor} ${txtColor}`}>
              {days}일{isBuy ? '↑' : '↓'}
            </span>
          )}
        </div>
        <span className={`text-[11px] font-medium`} style={{ color: amount === 0 ? '#94a3b8' : color }}>
          {amount === 0 ? '-' : fmtAmt(amount)}
        </span>
      </div>
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="absolute top-0 left-1/2 w-px h-full bg-slate-300"></div>
        {amount !== 0 && (
          <div
            className="absolute top-0 h-full rounded-full"
            style={{
              backgroundColor: color,
              width: `${pct / 2}%`,
              [isBuy ? 'left' : 'right']: '50%',
            }}
          />
        )}
      </div>
    </div>
  );
}

// 시장 상태 라벨
function MarketStatusBadge({ status }: { status: MarketStatusInfo }) {
  if (!status.showBanner) return null;

  const colors = {
    PRE_OPEN:  { bg: 'bg-blue-500/20',   dot: 'bg-blue-300',   text: 'text-blue-200' },
    CLOSED:    { bg: 'bg-slate-500/20',  dot: 'bg-slate-300',  text: 'text-slate-200' },
    WEEKEND:   { bg: 'bg-amber-500/20',  dot: 'bg-amber-300',  text: 'text-amber-200' },
    HOLIDAY:   { bg: 'bg-amber-500/20',  dot: 'bg-amber-300',  text: 'text-amber-200' },
    OPEN:      { bg: 'bg-emerald-500/20',dot: 'bg-emerald-300',text: 'text-emerald-200' },
  }[status.status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${colors.bg}`}
      title={status.description}
    >
      <span className={`w-1 h-1 rounded-full ${colors.dot}`}></span>
      <span className={`text-[9px] font-medium ${colors.text}`}>{status.label}</span>
    </span>
  );
}

export default function StockResultCard({ data, onClose }: {
  data: StockResult; onClose: () => void;
}) {
  const [marketStatus, setMarketStatus] = useState<MarketStatusInfo | null>(null);

  useEffect(() => {
    setMarketStatus(getMarketStatus());
    const interval = setInterval(() => setMarketStatus(getMarketStatus()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // ⭐ 변동 데이터 신뢰성 검증
  // 변동이 0인데 시가가 현재가와 다르면 데이터 일관성 깨짐 → 변동 박스 숨김
  // 또는 장중이 아닌 시간대(장전/장후/주말/휴장)에는 "전일 종가" 표시
  const isMarketOpen = marketStatus?.status === 'OPEN';
  const hasOhlcData = data.openToday > 0 && data.highToday > 0 && data.lowToday > 0;

  // ⭐ 변동 박스 표시 여부 결정 (강화된 로직)
  // 변동 0원/0%면 데이터가 신뢰할 수 없는 상태이므로 숨김 처리
  // (장중이라도 진짜로 변동 0인 경우는 매우 드물고, 보통 데이터 미갱신 상태)
  const showChangeBox = (data.change !== 0 || data.changePercent !== 0);

  // 변동이 0이면 라벨 표시 (장 상태에 따라 다른 메시지)
  const showFlatLabel = !showChangeBox;
  const flatLabel = isMarketOpen
    ? '데이터 갱신 중'   // 장중인데 변동 0 → 보통 캐시 갱신 대기 상태
    : '전일 종가 기준'; // 장 외

  const isUp = data.changePercent >= 0;

  const posLabel =
    data.pricePos <= 20 ? '저점 근처' :
    data.pricePos <= 40 ? '저점~중간' :
    data.pricePos <= 60 ? '중간 구간' :
    data.pricePos <= 80 ? '중간~고점' : '고점 근처';

  const supplyMax = Math.max(
    Math.abs(data.foreign5d),
    Math.abs(data.institution5d),
    Math.abs(data.individual5d),
    1
  );

  return (
    <div style={{ animation: 'slideDown 0.25s ease' }}>
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}`}</style>

      {/* 헤더 */}
      <div className="bg-emerald-900 rounded-2xl p-4 mb-3 text-white">
        <div className="flex justify-between items-start mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] text-emerald-300">{data.market} · {data.code}</span>
              {marketStatus && <MarketStatusBadge status={marketStatus} />}
            </div>
            <div className="text-xl font-medium mb-2">{data.name}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-medium leading-none">{fmt(data.price)}</span>
              <span className="text-[12px] text-emerald-300">원</span>
            </div>
            {/* ⭐ 변동 0일 때 라벨 표시 (장중: "데이터 갱신 중" / 장 외: "전일 종가 기준") */}
            {showFlatLabel && (
              <div className="text-[10px] text-emerald-300/70 mt-1">{flatLabel}</div>
            )}
          </div>

          {/* ⭐ 변동 박스: 신뢰할 만한 데이터일 때만 표시 */}
          {showChangeBox && (
            <div className={`rounded-lg px-3 py-2 text-center flex-shrink-0 ${isUp ? 'bg-red-500/30' : 'bg-blue-600/30'}`}>
              <div className={`text-[13px] font-medium ${isUp ? 'text-red-300' : 'text-blue-300'}`}>
                {isUp ? '▲' : '▼'} {Math.abs(data.changePercent).toFixed(2)}%
              </div>
              <div className={`text-[11px] ${isUp ? 'text-red-300' : 'text-blue-300'}`}>
                {isUp ? '+' : ''}{fmt(data.change)}원
              </div>
            </div>
          )}
        </div>

        {/* ⭐ 시가/고가/저가/시총 - OHLC 데이터 있을 때만 표시 */}
        {hasOhlcData ? (
          <div className="border-t border-white/10 pt-3 grid grid-cols-4 gap-1 text-center">
            {[
              { label: '시가', val: fmt(data.openToday), color: 'text-white' },
              { label: '고가', val: fmt(data.highToday), color: 'text-red-300' },
              { label: '저가', val: fmt(data.lowToday),  color: 'text-blue-300' },
              { label: '시총', val: data.marketCap, color: 'text-white' },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div className="text-[9px] text-emerald-300 mb-1">{label}</div>
                <div className={`text-[11px] font-medium ${color}`}>{val}</div>
              </div>
            ))}
          </div>
        ) : (
          // OHLC 데이터 없으면 시총만 표시
          <div className="border-t border-white/10 pt-3 flex justify-between items-center">
            <div className="text-[10px] text-emerald-300/70">
              {isMarketOpen
                ? '시세 데이터 로딩 중'
                : '장 외 시간 · 시가/고가/저가는 거래일에 표시됩니다'}
            </div>
            <div className="text-right">
              <div className="text-[9px] text-emerald-300 mb-0.5">시총</div>
              <div className="text-[11px] font-medium text-white">{data.marketCap}</div>
            </div>
          </div>
        )}
      </div>

      {/* AI 브리핑 */}
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
            {data.market} 상장 · {fmt(data.price)}원
            {data.per > 0 ? ` · PER ${data.per.toFixed(1)}배` : ''}
          </p>
        )}
        <p className="text-[9px] text-emerald-400/50 mt-2">
          ※ 공개 시장 데이터 자동 요약 · 투자 권유 아님
        </p>
      </div>

      {/* 위험신호 */}
      {data.riskSignal?.hasRisk && (
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-medium text-red-900">위험 신호 {data.riskSignal.items.length}건</div>
              <div className="text-[10px] text-red-700">투자에 신중한 검토가 필요합니다</div>
            </div>
          </div>
          <div className="space-y-1.5">
            {data.riskSignal.items.map((r, i) => (
              <div key={i} className="flex items-start gap-2 bg-white rounded-lg p-2.5 border-l-[3px] border-red-600">
                <span className="text-[10px] px-2 py-0.5 bg-red-600 text-white rounded-full font-medium flex-shrink-0">{r.label}</span>
                <span className="text-[11px] text-red-900 leading-snug">{r.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1년 가격 위치 */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="text-[12px] font-medium text-slate-800 mb-2 flex items-center gap-1.5">
          <span>📊</span> 1년 가격 위치
        </div>
        <div className="relative h-3 rounded-full overflow-visible mb-2"
          style={{ background: 'linear-gradient(to right,#1d4ed8,#9ca3af 50%,#dc2626)' }}>
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-[3px] border-emerald-700 rounded-full"
            style={{ left: `clamp(0px, calc(${data.pricePos}% - 8px), calc(100% - 16px))` }} />
        </div>
        <div className="flex justify-between items-center mb-1">
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
        <div className="flex justify-between">
          <span className="text-[10px] text-slate-400">최저 대비 +{data.pricePos}%</span>
          <span className="text-[10px] text-slate-400">최고 대비 -{100 - data.pricePos}%</span>
        </div>
      </div>

      {/* 5일 수급 막대 그래프 */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[12px] font-medium text-slate-800 flex items-center gap-1.5">
            <span>👥</span> 5일 수급 동향
          </div>
          <span className="text-[9px] text-slate-400">빨강=매수 · 파랑=매도</span>
        </div>
        <SupplyBar label="외국인" days={data.foreignConsecutiveDays} amount={data.foreign5d} max={supplyMax} />
        <SupplyBar label="기관"   days={data.institutionConsecutiveDays} amount={data.institution5d} max={supplyMax} />
        <SupplyBar label="개인"   days={0} amount={data.individual5d} max={supplyMax} />
      </div>

      {/* 핵심 지표 */}
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

      {/* 최신 뉴스 */}
      {data.latestNews && (
        <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
          <div className="text-[12px] font-medium text-slate-800 mb-2 flex items-center gap-1.5">
            <span>📰</span> 최신 뉴스
          </div>
          <a href={data.latestNews.url} target="_blank" rel="noopener noreferrer"
            className="flex items-start gap-3 bg-slate-50 rounded-xl p-3 no-underline block">
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-slate-800 leading-snug mb-1 m-0 line-clamp-2">
                {data.latestNews.title}
              </p>
              <p className="text-[10px] text-slate-400 m-0">{data.latestNews.time} · 네이버 금융</p>
            </div>
            <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>
            </svg>
          </a>
        </div>
      )}

      <div className="text-center text-[10px] text-slate-400 py-1">
        ※ 공개 데이터 요약 · 약 15~20분 지연 · 투자 자문 아님 · 판단은 본인 책임
      </div>
    </div>
  );
}
