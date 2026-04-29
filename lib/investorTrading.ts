import axios from 'axios';

export interface InvestorTrading {
  foreign5d: number;       // 외국인 5일 순매수 금액 (원)
  institution5d: number;   // 기관 5일 순매수 금액 (원)
  individual5d: number;    // 개인 5일 순매수 금액 (원)
  consecutiveBuyDays: number;
  institutionConsecutiveBuyDays: number;
  daily: Array<{
    date: string;
    foreign: number;       // 당일 순매수 금액 (원)
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

export async function fetchInvestorTrading(
  code: string,
  currentPrice: number = 0
): Promise<InvestorTrading | null> {
  try {
    if (!/^\d{6}$/.test(code)) return null;

    const response = await axios.get(
      `https://m.stock.naver.com/api/stock/${code}/trend`,
      { headers, timeout: 3000 }
    );

    const data = response.data;
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    const recent5 = data.slice(0, 5);

    let foreign5d = 0;
    let institution5d = 0;
    let individual5d = 0;
    let consecutiveBuyDays = 0;
    let institutionConsecutiveBuyDays = 0;
    let foreignSellFound = false;
    let instSellFound = false;

    const daily = recent5.map((d: any) => {
      // 네이버 trend API:
      // foreignerVolume = 주 수 (부호 있음: 양수=매수, 음수=매도)
      // foreignerAmount = 금액 (원) - 있으면 사용, 없으면 주수×가격
      // organVolume, organAmount
      // individualVolume, individualAmount

      const parseAmt = (amtStr: string, volStr: string): number => {
        const amt = parseInt(String(amtStr || '0').replace(/,/g, ''));
        if (amt !== 0) return amt;
        // 금액 없으면 주수 × 현재가로 추정
        const vol = parseInt(String(volStr || '0').replace(/,/g, ''));
        return currentPrice > 0 ? vol * currentPrice : vol;
      };

      const foreign     = parseAmt(d.foreignerAmount, d.foreignerVolume);
      const institution = parseAmt(d.organAmount,     d.organVolume);
      const individual  = parseAmt(d.individualAmount, d.individualVolume);

      foreign5d     += foreign;
      institution5d += institution;
      individual5d  += individual;

      // 외국인 연속 매수일
      if (!foreignSellFound) {
        if (foreign > 0) consecutiveBuyDays++;
        else if (foreign < 0) foreignSellFound = true;
      }

      // 기관 연속 매수일
      if (!instSellFound) {
        if (institution > 0) institutionConsecutiveBuyDays++;
        else if (institution < 0) instSellFound = true;
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
      institutionConsecutiveBuyDays,
      daily,
    };
  } catch {
    return null;
  }
}
