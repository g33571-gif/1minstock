import { ForeignTradingData } from '@/lib/types';
import { formatTradingAmount } from '@/lib/utils';

interface ForeignTradingProps {
  data: ForeignTradingData;
}

export default function ForeignTrading({ data }: ForeignTradingProps) {
  const foreign5d = formatTradingAmount(data.trading5days.foreign);
  const inst5d = formatTradingAmount(data.trading5days.institution);
  const ind5d = formatTradingAmount(data.trading5days.individual);
  
  // 막대 너비 계산 (절댓값 비례)
  const maxAbs = Math.max(
    Math.abs(data.trading5days.foreign),
    Math.abs(data.trading5days.institution),
    Math.abs(data.trading5days.individual),
  );
  
  const getBarWidth = (value: number) => {
    if (maxAbs === 0) return 0;
    return Math.min(100, (Math.abs(value) / maxAbs) * 80);
  };
  
  return (
    <div className="bg-white rounded-card p-5 mb-3.5 border border-emerald-700/10">
      {/* 헤더 */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-[30px] h-[30px] bg-emerald-50 rounded-lg flex items-center justify-center">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#047857" strokeWidth="2"/>
            <path 
              d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" 
              stroke="#047857" 
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <h3 className="text-title font-semibold text-text-primary tracking-tight">
          외국인 매매 동향
        </h3>
      </div>
      <div className="text-[13px] text-text-muted mb-4.5 pl-10">
        {data.consecutiveBuyDays > 0 
          ? `${data.consecutiveBuyDays}일 연속 순매수`
          : data.consecutiveBuyDays < 0
          ? `${Math.abs(data.consecutiveBuyDays)}일 연속 순매도`
          : '매매 중립'}
      </div>
      
      {/* 보유율 큰 카드 */}
      <div className="p-5 bg-gradient-to-br from-emerald-700 to-emerald-600 rounded-2xl text-white mb-3.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] text-emerald-100 mb-1.5 font-semibold">
              {data.limitUtilization ? '외국인 한도 소진율' : '외국인 보유율'}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold tracking-tight">
                {(data.limitUtilization || data.foreignOwnership).toFixed(1)}
              </span>
              <span className="text-lg opacity-85">%</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[13px] font-semibold ${
                data.foreignOwnershipChange > 0 ? 'text-emerald-200' : 'text-blue-200'
              }`}>
                {data.foreignOwnershipChange > 0 ? '↑' : data.foreignOwnershipChange < 0 ? '↓' : '−'} 
                {' '}{Math.abs(data.foreignOwnershipChange).toFixed(1)}%p
              </span>
              <span className="text-xs text-emerald-100 opacity-80">1주일 변화</span>
            </div>
          </div>
          <div className="w-14 h-14 bg-white/[0.18] rounded-2xl flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
              <path 
                d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" 
                stroke="white" 
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
      </div>
      
      {/* 5일 매매 막대 */}
      <div className="grid gap-2.5">
        {[
          { label: '외국인', amount: data.trading5days.foreign, formatted: foreign5d },
          { label: '기관', amount: data.trading5days.institution, formatted: inst5d },
          { label: '개인', amount: data.trading5days.individual, formatted: ind5d },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 p-3 px-3.5 bg-bg-page rounded-[10px]">
            <span className="text-[13px] font-semibold min-w-[44px] text-text-primary">
              {item.label}
            </span>
            <div className="flex-1 h-1.5 bg-white rounded-full relative overflow-hidden">
              <div 
                className={`absolute left-0 top-0 h-1.5 rounded-full ${
                  item.amount > 0 ? 'bg-korean-up' : 'bg-korean-down'
                }`}
                style={{ width: `${getBarWidth(item.amount)}%` }}
              />
            </div>
            <span className={`text-sm font-semibold min-w-[76px] text-right ${item.formatted.colorClass}`}>
              {item.formatted.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
