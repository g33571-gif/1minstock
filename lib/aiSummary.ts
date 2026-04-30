// AI 브리핑 - Claude API
// 3줄 시그널: ① 수급 ② 거래량 ③ 밸류
// 사실 기반, 방향 제시 없음 (법적 안전)
// + 회사 사업 분야 한 줄 요약 (24시간 캐시)

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

export interface AISummaryInput {
  name: string;
  price: number;
  changePercent: number;
  per: number;
  pbr: number;
  foreign5d: number;
  institution5d: number;
  pricePosition: number;
  foreignOwnership: number;
  dividendYield: number;
  consecutiveBuyDays: number;
  institutionConsecutiveBuyDays?: number;
  marketCap: string;
  consensusTargetPrice?: number;
  consensusBuyPct?: number;
  volume: number;
  volumeRatio?: number;
}

export interface AIBriefing {
  signal1: string;
  signal2: string;
  signal3: string;
}

export interface CompanyOverview {
  headline: string; // 한 줄 핵심 (20자 이내)
  detail: string;   // 보충 설명 (30자 이내)
}

const cache = new Map<string, { data: AIBriefing; ts: number }>();
const TTL = 1000 * 60 * 60 * 6; // 6시간

// ⭐ 회사 요약 캐시 (24시간 - 사업 분야는 자주 안 바뀜)
const overviewCache = new Map<string, { data: CompanyOverview; ts: number }>();
const OVERVIEW_TTL = 1000 * 60 * 60 * 24; // 24시간

export async function fetchAIBriefing(input: AISummaryInput): Promise<AIBriefing> {
  const cacheKey = `${input.name}_${new Date().toISOString().slice(0, 13)}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < TTL) return cached.data;

  if (!ANTHROPIC_API_KEY) return buildFallback(input);

  try {
    const supplyCtx: string[] = [];
    if (input.consecutiveBuyDays >= 3 && input.institution5d > 0)
      supplyCtx.push(`외국인·기관 동반 순매수 ${input.consecutiveBuyDays}일 지속`);
    else if (input.consecutiveBuyDays >= 3)
      supplyCtx.push(`외국인 순매수 ${input.consecutiveBuyDays}일 연속`);
    else if (input.foreign5d > 0 && input.institution5d > 0)
      supplyCtx.push(`외국인·기관 동반 순매수`);
    else if (input.foreign5d < 0 && input.institution5d < 0)
      supplyCtx.push(`외국인·기관 동반 순매도`);
    else if (input.foreign5d > 0)
      supplyCtx.push(`외국인 순매수`);
    else if (input.foreign5d < 0)
      supplyCtx.push(`외국인 순매도`);
    else
      supplyCtx.push(`외국인 중립`);

    if (input.foreignOwnership > 0)
      supplyCtx.push(`외국인 보유율 ${input.foreignOwnership.toFixed(1)}%`);

    const vr = input.volumeRatio || 100;
    let volCtx = '';
    if (vr >= 300) volCtx = `평소 대비 +${Math.round(vr - 100)}% 폭발적 급증`;
    else if (vr >= 200) volCtx = `평소 대비 +${Math.round(vr - 100)}% 급증`;
    else if (vr >= 150) volCtx = `평소 대비 +${Math.round(vr - 100)}% 증가`;
    else if (vr >= 80) volCtx = `평소 수준 거래량 유지`;
    else volCtx = `평소 대비 거래량 감소`;

    const valCtx: string[] = [];
    if (input.per > 0) valCtx.push(`PER ${input.per.toFixed(1)}배`);
    else if (input.per <= 0) valCtx.push(`현재 적자`);

    if (input.consensusTargetPrice && input.price > 0) {
      const up = (input.consensusTargetPrice - input.price) / input.price * 100;
      if (Math.abs(up) >= 1)
        valCtx.push(`컨센서스 목표가 여력 ${up > 0 ? '+' : ''}${up.toFixed(1)}%`);
    }
    if (input.dividendYield >= 2)
      valCtx.push(`배당률 ${input.dividendYield.toFixed(1)}%`);

    const prompt = `당신은 주식 브리핑을 작성하는 전문 애널리스트입니다.

${input.name} 데이터를 바탕으로 3줄 시그널을 작성하세요.

[데이터]
수급: ${supplyCtx.join(', ')}
거래량: ${volCtx}
밸류: ${valCtx.join(', ') || '데이터 없음'}

[출력 - 반드시 이 JSON만]
{
  "signal1": "수급 한 문장 (30자 이내)",
  "signal2": "거래량 한 문장 (30자 이내)",
  "signal3": "밸류 한 문장 (30자 이내)"
}

[규칙]
- 30자 이내 간결한 문장
- 투자 권유·매수·매도 표현 절대 금지
- 사실 데이터만 서술
- JSON 외 텍스트 출력 금지

[예시]
{
  "signal1": "외국인·기관 동반 순매수 5일 지속, 보유율 49.3%",
  "signal2": "평소 대비 거래량 +152% 급증, 시장 관심 집중",
  "signal3": "PER 33.8배, 컨센서스 목표가 대비 +17% 여력"
}`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) return buildFallback(input);

    const data = await res.json();
    const raw = data?.content?.[0]?.text?.trim();
    if (!raw) return buildFallback(input);

    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned) as AIBriefing;

    if (!parsed.signal1 || !parsed.signal2 || !parsed.signal3)
      return buildFallback(input);

    cache.set(cacheKey, { data: parsed, ts: Date.now() });
    return parsed;

  } catch {
    return buildFallback(input);
  }
}

function buildFallback(input: AISummaryInput): AIBriefing {
  let signal1 = '';
  if (input.consecutiveBuyDays >= 3 && input.institution5d > 0)
    signal1 = `외국인·기관 동반 순매수 ${input.consecutiveBuyDays}일 지속`;
  else if (input.consecutiveBuyDays >= 2)
    signal1 = `외국인 순매수 ${input.consecutiveBuyDays}일 연속`;
  else if (input.foreign5d < 0 && input.institution5d < 0)
    signal1 = `외국인·기관 동반 순매도`;
  else if (input.foreign5d > 0)
    signal1 = `외국인 순매수 우세`;
  else
    signal1 = `외국인 중립적 수급`;

  if (input.foreignOwnership > 0)
    signal1 += `, 보유율 ${input.foreignOwnership.toFixed(1)}%`;

  const vr = input.volumeRatio || 100;
  let signal2 = '';
  if (vr >= 200) signal2 = `평소 대비 거래량 +${Math.round(vr - 100)}% 급증`;
  else if (vr >= 130) signal2 = `평소 대비 거래량 +${Math.round(vr - 100)}% 증가`;
  else if (vr >= 80) signal2 = `평소 수준 거래량`;
  else signal2 = `평소 대비 거래량 감소`;

  const parts: string[] = [];
  if (input.per > 0) parts.push(`PER ${input.per.toFixed(1)}배`);
  if (input.consensusTargetPrice && input.price > 0) {
    const up = (input.consensusTargetPrice - input.price) / input.price * 100;
    if (Math.abs(up) >= 1)
      parts.push(`목표가 여력 ${up > 0 ? '+' : ''}${up.toFixed(1)}%`);
  }
  const signal3 = parts.length > 0 ? parts.join(', ') : '밸류 데이터 없음';

  return { signal1, signal2, signal3 };
}

export async function fetchAISummary(input: AISummaryInput): Promise<string | null> {
  const b = await fetchAIBriefing(input);
  return `${b.signal1} / ${b.signal2} / ${b.signal3}`;
}

// ============================================================
// ⭐ 회사 사업 분야 요약 (사장님 요청)
// 24시간 캐시 - 사업 분야는 자주 안 바뀜
// ============================================================
export async function fetchCompanyOverview(
  code: string,
  name: string,
  industryName: string
): Promise<CompanyOverview | null> {
  const cacheKey = `overview_${code}`;
  const cached = overviewCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < OVERVIEW_TTL) return cached.data;

  if (!ANTHROPIC_API_KEY) return buildOverviewFallback(name, industryName);

  try {
    const prompt = `한국 상장 기업 "${name}" (업종: ${industryName})의 사업 분야를 두 줄로 요약하세요.

[규칙]
- headline: 회사의 핵심 사업을 20자 이내로 (예: "메모리 반도체 글로벌 1위")
- detail: 주요 사업/제품을 30자 이내로 (예: "스마트폰·가전·디스플레이 사업")
- 객관적 사실만, 투자 추천 표현 금지
- 모르는 회사면 업종에서 추정 가능한 일반적 설명
- JSON 외 텍스트 절대 출력 금지

[출력 - 반드시 이 JSON만]
{
  "headline": "...",
  "detail": "..."
}

[예시]
삼성전자 → {"headline": "메모리 반도체 글로벌 1위", "detail": "스마트폰·가전·디스플레이 사업"}
NAVER → {"headline": "국내 1위 검색 포털", "detail": "네이버페이·클라우드·웹툰 운영"}
코웨이 → {"headline": "정수기·공기청정기 렌탈 1위", "detail": "ICOOMI 글로벌 진출"}`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) return buildOverviewFallback(name, industryName);

    const data = await res.json();
    const raw = data?.content?.[0]?.text?.trim();
    if (!raw) return buildOverviewFallback(name, industryName);

    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned) as CompanyOverview;

    if (!parsed.headline || !parsed.detail) return buildOverviewFallback(name, industryName);

    overviewCache.set(cacheKey, { data: parsed, ts: Date.now() });
    return parsed;

  } catch {
    return buildOverviewFallback(name, industryName);
  }
}

function buildOverviewFallback(name: string, industryName: string): CompanyOverview {
  // API 실패 시 업종명만이라도 표시
  return {
    headline: industryName ? `${industryName} 분야 기업` : '국내 상장 기업',
    detail: '상세 정보는 DART 공시 참고',
  };
}

// ============================================================
// ⭐ AI 뉴스 분석 (사장님 요청)
// 최근 3일 뉴스 5~7개 → AI가 핵심 3개 선별 + 종합 코멘트
// 6시간 캐시
// ============================================================

export interface AINewsItem {
  title: string;
  time: string;
  url: string;
  daysAgo: number;
}

export interface AINewsAnalysis {
  comment: string;          // AI 종합 코멘트 (한 줄, 30자 이내)
  selectedNews: AINewsItem[]; // 선별된 핵심 3개 뉴스
}

const newsCache = new Map<string, { data: AINewsAnalysis; ts: number }>();
const NEWS_TTL = 1000 * 60 * 60 * 6; // 6시간

export async function fetchAINewsAnalysis(
  code: string,
  name: string,
  recentNews: AINewsItem[]
): Promise<AINewsAnalysis | null> {
  console.log(`[fetchAINewsAnalysis] code=${code}, news count=${recentNews?.length || 0}`);

  // 뉴스가 0개면 null 반환 (이건 정상)
  if (!recentNews || recentNews.length === 0) {
    console.log(`[fetchAINewsAnalysis] No news available, returning null`);
    return null;
  }

  const cacheKey = `news_${code}`;
  const cached = newsCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < NEWS_TTL) {
    console.log(`[fetchAINewsAnalysis] Cache hit for ${code}`);
    return cached.data;
  }

  // API 키 없으면 즉시 fallback
  if (!ANTHROPIC_API_KEY) {
    console.log(`[fetchAINewsAnalysis] No API key, using fallback`);
    return buildNewsFallback(recentNews);
  }

  try {
    // 뉴스 목록을 문자열로
    const newsListStr = recentNews.map((n, i) =>
      `${i + 1}. [${n.daysAgo === 0 ? '오늘' : n.daysAgo + '일 전'}] ${n.title}`
    ).join('\n');

    const prompt = `당신은 한국 주식 뉴스 분석가입니다. "${name}" 종목의 최근 뉴스를 분석하세요.

[뉴스 목록]
${newsListStr}

[작업]
1. 위 뉴스 중 가장 중요한/영향력 있는 3개를 선별 (단순 광고나 중복 제외)
2. 종합 코멘트 한 줄 작성 (30자 이내, 객관적 사실만)

[출력 - 반드시 이 JSON만]
{
  "comment": "30자 이내 종합 코멘트",
  "selectedIndices": [선별한 뉴스 번호 3개 배열, 예: 1, 3, 5]
}

[규칙]
- 코멘트는 30자 이내, 사실 기반
- 투자 권유·매수·매도 표현 절대 금지
- 호재/악재 표현 가능 (객관적 분석)
- selectedIndices는 위 목록의 번호 (1부터 시작)
- JSON 외 텍스트 출력 금지

[예시]
{
  "comment": "HBM 수요 증가로 호재 우세, 실적 개선 기대",
  "selectedIndices": [1, 3, 5]
}`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      console.log(`[fetchAINewsAnalysis] API failed (${res.status}), using fallback`);
      return buildNewsFallback(recentNews);
    }

    const data = await res.json();
    const raw = data?.content?.[0]?.text?.trim();
    if (!raw) {
      console.log(`[fetchAINewsAnalysis] Empty response, using fallback`);
      return buildNewsFallback(recentNews);
    }

    const cleaned = raw.replace(/```json|```/g, '').trim();
    let parsed: { comment: string; selectedIndices: number[] };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.log(`[fetchAINewsAnalysis] JSON parse failed, using fallback`);
      return buildNewsFallback(recentNews);
    }

    if (!parsed.comment || !Array.isArray(parsed.selectedIndices)) {
      console.log(`[fetchAINewsAnalysis] Invalid format, using fallback`);
      return buildNewsFallback(recentNews);
    }

    // 선별된 인덱스로 뉴스 추출 (1부터 시작이니 -1)
    const selectedNews = parsed.selectedIndices
      .map(idx => recentNews[idx - 1])
      .filter(n => n)
      .slice(0, 3);

    // AI가 0개 선별했으면 fallback (최신 3개)
    if (selectedNews.length === 0) {
      console.log(`[fetchAINewsAnalysis] AI selected 0 news, using fallback`);
      return buildNewsFallback(recentNews);
    }

    const result: AINewsAnalysis = {
      comment: parsed.comment,
      selectedNews,
    };

    newsCache.set(cacheKey, { data: result, ts: Date.now() });
    console.log(`[fetchAINewsAnalysis] Success, ${selectedNews.length} news selected`);
    return result;

  } catch (e: any) {
    console.error(`[fetchAINewsAnalysis] Error for ${code}:`, e?.message || e);
    return buildNewsFallback(recentNews);
  }
}

function buildNewsFallback(recentNews: AINewsItem[]): AINewsAnalysis {
  // API 실패 시 최신 3개 + 기본 코멘트
  const top3 = recentNews.slice(0, 3);
  const comment = top3.length === 1
    ? '최근 뉴스 1건, 동향 확인'
    : `최근 ${top3.length}건의 뉴스, 시장 동향 확인`;

  return {
    comment,
    selectedNews: top3,
  };
}

// ============================================================
// ⭐ V2: DART 공시 + 구글 뉴스 통합 AI 분석 (사장님 의도)
// 네이버 의존 없이 공식 데이터로 분석
// ============================================================

export interface DartFilingItem {
  title: string;
  date: string;
  url: string;
  daysAgo: number;
  reportName: string;
}

export interface GoogleNewsItem2 {
  title: string;
  link: string;
  source: string;
  daysAgo: number;
}

export interface AINewsAnalysisV2 {
  comment: string;                  // AI 종합 코멘트 (한 줄)
  filings: DartFilingItem[];        // 공식 공시 (최대 2개)
  newsItems: GoogleNewsItem2[];     // 시장 뉴스 (최대 3개)
  hasData: boolean;                 // 표시할 데이터 존재 여부
}

const newsCacheV2 = new Map<string, { data: AINewsAnalysisV2; ts: number }>();
const NEWS_TTL_V2 = 1000 * 60 * 60 * 6; // 6시간

export async function fetchAINewsAnalysisV2(
  code: string,
  name: string,
  filings: DartFilingItem[],
  newsItems: GoogleNewsItem2[]
): Promise<AINewsAnalysisV2> {
  console.log(`[fetchAINewsAnalysisV2] code=${code}, filings=${filings?.length || 0}, news=${newsItems?.length || 0}`);

  // 둘 다 없으면 안내
  if ((!filings || filings.length === 0) && (!newsItems || newsItems.length === 0)) {
    return {
      comment: '최근 7일 공시·뉴스가 없습니다',
      filings: [],
      newsItems: [],
      hasData: false,
    };
  }

  const cacheKey = `news_v2_${code}`;
  const cached = newsCacheV2.get(cacheKey);
  if (cached && Date.now() - cached.ts < NEWS_TTL_V2) {
    console.log(`[fetchAINewsAnalysisV2] Cache hit for ${code}`);
    return cached.data;
  }

  // 데이터 정제 (최대 개수 제한)
  const topFilings = (filings || []).slice(0, 5);
  const topNews = (newsItems || []).slice(0, 8);

  // API 키 없으면 fallback
  if (!ANTHROPIC_API_KEY) {
    console.log(`[fetchAINewsAnalysisV2] No API key, using fallback`);
    return buildV2Fallback(topFilings, topNews);
  }

  try {
    // 프롬프트 구성
    const filingsStr = topFilings.length > 0
      ? topFilings.map((f, i) => `${i + 1}. [${f.daysAgo === 0 ? '오늘' : f.daysAgo + '일 전'}] ${f.title}`).join('\n')
      : '(없음)';

    const newsStr = topNews.length > 0
      ? topNews.map((n, i) => `${i + 1}. [${n.daysAgo === 0 ? '오늘' : n.daysAgo + '일 전'}] ${n.title}`).join('\n')
      : '(없음)';

    const prompt = `당신은 한국 주식 분석가입니다. "${name}" 종목의 최근 공시와 뉴스를 통합 분석하세요.

[공식 공시 (DART)]
${filingsStr}

[시장 뉴스 (구글뉴스)]
${newsStr}

[작업]
1. 공시와 뉴스 전체를 보고 종합 코멘트 한 줄 작성 (30자 이내)
2. 공시 중 가장 중요한 것 최대 2개 선별 (없으면 빈 배열)
3. 뉴스 중 가장 중요한 것 최대 3개 선별 (없으면 빈 배열)

[출력 - 반드시 이 JSON만]
{
  "comment": "30자 이내 종합 코멘트",
  "filingIndices": [선별한 공시 번호 배열, 예: 1, 2],
  "newsIndices": [선별한 뉴스 번호 배열, 예: 1, 3, 5]
}

[규칙]
- 코멘트는 30자 이내, 객관적 사실 기반
- 투자 권유·매수·매도 표현 절대 금지
- 호재/악재 표현은 가능 (객관 분석)
- filingIndices와 newsIndices는 위 목록 번호 (1부터)
- JSON 외 텍스트 출력 금지`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      console.log(`[fetchAINewsAnalysisV2] API failed (${res.status})`);
      return buildV2Fallback(topFilings, topNews);
    }

    const data = await res.json();
    const raw = data?.content?.[0]?.text?.trim();
    if (!raw) return buildV2Fallback(topFilings, topNews);

    const cleaned = raw.replace(/```json|```/g, '').trim();
    let parsed: { comment: string; filingIndices: number[]; newsIndices: number[] };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.log(`[fetchAINewsAnalysisV2] JSON parse failed`);
      return buildV2Fallback(topFilings, topNews);
    }

    if (!parsed.comment) return buildV2Fallback(topFilings, topNews);

    const selectedFilings = (parsed.filingIndices || [])
      .map(i => topFilings[i - 1])
      .filter(f => f)
      .slice(0, 2);

    const selectedNews = (parsed.newsIndices || [])
      .map(i => topNews[i - 1])
      .filter(n => n)
      .slice(0, 3);

    // AI가 0개 선별했으면 fallback
    if (selectedFilings.length === 0 && selectedNews.length === 0) {
      return buildV2Fallback(topFilings, topNews);
    }

    const result: AINewsAnalysisV2 = {
      comment: parsed.comment,
      filings: selectedFilings,
      newsItems: selectedNews,
      hasData: true,
    };

    newsCacheV2.set(cacheKey, { data: result, ts: Date.now() });
    console.log(`[fetchAINewsAnalysisV2] Success, filings=${selectedFilings.length}, news=${selectedNews.length}`);
    return result;

  } catch (e: any) {
    console.error(`[fetchAINewsAnalysisV2] Error:`, e?.message || e);
    return buildV2Fallback(topFilings, topNews);
  }
}

function buildV2Fallback(filings: DartFilingItem[], newsItems: GoogleNewsItem2[]): AINewsAnalysisV2 {
  const filingCount = filings.length;
  const newsCount = newsItems.length;

  let comment = '';
  if (filingCount > 0 && newsCount > 0) {
    comment = `최근 공시 ${filingCount}건·뉴스 다수 발생, 동향 확인`;
  } else if (filingCount > 0) {
    comment = `최근 공식 공시 ${filingCount}건, 회사 동향 확인`;
  } else if (newsCount > 0) {
    comment = `최근 시장 뉴스 ${newsCount}건, 동향 확인`;
  } else {
    comment = '최근 정보 없음';
  }

  return {
    comment,
    filings: filings.slice(0, 2),
    newsItems: newsItems.slice(0, 3),
    hasData: filingCount > 0 || newsCount > 0,
  };
}


