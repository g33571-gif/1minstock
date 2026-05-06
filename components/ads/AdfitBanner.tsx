'use client';

import { useEffect, useRef } from 'react';

/**
 * 카카오 애드핏 배너 컴포넌트 V3
 *
 * V3 변경사항 (2026-05-06):
 * 1. SDK URL을 카카오 공식 가이드대로 변경 (daumcdn.net → kakaocdn.net)
 * 2. 광고 영역 옆에 SDK 스크립트 직접 삽입 (카카오 공식 권장 방식)
 * 3. 카카오 봇이 광고 호출을 즉시 인식할 수 있도록 개선
 *
 * 효과성 최적화 포인트:
 * 1. 광고 차단(AdBlock) 사용자도 레이아웃 안 깨짐 (min-height 고정)
 * 2. 페이지 라우팅 변경 시 광고 자동 재로드 (Next.js SPA 대응)
 * 3. "AD · 광고" 라벨 명시 → 정책 준수 + 신뢰도
 */

interface AdfitBannerProps {
  adUnit: string;          // DAN-XXXXXXXXXX
  width: number;
  height: number;
  className?: string;
  label?: boolean;
}

// 전역 SDK 로드 추적 (한 페이지에 여러 광고 있어도 SDK는 1번만 로드)
let sdkLoaded = false;

export default function AdfitBanner({
  adUnit,
  width,
  height,
  className = '',
  label = true,
}: AdfitBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    const ins = adRef.current;
    if (!ins) return;

    // SDK가 아직 로드 안 됐으면 로드
    if (!sdkLoaded && typeof window !== 'undefined') {
      const existingScript = document.querySelector('script[src*="kakaocdn.net/kas/static/ba.min.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = '//t1.kakaocdn.net/kas/static/ba.min.js';
        script.async = true;
        script.type = 'text/javascript';
        document.head.appendChild(script);
      }
      sdkLoaded = true;
    }

    // SDK가 광고를 다시 fetch하도록 cloneNode + replace
    // (Next.js SPA 라우팅 시 광고가 재로드되지 않는 문제 해결)
    const timer = setTimeout(() => {
      try {
        const cloned = ins.cloneNode(true) as HTMLElement;
        ins.parentNode?.replaceChild(cloned, ins);
        loadedRef.current = true;
      } catch {
        // 광고 로드 실패해도 사이트 동작에 영향 없음
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [adUnit]);

  return (
    <div
      className={`adfit-wrapper ${className}`}
      style={{
        minWidth: width,
        minHeight: label ? height + 18 : height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label && (
        <div className="text-[10px] text-slate-400 font-medium mb-1 select-none">
          AD · 광고
        </div>
      )}
      <ins
        ref={adRef}
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit={adUnit}
        data-ad-width={String(width)}
        data-ad-height={String(height)}
      />
    </div>
  );
}
