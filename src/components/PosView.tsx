import React, { useState } from 'react';
import { Product, TranslationDictionary } from '../types';
import { supabase } from '../lib/supabase';

interface PosViewProps {
  products: Product[];
  setProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
  t: TranslationDictionary;
}

interface PosCartItem {
  product: Product;
  quantity: number;
}

export const PosView: React.FC<PosViewProps> = ({ products, setProducts, t }) => {
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'card'>('cash');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stock) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item): item is PosCartItem => item !== null)
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0 || loading) return;
    setLoading(true);

    const trackingNo = `POS-${Date.now().toString().slice(-6)}`;

    const { error: orderError } = await supabase.from('orders').insert([
      {
        tracking_no: trackingNo,
        customer_name: customerName || 'Pelanggan Kasir',
        total_amount: totalAmount,
        payment_method: paymentMethod,
        status: 'PAID'
      }
    ]);

    if (!orderError) {
      for (const item of cart) {
        const newStock = Math.max(0, item.product.stock - item.quantity);
        await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.product.id);
      }

      if (setProducts) {
        setProducts((prev) =>
          prev.map((p) => {
            const cartItem = cart.find((c) => c.product.id === p.id);
            if (cartItem) {
              return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
            }
            return p;
          })
        );
      }

      setLastReceipt({
        trackingNo,
        items: cart,
        total: totalAmount,
        paymentMethod,
        date: new Date().toLocaleTimeString()
      });

      setCart([]);
      setCustomerName('');
    }

    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black p-4 text-black shadow-lg">
        <h2 className="text-xl font-bold mb-4 uppercase flex items-center gap-2">
          <span className="material-symbols-outlined">point_of_sale</span>
          Katalog Kasir (POS)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto p-1">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleAddToCart(product)}
              className={`border-2 border-black p-2 bg-white cursor-pointer select-none flex flex-col justify-between ${
                product.stock <= 0 ? 'opacity-50 pointer-events-none bg-gray-200' : 'hover:bg-yellow-100'
              }`}
            >
              <div>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-20 object-cover border border-black mb-1"
                />
                <div className="font-bold text-xs truncate">{product.name}</div>
                <div className="text-[10px] text-gray-600 font-mono">Stok: {product.stock}</div>
              </div>
              <div className="font-mono font-bold text-xs text-[#008080] mt-1">
                Rp {product.price.toLocaleString('id-ID')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#c0c0c0] border-2 border-white border-b-black border-r-black p-4 text-black shadow-lg flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4 uppercase flex items-center gap-2">
            <span className="material-symbols-outlined">receipt_long</span>
            Struk Transaksi
          </h2>

          <div className="mb-3">
            <label className="block text-xs font-bold mb-1">Nama Pelanggan (Opsional)</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-1.5 bg-white border-2 border-black text-xs font-mono"
              placeholder="Pelanggan Umum"
            />
          </div>

          <div className="bg-white border-2 border-black p-2 min-h-[180px] max-h-[220px] overflow-y-auto font-mono text-xs mb-3">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">[ KERANJANG KASIR KOSONG ]</div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center mb-2 pb-1 border-b border-dashed border-gray-300">
                  <div className="truncate max-w-[120px]">
                    <div className="font-bold">{item.product.name}</div>
                    <div className="text-[10px] text-gray-500">
                      @{item.product.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.product.id, -1)}
                      className="bg-red-500 text-white px-1 text-[10px] font-bold border border-black"
                    >
                      -
                    </button>
                    <span className="font-bold px-1">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.product.id, 1)}
                      className="bg-green-600 text-white px-1 text-[10px] font-bold border border-black"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mb-3">
            <label className="block text-xs font-bold mb-1">Metode Pembayaran</label>
            <div className="grid grid-cols-3 gap-1">
              {(['cash', 'qris', 'card'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`p-1 text-[10px] font-bold uppercase border border-black ${
                    paymentMethod === m ? 'bg-[#000080] text-white' : 'bg-white text-black'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#000080] text-white p-2 border-2 border-black font-mono mb-3">
            <div className="text-[10px] uppercase">Total Tagihan:</div>
            <div className="text-lg font-bold">Rp {totalAmount.toLocaleString('id-ID')}</div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={cart.length === 0 || loading}
            className="w-full bg-[#df551f] hover:bg-[#c44615] disabled:bg-gray-400 text-white font-bold p-3 border-2 border-black shadow-[2px_2px_0px_#000] uppercase text-sm"
          >
            {loading ? 'Memproses...' : '[ PROSES BAYAR & CETAK ]'}
          </button>

          {lastReceipt && (
            <div className="mt-3 bg-yellow-100 border-2 border-black p-2 font-mono text-[10px]">
              <div className="font-bold text-center border-b border-black pb-1 mb-1">TRANSAKSI BERHASIL</div>
              <div>No: {lastReceipt.trackingNo}</div>
              <div>Metode: {lastReceipt.paymentMethod.toUpperCase()}</div>
              <div>Total: Rp {lastReceipt.total.toLocaleString('id-ID')}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
