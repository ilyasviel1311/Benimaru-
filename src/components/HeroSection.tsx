import React from 'react';
import { TranslationDictionary } from '../types';

interface HeroSectionProps {
  t: TranslationDictionary;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ t, onExploreClick }) => {
  return (
    <section id="hero" className="retro-window mb-8 max-w-4xl mx-auto text-[#000000]">
      {/* Title Bar */}
      <div className="retro-titlebar px-3 py-1.5 flex justify-between items-center text-white select-none">
        <div className="flex items-center gap-2 font-mono-retro font-bold text-xs">
          <span className="material-symbols-outlined text-sm">terminal</span>
          <span>C:\ILYASVIEL\HERO.EXE</span>
        </div>
        <div className="flex gap-1 font-mono-retro">
          <button className="border-2 border-black bg-[#c0c0c0] text-black px-1.5 text-xs font-bold leading-none hover:bg-white focus:outline-none shadow-[1px_1px_0px_#000]">_</button>
          <button className="border-2 border-black bg-[#c0c0c0] text-black px-1.5 text-xs font-bold leading-none hover:bg-white focus:outline-none shadow-[1px_1px_0px_#000]">□</button>
          <button className="border-2 border-black bg-[#c0c0c0] text-black px-1.5 text-xs font-bold leading-none hover:bg-white focus:outline-none shadow-[1px_1px_0px_#000]">X</button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 md:p-12 text-center flex flex-col items-center justify-center min-h-[280px] border-t-2 border-white border-l-2 border-white bg-[#F4F1DE] relative overflow-hidden">
        {/* Subtle retro Grid Lines Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]"></div>
        
        <div className="inline-block bg-[#00A896] text-white text-xs font-mono-retro font-bold px-3 py-1 mb-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
          ILYASVIEL SYSTEM 95 HARDWARE ARCHIVE
        </div>

        <h1 id="hero-title" className="text-2xl sm:text-4xl md:text-5xl font-space-retro font-bold mb-4 uppercase tracking-tight leading-tight text-black">
          {t.hero_title}
        </h1>

        <p className="text-sm sm:text-base md:text-lg font-work-retro mb-8 max-w-xl text-[#1c1c11]">
          {t.hero_title === "SUASANA RETRO, TEKNOLOGI MODERN"
            ? "Tingkatkan gaya hidup digital Anda dengan koleksi perangkat keras klasik bernuansa vintage terbaik dari tahun 90-an."
            : "Upgrade your digital lifestyle with our curated selection of vintage-inspired 90s hardware."}
        </p>

        <button
          id="btn-explore"
          onClick={onExploreClick}
          className="retro-button retro-button-orange px-6 sm:px-8 py-3 text-sm sm:text-base md:text-lg font-space-retro uppercase font-bold text-white tracking-wider flex items-center justify-center gap-2 whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-102 transition-transform"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">explore</span>
          <span>{t.btn_explore}</span>
        </button>
      </div>
    </section>
  );
};
