import React from 'react';
import { Product, TranslationDictionary } from '../types';

interface ProductCardProps {
  product: Product;
  t: TranslationDictionary;
  onAddToCart: (product: Product) => void;
  onOpenDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, t, onAddToCart, onOpenDetail }) => {
  return (
    <article id={`product-card-${product.id}`} className="retro-window flex flex-col text-black h-full group">
      {/* Title Bar */}
      <div className="retro-titlebar px-2 py-1 flex justify-between items-center text-white select-none">
        <span className="font-mono-retro text-xs font-bold">{product.filename}</span>
        <button className="border border-black bg-[#c0c0c0] text-black px-1 text-xs font-bold hover:bg-white focus:outline-none shadow-[1px_1px_0px_#000]">X</button>
      </div>

      {/* Image Container - Clickable */}
      <div
        onClick={() => onOpenDetail && onOpenDetail(product)}
        className="p-2 border-b-2 border-black h-48 bg-white relative overflow-hidden cursor-pointer"
        title="Klik untuk lihat detail & ulasan produk"
      >
        <div
          className="w-full h-full bg-cover bg-center transition-transform group-hover:scale-105 duration-200"
          style={{ backgroundImage: `url('${product.imageUrl}')` }}
          aria-label={product.name}
        ></div>

        {product.hasWarranty && (
          <span className="absolute top-2 right-2 bg-[#ffb59d] text-[#390c00] text-[10px] font-mono-retro font-bold px-1.5 py-0.5 border border-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            {t.warranty_label}
          </span>
        )}

        <div className="absolute bottom-1 left-1 bg-black/80 text-white text-[9px] font-mono-retro font-bold px-1.5 py-0.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-[12px]">search</span>
          <span>DETAIL & ULASAN</span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-grow flex flex-col bg-[#F4F1DE]">
        <h3
          onClick={() => onOpenDetail && onOpenDetail(product)}
          className="text-xl font-space-retro font-bold mb-1 text-black cursor-pointer hover:text-[#df551f] transition-colors"
        >
          {product.name}
        </h3>
        
        <p className="font-mono-retro text-xs mb-4 text-[#350a00]">
          {t.stock_label} <span className="font-bold">{product.stock} {t.stock_label === 'Stok Tersedia:' ? 'Unit' : 'Units'}</span>
        </p>

        <div className="mt-auto flex justify-between items-center pt-2 border-t border-black/20">
          <span className="text-xl font-space-retro font-bold text-black">Rp {product.price.toLocaleString('id-ID')}</span>
          <button
            id={`btn-buy-${product.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="retro-button px-3 py-1.5 font-mono-retro text-xs font-bold text-black hover:bg-[#00A896] hover:text-white flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            <span>{t.btn_buy}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
