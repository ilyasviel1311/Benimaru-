import React, { useState } from 'react';
import { Language, UserProfile } from '../types';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  userProfile?: UserProfile | null;
  onLoginSuccess: (profile: UserProfile, isNewRegister?: boolean) => void;
  onLogout?: () => void;
  onTrackOrderWithResi?: (resi: string) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  userProfile,
  onLoginSuccess,
  onLogout,
  onTrackOrderWithResi
}) => {
  useBodyScrollLock(isOpen);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('081298765432');
  const [loginPassword, setLoginPassword] = useState('••••••••');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) return;

    const mockProfile: UserProfile = {
      fullName: loginIdentifier.includes('@') ? 'Budi Santoso' : 'Budi Santoso',
      phone: loginIdentifier.includes('@') ? '0812-3456-7890' : loginIdentifier,
      email: loginIdentifier.includes('@') ? loginIdentifier : 'budi.member@ilyasviel95.id'
    };

    onLoginSuccess(mockProfile, false);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regPhone.trim()) return;

    const newProfile: UserProfile = {
      fullName: regFullName,
      phone: regPhone,
      email: regEmail || `${regPhone}@ilyasviel95.id`
    };

    onLoginSuccess(newProfile, true);
  };

  // Mock buyer order history
  const buyerOrders = [
    {
      inv: 'INV-950821',
      date: '03 Aug 2026',
      product: 'ThinkBrick 2000 Retro Laptop (Pro Edition)',
      qty: 1,
      total: 'Rp 4.500.000',
      resi: 'JNE-95082101',
      status: currentLang === 'id' ? 'DALAM PENGIRIMAN (75%)' : 'IN TRANSIT (75%)',
      statusColor: 'bg-[#df551f] text-white'
    },
    {
      inv: 'INV-950715',
      date: '15 Jul 2026',
      product: 'SoundBlaster 16 Retro Audio Card',
      qty: 2,
      total: 'Rp 1.700.000',
      resi: 'JNE-95071588',
      status: currentLang === 'id' ? 'SELESAI / TERIMA (100%)' : 'DELIVERED (100%)',
      statusColor: 'bg-[#00A896] text-white'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 modal-backdrop overscroll-contain">
      <div className="retro-window max-w-lg w-full bg-[#F4F1DE] text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-mono-retro max-h-[85vh] overflow-y-auto touch-scroll overscroll-contain my-auto">
        {/* Titlebar */}
        <div className="retro-titlebar bg-[#00A896] text-white p-2 flex justify-between items-center text-xs font-bold border-b-2 border-black sticky top-0 z-10">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">badge</span>
            <span>C:\ILYASVIEL\USER_AUTH.EXE</span>
          </div>
          <button
            onClick={onClose}
            className="w-5 h-5 bg-gray-200 text-black border border-black flex items-center justify-center text-xs font-bold hover:bg-white"
          >
            X
          </button>
        </div>

        {/* LOGGED IN USER PROFILE & ORDER HISTORY */}
        {userProfile ? (
          <div className="p-4 flex flex-col gap-4">
            {/* User Profile Card */}
            <div className="bg-[#1b1b1d] text-white p-3 border-2 border-black shadow-[3px_3px_0px_#000] flex justify-between items-center gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00A896] border-2 border-black text-white font-bold flex items-center justify-center text-lg">
                  <span className="material-symbols-outlined text-xl">person</span>
                </div>
                <div>
                  <h3 className="font-space-retro font-extrabold text-sm text-[#F4F1DE]">
                    {userProfile.fullName}
                  </h3>
                  <p className="text-[11px] text-[#c5c6cd]">
                    {userProfile.phone} • {userProfile.email}
                  </p>
                  <span className="bg-[#df551f] text-white text-[9px] font-bold px-1.5 py-0.5 border border-black mt-1 inline-block">
                    MEMBER PLATINUM VIP 95
                  </span>
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                  }}
                  className="retro-button bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 text-xs font-bold uppercase shrink-0 border border-black flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  <span>LOGOUT</span>
                </button>
              )}
            </div>

            {/* Order History Section */}
            <div className="bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000]">
              <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
                <h4 className="font-bold text-xs uppercase text-black flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-[#df551f]">receipt_long</span>
                  <span>RIWAYAT BELANJA & RESI PESANAN</span>
                </h4>
                <span className="text-[10px] bg-black text-white px-1.5 py-0.5 font-bold">
                  {buyerOrders.length} PESANAN
                </span>
              </div>

              <div className="space-y-3">
                {buyerOrders.map((order) => (
                  <div key={order.inv} className="bg-[#F4F1DE] p-2.5 border-2 border-black text-xs flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b border-black pb-1.5">
                      <div>
                        <span className="font-extrabold text-black">#{order.inv}</span>
                        <span className="text-gray-600 text-[10px] ml-2">({order.date})</span>
                      </div>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 border border-black ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className="font-bold text-black">{order.product} (x{order.qty})</p>
                        <p className="text-[11px] text-[#df551f] font-bold mt-0.5">{order.total}</p>
                        <p className="text-[10px] text-gray-700 mt-0.5">
                          NO RESI JNE: <span className="font-bold font-mono bg-white px-1 border border-black">{order.resi}</span>
                        </p>
                      </div>

                      {/* DIRECT TRACK ORDER BUTTON */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onTrackOrderWithResi) {
                            onTrackOrderWithResi(order.resi);
                          }
                        }}
                        className="retro-button bg-[#00A896] hover:bg-[#008f80] text-white font-bold px-2.5 py-1.5 text-xs uppercase flex items-center gap-1 shrink-0 shadow-[2px_2px_0px_#000]"
                        title="Buka TRACK_ORDER.EXE dengan resi ini"
                      >
                        <span className="material-symbols-outlined text-sm">local_shipping</span>
                        <span>[ LACAK PAKET ]</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* UNAUTHENTICATED FORM (LOGIN & REGISTER) */
          <>
            {/* Header Banner */}
            <div className="p-3 bg-[#e6e3d0] border-b-2 border-black text-center">
              <h3 className="font-space-retro font-extrabold text-sm text-black flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-base text-[#df551f]">lock</span>
                <span>
                  {currentLang === 'id' ? 'AKUN PELANGGAN ILYASVIEL 95' : 'ILYASVIEL 95 USER ACCOUNT'}
                </span>
              </h3>
              <p className="text-[11px] text-gray-700 mt-0.5">
                {currentLang === 'id'
                  ? 'Masuk atau daftar untuk kemudahan checkout dan pelacakan garansi digital'
                  : 'Sign in or register for faster checkout and digital warranty tracking'}
              </p>
            </div>

            {/* Retro Tab Switcher */}
            <div className="flex border-b-2 border-black bg-black p-1 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 font-bold text-xs uppercase transition-all flex items-center justify-center gap-1 border border-black ${
                  activeTab === 'login'
                    ? 'bg-[#df551f] text-white shadow-[inset_1px_1px_0px_rgba(0,0,0,0.5)]'
                    : 'bg-[#1b1b1d] text-[#c5c6cd] hover:bg-[#343536] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">lock_open</span>
                <span>{currentLang === 'id' ? 'TAB MASUK (LOGIN)' : 'SIGN IN'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2 font-bold text-xs uppercase transition-all flex items-center justify-center gap-1 border border-black ${
                  activeTab === 'register'
                    ? 'bg-[#00A896] text-white shadow-[inset_1px_1px_0px_rgba(0,0,0,0.5)]'
                    : 'bg-[#1b1b1d] text-[#c5c6cd] hover:bg-[#343536] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">edit_note</span>
                <span>{currentLang === 'id' ? 'TAB DAFTAR (REGISTER)' : 'REGISTER'}</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 bg-[#F4F1DE]">
              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1 text-black">
                      {currentLang === 'id' ? 'NOMOR HP / EMAIL:' : 'PHONE NUMBER / EMAIL:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={currentLang === 'id' ? 'Contoh: 08123456789 atau user@gmail.com' : 'E.g. 08123456789 or user@gmail.com'}
                      className="retro-input w-full p-2 text-xs font-bold bg-white border-2 border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1 text-black">
                      {currentLang === 'id' ? 'PASSWORD AKUN:' : 'ACCOUNT PASSWORD:'}
                    </label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="retro-input w-full p-2 text-xs font-bold bg-white border-2 border-black"
                    />
                  </div>

                  <div className="p-2 bg-[#e6e3d0] border border-black text-[11px] text-gray-700 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#00A896]">info</span>
                    <span>{currentLang === 'id' ? 'Akun demo terverifikasi otomatis dengan data simulasi.' : 'Demo account automatically logs in with simulated profile.'}</span>
                  </div>

                  <button
                    type="submit"
                    className="retro-button bg-[#df551f] hover:bg-[#c44615] text-white font-bold py-3 px-4 text-xs uppercase flex items-center justify-center gap-2 mt-2"
                  >
                    <span className="material-symbols-outlined text-sm">lock_open</span>
                    <span>{currentLang === 'id' ? '[ MASUK AKUN ]' : '[ SIGN IN ACCOUNT ]'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1 text-black">
                      {currentLang === 'id' ? 'NAMA LENGKAP:' : 'FULL NAME:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder={currentLang === 'id' ? 'Contoh: Budi Santoso' : 'E.g. John Doe'}
                      className="retro-input w-full p-2 text-xs font-bold bg-white border-2 border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1 text-black">
                      {currentLang === 'id' ? 'NOMOR HP (WHATSAPP):' : 'PHONE NUMBER:'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="Contoh: 081298765432"
                      className="retro-input w-full p-2 text-xs font-bold bg-white border-2 border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1 text-black">
                      {currentLang === 'id' ? 'ALAMAT EMAIL (OPSIONAL):' : 'EMAIL ADDRESS (OPTIONAL):'}
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="budi@gmail.com"
                      className="retro-input w-full p-2 text-xs font-bold bg-white border-2 border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1 text-black">
                      {currentLang === 'id' ? 'BUAT PASSWORD:' : 'CREATE PASSWORD:'}
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="retro-input w-full p-2 text-xs font-bold bg-white border-2 border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="retro-button bg-[#00A896] hover:bg-[#008f80] text-white font-bold py-3 px-4 text-xs uppercase flex items-center justify-center gap-2 mt-2"
                  >
                    <span className="material-symbols-outlined text-sm">edit_note</span>
                    <span>{currentLang === 'id' ? '[ DAFTAR AKUN BARU ]' : '[ REGISTER NEW ACCOUNT ]'}</span>
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
