import type { MetadataRoute } from 'next';

/**
 * Next.js가 자동으로 https://1minstock.com/robots.txt 만들어줌
 * 검색엔진에게 "어디 봐도 돼" 안내
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // 네이버 봇 (네이버 검색 노출에 중요)
      {
        userAgent: 'Yeti',
        allow: '/',
      },
      // 구글 봇
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: 'https://1minstock.com/sitemap.xml',
    host: 'https://1minstock.com',
  };
}
