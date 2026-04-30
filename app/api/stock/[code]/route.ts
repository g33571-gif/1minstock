import { NextRequest, NextResponse } from 'next/server';
import { fetchNaverStock, fetchRecentNews } from '@/lib/naverFinance';
import { fetchInvestorTrading } from '@/lib/investorTrading';
import { fetchAIBriefing, fetchCompanyOverview, fetchAINewsAnalysis } from '@/lib/aiSummary';
import { comparePer, comparePbr, getIndustryName, hasIndustryMapping } from '@/lib/data/industries';

export const dynamic = 'force-dynamic';
export const revalidate = 30;
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: '잘못된 종목코드' }, { status: 400 });
  }

  try {
    const naverData = await fetchNaverStock(code);
    if (!naverData) {
      return NextResponse.json({ error: '종목을 찾을 수 없어요' }, { status: 404 });
    }

    // 매매동향 + 최근 뉴스 병렬 (속도 ↑)
    const [tradingData, recentNews] = await Promise.all([
      fetchInvestorTrading(code, naverData.price),
      fetchRecentNews(code, 7), // 최대 7개 가져옴 (AI가 3개 선별)
    ]);

    const f5d   = tradingData?.foreign5d ?? 0;
    const i5d   = tradingData?.institution5d ?? 0;
    const p5d   = tradingData?.individual5d ?? 0;
    const fDays = tradingData?.consecutiveBuyDays ?? 0;
    const iDays = tradingData?.institutionConsecutiveBuyDays ?? 0;
    const fPct  = naverData.foreignOwnership > 0 ? naverData.foreignOwnership : 0;
    const iPct  = naverData.institutionOwnership > 0 ? naverData.institutionOwnership : 0;
    const pPct  = Math.max(0, 100 - fPct - iPct);

    const pricePos = naverData.high52w > naverData.low52w
      ? Math.max(0, Math.min(100,
          (naverData.price - naverData.low52w) / (naverData.high52w - naverData.low52w) * 100
        ))
      : 50;

    const cons = naverData.consensus;
    const totalCons = cons ? cons.buyCount + cons.neutralCount + cons.sellCount : 0;
    const buyPct = totalCons > 0 ? Math.round(cons!.buyCount / totalCons * 100) : 0;

    const industryName = hasIndustryMapping(code) ? getIndustryName(code) : '';

    // ⭐ AI 호출 3개 병렬 (브리핑 + 회사요약 + 뉴스분석)
    const [aiBriefing, companyOverview, aiNewsAnalysis] = await Promise.all([
      fetchAIBriefing({
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
      }),
      fetchCompanyOverview(code, naverData.name, industryName),
      fetchAINewsAnalysis(code, naverData.name, recentNews),
    ]);

    return NextResponse.json({
      code,
      name: naverData.name,
      market: naverData.market,
      industryName: industryName || null,
      companyOverview,
      price: naverData.price,
      change: naverData.change,
      changePercent: naverData.changePercent,
      openToday: naverData.openToday,
      highToday: naverData.highToday,
      lowToday: naverData.lowToday,
      marketCap: naverData.marketCap,
      volume: naverData.volume,
      volumeRatio: naverData.volumeRatioCalc,
      high52w: naverData.high52w,
      low52w: naverData.low52w,
      pricePos: Math.round(pricePos),
      per: naverData.per,
      pbr: naverData.pbr,
      dividendYield: naverData.dividendYield,
      foreignOwnership: fPct,
      institutionOwnership: iPct,
      individualOwnership: Math.round(pPct * 10) / 10,
      foreign5d: f5d,
      institution5d: i5d,
      individual5d: p5d,
      foreignConsecutiveDays: fDays,
      institutionConsecutiveDays: iDays,
      perCompare: comparePer(naverData.per, code),
      pbrCompare: comparePbr(naverData.pbr, code),
      aiBriefing,
      // ⭐ AI 뉴스 (기존 latestNews는 호환성 위해 유지)
      latestNews: naverData.latestNews,
      aiNewsAnalysis,
      riskSignal: naverData.riskSignal,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    console.error('[API/stock]', err);
    return NextResponse.json({ error: '데이터 조회 실패' }, { status: 500 });
  }
}
