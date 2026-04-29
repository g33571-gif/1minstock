// components/common/MarketStatusBanner.tsx
"use client";

import { MarketStatusInfo } from "@/lib/marketStatus";

interface MarketStatusBannerProps {
  statusInfo: MarketStatusInfo;
}

export default function MarketStatusBanner({ statusInfo }: MarketStatusBannerProps) {
  if (!statusInfo.showBanner) return null;

  const colors = getBannerColors(statusInfo.status);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${colors.bg} ${colors.border} mb-4`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-semibold ${colors.title}`}>
          {statusInfo.label}
        </div>
        <div className={`text-xs mt-0.5 ${colors.text}`}>
          {statusInfo.description}
        </div>
      </div>
    </div>
  );
}

function getBannerColors(status: string) {
  switch (status) {
    case "PRE_OPEN":
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        dot: "bg-blue-500",
        title: "text-blue-900",
        text: "text-blue-700",
      };
    case "CLOSED":
      return {
        bg: "bg-gray-50",
        border: "border-gray-200",
        dot: "bg-gray-400",
        title: "text-gray-900",
        text: "text-gray-600",
      };
    case "WEEKEND":
    case "HOLIDAY":
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        dot: "bg-amber-500",
        title: "text-amber-900",
        text: "text-amber-700",
      };
    default:
      return {
        bg: "bg-gray-50",
        border: "border-gray-200",
        dot: "bg-gray-400",
        title: "text-gray-900",
        text: "text-gray-600",
      };
  }
}
