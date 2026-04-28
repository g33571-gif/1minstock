'use client';

import { useEffect, useState } from 'react';

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export default function MarketIndices() {
  const [indices, setIndices] = useState<MarketIndex[] | null>(null);

  useEffect(() => {
    // API에서 가져오기
    fetch('/api/market-indices')
      .then(res => res.json())
      .then(data => setIndices(data))
      .catch(() => {
        // 에러 시 기본값
        setIndices([
          { name: 'KOSPI', value: 2587.42, change: 20.31, changePercent: 0.8 },
          { name: 'KOSDAQ', value: 742.18, change: -2.15, changePercent: -0.3 },
        ]);
      });
  }, []);

  if (!indices) {
    return (
      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        {['KOSPI', 'KOSDAQ'].map(name => (
          <div key={name} className="bg-white rounded-card-sm p-3.5 border border-emerald-700/10 animate-pulse">
            <div className="h-3 bg-bg-subtle rounded mb-2 w-1/2"></div>
            <div className="h-6 bg-bg-subtle rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 mb-3.5">
      {indices.map((idx) => {
        const isUp = idx.changePercent > 0;
        return (
          <div key={idx.name} className="bg-white rounded-card-sm p-3.5 border border-emerald-700/10">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-emerald-700 font-bold tracking-wider">
                {idx.name}
              </span>
              <span className={`text-[11px] font-semibold ${isUp ? 'text-korean-up' : 'text-korean-down'}`}>
                {isUp ? '▲' : '▼'} {Math.abs(idx.changePercent).toFixed(1)}%
              </span>
            </div>
            <div className="text-xl font-bold text-text-primary tracking-tight">
              {idx.value.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
