interface DisclaimerProps {
  variant?: 'simple' | 'strong';
}

export default function Disclaimer({ variant = 'simple' }: DisclaimerProps) {
  if (variant === 'strong') {
    // 강화된 면책 (위험 종목 페이지 등에 사용)
    return (
      <div className="bg-red-50 rounded-xl p-4 mb-3.5 border-l-[3px] border-amber-500">
        <div className="flex items-start gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth="2"/>
            <path d="M12 8v4M12 16h.01" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="font-bold text-amber-800 block mb-1">투자 안내</strong>
            본 정보는 한국거래소 공시 및 공개 데이터를 자동 수집하여 표시됩니다. 정확한 내용은 DART(전자공시시스템) 또는 거래소 공시를 직접 확인하시기 바랍니다. 당사는 종목을 평가하거나 매매를 권유하지 않습니다. 정보 오류 발견 시 <a href="mailto:77rrr11@gmail.com" className="underline hover:text-amber-700">77rrr11@gmail.com</a>으로 신고 부탁드립니다.
          </div>
        </div>
      </div>
    );
  }
  
  // 기본 면책 (대부분의 페이지)
  return (
    <div className="text-[11px] text-text-muted text-center py-3.5 px-3 leading-relaxed">
      본 정보는 참고용이며, 투자 자문이 아닙니다.<br/>
      모든 투자 판단과 결과는 본인 책임입니다.
    </div>
  );
}
