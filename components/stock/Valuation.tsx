import { ValuationData } from '@/lib/types';

interface ValuationProps {
  data: ValuationData;
}

export default function Valuation({ data }: ValuationProps) {
  const items = [
    { label: 'PER', desc: '주가/순이익', value: data.per.value, industryAvg: data.per.industryAvg, suffix: '배' },
    { label: 'PBR', desc: '주가/순자산', value: data.pbr.value, industryAvg: data.pbr.industryAvg, suffix: '배' },
    { label: 'ROE', desc: '자기자본이익률', value: data.roe.value, industryAvg: data.roe.industryAvg, suffix: '%' },
    { label: 'PSR', desc: '주가/매출', value: data.psr.value, industryAvg: data.psr.industryAvg, suffix: '배' },
  ];
  
  return (
    <div className="bg-white rounded-card p-5 mb-3.5 border border-emerald-700/10">
      <div className="flex items-center gap-2.5 mb-4.5">
        <div className="w-[30px] h-[30px] bg-emerald-50 rounded-lg flex items-center justify-center">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M3 21V11M9 21V7M15 21V13M21 21V3" stroke="#047857" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 className="text-title font-semibold text-text-primary tracking-tight">
          가치 평가
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((item) => (
          <div key={item.label} className="p-4 bg-bg-page rounded-xl">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-xs text-text-secondary font-semibold">
                {item.label}
              </span>
              <span className="text-[10px] text-text-muted">
                {item.desc}
              </span>
            </div>
            <div className="text-[22px] font-semibold text-emerald-700 tracking-tight">
              {item.value.toFixed(1)}{item.suffix}
            </div>
            <div className="text-xs text-text-muted mt-1">
              업계 평균 {item.industryAvg.toFixed(1)}{item.suffix}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
