import React from 'react';
import { Language } from '../types';

interface FooterProps {
  currentLang: Language;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  return (
    <footer className="bg-[#0a192f] text-[#74829d] w-full py-1 px-2.5 sm:px-4 flex flex-row justify-between items-center border-t-2 border-black z-40 fixed bottom-0 left-0 right-0 h-7 text-[10px] sm:text-xs font-mono-retro">
      <div className="font-bold text-[#e4e2e4] truncate max-w-[60%] sm:max-w-none">
        © 1995-2026 ILYASVIEL CORP. {currentLang === 'id' ? 'HAK CIPTA DILINDUNGI.' : 'ALL RIGHTS RESERVED.'}
      </div>
      <div className="flex gap-2 sm:gap-4 shrink-0 text-[10px] sm:text-xs">
        <a className="text-[#e4e2e4] opacity-80 hover:text-[#ffb59d] transition-colors" href="#privacy">
          {currentLang === 'id' ? 'Privasi' : 'Privacy'}
        </a>
        <a className="text-[#e4e2e4] opacity-80 hover:text-[#ffb59d] transition-colors" href="#terms">
          {currentLang === 'id' ? 'Ketentuan' : 'Terms'}
        </a>
        <a className="text-[#e4e2e4] opacity-80 hover:text-[#ffb59d] transition-colors" href="#bbs">
          {currentLang === 'id' ? 'BBS Support' : 'BBS Support'}
        </a>
      </div>
    </footer>
  );
};
