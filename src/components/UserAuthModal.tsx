import React, { useState } from 'react';
import { UserProfile, TranslationDictionary } from '../types';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  t: TranslationDictionary;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onLoginSuccess({
      email,
      fullName: fullName || email.split('@')[0],
      role: 'customer'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-[#c0c0c0] border-2 border-black max-w-md w-full p-4 font-mono">
        <div className="bg-[#000080] text-white px-2 py-1 font-bold text-xs mb-3 flex justify-between items-center">
          <span>USER_AUTH.EXE</span>
          <button onClick={onClose} className="hover:bg-red-700 px-1">X</button>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-4 border-2 border-black">
          <h2 className="font-bold text-sm mb-3 border-b-2 border-black pb-1">MASUK / DAFTAR AKUN</h2>
          <div className="mb-2">
            <label className="block text-xs font-bold mb-1">Nama Lengkap:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border-2 border-black p-1 text-xs"
              placeholder="Ilyasviel"
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-bold mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-black p-1 text-xs"
              placeholder="user@mail.com"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-[#df551f] text-white font-bold py-1 border-2 border-black text-xs uppercase hover:bg-[#c44615]"
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black font-bold px-3 py-1 border-2 border-black text-xs uppercase"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
