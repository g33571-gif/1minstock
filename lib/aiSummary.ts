// AI 브리핑 - Claude API
// 3줄 시그널: ① 수급 ② 거래량 ③ 밸류
// 사실 기반, 방향 제시 없음 (법적 안전)

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
  volumeRatio?: number; // 평균 대비 % (150 = 평균 대비 +50%)
}

export interface AIBriefing {
  signal1: string; // ① 수급
  signal2: string; // ② 거래량
  signal3: string; // ③ 밸류
}

const cache = new Map<string, { data: AIBriefing; ts: number }>();
const TTL = 1000 * 60 * 60 * 6; // 6시간

export async function fetchAIBriefing(input: AISummaryInput): Promise<AIBriefing> {
  const cacheKey = `${input.name}_${new Date().toISOString().slice(0, 13)}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < TTL) return cached.data;

  // API 없으면 바로 fallback
  if (!ANTHROPIC_API_KEY) return buildFallback(input);

  try {
    // 수급 컨텍스트
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

    // 거래량 컨텍스트
    const vr = input.volumeRatio || 100;
    let volCtx = '';
    if (vr >= 300) volCtx = `평소 대비 +${Math.round(vr - 100)}% 폭발적 급증`;
    else if (vr >= 200) volCtx = `평소 대비 +${Math.round(vr - 100)}% 급증`;
    else if (vr >= 150) volCtx = `평소 대비 +${Math.round(vr - 100)}% 증가`;
    else if (vr >= 80) volCtx = `평소 수준 거래량 유지`;
    else volCtx = `평소 대비 거래량 감소`;

    // 밸류 컨텍스트
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
  // ① 수급
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

  // ② 거래량
  const vr = input.volumeRatio || 100;
  let signal2 = '';
  if (vr >= 200) signal2 = `평소 대비 거래량 +${Math.round(vr - 100)}% 급증`;
  else if (vr >= 130) signal2 = `평소 대비 거래량 +${Math.round(vr - 100)}% 증가`;
  else if (vr >= 80) signal2 = `평소 수준 거래량`;
  else signal2 = `평소 대비 거래량 감소`;

  // ③ 밸류
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

// 하위 호환
export async function fetchAISummary(input: AISummaryInput): Promise<string | null> {
  const b = await fetchAIBriefing(input);
  return `${b.signal1} / ${b.signal2} / ${b.signal3}`;
}
