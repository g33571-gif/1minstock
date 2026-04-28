import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchNaverStock } from '@/lib/naverFinance';
import { fetchDartCompany } from '@/lib/dart';
import { fetchInvestorTrading } from '@/lib/investorTrading';

function isValidStockCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

interface PageProps {
  params: { stockCode: string };
}

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const naverData = await fetchNaverStock(params.stockCode);
  if (!naverData) return { title: '종목을 찾을 수 없어요 | 1MINSTOCK' };
  return {
    title: `${naverData.name}(${params.stockCode}) 종목 정보 | 1MINSTOCK`,
    description: `${naverData.name} 시가총액, PER, 외국인 보유율, 위험 신호 등 핵심 정보를 한 화면에.`,
  };
}

const MobileAd = () => (
  <div className="lg:hidden bg-bg-subtle border border-dashed border-slate-300 rounded-xl p-3 text-center mb-3.5">
    <div className="text-[10px] text-slate-500 font-semibold mb-1">AD · 광고</div>
    <div className="text-xs text-slate-400 flex items-center justify-center" style={{ minHeight: '100px' }}>
      [ 320×100 ]
    </div>
  </div>
);

const PCBannerAd = () => (
  <div className="hidden lg:block bg-bg-subtle border border-dashed border-slate-300 rounded-xl p-3 text-center mb-3.5">
    <div className="text-[10px] text-slate-500 font-semibold mb-1">AD · 광고</div>
    <div className="text-xs text-slate-400 flex items-center justify-center" style={{ minHeight: '90px' }}>
      [ 728×90 ]
    </div>
  </div>
);

// 숫자 포맷 (한국식: 억, 만)
function formatVolume(num: number): string {
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : (num > 0 ? '+' : '');
  
  if (abs >= 100000000) { // 1억
    return `${sign}${(abs / 100000000).toFixed(1)}억`;
  } else if (abs >= 10000) { // 1만
    return `${sign}${(abs / 10000).toFixed(0)}만`;
  } else {
    return `${sign}${abs.toLocaleString('ko-KR')}`;
  }
}

export default async function StockDetailPage({ params }: PageProps) {
  if (!isValidStockCode(params.stockCode)) notFound();

  // 모든 데이터 병렬 호출
  const [naverData, dartData, tradingData] = await Promise.all([
    fetchNaverStock(params.stockCode),
    fetchDartCompany(params.stockCode),
    fetchInvestorTrading(params.stockCode),
  ]);

  if (!naverData) notFound();

  const isUp = naverData.changePercent > 0;
  
  const pricePosition = naverData.high52w > naverData.low52w
    ? Math.max(0, Math.min(100, ((naverData.price - naverData.low52w) / (naverData.high52w - naverData.low52w)) * 100))
    : 50;
  const positionLabel = pricePosition >= 50 
    ? `상위 ${(100 - pricePosition).toFixed(0)}%`
    : `하위 ${pricePosition.toFixed(0)}%`;
  const isHighPosition = pricePosition >= 50;
  
  const businessTags = [naverData.market];
  
  // 매매 동향 데이터
  const hasTradingData = tradingData && tradingData.daily.length > 0;
  
  return (
    <>
      <MobileAd />
      <PCBannerAd />
      
      {/* 1. 종목 헤더 */}
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-600 rounded-3xl p-7 px-6 mb-3.5 text-white">
        <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
          <span className="text-xs px-3 py-1 bg-white/[0.18] rounded-full font-medium tracking-wider">
            {naverData.market} · {params.stockCode}
          </span>
        </div>
        <div className="text-[28px] font-semibold tracking-tight mb-1">{naverData.name}</div>
        <div className="text-sm opacity-90 mb-5">{naverData.description}</div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-5xl font-semibold tracking-tight">{naverData.price.toLocaleString('ko-KR')}</span>
          <span className="text-lg opacity-85">원</span>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`text-[15px] font-semibold px-3.5 py-1 rounded-lg ${
            isUp ? 'bg-red-500/40 text-red-100' : 'bg-blue-700/40 text-blue-200'
          }`}>
            {isUp ? '▲' : '▼'} {Math.abs(naverData.changePercent).toFixed(2)}% ({naverData.change > 0 ? '+' : ''}{naverData.change.toLocaleString('ko-KR')}원)
          </span>
        </div>
      </div>

      {/* 2. 위험 신호 */}
      <div className="bg-white rounded-3xl p-5 mb-3.5 border-[1.5px] border-emerald-700 flex items-center gap-3.5">
        <div className="w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-[15px] font-semibold text-emerald-700 mb-0.5">위험 신호 없음</div>
          <div className="text-[13px] text-gray-600">관리종목, 환기종목, 거래정지 등 해당 사항 없음</div>
        </div>
      </div>

      {/* 3. 핵심 지표 */}
      <div className="bg-white rounded-3xl p-5 mb-3.5 border-l-[3px] border-emerald-700">
        <div className="text-[13px] text-emerald-700 font-semibold mb-3">💎 핵심 지표</div>
        <div className="text-[15px] leading-relaxed text-gray-900">
          52주 가격 범위 중{' '}
          <strong className={`font-semibold ${isHighPosition ? 'text-emerald-700' : 'text-blue-700'}`}>
            {positionLabel}
          </strong>{' '}위치<br/>
          외국인 보유율{' '}
          <strong className="font-semibold text-emerald-700">
            {naverData.foreignOwnership > 0 ? `${naverData.foreignOwnership.toFixed(1)}%` : '정보 없음'}
          </strong><br/>
          PER{' '}
          <strong className="font-semibold text-emerald-700">
            {naverData.per > 0 ? `${naverData.per.toFixed(1)}배` : '정보 없음'}
          </strong>
        </div>
      </div>

      {/* 4. 시가총액 + 배당률 */}
      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        <div className="bg-white rounded-2xl p-4 border border-emerald-700/10">
          <div className="text-xs text-gray-600 font-semibold mb-2">시가총액</div>
          <div className="text-2xl font-semibold text-gray-900">{naverData.marketCap || '-'}</div>
          <div className="inline-block text-[11px] px-2.5 py-0.5 bg-emerald-700 text-white rounded-full font-semibold mt-1.5">
            {naverData.market}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-emerald-700/10">
          <div className="text-xs text-gray-600 font-semibold mb-2">배당률</div>
          <div className="text-2xl font-semibold text-gray-900">
            {naverData.dividendYield > 0 ? `${naverData.dividendYield.toFixed(1)}%` : '-'}
          </div>
          <div className="text-xs text-gray-500 mt-1.5">
            {naverData.dividendYield > 0 ? '연간' : '배당 없음'}
          </div>
        </div>
      </div>

      {/* 5. 가격 위치 게이지 */}
      <div className="bg-white rounded-3xl p-5 mb-3.5 border border-emerald-700/10">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-[30px] h-[30px] bg-emerald-50 rounded-lg flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v20M2 12h20" stroke="#047857" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">📊 52주 가격 위치</h3>
        </div>
        <div className="relative h-[18px] rounded-full mb-4 overflow-hidden">
          <div className="absolute left-0 top-0 h-[18px] w-1/2 bg-blue-700"/>
          <div className="absolute left-1/2 top-0 h-[18px] w-1/2 bg-red-600"/>
          <div 
            className="absolute top-1/2 w-7 h-7 bg-emerald-700 rounded-full border-4 border-white"
            style={{ 
              left: `${pricePosition}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 2px 12px rgba(4,120,87,0.4)',
            }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <div>
            <div className="text-gray-500 mb-0.5">52주 최저</div>
            <div className="font-semibold text-blue-700 text-sm">
              {naverData.low52w.toLocaleString('ko-KR')}원
            </div>
          </div>
          <div className="text-center">
            <div className={`inline-block text-xs px-3 py-1 rounded-full font-semibold text-white ${
              isHighPosition ? 'bg-emerald-700' : 'bg-blue-700'
            }`}>
              {positionLabel}
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 mb-0.5">52주 최고</div>
            <div className="font-semibold text-red-600 text-sm">
              {naverData.high52w.toLocaleString('ko-KR')}원
            </div>
          </div>
        </div>
      </div>

      <MobileAd />
      <PCBannerAd />

      {/* 6. 외국인/기관/개인 5일 매매 동향 */}
      {hasTradingData && (
        <div className="bg-white rounded-3xl p-5 mb-3.5 border border-emerald-700/10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🌐 5일 매매 동향</h3>
          
          {/* 5일 누적 요약 */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-[11px] text-gray-600 font-semibold mb-1">외국인</div>
              <div className={`text-base font-semibold ${
                tradingData.foreign5d > 0 ? 'text-red-600' : 
                tradingData.foreign5d < 0 ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {formatVolume(tradingData.foreign5d)}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-[11px] text-gray-600 font-semibold mb-1">기관</div>
              <div className={`text-base font-semibold ${
                tradingData.institution5d > 0 ? 'text-red-600' : 
                tradingData.institution5d < 0 ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {formatVolume(tradingData.institution5d)}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-[11px] text-gray-600 font-semibold mb-1">개인</div>
              <div className={`text-base font-semibold ${
                tradingData.individual5d > 0 ? 'text-red-600' : 
                tradingData.individual5d < 0 ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {formatVolume(tradingData.individual5d)}
              </div>
            </div>
          </div>

          {/* 외국인 연속 매수일 */}
          {tradingData.consecutiveBuyDays > 0 && (
            <div className="p-3 bg-red-50 rounded-xl mb-4 flex items-center gap-2">
              <span className="text-base">🔥</span>
              <span className="text-sm font-semibold text-red-700">
                외국인 {tradingData.consecutiveBuyDays}일 연속 매수
              </span>
            </div>
          )}

          {/* 일자별 막대 그래프 */}
          <div className="space-y-2">
            {tradingData.daily.map((day, idx) => {
              const maxAbs = Math.max(
                ...tradingData.daily.flatMap(d => [
                  Math.abs(d.foreign), 
                  Math.abs(d.institution), 
                  Math.abs(d.individual)
                ])
              );
              
              const foreignPct = maxAbs > 0 ? (Math.abs(day.foreign) / maxAbs) * 50 : 0;
              const instPct = maxAbs > 0 ? (Math.abs(day.institution) / maxAbs) * 50 : 0;
              const indvPct = maxAbs > 0 ? (Math.abs(day.individual) / maxAbs) * 50 : 0;
              
              return (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div className="w-12 text-gray-500 flex-shrink-0">
                    {day.date.replace(/-/g, '.').substring(5)}
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-1">
                    <div className="relative h-5 bg-gray-100 rounded">
                      <div 
                        className={`absolute top-0 h-5 ${day.foreign >= 0 ? 'bg-red-500 left-1/2' : 'bg-blue-700 right-1/2'}`}
                        style={{ width: `${foreignPct}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                        {formatVolume(day.foreign)}
                      </div>
                    </div>
                    <div className="relative h-5 bg-gray-100 rounded">
                      <div 
                        className={`absolute top-0 h-5 ${day.institution >= 0 ? 'bg-red-500 left-1/2' : 'bg-blue-700 right-1/2'}`}
                        style={{ width: `${instPct}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                        {formatVolume(day.institution)}
                      </div>
                    </div>
                    <div className="relative h-5 bg-gray-100 rounded">
                      <div 
                        className={`absolute top-0 h-5 ${day.individual >= 0 ? 'bg-red-500 left-1/2' : 'bg-blue-700 right-1/2'}`}
                        style={{ width: `${indvPct}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                        {formatVolume(day.individual)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="grid grid-cols-3 gap-1 pl-14 text-[10px] text-gray-500 font-semibold pt-1">
              <div className="text-center">외국인</div>
              <div className="text-center">기관</div>
              <div className="text-center">개인</div>
            </div>
          </div>
        </div>
      )}

      {/* 7. 외국인 보유율 */}
      <div className="bg-white rounded-3xl p-5 mb-3.5 border border-emerald-700/10">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">🌐 외국인 보유율</h3>
        <div className="p-5 bg-gradient-to-br from-emerald-700 to-emerald-600 rounded-2xl text-white">
          <div className="text-[13px] text-emerald-100 mb-1.5 font-semibold">현재 보유율</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold">
              {naverData.foreignOwnership > 0 ? naverData.foreignOwnership.toFixed(1) : '-'}
            </span>
            <span className="text-lg opacity-85">%</span>
          </div>
        </div>
      </div>

      {/* 8. 가치 평가 */}
      <div className="bg-white rounded-3xl p-5 mb-3.5 border border-emerald-700/10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💼 가치 평가</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-xs text-gray-600 font-semibold">PER</span>
              <span className="text-[10px] text-gray-500">주가/순이익</span>
            </div>
            <div className="text-[22px] font-semibold text-emerald-700">
              {naverData.per > 0 ? `${naverData.per.toFixed(1)}배` : '적자'}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-xs text-gray-600 font-semibold">PBR</span>
              <span className="text-[10px] text-gray-500">주가/순자산</span>
            </div>
            <div className="text-[22px] font-semibold text-emerald-700">
              {naverData.pbr > 0 ? `${naverData.pbr.toFixed(1)}배` : '-'}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-xs text-gray-600 font-semibold">EPS</span>
              <span className="text-[10px] text-gray-500">주당순이익</span>
            </div>
            <div className="text-[22px] font-semibold text-emerald-700">
              {naverData.eps !== 0 ? `${naverData.eps.toLocaleString('ko-KR')}` : '-'}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-xs text-gray-600 font-semibold">BPS</span>
              <span className="text-[10px] text-gray-500">주당순자산</span>
            </div>
            <div className="text-[22px] font-semibold text-emerald-700">
              {naverData.bps > 0 ? `${naverData.bps.toLocaleString('ko-KR')}` : '-'}
            </div>
          </div>
        </div>
      </div>

      <MobileAd />
      <PCBannerAd />

      {/* 9. 회사 정보 (DART) */}
      <div className="bg-white rounded-3xl p-5 mb-3.5 border border-emerald-700/10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏢 회사 정보</h3>
        <div className="flex gap-1.5 flex-wrap mb-4">
          {businessTags.map((tag) => (
            <span key={tag} className="text-[13px] px-3.5 py-1.5 bg-emerald-700 text-white rounded-full font-semibold">
              {tag}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-emerald-700/10">
          <div className="flex gap-2.5 items-center">
            <span className="text-xs text-gray-500 font-medium">대표</span>
            <span className="text-sm font-semibold text-gray-900">{dartData?.ceo || '-'}</span>
          </div>
          <div className="flex gap-2.5 items-center">
            <span className="text-xs text-gray-500 font-medium">본사</span>
            <span className="text-sm font-semibold text-gray-900">{dartData?.headquarters || '-'}</span>
          </div>
          <div className="flex gap-2.5 items-center">
            <span className="text-xs text-gray-500 font-medium">설립</span>
            <span className="text-sm font-semibold text-gray-900">{dartData?.ipoDate || '-'}</span>
          </div>
          <div className="flex gap-2.5 items-center">
            <span className="text-xs text-gray-500 font-medium">시장</span>
            <span className="text-sm font-semibold text-gray-900">{naverData.market}</span>
          </div>
        </div>
      </div>

      <MobileAd />

      {/* 10. 외부 링크 */}
      <div className="grid grid-cols-3 gap-2 mb-3.5">
        <a href={`https://finance.naver.com/item/main.naver?code=${params.stockCode}`} target="_blank" rel="noopener noreferrer"
          className="text-center p-4 bg-white rounded-2xl border border-emerald-700/10 hover:bg-emerald-50 transition-colors">
          <div className="text-[13px] font-semibold text-emerald-700">네이버</div>
        </a>
        <a href={`https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=${params.stockCode}`} target="_blank" rel="noopener noreferrer"
          className="text-center p-4 bg-white rounded-2xl border border-emerald-700/10 hover:bg-emerald-50 transition-colors">
          <div className="text-[13px] font-semibold text-emerald-700">DART</div>
        </a>
        <a href={`https://finance.naver.com/item/board.naver?code=${params.stockCode}`} target="_blank" rel="noopener noreferrer"
          className="text-center p-4 bg-white rounded-2xl border border-emerald-700/10 hover:bg-emerald-50 transition-colors">
          <div className="text-[13px] font-semibold text-emerald-700">토론방</div>
        </a>
      </div>

      <div className="text-[11px] text-gray-500 text-center py-3.5 leading-relaxed">
        본 정보는 참고용이며, 투자 자문이 아닙니다.<br/>
        모든 투자 판단과 결과는 본인 책임입니다.
      </div>
    </>
  );
}
