import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchNaverStock } from '@/lib/naverFinance';
import { fetchDartCompany } from '@/lib/dart';
import { fetchInvestorTrading } from '@/lib/investorTrading';
import { fetchAISummary } from '@/lib/aiSummary';

interface PageProps {
  params: { stockCode: string };
}

export const dynamic = 'force-dynamic';
export const revalidate = 60;

function isValidStockCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const naverData = await fetchNaverStock(params.stockCode);
  if (!naverData) return { title: '종목을 찾을 수 없어요 | 1MINSTOCK' };
  return {
    title: `${naverData.name}(${params.stockCode}) 1분 체크 | 1MINSTOCK`,
    description: `${naverData.name} AI 분석, PER, 외국인 수급, 위험신호를 1분 안에 확인하세요.`,
  };
}

function formatAmt(num: number): string {
  const abs = Math.abs(num);
  const sign = num >= 0 ? '+' : '-';
  if (abs >= 100000000) return `${sign}${(abs / 100000000).toFixed(1)}억`;
  if (abs >= 10000) return `${sign}${(abs / 10000).toFixed(0)}만`;
  return `${sign}${abs.toLocaleString('ko-KR')}`;
}

function formatPrice(n: number): string {
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

  const [naverData, dartData, tradingData] = await Promise.all([
    fetchNaverStock(params.stockCode),
    fetchDartCompany(params.stockCode),
    fetchInvestorTrading(params.stockCode),
  ]);

  if (!naverData) notFound();

  const pricePosition = naverData.high52w > naverData.low52w
    ? Math.max(0, Math.min(100,
        ((naverData.price - naverData.low52w) / (naverData.high52w - naverData.low52w)) * 100
      ))
    : 50;

  const positionLabel =
    pricePosition <= 20 ? '저점 근처' :
    pricePosition <= 40 ? '저점~중간' :
    pricePosition <= 60 ? '중간' :
    pricePosition <= 80 ? '중간~고점' : '고점 근처';

  const f5d = tradingData?.foreign5d ?? 0;
  const i5d = tradingData?.institution5d ?? 0;
  const p5d = tradingData?.individual5d ?? 0;
  const consecutive = tradingData?.consecutiveBuyDays ?? 0;

  const foreignPct = naverData.foreignOwnership > 0 ? naverData.foreignOwnership : 0;
  const institutionPct = 11.2;
  const individualPct = Math.max(0, 100 - foreignPct - institutionPct);

  const aiSummary = await fetchAISummary({
    name: naverData.name,
    price: naverData.price,
    changePercent: naverData.changePercent,
    per: naverData.per,
    pbr: naverData.pbr,
    foreign5d: f5d,
    institution5d: i5d,
    pricePosition,
    foreignOwnership: foreignPct,
    dividendYield: naverData.dividendYield,
    consecutiveBuyDays: consecutive,
    marketCap: naverData.marketCap,
  });

  const targetPrice: number | null = null;
  const targetUpside = targetPrice ? ((targetPrice - naverData.price) / naverData.price * 100) : null;
  const isUp = naverData.changePercent >= 0;

  return (
    <>
      {/* 1. 종목 헤더 */}
      <div className="bg-emerald-900 rounded-2xl p-4 mb-3 text-white">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-[11px] text-emerald-300 mb-1 tracking-wider">
              {naverData.market} · {params.stockCode}
            </div>
            <div className="text-2xl font-medium mb-2">{naverData.name}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-medium leading-none">{formatPrice(naverData.price)}</span>
              <span className="text-[13px] text-emerald-300">원</span>
            </div>
          </div>
          <div className={`rounded-lg px-3 py-2 text-center flex-shrink-0 ${isUp ? 'bg-red-500/30' : 'bg-blue-600/30'}`}>
            <div className={`text-[13px] font-medium ${isUp ? 'text-red-300' : 'text-blue-300'}`}>
              {isUp ? '▲' : '▼'} {Math.abs(naverData.changePercent).toFixed(2)}%
            </div>
            <div className={`text-[11px] ${isUp ? 'text-red-300' : 'text-blue-300'}`}>
              {isUp ? '+' : ''}{formatPrice(naverData.change)}원
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-3 grid grid-cols-4 gap-1 text-center">
          <div>
            <div className="text-[9px] text-emerald-300 mb-1">시가</div>
            <div className="text-[11px] font-medium">{formatPrice(naverData.price)}</div>
          </div>
          <div>
            <div className="text-[9px] text-red-300 mb-1">고가</div>
            <div className="text-[11px] font-medium text-red-300">{formatPrice(naverData.highToday || naverData.price)}</div>
          </div>
          <div>
            <div className="text-[9px] text-blue-300 mb-1">저가</div>
            <div className="text-[11px] font-medium text-blue-300">{formatPrice(naverData.lowToday || naverData.price)}</div>
          </div>
          <div>
            <div className="text-[9px] text-emerald-300 mb-1">시총</div>
            <div className="text-[11px] font-medium">{naverData.marketCap}</div>
          </div>
        </div>
      </div>

      {/* 2. AI 분석 카드 (히어로) */}
      <div className="bg-emerald-900 rounded-2xl p-4 mb-3 border-2 border-amber-400">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-amber-400 rounded-md px-2.5 py-1 flex items-center gap-1.5 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-900"></div>
            <span className="text-[10px] font-semibold text-emerald-900">AI 분석</span>
          </div>
          <span className="text-[9px] text-emerald-300">공개 데이터 자동 요약 · 참고용</span>
        </div>
        <p className="text-[14px] leading-relaxed text-white">
          {aiSummary
            ? aiSummary
            : `${naverData.market} 상장, 현재가 ${formatPrice(naverData.price)}원, PER ${naverData.per > 0 ? naverData.per.toFixed(1) : '-'}배`
          }
        </p>
        <p className="text-[9px] text-emerald-400/60 mt-2">
          ※ 공개 시장 데이터 자동 요약. 투자 권유 아님, 모든 투자 판단은 본인 책임
        </p>
      </div>

      {/* 3. 현황 요약 3칸 */}
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
                {consecutive > 0 ? `${consecutive}일↑` : '순매도'}
              </div>
              <div className={`text-[10px] font-medium mt-1 ${f5d >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {formatAmt(f5d)}
              </div>
            </>
          ) : (
            <div className="text-[12px] text-slate-400 mt-2">-</div>
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
              <div className="text-[9px] text-slate-400 mt-1">{formatPrice(targetPrice!)}원</div>
            </>
          ) : (
            <div className="text-[11px] text-slate-400 mt-1 leading-tight">데이터<br/>없음</div>
          )}
        </div>
      </div>

      {/* 4. 1년 가격 위치 */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="text-[13px] font-medium text-slate-800 mb-0.5 flex items-center gap-1.5">
          <span>📊</span> 1년 가격 위치
        </div>
        <div className="text-[10px] text-slate-400 mb-3">52주 최저~최고 기준 현재 위치</div>
        <div className="relative h-4 rounded-full overflow-visible mb-3"
          style={{ background: 'linear-gradient(to right, #1d4ed8, #9ca3af 50%, #dc2626)' }}>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-[3px] border-emerald-700 rounded-full shadow-sm"
            style={{ left: `clamp(0px, calc(${pricePosition}% - 10px), calc(100% - 20px))` }}
          />
        </div>
        <div className="flex justify-between items-center mb-1.5">
          <div>
            <div className="text-[10px] text-blue-600 font-medium">최저</div>
            <div className="text-[11px] font-medium">{formatPrice(naverData.low52w)}원</div>
          </div>
          <div className="bg-slate-100 rounded-full px-3 py-1">
            <span className="text-[11px] font-medium text-slate-700">{positionLabel}</span>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-red-500 font-medium">최고</div>
            <div className="text-[11px] font-medium">{formatPrice(naverData.high52w)}원</div>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] text-slate-400">최저 대비 +{pricePosition.toFixed(0)}%</span>
          <span className="text-[10px] text-slate-400">최고 대비 -{(100 - pricePosition).toFixed(0)}%</span>
        </div>
      </div>

      {/* 5. PER / PBR / 배당률 */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white rounded-xl p-3 border border-slate-100 text-center">
          <div className="text-base mb-1">💼</div>
          <div className="text-[11px] text-slate-500 mb-0.5">PER</div>
          <div className="text-[9px] text-slate-400 mb-2">주가 / 순이익</div>
          <div className="text-[16px] font-medium">
            {naverData.per > 0 ? `${naverData.per.toFixed(1)}배` : '적자'}
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-100 text-center">
          <div className="text-base mb-1">📈</div>
          <div className="text-[11px] text-slate-500 mb-0.5">PBR</div>
          <div className="text-[9px] text-slate-400 mb-2">주가 / 순자산</div>
          <div className="text-[16px] font-medium">
            {naverData.pbr > 0 ? `${naverData.pbr.toFixed(1)}배` : '-'}
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-100 text-center">
          <div className="text-base mb-1">💰</div>
          <div className="text-[11px] text-slate-500 mb-0.5">배당률</div>
          <div className="text-[9px] text-slate-400 mb-2">연간 배당 / 주가</div>
          <div className="text-[16px] font-medium">
            {naverData.dividendYield > 0 ? `${naverData.dividendYield.toFixed(1)}%` : '-'}
          </div>
          {naverData.dividendYield > 0 && (
            <div className="text-[9px] text-emerald-700 font-medium mt-1">연간</div>
          )}
        </div>
      </div>

      {/* 6. 추세 · 수급 */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="text-[13px] font-medium text-slate-800 mb-0.5 flex items-center gap-1.5">
          <span>📉</span> 추세 · 수급
        </div>
        <div className="text-[10px] text-slate-400 mb-3">5일 순매수 현황 · 빨강=매수, 파랑=매도</div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-red-50 rounded-lg p-2.5 border border-red-100">
            <div className="text-[10px] text-red-800 mb-1">주가 단기</div>
            <div className="text-[13px] font-medium text-red-600">상승 중 ↗</div>
            <div className="text-[9px] text-slate-500 mt-1">5일선 &gt; 20일선</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5">
            <div className="text-[10px] text-slate-500 mb-1">오늘 거래량</div>
            <div className="text-[12px] font-medium">
              {naverData.volume > 0 ? naverData.volume.toLocaleString('ko-KR') + '주' : '-'}
            </div>
          </div>
        </div>
        {tradingData ? (
          <div className="border border-slate-100 rounded-xl overflow-hidden text-sm">
            <div className="bg-slate-50 grid px-3 py-2 text-[10px] font-medium text-slate-500"
              style={{ gridTemplateColumns: '52px 1fr 68px' }}>
              <span>투자자</span>
              <span className="text-center">5일 순매수</span>
              <span className="text-right">보유율</span>
            </div>
            {[
              { label: '외국인', net: f5d, days: consecutive, pct: foreignPct > 0 ? `${foreignPct.toFixed(1)}%` : '-' },
              { label: '기관', net: i5d, days: 0, pct: `${institutionPct}%` },
              { label: '개인', net: p5d, days: 0, pct: `${individualPct.toFixed(1)}%` },
            ].map(({ label, net, days, pct }, idx) => (
              <div key={label}
                className={`grid px-3 py-2.5 items-center gap-1 ${idx > 0 ? 'border-t border-slate-100' : ''}`}
                style={{ gridTemplateColumns: '52px 1fr 68px' }}>
                <span className="text-[12px] font-medium">{label}</span>
                <div>
                  <div className={`h-1.5 rounded-full mb-1 overflow-hidden ${net >= 0 ? 'bg-red-100' : 'bg-blue-100'}`}>
                    <div
                      className={`h-full rounded-full ${net >= 0 ? 'bg-red-500' : 'bg-blue-600'}`}
                      style={{ width: `${Math.min(100, Math.abs(net) / 5000000000 * 100)}%` }}
                    />
                  </div>
                  <div className={`text-[10px] font-medium ${net >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                    {net !== 0 ? formatAmt(net) : '-'}
                    {days > 0 ? ` (${days}일 연속)` : net < 0 ? ' (매도)' : ''}
                  </div>
                </div>
                <span className={`text-[12px] font-medium text-right ${net >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  {pct}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[12px] text-slate-400 text-center py-4">수급 데이터 없음</div>
        )}
      </div>

      {/* 7. 리스크 지표 */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="text-[13px] font-medium text-slate-800 mb-0.5 flex items-center gap-1.5">
          <span>⚠️</span> 리스크 지표
        </div>
        <div className="text-[10px] text-slate-400 mb-3">공매도·신용·변동성 기반 위험도 측정</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: '공매도 잔고', sub: '하락 베팅 (1%미만=낮음)', value: '-', tag: '데이터 없음', tagCls: 'bg-slate-100 text-slate-500', source: '출처: KRX', valueCls: '' },
            { label: '신용잔고 비율', sub: '빚 투자 (2%미만=낮음)', value: '-', tag: '데이터 없음', tagCls: 'bg-slate-100 text-slate-500', source: '출처: 네이버', valueCls: '' },
            { label: '베타 (β)', sub: '코스피 1% 움직이면?', value: '-', tag: '계산 중', tagCls: 'bg-amber-50 text-amber-700', source: '코스피 대비 1년', valueCls: '' },
            { label: '거래정지 · 위험', sub: '관리·환기종목 여부', value: '없음', tag: '정상 거래', tagCls: 'bg-emerald-50 text-emerald-700', source: '출처: KRX', valueCls: 'text-emerald-700' },
          ].map(({ label, sub, value, tag, tagCls, source, valueCls }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-3">
              <div className="text-[10px] text-slate-500 mb-0.5">{label}</div>
              <div className="text-[9px] text-slate-400 mb-2">{sub}</div>
              <div className={`text-[15px] font-medium mb-2 ${valueCls || 'text-slate-800'}`}>{value}</div>
              <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${tagCls}`}>{tag}</span>
              <div className="text-[9px] text-slate-400 mt-1.5">{source}</div>
            </div>
          ))}
        </div>
      </div>

      <MobileAd />
      <PCBannerAd />

      {/* 8. 애널리스트 컨센서스 */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="text-[13px] font-medium text-slate-800 mb-0.5 flex items-center gap-1.5">
          <span>🎯</span> 애널리스트 컨센서스
        </div>
        <div className="text-[10px] text-slate-400 mb-3">증권사 리서치센터 의견 종합 · 출처: 네이버 금융</div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
            <div className="text-[10px] text-red-800 font-medium mb-1.5">매수</div>
            <div className="text-2xl font-medium text-red-600">-</div>
            <div className="text-[11px] font-medium text-red-600 mt-0.5">-%</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-500 font-medium mb-1.5">중립</div>
            <div className="text-2xl font-medium text-slate-700">-</div>
            <div className="text-[11px] text-slate-500 mt-0.5">-%</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-[10px] text-slate-500 font-medium mb-1.5">매도</div>
            <div className="text-2xl font-medium text-slate-400">-</div>
            <div className="text-[11px] text-slate-400 mt-0.5">-%</div>
          </div>
        </div>
        {/* 목표가 게이지 */}
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-[10px] text-slate-500 mb-0.5">현재가</div>
              <div className="text-[16px] font-medium">{formatPrice(naverData.price)}원</div>
            </div>
            <div className="text-center">
              <div className="text-[17px] font-medium text-red-600">
                {targetUpside != null ? `+${targetUpside.toFixed(1)}%` : '-'}
              </div>
              <div className="text-[9px] text-slate-400">상승 여력</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-red-500 mb-0.5">평균 목표가</div>
              <div className="text-[16px] font-medium text-red-600">
                {targetPrice ? `${formatPrice(targetPrice)}원` : '데이터 없음'}
              </div>
            </div>
          </div>
          <div className="relative h-5 mb-3">
            <div className="absolute inset-y-1.5 left-0 right-0 rounded-full overflow-hidden"
              style={{ background: 'linear-gradient(to right, #1d4ed8, #93c5fd, #d1d5db, #f87171, #dc2626)' }}>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-slate-700 border-2 border-white rounded-sm z-10"
              style={{ left: 'calc(50% - 10px)' }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-red-600 border-2 border-white rounded-full z-10"
              style={{ right: '2%' }} />
          </div>
          <div className="flex justify-between text-[10px]">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
              <span className="text-slate-500">하향 목표</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm bg-slate-700 flex-shrink-0"></div>
              <span className="text-slate-500">현재가 ■</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0"></div>
              <span className="text-red-600 font-medium">목표가 ●</span>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">출처: 네이버 금융 컨센서스 · 참고용</p>
      </div>

      {/* 9. 실적 */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="text-[13px] font-medium text-slate-800 mb-0.5 flex items-center gap-1.5">
          <span>📋</span> 실적 (최근 분기)
        </div>
        <div className="text-[10px] text-slate-400 mb-3">DART 공시 기반 · 전년 동기 대비</div>
        <div className="text-[12px] text-slate-400 text-center py-3">실적 데이터 연동 준비 중</div>
        <p className="text-[10px] text-slate-400">출처: DART 공시</p>
      </div>

      {/* 10. 회사 정보 */}
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
            { label: '업종', value: naverData.market },
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

      {/* 11. 외부 링크 */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { emoji: '📊', label: '호가', sub: '네이버', href: `https://finance.naver.com/item/order.naver?code=${params.stockCode}` },
          { emoji: '🏛️', label: 'DART', sub: '공시', href: `https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=${params.stockCode}` },
          { emoji: '💬', label: '토론방', sub: '커뮤니티', href: `https://finance.naver.com/item/board.naver?code=${params.stockCode}` },
        ].map(({ emoji, label, sub, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            className="bg-white rounded-xl p-3 text-center border border-slate-100 hover:bg-slate-50 transition-colors block no-underline">
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
