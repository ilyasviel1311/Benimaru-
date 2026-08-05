import React from 'react';
import { TranslationDictionary } from '../types';

interface FooterProps {
  t: TranslationDictionary;
}

export const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="bg-[#c0c0c0] border-t-4 border-black p-4 text-center font-mono text-xs mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 1995-2026 ILYASVIEL CORP. HAK CIPTA DILINDUNGI.</p>
        <div className="flex gap-4 text-gray-700">
          <span>Privasi</span>
          <span>Ketentuan</span>
          <span>BBS Support</span>
        </div>
      </div>
    </footer>
  );
};
