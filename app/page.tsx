'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/home/SearchBar';
import MarketIndices from '@/components/home/MarketIndices';
import StockResultCard from '@/components/home/StockResultCard';

const MobileAd = () => (
  <div className="lg:hidden border border-dashed border-slate-200 rounded-xl p-3 text-center mb-4 bg-slate-50">
    <div className="text-[10px] text-slate-400 font-semibold mb-1">AD · 광고</div>
    <div className="text-xs text-slate-300 flex items-center justify-center" style={{ minHeight: '100px' }}>320×100</div>
  </div>
);

const PCBannerAd = () => (
  <div className="hidden lg:flex border border-dashed border-slate-200 rounded-xl p-3 mb-4 bg-slate-50 items-center justify-center flex-col">
    <div className="text-[10px] text-slate-400 font-semibold mb-1">AD · 광고</div>
    <div className="text-xs text-slate-300" style={{ minHeight: '90px', display: 'flex', alignItems: 'center' }}>728×90</div>
  </div>
);

const ResultSkeleton = ({ name }: { name: string }) => (
  <div className="animate-pulse mb-4">
    <div className="bg-emerald-900/40 rounded-2xl h-32 mb-3"></div>
    <div className="bg-emerald-900/20 rounded-2xl h-28 mb-3 border-2 border-amber-400/20"></div>
    <div className="grid grid-cols-2 gap-2 mb-3">
      {[1,2,3,4,5,6].map(i => <div key={i} className="bg-white rounded-xl h-24 border border-slate-100"></div>)}
    </div>
    <div className="flex items-center justify-center gap-2 py-4">
      <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-[12px] text-slate-500">{name} AI 분석 중...</span>
    </div>
  </div>
);

const POPULAR = [
  { name: '삼성전자', code: '005930' },
  { name: 'SK하이닉스', code: '000660' },
  { name: '에코프로', code: '086520' },
  { name: 'NAVER', code: '035420' },
];

// 종목명 → 종목코드 빠른 검색
async function findCodeByName(name: string): Promise<{ code: string; name: string } | null> {
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(name)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return { code: data[0].code, name: data[0].name };
    }
    return null;
  } catch {
    return null;
  }
}

// ⭐ useSearchParams를 쓰는 부분만 별도 컴포넌트로 분리
// (Next.js 14에서 useSearchParams는 반드시 Suspense 안에 있어야 함)
function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<any>(null);
  const [error, setError]     = useState('');
  const [selectedName, setSelectedName] = useState('');

  const handleSelect = async (code: string, name: string) => {
    setSelectedName(name);
    setLoading(true);
    setResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });

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

  // URL 파라미터로 검색어가 들어오면 자동 검색
  useEffect(() => {
    const code = searchParams.get('code');
    const q = searchParams.get('q');

    if (code && /^\d{6}$/.test(code)) {
      handleSelect(code, code);
      router.replace('/', { scroll: false });
    } else if (q) {
      (async () => {
        const found = await findCodeByName(q);
        if (found) {
          handleSelect(found.code, found.name);
        } else {
          setError(`"${q}" 종목을 찾을 수 없어요`);
        }
        router.replace('/', { scroll: false });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleClose = () => {
    setResult(null);
    setError('');
    setSelectedName('');
    setLoading(false);
  };

  const showResult = loading || !!result || !!error;

  return (
    <div className="min-h-screen">

      {/* 히어로 배너 */}
      {!showResult && (
        <div className="bg-emerald-900 rounded-2xl p-5 mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/3 translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/30 rounded-full px-3 py-1 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
              <span className="text-[10px] font-medium text-amber-300">매수 전 1분 체크</span>
            </div>
            <h1 className="text-[24px] font-medium text-white leading-tight mb-3">
              이 종목<br />
              <span className="text-emerald-300">사도 될까?</span>
            </h1>
            <div className="flex flex-col gap-1.5">
              {[
                'AI 브리핑 — 수급·거래량·밸류 3줄 요약',
                '위험신호 자동 감지 — 2,613개 종목',
                '30초 안에 핵심 확인',
              ].map(text => (
                <div key={text} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0"></div>
                  <span className="text-[11px] text-emerald-200">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 결과 모드 미니 헤더 */}
      {showResult && (
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
            <span className="text-[11px] font-medium text-emerald-700">1MINSTOCK</span>
          </div>
          <button onClick={handleClose}
            className="text-[11px] text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors">
            ✕ 초기화
          </button>
        </div>
      )}

      <SearchBar onSelect={handleSelect} selectedName={selectedName} />

      {!showResult && (
        <>
          <MobileAd />
          <PCBannerAd />
        </>
      )}

      {loading && <ResultSkeleton name={selectedName} />}

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
          <MobileAd />
          <PCBannerAd />
        </>
      )}

      {!showResult && (
        <>
          <div className="mb-4">
            <div className="text-[11px] font-medium text-slate-400 mb-2 px-1">많이 찾는 종목</div>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR.map(({ name, code }) => (
                <button key={code} onClick={() => handleSelect(code, name)}
                  className="bg-white rounded-xl p-3 border border-slate-100 text-left hover:bg-slate-50 hover:border-emerald-200 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] font-medium text-slate-800">{name}</span>
                    <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">체크하기</span>
                  </div>
                  <div className="text-[10px] text-slate-400">탭하면 바로 분석</div>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="text-[11px] font-medium text-slate-400 mb-2 px-1">시장 현황</div>
            <MarketIndices />
          </div>
          <MobileAd />
        </>
      )}

      <div className="text-[10px] text-slate-400 text-center py-4 leading-relaxed">
        본 정보는 참고용이며, 투자 자문이 아닙니다.<br/>
        모든 투자 판단과 결과는 본인 책임입니다.
      </div>
    </div>
  );
}

// 로딩 중 보여줄 간단한 화면
function HomePageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[12px] text-slate-500">불러오는 중...</span>
      </div>
    </div>
  );
}

// ⭐ 메인 페이지 - Suspense로 감싸서 useSearchParams 에러 해결
export default function HomePage() {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePageContent />
    </Suspense>
  );
}
