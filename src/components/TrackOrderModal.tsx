import React, { useState, useEffect } from 'react';
import { Language, TranslationDictionary } from '../types';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  t: TranslationDictionary;
  initialResi?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  initialResi = ''
}) => {
  useBodyScrollLock(isOpen);

  const [searchQuery, setSearchQuery] = useState('');
  const [trackResult, setTrackResult] = useState<{
    resi: string;
    courier: string;
    recipientName: string;
    destination: string;
    currentStatus: string;
    progressPercent: number;
    item: string;
    imei: string;
    warrantyExpiry: string;
    warrantyStatus: string;
    timeline: Array<{
      time: string;
      location: string;
      status: string;
      active?: boolean;
      done: boolean;
    }>;
  } | null>(null);

  const performSearch = (queryStr: string) => {
    if (!queryStr.trim()) return;

    const queryUpper = queryStr.trim().toUpperCase();
    const resiCode = queryUpper.startsWith('JNE') ? queryUpper : `JNE-95${Math.floor(10000000 + Math.random() * 90000000)}`;

    const isDelivered = queryUpper.includes('75') || queryUpper.includes('15') || queryUpper.includes('DELIVERED');
    const isNewOrder = queryUpper.includes('NEW') || queryUpper.includes('01');

    if (isDelivered) {
      setTrackResult({
        resi: resiCode,
        courier: 'JNE YES (Yakin Esok Sampai)',
        recipientName: 'Budi Santoso (Member Ilyasviel)',
        destination: 'Jakarta Barat, DKI Jakarta',
        currentStatus: currentLang === 'id'
          ? 'Paket telah sukses diterima oleh Budi Santoso (Ybs)'
          : 'Package successfully delivered to Budi Santoso',
        progressPercent: 100,
        item: 'SoundBlaster 16 Retro Audio Card (Dual System)',
        imei: `SB-1695-${Math.floor(100000 + Math.random() * 900000)}`,
        warrantyExpiry: '15 Juli 2027 (Garansi 12 Bulan Aktif)',
        warrantyStatus: currentLang === 'id' ? 'GARANSI AKTIF (12 BULAN)' : 'ACTIVE WARRANTY (12 MO)',
        timeline: [
          {
            time: '04 Aug 09:15 WIB',
            location: 'Alamat Penerima - Jakarta Barat',
            status: currentLang === 'id'
              ? 'Paket telah diterima oleh Budi Santoso. Terima kasih telah berbelanja di Ilyasviel Store!'
              : 'Package delivered & signed by recipient. Thank you for shopping!',
            active: true,
            done: true
          },
          {
            time: '04 Aug 07:00 WIB',
            location: 'JNE Express Area Jakarta Barat',
            status: currentLang === 'id'
              ? 'Kurir JNE (Agus R.) membawa paket menuju alamat penerima [OUT FOR DELIVERY]'
              : 'Courier out for delivery to recipient address',
            done: true
          },
          {
            time: '03 Aug 22:30 WIB',
            location: 'JNE Gateway Hub Central, Jakarta',
            status: currentLang === 'id'
              ? 'Paket disortir di Pusat Transit Jakarta & diteruskan ke cabang kurir'
              : 'Package sorted at Transit Hub & dispatched to local branch',
            done: true
          },
          {
            time: '03 Aug 18:00 WIB',
            location: 'Gudang Utama Ilyasviel Store',
            status: currentLang === 'id'
              ? 'Paket telah diserahterimakan ke Kurir JNE Express'
              : 'Package handed over to JNE Express Courier',
            done: true
          }
        ]
      });
    } else if (isNewOrder) {
      setTrackResult({
        resi: resiCode,
        courier: 'JNE REG (Reguler Service)',
        recipientName: 'Pelanggan Ilyasviel Store',
        destination: 'Bandung, Jawa Barat',
        currentStatus: currentLang === 'id'
          ? 'Pesanan sedang dipack di Gudang Ilyasviel Store'
          : 'Order currently packing at Ilyasviel Warehouse',
        progressPercent: 25,
        item: 'GameBoy Retro Color Edition (Yellow)',
        imei: `GB-9509-${Math.floor(100000 + Math.random() * 900000)}`,
        warrantyExpiry: '04 Agustus 2027 (Garansi 12 Bulan Aktif)',
        warrantyStatus: currentLang === 'id' ? 'GARANSI AKTIF (12 BULAN)' : 'ACTIVE WARRANTY (12 MO)',
        timeline: [
          {
            time: '04 Aug 10:00 WIB',
            location: 'Gudang Utama Ilyasviel Store',
            status: currentLang === 'id'
              ? 'Paket dikemas rapi dengan pelindung kardus retro & bubble wrap'
              : 'Package being packed with retro box protection',
            active: true,
            done: true
          },
          {
            time: '04 Aug 09:30 WIB',
            location: 'Ilyasviel System 95',
            status: currentLang === 'id'
              ? 'Pembayaran berhasil diverifikasi & Nomor Resi JNE Diterbitkan'
              : 'Payment verified & Tracking number issued',
            done: true
          }
        ]
      });
    } else {
      setTrackResult({
        resi: resiCode,
        courier: 'JNE YES (Yakin Esok Sampai)',
        recipientName: 'Pelanggan Ilyasviel Store',
        destination: 'Jakarta Barat, DKI Jakarta',
        currentStatus: currentLang === 'id'
          ? 'Kurir JNE sedang membawa paket ke alamat tujuan [OUT FOR DELIVERY]'
          : 'JNE Courier on the way to destination address [OUT FOR DELIVERY]',
        progressPercent: 75,
        item: 'ThinkBrick 2000 Retro Laptop (Pro Edition)',
        imei: `IL-950821-${Math.floor(100000 + Math.random() * 900000)}`,
        warrantyExpiry: '15 Agustus 2027 (Garansi 12 Bulan Resmi)',
        warrantyStatus: currentLang === 'id' ? 'GARANSI AKTIF (12 BULAN)' : 'ACTIVE WARRANTY (12 MO)',
        timeline: [
          {
            time: '04 Aug 08:30 WIB',
            location: 'JNE Express Area Jakarta Barat',
            status: currentLang === 'id'
              ? 'Kurir JNE (Agus R.) membawa paket menuju alamat penerima [OUT FOR DELIVERY]'
              : 'JNE Courier carrying package to destination address',
            active: true,
            done: true
          },
          {
            time: '04 Aug 02:15 WIB',
            location: 'JNE Gateway Hub Central, Jakarta',
            status: currentLang === 'id'
              ? 'Paket keluar dari Sorting Office Hub Pusat Jakarta'
              : 'Package departed Central Sorting Office Hub',
            done: true
          },
          {
            time: '03 Aug 21:00 WIB',
            location: 'JNE Drop Point Cengkareng',
            status: currentLang === 'id'
              ? 'Paket diterima kurir JNE & diproses manifest pengiriman YES'
              : 'Package received by JNE courier & manifest processed',
            done: true
          },
          {
            time: '03 Aug 20:12 WIB',
            location: 'Ilyasviel Central Warehouse',
            status: currentLang === 'id'
              ? 'Pembayaran terverifikasi & Nomor Resi JNE Diterbitkan'
              : 'Payment verified & JNE tracking code generated',
            done: true
          }
        ]
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      const targetQuery = initialResi || searchQuery || 'JNE-95082101';
      setSearchQuery(targetQuery);
      performSearch(targetQuery);
    }
  }, [isOpen, initialResi]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 modal-backdrop overscroll-contain">
      <div className="retro-window max-w-xl w-full bg-[#F4F1DE] text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-mono-retro max-h-[85vh] overflow-y-auto touch-scroll overscroll-contain my-auto">
        {/* Title Bar */}
        <div className="retro-titlebar bg-[#df551f] text-white p-2 flex justify-between items-center text-xs font-bold border-b-2 border-black sticky top-0 z-10">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">local_shipping</span>
            <span>C:\ILYASVIEL\TRACK_ORDER.EXE</span>
          </div>
          <button
            onClick={onClose}
            className="w-5 h-5 bg-gray-200 text-black border border-black flex items-center justify-center text-xs font-bold hover:bg-white"
          >
            X
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {/* Header Banner */}
          <div className="bg-[#1b1b1d] text-white p-3 border-2 border-black flex items-center gap-3 shadow-[2px_2px_0px_#000]">
            <span className="material-symbols-outlined text-3xl text-[#00A896]">verified_user</span>
            <div>
              <h3 className="font-space-retro font-extrabold text-sm uppercase text-[#F4F1DE]">
                PELACAKAN PESANAN & GARANSI DIGITAL
              </h3>
              <p className="text-[11px] text-[#c5c6cd]">
                System 95 JNE Logistics & Digital Warranty Center
              </p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-col gap-2 bg-white p-3 border-2 border-black shadow-[2px_2px_0px_#000]">
            <label className="text-xs font-bold text-black block">
              {currentLang === 'id'
                ? 'Masukkan Nomor Resi JNE atau ID Pesanan (Contoh: JNE-95082101 / #INV-9508):'
                : 'Enter JNE Tracking Code or Order ID (E.g. JNE-95082101 / #INV-9508):'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="JNE-95082101 atau #INV-9508"
                className="retro-input flex-grow p-2 text-xs font-bold bg-[#F4F1DE] border-2 border-black uppercase"
              />
              <button
                type="submit"
                className="retro-button bg-[#00A896] hover:bg-[#008f80] text-white font-bold px-4 py-2 text-xs uppercase flex items-center justify-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-sm">search</span>
                <span>{currentLang === 'id' ? 'LACAK PESANAN' : 'TRACK ORDER'}</span>
              </button>
            </div>
          </form>

          {/* Search Result */}
          {trackResult && (
            <div className="flex flex-col gap-3">
              {/* Retro Progress Bar Barometer */}
              <div className="bg-[#1b1b1d] p-3 border-2 border-black text-white shadow-[3px_3px_0px_#000]">
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="flex items-center gap-1.5 text-[#00A896]">
                    <span className="material-symbols-outlined text-base">alt_route</span>
                    <span>PROGRES PENGIRIMAN: {trackResult.progressPercent}%</span>
                  </span>
                  <span className="bg-[#df551f] text-white px-2 py-0.5 text-[10px] font-extrabold uppercase border border-black">
                    {trackResult.progressPercent === 100
                      ? '✓ SAMPAI'
                      : trackResult.progressPercent >= 75
                      ? '🚚 OUT FOR DELIVERY'
                      : '📦 IN TRANSIT'}
                  </span>
                </div>
                
                {/* Visual Progress Track */}
                <div className="w-full bg-[#343536] h-5 border-2 border-black p-0.5 relative">
                  <div
                    className="h-full bg-gradient-to-r from-[#00A896] via-[#f7b731] to-[#df551f] transition-all duration-500 flex items-center justify-end pr-1 text-[10px] text-black font-extrabold"
                    style={{ width: `${trackResult.progressPercent}%` }}
                  >
                    {trackResult.progressPercent}%
                  </div>
                </div>
              </div>

              {/* Status Header */}
              <div className="bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000]">
                <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-2">
                  <span className="font-bold text-xs text-[#df551f] flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#00A896]">check_circle</span>
                    <span>DATA PENGIRIMAN DITEMUKAN</span>
                  </span>
                  <span className="font-bold text-xs bg-black text-white px-2 py-0.5 border border-black">
                    RESI: {trackResult.resi}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-800 mb-2">
                  <div>
                    <span className="text-gray-500 font-bold block">KURIR PENGIRIM:</span>
                    <span className="font-bold">{trackResult.courier}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold block">TUJUAN PENGIRIMAN:</span>
                    <span className="font-bold">{trackResult.destination}</span>
                  </div>
                </div>

                <div className="bg-[#ffdbd0] p-2 border border-black text-xs font-bold text-[#350a00] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#df551f]">local_shipping</span>
                  <span>{trackResult.currentStatus}</span>
                </div>
              </div>

              {/* Shipping Timeline */}
              <div className="bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000]">
                <h4 className="font-bold text-xs uppercase text-black border-b border-black pb-1 mb-2.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#00A896]">route</span>
                  <span>TIMELINE PERJALANAN PAKET JNE (REAL-TIME)</span>
                </h4>
                <div className="space-y-2.5">
                  {trackResult.timeline.map((step, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-xs">
                      <div className="flex flex-col items-center">
                        <span className={`w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center border border-black ${
                          step.active ? 'bg-[#df551f] animate-pulse' : 'bg-[#00A896]'
                        }`}>
                          <span className="material-symbols-outlined text-xs">
                            {step.active ? 'my_location' : 'check'}
                          </span>
                        </span>
                        {idx < trackResult.timeline.length - 1 && (
                          <div className="w-0.5 h-8 bg-black my-0.5"></div>
                        )}
                      </div>
                      <div className={`flex-1 p-2 border border-black ${
                        step.active ? 'bg-[#ffebd9] border-2 border-[#df551f]' : 'bg-[#F4F1DE]'
                      }`}>
                        <div className="flex justify-between font-bold text-[10px] text-gray-700">
                          <span>{step.time}</span>
                          <span className="text-black uppercase">{step.location}</span>
                        </div>
                        <p className="font-bold text-black text-xs mt-0.5">{step.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integrated Digital Warranty Card */}
              <div className="bg-[#e6f4f1] p-3 border-2 border-black shadow-[3px_3px_0px_#000] text-xs relative overflow-hidden">
                <div className="flex justify-between items-center border-b border-black pb-1.5 mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#00A896]">
                    <span className="material-symbols-outlined text-base">verified</span>
                    <span>KARTU GARANSI DIGITAL RESMI ILYASVIEL</span>
                  </div>
                  <span className="bg-[#00A896] text-white text-[9px] font-bold px-1.5 py-0.5 border border-black uppercase">
                    {trackResult.warrantyStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800">
                  <div>
                    <span className="text-gray-600 font-bold text-[10px] block">NAMA PRODUK:</span>
                    <span className="font-extrabold text-black">{trackResult.item}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-bold text-[10px] block">NOMOR SERI / IMEI:</span>
                    <span className="font-bold font-mono bg-white px-1.5 py-0.5 border border-black text-[#df551f] inline-block">
                      {trackResult.imei}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-bold text-[10px] block">MASA KADALUARSA GARANSI:</span>
                    <span className="text-green-800 font-bold">{trackResult.warrantyExpiry}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-bold text-[10px] block">STATUS SERTIFIKAT:</span>
                    <span className="text-[#00A896] font-bold">✓ TERVERIFIKASI SISTEM 95</span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-dashed border-gray-400 text-[10px] text-gray-600 flex justify-between items-center">
                  <span>* Garansi melingkupi sparepart original & perbaikan teknis 12 bulan.</span>
                  <span className="font-bold text-black border border-black px-1 bg-white">SEAL OF AUTHENTICITY</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
