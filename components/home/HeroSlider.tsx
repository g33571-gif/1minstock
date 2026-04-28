'use client';

import { useState, useEffect } from 'react';

interface Slide {
  badge: string;
  title: string;
  subtitle: string;
  bg: string;
  accent: string;
  graphic: 'chart' | 'bars' | 'warning' | 'gem';
}

const slides: Slide[] = [
  {
    badge: '🌐 시장의 큰손',
    title: '외국인은\n사고 있을까?',
    subtitle: '5일 누적 매매와 보유율까지\n외국인 동향 한 화면에',
    bg: 'linear-gradient(135deg, #047857, #059669)',
    accent: '#F59E0B',
    graphic: 'chart',
  },
  {
    badge: '📈 손익 한눈에',
    title: '매출과 이익\n어떻게 변했지?',
    subtitle: '매출, 영업이익, 순이익까지\n전년 대비 한 카드에',
    bg: 'linear-gradient(135deg, #1E3A8A, #1E40AF)',
    accent: '#FCA5A5',
    graphic: 'bars',
  },
  {
    badge: '⚠ 위험 신호',
    title: '이 종목,\n안전한가요?',
    subtitle: '관리/환기/거래정지 자동 감지\n위험 신호 한 화면에',
    bg: 'linear-gradient(135deg, #7F1D1D, #991B1B)',
    accent: '#FCD34D',
    graphic: 'warning',
  },
  {
    badge: '💎 핵심 지표',
    title: '저평가일까,\n고평가일까?',
    subtitle: 'PER, PBR, ROE까지\n가치 평가 한 카드에',
    bg: 'linear-gradient(135deg, #4C1D95, #5B21B6)',
    accent: '#FCD34D',
    graphic: 'gem',
  },
];

function SlideGraphic({ type }: { type: string }) {
  if (type === 'chart') {
    return (
      <div className="absolute top-4 right-4 opacity-20" style={{ width: '140px', height: '90px' }}>
        <svg width="140" height="90" viewBox="0 0 140 90">
          <polyline points="0,70 25,50 50,55 75,25 100,35 125,15 140,5" stroke="#F59E0B" strokeWidth="3" fill="none"/>
          <polyline points="0,80 25,65 50,70 75,50 100,55 125,40 140,30" stroke="white" strokeWidth="2" fill="none" opacity="0.5"/>
        </svg>
      </div>
    );
  }
  
  if (type === 'bars') {
    return (
      <div className="absolute bottom-0 right-4 flex items-end gap-1.5 opacity-30">
        <div style={{ width: '20px', height: '40px', background: '#DC2626', borderRadius: '4px 4px 0 0' }}/>
        <div style={{ width: '20px', height: '60px', background: '#DC2626', borderRadius: '4px 4px 0 0' }}/>
        <div style={{ width: '20px', height: '85px', background: '#DC2626', borderRadius: '4px 4px 0 0' }}/>
        <div style={{ width: '20px', height: '110px', background: '#DC2626', borderRadius: '4px 4px 0 0' }}/>
      </div>
    );
  }
  
  if (type === 'warning') {
    return (
      <div className="absolute top-2 right-4 opacity-10" style={{ fontSize: '180px', lineHeight: '1' }}>
        ⚠
      </div>
    );
  }
  
  if (type === 'gem') {
    return (
      <div className="absolute bottom-4 right-4 opacity-25">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <polygon points="50,10 80,35 50,90 20,35" fill="#A78BFA" stroke="#FCD34D" strokeWidth="2"/>
          <line x1="20" y1="35" x2="80" y2="35" stroke="#FCD34D" strokeWidth="2"/>
          <line x1="50" y1="10" x2="50" y2="35" stroke="#FCD34D" strokeWidth="1"/>
        </svg>
      </div>
    );
  }
  
  return null;
}

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  const slide = slides[currentIndex];
  
  return (
    <div className="mb-3">
      <div 
        className="rounded-3xl px-7 py-9 text-white relative overflow-hidden transition-all duration-700"
        style={{ 
          background: slide.bg,
          minHeight: '230px',
        }}
      >
        <SlideGraphic type={slide.graphic} />
        
        <div className="relative z-10">
          <div className="inline-block text-[11px] px-3 py-1 bg-white/[0.18] rounded-full mb-3.5 font-medium tracking-wider">
            {slide.badge}
          </div>
          
          <div 
            className="text-[26px] font-semibold leading-tight tracking-tight mb-3.5 whitespace-pre-line"
            style={{ color: slide.accent }}
          >
            {slide.title}
          </div>
          
          <div className="text-sm opacity-90 leading-relaxed whitespace-pre-line">
            {slide.subtitle}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-1.5 mt-4 mb-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="transition-all"
            style={{
              width: i === currentIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '999px',
              background: i === currentIndex ? '#047857' : '#D1D5DB',
            }}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
