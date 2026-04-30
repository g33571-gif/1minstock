'use client';

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
  companyOverview: CompanyOverview | null;  // ⭐ 새 필드
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

      {/* ⭐ 헤더 - F 스타일 카드 분리형 */}
      <div className="bg-emerald-900 rounded-t-2xl p-5 text-white">
        <div className="mb-2">
          <span className="text-[11px] text-emerald-300">{data.market} · {data.code}</span>
        </div>
        <div className="text-[24px] font-medium mb-2 leading-tight">{data.name}</div>
        <div className="flex items-center gap-2 text-[12px] text-emerald-200 flex-wrap">
          {data.industryName && (
            <>
              <span className="bg-emerald-700/40 px-2 py-0.5 rounded-full text-[11px]">
                {data.industryName}
              </span>
              <span className="text-emerald-400/50">·</span>
            </>
          )}
          <span>시총 {data.marketCap}</span>
        </div>
      </div>

      {/* ⭐ 사업 분야 카드 - 헤더 바로 아래 분리된 형태 */}
      {data.companyOverview && (
        <div className="bg-emerald-50 rounded-b-2xl px-5 py-3 mb-3 border-l-4 border-emerald-500">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded">
              사업 분야
            </span>
          </div>
          <div className="text-[13px] font-medium text-emerald-900 leading-snug mb-0.5">
            {data.companyOverview.headline}
          </div>
          <div className="text-[11px] text-emerald-700">
            {data.companyOverview.detail}
          </div>
        </div>
      )}

      {/* 사업 분야 데이터 없을 때는 그냥 공간 메우기 */}
      {!data.companyOverview && (
        <div className="rounded-b-2xl mb-3 bg-emerald-900/0 h-2"></div>
      )}

      {/* AI 브리핑 - 메인 무기 */}
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

      {/* 위험신호 - 5단계 레벨 */}
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

      {/* ⭐ 1년 가격 위치 - 옵션 3 (게이지 위 큰 인포) */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="text-[12px] font-medium text-slate-800 mb-3 flex items-center gap-1.5">
          <span>📊</span> 1년 가격 위치
        </div>

        {/* ⭐ 게이지 위 큰 대비 인포 */}
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

        {/* 최저/최고 가격 */}
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

        {/* ⭐ 현재가 - 게이지 아래 적당한 크기 */}
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

      <div className="text-center text-[10px] text-slate-400 py-1">
        ※ 공개 데이터 요약 · 약 15~20분 지연 · 투자 자문 아님 · 판단은 본인 책임
      </div>
    </div>
  );
}
