import HeroSlider from '@/components/home/HeroSlider';
import SearchBar from '@/components/home/SearchBar';
import MarketIndices from '@/components/home/MarketIndices';
import ValueProposition from '@/components/home/ValueProposition';

const MobileAd = () => (
  <div className="lg:hidden bg-bg-subtle border border-dashed border-slate-300 rounded-xl p-3 text-center mb-3.5">
    <div className="text-[10px] text-slate-500 font-semibold mb-1">AD · 광고</div>
    <div className="text-xs text-slate-400 flex items-center justify-center" style={{ minHeight: '100px' }}>
      [ 320×100 ]
    </div>
  </div>
);

const PCBannerAd = () => (
  <div className="hidden lg:block bg-bg-subtle border border-dashed border-slate-300 rounded-xl p-3 text-center mb-3.5">
    <div className="text-[10px] text-slate-500 font-semibold mb-1">AD · 광고</div>
    <div className="text-xs text-slate-400 flex items-center justify-center" style={{ minHeight: '90px' }}>
      [ 728×90 ]
    </div>
  </div>
);

export default function HomePage() {
  return (
    <>
      <MobileAd />
      <PCBannerAd />
      
      <HeroSlider />

      <SearchBar />

      <MobileAd />
      <PCBannerAd />

      <MarketIndices />

      <ValueProposition />

      <MobileAd />

      <div className="text-[11px] text-gray-500 text-center py-3.5 leading-relaxed">
        본 정보는 참고용이며, 투자 자문이 아닙니다.<br/>
        모든 투자 판단과 결과는 본인 책임입니다.
      </div>
    </>
  );
}
