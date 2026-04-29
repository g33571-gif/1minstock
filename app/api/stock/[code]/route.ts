import { NextRequest, NextResponse } from 'next/server';
import { fetchNaverStock } from '@/lib/naverFinance';
import { fetchInvestorTrading } from '@/lib/investorTrading';
import { fetchAIBriefing } from '@/lib/aiSummary';

export const dynamic = 'force-dynamic';

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

    const tradingData = await fetchInvestorTrading(code, naverData.price);

    const f5d   = tradingData?.foreign5d ?? 0;
    const i5d   = tradingData?.institution5d ?? 0;
    const fDays = tradingData?.consecutiveBuyDays ?? 0;
    const iDays = tradingData?.institutionConsecutiveBuyDays ?? 0;
    const fPct  = naverData.foreignOwnership > 0 ? naverData.foreignOwnership : 0;

    const pricePos = naverData.high52w > naverData.low52w
      ? Math.max(0, Math.min(100,
          (naverData.price - naverData.low52w) / (naverData.high52w - naverData.low52w) * 100
        ))
      : 50;

    const cons = naverData.consensus;
    const totalCons = cons ? cons.buyCount + cons.neutralCount + cons.sellCount : 0;
    const buyPct = totalCons > 0 ? Math.round(cons!.buyCount / totalCons * 100) : 0;

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

    return NextResponse.json({
      code,
      name: naverData.name,
      market: naverData.market,
      price: naverData.price,
      change: naverData.change,
      changePercent: naverData.changePercent,
      openToday: naverData.openToday,
      highToday: naverData.highToday,
      lowToday: naverData.lowToday,
      marketCap: naverData.marketCap,
      volume: naverData.volume,
      high52w: naverData.high52w,
      low52w: naverData.low52w,
      pricePos: Math.round(pricePos),
      per: naverData.per,
      pbr: naverData.pbr,
      dividendYield: naverData.dividendYield,
      foreignOwnership: fPct,
      aiBriefing,
      latestNews: naverData.latestNews,
    });
  } catch (err) {
    console.error('[API/stock]', err);
    return NextResponse.json({ error: '데이터 조회 실패' }, { status: 500 });
  }
}
