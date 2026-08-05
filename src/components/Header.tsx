import React from 'react';
import { Language, ActiveModule, TranslationDictionary, UserProfile } from '../types';

interface HeaderProps {
  t: TranslationDictionary;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeModule: ActiveModule;
  onModuleChange: (module: ActiveModule) => void;
  cartCount: number;
  onOpenCart: () => void;
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenTrackOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onModuleChange,
  cartCount,
  onOpenCart,
  onOpenTrackOrder
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#c0c0c0] border-b-4 border-black p-2 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div
          onClick={() => onModuleChange('store')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="bg-[#000080] text-white p-1 font-bold text-lg border-2 border-black">
            [B]
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-widest uppercase">ILYASVIEL STORE</h1>
            <p className="text-[9px] text-gray-700 font-mono">RETRO COMPUTER STORE</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenTrackOrder}
            className="bg-[#008080] text-white font-bold px-2 py-1 text-xs border-2 border-black uppercase hover:bg-[#006666]"
          >
            Cek Resi
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="bg-[#df551f] text-white font-bold px-3 py-1 text-xs border-2 border-black uppercase flex items-center gap-1 hover:bg-[#c44615]"
          >
            <span>Keranjang</span>
            <span className="bg-black text-white px-1.5 rounded-full text-[10px]">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onLanguageChange(currentLang === 'id' ? 'en' : 'id')}
            className="bg-white text-black font-bold px-2 py-1 text-xs border-2 border-black uppercase"
          >
            {currentLang.toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
};
