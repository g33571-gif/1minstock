import Link from 'next/link';

export default function NotFound() {
  const popularKeywords = ['삼성전자', 'SK하이닉스', '에코프로'];
  
  return (
    <div className="min-h-[600px]">
      <div className="text-center py-16 px-5">
        {/* 아이콘 */}
        <div className="inline-flex items-center justify-center w-[120px] h-[120px] bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full mb-7 relative">
          <svg width="58" height="58" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#047857" strokeWidth="2.5"/>
            <path d="M21 21l-4.35-4.35" stroke="#047857" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M9 9l4 4M13 9l-4 4" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wider">
            404
          </div>
        </div>
        
        <h1 className="text-2xl font-bold leading-tight tracking-tight mb-3 text-text-primary">
          종목을 찾을 수 없어요
        </h1>
        
        <p className="text-sm leading-relaxed text-text-secondary mb-8">
          검색하신 종목이 존재하지 않거나<br/>
          상장폐지된 종목일 수 있어요
        </p>
        
        {/* 안내 카드 */}
        <div className="bg-white rounded-2xl p-5 mx-auto mb-3.5 max-w-[360px] text-left border border-emerald-700/10">
          <div className="text-xs text-emerald-700 font-semibold mb-2.5">
            💡 이렇게 검색해보세요
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold flex-shrink-0">
                종목명
              </span>
              <span className="text-xs text-text-secondary">예: 삼성전자</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold flex-shrink-0">
                종목코드
              </span>
              <span className="text-xs text-text-secondary">예: 005930</span>
            </div>
          </div>
        </div>
        
        {/* 인기 키워드 */}
        <div className="flex gap-1.5 flex-wrap justify-center mb-8">
          <span className="text-xs text-text-muted self-center">인기:</span>
          {popularKeywords.map((kw) => (
            <Link
              key={kw}
              href={`/search?q=${encodeURIComponent(kw)}`}
              className="text-xs px-3 py-1.5 bg-white text-emerald-700 border border-emerald-700/20 rounded-full font-medium hover:bg-emerald-50 transition-colors"
            >
              {kw}
            </Link>
          ))}
        </div>
        
        {/* 메인으로 버튼 */}
        <Link
          href="/"
          className="inline-block text-[13px] px-5.5 py-2.5 bg-gradient-to-br from-emerald-700 to-emerald-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          🏠 메인으로 돌아가기
        </Link>
      </div>
      
      <div className="text-[11px] text-text-muted text-center px-3 pb-5 leading-relaxed">
        본 정보는 참고용이며, 투자 자문이 아닙니다.<br/>
        모든 투자 판단과 결과는 본인 책임입니다.
      </div>
    </div>
  );
}
