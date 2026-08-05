import React, { useState, useEffect } from 'react';
import { CartItem, Language, TranslationDictionary, UserProfile } from '../types';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentLang: Language;
  t: TranslationDictionary;
  onClearCart: () => void;
  userProfile?: UserProfile | null;
}

type PaymentType = 'qris' | 'bank' | 'cod';
type BankType = 'bca' | 'mandiri' | 'bri' | 'bni';

const BANK_DETAILS: Record<BankType, { name: string; accNo: string; holder: string; color: string }> = {
  bca: {
    name: 'BANK BCA',
    accNo: '8820-1928-1029',
    holder: 'PT ILYASVIEL STORE INDONESIA',
    color: 'bg-[#00529C]'
  },
  mandiri: {
    name: 'BANK MANDIRI',
    accNo: '13700-8812-3391',
    holder: 'PT ILYASVIEL STORE INDONESIA',
    color: 'bg-[#003B6E]'
  },
  bri: {
    name: 'BANK BRI',
    accNo: '0021-0100-8912-501',
    holder: 'PT ILYASVIEL STORE INDONESIA',
    color: 'bg-[#00529C]'
  },
  bni: {
    name: 'BANK BNI',
    accNo: '0091-8821-3910',
    holder: 'PT ILYASVIEL STORE INDONESIA',
    color: 'bg-[#F15A24]'
  }
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentLang,
  t,
  onClearCart,
  userProfile
}) => {
  useBodyScrollLock(isOpen);

  const [shippingOption, setShippingOption] = useState<'reg' | 'yes'>('reg');
  const [useInsurance, setUseInsurance] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>('qris');
  const [selectedBank, setSelectedBank] = useState<BankType>('bca');
  const [fullName, setFullName] = useState('Pembeli Ilyasviel Store');
  const [address, setAddress] = useState('Jl. Gajah Mada No. 95, Jakarta Barat 11120');
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [generatedWarrantyCode, setGeneratedWarrantyCode] = useState('');
  const [generatedTrackingNo, setGeneratedTrackingNo] = useState('');

  useEffect(() => {
    if (isOpen && userProfile) {
      setFullName(userProfile.fullName);
      if (userProfile.phone) {
        setAddress(`Jl. Gajah Mada No. 95, Jakarta Barat 11120 (Telp: ${userProfile.phone})`);
      }
    }
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  const itemsTotalIDR = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const basePriceIDR = itemsTotalIDR > 0 ? itemsTotalIDR : 7750000;
  const shippingCostIDR = shippingOption === 'yes' ? 25000 : 15000;
  const insuranceCostIDR = useInsurance ? 5000 : 0;
  const grandTotalIDR = basePriceIDR + shippingCostIDR + insuranceCostIDR;

  const handleCopyAccount = (accountNo: string) => {
    navigator.clipboard.writeText(accountNo.replace(/-/g, ''));
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 3000);
  };

  const handleProcessPayment = () => {
    const tracking = `JNE-95${Math.floor(10000000 + Math.random() * 90000000)}`;
    const warranty = `GARANSI-IL95-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedTrackingNo(tracking);
    setGeneratedWarrantyCode(warranty);
    setIsPaid(true);
    setTimeout(() => {
      onClearCart();
    }, 2500);
  };

  const currentBank = BANK_DETAILS[selectedBank];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto modal-backdrop overscroll-contain">
      <div className="relative w-full max-w-2xl retro-window text-black flex flex-col my-auto max-h-[85vh] overflow-y-auto touch-scroll overscroll-contain border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#F4F1DE]">
        {/* Title Bar */}
        <div className="retro-titlebar px-3 py-2 flex justify-between items-center text-white select-none shrink-0 bg-[#00A896]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">payment</span>
            <span className="font-mono-retro text-xs font-bold tracking-tight">
              C:\ILYASVIEL\PAYMENT_GATEWAY.EXE
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onClose}
              aria-label="Close"
              className="border border-black bg-[#c0c0c0] text-black px-2 py-0.5 text-xs font-bold hover:bg-white focus:outline-none shadow-[1px_1px_0px_#000]"
            >
              X
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-5 bg-[#e6e3d0] font-work-retro">
          {isPaid ? (
            <div className="p-6 text-center bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] my-2 flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-6xl text-[#00A896]">verified</span>
              <h3 className="text-2xl font-space-retro font-bold text-black">
                {currentLang === 'id' ? 'TRANSAKSI PEMBAYARAN BERHASIL!' : 'PAYMENT TRANSACTION SUCCESSFUL!'}
              </h3>
              
              <div className="w-full bg-[#f4f1de] p-4 border-2 border-black font-mono-retro text-xs text-left space-y-2">
                <div className="flex justify-between border-b border-black/30 pb-1">
                  <span className="text-gray-600 font-bold">NOMOR RESI JNE AUTOMATIC:</span>
                  <span className="font-bold text-[#df551f]">{generatedTrackingNo}</span>
                </div>
                <div className="flex justify-between border-b border-black/30 pb-1">
                  <span className="text-gray-600 font-bold">KODE GARANSI DIGITAL:</span>
                  <span className="font-bold text-[#00A896]">{generatedWarrantyCode}</span>
                </div>
                <div className="flex justify-between border-b border-black/30 pb-1">
                  <span className="text-gray-600 font-bold">METODE PEMBAYARAN:</span>
                  <span className="font-bold uppercase">
                    {paymentMethod === 'qris'
                      ? 'QRIS INSTANT'
                      : paymentMethod === 'bank'
                      ? `TRANSFER ${currentBank.name}`
                      : 'COD (CASH ON DELIVERY)'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-black/30 pb-1">
                  <span className="text-gray-600 font-bold">TOTAL DIBAYAR:</span>
                  <span className="font-bold text-[#df551f]">Rp {grandTotalIDR.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-bold">STATUS GARANSI:</span>
                  <span className="font-bold text-green-600">AKTIF (12 BULAN ILYASVIEL STORE)</span>
                </div>
              </div>

              {/* Summary Items */}
              <div className="w-full bg-white p-3 border-2 border-black font-mono-retro text-xs text-left">
                <span className="font-bold text-black mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">receipt_long</span>
                  <span>RINGKASAN PESANAN:</span>
                </span>
                <ul className="space-y-1 text-gray-700">
                  {cartItems.length === 0 ? (
                    <li>• ThinkBrick 2000 Laptop Retro (x1)</li>
                  ) : (
                    cartItems.map((item) => (
                      <li key={item.product.id} className="flex justify-between">
                        <span>• {item.product.name} (x{item.quantity})</span>
                        <span className="font-bold">Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <p className="font-mono-retro text-xs text-gray-700">
                {currentLang === 'id'
                  ? 'Resi dan Kode Garansi telah disimpan di sistem kami. Barang siap dikirim via JNE!'
                  : 'Tracking and Warranty code saved. Goods ready for dispatch via JNE!'}
              </p>

              <button
                onClick={() => {
                  setIsPaid(false);
                  onClose();
                }}
                className="retro-button bg-[#df551f] text-white px-6 py-2.5 font-mono-retro font-bold text-xs uppercase"
              >
                {currentLang === 'id' ? 'SELESAI & TUTUP' : 'DONE & CLOSE'}
              </button>
            </div>
          ) : (
            <>
              {/* Order Items Preview */}
              <div className="border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-mono-retro font-bold text-xs mb-2 border-b border-black pb-1 flex justify-between">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#df551f]">inventory_2</span>
                    <span>{currentLang === 'id' ? 'Item Dalam Keranjang:' : 'Cart Items:'}</span>
                  </span>
                  <span className="text-[#df551f]">({cartItems.length} Produk)</span>
                </h4>
                {cartItems.length === 0 ? (
                  <p className="text-xs font-mono-retro text-gray-600">
                    {currentLang === 'id' ? 'ThinkBrick 2000 Laptop Retro (1x Paket Default)' : 'ThinkBrick 2000 Retro Laptop (1x Default Package)'}
                  </p>
                ) : (
                  <ul className="text-xs font-mono-retro space-y-1">
                    {cartItems.map((item) => (
                      <li key={item.product.id} className="flex justify-between">
                        <span>{item.product.name} (x{item.quantity})</span>
                        <span className="font-bold">Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 1. Address Section */}
              <section className="border-2 border-black p-4 relative pt-5 mt-1 bg-[#F4F1DE]">
                <span className="absolute -top-3 left-3 bg-[#c9c7b5] border border-black px-2 font-mono-retro text-xs font-bold">
                  1. {currentLang === 'id' ? 'Alamat Pengiriman' : 'Customer Address'}
                </span>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono-retro text-xs font-bold" htmlFor="fullName">
                      {currentLang === 'id' ? 'Nama Lengkap Pembeli' : 'Full Name'}
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input-sunken p-2 font-mono-retro text-xs bg-white text-black border-2 border-black"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-mono-retro text-xs font-bold" htmlFor="address">
                      {currentLang === 'id' ? 'Alamat Lengkap & Kota' : 'Street Address'}
                    </label>
                    <textarea
                      id="address"
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="input-sunken p-2 font-mono-retro text-xs bg-white text-black border-2 border-black resize-none"
                    ></textarea>
                  </div>
                </div>
              </section>

              {/* 2. Logistics Section */}
              <section className="border-2 border-black p-4 relative pt-5 mt-1 bg-[#F4F1DE]">
                <span className="absolute -top-3 left-3 bg-[#c9c7b5] border border-black px-2 font-mono-retro text-xs font-bold">
                  2. {currentLang === 'id' ? 'Layanan Ekspedisi JNE' : 'Logistics & Courier'}
                </span>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-mono-retro text-xs font-bold mb-2 border-b-2 border-black pb-1 inline-block">
                      {currentLang === 'id' ? 'Opsi Layanan JNE Express:' : 'Courier Service (JNE):'}
                    </p>
                    <div className="flex flex-col gap-2.5 mt-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="shipping"
                          value="reg"
                          checked={shippingOption === 'reg'}
                          onChange={() => setShippingOption('reg')}
                          className="retro-radio"
                        />
                        <span className="font-mono-retro text-xs flex justify-between w-full pr-2">
                          <span>REG (Regular - 2-3 Hari)</span>
                          <span className="font-bold">Rp 15.000</span>
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="shipping"
                          value="yes"
                          checked={shippingOption === 'yes'}
                          onChange={() => setShippingOption('yes')}
                          className="retro-radio"
                        />
                        <span className="font-mono-retro text-xs flex justify-between w-full pr-2">
                          <span>YES (Yakin Esok Sampai - 1 Hari)</span>
                          <span className="font-bold">Rp 25.000</span>
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Insurance */}
                  <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_#000]">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useInsurance}
                        onChange={(e) => setUseInsurance(e.target.checked)}
                        className="retro-checkbox"
                      />
                      <span className="font-mono-retro text-xs">
                        {currentLang === 'id'
                          ? 'Lindungi pengiriman dengan Asuransi JNE Digital (+ Rp 5.000)'
                          : 'Protect my shipment with JNE Insurance (+ Rp 5.000)'}
                      </span>
                    </label>
                  </div>
                </div>
              </section>

              {/* 3. Payment Section */}
              <section className="border-2 border-black p-4 relative pt-5 mt-1 bg-[#F4F1DE]">
                <span className="absolute -top-3 left-3 bg-[#c9c7b5] border border-black px-2 font-mono-retro text-xs font-bold">
                  3. {currentLang === 'id' ? 'Metode Pembayaran' : 'Payment Method'}
                </span>

                {/* Method Switcher Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-2.5 border-3 border-black flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === 'qris'
                        ? 'bg-[#df551f] text-white shadow-[2px_2px_0px_#000]'
                        : 'bg-white text-black hover:bg-[#e6e3d0]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                    <span className="font-mono-retro text-[11px] font-bold">QRIS Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-2.5 border-3 border-black flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === 'bank'
                        ? 'bg-[#df551f] text-white shadow-[2px_2px_0px_#000]'
                        : 'bg-white text-black hover:bg-[#e6e3d0]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">account_balance</span>
                    <span className="font-mono-retro text-[11px] font-bold">Transfer Bank</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2.5 border-3 border-black flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-[#df551f] text-white shadow-[2px_2px_0px_#000]'
                        : 'bg-white text-black hover:bg-[#e6e3d0]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">local_shipping</span>
                    <span className="font-mono-retro text-[11px] font-bold">COD (Ditempat)</span>
                  </button>
                </div>

                {/* DYNAMIC CONTENT FOR QRIS */}
                {paymentMethod === 'qris' && (
                  <div className="bg-white p-4 border-2 border-black flex flex-col items-center text-center gap-3 shadow-[3px_3px_0px_#000]">
                    <div className="bg-[#f4f1de] p-2 border-2 border-black">
                      <span className="font-mono-retro font-bold text-xs uppercase text-[#00A896]">
                        QRIS NATIONAL STANDARD (ILYASVIEL)
                      </span>
                    </div>

                    {/* Retro Styled QR Code Box */}
                    <div className="p-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center relative">
                      <div className="w-44 h-44 border-2 border-black p-2 bg-white flex flex-col items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Outer QR corners */}
                          <rect x="5" y="5" width="25" height="25" fill="black"/>
                          <rect x="9" y="9" width="17" height="17" fill="white"/>
                          <rect x="13" y="13" width="9" height="9" fill="black"/>

                          <rect x="70" y="5" width="25" height="25" fill="black"/>
                          <rect x="74" y="9" width="17" height="17" fill="white"/>
                          <rect x="78" y="13" width="9" height="9" fill="black"/>

                          <rect x="5" y="70" width="25" height="25" fill="black"/>
                          <rect x="9" y="74" width="17" height="17" fill="white"/>
                          <rect x="13" y="78" width="9" height="9" fill="black"/>

                          {/* Data patterns */}
                          <rect x="35" y="5" width="5" height="15" fill="black"/>
                          <rect x="45" y="10" width="10" height="5" fill="black"/>
                          <rect x="60" y="5" width="5" height="25" fill="black"/>

                          <rect x="5" y="35" width="20" height="5" fill="black"/>
                          <rect x="10" y="45" width="15" height="15" fill="black"/>
                          <rect x="30" y="30" width="40" height="40" fill="#00A896"/>
                          <rect x="40" y="40" width="20" height="20" fill="white"/>
                          <text x="50" y="52" fill="black" fontSize="8" fontWeight="bold" textAnchor="middle">IL95</text>

                          <rect x="75" y="35" width="20" height="10" fill="black"/>
                          <rect x="80" y="50" width="15" height="15" fill="black"/>

                          <rect x="35" y="75" width="15" height="10" fill="black"/>
                          <rect x="55" y="70" width="10" height="25" fill="black"/>
                          <rect x="70" y="75" width="25" height="5" fill="black"/>
                          <rect x="85" y="85" width="10" height="10" fill="black"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-mono-retro font-bold text-gray-700 mt-1">
                        NMID: ID1020269588120
                      </span>
                    </div>

                    <p className="font-mono-retro text-xs text-gray-800 font-bold max-w-xs">
                      📲 Scan QRIS di atas dengan aplikasi E-Wallet (Gopay, OVO, Dana, ShopeePay) atau M-Banking Anda.
                    </p>
                  </div>
                )}

                {/* DYNAMIC CONTENT FOR BANK TRANSFER */}
                {paymentMethod === 'bank' && (
                  <div className="bg-white p-4 border-2 border-black flex flex-col gap-3 shadow-[3px_3px_0px_#000]">
                    <label className="font-mono-retro text-xs font-bold text-black">
                      PILIH BANK TUJUAN TRANSFER:
                    </label>
                    
                    {/* Bank Selection Grid */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['bca', 'mandiri', 'bri', 'bni'] as BankType[]).map((bankKey) => (
                        <button
                          key={bankKey}
                          type="button"
                          onClick={() => {
                            setSelectedBank(bankKey);
                            setCopiedAcc(false);
                          }}
                          className={`py-1.5 px-1 border-2 border-black font-mono-retro text-xs font-bold uppercase transition-all ${
                            selectedBank === bankKey
                              ? 'bg-[#df551f] text-white shadow-[2px_2px_0px_#000]'
                              : 'bg-[#f4f1de] text-black hover:bg-gray-200'
                          }`}
                        >
                          {bankKey}
                        </button>
                      ))}
                    </div>

                    {/* Virtual Account Info Card */}
                    <div className="p-3 bg-[#F4F1DE] border-2 border-black flex flex-col gap-2 mt-1">
                      <div className="flex justify-between items-center border-b border-black pb-1">
                        <span className="font-mono-retro text-xs font-bold text-gray-700">
                          BANK TUJUAN:
                        </span>
                        <span className="font-mono-retro text-xs font-bold text-black bg-white px-2 py-0.5 border border-black">
                          {currentBank.name}
                        </span>
                      </div>

                      <div>
                        <span className="font-mono-retro text-[10px] font-bold text-gray-600">
                          NOMOR REKENING / VIRTUAL ACCOUNT:
                        </span>
                        <div className="flex items-center justify-between bg-white p-2 border-2 border-black mt-0.5">
                          <span className="font-mono-retro text-base font-bold text-[#df551f] tracking-widest">
                            {currentBank.accNo}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyAccount(currentBank.accNo)}
                            className="retro-button bg-[#00A896] hover:bg-[#008f80] text-white px-2 py-1 text-[10px] font-bold uppercase flex items-center gap-1 shrink-0"
                          >
                            <span>📋</span>
                            <span>{copiedAcc ? 'TERSALIN!' : 'SALIN REKENING'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] font-mono-retro text-gray-700">
                        <span className="font-bold">A/N:</span> {currentBank.holder}
                      </div>
                    </div>

                    {copiedAcc && (
                      <div className="p-1.5 bg-green-100 border border-green-800 text-green-800 text-xs font-mono-retro font-bold text-center">
                        ✓ Nomor Rekening {currentBank.name} Berhasil Disalin ke Clipboard!
                      </div>
                    )}
                  </div>
                )}

                {/* DYNAMIC CONTENT FOR COD */}
                {paymentMethod === 'cod' && (
                  <div className="bg-white p-4 border-2 border-black flex flex-col gap-2 shadow-[3px_3px_0px_#000]">
                    <div className="flex items-center gap-2 text-[#df551f] font-mono-retro font-bold text-xs border-b border-black pb-1">
                      <span className="material-symbols-outlined">local_shipping</span>
                      <span>KETENTUAN CASH ON DELIVERY (COD):</span>
                    </div>
                    <p className="font-mono-retro text-xs text-gray-800 leading-relaxed bg-[#f4f1de] p-3 border border-black">
                      💵 Siapkan uang pas sebesar <strong className="text-[#df551f]">Rp {grandTotalIDR.toLocaleString('id-ID')}</strong> saat kurir JNE menyerahkan paket ke lokasi Anda.
                    </p>
                    <div className="text-[10px] font-mono-retro text-gray-600">
                      * Pastikan nomor HP aktif agar dapat dihubungi oleh kurir pengirim.
                    </div>
                  </div>
                )}
              </section>

              {/* Order Summary & Action */}
              <div className="bg-[#b9c7e4] border-3 border-black p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-2 shadow-[4px_4px_0px_#000]">
                <div className="font-mono-retro text-xs font-bold flex flex-col text-[#0d1c32]">
                  <span>{currentLang === 'id' ? 'Total Pembayaran:' : 'Total Amount:'}</span>
                  <span className="text-xl sm:text-2xl font-space-retro font-bold tracking-tight text-[#350a00]">
                    Rp {grandTotalIDR.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="retro-button bg-[#df551f] hover:bg-[#c94916] px-6 py-3 font-mono-retro text-xs font-bold flex items-center gap-2 w-full sm:w-auto justify-center text-white"
                >
                  <span className="material-symbols-outlined text-sm">payment</span>
                  <span>
                    {paymentMethod === 'qris'
                      ? 'SAYA SUDAH BAYAR'
                      : paymentMethod === 'bank'
                      ? 'KONFIRMASI BAYAR'
                      : 'KONFIRMASI PESANAN COD'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

