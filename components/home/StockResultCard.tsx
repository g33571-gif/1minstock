'use client';

interface StockResult {
  code: string;
  name: string;
  market: string;
  price: number;
  change: number;
  changePercent: number;
  openToday: number;
  highToday: number;
  lowToday: number;
  marketCap: string;
  volume: number;
  high52w: number;
  low52w: number;
  pricePos: number;
  per: number;
  pbr: number;
  dividendYield: number;
  foreignOwnership: number;
  aiBriefing: { signal1: string; signal2: string; signal3: string } | null;
  latestNews: { title: string; time: string; url: string } | null;
}

function fmt(n: number) {
  return n.toLocaleString('ko-KR');
}

export default function StockResultCard({ data, onClose }: {
  data: StockResult;
  onClose: () => void;
}) {
  const isUp = data.changePercent >= 0;
  const posLabel =
    data.pricePos <= 20 ? '저점 근처' :
    data.pricePos <= 40 ? '저점~중간' :
    data.pricePos <= 60 ? '중간 구간' :
    data.pricePos <= 80 ? '중간~고점' : '고점 근처';

  return (
    <div className="animate-[slideDown_0.3s_ease]"
      style={{ animation: 'slideDown 0.3s ease' }}>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* 닫기 버튼 */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] text-slate-400">검색 결과</span>
        <button
          onClick={onClose}
          className="text-[11px] text-slate-400 hover:text-slate-600 px-2 py-1 rounded"
        >
          ✕ 닫기
        </button>
      </div>

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
          <div>
            <div className="text-[9px] text-emerald-300 mb-1">시가</div>
            <div className="text-[11px] font-medium">{fmt(data.openToday || data.price)}</div>
          </div>
          <div>
            <div className="text-[9px] text-red-300 mb-1">고가</div>
            <div className="text-[11px] font-medium text-red-300">{fmt(data.highToday || data.price)}</div>
          </div>
          <div>
            <div className="text-[9px] text-blue-300 mb-1">저가</div>
            <div className="text-[11px] font-medium text-blue-300">{fmt(data.lowToday || data.price)}</div>
          </div>
          <div>
            <div className="text-[9px] text-emerald-300 mb-1">시총</div>
            <div className="text-[11px] font-medium">{data.marketCap}</div>
          </div>
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
            {data.market} 상장, 현재가 {fmt(data.price)}원
            {data.per > 0 ? `, PER ${data.per.toFixed(1)}배` : ''}
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
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-[3px] border-emerald-700 rounded-full"
            style={{ left: `clamp(0px, calc(${data.pricePos}% - 8px), calc(100% - 16px))` }}
          />
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

      {/* 4개 지표 */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          {
            emoji: '🛡️', label: '위험 신호', sub: '상폐·정지·관리',
            val: '없음', valColor: 'text-emerald-700',
            tag: '정상', tagCls: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
          },
          {
            emoji: '💼', label: 'PER', sub: '주가 / 순이익',
            val: data.per > 0 ? `${data.per.toFixed(1)}배` : '적자',
            valColor: '',
            tag: data.per > 0 ? '데이터 있음' : '해당없음',
            tagCls: 'bg-slate-100 text-slate-500',
          },
          {
            emoji: '📈', label: 'PBR', sub: '주가 / 순자산',
            val: data.pbr > 0 ? `${data.pbr.toFixed(1)}배` : '-',
            valColor: '', tag: data.pbr > 0 ? '데이터 있음' : '-',
            tagCls: 'bg-slate-100 text-slate-500',
          },
          {
            emoji: '💰', label: '배당률', sub: '연간 배당 / 주가',
            val: data.dividendYield > 0 ? `${data.dividendYield.toFixed(1)}%` : '-',
            valColor: data.dividendYield > 0 ? 'text-emerald-700' : '',
            tag: data.dividendYield > 0 ? '연간 배당' : '무배당',
            tagCls: data.dividendYield > 0
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-slate-100 text-slate-400',
          },
        ].map(({ emoji, label, sub, val, valColor, tag, tagCls }) => (
          <div key={label} className="bg-white rounded-xl p-3 border border-slate-100 text-center">
            <div className="text-base mb-1">{emoji}</div>
            <div className="text-[10px] text-slate-500 mb-0.5">{label}</div>
            <div className="text-[9px] text-slate-400 mb-2">{sub}</div>
            <div className={`text-[17px] font-medium mb-1.5 ${valColor || 'text-slate-800'}`}>{val}</div>
            <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${tagCls}`}>{tag}</span>
          </div>
        ))}
      </div>

      {/* 최신 뉴스 */}
      {data.latestNews && (
        <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
          <div className="text-[12px] font-medium text-slate-800 mb-2 flex items-center gap-1.5">
            <span>📰</span> 최신 뉴스
          </div>
          <a
            href={data.latestNews.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-slate-50 rounded-xl p-3 no-underline block"
          >
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
      <a
        href={`/${data.code}`}
        className="block bg-white rounded-2xl p-3.5 border border-slate-200 text-center text-[13px] font-medium text-emerald-700 hover:bg-slate-50 transition-colors no-underline mb-2"
      >
        전체 상세 보기 →
      </a>

      <div className="text-center text-[10px] text-slate-400 py-1">
        ※ 공개 데이터 요약 · 투자 자문 아님 · 판단은 본인 책임
      </div>
    </div>
  );
}
