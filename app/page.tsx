'use client';

import { useState, useRef } from 'react';
import HeroSlider from '@/components/home/HeroSlider';
import SearchBar from '@/components/home/SearchBar';
import MarketIndices from '@/components/home/MarketIndices';
import ValueProposition from '@/components/home/ValueProposition';
import StockResultCard from '@/components/home/StockResultCard';

const MobileAd = () => (
  <div className="lg:hidden bg-bg-subtle border border-dashed border-slate-300 rounded-xl p-3 text-center mb-3.5">
    <div className="text-[10px] text-slate-500 font-semibold mb-1">AD · 광고</div>
    <div className="text-xs text-slate-400 flex items-center justify-center" style={{ minHeight: '100px' }}>[ 320×100 ]</div>
  </div>
);

const PCBannerAd = () => (
  <div className="hidden lg:block bg-bg-subtle border border-dashed border-slate-300 rounded-xl p-3 text-center mb-3.5">
    <div className="text-[10px] text-slate-500 font-semibold mb-1">AD · 광고</div>
    <div className="text-xs text-slate-400 flex items-center justify-center" style={{ minHeight: '90px' }}>[ 728×90 ]</div>
  </div>
);

const ResultSkeleton = () => (
  <div className="animate-pulse mb-3">
    <div className="bg-emerald-900/50 rounded-2xl h-32 mb-3"></div>
    <div className="bg-emerald-900/30 rounded-2xl h-24 mb-3 border-2 border-amber-400/20"></div>
    <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
      <div className="h-3 bg-slate-200 rounded w-28 mb-3"></div>
      <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
      <div className="h-9 bg-slate-200 rounded-full w-full"></div>
    </div>
    <div className="grid grid-cols-2 gap-2 mb-3">
      {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl h-20 border border-slate-100"></div>)}
    </div>
    <div className="flex items-center justify-center gap-2 py-3">
      <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-[12px] text-slate-400">AI 분석 중...</span>
    </div>
  </div>
);

export default function HomePage() {
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<any>(null);
  const [error, setError]           = useState('');
  const [selectedName, setSelectedName] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSelect = async (code: string, name: string) => {
    setSelectedName(name);
    setLoading(true);
    setResult(null);
    setError('');

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    try {
      const res = await fetch(`/api/stock/${code}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || '데이터를 불러올 수 없어요'); return; }
      setResult(data);
    } catch {
      setError('네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setError('');
    setSelectedName('');
    setLoading(false);
  };

  const showResult = loading || !!result || !!error;

  return (
    <>
      <MobileAd />
      <PCBannerAd />

      <HeroSlider />

      <SearchBar onSelect={handleSelect} selectedName={selectedName} />

      <div ref={resultRef}>
        {loading && <ResultSkeleton />}

        {!loading && error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-3 text-center">
            <div className="text-[13px] font-medium text-red-700 mb-1">조회 실패</div>
            <div className="text-[11px] text-red-500 mb-2">{error}</div>
            <button onClick={handleClose} className="text-[11px] text-red-600 underline">닫기</button>
          </div>
        )}

        {!loading && result && (
          <StockResultCard data={result} onClose={handleClose} />
        )}
      </div>

      {!showResult && (
        <>
          <MobileAd />
          <PCBannerAd />
          <MarketIndices />
          <ValueProposition />
          <MobileAd />
        </>
      )}

      <div className="text-[11px] text-gray-500 text-center py-3.5 leading-relaxed">
        본 정보는 참고용이며, 투자 자문이 아닙니다.<br/>
        모든 투자 판단과 결과는 본인 책임입니다.
      </div>
    </>
  );
}
