import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchNaverStock } from '@/lib/naverFinance';
import { fetchDartCompany } from '@/lib/dart';
import { fetchInvestorTrading } from '@/lib/investorTrading';
import { fetchAIBriefing } from '@/lib/aiSummary';

interface PageProps {
  params: { stockCode: string };
}

export const dynamic = 'force-dynamic';
export const revalidate = 60;

function isValidStockCode(code: string) {
  return /^\d{6}$/.test(code);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const d = await fetchNaverStock(params.stockCode);
  if (!d) return { title: '종목을 찾을 수 없어요 | 1MINSTOCK' };
  return {
    title: `${d.name}(${params.stockCode}) 1분 체크 | 1MINSTOCK`,
    description: `${d.name} AI 분석, PER, 외국인 수급, 위험신호를 1분 안에 확인하세요.`,
  };
}

// 금액 포맷
function fmtAmt(n: number): string {
  const abs = Math.abs(n);
  const sign = n >= 0 ? '+' : '-';
  if (abs >= 1_000_000_000_000) return `${sign}${(abs / 1_000_000_000_000).toFixed(1)}조`;
  if (abs >= 100_000_000)       return `${sign}${(abs / 100_000_000).toFixed(1)}억`;
  if (abs >= 10_000)             return `${sign}${(abs / 10_000).toFixed(0)}만`;
  return `${sign}${abs.toLocaleString('ko-KR')}`;
}

function fmtPrice(n: number) {
  return n.toLocaleString('ko-KR');
}

const MobileAd = () => (
  <div className="lg:hidden border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center mb-3 py-5 bg-slate-50">
    <div className="text-[10px] text-slate-400 font-semibold">AD · 광고</div>
    <div className="text-[10px] text-slate-300 mt-0.5">320 × 100</div>
  </div>
);
const PCBannerAd = () => (
  <div className="hidden lg:flex border-2 border-dashed border-slate-200 rounded-2xl items-center justify-center mb-3 py-6 flex-col bg-slate-50">
    <div className="text-[10px] text-slate-400 font-semibold">AD · 광고</div>
    <div className="text-[10px] text-slate-300 mt-0.5">728 × 90</div>
  </div>
);

export default async function StockDetailPage({ params }: PageProps) {
  if (!isValidStockCode(params.stockCode)) notFound();

  // 가격 먼저 가져온 후 매매동향에 넘김 (금액 계산용)
  const naverData = await fetchNaverStock(params.stockCode);
  if (!naverData) notFound();

  const [dartData, tradingData] = await Promise.all([
    fetchDartCompany(params.stockCode),
    fetchInvestorTrading(params.stockCode, naverData.price),
  ]);

  // 52주 위치
  const pricePos = naverData.high52w > naverData.low52w
    ? Math.max(0, Math.min(100,
        (naverData.price - naverData.low52w) / (naverData.high52w - naverData.low52w) * 100
      ))
    : 50;

  const posLabel =
    pricePos <= 20 ? '저점 근처' :
    pricePos <= 40 ? '저점~중간' :
    pricePos <= 60 ? '중간 구간' :
    pricePos <= 80 ? '중간~고점' : '고점 근처';

  // 수급
  const f5d  = tradingData?.foreign5d       ?? 0;
  const i5d  = tradingData?.institution5d   ?? 0;
  const p5d  = tradingData?.individual5d    ?? 0;
  const fDays = tradingData?.consecutiveBuyDays ?? 0;
  const iDays = tradingData?.institutionConsecutiveBuyDays ?? 0;

  // 보유율
  const fPct = naverData.foreignOwnership > 0 ? naverData.foreignOwnership : 0;
  const iPct = naverData.institutionOwnership > 0 ? naverData.institutionOwnership : 0;
  const pPct = Math.max(0, 100 - fPct - iPct);

  // 컨센서스
  const cons = naverData.consensus;
  const totalCons = cons ? cons.buyCount + cons.neutralCount + cons.sellCount : 0;
  const buyPct     = totalCons > 0 ? Math.round(cons!.buyCount     / totalCons * 100) : 0;
  const neutralPct = totalCons > 0 ? Math.round(cons!.neutralCount / totalCons * 100) : 0;
  const sellPct    = totalCons > 0 ? Math.round(cons!.sellCount    / totalCons * 100) : 0;
  const targetUpside = cons?.targetPrice && cons.targetPrice > 0
    ? (cons.targetPrice - naverData.price) / naverData.price * 100
    : null;
  // 목표가 게이지 위치 (현재가 마커)
  // 게이지 범위: 하향목표가(왼쪽) ~ 평균목표가(오른쪽 고정)
  // 현재가가 그 사이 어디 있는지
  const gaugePct = cons?.targetPrice && cons.targetPriceLow && cons.targetPrice > cons.targetPriceLow
    ? Math.max(5, Math.min(90,
        (naverData.price - cons.targetPriceLow) / (cons.targetPrice - cons.targetPriceLow) * 90
      ))
    : 50;

  // AI 요약
  const aiBriefing = await fetchAIBriefing({
    name: naverData.name,
    price: naverData.price,
    changePercent: naverData.changePercent,
    per: naverData.per,
    pbr: naverData.pbr,
    foreign5d: f5d,
    institution5d: i5d,
    pricePosition: pricePos,
    foreignOwnership: fPct,
    dividendYield: naverData.dividendYield,
    consecutiveBuyDays: fDays,
    institutionConsecutiveBuyDays: iDays,
    marketCap: naverData.marketCap,
    consensusTargetPrice: cons?.targetPrice,
    consensusBuyPct: buyPct,
    volume: naverData.volume,
    volumeRatio: naverData.volumeRatioCalc,
  });

  const isUp = naverData.changePercent >= 0;

  return (
    <>
      {/* ── 1. 헤더 ── */}
      <div className="bg-emerald-900 rounded-2xl p-4 mb-3 text-white">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-[11px] text-emerald-300 mb-1 tracking-wider">
              {naverData.market} · {params.stockCode}
            </div>
            <div className="text-2xl font-medium mb-2">{naverData.name}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-medium leading-none">{fmtPrice(naverData.price)}</span>
              <span className="text-[13px] text-emerald-300">원</span>
            </div>
          </div>
          <div className={`rounded-lg px-3 py-2 text-center flex-shrink-0 ${isUp ? 'bg-red-500/30' : 'bg-blue-600/30'}`}>
            <div className={`text-[13px] font-medium ${isUp ? 'text-red-300' : 'text-blue-300'}`}>
              {isUp ? '▲' : '▼'} {Math.abs(naverData.changePercent).toFixed(2)}%
            </div>
            <div className={`text-[11px] ${isUp ? 'text-red-300' : 'text-blue-300'}`}>
              {isUp ? '+' : ''}{fmtPrice(naverData.change)}원
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-3 grid grid-cols-4 gap-1 text-center">
          {[
            { label: '시가', val: fmtPrice(naverData.openToday || naverData.price), color: 'text-white' },
            { label: '고가', val: fmtPrice(naverData.highToday || naverData.price), color: 'text-red-300' },
            { label: '저가', val: fmtPrice(naverData.lowToday  || naverData.price), color: 'text-blue-300' },
            { label: '시총', val: naverData.marketCap, color: 'text-white' },
          ].map(({ label, val, color }) => (
            <div key={label}>
              <div className="text-[9px] text-emerald-300 mb-1">{label}</div>
              <div className={`text-[11px] font-medium ${color}`}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. AI 브리핑 (히어로) ── */}
      <div className="bg-emerald-900 rounded-2xl p-4 mb-3 border-2 border-amber-400">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-amber-400 rounded-md px-2.5 py-1 flex items-center gap-1.5 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-900"></div>
            <span className="text-[10px] font-semibold text-emerald-900">AI 브리핑</span>
          </div>
          <span className="text-[9px] text-emerald-300">공개 데이터 자동 요약 · 참고용</span>
        </div>

        {/* 3줄 시그널 */}
        <div className="space-y-2.5 mb-3">
          {[
            { num: '①', label: '수급', text: aiBriefing?.signal1 },
            { num: '②', label: '거래량', text: aiBriefing?.signal2 },
            { num: '③', label: '밸류', text: aiBriefing?.signal3 },
          ].map(({ num, label, text }) => (
            <div key={label} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-medium text-amber-300">{num}</span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-emerald-300 mr-1.5">{label}</span>
                <span className="text-[13px] text-white leading-snug">{text || '-'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 52주 게이지 */}
        <div className="bg-white/8 rounded-xl p-3 mb-3">
          <div className="text-[10px] text-emerald-300 mb-2">52주 가격 위치</div>
          <div className="relative h-3 rounded-full overflow-visible mb-2"
            style={{ background: 'linear-gradient(to right,#1d4ed8,#9ca3af 50%,#dc2626)' }}>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-amber-400 rounded-full"
              style={{ left: `clamp(0px, calc(${pricePos}% - 8px), calc(100% - 16px))` }}
            />
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-blue-300">저점 {fmtPrice(naverData.low52w)}</span>
            <span className="text-amber-300 font-medium">{posLabel}</span>
            <span className="text-red-300">고점 {fmtPrice(naverData.high52w)}</span>
          </div>
        </div>

        {/* 최신 뉴스 */}
        {naverData.latestNews && (
          <a
            href={naverData.latestNews.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 bg-white/8 rounded-xl p-3 block no-underline"
          >
            <span className="text-[12px] flex-shrink-0 mt-0.5">📰</span>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-white leading-snug line-clamp-2 m-0">{naverData.latestNews.title}</p>
              <p className="text-[9px] text-emerald-400/60 mt-1 m-0">{naverData.latestNews.time} · 네이버 금융</p>
            </div>
          </a>
        )}

        <p className="text-[9px] text-emerald-400/50 mt-2">
          ※ 공개 시장 데이터 자동 요약 · 투자 권유 아님 · 모든 투자 판단은 본인 책임
        </p>
      </div>

      {/* ── 3. 현황 요약 3칸 ── */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* 위험 신호 */}
        <div className="bg-white rounded-xl p-3 border border-slate-100 text-center">
          <div className="text-base mb-1">🛡️</div>
          <div className="text-[10px] text-slate-500 mb-0.5">위험 신호</div>
          <div className="text-[9px] text-slate-400 mb-2">상폐·정지·관리</div>
          <div className="text-[13px] font-medium text-emerald-700">없음</div>
          <div className="mt-1.5 inline-block text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-100">정상</div>
        </div>
        {/* 외국인 동향 */}
        <div className="bg-white rounded-xl p-3 border border-slate-100 text-center">
          <div className="text-base mb-1">🌐</div>
          <div className="text-[10px] text-slate-500 mb-0.5">외국인</div>
          <div className="text-[9px] text-slate-400 mb-2">5일 순매수</div>
          {f5d !== 0 ? (
            <>
              <div className={`text-[13px] font-medium ${f5d >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {fDays > 0 ? `${fDays}일↑` : '순매도↓'}
              </div>
              <div className={`text-[10px] font-medium mt-1 ${f5d >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {fmtAmt(f5d)}
              </div>
            </>
          ) : (
            <div className="text-[12px] text-slate-400 mt-3">-</div>
          )}
        </div>
        {/* 목표가 여력 */}
        <div className="bg-white rounded-xl p-3 border border-slate-100 text-center">
          <div className="text-base mb-1">🎯</div>
          <div className="text-[10px] text-slate-500 mb-0.5">목표가 여력</div>
          <div className="text-[9px] text-slate-400 mb-2">애널리스트 평균</div>
          {targetUpside !== null ? (
            <>
              <div className={`text-[13px] font-medium ${targetUpside >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {targetUpside >= 0 ? '+' : ''}{targetUpside.toFixed(1)}%
              </div>
              <div className="text-[9px] text-slate-400 mt-1">{fmtPrice(cons!.targetPrice)}원</div>
            </>
          ) : (
            <div className="text-[11px] text-slate-400 mt-1 leading-tight">데이터<br/>없음</div>
          )}
        </div>
      </div>

      {/* ── 4. 1년 가격 위치 ── */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="text-[13px] font-medium text-slate-800 mb-0.5 flex items-center gap-1.5">
          <span>📊</span> 1년 가격 위치
        </div>
        <div className="text-[10px] text-slate-400 mb-3">52주 최저~최고 기준 현재 위치</div>
        <div className="relative h-4 rounded-full overflow-visible mb-3"
          style={{ background: 'linear-gradient(to right,#1d4ed8,#9ca3af 50%,#dc2626)' }}>
          <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-[3px] border-emerald-700 rounded-full shadow-sm"
            style={{ left: `clamp(0px, calc(${pricePos}% - 10px), calc(100% - 20px))` }} />
        </div>
        <div className="flex justify-between items-center mb-1.5">
          <div>
            <div className="text-[10px] text-blue-600 font-medium">최저</div>
            <div className="text-[11px] font-medium">{fmtPrice(naverData.low52w)}원</div>
          </div>
          <div className="bg-slate-100 rounded-full px-3 py-1">
            <span className="text-[11px] font-medium text-slate-700">{posLabel}</span>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-red-500 font-medium">최고</div>
            <div className="text-[11px] font-medium">{fmtPrice(naverData.high52w)}원</div>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] text-slate-400">최저 대비 +{pricePos.toFixed(0)}%</span>
          <span className="text-[10px] text-slate-400">최고 대비 -{(100 - pricePos).toFixed(0)}%</span>
        </div>
      </div>

      {/* ── 5. PER / PBR / 배당률 ── */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { emoji: '💼', label: 'PER',   sub: '주가 / 순이익',  val: naverData.per > 0 ? `${naverData.per.toFixed(1)}배` : '적자', extra: '' },
          { emoji: '📈', label: 'PBR',   sub: '주가 / 순자산',  val: naverData.pbr > 0 ? `${naverData.pbr.toFixed(1)}배` : '-',    extra: '' },
          { emoji: '💰', label: '배당률', sub: '연간 배당 / 주가', val: naverData.dividendYield > 0 ? `${naverData.dividendYield.toFixed(1)}%` : '-', extra: naverData.dividendYield > 0 ? '연간' : '' },
        ].map(({ emoji, label, sub, val, extra }) => (
          <div key={label} className="bg-white rounded-xl p-3 border border-slate-100 text-center">
            <div className="text-base mb-1">{emoji}</div>
            <div className="text-[11px] text-slate-500 mb-0.5">{label}</div>
            <div className="text-[9px] text-slate-400 mb-2">{sub}</div>
            <div className="text-[16px] font-medium">{val}</div>
            {extra && <div className="text-[9px] text-emerald-700 font-medium mt-1">{extra}</div>}
          </div>
        ))}
      </div>

      {/* ── 6. 추세 · 수급 ── */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="text-[13px] font-medium text-slate-800 mb-0.5 flex items-center gap-1.5">
          <span>📉</span> 추세 · 수급
        </div>
        <div className="text-[10px] text-slate-400 mb-3">5일 순매수 · 보유율 기준 게이지 · 빨강=매수, 파랑=매도</div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-red-50 rounded-lg p-2.5 border border-red-100">
            <div className="text-[10px] text-red-800 mb-1">주가 단기</div>
            <div className="text-[13px] font-medium text-red-600">
              {naverData.price > 0 ? '데이터 확인 중' : '-'}
            </div>
            <div className="text-[9px] text-slate-400 mt-1">5일선 기준</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5">
            <div className="text-[10px] text-slate-500 mb-1">오늘 거래량</div>
            <div className="text-[12px] font-medium">
              {naverData.volume > 0 ? `${naverData.volume.toLocaleString('ko-KR')}주` : '-'}
            </div>
          </div>
        </div>

        {/* 외국인 / 기관 / 개인 — 보유율 기반 게이지 */}
        {tradingData ? (
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 grid text-[10px] font-medium text-slate-500"
              style={{ gridTemplateColumns: '52px 1fr 70px' }}>
              <span>투자자</span>
              <span className="text-center">5일 순매수 / 보유율</span>
              <span className="text-right">보유율</span>
            </div>
            {([
              { label: '외국인', net: f5d, days: fDays, pct: fPct, isInst: false },
              { label: '기관',   net: i5d, days: iDays, pct: iPct, isInst: true  },
              { label: '개인',   net: p5d, days: 0,     pct: pPct, isInst: false },
            ] as const).map(({ label, net, days, pct }, idx) => (
              <div key={label}
                className={`px-3 py-2.5 grid items-center gap-1 ${idx > 0 ? 'border-t border-slate-100' : ''}`}
                style={{ gridTemplateColumns: '52px 1fr 70px' }}>
                <span className="text-[12px] font-medium">{label}</span>
                <div>
                  {/* 보유율 기반 게이지 */}
                  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                    {/* 보유율 배경 (회색) */}
                    <div
                      className="absolute top-0 left-0 h-full bg-slate-300 rounded-full"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                    {/* 순매수/매도 오버레이 */}
                    {net !== 0 && (
                      <div
                        className={`absolute top-0 h-full rounded-full ${net >= 0 ? 'bg-red-500' : 'bg-blue-600'}`}
                        style={{
                          width: `${Math.min(Math.abs(net) / (naverData.price * 10000000) * 100, 30)}%`,
                          left: net >= 0 ? `${Math.min(pct, 70)}%` : undefined,
                          right: net < 0 ? `${100 - Math.min(pct, 100)}%` : undefined,
                          opacity: 0.8,
                        }}
                      />
                    )}
                  </div>
                  <div className={`text-[10px] font-medium ${net >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                    {net !== 0 ? fmtAmt(net) : '-'}
                    {days > 0 ? ` (${days}일 연속)` : net < 0 ? ' (매도)' : ''}
                  </div>
                </div>
                <span className={`text-[12px] font-medium text-right ${pct > 0 ? 'text-slate-700' : 'text-slate-400'}`}>
                  {pct > 0 ? `${pct.toFixed(1)}%` : '-'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[12px] text-slate-400 text-center py-4">수급 데이터 없음</div>
        )}
      </div>

      {/* ── 7. 리스크 지표 ── */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="text-[13px] font-medium text-slate-800 mb-0.5 flex items-center gap-1.5">
          <span>⚠️</span> 리스크 지표
        </div>
        <div className="text-[10px] text-slate-400 mb-3">공매도·신용·변동성 기반 위험도 측정</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              label: '공매도 잔고', sub: '하락 베팅 (1%미만=낮음)',
              value: '-', tag: '준비 중', tagCls: 'bg-slate-100 text-slate-500',
              source: '출처: KRX', valueCls: 'text-slate-500',
            },
            {
              label: '신용잔고 비율', sub: '빚 투자 (2%미만=낮음)',
              value: '-', tag: '준비 중', tagCls: 'bg-slate-100 text-slate-500',
              source: '출처: 네이버', valueCls: 'text-slate-500',
            },
            {
              label: '베타 (β)', sub: '코스피 1% 움직이면?',
              value: '-', tag: '계산 예정', tagCls: 'bg-amber-50 text-amber-700',
              source: '코스피 대비 1년', valueCls: 'text-slate-500',
            },
            {
              label: '거래정지 · 위험', sub: '관리·환기종목 여부',
              value: '없음', tag: '정상 거래', tagCls: 'bg-emerald-50 text-emerald-700',
              source: '출처: KRX', valueCls: 'text-emerald-700',
            },
          ].map(({ label, sub, value, tag, tagCls, source, valueCls }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-3">
              <div className="text-[10px] text-slate-500 mb-0.5">{label}</div>
              <div className="text-[9px] text-slate-400 mb-2">{sub}</div>
              <div className={`text-[15px] font-medium mb-2 ${valueCls}`}>{value}</div>
              <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${tagCls}`}>{tag}</span>
              <div className="text-[9px] text-slate-400 mt-1.5">{source}</div>
            </div>
          ))}
        </div>
      </div>

      <MobileAd />
      <PCBannerAd />

      {/* ── 8. 애널리스트 컨센서스 ── */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="text-[13px] font-medium text-slate-800 mb-0.5 flex items-center gap-1.5">
          <span>🎯</span> 애널리스트 컨센서스
        </div>
        <div className="text-[10px] text-slate-400 mb-3">증권사 리서치센터 의견 종합 · 출처: 네이버 금융</div>

        {cons ? (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
                <div className="text-[10px] text-red-800 font-medium mb-1.5">매수</div>
                <div className="text-2xl font-medium text-red-600">{cons.buyCount}</div>
                <div className="text-[11px] font-medium text-red-600 mt-0.5">{buyPct}%</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="text-[10px] text-slate-500 font-medium mb-1.5">중립</div>
                <div className="text-2xl font-medium text-slate-700">{cons.neutralCount}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{neutralPct}%</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="text-[10px] text-slate-500 font-medium mb-1.5">매도</div>
                <div className="text-2xl font-medium text-slate-400">{cons.sellCount}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{sellPct}%</div>
              </div>
            </div>

            {cons.targetPrice > 0 && (
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-[10px] text-slate-500 mb-0.5">현재가</div>
                    <div className="text-[16px] font-medium">{fmtPrice(naverData.price)}원</div>
                  </div>
                  <div className="text-center">
                    {targetUpside !== null && (
                      <>
                        <div className={`text-[17px] font-medium ${targetUpside >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                          {targetUpside >= 0 ? '+' : ''}{targetUpside.toFixed(1)}%
                        </div>
                        <div className="text-[9px] text-slate-400">상승 여력</div>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-red-500 mb-0.5">평균 목표가</div>
                    <div className="text-[16px] font-medium text-red-600">{fmtPrice(cons.targetPrice)}원</div>
                  </div>
                </div>
                {/* 게이지 */}
                <div className="relative h-5 mb-3">
                  <div className="absolute inset-y-1.5 left-0 right-0 rounded-full overflow-hidden"
                    style={{ background: 'linear-gradient(to right,#1d4ed8,#93c5fd,#d1d5db,#f87171,#dc2626)' }}>
                  </div>
                  {/* 현재가 ■ */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-slate-700 border-2 border-white rounded-sm z-10"
                    style={{ left: `calc(${gaugePct}% - 10px)` }} />
                  {/* 목표가 ● */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-red-600 border-2 border-white rounded-full z-10"
                    style={{ right: '2%' }} />
                </div>
                <div className="flex justify-between text-[10px]">
                  {cons.targetPriceLow > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                      <span className="text-slate-500">하향 {fmtPrice(cons.targetPriceLow)}원</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-slate-700 flex-shrink-0"></div>
                    <span className="text-slate-500">현재 ■</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0"></div>
                    <span className="text-red-600 font-medium">목표 ●</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-[12px] text-slate-400">컨센서스 데이터 없음</div>
            <div className="text-[10px] text-slate-300 mt-1">애널리스트 커버리지가 없는 종목입니다</div>
          </div>
        )}
        <p className="text-[10px] text-slate-400 mt-2">출처: 네이버 금융 컨센서스 · 참고용</p>
      </div>

      {/* ── 9. 실적 ── */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="text-[13px] font-medium text-slate-800 mb-0.5 flex items-center gap-1.5">
          <span>📋</span> 실적 (최근 분기)
        </div>
        <div className="text-[10px] text-slate-400 mb-3">DART 공시 기반 · 전년 동기 대비</div>
        <div className="text-[12px] text-slate-400 text-center py-3">실적 데이터 연동 준비 중</div>
        <p className="text-[10px] text-slate-400">출처: DART 공시</p>
      </div>

      {/* ── 10. 회사 정보 ── */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="text-[13px] font-medium text-slate-800 mb-0.5 flex items-center gap-1.5">
          <span>🏢</span> 회사 정보
        </div>
        <div className="text-[10px] text-slate-400 mb-3">DART 공시 기반 기업 기본 정보</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '대표', value: dartData?.ceo || '-' },
            { label: '본사', value: dartData?.headquarters || '-' },
            { label: '설립', value: dartData?.ipoDate || '-' },
            { label: '시장', value: naverData.market },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[10px] text-slate-400 mb-0.5">{label}</div>
              <div className="text-[12px] font-medium text-slate-800">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <MobileAd />
      <PCBannerAd />

      {/* ── 11. 외부 링크 ── */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { emoji: '📊', label: '호가',   sub: '네이버',    href: `https://finance.naver.com/item/order.naver?code=${params.stockCode}` },
          { emoji: '🏛️', label: 'DART',   sub: '공시',      href: `https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=${params.stockCode}` },
          { emoji: '💬', label: '토론방', sub: '커뮤니티',  href: `https://finance.naver.com/item/board.naver?code=${params.stockCode}` },
        ].map(({ emoji, label, sub, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            className="bg-white rounded-xl p-3 text-center border border-slate-100 hover:bg-slate-50 transition-colors block">
            <div className="text-base mb-1">{emoji}</div>
            <div className="text-[12px] font-medium text-emerald-700">{label}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>
          </a>
        ))}
      </div>

      {/* 면책 조항 */}
      <div className="text-center py-3 text-[10px] text-slate-400 leading-loose">
        본 정보는 참고용이며 투자 자문이 아닙니다.<br />
        모든 투자 판단과 결과는 본인 책임입니다.<br />
        © 2026 1MINSTOCK · 벨롱스
      </div>
    </>
  );
}
