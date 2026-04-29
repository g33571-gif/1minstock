'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function LoadingProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 페이지 전환 시 상단 초록 바 애니메이션
    const bar = document.getElementById('loading-bar');
    if (!bar) return;
    bar.style.width = '0%';
    bar.style.opacity = '1';
    bar.style.transition = 'none';

    // 짧게 딜레이 후 애니메이션
    const t1 = setTimeout(() => {
      bar.style.transition = 'width 0.3s ease';
      bar.style.width = '100%';
    }, 10);

    const t2 = setTimeout(() => {
      bar.style.opacity = '0';
      bar.style.transition = 'opacity 0.3s ease';
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, searchParams]);

  return (
    <>
      {/* 상단 로딩 바 */}
      <div
        id="loading-bar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          width: '0%',
          background: 'linear-gradient(to right, #065f46, #10b981, #F59E0B)',
          zIndex: 9999,
          opacity: 0,
          borderRadius: '0 2px 2px 0',
        }}
      />
      {/* 전역 커서 스타일 */}
      <style>{`
        body.loading * { cursor: wait !important; }
        a, button { cursor: pointer; }
      `}</style>
    </>
  );
}
