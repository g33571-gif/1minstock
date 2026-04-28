const values = [
  {
    title: '위험 신호를 한눈에',
    desc: '관리종목, 환기종목, 거래정지 자동 감지',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path 
          d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" 
          stroke="#F59E0B" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: '외국인 매매 동향까지',
    desc: '5일 누적 매매와 보유율 한 화면에',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="2.5"/>
        <path d="M3 12h18" stroke="#F59E0B" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    title: '핵심 지표 요약',
    desc: 'PER, PBR, 실적까지 한 카드에',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 21V11M9 21V7M15 21V13M21 21V3" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function ValueProposition() {
  return (
    <div className="bg-gradient-to-br from-emerald-700 to-emerald-600 rounded-card p-6 mb-3.5 text-white">
      <div className="text-center mb-4.5">
        <div className="text-xl font-bold tracking-tight">왜 1MINSTOCK인가요?</div>
      </div>
      
      <div className="grid gap-2.5">
        {values.map((value, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500/30 rounded-full flex items-center justify-center flex-shrink-0">
              {value.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{value.title}</div>
              <div className="text-xs opacity-85 mt-0.5">{value.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
