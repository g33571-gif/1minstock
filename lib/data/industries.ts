// 업종별 종목 매핑 + 평균 PER/PBR
// 한국 시장 주요 업종 12개로 분류
// 평균값은 2024~2025년 기준 추정치 (월 1회 수동 업데이트)

export interface IndustryInfo {
  name: string;
  avgPer: number;
  avgPbr: number;
  description: string;
}

export const INDUSTRIES: Record<string, IndustryInfo> = {
  semiconductor: { name: '반도체',     avgPer: 22.3, avgPbr: 2.1, description: '반도체·메모리·장비' },
  battery:       { name: '2차전지',    avgPer: 28.5, avgPbr: 3.2, description: '배터리·소재' },
  auto:          { name: '자동차',     avgPer: 8.5,  avgPbr: 0.8, description: '완성차·부품' },
  bio:           { name: '바이오/제약', avgPer: 35.2, avgPbr: 4.1, description: '제약·바이오·의료' },
  finance:       { name: '금융',       avgPer: 6.2,  avgPbr: 0.5, description: '은행·증권·보험' },
  chemical:      { name: '화학',       avgPer: 15.8, avgPbr: 0.9, description: '화학·정유' },
  internet:      { name: 'IT/플랫폼',  avgPer: 26.7, avgPbr: 2.8, description: '인터넷·게임·소프트웨어' },
  steel:         { name: '철강/소재',  avgPer: 9.3,  avgPbr: 0.6, description: '철강·비철금속' },
  shipbuild:     { name: '조선/기계',  avgPer: 18.5, avgPbr: 1.7, description: '조선·중장비·기계' },
  consumer:      { name: '유통/소비재', avgPer: 14.2, avgPbr: 1.2, description: '유통·식품·생활용품' },
  telecom:       { name: '통신',       avgPer: 9.8,  avgPbr: 0.7, description: '이동통신·케이블' },
  energy:        { name: '에너지/유틸',  avgPer: 8.2,  avgPbr: 0.6, description: '전력·가스·정유' },
  construction:  { name: '건설',       avgPer: 11.5, avgPbr: 0.7, description: '건설·자재' },
  entertainment: { name: '엔터/미디어', avgPer: 24.1, avgPbr: 2.3, description: '미디어·엔터' },
  cosmetics:     { name: '화장품',     avgPer: 19.5, avgPbr: 2.2, description: '화장품·미용' },
  default:       { name: '기타',       avgPer: 15.0, avgPbr: 1.5, description: '기타 업종' },
};

// 종목코드 → 업종 매핑 (대형주 + 인기주 위주)
export const STOCK_INDUSTRY: Record<string, string> = {
  // === 반도체 ===
  '005930': 'semiconductor', // 삼성전자
  '000660': 'semiconductor', // SK하이닉스
  '000990': 'semiconductor', // DB하이텍
  '042700': 'semiconductor', // 한미반도체
  '058470': 'semiconductor', // 리노공업
  '240810': 'semiconductor', // 원익IPS
  '357780': 'semiconductor', // 솔브레인
  '095340': 'semiconductor', // ISC
  '108860': 'semiconductor', // 셀바스AI
  '403870': 'semiconductor', // HPSP
  '321400': 'semiconductor', // 코람코더원리츠
  '067310': 'semiconductor', // 하나마이크론
  '036930': 'semiconductor', // 주성엔지니어링
  '140860': 'semiconductor', // 파크시스템스
  '046890': 'semiconductor', // 서울반도체
  '094170': 'semiconductor', // 동운아나텍

  // === 2차전지 ===
  '373220': 'battery', // LG에너지솔루션
  '006400': 'battery', // 삼성SDI
  '247540': 'battery', // 에코프로비엠
  '086520': 'battery', // 에코프로
  '066970': 'battery', // 엘앤에프
  '096770': 'battery', // SK이노베이션
  '003670': 'battery', // 포스코퓨처엠
  '450080': 'battery', // 에코프로머티
  '383310': 'battery', // 에코프로에이치엔
  '108320': 'battery', // 실리콘투
  '348370': 'battery', // 엔켐
  '101490': 'battery', // 에스앤에스텍
  '121600': 'battery', // 나노신소재
  '290650': 'battery', // 엘앤씨바이오
  '460850': 'battery', // 천보

  // === 자동차 ===
  '005380': 'auto', // 현대차
  '000270': 'auto', // 기아
  '012330': 'auto', // 현대모비스
  '161390': 'auto', // 한국타이어앤테크놀로지
  '011210': 'auto', // 현대위아
  '204320': 'auto', // 만도
  '018880': 'auto', // 한온시스템
  '002350': 'auto', // 넥센타이어
  '073240': 'auto', // 금호타이어
  '005850': 'auto', // 에스엘

  // === 바이오/제약 ===
  '068270': 'bio', // 셀트리온
  '207940': 'bio', // 삼성바이오로직스
  '326030': 'bio', // SK바이오팜
  '000100': 'bio', // 유한양행
  '128940': 'bio', // 한미약품
  '009420': 'bio', // 한올바이오파마
  '196170': 'bio', // 알테오젠
  '141080': 'bio', // 리가켐바이오
  '263750': 'bio', // 펄어비스
  '145020': 'bio', // 휴젤
  '950130': 'bio', // 엑세스바이오
  '298380': 'bio', // 에이비엘바이오
  '069620': 'bio', // 대웅제약
  '170900': 'bio', // 동아에스티
  '003090': 'bio', // 대웅
  '237690': 'bio', // 에스티팜
  '237880': 'bio', // 클리노믹스
  '085660': 'bio', // 차바이오텍

  // === 금융 ===
  '105560': 'finance', // KB금융
  '055550': 'finance', // 신한지주
  '086790': 'finance', // 하나금융지주
  '316140': 'finance', // 우리금융지주
  '024110': 'finance', // 기업은행
  '138930': 'finance', // BNK금융지주
  '175330': 'finance', // JB금융지주
  '139130': 'finance', // DGB금융지주
  '029780': 'finance', // 삼성카드
  '030200': 'finance', // KT
  '032830': 'finance', // 삼성생명
  '000810': 'finance', // 삼성화재
  '005830': 'finance', // DB손해보험
  '001450': 'finance', // 현대해상
  '088350': 'finance', // 한화생명
  '071050': 'finance', // 한국금융지주
  '006800': 'finance', // 미래에셋증권
  '005940': 'finance', // NH투자증권
  '016360': 'finance', // 삼성증권
  '039490': 'finance', // 키움증권

  // === 화학 ===
  '051910': 'chemical', // LG화학
  '011170': 'chemical', // 롯데케미칼
  '009830': 'chemical', // 한화솔루션
  '298050': 'chemical', // 효성첨단소재
  '298000': 'chemical', // 효성화학
  '004990': 'chemical', // 롯데지주
  '011780': 'chemical', // 금호석유
  '002380': 'chemical', // KCC
  '298040': 'chemical', // 효성중공업
  '014680': 'chemical', // 한솔케미칼
  '120115': 'chemical', // 지에스이엔알
  '000880': 'chemical', // 한화

  // === IT/플랫폼 ===
  '035420': 'internet', // NAVER
  '035720': 'internet', // 카카오
  '036570': 'internet', // 엔씨소프트
  '251270': 'internet', // 넷마블
  '293490': 'internet', // 카카오게임즈
  '194480': 'internet', // 데브시스터즈
  '376300': 'internet', // 디어유
  '041510': 'internet', // 에스엠
  '352820': 'internet', // 하이브
  '035900': 'internet', // JYP Ent.
  '122870': 'internet', // 와이지엔터테인먼트
  '299900': 'internet', // 위지윅스튜디오
  '378800': 'internet', // 어보브
  '402340': 'internet', // SK스퀘어
  '181710': 'internet', // NHN
  '067160': 'internet', // 아프리카TV

  // === 철강/소재 ===
  '005490': 'steel', // POSCO홀딩스
  '004020': 'steel', // 현대제철
  '014820': 'steel', // 동원시스템즈
  '005010': 'steel', // 휴스틸
  '002710': 'steel', // TCC스틸
  '058430': 'steel', // 풍산
  '014910': 'steel', // 성문전자
  '008060': 'steel', // 대덕
  '103140': 'steel', // 풍산홀딩스

  // === 조선/기계 ===
  '329180': 'shipbuild', // HD현대중공업
  '010140': 'shipbuild', // 삼성중공업
  '042660': 'shipbuild', // 한화오션
  '009540': 'shipbuild', // HD한국조선해양
  '267250': 'shipbuild', // HD현대일렉트릭
  '034020': 'shipbuild', // 두산에너빌리티
  '042000': 'shipbuild', // 카페24
  '010620': 'shipbuild', // 현대미포조선
  '047810': 'shipbuild', // 한국항공우주
  '064350': 'shipbuild', // 현대로템
  '012450': 'shipbuild', // 한화에어로스페이스
  '079550': 'shipbuild', // LIG넥스원
  '272210': 'shipbuild', // 한화시스템

  // === 유통/소비재 ===
  '139480': 'consumer', // 이마트
  '004170': 'consumer', // 신세계
  '023530': 'consumer', // 롯데쇼핑
  '027410': 'consumer', // BGF리테일
  '282330': 'consumer', // BGF
  '097950': 'consumer', // CJ제일제당
  '001040': 'consumer', // CJ
  '035250': 'consumer', // 강원랜드
  '008770': 'consumer', // 호텔신라
  '004370': 'consumer', // 농심
  '271560': 'consumer', // 오리온
  '005440': 'consumer', // 현대그린푸드
  '111770': 'consumer', // 영원무역
  '003230': 'consumer', // 삼양식품
  '136490': 'consumer', // 선진
  '049770': 'consumer', // 동원F&B
  '280360': 'consumer', // 롯데웰푸드
  '081660': 'consumer', // 휠라홀딩스

  // === 통신 ===
  '017670': 'telecom', // SK텔레콤
  '030200_t': 'telecom', // KT (중복 방지)
  '032640': 'telecom', // LG유플러스
  '015760': 'telecom', // 한국전력 (에너지로도 가능)

  // === 에너지 ===
  '015760_e': 'energy', // 한국전력
  '010950': 'energy', // S-Oil
  '078930': 'energy', // GS
  '267260': 'energy', // 현대일렉트릭
  '034220': 'energy', // LG디스플레이
  '267290': 'energy', // 경동도시가스
  '036460': 'energy', // 한국가스공사
  '298000_e': 'energy', // 효성화학

  // === 건설 ===
  '000720': 'construction', // 현대건설
  '047040': 'construction', // 대우건설
  '006360': 'construction', // GS건설
  '028050': 'construction', // 삼성E&A
  '375500': 'construction', // DL이앤씨
  '006800_c': 'construction', // 미래에셋대우 (중복 방지)
  '375760': 'construction', // KCC건설
  '003410': 'construction', // 쌍용C&E
  '300720': 'construction', // 한일시멘트
  '009470': 'construction', // 삼화전기

  // === 화장품 ===
  '090430': 'cosmetics', // 아모레퍼시픽
  '161890': 'cosmetics', // 한국콜마
  '091990': 'cosmetics', // 셀트리온헬스케어
  '214150': 'cosmetics', // 클래시스
  '214370': 'cosmetics', // 케어젠
  '253450': 'cosmetics', // 스튜디오드래곤
  '383220': 'cosmetics', // 에프앤가이드
  '178920': 'cosmetics', // PI첨단소재
  '003490': 'cosmetics', // 대한항공
};

// 종목코드로 업종 정보 가져오기
export function getIndustry(stockCode: string): IndustryInfo {
  const industryKey = STOCK_INDUSTRY[stockCode] || 'default';
  return INDUSTRIES[industryKey] || INDUSTRIES.default;
}

// PER/PBR 비교 결과
export interface ValuationCompare {
  industryName: string;
  myValue: number;
  industryAvg: number;
  diffPercent: number;  // -20 = 업종 평균 대비 -20%
  label: '저평가' | '적정' | '고평가';
  color: 'blue' | 'gray' | 'red';
}

export function comparePer(myPer: number, stockCode: string): ValuationCompare | null {
  if (myPer <= 0) return null;
  const industry = getIndustry(stockCode);
  const diff = (myPer - industry.avgPer) / industry.avgPer * 100;
  return {
    industryName: industry.name,
    myValue: myPer,
    industryAvg: industry.avgPer,
    diffPercent: Math.round(diff),
    label: diff < -15 ? '저평가' : diff > 15 ? '고평가' : '적정',
    color: diff < -15 ? 'blue' : diff > 15 ? 'red' : 'gray',
  };
}

export function comparePbr(myPbr: number, stockCode: string): ValuationCompare | null {
  if (myPbr <= 0) return null;
  const industry = getIndustry(stockCode);
  const diff = (myPbr - industry.avgPbr) / industry.avgPbr * 100;
  return {
    industryName: industry.name,
    myValue: myPbr,
    industryAvg: industry.avgPbr,
    diffPercent: Math.round(diff),
    label: diff < -15 ? '저평가' : diff > 15 ? '고평가' : '적정',
    color: diff < -15 ? 'blue' : diff > 15 ? 'red' : 'gray',
  };
}
