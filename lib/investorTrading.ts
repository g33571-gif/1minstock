// 외국인/기관/개인 매매 동향 - 빠른 응답
// 실패 시 빠르게 포기 (페이지 응답 우선)

import axios from 'axios';

interface InvestorTrading {
  foreign5d: number;
  institution5d: number;
  individual5d: number;
  consecutiveBuyDays: number;
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
  'Origin': 'https://m.stock.naver.com',
  'Referer': 'https://m.stock.naver.com/',
};

export async function fetchInvestorTrading(code: string): Promise<InvestorTrading | null> {
  try {
    if (!/^\d{6}$/.test(code)) return null;

    const response = await axios.get(
      `https://m.stock.naver.com/api/stock/${code}/trend`,
      {
        headers,
        timeout: 3000, // 3초 타임아웃 (빠르게)
      }
    );

    const data = response.data;
    if (!data || !Array.isArray(data) || data.length === 0) return null;

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
      
      if (!foundFirstSell) {
        if (foreign > 0) consecutiveBuyDays++;
        else foundFirstSell = true;
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
    // 실패 시 빠르게 null 반환 (페이지 응답 우선!)
    return null;
  }
}
