import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '종목 검색 | 1MINSTOCK',
  description: '검색하신 종목 정보를 확인하세요',
};

interface PageProps {
  searchParams: { q?: string };
}

const allStocks = [
  { code: '005930', name: '삼성전자', sector: 'KOSPI', marketCap: 432, price: 72400, changePercent: -1.2 },
  { code: '207940', name: '삼성바이오로직스', sector: 'KOSPI', marketCap: 64, price: 932000, changePercent: 2.1 },
  { code: '006400', name: '삼성SDI', sector: 'KOSPI', marketCap: 28, price: 408000, changePercent: -0.5 },
  { code: '028260', name: '삼성물산', sector: 'KOSPI', marketCap: 24, price: 128500, changePercent: 0.8 },
  { code: '000810', name: '삼성화재', sector: 'KOSPI', marketCap: 16, price: 348000, changePercent: 1.4 },
  { code: '009150', name: '삼성전기', sector: 'KOSPI', marketCap: 11, price: 152800, changePercent: -0.3 },
  { code: '000660', name: 'SK하이닉스', sector: 'KOSPI', marketCap: 145, price: 198500, changePercent: 2.3 },
  { code: '058530', name: '이렘', sector: 'KOSDAQ', marketCap: 0.04, price: 1847, changePercent: -4.8 },
];

const popularKeywords = ['삼성전자', 'SK하이닉스', '에코프로', '두산에너빌리티'];

export default function SearchPage({ searchParams }: PageProps) {
  const query = searchParams.q || '';
  const results = query 
    ? allStocks.filter(s => s.name.includes(query) || s.code.includes(query))
    : [];
  
  return (
    <>
      {/* 검색어 없으면 안내 */}
      {!query && (
        <div className="bg-white rounded-3xl p-8 mb-3.5 border border-emerald-700/10 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path 
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" 
                stroke="#047857" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="text-base font-semibold text-text-primary mb-2">
            종목을 검색해보세요
          </div>
          <div className="text-sm text-text-secondary mb-5">
            상단 검색창에 종목명 또는 종목코드를 입력하세요
          </div>
          
          <div className="flex gap-1.5 flex-wrap justify-center">
            <span className="text-xs text-text-muted self-center">인기:</span>
            {popularKeywords.map((kw) => (
              <Link
                key={kw}
                href={`/search?q=${encodeURIComponent(kw)}`}
                className="text-xs px-3 py-1.5 bg-bg-page text-emerald-700 border border-emerald-700/20 rounded-full font-medium hover:bg-emerald-50 transition-colors"
              >
                {kw}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* 검색어 있을 때만 결과 */}
      {query && (
        <>
          <div className="px-1 pb-4 flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              <strong className="text-text-primary font-semibold">"{query}"</strong> 검색 결과{' '}
              <strong className="text-emerald-700 font-semibold">{results.length}개</strong>
            </div>
            {results.length > 0 && (
              <div className="text-xs text-text-muted">시가총액 순 ▾</div>
            )}
          </div>
          
          {results.length > 0 ? (
            <div className="bg-white rounded-3xl p-5 mb-3.5 border border-emerald-700/10">
              {results.map((stock, idx) => {
                const isUp = stock.changePercent > 0;
                const isLast = idx === results.length - 1;
                
                return (
                  <Link
                    key={stock.code}
                    href={`/${stock.code}`}
                    className={`flex items-center justify-between py-3.5 -mx-2 px-2 rounded transition-colors hover:bg-emerald-50 ${
                      !isLast ? 'border-b border-emerald-700/[0.08]' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[15px] font-semibold text-text-primary">
                          {stock.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-bg-page text-text-secondary rounded font-semibold">
                          {stock.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-text-muted">
                        {stock.sector} · {stock.marketCap}조원
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-text-primary">
                        {stock.price.toLocaleString('ko-KR')}원
                      </div>
                      <div className={`text-xs font-semibold ${
                        isUp ? 'text-korean-up' : 'text-korean-down'
                      }`}>
                        {isUp ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(1)}%
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 mb-3.5 border border-emerald-700/10 text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="text-base font-semibold text-text-primary mb-2">
                검색 결과가 없습니다
              </div>
              <div className="text-sm text-text-secondary mb-5">
                다른 종목명이나 종목코드로 검색해보세요
              </div>
              <div className="flex gap-1.5 flex-wrap justify-center">
                <span className="text-xs text-text-muted self-center">인기:</span>
                {popularKeywords.map((kw) => (
                  <Link
                    key={kw}
                    href={`/search?q=${encodeURIComponent(kw)}`}
                    className="text-xs px-3 py-1.5 bg-bg-page text-emerald-700 border border-emerald-700/20 rounded-full font-medium hover:bg-emerald-50 transition-colors"
                  >
                    {kw}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Tip */}
      <div className="bg-white rounded-3xl p-5 mb-3.5 border border-emerald-700/10">
        <div className="text-[13px] text-text-secondary mb-3 font-semibold">💡 사용 팁</div>
        <div className="text-xs text-text-muted leading-relaxed">
          • 종목명 (예: 삼성전자) 입력 시 → 검색 결과 페이지<br/>
          • 종목코드 6자리 (예: 005930) 입력 시 → 바로 종목 페이지<br/>
          • 상단 검색창에서 언제든 다른 종목 검색 가능
        </div>
      </div>
      
      <div className="text-[11px] text-gray-500 text-center py-3.5 leading-relaxed">
        본 정보는 참고용이며, 투자 자문이 아닙니다.<br/>
        모든 투자 판단과 결과는 본인 책임입니다.
      </div>
    </>
  );
}
