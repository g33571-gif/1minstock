/**
 * 종목 데이터 타입 정의
 * 모든 컴포넌트에서 import하여 사용
 */

// 종목 기본 정보
export interface StockBasic {
  code: string;          // 종목코드 (예: "005930")
  name: string;          // 종목명 (예: "삼성전자")
  market: 'KOSPI' | 'KOSDAQ' | 'KONEX';
  sector?: string;       // 업종 (예: "반도체")
  description?: string;  // 한 줄 소개
}

// 시세 정보
export interface StockPrice {
  current: number;       // 현재가
  change: number;        // 전일 대비 (원)
  changePercent: number; // 전일 대비 (%)
  volume: number;        // 거래량
  prevClose: number;     // 전일 종가
  open: number;          // 시가
  high: number;          // 고가
  low: number;           // 저가
  high52w: number;       // 52주 최고가
  low52w: number;        // 52주 최저가
  high20d: number;       // 20일 최고가
  low20d: number;        // 20일 최저가
}

// 위험 신호
export interface RiskSignal {
  hasRisk: boolean;
  risks: Array<{
    type: '관리종목' | '환기종목' | '거래정지' | '무상감자' | '연속적자' | '기타';
    label: string;
    description: string;
    effectiveDate?: string;
  }>;
}

// 시가총액 + 배당
export interface MarketCapData {
  marketCap: number;     // 시가총액 (억 단위)
  ranking?: number;      // 시장 순위
  rankingMarket?: 'KOSPI' | 'KOSDAQ';
  dividendYield?: number;  // 배당률 (%)
  dividendPerShare?: number;  // 주당 배당금 (원)
}

// 외국인 매매
export interface ForeignTradingData {
  foreignOwnership: number;     // 외국인 보유율 (%)
  foreignOwnershipChange: number; // 1주일 변화 (%p)
  limitUtilization?: number;    // 한도 소진율 (한도 종목만)
  trading5days: {
    foreign: number;            // 외국인 5일 누적 (억)
    institution: number;        // 기관 5일 누적 (억)
    individual: number;         // 개인 5일 누적 (억)
  };
  consecutiveBuyDays: number;   // 연속 순매수 일수
}

// 실적 (전년 대비)
export interface EarningsData {
  year: number;
  prevYear: number;
  revenue: { current: number; previous: number; changePercent: number };  // 매출 (조원)
  operatingProfit: { current: number; previous: number; changePercent: number };  // 영업이익
  netProfit: { current: number; previous: number; changePercent: number };  // 순이익
}

// 가치 평가
export interface ValuationData {
  per: { value: number; industryAvg: number };
  pbr: { value: number; industryAvg: number };
  roe: { value: number; industryAvg: number };
  psr: { value: number; industryAvg: number };
}

// 기술적 신호
export interface TechnicalSignals {
  rsi: { value: number; status: '과매수' | '중립' | '과매도' };
  trend: { direction: '상승' | '횡보' | '하락'; description: string };
  volume: { ratio: number; status: '활발' | '평균' | '저조' };
}

// 뉴스
export interface NewsItem {
  id: string;
  category: '실적' | '사업' | '공시' | '시장' | '기타';
  title: string;
  date: string;          // ISO 8601
  daysAgo: number;
  isImportant?: boolean;  // 중요 뉴스 강조
}

// 일정
export interface CalendarEvent {
  id: string;
  type: '실적발표' | '주총' | '배당락' | '무상감자' | '거래정지' | '거래재개' | '기타';
  title: string;
  date: string;          // ISO 8601
  daysUntil: number;
  isImportant?: boolean;  // 중요 일정 (가까운 일정)
  isWarning?: boolean;    // 경고 일정 (위험)
}

// 회사 정보
export interface CompanyInfo {
  ceo: string;
  headquarters: string;
  employees: number;
  ipoDate: string;
  businessTags: string[];  // ["반도체", "모바일", "가전"]
}

// 유사 종목
export interface SimilarStock {
  code: string;
  name: string;
  sector: string;
  marketCap: number;     // 억 단위
  marketCapDesc?: string;  // "시총 145조 · KOSPI 2위"
  price: number;
  changePercent: number;
}

// 종목 데이터 통합
export interface StockData {
  basic: StockBasic;
  price: StockPrice;
  risk: RiskSignal;
  marketCap: MarketCapData;
  foreignTrading: ForeignTradingData;
  earnings: EarningsData;
  valuation: ValuationData;
  technicalSignals: TechnicalSignals;
  news: NewsItem[];
  calendar: CalendarEvent[];
  company: CompanyInfo;
  similarStocks: SimilarStock[];
  updatedAt: string;
}
