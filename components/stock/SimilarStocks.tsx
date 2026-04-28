import Link from 'next/link';
import { SimilarStock } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface SimilarStocksProps {
  stocks: SimilarStock[];
}

export default function SimilarStocks({ stocks }: SimilarStocksProps) {
  if (stocks.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-card p-5 mb-3.5 border border-emerald-700/10">
      <div className="flex items-center gap-2.5 mb-4.5">
        <div className="w-[30px] h-[30px] bg-emerald-50 rounded-lg flex items-center justify-center">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path 
              d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M12.5 11a4 4 0 100-8 4 4 0 000 8z" 
              stroke="#047857" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-title font-semibold text-text-primary tracking-tight">
          같은 업종 종목 비교
        </h3>
      </div>
      <div className="text-xs text-text-muted mb-3.5">
        시가총액 순으로 정렬
      </div>
      
      <div className="grid gap-2.5">
        {stocks.slice(0, 3).map((stock) => {
          const isUp = stock.changePercent > 0;
          return (
            <Link 
              key={stock.code}
              href={`/${stock.code}`}
              className="flex items-center justify-between p-3.5 px-4 bg-bg-page rounded-xl hover:bg-emerald-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-text-primary">
                    {stock.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">
                    {stock.sector}
                  </span>
                </div>
                <div className="text-[11px] text-text-muted">
                  {stock.marketCapDesc || `시총 ${(stock.marketCap / 10000).toFixed(1)}조`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-text-primary">
                  {formatPrice(stock.price)}원
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
    </div>
  );
}
