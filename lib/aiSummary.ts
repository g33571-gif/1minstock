// AI 요약 - Claude API
// 데이터를 해석해서 일반인이 이해하는 언어로 설명
// 방향 제시 없이 현황 설명만 (법적 안전)

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

export interface AISummaryInput {
  name: string;
  price: number;
  changePercent: number;
  per: number;
  pbr: number;
  foreign5d: number;
  institution5d: number;
  pricePosition: number;   // 0~100 (52주 위치)
  foreignOwnership: number;
  dividendYield: number;
  consecutiveBuyDays: number;
  institutionConsecutiveBuyDays?: number;
  marketCap: string;
  consensusTargetPrice?: number;
  consensusBuyPct?: number;
}

const cache = new Map<string, { text: string; ts: number }>();
const TTL = 1000 * 60 * 60 * 6; // 6시간

export async function fetchAISummary(input: AISummaryInput): Promise<string | null> {
  if (!ANTHROPIC_API_KEY) return null;

  const cacheKey = `${input.name}_${new Date().toISOString().slice(0, 13)}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < TTL) return cached.text;

  try {
    // 데이터를 사람이 이해하는 언어로 해석할 컨텍스트 구성
    const ctx: string[] = [];

    // 오늘 주가 흐름
    if (input.changePercent > 3)
      ctx.push(`오늘 ${input.changePercent.toFixed(1)}% 급등`);
    else if (input.changePercent > 0.5)
      ctx.push(`오늘 ${input.changePercent.toFixed(1)}% 상승`);
    else if (input.changePercent < -3)
      ctx.push(`오늘 ${Math.abs(input.changePercent).toFixed(1)}% 급락`);
    else if (input.changePercent < -0.5)
      ctx.push(`오늘 ${Math.abs(input.changePercent).toFixed(1)}% 하락`);
    else
      ctx.push(`오늘 보합세`);

    // 52주 가격 위치 해석
    if (input.pricePosition <= 15)
      ctx.push(`1년 중 가장 낮은 가격대 근처`);
    else if (input.pricePosition <= 30)
      ctx.push(`1년 기준 저점 구간`);
    else if (input.pricePosition >= 85)
      ctx.push(`1년 중 가장 높은 가격대 근처`);
    else if (input.pricePosition >= 70)
      ctx.push(`1년 기준 고점 구간`);
    else
      ctx.push(`1년 기준 중간 가격대`);

    // 외국인 수급 해석
    if (input.consecutiveBuyDays >= 5)
      ctx.push(`외국인이 ${input.consecutiveBuyDays}거래일 연속 매수 중`);
    else if (input.consecutiveBuyDays >= 3)
      ctx.push(`외국인이 ${input.consecutiveBuyDays}거래일 연속 매수`);
    else if (input.foreign5d > 0)
      ctx.push(`외국인 순매수 우세`);
    else if (input.foreign5d < 0)
      ctx.push(`외국인 순매도 중`);

    // 기관 수급
    if (input.institution5d > 0 && input.foreign5d > 0)
      ctx.push(`기관도 동반 매수`);
    else if (input.institution5d < 0 && input.foreign5d < 0)
      ctx.push(`기관도 동반 매도`);

    // 외국인 보유율
    if (input.foreignOwnership >= 50)
      ctx.push(`외국인 보유율 ${input.foreignOwnership.toFixed(1)}%로 높은 편`);
    else if (input.foreignOwnership <= 10)
      ctx.push(`외국인 보유율 ${input.foreignOwnership.toFixed(1)}%로 낮은 편`);

    // PER 해석
    if (input.per > 0 && input.per < 10)
      ctx.push(`PER ${input.per.toFixed(0)}배로 이익 대비 주가가 낮은 수준`);
    else if (input.per >= 10 && input.per < 20)
      ctx.push(`PER ${input.per.toFixed(0)}배로 이익 대비 적정한 수준`);
    else if (input.per >= 20 && input.per < 40)
      ctx.push(`PER ${input.per.toFixed(0)}배로 이익 대비 주가가 높은 편`);
    else if (input.per >= 40)
      ctx.push(`PER ${input.per.toFixed(0)}배로 이익 대비 주가가 크게 높음`);
    else if (input.per <= 0)
      ctx.push(`현재 적자 상태`);

    // 배당
    if (input.dividendYield >= 4)
      ctx.push(`배당률 ${input.dividendYield.toFixed(1)}%로 높은 배당`);
    else if (input.dividendYield >= 2)
      ctx.push(`배당률 ${input.dividendYield.toFixed(1)}%`);

    // 컨센서스
    if (input.consensusBuyPct && input.consensusBuyPct >= 70)
      ctx.push(`증권사 ${input.consensusBuyPct}%가 매수 의견`);
    if (input.consensusTargetPrice && input.price > 0) {
      const upside = (input.consensusTargetPrice - input.price) / input.price * 100;
      if (upside >= 15) ctx.push(`증권사 평균 목표가까지 ${upside.toFixed(0)}% 여력`);
      else if (upside < 0) ctx.push(`현재가가 증권사 평균 목표가를 초과`);
    }

    const prompt = `당신은 주식 데이터를 일반인이 이해하기 쉽게 설명하는 역할입니다.

${input.name} 현재 상황:
${ctx.join(', ')}

다음 조건을 반드시 지키세요:
1. 60자 내외로 2~3문장
2. 초등학생도 이해할 수 있는 쉬운 말
3. 투자 권유나 매수·매도 의견 절대 금지
4. "~하세요" "~하면 좋겠다" 등 권유 표현 금지
5. 위 데이터만 바탕으로 현재 상황만 설명
6. 숫자는 그대로 쓰지 말고 "높다/낮다/많다" 등으로 풀어서
7. 마침표로 문장 끝내기

예시 형식:
"큰손(외국인·기관)이 며칠째 함께 사들이고 있어요. 현재 가격은 1년 중 낮은 편이고, 이익 대비 주가 수준은 업종 평균 정도예요."`;

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

    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.content?.[0]?.text?.trim();
    if (!text) return null;

    cache.set(cacheKey, { text, ts: Date.now() });
    return text;
  } catch (err) {
    console.error('[AI Summary]', err);
    return null;
  }
}
