import { StockBasic, StockPrice, RiskSignal } from '@/lib/types';
import { formatPrice, formatChangeAmount } from '@/lib/utils';

interface StockHeaderProps {
  basic: StockBasic;
  price: StockPrice;
  risk: RiskSignal;
}

export default function StockHeader({ basic, price, risk }: StockHeaderProps) {
  const isUp = price.changePercent > 0;
  const isDown = price.changePercent < 0;
  
  return (
    <div className="bg-gradient-to-br from-emerald-700 to-emerald-600 rounded-card p-7 px-6 mb-3.5 text-white">
      {/* 시장 + 종목코드 + 위험 배지 */}
      <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
        <span className="text-xs px-3 py-1 bg-white/[0.18] text-white rounded-full font-medium tracking-wider">
          {basic.market} · {basic.code}
        </span>
        {risk.hasRisk && risk.risks[0] && (
          <span className="text-[11px] px-2.5 py-1 bg-red-600/50 text-white rounded-full font-semibold">
            ⚠ {risk.risks[0].label}
          </span>
        )}
      </div>
      
      {/* 종목명 + 설명 */}
      <div className="text-[28px] font-semibold tracking-tight mb-1">
        {basic.name}
      </div>
      {basic.description && (
        <div className="text-sm opacity-90 mb-5">
          {basic.description}
        </div>
      )}
      
      {/* 현재가 */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-5xl font-semibold tracking-tight">
          {formatPrice(price.current)}
        </span>
        <span className="text-lg opacity-85">원</span>
      </div>
      
      {/* 등락률 + 시간 */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span 
          className={`text-[15px] font-semibold px-3.5 py-1 rounded-lg ${
            isUp 
              ? 'bg-red-500/40 text-red-100' 
              : isDown
              ? 'bg-blue-700/40 text-blue-200'
              : 'bg-white/20 text-white'
          }`}
        >
          {isUp ? '▲' : isDown ? '▼' : '−'} {Math.abs(price.changePercent).toFixed(1)}% ({formatChangeAmount(price.change)})
        </span>
        <span className="text-xs opacity-80">
          {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
