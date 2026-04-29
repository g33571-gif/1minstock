'use client';

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

// 카드 공통 컨테이너
function MetricCard({
  emoji, label, mainValue, mainColor, subValue, subColor, bg, border
}: {
  emoji: string; label: string;
  mainValue: string; mainColor: string;
  subValue: string; subColor?: string;
  bg: string; border: string;
}) {
  return (
    <div className={`rounded-xl p-3.5 border ${bg} ${border}`}>
      <div className="flex items-center gap-1.5 mb-2.5">
        <span style={{ fontSize: 13 }}>{emoji}</span>
        <span className={`text-[10px] font-medium ${subColor || 'text-slate-500'}`}>{label}</span>
      </div>
      <div className={`text-[26px] font-medium leading-none mb-1.5 ${mainColor}`}>
        {mainValue}
      </div>
      <div className={`text-[10px] ${subColor || 'text-slate-400'}`}>{subValue}</div>
    </div>
  );
}

export default function StockResultCard({ data, onClose }: {
  data: StockResult; onClose: () => void;
}) {
  const isUp = data.changePercent >= 0;

  const posLabel =
    data.pricePos <= 20 ? '저점 근처' :
    data.pricePos <= 40 ? '저점~중간' :
    data.pricePos <= 60 ? '중간 구간' :
    data.pricePos <= 80 ? '중간~고점' : '고점 근처';

  // 외국인 순매수
  const isForeignBuy   = data.foreign5d >= 0;
  const hasForeign     = data.foreign5d !== 0;
  const fDays          = data.foreignConsecutiveDays;
  const foreignMainVal = hasForeign
    ? (fDays >= 3 ? `${fDays}일↑` : isForeignBuy ? '매수↑' : '매도↓')
    : '-';
  const foreignSubVal  = hasForeign ? fmtAmt(data.foreign5d) + ' (5일)' : '데이터 없음';

  // 외국인 보유율
  const fPct = data.foreignOwnership;
  const fPctColor = fPct >= 50 ? 'text-red-600' : fPct >= 30 ? 'text-slate-700' : 'text-blue-600';

  // PER
  const hasPer = data.per > 0;
  const perVal = hasPer ? `${data.per.toFixed(1)}` : data.per === 0 ? '-' : '적자';
  const perColor = hasPer
    ? (data.per < 10 ? 'text-blue-600' : data.per < 25 ? 'text-slate-800' : 'text-red-600')
    : 'text-slate-300';

  // PBR
  const hasPbr = data.pbr > 0;
  const pbrVal = hasPbr ? `${data.pbr.toFixed(1)}` : '-';
  const pbrColor = hasPbr
    ? (data.pbr < 1 ? 'text-blue-600' : data.pbr < 3 ? 'text-slate-800' : 'text-red-600')
    : 'text-slate-300';

  // 배당률
  const hasDividend = data.dividendYield > 0;
  const divVal = hasDividend ? `${data.dividendYield.toFixed(1)}%` : '-';
  const divColor = hasDividend
    ? (data.dividendYield >= 4 ? 'text-red-600' : data.dividendYield >= 2 ? 'text-emerald-700' : 'text-slate-600')
    : 'text-slate-300';
  const divSub = hasDividend
    ? (data.dividendYield >= 4 ? '고배당 주목' : data.dividendYield >= 2 ? '연간 배당' : '연간 배당')
    : '무배당';

  // 거래량 (오늘 거래량, volumeRatio 없으면 주수만)
  const vr = data.volumeRatio || 0;
  const hasVol = data.volume > 0;
  const volMainVal = vr >= 150 ? `+${Math.round(vr-100)}%`
    : vr > 0 && vr < 80 ? `${Math.round(vr)}%`
    : hasVol ? `${(data.volume / 1000).toFixed(0)}K` : '-';
  const volSub = vr >= 300 ? '폭발적 급증'
    : vr >= 200 ? '거래량 급증'
    : vr >= 150 ? '평균 대비 증가'
    : vr > 0 ? '평균 수준'
    : hasVol ? '오늘 거래량' : '데이터 없음';
  const volColor = vr >= 150 ? 'text-amber-600'
    : vr > 0 ? 'text-slate-600'
    : 'text-slate-500';
  const volBg = vr >= 150 ? 'bg-amber-50' : 'bg-slate-50';
  const volBorder = vr >= 150 ? 'border-amber-100' : 'border-slate-200';

  return (
    <div style={{ animation: 'slideDown 0.25s ease' }}>
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}`}</style>

      {/* 헤더 */}
      <div className="bg-emerald-900 rounded-2xl p-4 mb-3 text-white">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-[11px] text-emerald-300 mb-1">{data.market} · {data.code}</div>
            <div className="text-xl font-medium mb-2">{data.name}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-medium leading-none">{fmt(data.price)}</span>
              <span className="text-[12px] text-emerald-300">원</span>
            </div>
          </div>
          <div className={`rounded-lg px-3 py-2 text-center flex-shrink-0 ${isUp ? 'bg-red-500/30' : 'bg-blue-600/30'}`}>
            <div className={`text-[13px] font-medium ${isUp ? 'text-red-300' : 'text-blue-300'}`}>
              {isUp ? '▲' : '▼'} {Math.abs(data.changePercent).toFixed(2)}%
            </div>
            <div className={`text-[11px] ${isUp ? 'text-red-300' : 'text-blue-300'}`}>
              {isUp ? '+' : ''}{fmt(data.change)}원
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-3 grid grid-cols-4 gap-1 text-center">
          {[
            { label: '시가', val: fmt(data.openToday || data.price), color: 'text-white' },
            { label: '고가', val: fmt(data.highToday || data.price), color: 'text-red-300' },
            { label: '저가', val: fmt(data.lowToday || data.price), color: 'text-blue-300' },
            { label: '시총', val: data.marketCap, color: 'text-white' },
          ].map(({ label, val, color }) => (
            <div key={label}>
              <div className="text-[9px] text-emerald-300 mb-1">{label}</div>
              <div className={`text-[11px] font-medium ${color}`}>{val}</div>
            </div>
          ))}
        </div>
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

      {/* 52주 가격위치 */}
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

      {/* ── 6개 지표 2×3 (신뢰성 있는 데이터만) ── */}
      {/* 위험신호 배너 (있을 때만 표시) */}
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

      <div className="text-[11px] font-medium text-slate-400 mb-2 px-0.5">핵심 지표</div>
      <div className="grid grid-cols-2 gap-2 mb-3">

        {/* 1. 외국인 순매수 */}
        <div className={`rounded-xl p-3.5 border ${isForeignBuy ? 'bg-red-50 border-red-100' : hasForeign ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <span style={{ fontSize: 13 }}>🌐</span>
            <span className={`text-[10px] font-medium ${isForeignBuy && hasForeign ? 'text-red-700' : hasForeign ? 'text-blue-700' : 'text-slate-400'}`}>외국인 순매수</span>
          </div>
          <div className={`text-[26px] font-medium leading-none mb-1.5 ${hasForeign ? (isForeignBuy ? 'text-red-600' : 'text-blue-600') : 'text-slate-300'}`}>
            {foreignMainVal}
          </div>
          <div className={`text-[10px] font-medium ${hasForeign ? (isForeignBuy ? 'text-red-500' : 'text-blue-500') : 'text-slate-400'}`}>
            {foreignSubVal}
          </div>
        </div>

        {/* 2. 외국인 보유율 */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span style={{ fontSize: 13 }}>👥</span>
            <span className="text-[10px] font-medium text-slate-500">외국인 보유율</span>
          </div>
          {fPct > 0 ? (
            <>
              <div className={`text-[26px] font-medium leading-none mb-1.5 ${fPctColor}`}>
                {fPct.toFixed(1)}
                <span className="text-[14px] text-slate-400 ml-0.5">%</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {fPct >= 50 ? '외국인 과반 보유' : fPct >= 30 ? '외국인 비중 높음' : '외국인 비중 낮음'}
              </div>
            </>
          ) : (
            <>
              <div className="text-[24px] font-medium text-slate-300 leading-none mb-1.5">-</div>
              <div className="text-[10px] text-slate-400">데이터 없음</div>
            </>
          )}
        </div>

        {/* 3. PER */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span style={{ fontSize: 13 }}>💼</span>
            <span className="text-[10px] font-medium text-slate-500">PER</span>
          </div>
          <div className={`leading-none mb-1.5 ${hasPer ? 'text-[26px] font-medium ' + perColor : 'text-[22px] font-medium text-slate-300'}`}>
            {perVal}
            {hasPer && <span className="text-[14px] text-slate-400 ml-0.5">배</span>}
          </div>
          <div className="text-[10px] text-slate-400">
            {hasPer
              ? data.per < 10 ? '이익 대비 저평가 구간'
              : data.per < 25 ? '이익 대비 적정 수준'
              : '이익 대비 고평가 구간'
              : data.per === 0 ? '데이터 없음' : '현재 적자 상태'}
          </div>
        </div>

        {/* 4. PBR */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span style={{ fontSize: 13 }}>📈</span>
            <span className="text-[10px] font-medium text-slate-500">PBR</span>
          </div>
          <div className={`leading-none mb-1.5 ${hasPbr ? 'text-[26px] font-medium ' + pbrColor : 'text-[22px] font-medium text-slate-300'}`}>
            {pbrVal}
            {hasPbr && <span className="text-[14px] text-slate-400 ml-0.5">배</span>}
          </div>
          <div className="text-[10px] text-slate-400">
            {hasPbr
              ? data.pbr < 1 ? '순자산보다 낮은 주가'
              : data.pbr < 3 ? '자산 대비 적정 수준'
              : '자산 대비 고평가 구간'
              : '데이터 없음'}
          </div>
        </div>

        {/* 5. 배당률 */}
        <div className={`rounded-xl p-3.5 border ${hasDividend ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <span style={{ fontSize: 13 }}>💰</span>
            <span className={`text-[10px] font-medium ${hasDividend ? 'text-emerald-700' : 'text-slate-400'}`}>배당률</span>
          </div>
          <div className={`text-[26px] font-medium leading-none mb-1.5 ${hasDividend ? divColor : 'text-slate-300'}`}>
            {divVal}
          </div>
          <div className={`text-[10px] ${hasDividend ? 'text-emerald-600' : 'text-slate-400'}`}>{divSub}</div>
        </div>

        {/* 6. 거래량 */}
        <div className={`rounded-xl p-3.5 border ${volBg} ${volBorder}`}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <span style={{ fontSize: 13 }}>📊</span>
            <span className={`text-[10px] font-medium ${vr >= 150 ? 'text-amber-700' : 'text-slate-500'}`}>거래량</span>
          </div>
          <div className={`text-[26px] font-medium leading-none mb-1.5 ${volColor}`}>
            {volMainVal}
          </div>
          <div className={`text-[10px] ${vr >= 150 ? 'text-amber-600' : 'text-slate-400'}`}>
            {volSub}
          </div>
        </div>

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

      {/* 전체 상세 보기 */}
      <a href={`/${data.code}`}
        className="block bg-emerald-900 rounded-2xl p-3.5 text-center no-underline mb-3 hover:bg-emerald-800 transition-colors">
        <div className="text-[13px] font-medium text-white">전체 상세 보기</div>
        <div className="text-[10px] text-emerald-300 mt-0.5">실적 · 컨센서스 · 매매동향 전체 →</div>
      </a>

      <div className="text-center text-[10px] text-slate-400 py-1">
        ※ 공개 데이터 요약 · 투자 자문 아님 · 판단은 본인 책임
      </div>
    </div>
  );
}
