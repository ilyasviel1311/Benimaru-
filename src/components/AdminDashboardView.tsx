import React, { useState } from 'react';
import { Language, ActiveModule } from '../types';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface AdminDashboardViewProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onModuleChange: (module: ActiveModule) => void;
  onShowToast: (msg: string) => void;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  priceUSD: number;
  priceIDR: number;
  imageUrl?: string;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Samsung S24 Ultra', category: 'PHONE', stock: 12, priceUSD: 1299, priceIDR: 20134500, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBer_dx4kOKKzAZ1ox_v7DicQlVF50M_rhBDmFVWDRFJk_kEGeqzdagZxhdoEYd_DArtciAyUL3_DQHTnYIdGg__dFWz4Hsn-NPHSRYLGkawlZJgVmuuTT5PhaNaHPdVsdJsX7SSrXw7upgbWOJJZNeIajeFrau-MvhfrJtVb0imTBGQOPxjQDJqCBbM-48BRTn7GYDwptLNNG8oRxTVhjPTVe31kFqJkdLElB6yoIIkHsoYSLDkpo9' },
  { id: 'inv-2', name: 'iPad Pro 11"', category: 'TABLET', stock: 8, priceUSD: 799, priceIDR: 12384500, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR9x5xkxSUKQMcv-NH94Pq6pW_Mvvy8M5uEOQ2EkYtN_756hDIfnMUWNNKAAUWhvw9XTIAUxivQT_kWGDKqQFAZ3uekmzDJyv7fe949XBZ8Ek7sB4gskNhhk0ZPAmF4_5N2-QjgrVYRqcTheIg2xvw-A2aum6mL_HfevzryDDHrGmksrrS8pImw8jFQ9hoVJ7tyDao6nUnHmKHL67gCw1xkCYXQDQ8VLylb39lHvGKOuBHhFgbqsLP' },
  { id: 'inv-3', name: 'Sony WH-1000XM5', category: 'AUDIO', stock: 24, priceUSD: 398, priceIDR: 6169000, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAmTm322fjOg4TTU5uvZXmbev0PJo3MoiokWmJO4Z7ROyniVF0G92f_EJA0Q0BfBWT4WXW5s1N5ku-rTcODyWMHViDnHu6KHWTfjCFXi0Yq1DD4mlO__0_QuORx3_n2L5oJ2LNeQcil2-KVnCdkVm5KpekPTZ4hFJ7da0GcQg36Q15E6Rpo5EPyE2xfYE5jdoqUZMGZMRwydAvN30HCtMN5Iza28wPJqOinphwtbSc_fSGZR83HlMp' },
  { id: 'inv-4', name: 'ThinkBrick 2000 Laptop', category: 'LAPTOP', stock: 5, priceUSD: 850, priceIDR: 13175000, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF-E2pkBa59zUswWvQ98R2ZQNPwWmyxr_S9s75Jl3mRp6rY3GbQpzT1FJSLgmde8Yo97k0aDh9mL_SM7-HqztMazc0Ii7NtknE8CFIiFD51GBlOvqTHoU8cliBmRsR71pLrC2_d56Xxe6jCKdhYm6ZuoBBJ0m19pabBjpFDnuEzK9ca-1Rt6xVLCZ7kcnzGSBeg-xNHtNhSD3mewzlfLB7tcgcLqmtR64k2r3TF7CLu7AXDk0MYTHV' },
  { id: 'inv-5', name: 'Nokia 3310 Re-edition', category: 'PHONE', stock: 15, priceUSD: 120, priceIDR: 1860000, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBer_dx4kOKKzAZ1ox_v7DicQlVF50M_rhBDmFVWDRFJk_kEGeqzdagZxhdoEYd_DArtciAyUL3_DQHTnYIdGg__dFWz4Hsn-NPHSRYLGkawlZJgVmuuTT5PhaNaHPdVsdJsX7SSrXw7upgbWOJJZNeIajeFrau-MvhfrJtVb0imTBGQOPxjQDJqCBbM-48BRTn7GYDwptLNNG8oRxTVhjPTVe31kFqJkdLElB6yoIIkHsoYSLDkpo9' },
  { id: 'inv-6', name: 'Mechanical Keyboard 95', category: 'ACC', stock: 30, priceUSD: 95, priceIDR: 1472500, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAmTm322fjOg4TTU5uvZXmbev0PJo3MoiokWmJO4Z7ROyniVF0G92f_EJA0Q0BfBWT4WXW5s1N5ku-rTcODyWMHViDnHu6KHWTfjCFXi0Yq1DD4mlO__0_QuORx3_n2L5oJ2LNeQcil2-KVnCdkVm5KpekPTZ4hFJ7da0GcQg36Q15E6Rpo5EPyE2xfYE5jdoqUZMGZMRwydAvN30HCtMN5Iza28wPJqOinphwtbSc_fSGZR83HlMp' },
];

interface TransactionLog {
  id: string;
  time: string;
  source: 'WEB' | 'POS';
  code: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  amountIDR: number;
  amountUSD: number;
}

const INITIAL_TX_LOGS: TransactionLog[] = [
  { id: 'tx-1', time: '10:42:11', source: 'WEB', code: 'TX_9921_A', status: 'SUCCESS', amountIDR: 20134500, amountUSD: 1299 },
  { id: 'tx-2', time: '10:45:03', source: 'POS', code: 'TX_9922_B', status: 'SUCCESS', amountIDR: 6169000, amountUSD: 398 },
  { id: 'tx-3', time: '10:51:44', source: 'WEB', code: 'TX_9923_A', status: 'PENDING', amountIDR: 12384500, amountUSD: 799 },
  { id: 'tx-4', time: '11:02:10', source: 'POS', code: 'TX_9924_C', status: 'SUCCESS', amountIDR: 20134500, amountUSD: 1299 },
  { id: 'tx-5', time: '11:15:33', source: 'WEB', code: 'TX_9925_B', status: 'FAILED', amountIDR: 1379500, amountUSD: 89 },
  { id: 'tx-6', time: '11:20:01', source: 'POS', code: 'TX_9926_A', status: 'SUCCESS', amountIDR: 3084500, amountUSD: 199 },
  { id: 'tx-7', time: '11:34:12', source: 'WEB', code: 'TX_9927_D', status: 'SUCCESS', amountIDR: 13175000, amountUSD: 850 },
];

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentLang,
  onLanguageChange,
  onModuleChange,
  onShowToast
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [txFilter, setTxFilter] = useState<'ALL' | 'WEB' | 'POS'>('ALL');
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);

  useBodyScrollLock(isAddProductOpen);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('PHONE');
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdPrice, setNewProdPrice] = useState(499);
  const [newProdImageUrl, setNewProdImageUrl] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAF-E2pkBa59zUswWvQ98R2ZQNPwWmyxr_S9s75Jl3mRp6rY3GbQpzT1FJSLgmde8Yo97k0aDh9mL_SM7-HqztMazc0Ii7NtknE8CFIiFD51GBlOvqTHoU8cliBmRsR71pLrC2_d56Xxe6jCKdhYm6ZuoBBJ0m19pabBjpFDnuEzK9ca-1Rt6xVLCZ7kcnzGSBeg-xNHtNhSD3mewzlfLB7tcgcLqmtR64k2r3TF7CLu7AXDk0MYTHV'
  );
  const [showPhotoPicker, setShowPhotoPicker] = useState<boolean>(false);

  const PRESET_IMAGES = [
    {
      name: 'ThinkPad Retro',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF-E2pkBa59zUswWvQ98R2ZQNPwWmyxr_S9s75Jl3mRp6rY3GbQpzT1FJSLgmde8Yo97k0aDh9mL_SM7-HqztMazc0Ii7NtknE8CFIiFD51GBlOvqTHoU8cliBmRsR71pLrC2_d56Xxe6jCKdhYm6ZuoBBJ0m19pabBjpFDnuEzK9ca-1Rt6xVLCZ7kcnzGSBeg-xNHtNhSD3mewzlfLB7tcgcLqmtR64k2r3TF7CLu7AXDk0MYTHV'
    },
    {
      name: 'Nokia Classic',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBer_dx4kOKKzAZ1ox_v7DicQlVF50M_rhBDmFVWDRFJk_kEGeqzdagZxhdoEYd_DArtciAyUL3_DQHTnYIdGg__dFWz4Hsn-NPHSRYLGkawlZJgVmuuTT5PhaNaHPdVsdJsX7SSrXw7upgbWOJJZNeIajeFrau-MvhfrJtVb0imTBGQOPxjQDJqCBbM-48BRTn7GYDwptLNNG8oRxTVhjPTVe31kFqJkdLElB6yoIIkHsoYSLDkpo9'
    },
    {
      name: 'Sony Audio',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAmTm322fjOg4TTU5uvZXmbev0PJo3MoiokWmJO4Z7ROyniVF0G92f_EJA0Q0BfBWT4WXW5s1N5ku-rTcODyWMHViDnHu6KHWTfjCFXi0Yq1DD4mlO__0_QuORx3_n2L5oJ2LNeQcil2-KVnCdkVm5KpekPTZ4hFJ7da0GcQg36Q15E6Rpo5EPyE2xfYE5jdoqUZMGZMRwydAvN30HCtMN5Iza28wPJqOinphwtbSc_fSGZR83HlMp'
    },
    {
      name: 'Macintosh SE',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR9x5xkxSUKQMcv-NH94Pq6pW_Mvvy8M5uEOQ2EkYtN_756hDIfnMUWNNKAAUWhvw9XTIAUxivQT_kWGDKqQFAZ3uekmzDJyv7fe949XBZ8Ek7sB4gskNhhk0ZPAmF4_5N2-QjgrVYRqcTheIg2xvw-A2aum6mL_HfevzryDDHrGmksrrS8pImw8jFQ9hoVJ7tyDao6nUnHmKHL67gCw1xkCYXQDQ8VLylb39lHvGKOuBHhFgbqsLP'
    }
  ];

  const filteredLogs = INITIAL_TX_LOGS.filter(
    (log) => txFilter === 'ALL' || log.source === txFilter
  );

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Hapus produk "${name}" dari database inventaris?`)) {
      setInventory((prev) => prev.filter((item) => item.id !== id));
      onShowToast(currentLang === 'id' ? `🗑️ Produk ${name} telah dihapus` : `🗑️ Product ${name} deleted`);
    }
  };

  const handleEditProduct = (item: InventoryItem) => {
    const newStockStr = window.prompt(`Ubah Jumlah Stok untuk "${item.name}":`, item.stock.toString());
    if (newStockStr !== null) {
      const newStock = parseInt(newStockStr, 10);
      if (!isNaN(newStock)) {
        setInventory((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, stock: newStock } : i))
        );
        onShowToast(currentLang === 'id' ? `✏️ Stok "${item.name}" diperbarui ke ${newStock}` : `✏️ Stock updated to ${newStock}`);
      }
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newProdName,
      category: newProdCategory,
      stock: Number(newProdStock),
      priceUSD: Number(newProdPrice),
      priceIDR: Number(newProdPrice) * 15500,
      imageUrl: newProdImageUrl
    };

    setInventory([newItem, ...inventory]);
    setIsAddProductOpen(false);
    setNewProdName('');
    setShowPhotoPicker(false);
    onShowToast(currentLang === 'id' ? '✅ Produk baru disimpan!' : '✅ New product saved!');
  };

  const handleSendWAAlert = () => {
    onShowToast(
      currentLang === 'id'
        ? '📱 Notifikasi Reorder WA terkirim ke Pemasok (3 Produk Restock)!'
        : '📱 WhatsApp Reorder Alert sent to Supplier (3 Restock Items)!'
    );
  };

  const handleBulkImportImei = () => {
    onShowToast(
      currentLang === 'id'
        ? '📦 Berhasil mengimpor 50 Nomor Serial IMEI ke Database System 95!'
        : '📦 Bulk import of 50 Serial IMEI numbers completed successfully!'
    );
  };

  return (
    <div className="bg-[#221746] min-h-screen text-[#e2e2e2] font-mono-retro select-none relative pb-16 touch-scroll overflow-y-auto">
      {/* Stars Decorative Elements */}
      <div className="absolute top-20 left-10 text-3xl text-[#fdbd4f] drop-shadow-[2px_2px_0_#000] pointer-events-none">✦</div>
      <div className="absolute top-40 right-20 text-xl text-[#fdbd4f] drop-shadow-[2px_2px_0_#000] pointer-events-none">✦</div>
      <div className="absolute bottom-40 left-20 text-2xl text-[#fdbd4f] drop-shadow-[2px_2px_0_#000] pointer-events-none">✦</div>
      <div className="absolute top-1/2 right-10 text-4xl text-[#fdbd4f] drop-shadow-[2px_2px_0_#000] pointer-events-none">✦</div>

      {/* Top Header Navigation & Module Taskbar */}
      <header className="fixed top-0 left-0 w-full h-14 bg-[#221746] border-b-4 border-black z-50 flex items-center justify-between px-4 sm:px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#1f9095] text-2xl sm:text-3xl">dashboard</span>
          <span className="font-space-retro font-bold text-[#1f9095] text-sm sm:text-lg tracking-widest hidden sm:inline">
            ilyasviel Admin V1.3
          </span>

          {/* Retro Taskbar Navigation Switcher */}
          <div className="flex items-center gap-1 bg-black/60 p-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <button
              onClick={() => onModuleChange('store')}
              className="px-2 sm:px-3 py-1 text-xs font-bold border border-black bg-[#1f1f21] text-gray-300 hover:bg-[#00A896] hover:text-white transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">language</span>
              <span className="hidden md:inline">{currentLang === 'id' ? '[ WEBSITE PELANGGAN ]' : '[ WEBSITE STORE ]'}</span>
              <span className="md:hidden">STORE</span>
            </button>
            <button
              onClick={() => onModuleChange('pos')}
              className="px-2 sm:px-3 py-1 text-xs font-bold border border-black bg-[#1f1f21] text-gray-300 hover:bg-[#df551f] hover:text-white transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">point_of_sale</span>
              <span className="hidden md:inline">{currentLang === 'id' ? '[ KASIR IPAD POS ]' : '[ IPAD POS ]'}</span>
              <span className="md:hidden">POS</span>
            </button>
            <button
              onClick={() => onModuleChange('admin')}
              className="px-2 sm:px-3 py-1 text-xs font-bold border border-white bg-[#6e4f9b] text-white shadow-[inset_1px_1px_0px_rgba(0,0,0,0.5)] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">analytics</span>
              <span className="hidden md:inline">{currentLang === 'id' ? '[ DASHBOARD ADMIN ]' : '[ ADMIN DASHBOARD ]'}</span>
              <span className="md:hidden">ADMIN</span>
            </button>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="retro-window px-2 py-0.5 bg-[#ecdaba] text-black text-xs font-bold border-2 border-black flex items-center gap-1 shadow-none">
            <button
              onClick={() => onLanguageChange('id')}
              className={`px-1.5 py-0.5 border border-black text-[10px] ${
                currentLang === 'id' ? 'bg-[#f17646] text-white font-bold' : 'bg-white text-black'
              }`}
            >
              ID
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-1.5 py-0.5 border border-black text-[10px] ${
                currentLang === 'en' ? 'bg-[#f17646] text-white font-bold' : 'bg-white text-black'
              }`}
            >
              EN
            </button>
          </div>

          <div className="w-8 h-8 bg-[#ecdaba] border-2 border-black flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-black text-xl">admin_panel_settings</span>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="font-space-retro text-4xl sm:text-6xl md:text-7xl font-bold text-[#f17646] uppercase tracking-tight drop-shadow-[4px_4px_0_rgba(0,0,0,1)] leading-none">
            RETRO ADMIN
          </h1>
          <p className="text-[#ecdaba] font-mono-retro mt-2 text-sm sm:text-base font-bold uppercase drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
            {currentLang === 'id'
              ? 'SUASANA RETRO KLASIK • DASHBOARD MANAJEMEN TOKO'
              : 'OLD SCHOOL VIBES • NEW SCHOOL DASHBOARD'}
          </p>
        </div>

        <div className="hidden md:block">
          <div className="w-56 h-48 bg-[#ecdaba] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center flex-col gap-2 p-3 relative text-black">
            <span className="material-symbols-outlined text-[#6e4f9b] text-6xl">computer</span>
            <div className="border-2 border-black bg-white px-2 py-1 text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">folder</span>
              <span>ilyasviel_admin.exe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
        {/* Left Column */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Analytics Reports Window */}
          <div className="retro-window flex flex-col bg-[#ecdaba] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
            {/* Window Title Bar */}
            <div className="retro-titlebar px-3 py-1.5 flex justify-between items-center bg-[#6e4f9b] text-white border-b-4 border-black">
              <span className="font-mono-retro text-xs font-bold tracking-widest uppercase">C:\ANALYTICS_REPORTS.EXE</span>
              <div className="flex gap-1">
                <button className="w-4 h-4 border-2 border-black bg-[#ecdaba] flex items-center justify-center text-[10px] text-black font-bold">_</button>
                <button className="w-4 h-4 border-2 border-black bg-[#ecdaba] flex items-center justify-center text-[10px] text-black font-bold">□</button>
                <button className="w-4 h-4 border-2 border-black bg-[#ecdaba] flex items-center justify-center text-[10px] text-black font-bold">X</button>
              </div>
            </div>

            <div className="p-4 flex-grow flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b-4 border-black pb-4">
                <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_0_#000]">
                  <div className="text-xs font-bold text-gray-700 mb-1">
                    {currentLang === 'id' ? 'Total Omzet Hari Ini' : 'Total Revenue Today'}
                  </div>
                  <div className="font-space-retro text-2xl font-bold text-[#6e4f9b]">
                    Rp 220.565.000
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold">($14,230 USD)</span>
                </div>
                <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_0_#000]">
                  <div className="text-xs font-bold text-gray-700 mb-1">Online vs POS</div>
                  <div className="font-space-retro text-2xl font-bold text-[#1f9095]">68% / 32%</div>
                  <span className="text-[10px] text-gray-500 font-bold">WEB: 168 | POS: 80</span>
                </div>
                <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_0_#000]">
                  <div className="text-xs font-bold text-gray-700 mb-1">
                    {currentLang === 'id' ? 'Item Terjual' : 'Items Sold'}
                  </div>
                  <div className="font-space-retro text-2xl font-bold text-[#f17646]">248 Unit</div>
                  <span className="text-[10px] text-gray-500 font-bold">+14% vs kemarin</span>
                </div>
              </div>

              {/* Sales Chart Graphic */}
              <div className="bg-white border-4 border-black p-3 h-48 relative overflow-hidden shadow-inner flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs font-bold text-black border-b border-gray-300 pb-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#1f9095]">trending_up</span>
                    <span>GRAFIK PENJUALAN MINGGUAN (REAL-TIME LOG)</span>
                  </span>
                  <span className="bg-[#1f9095] text-white px-2 py-0.5 text-[10px]">LIVE SYNC</span>
                </div>
                <div className="flex-1 flex items-end justify-between gap-2 pt-4 px-2">
                  {[
                    { day: 'SEN', val: 65, color: 'bg-[#1f9095]' },
                    { day: 'SEL', val: 40, color: 'bg-[#6e4f9b]' },
                    { day: 'RAB', val: 85, color: 'bg-[#f17646]' },
                    { day: 'KAM', val: 55, color: 'bg-[#1f9095]' },
                    { day: 'JUM', val: 95, color: 'bg-[#f17646]' },
                    { day: 'SAB', val: 110, color: 'bg-[#6e4f9b]' },
                    { day: 'MIN', val: 120, color: 'bg-[#fdbd4f]' },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div className="text-[10px] font-bold">{bar.val}</div>
                      <div
                        className={`w-full ${bar.color} border border-black shadow-[1px_1px_0_0_#000] transition-all hover:brightness-110`}
                        style={{ height: `${(bar.val / 130) * 100}%` }}
                      ></div>
                      <div className="text-[10px] font-bold border-t border-black w-full text-center pt-0.5">{bar.day}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Database Window */}
          <div className="retro-window flex flex-col bg-[#ecdaba] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
            <div className="retro-titlebar px-3 py-1.5 flex justify-between items-center bg-[#1f9095] text-white border-b-4 border-black">
              <span className="font-mono-retro text-xs font-bold tracking-widest uppercase">C:\INVENTORY_DATABASE.DB</span>
              <div className="flex gap-1">
                <button className="w-4 h-4 border-2 border-black bg-[#ecdaba] flex items-center justify-center text-[10px] text-black font-bold">_</button>
                <button className="w-4 h-4 border-2 border-black bg-[#ecdaba] flex items-center justify-center text-[10px] text-black font-bold">□</button>
                <button className="w-4 h-4 border-2 border-black bg-[#ecdaba] flex items-center justify-center text-[10px] text-black font-bold">X</button>
              </div>
            </div>

            <div className="p-4 flex-grow flex flex-col gap-4">
              <div className="overflow-x-auto border-2 border-black shadow-[2px_2px_0_0_#000]">
                <table className="w-full text-left border-collapse font-mono-retro text-xs bg-white text-black">
                  <thead className="bg-[#1f9095] text-white border-b-4 border-black">
                    <tr>
                      <th className="p-2 border-b-2 border-black">Nama Produk</th>
                      <th className="p-2 border-b-2 border-black">Kategori</th>
                      <th className="p-2 border-b-2 border-black">Harga (IDR)</th>
                      <th className="p-2 border-b-2 border-black">Sisa Stok</th>
                      <th className="p-2 border-b-2 border-black text-center">Aksi / Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-100 border-b border-gray-300">
                        <td className="p-2 font-bold">{item.name}</td>
                        <td className="p-2">
                          <span className="border-2 border-black bg-[#ecdaba] px-1.5 py-0.5 text-[10px] font-bold">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-2 font-bold text-[#350a00]">
                          Rp {item.priceIDR.toLocaleString('id-ID')}
                        </td>
                        <td className="p-2 font-bold">
                          <span className={`px-1.5 py-0.5 border border-black ${item.stock <= 2 ? 'bg-red-200 text-red-800' : 'bg-green-100 text-green-900'}`}>
                            {item.stock} Unit
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEditProduct(item)}
                              className="retro-button bg-[#00A896] text-white px-2 py-0.5 text-[10px] font-bold hover:bg-[#008f80]"
                              title="Edit stok produk"
                            >
                              [ EDIT ]
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(item.id, item.name)}
                              className="retro-button bg-[#df551f] text-white px-2 py-0.5 text-[10px] font-bold hover:bg-[#c94916]"
                              title="Hapus produk"
                            >
                              [ HAPUS ]
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap gap-3 mt-auto">
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="retro-button bg-[#f17646] text-white px-4 py-2 text-xs font-bold hover:bg-[#d65f32]"
                >
                  [+ TAMBAH PRODUK BARU]
                </button>
                <button
                  onClick={handleBulkImportImei}
                  className="retro-button bg-[#1f9095] text-white px-4 py-2 text-xs font-bold hover:bg-[#167478]"
                >
                  [BULK IMPORT IMEI]
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Critical Alerts Window */}
          <div className="retro-window flex flex-col border-4 border-[#f17646] bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="retro-titlebar px-3 py-1.5 flex justify-between items-center bg-[#f17646] text-white font-bold border-b-4 border-black">
              <span className="font-mono-retro text-xs tracking-widest uppercase text-black font-bold">
                ⚠️ CRITICAL_ALERTS.EXE
              </span>
              <div className="flex gap-1">
                <button className="w-4 h-4 border-2 border-black bg-white flex items-center justify-center text-[10px] text-black font-bold">_</button>
                <button className="w-4 h-4 border-2 border-black bg-white flex items-center justify-center text-[10px] text-black font-bold">□</button>
                <button className="w-4 h-4 border-2 border-black bg-white flex items-center justify-center text-[10px] text-black font-bold">X</button>
              </div>
            </div>

            <div className="p-4 flex-grow flex flex-col gap-3">
              <p className="text-xs font-bold text-red-600 border-b border-red-200 pb-1">
                {currentLang === 'id' ? 'STOK HAMPIR HABIS / DIBUTUHKAN RESTOCK:' : 'LOW STOCK / RESTOCK NEEDED:'}
              </p>

              <div className="space-y-2">
                <div className="bg-red-500 text-white p-2 border-3 border-black flex justify-between items-center shadow-[2px_2px_0_0_#000]">
                  <span className="font-bold text-xs">iPhone 15 Pro Max</span>
                  <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold">QTY: 1</span>
                </div>
                <div className="bg-red-500 text-white p-2 border-3 border-black flex justify-between items-center shadow-[2px_2px_0_0_#000]">
                  <span className="font-bold text-xs">MacBook Air M2</span>
                  <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold">QTY: 2</span>
                </div>
                <div className="bg-red-500 text-white p-2 border-3 border-black flex justify-between items-center shadow-[2px_2px_0_0_#000]">
                  <span className="font-bold text-xs">AirPods Pro Gen 2</span>
                  <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold">QTY: 0</span>
                </div>
              </div>

              <button
                onClick={handleSendWAAlert}
                className="retro-button bg-[#f17646] text-white w-full py-2.5 font-bold text-xs hover:bg-[#d65f32] mt-2 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>[KIRIM ALERT WA REORDER]</span>
              </button>
            </div>
          </div>

          {/* Quick Apps Window */}
          <div className="bg-[#1f9095] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col gap-2 font-mono-retro text-black">
            <h3 className="font-bold uppercase mb-1 border-b-2 border-black pb-1 text-white">
              🚀 APLIKASI CEPAT / QUICK APPS
            </h3>
            <button
              onClick={() => onShowToast(currentLang === 'id' ? '⚡ Membuka Modul Penjualan Baru' : '⚡ Opening New Sale module')}
              className="flex items-center gap-2 text-black hover:text-white font-bold text-xs text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>PENJUALAN BARU</span>
            </button>
            <button
              onClick={() => onShowToast(currentLang === 'id' ? '🔥 Menampilkan Produk Terlaris' : '🔥 Displaying Hot Items')}
              className="flex items-center gap-2 text-black hover:text-white font-bold text-xs text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">local_fire_department</span>
              <span>PRODUK TERLARIS</span>
            </button>
            <button
              onClick={() => onShowToast(currentLang === 'id' ? '🌐 Laporan Statistik Global Active' : '🌐 Global Stats active')}
              className="flex items-center gap-2 text-black hover:text-white font-bold text-xs text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">public</span>
              <span>STATISTIK GLOBAL</span>
            </button>
            <button
              onClick={() => onShowToast(currentLang === 'id' ? '💬 Chat Tim Kirai Connected' : '💬 Team Chat connected')}
              className="flex items-center gap-2 text-black hover:text-white font-bold text-xs text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">forum</span>
              <span>CHAT TIM ADMIN</span>
            </button>
            <button
              onClick={() => onShowToast(currentLang === 'id' ? '🔗 Portal Supplier Logistik Connected' : '🔗 Supplier Portal connected')}
              className="flex items-center gap-2 text-black hover:text-white font-bold text-xs text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">link</span>
              <span>PORTAL PEMASOK</span>
            </button>

            <div className="mt-3 border-t-2 border-black pt-3">
              <button
                onClick={() => onShowToast(currentLang === 'id' ? '🌐 Terhubung ke Webring Store 95' : '🌐 Joined Kirai Webring')}
                className="retro-button w-full py-2 bg-[#f17646] text-white font-bold text-xs flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">grid_view</span>
                <span>HUBUNGKAN WEBRING 95</span>
              </button>
            </div>
          </div>

          {/* Transactions Log Window */}
          <div className="retro-window flex flex-col bg-[#ecdaba] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
            <div className="retro-titlebar px-3 py-1.5 flex justify-between items-center bg-[#6e4f9b] text-white border-b-4 border-black">
              <span className="font-mono-retro text-xs font-bold tracking-widest uppercase">C:\TX_LOG.LOG</span>
              <div className="flex gap-1">
                <button className="w-4 h-4 border-2 border-black bg-[#ecdaba] flex items-center justify-center text-[10px] text-black font-bold">_</button>
                <button className="w-4 h-4 border-2 border-black bg-[#ecdaba] flex items-center justify-center text-[10px] text-black font-bold">□</button>
                <button className="w-4 h-4 border-2 border-black bg-[#ecdaba] flex items-center justify-center text-[10px] text-black font-bold">X</button>
              </div>
            </div>

            <div className="p-4 flex-grow flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>Filter Sumber:</span>
                <select
                  value={txFilter}
                  onChange={(e) => setTxFilter(e.target.value as any)}
                  className="retro-input px-2 py-1 text-xs font-bold bg-white"
                >
                  <option value="ALL">SEMUA SUMBER</option>
                  <option value="WEB">WEBSITE ONLY</option>
                  <option value="POS">KASIR POS ONLY</option>
                </select>
              </div>

              {/* Console Log Terminal */}
              <div className="bg-black text-[#00ff66] border-4 border-black p-3 font-mono text-xs overflow-y-auto max-h-48 whitespace-pre leading-relaxed shadow-inner">
                {filteredLogs.map((log) => (
                  <div key={log.id}>
                    &gt; {log.time} [{log.source}] {log.code} - {log.status} - Rp {log.amountIDR.toLocaleString('id-ID')}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onShowToast(currentLang === 'id' ? '📊 Mengunduh Laporan Transaksi (.XLSX)...' : '📊 Downloading Transaction Report (.XLSX)...')}
                  className="retro-button bg-[#1f9095] text-white flex-1 py-1.5 text-xs font-bold hover:bg-[#167478]"
                >
                  [EXCEL (.XLSX)]
                </button>
                <button
                  onClick={() => onShowToast(currentLang === 'id' ? '📄 Mengunduh Cetakan Laporan PDF...' : '📄 Downloading PDF Report...')}
                  className="retro-button bg-[#6e4f9b] text-white flex-1 py-1.5 text-xs font-bold hover:bg-[#583d80]"
                >
                  [PDF REPORT]
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add New Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 modal-backdrop overscroll-contain">
          <div className="retro-window max-w-md w-full bg-[#ecdaba] text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[85vh] overflow-y-auto touch-scroll overscroll-contain">
            <div className="retro-titlebar bg-black text-white p-2 flex justify-between items-center text-xs font-bold">
              <span>➕ TAMBAH PRODUK BARU TOKO</span>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="bg-gray-200 text-black px-1.5 hover:bg-white font-bold"
              >
                X
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-4 flex flex-col gap-3 font-mono-retro text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold">Nama Produk Electronic:</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="cth: GameBoy Color 1998 Edition"
                  className="retro-input p-2 font-bold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold">Kategori:</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="retro-input p-2 font-bold bg-white"
                >
                  <option value="PHONE">PHONE (HANDPHONE)</option>
                  <option value="LAPTOP">LAPTOP RETRO</option>
                  <option value="TABLET">TABLET / IPAD</option>
                  <option value="AUDIO">AUDIO & SPEAKER</option>
                  <option value="ACC">AKSESORI</option>
                </select>
              </div>

              {/* URL / Upload Foto Produk */}
              <div className="flex flex-col gap-2 p-2.5 bg-[#f4f1de] border-2 border-black">
                <div className="flex justify-between items-center text-black">
                  <label className="font-bold">URL / Upload Foto Produk:</label>
                  <button
                    type="button"
                    onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                    className="retro-button bg-[#00a896] text-white px-2 py-1 text-[11px] font-bold uppercase flex items-center gap-1 hover:bg-[#008f80] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <span>📷</span>
                    <span>[ 📷 PILIH FOTO ]</span>
                  </button>
                </div>

                <input
                  type="text"
                  required
                  value={newProdImageUrl}
                  onChange={(e) => setNewProdImageUrl(e.target.value)}
                  placeholder="Masukkan URL foto atau pilih dari galeri..."
                  className="retro-input p-2 font-bold text-xs bg-white text-black w-full"
                />

                {/* Preset Photo Gallery Drawer */}
                {showPhotoPicker && (
                  <div className="p-2 bg-white border-2 border-black grid grid-cols-2 gap-2 mt-1">
                    <span className="col-span-2 text-[10px] font-bold text-black border-b border-black pb-1">
                      PILIH TEMPLATE FOTO RETRO:
                    </span>
                    {PRESET_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNewProdImageUrl(img.url);
                          setShowPhotoPicker(false);
                        }}
                        className="border-2 border-black hover:bg-[#ffb59d] p-1 bg-gray-100 flex items-center gap-2 text-left"
                      >
                        <img src={img.url} alt={img.name} className="w-8 h-8 object-contain shrink-0" />
                        <span className="text-[10px] font-bold truncate text-black">{img.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Live Image Preview Box */}
                <div className="flex items-center gap-3 bg-white p-2 border-2 border-black mt-1">
                  <div className="w-14 h-14 bg-gray-100 border-2 border-black flex items-center justify-center overflow-hidden shrink-0">
                    {newProdImageUrl ? (
                      <img
                        src={newProdImageUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Error';
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 text-[9px] font-bold">No Image</span>
                    )}
                  </div>
                  <div className="flex flex-col text-[10px] font-bold text-gray-700 leading-tight">
                    <span className="text-black font-space-retro text-xs uppercase">PRATINJAU GMBR (PREVIEW):</span>
                    <span className="text-[#00a896] mt-0.5">✓ Foto Siap Ditampilkan</span>
                    <span className="text-gray-500 truncate max-w-[190px] text-[9px] mt-0.5">{newProdImageUrl}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-bold">Jumlah Stok:</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="retro-input p-2 font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold">Harga USD ($):</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="retro-input p-2 font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="retro-button bg-[#f17646] text-white font-bold px-4 py-2 flex-1 text-xs uppercase"
                >
                  SIMPAN PRODUK
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="retro-button bg-gray-300 text-black font-bold px-4 py-2 flex-1 text-xs uppercase"
                >
                  BATAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-6 bg-[#1c123f] border-t-2 border-black py-2 px-4 relative z-10 text-center text-[10px] sm:text-xs font-mono-retro text-[#1f9095]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <span>© 1995-2026 ILYASVIEL STUDIOS • DASHBOARD SYSTEM 95 ADMIN</span>
          <span className="text-[#ecdaba] font-bold">MADE WITH ♥ FOR RETRO TECH STORE</span>
        </div>
      </footer>
    </div>
  );
};
