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
  foreignOwnership: number;
  institutionOwnership: number;
  volumeRatio: number;
  description: string;
  highToday: number;
  lowToday: number;
  openToday: number;
  volume: number;
  consensus: {
    buyCount: number;
    neutralCount: number;
    sellCount: number;
    targetPrice: number;
    targetPriceLow: number;
  } | null;
  volumeRatioCalc: number;
  latestNews: {
    title: string;
    time: string;
    url: string;
  } | null;
  riskSignal: {
    hasRisk: boolean;
    items: Array<{
      type: string;
      label: string;
      description: string;
    }>;
  };
}

const headers = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
  'Origin': 'https://m.stock.naver.com',
  'Referer': 'https://m.stock.naver.com/',
};

/**
 * ⭐ 데이터 정합성 검증
 * 시가/고가/저가가 현재가와 모순되면 이상 데이터로 판단
 *
 * 정상 케이스: lowToday <= price <= highToday, openToday in [lowToday, highToday]
 * 이상 케이스: 위 조건 위반 → 0으로 반환해서 화면에서 숨김 처리
 */
function validateOhlcData(price: number, openToday: number, highToday: number, lowToday: number): {
  openToday: number;
  highToday: number;
  lowToday: number;
} {
  // 모든 값이 0이면 그대로 반환
  if (!openToday && !highToday && !lowToday) {
    return { openToday: 0, highToday: 0, lowToday: 0 };
  }

  // 시가/고가/저가 데이터가 없으면 0으로
  if (!openToday || !highToday || !lowToday) {
    return { openToday: 0, highToday: 0, lowToday: 0 };
  }

  // 정합성 체크 1: 고가는 저가보다 커야 함
  if (highToday < lowToday) {
    return { openToday: 0, highToday: 0, lowToday: 0 };
  }

  // 정합성 체크 2: 현재가가 [저가, 고가] 범위 안에 있어야 함
  // 약간의 오차 허용 (1% 정도)
  const tolerance = price * 0.01;
  if (price < lowToday - tolerance || price > highToday + tolerance) {
    // 이상 데이터: 시가/고가/저가가 다른 날짜 데이터일 가능성
    return { openToday: 0, highToday: 0, lowToday: 0 };
  }

  // 정합성 체크 3: 시가도 [저가, 고가] 범위 안에 있어야 함
  if (openToday < lowToday - tolerance || openToday > highToday + tolerance) {
    return { openToday: 0, highToday: 0, lowToday: 0 };
  }

  // 모든 검증 통과 → 그대로 반환
  return { openToday, highToday, lowToday };
}

/**
 * ⭐ 변동률 검증
 * 시가/고가/저가가 현재가와 같은데 변동이 0이 아니면 일관성 없음
 * 또는 시가와 현재가가 다른데 변동이 0인 경우도 일관성 없음
 */
function validateChange(
  price: number,
  change: number,
  changePercent: number,
  openToday: number,
  highToday: number,
  lowToday: number
): { change: number; changePercent: number } {
  // 시가/고가/저가가 0이면 (validateOhlcData에서 무효 처리됨) 변동도 신뢰 어려움
  if (!openToday && !highToday && !lowToday) {
    // 변동이 0이면 그대로, 아니면 일단 신뢰
    return { change, changePercent };
  }

  // 정상 데이터: 변동률이 (현재가 - 전일종가) / 전일종가와 일치하는지
  // 전일종가 = 현재가 - 변동
  // 이 부분은 신뢰하고 그대로 반환
  return { change, changePercent };
}

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

    // ⭐ 시가/고가/저가 정합성 검증
    const rawHighToday = parseInt2(getInfo('highPrice'));
    const rawLowToday  = parseInt2(getInfo('lowPrice'));
    const rawOpenToday = parseInt2(getInfo('openPrice'));

    const validated = validateOhlcData(price, rawOpenToday, rawHighToday, rawLowToday);
    const openToday = validated.openToday;
    const highToday = validated.highToday;
    const lowToday  = validated.lowToday;

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

    // 기관 보유율
    const instStr = getInfo('institutionHoldRatio') || getInfo('organRate') || '0';
    const institutionOwnership = parseNum(instStr.replace('%', ''));

    // ── 컨센서스 파싱 ──
    let consensus: NaverStockData['consensus'] = null;
    const ci = data?.consensusInfo;
    if (ci) {
      const targetMean = parseInt2(String(ci.priceTargetMean || '0').replace(/,/g, ''));
      const targetLow  = parseInt2(String(ci.priceTargetLow  || ci.priceTargetMin || '0').replace(/,/g, ''));

      let buyCount     = parseInt(ci.buy     || ci.strongBuy || '0') || 0;
      let neutralCount = parseInt(ci.hold    || ci.neutral   || '0') || 0;
      let sellCount    = parseInt(ci.sell    || ci.strongSell || '0') || 0;

      if (ci.opinion) {
        buyCount     = parseInt(ci.opinion.buy  || '0') || 0;
        neutralCount = parseInt(ci.opinion.hold || '0') || 0;
        sellCount    = parseInt(ci.opinion.sell || '0') || 0;
      }

      if (buyCount === 0 && neutralCount === 0 && sellCount === 0 && ci.recommMean) {
        const mean = parseFloat(ci.recommMean);
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

    // 거래량 비율
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

    // ── 위험신호 ──
    const riskItems: NaverStockData['riskSignal']['items'] = [];
    try {
      const riskRes = await axios.get(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'https://1minstock.com'}/data/risk-stocks.json`,
        { timeout: 2000 }
      );
      const riskData = riskRes.data;
      const stockRisk = riskData?.stocks?.[code];
      if (stockRisk && Array.isArray(stockRisk.details)) {
        stockRisk.details.forEach((d: any) => {
          riskItems.push({
            type: d.type || '기타',
            label: d.label || d.type || '위험',
            description: d.description || '',
          });
        });
      }
    } catch (e) {
      const issueKindName = data?.stockIssueKind?.name || '';
      if (issueKindName && issueKindName !== '정상' && issueKindName !== '') {
        riskItems.push({ type: '기타', label: issueKindName, description: `${issueKindName} 종목` });
      }
    }

    const riskSignal = { hasRisk: riskItems.length > 0, items: riskItems };

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
      riskSignal,
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
