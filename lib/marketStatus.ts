// lib/marketStatus.ts
// 한국 주식 시장 상태 판단 유틸리티

export type MarketStatus =
  | "PRE_OPEN"   // 장 시작 전 (오전 9시 이전)
  | "OPEN"       // 장중 (9:00 ~ 15:30)
  | "CLOSED"     // 장 마감 후 (15:30 이후)
  | "WEEKEND"    // 주말
  | "HOLIDAY";   // 공휴일

export interface MarketStatusInfo {
  status: MarketStatus;
  label: string;
  description: string;
  isLive: boolean;
  showBanner: boolean;
}

// 한국거래소 휴장일 (2026년)
const KRX_HOLIDAYS_2026 = [
  "2026-01-01",
  "2026-02-16", "2026-02-17", "2026-02-18",
  "2026-03-01",
  "2026-05-05",
  "2026-05-25",
  "2026-06-03",
  "2026-06-06",
  "2026-08-15",
  "2026-09-24", "2026-09-25", "2026-09-26",
  "2026-10-03",
  "2026-10-09",
  "2026-12-25",
  "2026-12-31",
];

export function getMarketStatus(): MarketStatusInfo {
  // 한국 시간(KST = UTC+9)으로 변환
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const kstTime = new Date(utcMs + 9 * 60 * 60 * 1000);

  const day = kstTime.getDay();
  const hour = kstTime.getHours();
  const minute = kstTime.getMinutes();
  const dateStr = kstTime.toISOString().split("T")[0];

  if (day === 0 || day === 6) {
    return {
      status: "WEEKEND",
      label: "주말 휴장",
      description: "주말에는 거래가 없습니다. 표시된 가격은 마지막 거래일 종가입니다.",
      isLive: false,
      showBanner: true,
    };
  }

  if (KRX_HOLIDAYS_2026.includes(dateStr)) {
    return {
      status: "HOLIDAY",
      label: "휴장일",
      description: "오늘은 한국거래소 휴장일입니다. 표시된 가격은 직전 거래일 종가입니다.",
      isLive: false,
      showBanner: true,
    };
  }

  if (hour < 9) {
    return {
      status: "PRE_OPEN",
      label: "장 시작 전",
      description: "오전 9시에 거래가 시작됩니다. 표시된 가격은 어제 종가 기준입니다.",
      isLive: false,
      showBanner: true,
    };
  }

  if (hour > 15 || (hour === 15 && minute >= 30)) {
    return {
      status: "CLOSED",
      label: "장 마감",
      description: "오늘 거래는 종료되었습니다. 표시된 가격은 오늘 종가입니다.",
      isLive: false,
      showBanner: true,
    };
  }

  return {
    status: "OPEN",
    label: "거래 중",
    description: "현재 실시간 거래가 진행 중입니다.",
    isLive: true,
    showBanner: false,
  };
}

export function isPreMarketDataPattern(data: {
  openPrice?: number;
  highPrice?: number;
  lowPrice?: number;
  closePrice?: number;
  changePrice?: number;
}): boolean {
  const { openPrice, highPrice, lowPrice, closePrice, changePrice } = data;

  if (
    openPrice &&
    highPrice &&
    lowPrice &&
    closePrice &&
    openPrice === highPrice &&
    highPrice === lowPrice &&
    lowPrice === closePrice &&
    changePrice === 0
  ) {
    return true;
  }

  return false;
}
