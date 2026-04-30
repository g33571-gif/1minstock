// 구글 뉴스 RSS - 종목별 뉴스 가져오기
// 무료, 다양한 매체 (한경, 매경, 연합뉴스 등)

import axios from 'axios';

export interface GoogleNewsItem {
  title: string;     // 뉴스 제목
  link: string;      // 원문 링크
  source: string;    // 출처 (한국경제, 매일경제 등)
  pubDate: string;   // 발행일
  daysAgo: number;   // 며칠 전
}

/**
 * 구글 뉴스 RSS에서 종목 뉴스 가져오기
 * @param stockName 종목명 (예: "삼성전자")
 * @param maxCount 최대 개수 (기본 10)
 */
export async function fetchGoogleNews(
  stockName: string,
  maxCount: number = 10
): Promise<GoogleNewsItem[]> {
  if (!stockName) return [];

  try {
    // 구글 뉴스 RSS URL (한국어, 한국 지역)
    const query = encodeURIComponent(stockName);
    const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=ko&gl=KR&ceid=KR:ko`;

    const response = await axios.get(rssUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; StockNewsBot/1.0)',
      },
      responseType: 'text',
    });

    if (response.status !== 200) {
      console.log(`[fetchGoogleNews] HTTP error: ${response.status}`);
      return [];
    }

    const xml = response.data as string;
    const items = parseRssItems(xml, maxCount);

    console.log(`[fetchGoogleNews] stockName=${stockName}, found=${items.length}`);
    return items;

  } catch (error: any) {
    console.error(`[fetchGoogleNews] Error for ${stockName}:`, error?.message || error);
    return [];
  }
}

/**
 * RSS XML 파싱 (정규표현식 - 가벼움, 외부 라이브러리 X)
 */
function parseRssItems(xml: string, maxCount: number): GoogleNewsItem[] {
  const items: GoogleNewsItem[] = [];
  const now = Date.now();

  // <item>...</item> 블록 추출
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < maxCount) {
    const itemContent = match[1];

    const title = extractTag(itemContent, 'title');
    const link = extractTag(itemContent, 'link');
    const pubDate = extractTag(itemContent, 'pubDate');
    const source = extractSource(itemContent);

    if (!title || !link) continue;

    // 시간 파싱
    const itemTime = pubDate ? new Date(pubDate).getTime() : NaN;
    const daysAgo = isNaN(itemTime)
      ? 0
      : Math.max(0, Math.floor((now - itemTime) / (24 * 60 * 60 * 1000)));

    // 제목에서 출처 분리 (구글뉴스 형식: "기사제목 - 매체명")
    const cleanTitle = cleanGoogleNewsTitle(title);

    items.push({
      title: cleanTitle.title,
      link: link.trim(),
      source: cleanTitle.source || source || '',
      pubDate,
      daysAgo,
    });
  }

  return items;
}

/**
 * XML 태그 내용 추출
 */
function extractTag(content: string, tagName: string): string {
  // CDATA 처리
  const cdataRegex = new RegExp(`<${tagName}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tagName}>`, 'i');
  const cdataMatch = content.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  // 일반 태그
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const m = content.match(regex);
  return m ? m[1].trim() : '';
}

/**
 * <source url="...">매체명</source> 추출
 */
function extractSource(content: string): string {
  const match = content.match(/<source[^>]*>([\s\S]*?)<\/source>/i);
  return match ? match[1].trim() : '';
}

/**
 * 구글 뉴스 제목 정리
 * "삼성전자 4분기 실적 발표 - 한국경제" → { title: "삼성전자 4분기 실적 발표", source: "한국경제" }
 */
function cleanGoogleNewsTitle(rawTitle: string): { title: string; source: string } {
  // HTML 엔티티 디코딩 (간단)
  const decoded = rawTitle
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  // 마지막 " - 매체명" 패턴 분리
  const lastDashIdx = decoded.lastIndexOf(' - ');
  if (lastDashIdx > 0 && lastDashIdx > decoded.length - 20) {
    return {
      title: decoded.substring(0, lastDashIdx).trim(),
      source: decoded.substring(lastDashIdx + 3).trim(),
    };
  }

  return { title: decoded, source: '' };
}
