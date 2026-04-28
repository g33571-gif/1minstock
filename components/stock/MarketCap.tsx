import { MarketCapData } from '@/lib/types';
import { formatKoreanNumber, formatPrice } from '@/lib/utils';

interface MarketCapProps {
  data: MarketCapData;
}

export default function MarketCap({ data }: MarketCapProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 mb-3.5">
      {/* 시가총액 */}
      <div className="bg-white rounded-[18px] p-4.5 border border-emerald-700/10">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-[26px] h-[26px] bg-emerald-50 rounded-md flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M3 21V11M9 21V7M15 21V13M21 21V3" stroke="#047857" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-xs text-text-secondary font-semibold">시가총액</span>
        </div>
        <div className="text-2xl font-semibold text-text-primary tracking-tight">
          {formatKoreanNumber(data.marketCap * 100_000_000, '')}
        </div>
        {data.ranking && data.rankingMarket && (
          <div className="inline-block text-[11px] px-2.5 py-0.5 bg-emerald-700 text-white rounded-full font-semibold mt-1.5">
            {data.rankingMarket} {data.ranking}위
          </div>
        )}
      </div>
      
      {/* 배당률 */}
      <div className="bg-white rounded-[18px] p-4.5 border border-emerald-700/10">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-[26px] h-[26px] bg-emerald-50 rounded-md flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path 
                d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" 
                stroke="#047857" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-xs text-text-secondary font-semibold">배당률</span>
        </div>
        <div className="text-2xl font-semibold text-text-primary tracking-tight">
          {data.dividendYield ? `${data.dividendYield.toFixed(1)}%` : '-'}
        </div>
        <div className="text-xs text-text-muted mt-1.5">
          {data.dividendPerShare 
            ? `주당 ${formatPrice(data.dividendPerShare)}원` 
            : '배당 없음'}
        </div>
      </div>
    </div>
  );
}
