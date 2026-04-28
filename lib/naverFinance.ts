// 네이버 금융 크롤링 (최종판)
// 정확한 키 매핑 - 모든 데이터 정확히 가져오기

import axios from 'axios';

interface NaverStockData {
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
  volumeRatio: number;
  description: string;
  highToday: number;
  lowToday: number;
  volume: number;
}

const headers = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
  'Origin': 'https://m.stock.naver.com',
  'Referer': 'https://m.stock.naver.com/',
};

/**
 * 네이버 금융 통합 정보 가져오기 (정확한 키 매핑)
 */
export async function fetchNaverStock(code: string): Promise<NaverStockData | null> {
  try {
    if (!/^\d{6}$/.test(code)) {
      return null;
    }

    // integration API에서 모든 정보 가져옴
    const response = await axios.get(
      `https://m.stock.naver.com/api/stock/${code}/integration`,
      {
        headers,
        timeout: 10000,
      }
    );

    const data = response.data;

    // 종목명
    const name = data?.stockName || '';
    if (!name) return null;

    // 시장 구분
    const exchangeCode = data?.stockExchangeType?.code || '';
    const market = exchangeCode === 'KOSPI' ? 'KOSPI' :
                   exchangeCode === 'KOSDAQ' ? 'KOSDAQ' : 'KOSPI';

    // totalInfos 배열에서 값 찾기 (헬퍼 함수)
    const getInfo = (code: string): string => {
      const item = data?.totalInfos?.find((i: any) => i.code === code);
      return item?.value || '0';
    };

    const parseNum = (val: string): number => {
      return parseFloat(String(val).replace(/,/g, '')) || 0;
    };

    const parseInt2 = (val: string): number => {
      return parseInt(String(val).replace(/,/g, '')) || 0;
    };

    // 가격 정보
    const price = parseInt2(getInfo('lastClosePrice') || getInfo('closePrice'));
    
    // 등락 (compareToPreviousClosePrice가 totalInfos에는 없을 수 있음, 메인 객체 확인)
    const lastClose = parseInt2(getInfo('lastClosePrice'));
    const close = parseInt2(getInfo('closePrice') || getInfo('lastClosePrice'));
    
    // 등락률 - integration data에 직접 있을 수 있음
    let changePercent = parseFloat(data?.fluctuationsRatio || '0');
    let change = parseInt2(data?.compareToPreviousClosePrice || '0');
    
    // 만약 fluctuationsRatio가 음수가 아니라 절대값이면 부호 판단 필요
    const trendName = data?.compareToPreviousPrice?.name || '';
    if (trendName === 'FALLING' && change > 0) change = -change;
    if (trendName === 'FALLING' && changePercent > 0) changePercent = -changePercent;

    // 52주 최고/최저
    const high52w = parseInt2(getInfo('highPriceOf52Weeks'));
    const low52w = parseInt2(getInfo('lowPriceOf52Weeks'));
    
    // 당일 고가/저가
    const highToday = parseInt2(getInfo('highPrice'));
    const lowToday = parseInt2(getInfo('lowPrice'));

    // 시가총액 (marketValue 형식: "1,297조 8,739억")
    const marketCapStr = getInfo('marketValue');
    const marketCap = formatMarketCapFromString(marketCapStr);

    // PER, PBR, EPS, BPS, 배당
    const per = parseNum(getInfo('per'));
    const pbr = parseNum(getInfo('pbr'));
    const eps = parseInt2(getInfo('eps'));
    const bps = parseInt2(getInfo('bps'));
    const dividendYield = parseNum(getInfo('dividendYieldRatio'));

    // 외국인 소진율 (foreignRate 또는 foreignerRate)
    const foreignOwnershipStr = getInfo('foreignRate') || getInfo('foreignerHoldRatio') || getInfo('foreignerRate');
    const foreignOwnership = parseNum(foreignOwnershipStr.replace('%', ''));
    
    // 거래량
    const volume = parseInt2(getInfo('accumulatedTradingVolume'));

    return {
      code,
      name,
      market,
      price: price || close,
      change,
      changePercent,
      high52w,
      low52w,
      marketCap,
      per,
      pbr,
      eps,
      bps,
      dividendYield,
      foreignOwnership,
      volumeRatio: 100,
      description: `${market} 상장 종목`,
      highToday,
      lowToday,
      volume,
    };
  } catch (error) {
    console.error(`[Naver Finance] Error fetching ${code}:`, error);
    return null;
  }
}

/**
 * 시가총액 문자열 처리
 * "1,297조 8,739억" → "1297조"
 * "53,000억" → "5조" 또는 "5.3조"
 * "428억" → "428억"
 */
function formatMarketCapFromString(str: string): string {
  if (!str || str === '0') return '0';
  
  // "1,297조 8,739억" 형식
  const trillionMatch = str.match(/([\d,]+)조/);
  if (trillionMatch) {
    const trillion = parseInt(trillionMatch[1].replace(/,/g, ''));
    return `${trillion.toLocaleString('ko-KR')}조`;
  }
  
  // "53,000억" 형식
  const billionMatch = str.match(/([\d,]+)억/);
  if (billionMatch) {
    const billion = parseInt(billionMatch[1].replace(/,/g, ''));
    if (billion >= 10000) {
      const trillion = (billion / 10000).toFixed(1);
      return `${trillion}조`;
    }
    return `${billion.toLocaleString('ko-KR')}억`;
  }
  
  return str;
}
