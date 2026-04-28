'use client';

import { useEffect } from 'react';

interface AdSlotProps {
  /** Kakao AdFit 광고 단위 ID */
  unit: string;
  /** 광고 크기 */
  size: '320x100' | '728x90' | '300x250' | '300x600';
  /** Sticky 여부 (PC 우측 사이드바용) */
  sticky?: 'left' | 'middle' | false;
  /** 컨테이너 추가 클래스 */
  className?: string;
}

export default function AdSlot({ unit, size, sticky = false, className = '' }: AdSlotProps) {
  const [width, height] = size.split('x').map(Number);

  useEffect(() => {
    // Kakao AdFit 스크립트 로드
    if (typeof window !== 'undefined' && unit) {
      const script = document.createElement('script');
      script.async = true;
      script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
      document.body.appendChild(script);

      return () => {
        // 정리
        try {
          document.body.removeChild(script);
        } catch (e) {
          // 이미 제거됨
        }
      };
    }
  }, [unit]);

  const stickyClass = sticky === 'left' 
    ? 'ad-sticky ad-sticky-left' 
    : sticky === 'middle' 
    ? 'ad-sticky ad-sticky-middle' 
    : '';

  return (
    <div className={`${stickyClass} ${className}`}>
      <div className="bg-bg-subtle border border-dashed border-slate-300 rounded-xl p-3 text-center">
        <div className="text-[10px] text-slate-500 font-semibold mb-1">AD · 광고</div>
        
        {/* 실제 Kakao AdFit 광고 */}
        <ins 
          className="kakao_ad_area" 
          style={{ display: 'none', width: `${width}px`, height: `${height}px` }}
          data-ad-unit={unit}
          data-ad-width={width}
          data-ad-height={height}
        />
        
        {/* 광고 로드 전 placeholder */}
        <div 
          className="text-xs text-slate-400 flex items-center justify-center"
          style={{ minHeight: `${height}px` }}
        >
          [ {size} ]
        </div>
      </div>
    </div>
  );
}
