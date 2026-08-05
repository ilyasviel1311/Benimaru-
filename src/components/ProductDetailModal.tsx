import React from 'react';
import { Product, TranslationDictionary, Language } from '../types';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDictionary;
  currentLang: Language;
  onAddToCart: (product: Product) => void;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  commentId: string;
  commentEn: string;
}

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    user: 'PixelRider_99',
    rating: 5,
    date: '02 Aug 2026',
    commentId: 'Kualitas perangkat retro sangat original! Pengiriman JNE YES super cepat dan garansi terdaftar resmi.',
    commentEn: 'Retro device quality is extremely original! JNE YES shipping was super fast and warranty is officially registered.'
  },
  {
    id: 'rev-2',
    user: 'CyberByte_95',
    rating: 5,
    date: '28 Jul 2026',
    commentId: 'Bodi mulus tanpa goresan, semua modul berfungsi normal 100%. Kemasan bubble wrap berlapis aman.',
    commentEn: 'Mint body condition with zero scratches, all modules function 100% fine. Safe multi-layer bubble wrap.'
  },
  {
    id: 'rev-3',
    user: 'VintageGamer_90',
    rating: 4,
    date: '15 Jul 2026',
    commentId: 'Respon seller Ilyasviel Store mantap! Struk garansi digital langsung aktif di sistem tracking resi.',
    commentEn: 'Great seller response from Ilyasviel Store! Digital warranty receipt activated instantly on tracking system.'
  }
];

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  t,
  currentLang,
  onAddToCart,
}) => {
  useBodyScrollLock(isOpen);

  if (!isOpen || !product) return null;

  const specsId = product.category === 'laptop'
    ? 'Prosesor Vintage 90s Engine, Layar Retro TFT Active Matrix, Keyboard Taktil, Port Serial & Parallel RS-232, Garansi Resmi 12 Bulan.'
    : product.category === 'phone'
    ? 'Layar Monochrome High Contrast, Baterai Standby 7 Hari, Antena Teleskopik, Suara Jernih 8-bit Ringtones, Garansi Resmi 12 Bulan.'
    : 'Kabel Tembaga Murni MFI Grade, Bodi Ultra Durable ABS, Support Plug & Play 90s Architecture, Garansi Resmi 12 Bulan.';

  const specsEn = product.category === 'laptop'
    ? 'Vintage 90s Processor Engine, Retro TFT Active Matrix Display, Tactile Keyboard, RS-232 Serial & Parallel Ports, 12 Months Warranty.'
    : product.category === 'phone'
    ? 'Monochrome High Contrast Screen, 7 Days Standby Battery, Telescopic Antenna, Crystal 8-bit Ringtones, 12 Months Warranty.'
    : 'Pure Copper MFI Grade Wiring, Ultra Durable ABS Body, Plug & Play 90s Architecture Support, 12 Months Warranty.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto modal-backdrop overscroll-contain">
      <div className="relative w-full max-w-3xl retro-window text-black flex flex-col my-auto max-h-[85vh] overflow-y-auto touch-scroll overscroll-contain border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#F4F1DE]">
        {/* Title Bar */}
        <div className="retro-titlebar px-3 py-2 flex justify-between items-center text-white select-none shrink-0 bg-[#00A896]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">devices</span>
            <span className="font-mono-retro text-xs sm:text-sm font-bold tracking-tight">
              C:\ILYASVIEL\PRODUCT_DETAILS.EXE
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onClose}
              className="border border-black bg-[#c0c0c0] text-black px-2 py-0.5 text-xs font-bold hover:bg-white focus:outline-none shadow-[1px_1px_0px_#000]"
            >
              X
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 flex flex-col gap-6">
          {/* Main Product Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Product Image */}
            <div className="border-4 border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
              <div className="w-full h-56 sm:h-64 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
                {product.hasWarranty && (
                  <span className="absolute top-2 right-2 bg-[#ffb59d] text-[#390c00] text-[10px] font-mono-retro font-bold px-2 py-0.5 border-2 border-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {t.warranty_label}
                  </span>
                )}
              </div>
              <div className="mt-2 text-[11px] font-mono-retro font-bold text-gray-600">
                SN: IL-95{product.id.toUpperCase()} • ORIGINAL HARDWARE
              </div>
            </div>

            {/* Right: Details & Buying Actions */}
            <div className="flex flex-col gap-3">
              <div className="border-b-2 border-black pb-2">
                <span className="border-2 border-black bg-[#df551f] text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {product.category.toUpperCase()}
                </span>
                <h2 className="text-2xl sm:text-3xl font-space-retro font-bold text-black mt-2 leading-tight">
                  {product.name}
                </h2>
              </div>

              {/* Price & Rating */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div>
                  <div className="text-[10px] font-mono-retro font-bold text-gray-500">HARGA PRODUK:</div>
                  <div className="text-2xl font-space-retro font-bold text-[#df551f]">
                    Rp {product.price.toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-yellow-500 text-sm font-bold flex items-center gap-1">
                    <span>★★★★★</span>
                    <span className="text-black text-xs font-mono-retro">4.9 / 5.0</span>
                  </div>
                  <div className="text-[10px] font-mono-retro font-bold text-gray-600">
                    (18 {currentLang === 'id' ? 'Ulasan Pembeli' : 'Reviews'})
                  </div>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 font-mono-retro text-xs font-bold text-[#350a00] bg-[#e6e3d0] p-2 border border-black">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full border border-black animate-pulse"></span>
                <span>
                  {t.stock_label} <strong className="text-black">{product.stock} Unit</strong> (Ready Stock)
                </span>
              </div>

              {/* Description & Specs */}
              <div className="bg-white p-3 border-2 border-black font-mono-retro text-xs text-gray-800 leading-relaxed">
                <p className="font-bold text-black border-b border-gray-300 pb-1 mb-1">
                  📋 {currentLang === 'id' ? 'DESKRIPSI & SPESIFIKASI:' : 'DESCRIPTION & SPECS:'}
                </p>
                <p>{currentLang === 'id' ? specsId : specsEn}</p>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="retro-button bg-[#00A896] hover:bg-[#008f80] text-white px-5 py-3 font-space-retro font-bold text-sm uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-1"
              >
                <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                <span>{t.btn_buy}</span>
              </button>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="border-t-4 border-black pt-4 mt-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-space-retro font-bold text-lg text-black flex items-center gap-2">
                <span>💬</span>
                <span>{currentLang === 'id' ? 'KOMENTAR & ULASAN PEMBELI' : 'CUSTOMER REVIEWS & FEEDBACK'}</span>
              </h3>
              <span className="bg-[#6e4f9b] text-white text-[10px] font-mono-retro font-bold px-2 py-0.5 border border-black">
                100% VERIFIED BUYERS
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {SAMPLE_REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-3 border-2 border-black font-mono-retro text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-1"
                >
                  <div className="flex justify-between items-center border-b border-gray-200 pb-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-[#00A896]">account_circle</span>
                      <span className="font-bold text-black">{rev.user}</span>
                      <span className="bg-[#e6e3d0] text-[9px] px-1 border border-black text-gray-700 font-bold">
                        VERIFIED
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-xs">{'★'.repeat(rev.rating)}</span>
                      <span className="text-[10px] text-gray-500 font-bold">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-800 mt-1 italic">
                    "{currentLang === 'id' ? rev.commentId : rev.commentEn}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
