import Link from 'next/link';
import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer className="bg-white rounded-card p-6 border border-emerald-700/10 mt-4">
      {/* 로고 */}
      <div className="mb-5">
        <Logo size="sm" />
      </div>
      
      {/* 사이트맵 */}
      <div className="grid grid-cols-2 gap-5 mb-5 pb-5 border-b border-emerald-700/10">
        <div>
          <div className="text-[11px] text-text-muted font-semibold mb-2">서비스</div>
          <div className="grid gap-1.5">
            <Link href="/" className="text-xs text-text-secondary hover:text-emerald-700 transition-colors">
              메인
            </Link>
            <Link href="/about" className="text-xs text-text-secondary hover:text-emerald-700 transition-colors">
              소개
            </Link>
            <Link href="/guide" className="text-xs text-text-secondary hover:text-emerald-700 transition-colors">
              사용 가이드
            </Link>
          </div>
        </div>
        <div>
          <div className="text-[11px] text-text-muted font-semibold mb-2">정책</div>
          <div className="grid gap-1.5">
            <Link href="/terms" className="text-xs text-text-secondary hover:text-emerald-700 transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="text-xs text-text-secondary hover:text-emerald-700 transition-colors">
              개인정보 처리방침
            </Link>
            <Link href="/youth-protection" className="text-xs text-text-secondary hover:text-emerald-700 transition-colors">
              청소년보호정책
            </Link>
          </div>
        </div>
      </div>

      {/* 데이터 출처 */}
      <div className="mb-3.5 pb-3.5 border-b border-emerald-700/10">
        <div className="text-[11px] text-text-muted font-semibold mb-2">데이터 출처</div>
        <div className="text-[11px] text-text-muted leading-relaxed">
          시세 · 네이버 금융<br/>
          공시 · 금융감독원 DART<br/>
          거래소 정보 · 한국거래소 KIND<br/>
          <span className="text-text-light">※ 데이터는 실제와 차이가 있을 수 있습니다</span>
        </div>
      </div>

      {/* 운영 정보 */}
      <div className="mb-3.5 pb-3.5 border-b border-emerald-700/10">
        <div className="text-[11px] text-text-muted font-semibold mb-2">운영 정보</div>
        <div className="text-[11px] text-text-muted leading-relaxed">
          운영 · 벨롱스<br/>
          문의 · <a href="mailto:77rrr11@gmail.com" className="hover:text-emerald-700 transition-colors">77rrr11@gmail.com</a><br/>
          정보 오류 신고 · <a href="mailto:77rrr11@gmail.com" className="hover:text-emerald-700 transition-colors">77rrr11@gmail.com</a>
        </div>
      </div>

      {/* 면책 + 저작권 */}
      <div className="text-[10px] text-text-light text-center leading-relaxed">
        본 사이트는 단순 정보 제공 서비스이며, 투자 자문업체가 아닙니다.<br/>
        제공되는 모든 정보는 참고용이며, 투자 판단과 결과는 본인 책임입니다.<br/>
        © 2026 1MINSTOCK. All rights reserved.
      </div>
    </footer>
  );
}
