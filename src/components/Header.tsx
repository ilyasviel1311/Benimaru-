import React from 'react';
import { Language, TranslationDictionary, ActiveModule, UserProfile } from '../types';

interface HeaderProps {
  t: TranslationDictionary;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeModule: ActiveModule;
  onModuleChange: (module: ActiveModule) => void;
  cartCount: number;
  onOpenCart: () => void;
  userProfile?: UserProfile | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onOpenTrackOrder?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  t,
  currentLang,
  onLanguageChange,
  activeModule,
  onModuleChange,
  cartCount,
  onOpenCart,
  userProfile,
  onOpenAuth,
  onLogout,
  onOpenTrackOrder
}) => {
  return (
    <header id="main-header" className="fixed top-0 left-0 right-0 z-50 w-full font-mono-retro shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      {/* BARIS 1: DEV MODULE SWITCHER (PALING ATAS) */}
      <div className="bg-[#000000] text-[#c5c6cd] border-b border-black px-2 sm:px-4 py-1 flex justify-between items-center w-full text-xs gap-1 flex-wrap sm:flex-nowrap">
        {/* Module Switcher Tabs */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            id="btn-nav-store"
            type="button"
            onClick={() => onModuleChange('store')}
            className={`px-2 py-0.5 font-bold transition-all border border-black flex items-center gap-1 text-[11px] ${
              activeModule === 'store'
                ? 'bg-[#00A896] text-white border-white'
                : 'bg-[#1b1b1d] text-[#c5c6cd] hover:bg-[#343536] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xs">language</span>
            <span className="hidden sm:inline">{currentLang === 'id' ? '[ WEBSITE STORE ]' : '[ WEBSITE STORE ]'}</span>
            <span className="sm:hidden">STORE</span>
          </button>
          <button
            id="btn-nav-pos"
            type="button"
            onClick={() => onModuleChange('pos')}
            className={`px-2 py-0.5 font-bold transition-all border border-black flex items-center gap-1 text-[11px] ${
              activeModule === 'pos'
                ? 'bg-[#df551f] text-white border-white'
                : 'bg-[#1b1b1d] text-[#c5c6cd] hover:bg-[#343536] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xs">point_of_sale</span>
            <span className="hidden sm:inline">{currentLang === 'id' ? '[ KASIR POS ]' : '[ POS CASHIER ]'}</span>
            <span className="sm:hidden">POS</span>
          </button>
          <button
            id="btn-nav-admin"
            type="button"
            onClick={() => onModuleChange('admin')}
            className={`px-2 py-0.5 font-bold transition-all border border-black flex items-center gap-1 text-[11px] ${
              activeModule === 'admin'
                ? 'bg-[#6e4f9b] text-white border-white'
                : 'bg-[#1b1b1d] text-[#c5c6cd] hover:bg-[#343536] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xs">analytics</span>
            <span className="hidden sm:inline">{currentLang === 'id' ? '[ ADMIN ]' : '[ ADMIN ]'}</span>
            <span className="sm:hidden">ADMIN</span>
          </button>
        </div>

        {/* Right Info & Language Switcher */}
        <div className="flex items-center gap-2 text-xs ml-auto shrink-0">
          <div className="hidden lg:flex items-center gap-1 bg-[#ffb59d] text-[#390c00] px-2 py-0.5 font-bold text-[10px] animate-pulse border border-black">
            <span className="material-symbols-outlined text-[12px]">flash_on</span>
            <span>{currentLang === 'id' ? 'DISKON RETRO 50%' : 'FLASH SALE 50% OFF'}</span>
          </div>

          {/* DYNAMIC LANGUAGE SWITCHER */}
          <div className="p-0.5 flex items-center bg-[#F4F1DE] border border-black text-black shrink-0">
            <span className="px-1 text-[10px] font-bold uppercase hidden sm:inline">LANG:</span>
            <div className="flex gap-0.5 text-[10px]">
              <button
                id="btn-lang-id"
                type="button"
                onClick={() => onLanguageChange('id')}
                className={`px-1.5 py-0.2 font-bold transition-all border border-black ${
                  currentLang === 'id'
                    ? 'bg-[#df551f] text-white'
                    : 'bg-[#e6e3d0] text-black hover:bg-[#00A896] hover:text-white'
                }`}
                title="Bahasa Indonesia"
              >
                ID
              </button>
              <button
                id="btn-lang-en"
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 py-0.2 font-bold transition-all border border-black ${
                  currentLang === 'en'
                    ? 'bg-[#df551f] text-white'
                    : 'bg-[#e6e3d0] text-black hover:bg-[#00A896] hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BARIS 2: HEADER UTAMA WEBSITE TOKO */}
      <div className="bg-[#0a192f] text-white border-b-4 border-black px-2 sm:px-4 py-1.5 flex justify-between items-center w-full min-h-[44px]">
        {/* SISI KIRI: Logo/Nama Toko */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <img
            src="/src/assets/images/taro_retro_mascot_1785837638158.jpg"
            alt="Taro Retro Mascot"
            referrerPolicy="no-referrer"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded border border-black shadow-[1px_1px_0px_#000] object-cover"
          />
          <span className="text-xs sm:text-lg font-bold text-[#e4e2e4] font-space-retro tracking-tight flex items-center whitespace-nowrap">
            <span>{t.site_title}</span>
          </span>
        </div>

        {/* SISI KANAN: Tombol [ CEK RESI ] [ AKUN ] [ KERANJANG ] */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Cek Resi */}
          {onOpenTrackOrder && (
            <button
              id="btn-header-track"
              type="button"
              onClick={onOpenTrackOrder}
              className="retro-button px-1.5 py-0.5 sm:px-2 sm:py-1 bg-[#00A896] hover:bg-[#008f80] text-white font-bold text-[10px] sm:text-xs flex items-center gap-0.5 sm:gap-1 shrink-0"
              title="Pelacakan Pesanan & Garansi Digital"
            >
              <span className="material-symbols-outlined text-xs sm:text-sm">local_shipping</span>
              <span className="hidden sm:inline">{currentLang === 'id' ? '[ CEK RESI ]' : '[ TRACK ORDER ]'}</span>
              <span className="sm:hidden">Resi</span>
            </button>
          )}

          {/* User Account / Auth Button */}
          {userProfile ? (
            <div className="flex items-center gap-0.5 sm:gap-1 bg-[#F4F1DE] border border-black sm:border-2 p-0.5 text-black font-bold text-[10px] sm:text-xs shrink-0">
              <span className="material-symbols-outlined text-xs sm:text-sm">person</span>
              <span className="px-0.5 sm:px-1 max-w-[55px] sm:max-w-[130px] truncate">
                {userProfile.fullName.split(' ')[0]}
              </span>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-1 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase border border-black"
                  title="Keluar / Logout"
                >
                  OUT
                </button>
              )}
            </div>
          ) : (
            onOpenAuth && (
              <button
                id="btn-header-auth"
                type="button"
                onClick={onOpenAuth}
                className="retro-button px-1.5 py-0.5 sm:px-2 sm:py-1 bg-[#df551f] hover:bg-[#c44615] text-white font-bold text-[10px] sm:text-xs flex items-center gap-0.5 sm:gap-1 shrink-0"
                title="Masuk / Daftar Akun Pembeli"
              >
                <span className="material-symbols-outlined text-xs sm:text-sm">person</span>
                <span className="hidden sm:inline">{currentLang === 'id' ? '[ MASUK / DAFTAR ]' : '[ LOGIN / REGISTER ]'}</span>
                <span className="sm:hidden">Akun</span>
              </button>
            )
          )}

          {/* Cart Button */}
          <button
            id="btn-header-cart"
            type="button"
            onClick={onOpenCart}
            className="retro-button px-1.5 py-0.5 sm:px-2 sm:py-1 bg-[#F4F1DE] hover:bg-[#832600] hover:text-white text-black font-bold text-[10px] sm:text-xs flex items-center gap-0.5 sm:gap-1 shrink-0"
            title="Keranjang Belanja"
          >
            <span className="material-symbols-outlined text-xs sm:text-sm">shopping_cart</span>
            <span className="hidden sm:inline">{currentLang === 'id' ? 'Keranjang' : 'Cart'} ({cartCount})</span>
            <span className="sm:hidden">({cartCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
