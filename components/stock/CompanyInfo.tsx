import { CompanyInfo as CompanyInfoType } from '@/lib/types';

interface CompanyInfoProps {
  data: CompanyInfoType;
}

export default function CompanyInfo({ data }: CompanyInfoProps) {
  const formatEmployees = (count: number) => {
    if (count >= 10000) return `${Math.floor(count / 10000)}만명`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}천명`;
    return `${count}명`;
  };
  
  const formatIPO = (date: string) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-white rounded-card p-5 mb-3.5 border border-emerald-700/10">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-[30px] h-[30px] bg-emerald-50 rounded-lg flex items-center justify-center">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path 
              d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 12h.01M9 15h.01M14 9h.01M14 12h.01M14 15h.01" 
              stroke="#047857" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-title font-semibold text-text-primary tracking-tight">
          회사 정보
        </h3>
      </div>
      
      {/* 사업 태그 */}
      {data.businessTags.length > 0 && (
        <div className="mb-3.5">
          <div className="flex gap-1.5 flex-wrap">
            {data.businessTags.map((tag) => (
              <span 
                key={tag}
                className="text-[13px] px-3.5 py-1.5 bg-emerald-700 text-white rounded-full font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* 회사 정보 그리드 */}
      <div className="grid grid-cols-2 gap-3 pt-3.5 border-t border-emerald-700/10">
        <div className="flex gap-2.5 items-center">
          <span className="text-xs text-text-muted font-medium">대표</span>
          <span className="text-sm font-semibold text-text-primary">
            {data.ceo}
          </span>
        </div>
        <div className="flex gap-2.5 items-center">
          <span className="text-xs text-text-muted font-medium">본사</span>
          <span className="text-sm font-semibold text-text-primary">
            {data.headquarters}
          </span>
        </div>
        <div className="flex gap-2.5 items-center">
          <span className="text-xs text-text-muted font-medium">직원</span>
          <span className="text-sm font-semibold text-text-primary">
            {formatEmployees(data.employees)}
          </span>
        </div>
        <div className="flex gap-2.5 items-center">
          <span className="text-xs text-text-muted font-medium">상장</span>
          <span className="text-sm font-semibold text-text-primary">
            {formatIPO(data.ipoDate)}
          </span>
        </div>
      </div>
    </div>
  );
}
