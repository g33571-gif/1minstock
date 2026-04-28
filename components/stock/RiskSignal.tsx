import { RiskSignal as RiskSignalType } from '@/lib/types';

interface RiskSignalProps {
  risk: RiskSignalType;
}

export default function RiskSignal({ risk }: RiskSignalProps) {
  // 안전 상태
  if (!risk.hasRisk) {
    return (
      <div className="bg-white rounded-[18px] p-5 mb-3.5 border-[1.5px] border-emerald-700 flex items-center gap-3.5">
        <div className="w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" 
              stroke="#047857" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-[15px] font-semibold text-emerald-700 mb-0.5">
            위험 신호 없음
          </div>
          <div className="text-[13px] text-text-secondary">
            관리종목, 환기종목, 거래정지 등 해당 사항 없음
          </div>
        </div>
      </div>
    );
  }
  
  // 위험 상태
  return (
    <div className="bg-red-50 rounded-[18px] p-5 mb-3.5 border-[1.5px] border-red-600">
      {/* 헤더 */}
      <div className="flex items-start gap-3 mb-3.5">
        <div className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold text-red-900 mb-1">
            위험 신호 {risk.risks.length}건 확인
          </div>
          <div className="text-[13px] text-red-800">
            투자에 신중한 검토가 필요한 종목입니다
          </div>
        </div>
      </div>
      
      {/* 위험 항목 리스트 */}
      <div className="grid gap-2">
        {risk.risks.map((r, idx) => (
          <div 
            key={idx} 
            className="flex items-start gap-2.5 p-3 px-3.5 bg-white rounded-[10px] border-l-[3px] border-red-600"
          >
            <div className="text-[11px] px-2.5 py-0.5 bg-red-600 text-white rounded-full font-semibold flex-shrink-0">
              {r.label}
            </div>
            <div className="text-[13px] text-text-primary leading-snug flex-1">
              {r.description}
            </div>
          </div>
        ))}
      </div>
      
      {/* 강화된 면책 */}
      <div className="mt-3.5 p-3 px-3.5 bg-red-600/[0.08] rounded-[10px]">
        <div className="text-xs text-red-800 leading-relaxed">
          <strong className="font-semibold">참고:</strong> 위험 신호는 한국거래소 공시 기반으로 자동 표시됩니다. 
          정확한 내용은 DART에서 직접 공시 내용을 확인하시기 바랍니다.
        </div>
      </div>
    </div>
  );
}
