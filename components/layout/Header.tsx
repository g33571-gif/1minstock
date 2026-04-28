'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Suspense } from 'react';
import SearchAutocomplete from '@/components/search/SearchAutocomplete';

function HeaderContent() {
  const router = useRouter();
  const pathname = usePathname();
  
  const isMainPage = pathname === '/';

  return (
    <div className="flex items-center gap-3 py-3 px-4">
      {!isMainPage && (
        <button
          onClick={() => router.back()}
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
      
      {!isMainPage && (
        <div className="flex-1 min-w-0 hidden sm:block">
          <SearchAutocomplete variant="header" />
        </div>
      )}
      
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
