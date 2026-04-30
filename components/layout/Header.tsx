'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Suspense, useState } from 'react';

function HeaderContent() {
  const router = useRouter();
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  const [keyword, setKeyword] = useState('');

  // ⭐ 검색 시 메인 페이지로 이동 + 쿼리 파라미터로 종목 전달
  // 메인 페이지(app/page.tsx)에서 ?q= 파라미터를 읽어 자동 검색 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) return;
    // 종목코드(6자리 숫자)면 코드, 아니면 이름으로 전달
    const isCode = /^\d{6}$/.test(q);
    router.push(`/?${isCode ? 'code' : 'q'}=${encodeURIComponent(q)}`);
    setKeyword('');
  };

  return (
    <div className="flex items-center gap-3 py-3 px-4">
      {!isMainPage && (
        <button
          onClick={() => router.push('/')}
          className="flex-shrink-0 w-11 h-11 bg-white rounded-full flex items-center justify-center border border-emerald-700 hover:bg-emerald-50 transition-colors"
          aria-label="back"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity flex-shrink-0">
        <svg width="34" height="34" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="9" fill="#047857"/>
          <rect x="7" y="20" width="4" height="8" rx="1" fill="#F59E0B" opacity="0.6"/>
          <rect x="14" y="15" width="4" height="13" rx="1" fill="#F59E0B" opacity="0.8"/>
          <rect x="21" y="10" width="4" height="18" rx="1" fill="#F59E0B"/>
          <circle cx="27" cy="9" r="2.5" fill="#F59E0B"/>
        </svg>
        <span className="font-medium text-base tracking-wider text-text-primary">1MINSTOCK</span>
      </Link>

      {/* ⭐ PC 헤더 검색창 - 메인 페이지로 이동하는 단순 검색창 */}
      <div className="flex-1 min-w-0 hidden lg:block">
        <form onSubmit={handleSearch} className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="종목명 또는 종목코드 검색"
            className="w-full h-10 pl-9 pr-20 rounded-full border border-emerald-700/15 bg-white text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700/40 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-medium rounded-full transition-colors"
          >
            검색
          </button>
        </form>
      </div>

      <button className="ml-auto flex-shrink-0 w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-emerald-700/15 hover:bg-emerald-50 transition-colors" aria-label="menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <line x1="3" y1="6" x2="21" y2="6" stroke="#047857" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="3" y1="12" x2="21" y2="12" stroke="#047857" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="3" y1="18" x2="21" y2="18" stroke="#047857" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

function HeaderFallback() {
  return (
    <div className="flex items-center gap-3 py-3 px-4">
      <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
        <svg width="34" height="34" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="9" fill="#047857"/>
          <rect x="7" y="20" width="4" height="8" rx="1" fill="#F59E0B" opacity="0.6"/>
          <rect x="14" y="15" width="4" height="13" rx="1" fill="#F59E0B" opacity="0.8"/>
          <rect x="21" y="10" width="4" height="18" rx="1" fill="#F59E0B"/>
          <circle cx="27" cy="9" r="2.5" fill="#F59E0B"/>
        </svg>
        <span className="font-medium text-base tracking-wider text-text-primary">1MINSTOCK</span>
      </Link>
    </div>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderContent />
    </Suspense>
  );
}
