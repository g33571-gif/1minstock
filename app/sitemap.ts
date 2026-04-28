import { MetadataRoute } from 'next';

// 인기 종목 목록 (실제로는 DB에서 가져옴)
const popularStocks = [
  '005930', // 삼성전자
  '000660', // SK하이닉스
  '207940', // 삼성바이오로직스
  '006400', // 삼성SDI
  '028260', // 삼성물산
  '035420', // NAVER
  '035720', // 카카오
  '005380', // 현대차
  '051910', // LG화학
  '068270', // 셀트리온
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://1minstock.com';
  const now = new Date();
  
  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
  
  // 종목 페이지
  const stockPages: MetadataRoute.Sitemap = popularStocks.map((code) => ({
    url: `${baseUrl}/${code}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));
  
  return [...staticPages, ...stockPages];
}
