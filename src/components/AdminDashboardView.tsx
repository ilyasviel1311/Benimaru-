import React, { useState } from 'react';
import { Product, TranslationDictionary } from '../types';
import { supabase } from '../lib/supabase';

interface AdminDashboardViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  t: TranslationDictionary;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  products,
  setProducts,
  t
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('laptop');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [hasWarranty, setHasWarranty] = useState(true);
  const [requiresImei, setRequiresImei] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    setLoading(true);

    const newId = `prod_${Date.now()}`;
    const filename = `${name.toUpperCase().replace(/\s+/g, '_')}.EXE`;
    const numericPrice = Number(price);
    const numericStock = Number(stock);

    const { error } = await supabase.from('products').insert([
      {
        id: newId,
        name,
        category,
        filename,
        image_url: imageUrl || 'https://via.placeholder.com/150',
        has_warranty: hasWarranty,
        stock: numericStock,
        price: numericPrice,
        requires_imei: requiresImei
      }
    ]);

    if (!error) {
      const newProduct: Product = {
        id: newId,
        name,
        category,
        filename,
        imageUrl: imageUrl || 'https://via.placeholder.com/150',
        hasWarranty,
        stock: numericStock,
        price: numericPrice,
        requiresImei
      };

      setProducts((prev) => [newProduct, ...prev]);
      setName('');
      setPrice('');
      setStock('');
      setImageUrl('');
    }

    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#c0c0c0] border-2 border-white border-b-black border-r-black p-4 text-black shadow-lg">
        <h2 className="text-xl font-bold mb-4 uppercase flex items-center gap-2">
          <span className="material-symbols-outlined">add_box</span>
          Tambah Produk Baru
        </h2>

        <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">Nama Produk</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-white border-2 border-black font-mono text-sm"
              placeholder="Contoh: ThinkPad X220"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 bg-white border-2 border-black font-mono text-sm"
            >
              <option value="laptop">Laptop / PC</option>
              <option value="phone">Handphone</option>
              <option value="acc">Aksesori</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Harga (IDR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 bg-white border-2 border-black font-mono text-sm"
              placeholder="5000000"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Stok Awal</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-2 bg-white border-2 border-black font-mono text-sm"
              placeholder="10"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold mb-1">URL Gambar Produk</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 bg-white border-2 border-black font-mono text-sm"
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-4 items-center sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
              <input
                type="checkbox"
                checked={hasWarranty}
                onChange={(e) => setHasWarranty(e.target.checked)}
              />
              Ada Garansi
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
              <input
                type="checkbox"
                checked={requiresImei}
                onChange={(e) => setRequiresImei(e.target.checked)}
              />
              Perlu IMEI / SN
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 bg-[#008080] hover:bg-[#006666] text-white font-bold p-3 border-2 border-black shadow-[2px_2px_0px_#000] uppercase"
          >
            {loading ? 'Menyimpan...' : '[ SIMPAN KE DATABASE ]'}
          </button>
        </form>
      </div>

      <div className="bg-[#c0c0c0] border-2 border-white border-b-black border-r-black p-4 text-black shadow-lg">
        <h2 className="text-xl font-bold mb-4 uppercase flex items-center gap-2">
          <span className="material-symbols-outlined">inventory_2</span>
          Daftar Stok Produk ({products.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-black bg-white text-xs">
            <thead>
              <tr className="bg-[#000080] text-white">
                <th className="border border-black p-2 text-left">ID</th>
                <th className="border border-black p-2 text-left">Nama</th>
                <th className="border border-black p-2 text-center">Kategori</th>
                <th className="border border-black p-2 text-right">Harga</th>
                <th className="border border-black p-2 text-center">Stok</th>
                <th className="border border-black p-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-100">
                  <td className="border border-black p-2 font-mono">{p.id}</td>
                  <td className="border border-black p-2 font-bold">{p.name}</td>
                  <td className="border border-black p-2 text-center uppercase">{p.category}</td>
                  <td className="border border-black p-2 text-right font-mono">
                    Rp {p.price.toLocaleString('id-ID')}
                  </td>
                  <td className="border border-black p-2 text-center font-bold">{p.stock}</td>
                  <td className="border border-black p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(p.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 font-bold border border-black text-[10px]"
                    >
                      HAPUS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
