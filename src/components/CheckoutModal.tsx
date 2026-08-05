import React, { useState } from 'react';
import { CartItem, TranslationDictionary } from '../types';
import { supabase } from '../lib/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  t: TranslationDictionary;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  t
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [loading, setLoading] = useState(false);
  const [completedTrackingNo, setCompletedTrackingNo] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0 || loading) return;

    setLoading(true);

    const trackingNo = `JNE-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const { error: orderError } = await supabase.from('orders').insert([
      {
        tracking_no: trackingNo,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        status: 'PAID'
      }
    ]);

    if (!orderError) {
      for (const item of cartItems) {
        const newStock = Math.max(0, item.product.stock - item.quantity);
        await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.product.id);
      }

      setCompletedTrackingNo(trackingNo);
      onClearCart();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#c0c0c0] border-4 border-white border-b-black border-r-black w-full max-w-2xl p-4 text-black shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-[#000080] text-white p-2 mb-4 flex justify-between items-center border border-black">
          <span className="font-bold uppercase text-sm">Keranjang & Checkout</span>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-0.5 text-xs border border-black"
          >
            X
          </button>
        </div>

        {completedTrackingNo ? (
          <div className="bg-white border-2 border-black p-6 text-center space-y-4">
            <span className="material-symbols-outlined text-6xl text-green-600">
              check_circle
            </span>
            <h3 className="text-xl font-bold uppercase">Pesanan Berhasil Disimpan</h3>
            <p className="text-sm">Nomor Resi Pelacakan Anda:</p>
            <div className="bg-yellow-100 border-2 border-black p-3 font-mono font-bold text-lg select-all">
              {completedTrackingNo}
            </div>
            <p className="text-xs text-gray-600">
              Gunakan nomor resi di atas pada tombol [ CEK RESI ] untuk memantau status pengiriman.
            </p>
            <button
              type="button"
              onClick={() => {
                setCompletedTrackingNo(null);
                onClose();
              }}
              className="bg-[#008080] text-white font-bold px-6 py-2 border-2 border-black uppercase text-xs"
            >
              Tutup
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-black p-3 font-mono text-xs max-h-[300px] overflow-y-auto">
              <h4 className="font-bold border-b border-black pb-2 mb-2 uppercase">Item Belanja</h4>
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center my-8">[ Keranjang Kosong ]</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product.id} className="border-b border-dashed border-gray-300 pb-2 mb-2">
                    <div className="font-bold truncate">{item.product.name}</div>
                    <div className="flex justify-between items-center mt-1">
                      <span>Rp {item.product.price.toLocaleString('id-ID')}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="bg-gray-300 px-1 text-xs border border-black font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold px-1">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="bg-gray-300 px-1 text-xs border border-black font-bold"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="bg-red-600 text-white px-1 text-[10px] border border-black ml-1"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <div className="border-t-2 border-black pt-2 mt-4 font-bold flex justify-between text-sm">
                <span>Total:</span>
                <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 bg-white border-2 border-black font-mono font-normal"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Nomor WhatsApp / Telepon</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2 bg-white border-2 border-black font-mono font-normal"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Alamat Pengiriman</label>
                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full p-2 bg-white border-2 border-black font-mono font-normal"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Metode Pembayaran</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 bg-white border-2 border-black font-mono font-normal"
                >
                  <option value="qris">QRIS (Otomatis)</option>
                  <option value="transfer">Transfer Bank</option>
                  <option value="cod">Bayar di Tempat (COD)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={cartItems.length === 0 || loading}
                className="w-full bg-[#df551f] hover:bg-[#c44615] disabled:bg-gray-400 text-white font-bold p-3 border-2 border-black uppercase shadow-[2px_2px_0px_#000]"
              >
                {loading ? 'Memproses Pesanan...' : '[ BAYAR SEKARANG ]'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
