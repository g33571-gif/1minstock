import { CalendarEvent } from '@/lib/types';
import { formatDateShort, formatDaysUntil } from '@/lib/utils';

interface CalendarProps {
  events: CalendarEvent[];
}

export default function Calendar({ events }: CalendarProps) {
  if (events.length === 0) {
    return null;
  }
  
  // 임박 순 정렬
  const sorted = [...events].sort((a, b) => a.daysUntil - b.daysUntil);
  
  return (
    <div className="bg-white rounded-card p-5 mb-3.5 border border-emerald-700/10">
      <div className="flex items-center gap-2.5 mb-4.5">
        <div className="w-[30px] h-[30px] bg-emerald-50 rounded-lg flex items-center justify-center">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="#047857" strokeWidth="2"/>
            <path d="M3 9h18M8 3v4M16 3v4" stroke="#047857" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 className="text-title font-semibold text-text-primary tracking-tight">
          다가오는 일정
        </h3>
      </div>
      
      <div className="grid gap-2.5">
        {sorted.slice(0, 3).map((event, idx) => {
          const dateInfo = formatDateShort(event.date);
          const isFirst = idx === 0;
          const isWarning = event.isWarning || event.type === '거래정지' || event.type === '무상감자';
          
          // 첫 번째 일정 - 강조 (그라데이션)
          if (isFirst) {
            const gradientClass = isWarning 
              ? 'from-red-600 to-red-700'
              : 'from-emerald-700 to-emerald-600';
            
            return (
              <div 
                key={event.id}
                className={`flex items-center gap-4 p-3.5 px-4 bg-gradient-to-br ${gradientClass} rounded-[14px] text-white`}
              >
                <div className="text-center flex-shrink-0 w-[54px] py-2.5 bg-white/[0.18] rounded-[10px]">
                  <div className={`text-[10px] font-semibold tracking-wider ${
                    isWarning ? 'text-red-100' : 'text-emerald-100'
                  }`}>
                    {dateInfo.month}
                  </div>
                  <div className="text-2xl font-bold leading-none mt-0.5">
                    {dateInfo.day}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold">
                    {isWarning && '⚠ '}{event.title}
                  </div>
                  <div className={`text-xs mt-1 font-semibold ${
                    isWarning ? 'text-red-100' : 'text-emerald-100'
                  }`}>
                    {formatDaysUntil(event.daysUntil)}
                    {event.type === '거래정지' && ' · 거래정지 예정'}
                  </div>
                </div>
              </div>
            );
          }
          
          // 나머지 - 기본
          return (
            <div 
              key={event.id}
              className="flex items-center gap-4 p-3.5 px-4 bg-bg-page rounded-[14px]"
            >
              <div className="text-center flex-shrink-0 w-[54px] py-2.5 bg-white rounded-[10px] border border-emerald-700/15">
                <div className="text-[10px] text-text-muted font-semibold tracking-wider">
                  {dateInfo.month}
                </div>
                <div className="text-2xl font-bold text-emerald-700 leading-none mt-0.5">
                  {dateInfo.day}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-text-primary">
                  {event.title}
                </div>
                <div className="text-xs text-text-muted mt-1">
                  {formatDaysUntil(event.daysUntil)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
