import { NextResponse } from 'next/server';

export async function GET() {
  // 실제 환경에서는 네이버 금융이나 KIS API에서 가져옴
  // 지금은 mock 데이터
  
  const mockData = [
    { 
      name: 'KOSPI', 
      value: 2587.42, 
      change: 20.31, 
      changePercent: 0.8 
    },
    { 
      name: 'KOSDAQ', 
      value: 742.18, 
      change: -2.15, 
      changePercent: -0.3 
    },
  ];
  
  return NextResponse.json(mockData, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
