import { NextResponse } from 'next/server';
import axios from 'axios';

// ⭐ 30초 캐시 - 비용 효율 + 데이터 신선도 균형
export const dynamic = 'force-dynamic';
export const revalidate = 30;
export const runtime = 'nodejs';

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

const headers = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
  'Origin': 'https://m.stock.naver.com',
  'Referer': 'https://m.stock.naver.com/',
};

/**
 * 네이버 금융 API에서 코스피/코스닥 지수 가져오기
 * - 실시간 데이터 (약 15~20분 지연)
 * - 30초 캐시
 */
async function fetchNaverIndex(code: string): Promise<{ value: number; change: number; changePercent: number } | null> {
  try {
    // 네이버 모바일 API의 지수 조회 엔드포인트
    // KOSPI = KOSPI, KOSDAQ = KOSDAQ
    const response = await axios.get(
      `https://m.stock.naver.com/api/index/${code}/basic`,
      { headers, timeout: 5000 }
    );

    const data = response.data;
    if (!data) return null;

    // 네이버 응답에서 지수 값과 변동률 추출
    // 응답 구조: { closePrice, compareToPreviousClosePrice, fluctuationsRatio, ... }
    const value = parseFloat(String(data.closePrice || '0').replace(/,/g, ''));
    let change = parseFloat(String(data.compareToPreviousClosePrice || '0').replace(/,/g, ''));
    let changePercent = parseFloat(data.fluctuationsRatio || '0');

    // 하락 신호 처리
    const trendName = data?.compareToPreviousPrice?.name || '';
    if (trendName === 'FALLING' && change > 0) change = -change;
    if (trendName === 'FALLING' && changePercent > 0) changePercent = -changePercent;

    if (value === 0) return null;

    return { value, change, changePercent };
  } catch (error) {
    console.error(`[MarketIndices] Error fetching ${code}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    // KOSPI와 KOSDAQ 동시 조회 (병렬)
    const [kospi, kosdaq] = await Promise.all([
      fetchNaverIndex('KOSPI'),
      fetchNaverIndex('KOSDAQ'),
    ]);

    const result: MarketIndex[] = [];

    if (kospi) {
      result.push({
        name: 'KOSPI',
        value: kospi.value,
        change: kospi.change,
        changePercent: kospi.changePercent,
      });
    }

    if (kosdaq) {
      result.push({
        name: 'KOSDAQ',
        value: kosdaq.value,
        change: kosdaq.change,
        changePercent: kosdaq.changePercent,
      });
    }

    // 둘 다 실패한 경우 빈 배열 반환 (가짜 데이터 안 보냄)
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('[MarketIndices] Critical error:', error);
    // 에러 시에도 가짜 데이터 안 보내고 빈 배열
    return NextResponse.json([], { status: 200 });
  }
}
