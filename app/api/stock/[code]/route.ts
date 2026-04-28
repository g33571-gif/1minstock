// 종목 정보 통합 API
// 네이버 금융 + DART → 통합 응답

import { NextRequest, NextResponse } from 'next/server';
import { fetchNaverStock } from '@/lib/naverFinance';
import { fetchDartCompany } from '@/lib/dart';

interface RouteParams {
  params: { code: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { code } = params;

  // 종목 코드 검증
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { error: 'Invalid stock code' },
      { status: 400 }
    );
  }

  try {
    // 네이버 금융 + DART 병렬 호출
    const [naverData, dartData] = await Promise.all([
      fetchNaverStock(code),
      fetchDartCompany(code),
    ]);

    if (!naverData) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      );
    }

    // 통합 응답
    const response = {
      code,
      name: naverData.name,
      market: naverData.market,
      description: naverData.description,
      
      // 가격 정보
      price: naverData.price,
      change: naverData.change,
      changePercent: naverData.changePercent,
      high52w: naverData.high52w,
      low52w: naverData.low52w,
      
      // 시가총액
      marketCap: naverData.marketCap,
      ranking: getRanking(naverData.market, naverData.marketCap),
      
      // 가치 평가
      per: naverData.per,
      pbr: naverData.pbr,
      eps: naverData.eps,
      bps: naverData.bps,
      psr: 0, // 추후 계산
      roe: 0, // 추후 계산
      
      // 배당
      dividendYield: naverData.dividendYield,
      dividendPerShare: 0, // 추후 계산
      
      // 외국인
      foreignOwnership: naverData.foreignOwnership,
      foreignOwnershipChange: 0,
      foreign5dValue: 0,
      inst5dValue: 0,
      indv5dValue: 0,
      consecutiveBuyDays: 0,
      
      // 회사 정보 (DART)
      ceo: dartData?.ceo || '-',
      headquarters: dartData?.headquarters || '-',
      employees: '-',
      ipoDate: dartData?.ipoDate || '-',
      industry: dartData?.industry || '-',
      
      // 비즈니스 태그 (자동 생성)
      businessTags: getBusinessTags(naverData.market, dartData?.industry),
      
      // 실적 (현재는 Mock, 추후 DART)
      revenue: { current: '-', prev: '-', change: 0 },
      operatingProfit: { current: '-', prev: '-', change: 0 },
      netProfit: { current: '-', prev: '-', change: 0 },
      
      // 기술적 지표
      rsi: 50, // 추후 계산
      volumeRatio: naverData.volumeRatio,
      
      // 위험 신호 (추후 KRX 연동)
      hasRisk: false,
      risks: [],
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('[API /api/stock/[code]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}

/**
 * 시가총액 기반 순위 추정
 */
function getRanking(market: string, marketCap: string): string {
  if (marketCap.includes('조')) {
    const trillion = parseFloat(marketCap);
    if (trillion >= 100) return `${market} 대형주`;
    if (trillion >= 10) return `${market} 중형주`;
    return `${market} 중소형주`;
  }
  return '소형주';
}

/**
 * 업종 코드 → 비즈니스 태그
 */
function getBusinessTags(market: string, industry?: string): string[] {
  const tags: string[] = [market];
  
  if (industry) {
    // 업종 코드는 5자리 (예: 26410 = 반도체 제조업)
    const industryMap: Record<string, string> = {
      '264': '반도체',
      '263': '전자부품',
      '321': '의료기기',
      '262': '컴퓨터',
      '581': '소프트웨어',
      '582': '게임',
      '105': '식품',
      '106': '음료',
      '139': '의류',
      '241': '화학',
      '107': '제약',
    };
    
    const prefix = industry.substring(0, 3);
    if (industryMap[prefix]) {
      tags.push(industryMap[prefix]);
    }
  }
  
  return tags;
}
