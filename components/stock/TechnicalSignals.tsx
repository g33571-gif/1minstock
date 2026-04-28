import { TechnicalSignals as TechnicalSignalsType } from '@/lib/types';

interface TechnicalSignalsProps {
  data: TechnicalSignalsType;
}

export default function TechnicalSignals({ data }: TechnicalSignalsProps) {
  return (
    <div className="bg-white rounded-card p-5 mb-3.5 border border-emerald-700/10">
      <div className="flex items-center gap-2.5 mb-4.5">
        <div className="w-[30px] h-[30px] bg-emerald-50 rounded-lg flex items-center justify-center">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path 
              d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" 
              stroke="#047857" 
              strokeWidth="2" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-title font-semibold text-text-primary tracking-tight">
          기술적 신호
        </h3>
      </div>
      
      <div className="grid gap-2.5">
        {/* RSI */}
        <div className="flex items-center gap-3.5 p-3.5 px-4 bg-bg-page rounded-xl">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center flex-shrink-0 border-[1.5px] border-emerald-700/25">
            <span className="text-base font-semibold text-emerald-700">
              {data.rsi.value.toFixed(0)}
            </span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-text-primary">
              RSI {data.rsi.status}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              30 이하 과매도, 70 이상 과매수
            </div>
          </div>
        </div>
        
        {/* 추세 */}
        <div className="flex items-center gap-3.5 p-3.5 px-4 bg-bg-page rounded-xl">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center flex-shrink-0 border-[1.5px] border-emerald-700/25">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path 
                d={data.trend.direction === '상승' 
                  ? "M3 17l6-6 4 4 8-8" 
                  : data.trend.direction === '하락'
                  ? "M3 7l6 6 4-4 8 8"
                  : "M3 12h18"
                }
                stroke="#047857" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              {data.trend.direction === '상승' && (
                <path d="M14 7h7v7" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              )}
              {data.trend.direction === '하락' && (
                <path d="M14 17h7v-7" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-text-primary">
              추세 {data.trend.direction}{data.trend.direction !== '횡보' ? ' 중' : ''}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              {data.trend.description}
            </div>
          </div>
        </div>
        
        {/* 거래량 */}
        <div className="flex items-center gap-3.5 p-3.5 px-4 bg-bg-page rounded-xl">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center flex-shrink-0 border-[1.5px] border-emerald-700/25">
            <span className="text-[13px] font-semibold text-emerald-700">
              {data.volume.ratio.toFixed(0)}%
            </span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-text-primary">
              거래량 {data.volume.status}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              평균 대비 {data.volume.ratio.toFixed(0)}% 거래
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
