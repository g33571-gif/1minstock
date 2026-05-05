'use client';

/**
 * 쿠팡 파트너스 iframe 배너
 *
 * 사장님이 발급받은 코드 2종:
 * - id=986176, 680×140 (PC 메인 인아티클용 캐러셀)
 * - id=986179, 300×250 (PC 사이드 + 모바일 겸용 캐러셀)
 * - 공통 trackingCode: AF8240292
 *
 * 효과성 최적화 포인트:
 * 1. iframe 방식 = 별도 SDK 로드 없음 → 페이지 속도 영향 최소
 * 2. variant prop으로 두 사이즈 자동 전환
 * 3. "쿠팡 파트너스 활동..." 법적 고지문 필수 포함
 * 4. subId로 클릭 출처 추적
 */

type CoupangVariant = 'wide' | 'square';

interface CoupangBannerProps {
  variant?: CoupangVariant;   // 'wide' = 680×140, 'square' = 300×250
  subId?: string;
  className?: string;
  showNotice?: boolean;
}

// 사장님 발급 ID (환경변수에서 덮어쓰기 가능)
const COUPANG_WIDE_ID = process.env.NEXT_PUBLIC_COUPANG_WIDE_ID || '986176';
const COUPANG_SQUARE_ID = process.env.NEXT_PUBLIC_COUPANG_SQUARE_ID || '986179';
const COUPANG_TRACKING = process.env.NEXT_PUBLIC_COUPANG_TRACKING || 'AF8240292';

const VARIANT_CONFIG = {
  wide: { id: COUPANG_WIDE_ID, width: 680, height: 140 },
  square: { id: COUPANG_SQUARE_ID, width: 300, height: 250 },
};

export default function CoupangBanner({
  variant = 'wide',
  subId = '',
  className = '',
  showNotice = true,
}: CoupangBannerProps) {
  const config = VARIANT_CONFIG[variant];

  const iframeUrl =
    `https://ads-partners.coupang.com/widgets.html` +
    `?id=${config.id}` +
    `&template=carousel` +
    `&trackingCode=${COUPANG_TRACKING}` +
    `&subId=${encodeURIComponent(subId)}` +
    `&width=${config.width}&height=${config.height}&tsource=`;

  return (
    <div className={`coupang-wrapper w-full ${className}`}>
      {/* 광고 라벨 */}
      <div className="text-[10px] text-slate-400 font-medium mb-1 select-none text-center">
        AD · 쿠팡 파트너스
      </div>

      {/* iframe 컨테이너 - 모바일 가로 스크롤 허용 (wide 변형만 해당) */}
      <div className={`w-full ${variant === 'wide' ? 'overflow-x-auto' : 'flex justify-center'} rounded-xl bg-white`}>
        <iframe
          src={iframeUrl}
          width={config.width}
          height={config.height}
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
          // @ts-expect-error - browsingtopics는 Chrome 비표준 속성
          browsingtopics=""
          style={{ display: 'block', maxWidth: '100%' }}
          title="쿠팡 파트너스 추천 상품"
        />
      </div>

      {/* 법적 고지문 - 쿠팡 파트너스 약관상 필수 */}
      {showNotice && (
        <div className="text-[9px] text-slate-400 mt-1 text-center leading-tight px-2">
          쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </div>
      )}
    </div>
  );
}
