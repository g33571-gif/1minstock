import { EarningsData } from '@/lib/types';
import { formatKoreanNumber } from '@/lib/utils';

interface EarningsProps {
  data: EarningsData;
}

export default function Earnings({ data }: EarningsProps) {
  const items = [
    { label: '매출', current: data.revenue.current, prev: data.revenue.previous, change: data.revenue.changePercent },
    { label: '영업이익', current: data.operatingProfit.current, prev: data.operatingProfit.previous, change: data.operatingProfit.changePercent },
    { label: '순이익', current: data.netProfit.current, prev: data.netProfit.previous, change: data.netProfit.changePercent },
  ];
  
  const getBadge = (change: number, current: number, prev: number) => {
    // 적자 → 흑자 또는 적자 → 적자 등 특수 케이스
    if (current < 0 && prev < 0) {
      return { text: '적자확대', bgClass: 'bg-korean-down' };
    }
    if (current < 0 && prev > 0) {
      return { text: '적자전환', bgClass: 'bg-korean-down' };
    }
    if (current > 0 && prev < 0) {
      return { text: '흑자전환', bgClass: 'bg-korean-up' };
    }
    
    // 일반 등락
    if (change > 0) {
      return { text: `▲ ${change.toFixed(0)}%`, bgClass: 'bg-korean-up' };
    }
    if (change < 0) {
      return { text: `▼ ${Math.abs(change).toFixed(0)}%`, bgClass: 'bg-korean-down' };
    }
    return { text: '−', bgClass: 'bg-text-muted' };
  };
  
  return (
    <div className="bg-white rounded-card p-5 mb-3.5 border border-emerald-700/10">
      <div className="flex items-center justify-between mb-4.5">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] bg-emerald-50 rounded-lg flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path 
                d="M3 17l6-6 4 4 8-8M14 7h7v7" 
                stroke="#047857" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-title font-semibold text-text-primary tracking-tight">
            최근 실적
          </h3>
        </div>
        <span className="text-xs text-text-muted px-3 py-1 bg-bg-page rounded-full font-medium">
          {data.year} · 전년비
        </span>
      </div>
      
      <div className="grid gap-2.5">
        {items.map((item) => {
          const badge = getBadge(item.change, item.current, item.prev);
          const formatValue = (v: number) => {
            const sign = v < 0 ? '-' : '';
            const absVal = Math.abs(v);
            if (absVal >= 1) return `${sign}${absVal.toFixed(absVal >= 10 ? 0 : 1)}조`;
            return `${sign}${(absVal * 10000).toFixed(0)}억`;
          };
          
          return (
            <div 
              key={item.label} 
              className="flex items-center gap-3 p-4 bg-bg-page rounded-[14px]"
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs text-text-secondary font-semibold">
                  {item.label}
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className={`text-[22px] font-semibold ${
                    item.current < 0 ? 'text-korean-down' : 'text-text-primary'
                  }`}>
                    {formatValue(item.current)}
                  </span>
                  <span className="text-xs text-text-muted">
                    / {formatValue(item.prev)}
                  </span>
                </div>
              </div>
              <div 
                className={`text-[15px] font-semibold text-white py-2 rounded-full text-center flex-shrink-0 ${badge.bgClass}`}
                style={{ minWidth: '88px' }}
              >
                {badge.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
