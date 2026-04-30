// lib/data/industries.ts
// 업종 매핑 + 업종별 평균 PER/PBR
// 2026-04-30 업데이트: KOSPI/KOSDAQ 핵심 종목 약 200개 매핑

export interface IndustryInfo {
  name: string;
  avgPER: number;
  avgPBR: number;
}

export interface ValuationCompare {
  industryName: string;
  myValue: number;
  industryAvg: number;
  diffPercent: number;
  label: '저평가' | '적정' | '고평가';
  color: 'blue' | 'gray' | 'red';
}

// 업종별 평균 PER/PBR (2026년 1분기 기준 추정치)
export const INDUSTRY_AVERAGES: Record<string, IndustryInfo> = {
  반도체: { name: '반도체', avgPER: 18.5, avgPBR: 2.1 },
  자동차: { name: '자동차', avgPER: 8.2, avgPBR: 0.9 },
  자동차부품: { name: '자동차부품', avgPER: 9.5, avgPBR: 1.0 },
  IT서비스: { name: 'IT서비스', avgPER: 22.0, avgPBR: 2.8 },
  플랫폼: { name: '플랫폼/인터넷', avgPER: 28.0, avgPBR: 3.2 },
  게임: { name: '게임', avgPER: 18.0, avgPBR: 2.5 },
  엔터테인먼트: { name: '엔터테인먼트', avgPER: 25.0, avgPBR: 3.5 },
  금융지주: { name: '금융지주', avgPER: 5.5, avgPBR: 0.5 },
  은행: { name: '은행', avgPER: 5.0, avgPBR: 0.45 },
  증권: { name: '증권', avgPER: 6.5, avgPBR: 0.6 },
  보험: { name: '보험', avgPER: 6.0, avgPBR: 0.55 },
  화학: { name: '화학', avgPER: 12.0, avgPBR: 1.1 },
  정유: { name: '정유', avgPER: 7.5, avgPBR: 0.8 },
  철강: { name: '철강', avgPER: 8.0, avgPBR: 0.7 },
  조선: { name: '조선', avgPER: 14.0, avgPBR: 1.8 },
  건설: { name: '건설', avgPER: 8.5, avgPBR: 0.7 },
  유통: { name: '유통', avgPER: 12.0, avgPBR: 1.2 },
  생활가전: { name: '생활가전/렌탈', avgPER: 13.0, avgPBR: 1.5 },
  음식료: { name: '음식료', avgPER: 14.0, avgPBR: 1.3 },
  화장품: { name: '화장품', avgPER: 20.0, avgPBR: 2.5 },
  제약바이오: { name: '제약/바이오', avgPER: 35.0, avgPBR: 3.8 },
  의료기기: { name: '의료기기', avgPER: 25.0, avgPBR: 3.0 },
  통신: { name: '통신', avgPER: 8.0, avgPBR: 0.7 },
  미디어: { name: '미디어/콘텐츠', avgPER: 18.0, avgPBR: 2.0 },
  전기장비: { name: '전기장비', avgPER: 16.0, avgPBR: 1.8 },
  기계: { name: '기계', avgPER: 12.0, avgPBR: 1.1 },
  방산: { name: '방산', avgPER: 15.0, avgPBR: 2.0 },
  운송: { name: '운송', avgPER: 9.0, avgPBR: 0.8 },
  항공: { name: '항공', avgPER: 8.0, avgPBR: 1.0 },
  지주사: { name: '지주사', avgPER: 7.0, avgPBR: 0.6 },
  섬유의류: { name: '섬유/의류', avgPER: 11.0, avgPBR: 1.0 },
  종이목재: { name: '종이/목재', avgPER: 10.0, avgPBR: 0.9 },
  비금속: { name: '비금속광물', avgPER: 11.0, avgPBR: 1.0 },
  전력가스: { name: '전력/가스', avgPER: 7.5, avgPBR: 0.5 },
  광고: { name: '광고', avgPER: 14.0, avgPBR: 1.5 },
  교육: { name: '교육', avgPER: 13.0, avgPBR: 1.4 },
  여행: { name: '여행/레저', avgPER: 16.0, avgPBR: 1.8 },
  소프트웨어: { name: '소프트웨어', avgPER: 25.0, avgPBR: 3.5 },
  반도체장비: { name: '반도체장비/소재', avgPER: 16.0, avgPBR: 2.0 },
  디스플레이: { name: '디스플레이', avgPER: 14.0, avgPBR: 1.3 },
  이차전지: { name: '이차전지', avgPER: 22.0, avgPBR: 2.8 },
  로봇: { name: '로봇/자동화', avgPER: 30.0, avgPBR: 3.5 },
  기타: { name: '기타', avgPER: 15.0, avgPBR: 1.5 },
};

// 종목 코드 → 업종 매핑 (KOSPI/KOSDAQ 핵심 200개+)
export const STOCK_INDUSTRY_MAP: Record<string, string> = {
  // 반도체
  '005930': '반도체', '000660': '반도체',
  '042700': '반도체장비', '240810': '반도체장비', '095340': '반도체장비',
  '058470': '반도체장비', '036930': '반도체장비', '140860': '반도체장비',
  '403870': '반도체장비', '278320': '반도체장비', '357780': '반도체장비',
  '086390': '반도체장비', '166090': '반도체장비',

  // 자동차
  '005380': '자동차', '000270': '자동차',
  '012330': '자동차부품', '204320': '자동차부품', '011210': '자동차부품',
  '018880': '자동차부품', '298050': '자동차부품',

  // 이차전지
  '373220': '이차전지', '006400': '이차전지', '247540': '이차전지',
  '086520': '이차전지', '066970': '이차전지', '096770': '이차전지',
  '121600': '이차전지', '112610': '이차전지', '041460': '이차전지',
  '457190': '이차전지',

  // 플랫폼
  '035420': '플랫폼', '035720': '플랫폼', '323410': '플랫폼', '377300': '플랫폼',

  // 게임
  '036570': '게임', '251270': '게임', '263750': '게임', '293490': '게임',
  '112040': '게임', '194480': '게임', '192080': '게임', '078340': '게임',
  '095660': '게임', '225570': '게임',

  // 엔터테인먼트
  '352820': '엔터테인먼트', '041510': '엔터테인먼트',
  '035900': '엔터테인먼트', '122870': '엔터테인먼트',

  // 금융지주
  '105560': '금융지주', '055550': '금융지주', '086790': '금융지주',
  '316140': '금융지주', '138930': '금융지주', '175330': '금융지주',
  '139130': '금융지주',
  '024110': '은행',

  // 증권/보험
  '006800': '증권', '016360': '증권', '071050': '증권', '039490': '증권',
  '005830': '보험', '000810': '보험', '032830': '보험',
  '088350': '보험', '082640': '보험',

  // 화학/정유
  '051910': '화학', '009830': '화학', '011170': '화학',
  '298020': '화학', '298000': '화학',
  '010950': '정유',
  '004020': '철강',

  // 철강
  '005490': '철강', '003670': '철강', '002380': '철강', '058430': '철강',

  // 조선
  '329180': '조선', '010620': '조선', '042660': '조선',
  '267250': '조선', '010140': '조선',

  // 건설
  '000720': '건설', '047040': '건설', '375500': '건설',
  '028050': '건설', '006360': '건설', '294870': '건설',

  // 유통
  '139480': '유통', '069960': '유통', '023530': '유통',
  '057050': '유통', '031430': '유통', '004170': '유통',
  '008770': '유통',

  // 생활가전/렌탈 ⭐ 코웨이 포함
  '021240': '생활가전', '284740': '생활가전', '192400': '생활가전',
  '111110': '생활가전', '066570': '생활가전',

  // 음식료
  '097950': '음식료', '271560': '음식료', '004370': '음식료',
  '005440': '음식료', '002270': '음식료', '280360': '음식료',
  '136490': '음식료', '007310': '음식료', '049770': '음식료',

  // 화장품
  '090430': '화장품', '051900': '화장품', '002790': '화장품',
  '214450': '화장품', '192820': '화장품', '161890': '화장품',
  '086900': '화장품',

  // 제약/바이오
  '207940': '제약바이오', '068270': '제약바이오', '326030': '제약바이오',
  '302440': '제약바이오', '196170': '제약바이오', '028300': '제약바이오',
  '000100': '제약바이오', '069620': '제약바이오', '128940': '제약바이오',
  '009420': '제약바이오', '185750': '제약바이오', '006280': '제약바이오',
  '298380': '제약바이오', '048410': '제약바이오', '145020': '제약바이오',
  '237690': '제약바이오',

  // 의료기기
  '041830': '의료기기', '048260': '의료기기', '085370': '의료기기',
  '099190': '의료기기', '108860': '의료기기',

  // 통신
  '017670': '통신', '030200': '통신', '032640': '통신',

  // 미디어
  '253450': '미디어', '079160': '미디어', '035760': '미디어',
  '034120': '미디어', '067160': '미디어',

  // 방산
  '012450': '방산', '047810': '방산', '064350': '방산',
  '079550': '방산', '272210': '방산',

  // 기계
  '267260': '기계', '042670': '기계', '267270': '기계',

  // 전기장비
  '009150': '전기장비', '108320': '전기장비', '099320': '전기장비',
  '067390': '전기장비', '009540': '전기장비',

  // 항공
  '180640': '항공', '003490': '항공', '020560': '항공',
  '298690': '항공', '272450': '항공',

  // 운송
  '086280': '운송', '000120': '운송', '028670': '운송',
  '011200': '운송', '004140': '운송',

  // 지주사
  '003550': '지주사', '001040': '지주사', '078930': '지주사',
  '000080': '지주사', '047050': '지주사', '000990': '지주사',

  // 전력/가스
  '015760': '전력가스', '036460': '전력가스', '071320': '전력가스',

  // 디스플레이
  '034220': '디스플레이', '008060': '디스플레이',

  // 소프트웨어
  '060280': '소프트웨어', '131290': '소프트웨어', '060250': '소프트웨어',
  '053800': '소프트웨어', '047820': '소프트웨어',

  // 섬유/의류
  '111770': '섬유의류', '081660': '섬유의류', '108670': '섬유의류',
};

/**
 * 종목 코드로 업종 정보 조회
 */
export function getIndustryInfo(stockCode: string): IndustryInfo {
  const industryKey = STOCK_INDUSTRY_MAP[stockCode] || '기타';
  return INDUSTRY_AVERAGES[industryKey] || INDUSTRY_AVERAGES['기타'];
}

/**
 * 종목 코드로 업종명 조회
 */
export function getIndustryName(stockCode: string): string {
  const info = getIndustryInfo(stockCode);
  return info.name;
}

/**
 * 업종 매핑 존재 여부
 */
export function hasIndustryMapping(stockCode: string): boolean {
  return stockCode in STOCK_INDUSTRY_MAP;
}

// ⭐ 기존 route.ts에서 쓰는 비교 함수들 (반드시 유지)

/**
 * PER 비교 - 업종 평균 대비 저평가/적정/고평가 판단
 */
export function comparePer(per: number, stockCode: string): ValuationCompare | null {
  if (per <= 0) return null;
  // 매핑이 없으면 비교 자체를 안 함 (기존엔 "기타 평균 15.0배" 표시했으나 사용자 혼란 유발)
  if (!hasIndustryMapping(stockCode)) return null;

  const info = getIndustryInfo(stockCode);
  if (info.avgPER <= 0) return null;

  const diffPercent = Math.round(((per - info.avgPER) / info.avgPER) * 100);

  let label: '저평가' | '적정' | '고평가';
  let color: 'blue' | 'gray' | 'red';

  if (diffPercent < -15) {
    label = '저평가';
    color = 'blue';
  } else if (diffPercent > 30) {
    label = '고평가';
    color = 'red';
  } else {
    label = '적정';
    color = 'gray';
  }

  return {
    industryName: info.name,
    myValue: per,
    industryAvg: info.avgPER,
    diffPercent,
    label,
    color,
  };
}

/**
 * PBR 비교 - 업종 평균 대비 저평가/적정/고평가 판단
 */
export function comparePbr(pbr: number, stockCode: string): ValuationCompare | null {
  if (pbr <= 0) return null;
  if (!hasIndustryMapping(stockCode)) return null;

  const info = getIndustryInfo(stockCode);
  if (info.avgPBR <= 0) return null;

  const diffPercent = Math.round(((pbr - info.avgPBR) / info.avgPBR) * 100);

  let label: '저평가' | '적정' | '고평가';
  let color: 'blue' | 'gray' | 'red';

  if (diffPercent < -15) {
    label = '저평가';
    color = 'blue';
  } else if (diffPercent > 30) {
    label = '고평가';
    color = 'red';
  } else {
    label = '적정';
    color = 'gray';
  }

  return {
    industryName: info.name,
    myValue: pbr,
    industryAvg: info.avgPBR,
    diffPercent,
    label,
    color,
  };
}
