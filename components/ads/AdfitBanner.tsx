'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 카카오 애드핏 배너 컴포넌트 V4
 *
 * V4 변경사항 (2026-05-07):
 * 1. 첫 방문 시 광고 미로딩 문제 해결 (Hydration 이슈)
 * 2. SDK 로드 완료 후 광고 강제 새로고침 처리
 * 3. ins 태그를 처음부터 보이게 (display: none 제거)
 * 4. SDK가 광고를 못 잡았을 때 재시도 로직 추가
 * 5. 라우트 변경 시 광고 자동 재로드 (SPA 대응)
 *
 * 핵심 원리:
 * - SDK는 페이지 로드 시 1번만 ins 태그를 스캔
 * - Next.js의 hydration 시점에 ins 태그가 늦게 추가되면 SDK가 못 잡음
 * - 해결: ins 태그를 추가한 후 SDK에 다시 인식하도록 트리거
 */

interface AdfitBannerProps {
  adUnit: string;          // DAN-XXXXXXXXXX
  width: number;
  height: number;
  className?: string;
  label?: boolean;
}

// 전역 SDK 로드 상태 추적
let sdkLoadPromise: Promise<void> | null = null;

/**
 * 카카오 AdFit SDK 한 번만 로드하기
 * 여러 광고가 있어도 SDK는 1번만 로드
 */
function loadAdfitSDK(): Promise<void> {
  if (sdkLoadPromise) return sdkLoadPromise;

  sdkLoadPromise = new Promise<void>((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    // 이미 로드된 스크립트 확인
    const existing = document.querySelector(
      'script[src*="kakaocdn.net/kas/static/ba.min.js"]'
    );
    if (existing) {
      // 이미 있으면 약간 기다리기 (SDK 초기화 시간)
      setTimeout(resolve, 50);
      return;
    }

    // 새로 로드
    const script = document.createElement('script');
    script.src = '//t1.kakaocdn.net/kas/static/ba.min.js';
    script.async = true;
    script.type = 'text/javascript';

    script.onload = () => {
      // SDK 로드 후 안정화 시간
      setTimeout(resolve, 100);
    };

    script.onerror = () => {
      // 에러나도 resolve (사이트 동작에 영향 없게)
      resolve();
    };

    document.head.appendChild(script);
  });

  return sdkLoadPromise;
}

export default function AdfitBanner({
  adUnit,
  width,
  height,
  className = '',
  label = true,
}: AdfitBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Hydration 후에만 실제 광고 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  // 광고 로드 처리
  useEffect(() => {
    if (!mounted) return;
    if (!containerRef.current) return;
    if (!adUnit) return;

    let cancelled = false;
    const container = containerRef.current;

    const loadAd = async () => {
      // SDK 로드 대기
      await loadAdfitSDK();
      if (cancelled) return;

      // 컨테이너 비우고 새 ins 태그 생성
      // (이렇게 해야 SDK가 새 광고로 인식)
      container.innerHTML = '';

      const ins = document.createElement('ins');
      ins.className = 'kakao_ad_area';
      ins.style.display = 'block';
      ins.style.width = `${width}px`;
      ins.style.height = `${height}px`;
      ins.setAttribute('data-ad-unit', adUnit);
      ins.setAttribute('data-ad-width', String(width));
      ins.setAttribute('data-ad-height', String(height));

      container.appendChild(ins);

      // SDK가 새로 추가된 ins 태그를 인식하도록 약간 기다림
      // 그래도 광고가 안 떴다면 한 번 더 시도
      setTimeout(() => {
        if (cancelled) return;
        // 광고가 정상 로드됐는지 확인
        const iframe = ins.querySelector('iframe');
        if (!iframe) {
          // 아직 광고가 안 떴으면 SDK 강제 트리거
          // ba.min.js가 자동으로 ins 태그를 다시 스캔하도록
          const scriptTrigger = document.createElement('script');
          scriptTrigger.src = '//t1.kakaocdn.net/kas/static/ba.min.js';
          scriptTrigger.async = true;
          document.head.appendChild(scriptTrigger);
          // 1초 후 자동으로 제거 (메모리 정리)
          setTimeout(() => {
            try {
              document.head.removeChild(scriptTrigger);
            } catch (e) {
              // 무시
            }
          }, 1000);
        }
      }, 500);
    };

    loadAd();

    return () => {
      cancelled = true;
    };
  }, [mounted, adUnit, width, height]);

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
      {/* 광고가 들어갈 컨테이너 (useEffect에서 ins 태그 동적 생성) */}
      <div
        ref={containerRef}
        style={{
          width: `${width}px`,
          minHeight: `${height}px`,
        }}
      />
    </div>
  );
}
