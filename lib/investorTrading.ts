// 외국인/기관/개인 5일 매매 동향
// 네이버 금융 API 사용

import axios from 'axios';

interface InvestorTrading {
  foreign5d: number;        // 외국인 5일 누적 (음수=매도)
  institution5d: number;    // 기관 5일 누적
  individual5d: number;     // 개인 5일 누적
  consecutiveBuyDays: number; // 외국인 연속 매수일
  daily: Array<{
    date: string;
    foreign: number;
    institution: number;
    individual: number;
  }>;
}

const headers = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9',
  'Origin': 'https://m.stock.naver.com',
  'Referer': 'https://m.stock.naver.com/',
};

/**
 * 외국인/기관/개인 매매 동향 가져오기
 */
export async function fetchInvestorTrading(code: string): Promise<InvestorTrading | null> {
  try {
    if (!/^\d{6}$/.test(code)) return null;

    // 네이버 금융 외국인/기관 매매 API
    const response = await axios.get(
      `https://m.stock.naver.com/api/stock/${code}/trend`,
      {
        headers,
        timeout: 10000,
      }
    );

    const data = response.data;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }

    // 최근 5일 데이터
    const recent5Days = data.slice(0, 5);
    
    let foreign5d = 0;
    let institution5d = 0;
    let individual5d = 0;
    let consecutiveBuyDays = 0;
    let foundFirstSell = false;

    const daily = recent5Days.map((d: any) => {
      const foreign = parseInt(String(d.foreignerVolume || '0').replace(/,/g, '')) || 0;
      const institution = parseInt(String(d.organVolume || '0').replace(/,/g, '')) || 0;
      const individual = parseInt(String(d.individualVolume || '0').replace(/,/g, '')) || 0;
      
      foreign5d += foreign;
      institution5d += institution;
      individual5d += individual;
      
      // 외국인 연속 매수일 (최근부터)
      if (!foundFirstSell) {
        if (foreign > 0) {
          consecutiveBuyDays++;
        } else {
          foundFirstSell = true;
        }
      }
      
      return {
        date: d.localDate || '',
        foreign,
        institution,
        individual,
      };
    });

    return {
      foreign5d,
      institution5d,
      individual5d,
      consecutiveBuyDays,
      daily,
    };
  } catch (error) {
    console.error(`[Investor Trading] Error for ${code}:`, error);
    return null;
  }
}
