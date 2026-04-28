import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 1MINSTOCK 시그니처 색상
      colors: {
        // 메인 (그린)
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          500: '#10B981',
          600: '#059669',
          700: '#047857',  // 메인 컬러
          800: '#065F46',
          900: '#064E3B',
        },
        // 액센트 (앰버 골드)
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',  // 메인 골드
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // 한국식 색상 (절대 변경 X)
        korean: {
          up: '#DC2626',     // 빨강 = 상승/매수
          down: '#1E40AF',   // 파랑 = 하락/매도
          upBg: '#FEF2F2',
          downBg: '#EFF6FF',
        },
        // 배경 & 텍스트
        bg: {
          page: '#F8FAFB',
          card: '#FFFFFF',
          subtle: '#F1F5F9',
        },
        text: {
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#6B7280',
          light: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'sans-serif',
        ],
      },
      fontSize: {
        // 1MINSTOCK 타이포그래피
        'label': ['12px', { lineHeight: '1.5', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.6' }],
        'body-lg': ['15px', { lineHeight: '1.7' }],
        'title': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'price': ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        'price-xl': ['48px', { lineHeight: '1.1', fontWeight: '600', letterSpacing: '-0.03em' }],
      },
      borderRadius: {
        'card': '20px',
        'card-sm': '14px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(4, 120, 87, 0.06)',
        'card-hover': '0 4px 16px rgba(4, 120, 87, 0.08)',
      },
      animation: {
        'slide-show': 'slideShow 16s infinite',
        'dot-active': 'dotActive 16s infinite',
      },
      keyframes: {
        slideShow: {
          '0%': { opacity: '0' },
          '2%': { opacity: '1' },
          '23%': { opacity: '1' },
          '25%': { opacity: '0' },
          '100%': { opacity: '0' },
        },
        dotActive: {
          '0%': { backgroundColor: '#D1D5DB', width: '8px', borderRadius: '50%' },
          '2%': { backgroundColor: '#047857', width: '24px', borderRadius: '4px' },
          '23%': { backgroundColor: '#047857', width: '24px', borderRadius: '4px' },
          '25%': { backgroundColor: '#D1D5DB', width: '8px', borderRadius: '50%' },
          '100%': { backgroundColor: '#D1D5DB', width: '8px', borderRadius: '50%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
