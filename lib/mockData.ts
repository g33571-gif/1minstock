/**
 * Mock 데이터 - 실제 크롤링 전 디자인 확인용
 * 향후 lib/crawlers/ 폴더의 실제 크롤러로 교체 예정
 */

import { StockData } from './types';

// 삼성전자 (정상 종목 예시)
const samsungData: StockData = {
  basic: {
    code: '005930',
    name: '삼성전자',
    market: 'KOSPI',
    sector: '반도체',
    description: '글로벌 종합 전자기업',
  },
  price: {
    current: 72400,
    change: -880,
    changePercent: -1.2,
    volume: 18723594,
    prevClose: 73280,
    open: 73000,
    high: 73500,
    low: 72100,
    high52w: 88800,
    low52w: 51800,
    high20d: 75200,
    low20d: 70100,
  },
  risk: {
    hasRisk: false,
    risks: [],
  },
  marketCap: {
    marketCap: 4320000,  // 432조 원 (억 단위)
    ranking: 1,
    rankingMarket: 'KOSPI',
    dividendYield: 2.0,
    dividendPerShare: 1440,
  },
  foreignTrading: {
    foreignOwnership: 52.8,
    foreignOwnershipChange: 0.3,
    trading5days: {
      foreign: 124000000000,    // +1,240억
      institution: -42000000000, // -420억
      individual: -82000000000,  // -820억
    },
    consecutiveBuyDays: 5,
  },
  earnings: {
    year: 2024,
    prevYear: 2023,
    revenue: { current: 300, previous: 254, changePercent: 18 },
    operatingProfit: { current: 32.7, previous: 6.6, changePercent: 398 },
    netProfit: { current: 25.4, previous: 11.5, changePercent: 121 },
  },
  valuation: {
    per: { value: 14.2, industryAvg: 18 },
    pbr: { value: 1.3, industryAvg: 2.1 },
    roe: { value: 9.8, industryAvg: 7.2 },
    psr: { value: 1.4, industryAvg: 1.9 },
  },
  technicalSignals: {
    rsi: { value: 58, status: '중립' },
    trend: { direction: '상승', description: '최근 3개월 우상향 흐름' },
    volume: { ratio: 138, status: '활발' },
  },
  news: [
    {
      id: 'n1',
      category: '실적',
      title: '3분기 영업이익 9.2조원, 시장 컨센서스 상회',
      date: '2026-04-24',
      daysAgo: 3,
      isImportant: true,
    },
    {
      id: 'n2',
      category: '사업',
      title: 'HBM3E 12단 양산 본격화, 엔비디아 공급 확대',
      date: '2026-04-21',
      daysAgo: 6,
    },
    {
      id: 'n3',
      category: '공시',
      title: '파운드리 2nm 공정 시제품 생산 시작 공시',
      date: '2026-04-17',
      daysAgo: 10,
    },
  ],
  calendar: [
    {
      id: 'c1',
      type: '실적발표',
      title: '1분기 실적발표',
      date: '2026-05-09',
      daysUntil: 12,
      isImportant: true,
    },
    {
      id: 'c2',
      type: '주총',
      title: '정기주주총회',
      date: '2026-05-19',
      daysUntil: 22,
    },
  ],
  company: {
    ceo: '한종희',
    headquarters: '경기 수원',
    employees: 270000,
    ipoDate: '1975-06-11',
    businessTags: ['반도체', '모바일', '가전', '디스플레이'],
  },
  similarStocks: [
    {
      code: '000660',
      name: 'SK하이닉스',
      sector: '반도체',
      marketCap: 1450000,
      marketCapDesc: '시총 145조 · KOSPI 2위',
      price: 198500,
      changePercent: 2.3,
    },
    {
      code: '000990',
      name: 'DB하이텍',
      sector: '반도체',
      marketCap: 24000,
      marketCapDesc: '시총 2.4조 · 시스템반도체',
      price: 52800,
      changePercent: -0.8,
    },
    {
      code: '042700',
      name: '한미반도체',
      sector: '반도체',
      marketCap: 98000,
      marketCapDesc: '시총 9.8조 · 반도체 장비',
      price: 98600,
      changePercent: 1.5,
    },
  ],
  updatedAt: new Date().toISOString(),
};

// 이렘 (위험 종목 예시)
const iremData: StockData = {
  basic: {
    code: '058530',
    name: '이렘',
    market: 'KOSDAQ',
    sector: '디스플레이 부품',
    description: '디스플레이 부품 제조',
  },
  price: {
    current: 1847,
    change: -93,
    changePercent: -4.8,
    volume: 245000,
    prevClose: 1940,
    open: 1900,
    high: 1920,
    low: 1820,
    high52w: 5840,
    low52w: 1720,
    high20d: 2150,
    low20d: 1820,
  },
  risk: {
    hasRisk: true,
    risks: [
      {
        type: '환기종목',
        label: '환기종목',
        description: '관리종목 지정 우려가 있어 투자자 주의를 요하는 종목으로 지정됨',
      },
      {
        type: '무상감자',
        label: '무상감자',
        description: '2025.05.05 무상감자 결정 (10:1 비율) — 감자 후 거래정지 예정',
        effectiveDate: '2025-05-05',
      },
      {
        type: '연속적자',
        label: '3년 적자',
        description: '2022~2024년 3년 연속 영업손실 발생 (관리종목 지정 요건 근접)',
      },
    ],
  },
  marketCap: {
    marketCap: 4280,  // 428억
    dividendYield: 0,
  },
  foreignTrading: {
    foreignOwnership: 0.8,
    foreignOwnershipChange: -0.1,
    trading5days: {
      foreign: -5800000000,
      institution: -1200000000,
      individual: 7000000000,
    },
    consecutiveBuyDays: -3,
  },
  earnings: {
    year: 2024,
    prevYear: 2023,
    revenue: { current: 218, previous: 312, changePercent: -30 },
    operatingProfit: { current: -78, previous: -32, changePercent: -145 },
    netProfit: { current: -92, previous: -45, changePercent: -104 },
  },
  valuation: {
    per: { value: 0, industryAvg: 18 },
    pbr: { value: 0.9, industryAvg: 2.1 },
    roe: { value: -45.2, industryAvg: 7.2 },
    psr: { value: 0.8, industryAvg: 1.9 },
  },
  technicalSignals: {
    rsi: { value: 28, status: '과매도' },
    trend: { direction: '하락', description: '최근 6개월 하락 추세' },
    volume: { ratio: 245, status: '활발' },
  },
  news: [
    {
      id: 'irem-n1',
      category: '공시',
      title: '10대 1 무상감자 결정, 자본잠식 해소 목적',
      date: '2026-04-25',
      daysAgo: 2,
      isImportant: true,
    },
    {
      id: 'irem-n2',
      category: '실적',
      title: '3분기 영업손실 24억원, 전년 대비 적자 확대',
      date: '2026-04-22',
      daysAgo: 5,
      isImportant: true,
    },
    {
      id: 'irem-n3',
      category: '공시',
      title: '환기종목 지정 (관리종목 지정 우려)',
      date: '2026-04-15',
      daysAgo: 12,
    },
  ],
  calendar: [
    {
      id: 'irem-c1',
      type: '무상감자',
      title: '무상감자 효력 발생',
      date: '2026-05-05',
      daysUntil: 8,
      isWarning: true,
    },
    {
      id: 'irem-c2',
      type: '거래재개',
      title: '감자 후 거래재개 (예정)',
      date: '2026-05-15',
      daysUntil: 18,
    },
  ],
  company: {
    ceo: '김OO',
    headquarters: '충남 천안',
    employees: 82,
    ipoDate: '2003-07-01',
    businessTags: ['디스플레이', '부품'],
  },
  similarStocks: [],
  updatedAt: new Date().toISOString(),
};

const mockData: Record<string, StockData> = {
  '005930': samsungData,
  '058530': iremData,
};

export async function getMockStockData(code: string): Promise<StockData | null> {
  // 실제 환경에서는 API 호출 시뮬레이션
  return mockData[code] || null;
}

export async function searchMockStocks(query: string) {
  // 간단한 검색 시뮬레이션
  const allStocks = [
    { code: '005930', name: '삼성전자', sector: 'KOSPI', marketCap: 432, price: 72400, changePercent: -1.2 },
    { code: '207940', name: '삼성바이오로직스', sector: 'KOSPI', marketCap: 64, price: 932000, changePercent: 2.1 },
    { code: '006400', name: '삼성SDI', sector: 'KOSPI', marketCap: 28, price: 408000, changePercent: -0.5 },
    { code: '028260', name: '삼성물산', sector: 'KOSPI', marketCap: 24, price: 128500, changePercent: 0.8 },
    { code: '000810', name: '삼성화재', sector: 'KOSPI', marketCap: 16, price: 348000, changePercent: 1.4 },
    { code: '009150', name: '삼성전기', sector: 'KOSPI', marketCap: 11, price: 152800, changePercent: -0.3 },
    { code: '000660', name: 'SK하이닉스', sector: 'KOSPI', marketCap: 145, price: 198500, changePercent: 2.3 },
    { code: '058530', name: '이렘', sector: 'KOSDAQ', marketCap: 0.04, price: 1847, changePercent: -4.8 },
  ];
  
  if (!query) return [];
  
  return allStocks.filter(
    s => s.name.includes(query) || s.code.includes(query)
  );
}
