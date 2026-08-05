import React, { useState } from 'react';
import { Product, TranslationDictionary } from '../types';

interface AdminDashboardViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  t: TranslationDictionary;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  products,
  setProducts,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('handphone');
  const [filename, setFilename] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(1);
  const [hasWarranty, setHasWarranty] = useState(false);
  const [requiresImei, setRequiresImei] = useState(false);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      category,
      filename,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
      price: Number(price),
      stock: Number(stock),
      hasWarranty,
      requiresImei,
    };
    setProducts([newProduct, ...products]);
    setName('');
    setFilename('');
    setImageUrl('');
    setPrice(0);
    setStock(1);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-[#c0c0c0] border-2 border-black font-mono">
      <div className="bg-[#000080] text-white px-3 py-1 font-bold text-sm mb-4 flex justify-between items-center">
        <span>ADMIN_DASHBOARD.EXE</span>
        <span>[X]</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleAddProduct} className="bg-white p-4 border-2 border-black">
          <h2 className="font-bold mb-3 text-sm border-b-2 border-black pb-1">TAMBAH PRODUK BARU</h2>
          
          <div className="mb-2">
            <label className="block text-xs font-bold mb-1">Nama Produk:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-black p-1 text-xs"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-xs font-bold mb-1">Kategori:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-2 border-black p-1 text-xs bg-white"
            >
              <option value="handphone">Handphone</option>
              <option value="laptop">Laptop</option>
              <option value="aksesoris">Aksesoris</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-xs font-bold mb-1">Filename (.exe):</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full border-2 border-black p-1 text-xs"
              placeholder="contoh: device.exe"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-xs font-bold mb-1">URL Gambar:</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border-2 border-black p-1 text-xs"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-xs font-bold mb-1">Harga (Rp):</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border-2 border-black p-1 text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Stok:</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full border-2 border-black p-1 text-xs"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 my-3 text-xs">
            <label className="flex items-center gap-1 font-bold">
              <input
                type="checkbox"
                checked={hasWarranty}
                onChange={(e) => setHasWarranty(e.target.checked)}
              />
              Garansi
            </label>
            <label className="flex items-center gap-1 font-bold">
              <input
                type="checkbox"
                checked={requiresImei}
                onChange={(e) => setRequiresImei(e.target.checked)}
              />
              Butuh IMEI
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#df551f] text-white font-bold py-1 border-2 border-black text-xs uppercase hover:bg-[#c44615]"
          >
            Simpan Produk
          </button>
        </form>

        <div className="bg-white p-4 border-2 border-black overflow-y-auto max-h-[450px]">
          <h2 className="font-bold mb-3 text-sm border-b-2 border-black pb-1">DAFTAR PRODUK ({products.length})</h2>
          {products.map((p) => (
            <div key={p.id} className="flex justify-between items-center border-b border-gray-300 py-2 text-xs">
              <div>
                <p className="font-bold">{p.name}</p>
                <p className="text-gray-600">Rp {p.price.toLocaleString()} | Stok: {p.stock}</p>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-600 text-white px-2 py-1 border border-black font-bold text-[10px]"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
