export default function StockSkeleton() {
  return (
    <div className="animate-pulse">
      {/* 헤더 스켈레톤 */}
      <div className="bg-emerald-900/80 rounded-2xl p-4 mb-3">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="h-3 bg-white/20 rounded w-24 mb-2"></div>
            <div className="h-6 bg-white/20 rounded w-32 mb-3"></div>
            <div className="h-9 bg-white/20 rounded w-44"></div>
          </div>
          <div className="h-12 w-20 bg-white/10 rounded-lg"></div>
        </div>
        <div className="border-t border-white/10 pt-3 grid grid-cols-4 gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-2 bg-white/15 rounded w-8 mx-auto mb-1.5"></div>
              <div className="h-3 bg-white/20 rounded w-12 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* AI 분석 스켈레톤 */}
      <div className="bg-emerald-900/80 rounded-2xl p-4 mb-3 border-2 border-amber-400/40">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-16 bg-amber-400/30 rounded-md"></div>
          <div className="h-3 w-32 bg-white/10 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-white/20 rounded w-full"></div>
          <div className="h-3 bg-white/20 rounded w-5/6"></div>
          <div className="h-3 bg-white/20 rounded w-3/4"></div>
        </div>
      </div>

      {/* 현황 요약 3칸 스켈레톤 */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-3 border border-slate-100">
            <div className="h-4 w-4 bg-slate-200 rounded mx-auto mb-2"></div>
            <div className="h-2.5 bg-slate-200 rounded w-3/4 mx-auto mb-1.5"></div>
            <div className="h-2 bg-slate-200 rounded w-1/2 mx-auto mb-3"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto"></div>
          </div>
        ))}
      </div>

      {/* 1년 가격위치 스켈레톤 */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="h-3.5 bg-slate-200 rounded w-28 mb-1.5"></div>
        <div className="h-2.5 bg-slate-200 rounded w-40 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded-full mb-3"></div>
        <div className="flex justify-between">
          <div className="h-2.5 bg-slate-200 rounded w-16"></div>
          <div className="h-2.5 bg-slate-200 rounded w-20"></div>
          <div className="h-2.5 bg-slate-200 rounded w-16"></div>
        </div>
      </div>

      {/* PER/PBR/배당 스켈레톤 */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-3 border border-slate-100 text-center">
            <div className="h-4 w-4 bg-slate-200 rounded mx-auto mb-2"></div>
            <div className="h-2.5 bg-slate-200 rounded w-3/4 mx-auto mb-1.5"></div>
            <div className="h-2 bg-slate-200 rounded w-1/2 mx-auto mb-3"></div>
            <div className="h-5 bg-slate-200 rounded w-2/3 mx-auto"></div>
          </div>
        ))}
      </div>

      {/* 추세 스켈레톤 */}
      <div className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
        <div className="h-3.5 bg-slate-200 rounded w-28 mb-1.5"></div>
        <div className="h-2.5 bg-slate-200 rounded w-48 mb-4"></div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-slate-100 rounded-lg h-16"></div>
          ))}
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-t border-slate-100">
            <div className="h-3 bg-slate-200 rounded w-12"></div>
            <div className="flex-1 h-2 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded w-12"></div>
          </div>
        ))}
      </div>

      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 text-[12px] text-slate-400">
          <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
          데이터 불러오는 중...
        </div>
      </div>
    </div>
  );
}
