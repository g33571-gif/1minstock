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
  const [error, setError] = useState(false);

  useEffect(() => {
    // ⭐ API에서 실제 데이터 가져오기 (가짜 fallback 제거)
    fetch('/api/market-indices')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setIndices(data);
        } else {
          // 빈 배열이면 에러 상태로
          setError(true);
          setIndices([]);
        }
      })
      .catch(() => {
        // 네트워크 에러 시 가짜 데이터 안 보임 (정직)
        setError(true);
        setIndices([]);
      });

    // 30초마다 자동 갱신
    const interval = setInterval(() => {
      fetch('/api/market-indices')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setIndices(data);
            setError(false);
          }
        })
        .catch(() => {});
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  // 로딩 중
  if (indices === null) {
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

  // 데이터 없음 (에러 상태)
  if (error || indices.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        {['KOSPI', 'KOSDAQ'].map(name => (
          <div key={name} className="bg-slate-50 rounded-card-sm p-3.5 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-slate-500 font-bold tracking-wider">{name}</span>
              <span className="text-[10px] text-slate-400">-</span>
            </div>
            <div className="text-base font-medium text-slate-400">데이터 준비 중</div>
          </div>
        ))}
      </div>
    );
  }

  // 정상 데이터
  return (
    <div className="grid grid-cols-2 gap-2.5 mb-3.5">
      {indices.map((idx) => {
        const isUp = idx.changePercent > 0;
        const isFlat = idx.changePercent === 0;
        return (
          <div key={idx.name} className="bg-white rounded-card-sm p-3.5 border border-emerald-700/10">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-emerald-700 font-bold tracking-wider">
                {idx.name}
              </span>
              {!isFlat && (
                <span className={`text-[11px] font-semibold ${isUp ? 'text-korean-up' : 'text-korean-down'}`}>
                  {isUp ? '▲' : '▼'} {Math.abs(idx.changePercent).toFixed(2)}%
                </span>
              )}
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
