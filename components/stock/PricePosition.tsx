'use client';

import { useState } from 'react';
import { StockPrice } from '@/lib/types';
import { formatPrice, calculatePricePosition, getPositionLabel } from '@/lib/utils';

interface PricePositionProps {
  price: StockPrice;
}

export default function PricePosition({ price }: PricePositionProps) {
  const [period, setPeriod] = useState<'52w' | '20d'>('52w');
  
  const low = period === '52w' ? price.low52w : price.low20d;
  const high = period === '52w' ? price.high52w : price.high20d;
  const position = calculatePricePosition(price.current, low, high);
  const label = getPositionLabel(position);
  
  return (
    <div className="bg-white rounded-card p-5 mb-3.5 border border-emerald-700/10">
      {/* 헤더 + 토글 */}
      <div className="flex items-center justify-between mb-4.5">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] bg-emerald-50 rounded-lg flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v20M2 12h20" stroke="#047857" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="text-title font-semibold text-text-primary tracking-tight">
            가격 위치
          </h3>
        </div>
        <div className="flex gap-1 p-0.5 bg-bg-page rounded-lg">
          <button
            onClick={() => setPeriod('52w')}
            className={`text-xs px-3 py-1 rounded-md font-semibold transition-colors ${
              period === '52w' ? 'bg-emerald-700 text-white' : 'text-text-muted'
            }`}
          >
            52주
          </button>
          <button
            onClick={() => setPeriod('20d')}
            className={`text-xs px-3 py-1 rounded-md font-semibold transition-colors ${
              period === '20d' ? 'bg-emerald-700 text-white' : 'text-text-muted'
            }`}
          >
            20일
          </button>
        </div>
      </div>
      
      {/* 게이지 */}
      <div className="relative h-[18px] rounded-[9px] mb-3.5 overflow-hidden">
        <div className="absolute left-0 top-0 h-[18px] w-1/2 bg-korean-down"/>
        <div className="absolute left-1/2 top-0 h-[18px] w-1/2 bg-korean-up"/>
        <div 
          className="absolute top-1/2 w-7 h-7 bg-emerald-700 rounded-full border-4 border-white"
          style={{ 
            left: `${position}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 2px 12px rgba(4,120,87,0.4)',
          }}
        />
      </div>
      
      {/* 라벨 */}
      <div className="flex justify-between text-xs">
        <div>
          <div className="text-text-muted mb-0.5">최저</div>
          <div className="font-semibold text-korean-down text-sm">
            {formatPrice(low)}
          </div>
        </div>
        <div className="text-center">
          <div 
            className={`inline-block text-xs px-3 py-1 rounded-full font-semibold text-white ${
              label.isHigh ? 'bg-emerald-700' : 'bg-korean-down'
            }`}
          >
            {label.text}
          </div>
        </div>
        <div className="text-right">
          <div className="text-text-muted mb-0.5">최고</div>
          <div className="font-semibold text-korean-up text-sm">
            {formatPrice(high)}
          </div>
        </div>
      </div>
    </div>
  );
}
