import { NewsItem } from '@/lib/types';

interface NewsProps {
  items: NewsItem[];
}

const categoryStyles: Record<NewsItem['category'], { bg: string; text: string; border?: string }> = {
  실적: { bg: 'bg-emerald-700', text: 'text-white' },
  사업: { bg: 'bg-white', text: 'text-emerald-700', border: 'border border-emerald-700' },
  공시: { bg: 'bg-gray-200', text: 'text-text-secondary' },
  시장: { bg: 'bg-amber-100', text: 'text-amber-800' },
  기타: { bg: 'bg-gray-200', text: 'text-text-secondary' },
};

export default function News({ items }: NewsProps) {
  if (items.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-card p-5 mb-3.5 border border-emerald-700/10">
      <div className="flex items-center justify-between mb-4.5">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] bg-emerald-50 rounded-lg flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="#047857" strokeWidth="2"/>
              <path d="M3 9h18" stroke="#047857" strokeWidth="2"/>
              <path d="M8 13h4" stroke="#047857" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="text-title font-semibold text-text-primary tracking-tight">
            최근 뉴스
          </h3>
        </div>
        <span className="text-[13px] text-emerald-700 font-semibold cursor-pointer">
          전체보기 ›
        </span>
      </div>
      
      <div className="grid gap-2.5">
        {items.slice(0, 3).map((item, idx) => {
          const style = categoryStyles[item.category];
          const isFirst = idx === 0;
          
          return (
            <div 
              key={item.id} 
              className={`p-4 px-4.5 rounded-[14px] ${
                isFirst ? 'bg-bg-page border-l-[3px] border-emerald-700' : 'bg-bg-page'
              }`}
            >
              <div className="flex gap-2 items-center mb-1.5">
                <span 
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${style.bg} ${style.text} ${style.border || ''}`}
                >
                  {item.category}
                </span>
                <span className="text-xs text-text-muted">
                  {item.daysAgo === 0 ? '오늘' : `${item.daysAgo}일 전`}
                </span>
              </div>
              <div className={`text-sm leading-snug text-text-primary ${
                isFirst ? 'font-semibold' : 'font-medium'
              }`}>
                {item.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
