interface ExternalLinksProps {
  stockCode: string;
}

export default function ExternalLinks({ stockCode }: ExternalLinksProps) {
  const links = [
    {
      name: '네이버',
      url: `https://finance.naver.com/item/main.naver?code=${stockCode}`,
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
          <path d="M3 18l6-6 4 4 8-8M14 4h7v7" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: 'DART',
      url: `https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm=${stockCode}`,
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
          <path d="M14 3v4a1 1 0 001 1h4M5 8V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: '토론방',
      url: `https://finance.naver.com/item/board.naver?code=${stockCode}`,
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
          <path d="M21 11a8 8 0 01-3.5 6.5L21 21l-4-1.5A8 8 0 1121 11z" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];
  
  return (
    <div className="grid grid-cols-3 gap-2 mb-3.5">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center p-4.5 px-2 bg-white rounded-2xl border border-emerald-700/10 hover:bg-emerald-50 transition-colors"
        >
          <div className="w-[38px] h-[38px] bg-emerald-50 rounded-full mx-auto mb-2.5 flex items-center justify-center">
            {link.icon}
          </div>
          <div className="text-[13px] font-semibold text-emerald-700">
            {link.name}
          </div>
        </a>
      ))}
    </div>
  );
}
