import React from 'react';
import { Language, ActiveModule } from '../types';

interface SidebarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenUpgradeModal: () => void;
  onModuleChange: (module: ActiveModule) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentLang,
  onLanguageChange,
  selectedCategory,
  onSelectCategory,
  onOpenUpgradeModal,
  onModuleChange
}) => {
  return (
    <nav id="side-navbar" className="bg-[#343536] text-[#e4e2e4] hidden md:flex flex-col h-[calc(100vh-76px)] fixed left-0 top-[76px] z-40 w-64 border-r-4 border-black">
      {/* OS Branding Box */}
      <div className="p-4 border-b-4 border-black flex flex-col items-center bg-[#1f1f21]">
        <div className="relative mb-2 p-1 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3H18L21 6V21H3V3Z" fill="#F4F1DE" stroke="black" strokeWidth="2"/>
            <rect x="6" y="3" width="9" height="8" fill="#00A896" stroke="black" strokeWidth="1.5"/>
            <rect x="7" y="14" width="10" height="7" fill="#df551f" stroke="black" strokeWidth="1.5"/>
            <rect x="11" y="16" width="2" height="3" fill="black"/>
          </svg>
        </div>
        <h2 className="text-xl font-space-retro font-bold text-white tracking-wide">SYSTEM 95 v2.0</h2>
        <p className="text-xs font-mono-retro opacity-80 text-[#c5c6cd]">
          {currentLang === 'id' ? 'Pengguna: Tamu' : 'User: Guest'} | {currentLang.toUpperCase()} Mode
        </p>
      </div>

      {/* Module Navigation Banner */}
      <div className="p-2 border-b-2 border-black bg-[#1b1b1d] flex flex-col gap-1.5">
        <button
          id="btn-sidebar-pos"
          onClick={() => onModuleChange('pos')}
          className="retro-button w-full p-2 font-mono-retro text-xs font-bold text-white bg-[#df551f] hover:bg-[#c44615] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">point_of_sale</span>
          <span>{currentLang === 'id' ? '📟 Buka Kasir iPad POS' : '📟 Open iPad POS'}</span>
        </button>
        <button
          id="btn-sidebar-admin"
          onClick={() => onModuleChange('admin')}
          className="retro-button w-full p-2 font-mono-retro text-xs font-bold text-white bg-[#6e4f9b] hover:bg-[#583d80] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">dashboard</span>
          <span>{currentLang === 'id' ? '📊 Dashboard Admin' : '📊 Admin Dashboard'}</span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-grow p-2 flex flex-col gap-1 overflow-y-auto">
        <button
          onClick={() => onSelectCategory('all')}
          className={`text-left m-1 font-mono-retro text-sm flex items-center gap-3 p-2 border-2 ${
            selectedCategory === 'all'
              ? 'bg-[#4a4a3c] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold'
              : 'border-transparent text-[#c5c6cd] hover:bg-[#4a4a3c] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">desktop_windows</span>
          <span>{currentLang === 'id' ? 'Semua Katalog' : 'Desktop View'}</span>
        </button>

        <button
          onClick={() => onSelectCategory('laptop')}
          className={`text-left m-1 font-mono-retro text-sm flex items-center gap-3 p-2 border-2 ${
            selectedCategory === 'laptop'
              ? 'bg-[#4a4a3c] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold'
              : 'border-transparent text-[#c5c6cd] hover:bg-[#4a4a3c] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">laptop</span>
          <span>{currentLang === 'id' ? 'Laptop Retro' : 'Laptops'}</span>
        </button>

        <button
          onClick={() => onSelectCategory('phone')}
          className={`text-left m-1 font-mono-retro text-sm flex items-center gap-3 p-2 border-2 ${
            selectedCategory === 'phone'
              ? 'bg-[#4a4a3c] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold'
              : 'border-transparent text-[#c5c6cd] hover:bg-[#4a4a3c] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">call</span>
          <span>{currentLang === 'id' ? 'Handphone Klasik' : 'Classic Phones'}</span>
        </button>

        <button
          onClick={() => onSelectCategory('acc')}
          className={`text-left m-1 font-mono-retro text-sm flex items-center gap-3 p-2 border-2 ${
            selectedCategory === 'acc'
              ? 'bg-[#4a4a3c] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold'
              : 'border-transparent text-[#c5c6cd] hover:bg-[#4a4a3c] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">keyboard</span>
          <span>{currentLang === 'id' ? 'Aksesori & Peripheral' : 'Accessories'}</span>
        </button>

        <button
          onClick={onOpenUpgradeModal}
          className="retro-button mt-4 p-2 text-xs font-mono-retro font-bold mx-2 text-black bg-[#F4F1DE] hover:bg-[#ffb59d]"
        >
          {currentLang === 'id' ? '⚡ Tingkatkan OS 95' : '⚡ Upgrade OS'}
        </button>
      </div>

      <div className="p-2 border-t-4 border-black bg-[#1b1b1d]">
        <button
          onClick={() => alert(currentLang === 'id' ? 'Sistem Ilyasviel Store 95 tetap aktif!' : 'Ilyasviel Store 95 System remains active!')}
          className="w-full text-left text-[#c5c6cd] hover:bg-[#832600] hover:text-white text-xs font-mono-retro flex items-center gap-3 p-2 border-2 border-transparent"
        >
          <span className="material-symbols-outlined text-base">power_settings_new</span>
          <span>{currentLang === 'id' ? 'Matikan Sistem' : 'Shut Down'}</span>
        </button>
      </div>
    </nav>
  );
};
