import axios from 'axios';

export interface NaverStockData {
  code: string;
  name: string;
  market: string;
  price: number;
  change: number;
  changePercent: number;
  high52w: number;
  low52w: number;
  marketCap: string;
  per: number;
  pbr: number;
  eps: number;
  bps: number;
  dividendYield: number;
  foreignOwnership: number;   // 외국인 보유율 %
  institutionOwnership: number; // 기관 보유율 % (없으면 0)
  volumeRatio: number;
  description: string;
  highToday: number;
  lowToday: number;
  openToday: number;
  volume: number;
  // 컨센서스
  consensus: {
    buyCount: number;
    neutralCount: number;
    sellCount: number;
    targetPrice: number;
    targetPriceLow: number;
  } | null;
  // 거래량 비율 (평균 대비 %, 150 = 평균 대비 +50%)
  volumeRatioCalc: number;
  // 최신 뉴스 1건
  latestNews: {
    title: string;
    time: string;
    url: string;
  } | null;
}

const headers = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
  'Origin': 'https://m.stock.naver.com',
  'Referer': 'https://m.stock.naver.com/',
};

export async function fetchNaverStock(code: string): Promise<NaverStockData | null> {
  try {
    if (!/^\d{6}$/.test(code)) return null;

    const response = await axios.get(
      `https://m.stock.naver.com/api/stock/${code}/integration`,
      { headers, timeout: 5000 }
    );

    const data = response.data;
    const name = data?.stockName || '';
    if (!name) return null;

    const exchangeCode = data?.stockExchangeType?.code || '';
    const market = exchangeCode === 'KOSPI' ? 'KOSPI' :
                   exchangeCode === 'KOSDAQ' ? 'KOSDAQ' : 'KOSPI';

    const getInfo = (key: string): string => {
      const item = data?.totalInfos?.find((i: any) => i.code === key);
      return item?.value || '0';
    };

    const parseNum = (val: string): number =>
      parseFloat(String(val).replace(/,/g, '')) || 0;

    const parseInt2 = (val: string): number =>
      parseInt(String(val).replace(/,/g, '')) || 0;

    // 0원 버그 방지: closePrice가 0이면 다른 키로 fallback
    const rawClose = parseInt2(getInfo('closePrice'));
    const price = rawClose > 0
      ? rawClose
      : parseInt2(
          getInfo('lastClosePrice') ||
          getInfo('currentPrice') ||
          String(data?.dealTrendInfos?.[0]?.closePrice || '0')
        );

    let changePercent = parseFloat(data?.fluctuationsRatio || '0');
    let change = parseInt2(data?.compareToPreviousClosePrice || '0');
    const trendName = data?.compareToPreviousPrice?.name || '';
    if (trendName === 'FALLING' && change > 0) change = -change;
    if (trendName === 'FALLING' && changePercent > 0) changePercent = -changePercent;

    const high52w = parseInt2(getInfo('highPriceOf52Weeks'));
    const low52w  = parseInt2(getInfo('lowPriceOf52Weeks'));
    const highToday = parseInt2(getInfo('highPrice'));
    const lowToday  = parseInt2(getInfo('lowPrice'));
    const openToday = parseInt2(getInfo('openPrice'));

    const marketCap = formatMarketCap(getInfo('marketValue'));
    const per = parseNum(getInfo('per'));
    const pbr = parseNum(getInfo('pbr'));
    const eps = parseInt2(getInfo('eps'));
    const bps = parseInt2(getInfo('bps'));
    const dividendYield = parseNum(getInfo('dividendYieldRatio'));
    const volume = parseInt2(getInfo('accumulatedTradingVolume'));

    // 외국인 보유율
    const foreignStr = getInfo('foreignRate') || getInfo('foreignerHoldRatio') || getInfo('foreignerRate');
    const foreignOwnership = parseNum(foreignStr.replace('%', ''));

    // 기관 보유율 (institutionHoldRatio 또는 organRate)
    const instStr = getInfo('institutionHoldRatio') || getInfo('organRate') || '0';
    const institutionOwnership = parseNum(instStr.replace('%', ''));

    // ── 컨센서스 파싱 ──
    // 네이버 integration API의 consensusInfo 필드
    let consensus: NaverStockData['consensus'] = null;
    const ci = data?.consensusInfo;
    if (ci) {
      // recommMean: "4.20" (5=강력매수, 4=매수, 3=중립, 2=매도, 1=강력매도)
      // priceTargetMean: "293,200" (평균 목표가)
      // opinion: { buy, hold, sell } 또는 개별 필드
      const targetMean = parseInt2(String(ci.priceTargetMean || '0').replace(/,/g, ''));
      const targetLow  = parseInt2(String(ci.priceTargetLow  || ci.priceTargetMin || '0').replace(/,/g, ''));

      // 의견 수 - 네이버는 recommCount 또는 opinion 객체로 제공
      let buyCount     = parseInt(ci.buy     || ci.strongBuy || '0') || 0;
      let neutralCount = parseInt(ci.hold    || ci.neutral   || '0') || 0;
      let sellCount    = parseInt(ci.sell    || ci.strongSell || '0') || 0;

      // opinion 객체 형태인 경우
      if (ci.opinion) {
        buyCount     = parseInt(ci.opinion.buy  || '0') || 0;
        neutralCount = parseInt(ci.opinion.hold || '0') || 0;
        sellCount    = parseInt(ci.opinion.sell || '0') || 0;
      }

      // recommMean만 있고 개별 수가 없는 경우
      if (buyCount === 0 && neutralCount === 0 && sellCount === 0 && ci.recommMean) {
        const mean = parseFloat(ci.recommMean);
        // 5점 만점 기준으로 추정 (총 15개 애널리스트 가정)
        const total = parseInt(ci.recommCount || '15') || 15;
        if (mean >= 4.5) { buyCount = Math.round(total * 0.9); neutralCount = total - buyCount; }
        else if (mean >= 3.5) { buyCount = Math.round(total * 0.6); neutralCount = Math.round(total * 0.3); sellCount = total - buyCount - neutralCount; }
        else if (mean >= 2.5) { neutralCount = Math.round(total * 0.5); buyCount = Math.round(total * 0.25); sellCount = total - buyCount - neutralCount; }
        else { sellCount = Math.round(total * 0.6); neutralCount = Math.round(total * 0.3); buyCount = total - sellCount - neutralCount; }
      }

      if (targetMean > 0 || buyCount > 0) {
        consensus = { buyCount, neutralCount, sellCount, targetPrice: targetMean, targetPriceLow: targetLow };
      }
    }

    // integration API에 consensusInfo가 없는 경우 별도 API 시도
    if (!consensus) {
      try {
        const consRes = await axios.get(
          `https://m.stock.naver.com/api/stock/${code}/consensus`,
          { headers, timeout: 3000 }
        );
        const cd = consRes.data;
        if (cd) {
          const targetMean = parseInt2(String(cd.priceTargetMean || cd.targetPriceMean || '0').replace(/,/g, ''));
          const buyCount     = parseInt(cd.buy  || cd.strong_buy  || '0') || 0;
          const neutralCount = parseInt(cd.hold || cd.neutral     || '0') || 0;
          const sellCount    = parseInt(cd.sell || cd.strong_sell || '0') || 0;
          if (targetMean > 0 || buyCount > 0) {
            consensus = { buyCount, neutralCount, sellCount, targetPrice: targetMean, targetPriceLow: 0 };
          }
        }
      } catch {}
    }

    // 거래량 비율 (평균 대비)
    const avgVol = parseInt2(getInfo('averageVolume') || '0');
    const volumeRatioCalc = avgVol > 0 && volume > 0
      ? Math.round(volume / avgVol * 100)
      : 100;

    // 최신 뉴스 1건
    let latestNews: NaverStockData['latestNews'] = null;
    try {
      const newsRes = await axios.get(
        `https://m.stock.naver.com/api/stock/${code}/news?pageSize=1&page=1`,
        { headers, timeout: 3000 }
      );
      const items = newsRes.data?.result || newsRes.data || [];
      const first = Array.isArray(items) ? items[0] : null;
      if (first?.title) {
        latestNews = {
          title: first.title,
          time: first.wdate || first.date || '',
          url: first.url || `https://finance.naver.com/item/news.naver?code=${code}`,
        };
      }
    } catch {}

    return {
      code, name, market,
      price: price || 0,
      change, changePercent,
      high52w, low52w,
      marketCap,
      per, pbr, eps, bps,
      dividendYield,
      foreignOwnership,
      institutionOwnership,
      volumeRatio: 100,
      description: `${market} 상장 종목`,
      highToday, lowToday, openToday,
      volume,
      consensus,
      volumeRatioCalc,
      latestNews,
    };
  } catch (error) {
    console.error(`[NaverFinance] Error ${code}:`, error);
    return null;
  }
}

function formatMarketCap(str: string): string {
  if (!str || str === '0') return '-';
  const trillionMatch = str.match(/([\d,]+)조/);
  if (trillionMatch) {
    return `${parseInt(trillionMatch[1].replace(/,/g, '')).toLocaleString('ko-KR')}조`;
  }
  const billionMatch = str.match(/([\d,]+)억/);
  if (billionMatch) {
    const billion = parseInt(billionMatch[1].replace(/,/g, ''));
    if (billion >= 10000) return `${(billion / 10000).toFixed(1)}조`;
    return `${billion.toLocaleString('ko-KR')}억`;
  }
  return str;
}
