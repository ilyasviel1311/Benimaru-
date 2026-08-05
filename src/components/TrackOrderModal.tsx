import React, { useState, useEffect } from 'react';
import { TranslationDictionary } from '../types';
import { supabase } from '../lib/supabase';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialResi?: string;
  t: TranslationDictionary;
}

interface OrderData {
  id: string;
  tracking_no: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  initialResi = '',
  t
}) => {
  const [resi, setResi] = useState(initialResi);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (trackingNoToSearch: string) => {
    if (!trackingNoToSearch) return;
    setLoading(true);
    setErrorMsg(null);
    setOrder(null);

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('tracking_no', trackingNoToSearch.trim())
      .single();

    if (error || !data) {
      setErrorMsg('Nomor resi tidak ditemukan di database.');
    } else {
      setOrder(data as OrderData);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialResi) {
      setResi(initialResi);
      handleSearch(initialResi);
    }
  }, [initialResi]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#c0c0c0] border-4 border-white border-b-black border-r-black w-full max-w-lg p-4 text-black shadow-2xl">
        <div className="bg-[#000080] text-white p-2 mb-4 flex justify-between items-center border border-black">
          <span className="font-bold uppercase text-sm">Lacak Resi Pengiriman</span>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-0.5 text-xs border border-black"
          >
            X
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={resi}
              onChange={(e) => setResi(e.target.value)}
              placeholder="Masukkan Nomor Resi (misal: JNE-12345678 atau POS-123456)"
              className="flex-1 p-2 bg-white border-2 border-black font-mono text-xs uppercase font-bold"
            />
            <button
              type="button"
              onClick={() => handleSearch(resi)}
              disabled={loading}
              className="bg-[#008080] hover:bg-[#006666] text-white font-bold px-4 text-xs border-2 border-black shadow-[2px_2px_0px_#000]"
            >
              {loading ? 'Mencari...' : 'CARI'}
            </button>
          </div>

          {errorMsg && (
            <div className="bg-red-100 border-2 border-red-600 text-red-700 p-3 font-mono text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          {order && (
            <div className="bg-white border-2 border-black p-4 font-mono text-xs space-y-3">
              <div className="bg-yellow-100 border border-black p-2 flex justify-between items-center">
                <span className="font-bold">STATUS:</span>
                <span className="bg-green-600 text-white px-2 py-0.5 font-bold uppercase text-[10px]">
                  {order.status}
                </span>
              </div>

              <div className="border-b border-gray-300 pb-2 space-y-1">
                <div><span className="font-bold">No Resi:</span> {order.tracking_no}</div>
                <div><span className="font-bold">Pembeli:</span> {order.customer_name}</div>
                {order.customer_phone && (
                  <div><span className="font-bold">No HP:</span> {order.customer_phone}</div>
                )}
                {order.customer_address && (
                  <div><span className="font-bold">Alamat:</span> {order.customer_address}</div>
                )}
              </div>

              <div className="border-b border-gray-300 pb-2 space-y-1">
                <div><span className="font-bold">Metode Bayar:</span> {order.payment_method?.toUpperCase()}</div>
                <div><span className="font-bold">Total Tagihan:</span> Rp {Number(order.total_amount).toLocaleString('id-ID')}</div>
                <div><span className="font-bold">Waktu Transaksi:</span> {new Date(order.created_at).toLocaleString('id-ID')}</div>
              </div>

              <div className="text-[10px] text-gray-500 text-center pt-1">
                [ Data Terverifikasi Langsung dari Database Server ]
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
