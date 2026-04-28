/**
 * 한국식 숫자 포맷
 * 1억 이상은 "조/억" 단위로 표시
 */
export function formatKoreanNumber(value: number, suffix = '원'): string {
  if (value >= 1_000_000_000_000) {
    // 조 이상
    const trillion = value / 1_000_000_000_000;
    return `${trillion.toFixed(trillion >= 100 ? 0 : 1)}조${suffix}`;
  }
  if (value >= 100_000_000) {
    // 억 이상
    const billion = value / 100_000_000;
    return `${billion.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}억${suffix}`;
  }
  if (value >= 10_000) {
    // 만 이상
    const tenK = Math.floor(value / 10_000);
    return `${tenK.toLocaleString('ko-KR')}만${suffix}`;
  }
  return `${value.toLocaleString('ko-KR')}${suffix}`;
}

/**
 * 가격 포맷 (콤마)
 */
export function formatPrice(value: number): string {
  return value.toLocaleString('ko-KR');
}

/**
 * 등락률 포맷 (▲/▼ + 색상 클래스)
 */
export function formatChangePercent(percent: number): {
  symbol: string;
  text: string;
  colorClass: string;
} {
  if (percent > 0) {
    return {
      symbol: '▲',
      text: `${percent.toFixed(2)}%`,
      colorClass: 'text-korean-up',
    };
  }
  if (percent < 0) {
    return {
      symbol: '▼',
      text: `${Math.abs(percent).toFixed(2)}%`,
      colorClass: 'text-korean-down',
    };
  }
  return {
    symbol: '−',
    text: '0.00%',
    colorClass: 'text-text-muted',
  };
}

/**
 * 등락 금액 포맷
 */
export function formatChangeAmount(amount: number): string {
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : '';
  return `${sign}${Math.abs(amount).toLocaleString('ko-KR')}원`;
}

/**
 * 매매 금액 포맷 (+1,240억 / -420억)
 */
export function formatTradingAmount(amount: number): {
  text: string;
  colorClass: string;
} {
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : '';
  const absValue = Math.abs(amount);
  
  let text = '';
  if (absValue >= 1_000_000_000_000) {
    text = `${sign}${(absValue / 1_000_000_000_000).toFixed(1)}조`;
  } else if (absValue >= 100_000_000) {
    text = `${sign}${(absValue / 100_000_000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}억`;
  } else {
    text = `${sign}${absValue.toLocaleString('ko-KR')}`;
  }
  
  return {
    text,
    colorClass: amount > 0 ? 'text-korean-up' : amount < 0 ? 'text-korean-down' : 'text-text-muted',
  };
}

/**
 * 가격 위치 비율 계산 (52주 또는 20일)
 * 0~100 사이 값 반환
 */
export function calculatePricePosition(current: number, low: number, high: number): number {
  if (high === low) return 50;
  const ratio = ((current - low) / (high - low)) * 100;
  return Math.max(0, Math.min(100, ratio));
}

/**
 * 위치 라벨 (상위/하위 N%)
 */
export function getPositionLabel(positionPercent: number): {
  text: string;
  isHigh: boolean;
} {
  if (positionPercent >= 50) {
    return {
      text: `상위 ${(100 - positionPercent).toFixed(0)}%`,
      isHigh: true,
    };
  }
  return {
    text: `하위 ${positionPercent.toFixed(0)}%`,
    isHigh: false,
  };
}

/**
 * D-N 또는 N일 후
 */
export function formatDaysUntil(days: number): string {
  if (days === 0) return '오늘';
  if (days === 1) return '내일';
  if (days < 0) return `${Math.abs(days)}일 전`;
  return `${days}일 후`;
}

/**
 * 날짜를 MMM DD 형식으로
 */
export function formatDateShort(dateStr: string): { month: string; day: string } {
  const date = new Date(dateStr);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return {
    month: months[date.getMonth()],
    day: String(date.getDate()).padStart(2, '0'),
  };
}

/**
 * "X일 전" 표기
 */
export function formatRelativeDays(days: number): string {
  if (days === 0) return '오늘';
  if (days === 1) return '어제';
  return `${days}일 전`;
}

/**
 * 종목코드 검증
 */
export function isValidStockCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}
