// AI 요약 - Claude API 사용
// 방향성/권유 없이 사실 나열만 (법적 안전)

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

interface AISummaryInput {
  name: string;
  price: number;
  changePercent: number;
  per: number;
  pbr: number;
  foreign5d: number;      // 외국인 5일 순매수 (원)
  institution5d: number;  // 기관 5일 순매수 (원)
  pricePosition: number;  // 52주 위치 (0~100%)
  foreignOwnership: number;
  dividendYield: number;
  consecutiveBuyDays: number;
  marketCap: string;
}

// 캐시 (메모리, 서버 재시작 전까지 유지)
const summaryCache = new Map<string, { text: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6시간

export async function fetchAISummary(input: AISummaryInput): Promise<string | null> {
  if (!ANTHROPIC_API_KEY) return null;

  const cacheKey = `${input.name}_${new Date().toISOString().slice(0, 13)}`;
  const cached = summaryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.text;
  }

  try {
    // 사실 나열 데이터 구성
    const facts: string[] = [];

    if (input.changePercent > 0) {
      facts.push(`오늘 ${Math.abs(input.changePercent).toFixed(2)}% 상승`);
    } else if (input.changePercent < 0) {
      facts.push(`오늘 ${Math.abs(input.changePercent).toFixed(2)}% 하락`);
    }

    if (input.pricePosition <= 20) {
      facts.push(`52주 저점 근처 (저점 대비 +${input.pricePosition.toFixed(0)}%)`);
    } else if (input.pricePosition >= 80) {
      facts.push(`52주 고점 근처 (고점 대비 -${(100 - input.pricePosition).toFixed(0)}%)`);
    } else {
      facts.push(`52주 중간 구간 (저점 대비 +${input.pricePosition.toFixed(0)}%)`);
    }

    if (input.foreign5d > 0) {
      const amt = (input.foreign5d / 100000000).toFixed(1);
      facts.push(`외국인 ${input.consecutiveBuyDays}일 연속 순매수 (+${amt}억)`);
    } else if (input.foreign5d < 0) {
      const amt = (Math.abs(input.foreign5d) / 100000000).toFixed(1);
      facts.push(`외국인 순매도 (-${amt}억)`);
    }

    if (input.institution5d > 0) {
      const amt = (input.institution5d / 100000000).toFixed(1);
      facts.push(`기관 순매수 (+${amt}억)`);
    } else if (input.institution5d < 0) {
      facts.push(`기관 순매도`);
    }

    if (input.per > 0) {
      facts.push(`PER ${input.per.toFixed(1)}배`);
    }

    if (input.pbr > 0) {
      facts.push(`PBR ${input.pbr.toFixed(1)}배`);
    }

    if (input.dividendYield > 0) {
      facts.push(`배당률 ${input.dividendYield.toFixed(1)}%`);
    }

    const prompt = `다음은 ${input.name}(${input.marketCap})의 시장 데이터입니다:
${facts.join(', ')}

위 데이터만 바탕으로 40자 이내로 사실을 요약해주세요.
- 투자 권유나 매수/매도 의견 절대 금지
- 방향성 제시 금지 ("반등 기대", "하락 우려" 등 금지)  
- 오직 위 숫자 데이터의 핵심만 압축
- 예시: "외국인 5일 연속 순매수, 52주 저점 근처, PER 33배"
- 마침표 없이 짧게`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data?.content?.[0]?.text?.trim();
    if (!text) return null;

    summaryCache.set(cacheKey, { text, timestamp: Date.now() });
    return text;
  } catch (error) {
    console.error('[AI Summary] Error:', error);
    return null;
  }
}
