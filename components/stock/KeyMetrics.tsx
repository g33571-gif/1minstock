import { ForeignTradingData, EarningsData, StockPrice } from '@/lib/types';
import { formatTradingAmount, calculatePricePosition, getPositionLabel } from '@/lib/utils';

interface KeyMetricsProps {
  price: StockPrice;
  foreignTrading: ForeignTradingData;
  earnings: EarningsData;
}

export default function KeyMetrics({ price, foreignTrading, earnings }: KeyMetricsProps) {
  const position = calculatePricePosition(price.current, price.low52w, price.high52w);
  const positionLabel = getPositionLabel(position);
  const foreignTrading5d = formatTradingAmount(foreignTrading.trading5days.foreign);
  const opChange = earnings.operatingProfit.changePercent;
  
  return (
    <div className="bg-white rounded-[18px] p-5 mb-3.5 border-l-[3px] border-emerald-700">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-[26px] h-[26px] bg-emerald-50 rounded-md flex items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" stroke="#047857" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-[13px] text-emerald-700 font-semibold">핵심 지표</span>
      </div>
      
      <div className="text-[15px] leading-relaxed text-text-primary">
        52주 가격 범위 중{' '}
        <strong className={`font-semibold ${positionLabel.isHigh ? 'text-emerald-700' : 'text-korean-down'}`}>
          {positionLabel.text}
        </strong>{' '}위치
        <br/>
        외국인 5일 누적{' '}
        <strong className={`font-semibold ${foreignTrading5d.colorClass}`}>
          {foreignTrading5d.text}
        </strong>{' '}
        {foreignTrading.trading5days.foreign > 0 ? '순매수' : '순매도'}
        <br/>
        영업이익 전년 대비{' '}
        <strong className={`font-semibold ${opChange > 0 ? 'text-korean-up' : 'text-korean-down'}`}>
          {opChange > 0 ? '+' : ''}{opChange.toFixed(0)}%
        </strong>
      </div>
    </div>
  );
}
