'use client';

import { useState, useRef } from 'react';
import SearchBar from '@/components/home/SearchBar';
import MarketIndices from '@/components/home/MarketIndices';
import StockResultCard from '@/components/home/StockResultCard';

// 광고 슬롯
const MobileAd = () => (
  <div className="lg:hidden border border-dashed border-slate-200 rounded-xl p-3 text-center mb-4 bg-slate-50">
    <div className="text-[10px] text-slate-400 font-semibold mb-1">AD · 광고</div>
    <div className="text-xs text-slate-300 flex items-center justify-center" style={{ minHeight: '100px' }}>320×100</div>
  </div>
);

const PCBannerAd = () => (
  <div className="hidden lg:flex border border-dashed border-slate-200 rounded-xl p-3 text-center mb-4 bg-slate-50 items-center justify-center flex-col">
    <div className="text-[10px] text-slate-400 font-semibold mb-1">AD · 광고</div>
    <div className="text-xs text-slate-300" style={{ minHeight: '90px', display:'flex', alignItems:'center' }}>728×90</div>
  </div>
);

// 스켈레톤
const ResultSkeleton = () => (
  <div className="animate-pulse mb-4">
    <div className="bg-emerald-900/40 rounded-2xl h-32 mb-3"></div>
    <div className="bg-emerald-900/20 rounded-2xl h-24 mb-3 border-2 border-amber-400/20"></div>
    <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100 h-20">
      <div className="h-2.5 bg-slate-200 rounded w-28 mb-3"></div>
      <div className="h-8 bg-slate-200 rounded-full"></div>
    </div>
    <div className="grid grid-cols-2 gap-2 mb-3">
      {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl h-20 border border-slate-100"></div>)}
    </div>
    <div className="flex items-center justify-center gap-2 py-4">
      <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-[12px] text-slate-400">AI 분석 중...</span>
    </div>
  </div>
);

export default function HomePage() {
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<any>(null);
  const [error, setError]       = useState('');
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
      const res  = await fetch(`/api/stock/${code}`);
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
    <div className="min-h-screen">

      {/* ── 히어로 섹션 ── */}
      <div className="text-center pt-8 pb-6 px-4">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 mb-4">
          <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
          <span className="text-[11px] font-medium text-emerald-700">매수 전 1분 체크</span>
        </div>
        <h1 className="text-[26px] font-medium text-slate-800 leading-tight mb-2">
          이 종목<br />
          <span className="text-emerald-700">사도 될까?</span>
        </h1>
        <p className="text-[13px] text-slate-400 leading-relaxed">
          AI 브리핑 · 수급 · 위험신호<br />
          한 화면에서 30초 안에 확인
        </p>
      </div>

      {/* ── 광고 (상단) ── */}
      <MobileAd />
      <PCBannerAd />

      {/* ── 검색창 ── */}
      <SearchBar onSelect={handleSelect} selectedName={selectedName} />

      {/* ── 결과 영역 ── */}
      <div ref={resultRef}>
        {loading && <ResultSkeleton />}

        {!loading && error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4 text-center">
            <div className="text-[13px] font-medium text-red-700 mb-1">조회 실패</div>
            <div className="text-[11px] text-red-400 mb-2">{error}</div>
            <button onClick={handleClose} className="text-[11px] text-red-500 underline">닫기</button>
          </div>
        )}

        {!loading && result && (
          <>
            <StockResultCard data={result} onClose={handleClose} />
            {/* 결과 아래 광고 */}
            <MobileAd />
            <PCBannerAd />
          </>
        )}
      </div>

      {/* ── 결과 없을 때: 시장 현황 ── */}
      {!showResult && (
        <>
          {/* 시장 지수 */}
          <div className="mb-4">
            <div className="text-[11px] font-medium text-slate-400 mb-2 px-1">시장 현황</div>
            <MarketIndices />
          </div>

          {/* 서비스 소개 카드 */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { emoji: '🤖', title: 'AI 브리핑', desc: '수급·거래량·밸류 3줄 요약' },
              { emoji: '🛡️', title: '위험 신호', desc: '관리·환기종목 자동 감지' },
              { emoji: '📊', title: '1년 위치', desc: '52주 가격대 게이지' },
              { emoji: '🎯', title: '목표가 여력', desc: '애널리스트 컨센서스' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-3 border border-slate-100">
                <div className="text-[18px] mb-2">{emoji}</div>
                <div className="text-[12px] font-medium text-slate-700 mb-0.5">{title}</div>
                <div className="text-[10px] text-slate-400 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>

          {/* 하단 광고 */}
          <MobileAd />
        </>
      )}

      {/* 면책 조항 */}
      <div className="text-[10px] text-slate-400 text-center py-4 leading-relaxed px-4">
        본 정보는 참고용이며, 투자 자문이 아닙니다.<br/>
        모든 투자 판단과 결과는 본인 책임입니다.
      </div>
    </div>
  );
}
