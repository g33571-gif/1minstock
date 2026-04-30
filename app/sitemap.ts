import type { MetadataRoute } from 'next';
import { STOCK_INDUSTRY_MAP } from '@/lib/data/industries';

/**
 * Next.js가 자동으로 https://1minstock.com/sitemap.xml 만들어줌
 * 검색엔진(Google/Naver)이 이 파일 보고 사이트의 모든 페이지를 찾음
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://1minstock.com';
  const now = new Date();

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/youth-protection`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 모든 종목 상세 페이지 (2,771개)
  const stockPages: MetadataRoute.Sitemap = Object.keys(STOCK_INDUSTRY_MAP).map(code => ({
    url: `${baseUrl}/${code}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...stockPages];
}
