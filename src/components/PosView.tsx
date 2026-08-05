import React, { useState } from 'react';
import { Language, TranslationDictionary, PosProduct, PosCartItem, ActiveModule } from '../types';
import { posProducts } from '../data/translations';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface PosViewProps {
  currentLang: Language;
  t: TranslationDictionary;
  onLanguageChange: (lang: Language) => void;
  onSwitchToStoreView: () => void;
  onModuleChange?: (module: ActiveModule) => void;
  onShowToast?: (msg: string) => void;
}

export const PosView: React.FC<PosViewProps> = ({
  currentLang,
  t,
  onLanguageChange,
  onSwitchToStoreView,
  onModuleChange,
  onShowToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Default cart matching the Google Stitch mock: ThinkPad X1 (1) & Pixel 8 Pro (2)
  const [cartItems, setCartItems] = useState<PosCartItem[]>([
    {
      product: posProducts[0],
      quantity: 1,
      imeiList: ['']
    },
    {
      product: posProducts[1],
      quantity: 2,
      imeiList: ['35912839481923', '']
    }
  ]);

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'bank'>('cash');
  const [cashInputRaw, setCashInputRaw] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState<boolean>(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState<boolean>(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState<boolean>(false);
  const [selectedPosBank, setSelectedPosBank] = useState<'bca' | 'mandiri' | 'bri' | 'bni'>('bca');
  const [copiedPosBank, setCopiedPosBank] = useState<boolean>(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState<boolean>(false);
  const [completedReceiptData, setCompletedReceiptData] = useState<{
    receiptNo: string;
    items: PosCartItem[];
    subtotal: number;
    tax: number;
    grandTotal: number;
    cashReceived: number;
    changeDue: number;
    paymentMethod: string;
    date: string;
  } | null>(null);

  const [shiftCount, setShiftCount] = useState<number>(1);
  const [totalShiftRevenue, setTotalShiftRevenue] = useState<number>(36596700);

  useBodyScrollLock(isCompletedModalOpen || isQrisModalOpen || isCashModalOpen || isBankModalOpen);

  const POS_BANK_DETAILS = {
    bca: { name: 'BANK BCA', accNo: '8820-1928-1029', holder: 'PT ILYASVIEL STORE INDONESIA' },
    mandiri: { name: 'BANK MANDIRI', accNo: '13700-8812-3391', holder: 'PT ILYASVIEL STORE INDONESIA' },
    bri: { name: 'BANK BRI', accNo: '0021-0100-8912-501', holder: 'PT ILYASVIEL STORE INDONESIA' },
    bni: { name: 'BANK BNI', accNo: '0091-8821-3910', holder: 'PT ILYASVIEL STORE INDONESIA' }
  };

  const handleCopyPosBank = (accNo: string) => {
    navigator.clipboard.writeText(accNo.replace(/-/g, ''));
    setCopiedPosBank(true);
    setTimeout(() => setCopiedPosBank(false), 3000);
  };

  const handleOpenPaymentModal = (method: 'cash' | 'qris' | 'bank') => {
    if (cartItems.length === 0) {
      if (onShowToast) {
        onShowToast(currentLang === 'id' ? '⚠️ Tambahkan produk ke keranjang POS terlebih dahulu' : '⚠️ Add products to POS cart first');
      }
      return;
    }
    setPaymentMethod(method);
    if (method === 'cash') {
      if (cashInputRaw === 0 || cashInputRaw < grandTotal) setCashInputRaw(grandTotal);
      setIsCashModalOpen(true);
    } else if (method === 'qris') {
      setIsQrisModalOpen(true);
    } else if (method === 'bank') {
      setIsBankModalOpen(true);
    }
  };

  // Filter products
  const filteredProducts = posProducts.filter((p) => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.priceIDR * item.quantity, 0);
  const tax = Math.round(subtotal * 0.11);
  const grandTotal = subtotal + tax;
  const changeDue = Math.max(0, cashInputRaw - grandTotal);
  const isCashInsufficient = paymentMethod === 'cash' && cashInputRaw < grandTotal;

  // Add product to cart
  const handleAddToCart = (product: PosProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + 1;
        const newImei = [...existing.imeiList, ''];
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: newQty, imeiList: newImei }
            : i
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          imeiList: product.requiresImei ? [''] : []
        }
      ];
    });
    if (onShowToast) {
      onShowToast(currentLang === 'id' ? `Produk masuk keranjang! (${product.name})` : `Product added to cart! (${product.name})`);
    }
  };

  // Update item quantity
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            let newImei = [...item.imeiList];
            if (delta > 0) {
              newImei.push('');
            } else {
              newImei.pop();
            }
            return { ...item, quantity: newQty, imeiList: newImei };
          }
          return item;
        })
        .filter(Boolean) as PosCartItem[];
    });
  };

  // Remove item
  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // Update IMEI text
  const handleImeiChange = (productId: string, index: number, value: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const updatedImei = [...item.imeiList];
          updatedImei[index] = value;
          return { ...item, imeiList: updatedImei };
        }
        return item;
      })
    );
  };

  // Simulate Scan Barcode / IMEI
  const handleScanBarcode = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const randomImei = `IMEI-${Math.floor(100000000000000 + Math.random() * 900000000000000)}`;

      // Check if there is an empty IMEI in cart
      let imeiFilled = false;
      const updatedCart = cartItems.map((item) => {
        if (!imeiFilled && item.product.requiresImei) {
          const emptyIdx = item.imeiList.findIndex((val) => !val.trim());
          if (emptyIdx !== -1) {
            const nextList = [...item.imeiList];
            nextList[emptyIdx] = randomImei;
            imeiFilled = true;
            return { ...item, imeiList: nextList };
          }
        }
        return item;
      });

      if (imeiFilled) {
        setCartItems(updatedCart);
      } else {
        // Add Pixel 8 Pro with scanned IMEI
        const targetProd = posProducts[1];
        handleAddToCart(targetProd);
        setTimeout(() => {
          setCartItems((latest) =>
            latest.map((item) => {
              if (item.product.id === targetProd.id) {
                const list = [...item.imeiList];
                if (list.length > 0) list[list.length - 1] = randomImei;
                return { ...item, imeiList: list };
              }
              return item;
            })
          );
        }, 50);
      }
    }, 800);
  };

  // Complete & Print
  const handleCompleteOrder = (methodOverride?: 'cash' | 'qris' | 'bank') => {
    if (cartItems.length === 0) {
      alert(currentLang === 'id' ? 'Keranjang POS kosong!' : 'POS Cart is empty!');
      return;
    }
    const finalMethod = methodOverride || paymentMethod;
    if (finalMethod === 'cash' && cashInputRaw < grandTotal) {
      alert(currentLang === 'id' ? 'Uang tunai kurang!' : 'Insufficient cash received!');
      return;
    }

    const receiptNo = `KR-POS-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toLocaleString(currentLang === 'id' ? 'id-ID' : 'en-US');

    setCompletedReceiptData({
      receiptNo,
      items: [...cartItems],
      subtotal,
      tax,
      grandTotal,
      cashReceived: finalMethod === 'cash' ? cashInputRaw : grandTotal,
      changeDue: finalMethod === 'cash' ? Math.max(0, cashInputRaw - grandTotal) : 0,
      paymentMethod: finalMethod.toUpperCase(),
      date: now
    });

    setTotalShiftRevenue((prev) => prev + grandTotal);
    setShiftCount((prev) => prev + 1);
    setIsQrisModalOpen(false);
    setIsCashModalOpen(false);
    setIsBankModalOpen(false);
    setIsCompletedModalOpen(true);
    if (onShowToast) {
      onShowToast(currentLang === 'id' ? 'Transaksi POS Sukses!' : 'POS Transaction Successful!');
    }
  };

  // Reset after printing
  const handleCloseReceipt = () => {
    setIsCompletedModalOpen(false);
    setCartItems([]);
  };

  return (
    <div id="pos-root" className="bg-[#0d1c32] min-h-screen w-full flex flex-col font-mono-retro text-[#e4e2e4] select-none relative touch-scroll overflow-y-auto">
      {/* TopAppBar */}
      <header className="bg-[#b9c7e4] dark:bg-[#0a192f] text-[#0d1c32] dark:text-[#74829d] flex flex-wrap justify-between items-center h-16 px-4 sm:px-6 w-full border-b-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onSwitchToStoreView}
            className="retro-button px-2.5 py-1 text-xs font-bold text-black bg-[#F4F1DE] hover:bg-[#df551f] hover:text-white flex items-center gap-1"
            title="Kembali Ke Store View"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span className="hidden sm:inline">ILYASVIEL 95 STORE</span>
          </button>
          
          {/* Module Taskbar Switcher inside POS Header */}
          {onModuleChange && (
            <div className="flex items-center gap-1 bg-black/60 p-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <button
                onClick={() => onModuleChange('store')}
                className="px-2 py-0.5 text-xs font-bold border border-black bg-[#1f1f21] text-gray-300 hover:bg-[#00A896] hover:text-white transition-all flex items-center gap-1"
              >
                <span>🌐</span>
                <span className="hidden md:inline">{currentLang === 'id' ? '[ 🌐 WEBSITE PELANGGAN ]' : '[ 🌐 WEBSITE STORE ]'}</span>
                <span className="md:hidden">STORE</span>
              </button>
              <button
                onClick={() => onModuleChange('pos')}
                className="px-2 py-0.5 text-xs font-bold border border-white bg-[#df551f] text-white shadow-[inset_1px_1px_0px_rgba(0,0,0,0.5)] flex items-center gap-1"
              >
                <span>🖥️</span>
                <span className="hidden md:inline">{currentLang === 'id' ? '[ 🖥️ KASIR IPAD POS ]' : '[ 🖥️ IPAD POS ]'}</span>
                <span className="md:hidden">POS</span>
              </button>
              <button
                onClick={() => onModuleChange('admin')}
                className="px-2 py-0.5 text-xs font-bold border border-black bg-[#1f1f21] text-gray-300 hover:bg-[#6e4f9b] hover:text-white transition-all flex items-center gap-1"
              >
                <span>📊</span>
                <span className="hidden md:inline">{currentLang === 'id' ? '[ 📊 DASHBOARD ADMIN ]' : '[ 📊 DASHBOARD ADMIN ]'}</span>
                <span className="md:hidden">ADMIN</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse border-2 border-black"></div>
            <span className="font-mono-retro text-xs uppercase font-bold text-green-400">ONLINE</span>
          </div>

          <button
            onClick={() =>
              alert(
                currentLang === 'id'
                  ? `[AKHIR SHIFT HASIL]\nTotal Transaksi: ${shiftCount} Transaksi\nTotal Pendapatan: Rp ${totalShiftRevenue.toLocaleString('id-ID')}`
                  : `[SHIFT END SUMMARY]\nTotal Orders: ${shiftCount} Orders\nTotal Revenue: Rp ${totalShiftRevenue.toLocaleString('id-ID')}`
              )
            }
            className="retro-button bg-[#ffb59d] text-[#390c00] font-mono-retro text-xs px-3 py-1.5 uppercase font-bold border-2 border-black hover:bg-[#df551f] hover:text-white"
          >
            {t.pos_shift_end}
          </button>
        </div>
      </header>

      {/* Barcode Scanner overlay banner */}
      {isScanning && (
        <div className="absolute inset-x-0 top-16 z-50 bg-[#df551f] text-white p-2 text-center font-mono-retro text-xs font-bold animate-pulse border-b-4 border-black">
          📟 SCANNING BARCODE / IMEI CODE... PLEASE WAIT...
        </div>
      )}

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-3 sm:p-4 md:p-6 md:overflow-hidden max-w-[1600px] w-full mx-auto pb-24 md:pb-6">
        {/* Left Column: Catalog (Lebar ~65% pada iPad / Tablet / Desktop) */}
        <div className="w-full md:w-[62%] lg:w-[65%] flex flex-col gap-3 md:gap-4 md:h-full md:overflow-hidden">
          {/* Search & Scan Bar */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-black">search</span>
              <input
                id="pos-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.pos_search_ph}
                className="retro-input w-full h-11 sm:h-12 pl-10 pr-4 font-mono-retro text-xs sm:text-sm focus:outline-none"
              />
            </div>
            <button
              id="btn-scan-barcode"
              onClick={handleScanBarcode}
              className="retro-button bg-[#00a896] text-[#000000] font-mono-retro text-xs px-3 sm:px-4 h-11 sm:h-12 flex items-center justify-center gap-1.5 uppercase font-black shrink-0 hover:bg-[#008f80] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <span className="material-symbols-outlined text-[#000000] text-sm sm:text-base">qr_code_scanner</span>
              <span className="text-[#000000] font-extrabold">{t.pos_scan_barcode}</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 sm:gap-2 shrink-0 overflow-x-auto pb-1 touch-scroll">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`retro-button px-4 sm:px-5 py-2 uppercase text-xs font-black border-2 border-black text-[#000000] shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#df551f] shadow-none translate-x-[2px] translate-y-[2px]'
                  : 'bg-[#e6e3d0] hover:bg-white'
              }`}
            >
              {t.btn_all}
            </button>
            <button
              onClick={() => setSelectedCategory('laptop')}
              className={`retro-button px-4 sm:px-5 py-2 uppercase text-xs font-black border-2 border-black text-[#000000] shrink-0 ${
                selectedCategory === 'laptop'
                  ? 'bg-[#df551f] shadow-none translate-x-[2px] translate-y-[2px]'
                  : 'bg-[#e6e3d0] hover:bg-white'
              }`}
            >
              {t.btn_laptop}
            </button>
            <button
              onClick={() => setSelectedCategory('phone')}
              className={`retro-button px-4 sm:px-5 py-2 uppercase text-xs font-black border-2 border-black text-[#000000] shrink-0 ${
                selectedCategory === 'phone'
                  ? 'bg-[#df551f] shadow-none translate-x-[2px] translate-y-[2px]'
                  : 'bg-[#e6e3d0] hover:bg-white'
              }`}
            >
              {t.btn_phone}
            </button>
            <button
              onClick={() => setSelectedCategory('acc')}
              className={`retro-button px-4 sm:px-5 py-2 uppercase text-xs font-black border-2 border-black text-[#000000] shrink-0 ${
                selectedCategory === 'acc'
                  ? 'bg-[#df551f] shadow-none translate-x-[2px] translate-y-[2px]'
                  : 'bg-[#e6e3d0] hover:bg-white'
              }`}
            >
              {t.btn_acc}
            </button>
          </div>

          {/* Product Grid */}
          <div className="flex-1 md:overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 content-start pb-4 md:pb-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleAddToCart(product)}
                className="retro-window flex flex-col h-60 sm:h-64 bg-[#e6e3d0] cursor-pointer hover:bg-white transition-all group"
              >
                <div className="h-28 sm:h-32 bg-white border-b-3 border-black p-2 flex items-center justify-center relative overflow-hidden">
                  <div
                    className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform group-hover:scale-105"
                    style={{ backgroundImage: `url('${product.imageUrl}')` }}
                  ></div>
                  <div className="absolute top-2 right-2 bg-black text-white text-[10px] px-2 py-0.5 font-bold border-2 border-white">
                    {t.pos_stock}: {product.stock}
                  </div>
                </div>

                <div className="p-3 flex flex-col flex-1 justify-between text-black">
                  <div className="font-mono-retro text-xs font-bold leading-tight group-hover:text-[#df551f]">
                    {product.name}
                  </div>
                  <div className="font-space-retro text-base sm:text-lg font-bold text-[#00a896]">
                    Rp {product.priceIDR.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Current Order & Cashier Calculator (Lebar ~35%, Sticky pada Desktop/Tablet) */}
        <div
          id="pos-order-cart"
          className="w-full md:w-[38%] lg:w-[35%] flex flex-col md:h-full shrink-0 md:sticky md:top-2 md:self-start"
        >
          <div className="retro-window flex-1 flex flex-col overflow-hidden bg-[#e6e3d0] text-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* Window Header */}
            <div className="retro-titlebar bg-black text-white font-mono-retro text-xs font-bold uppercase h-9 px-3 flex justify-between items-center select-none shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#00A896]">shopping_cart</span>
                <span>{t.pos_current_order} #KR-00{shiftCount}</span>
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCartItems([])}
                  title="Kosongkan Pesanan"
                  className="w-5 h-5 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-red-400 font-bold text-xs"
                >
                  X
                </button>
              </div>
            </div>

            {/* Order Items List */}
            <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 flex flex-col gap-2.5 border-b-3 border-black bg-white min-h-[160px] max-h-[320px] md:max-h-none">
              {cartItems.length === 0 ? (
                <div className="py-8 sm:py-12 text-center text-gray-500 font-mono-retro text-xs">
                  <span className="material-symbols-outlined text-4xl block mb-2 text-gray-400">add_shopping_cart</span>
                  <span>{currentLang === 'id' ? 'Belum ada item dipilih.' : 'No items added yet.'}</span>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex flex-col gap-2 p-2.5 border-2 border-black border-dashed bg-[#e6e3d0]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-mono-retro text-xs font-bold text-black">{item.product.name}</div>
                      <div className="font-mono-retro text-xs font-bold text-[#350a00]">
                        Rp {(item.product.priceIDR * item.quantity).toLocaleString('id-ID')}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, -1)}
                          className="retro-button bg-white w-7 h-7 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="font-bold w-6 text-center text-xs">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, 1)}
                          className="retro-button bg-white w-7 h-7 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="text-red-600 font-bold text-xs uppercase hover:underline"
                      >
                        {t.pos_remove}
                      </button>
                    </div>

                    {/* IMEI Inputs if required */}
                    {item.product.requiresImei && (
                      <div className="flex flex-col gap-1.5 mt-1">
                        {item.imeiList.map((imeiVal, idx) => (
                          <div key={idx} className="relative">
                            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                              barcode_scanner
                            </span>
                            <input
                              type="text"
                              value={imeiVal}
                              onChange={(e) => handleImeiChange(item.product.id, idx, e.target.value)}
                              placeholder={`${t.pos_imei_ph} #${idx + 1}`}
                              className={`retro-input w-full h-8 pl-7 pr-2 text-xs font-mono-retro ${
                                imeiVal.trim()
                                  ? 'bg-green-100 border-green-600 font-bold'
                                  : 'bg-red-50 border-red-500'
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Order Summary & Payment Section */}
            <div className="p-3 sm:p-3.5 flex flex-col gap-2.5 sm:gap-3 bg-[#e6e3d0] shrink-0 font-mono-retro text-xs">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>{t.pos_subtotal}</span>
                  <span className="font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.pos_tax}</span>
                  <span className="font-bold">Rp {tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center mt-1 pt-1 border-t-2 border-black">
                  <span className="font-space-retro text-sm font-bold uppercase">{t.pos_grand_total}</span>
                  <span className="font-space-retro text-lg sm:text-xl font-bold text-[#00a896]">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Payment Methods Selector */}
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenPaymentModal('cash')}
                  className={`retro-button flex-1 py-2 font-mono-retro font-bold text-[11px] uppercase flex items-center justify-center gap-1 ${
                    paymentMethod === 'cash' ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">payments</span>
                  <span>TUNAI</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenPaymentModal('qris')}
                  className={`retro-button flex-1 py-2 font-mono-retro font-bold text-[11px] uppercase flex items-center justify-center gap-1 ${
                    paymentMethod === 'qris' ? 'bg-[#00A896] text-white' : 'bg-white text-black'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">qr_code</span>
                  <span>QRIS</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenPaymentModal('bank')}
                  className={`retro-button flex-1 py-2 font-mono-retro font-bold text-[11px] uppercase flex items-center justify-center gap-1 ${
                    paymentMethod === 'bank' ? 'bg-[#00529C] text-white' : 'bg-white text-black'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">account_balance</span>
                  <span>BANK</span>
                </button>
              </div>

              {/* Quick Cash Info Summary */}
              {paymentMethod === 'cash' && cashInputRaw > 0 && (
                <div className="flex justify-between items-center bg-white p-2 border border-black text-[11px]">
                  <span>Diterima: <strong>Rp {cashInputRaw.toLocaleString('id-ID')}</strong></span>
                  <span>Kembali: <strong className={cashInputRaw < grandTotal ? 'text-red-600' : 'text-green-800'}>
                    {cashInputRaw < grandTotal ? 'Kurang' : `Rp ${(cashInputRaw - grandTotal).toLocaleString('id-ID')}`}
                  </strong></span>
                </div>
              )}

              {/* Complete & Print Button */}
              <button
                id="btn-pos-complete"
                type="button"
                onClick={() => handleOpenPaymentModal(paymentMethod)}
                disabled={cartItems.length === 0}
                className={`retro-button w-full h-11 sm:h-12 text-white font-space-retro text-xs sm:text-sm uppercase font-bold tracking-tight flex items-center justify-center gap-2 ${
                  cartItems.length === 0
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-[#df551f] hover:bg-[#c44615]'
                }`}
              >
                <span className="material-symbols-outlined">receipt_long</span>
                <span>{t.pos_complete_print}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Bar for Mobile (< 768px) */}
      {cartItems.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a192f] border-t-4 border-black p-2.5 shadow-[0px_-4px_12px_rgba(0,0,0,0.8)] flex items-center justify-between font-mono-retro">
          <div className="flex flex-col text-white">
            <span className="text-[10px] text-[#00A896] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">shopping_cart</span>
              <span>{cartItems.reduce((acc, i) => acc + i.quantity, 0)} ITEM | TOTAL POS</span>
            </span>
            <span className="font-space-retro text-sm font-extrabold text-[#df551f]">
              Rp {grandTotal.toLocaleString('id-ID')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const cartElem = document.getElementById('pos-order-cart');
              if (cartElem) {
                cartElem.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="retro-button bg-[#df551f] hover:bg-[#c44615] text-white px-3.5 py-2 text-xs font-bold uppercase flex items-center gap-1.5 border-2 border-black shadow-[2px_2px_0px_#000]"
          >
            <span className="material-symbols-outlined text-sm">payments</span>
            <span>PROSES BAYAR</span>
          </button>
        </div>
      )}

      {/* POS QRIS Modal Display */}
      {isQrisModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 modal-backdrop overscroll-contain">
          <div className="retro-window max-w-lg w-full bg-[#F4F1DE] text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-mono-retro overscroll-contain">
            <div className="retro-titlebar bg-[#00A896] text-white p-2 flex justify-between items-center text-xs font-bold border-b-2 border-black">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">qr_code_2</span>
                <span>C:\ILYASVIEL\POS_QRIS_DISPLAY.EXE</span>
              </div>
              <button onClick={() => setIsQrisModalOpen(false)} className="w-5 h-5 bg-gray-200 text-black border border-black flex items-center justify-center text-xs font-bold hover:bg-white">X</button>
            </div>

            <div className="p-4 flex flex-col items-center gap-3 text-center">
              <div className="bg-[#1f9095] text-white px-3 py-1.5 border-2 border-black font-bold text-xs uppercase w-full">
                SISTEM PEMBAYARAN QRIS PRESISI POS 95
              </div>

              <div className="bg-white p-3 border-2 border-black w-full shadow-[2px_2px_0px_#000]">
                <span className="text-gray-600 font-bold text-xs">TOTAL TAGIHAN POS:</span>
                <div className="text-2xl font-extrabold text-[#df551f]">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Big Retro QR Code Display */}
              <div className="p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center my-1">
                <div className="w-52 h-52 border-2 border-black p-2 bg-white flex flex-col items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="5" width="25" height="25" fill="black"/>
                    <rect x="9" y="9" width="17" height="17" fill="white"/>
                    <rect x="13" y="13" width="9" height="9" fill="black"/>

                    <rect x="70" y="5" width="25" height="25" fill="black"/>
                    <rect x="74" y="9" width="17" height="17" fill="white"/>
                    <rect x="78" y="13" width="9" height="9" fill="black"/>

                    <rect x="5" y="70" width="25" height="25" fill="black"/>
                    <rect x="9" y="74" width="17" height="17" fill="white"/>
                    <rect x="13" y="78" width="9" height="9" fill="black"/>

                    <rect x="35" y="5" width="5" height="15" fill="black"/>
                    <rect x="45" y="10" width="10" height="5" fill="black"/>
                    <rect x="60" y="5" width="5" height="25" fill="black"/>

                    <rect x="5" y="35" width="20" height="5" fill="black"/>
                    <rect x="10" y="45" width="15" height="15" fill="black"/>
                    <rect x="30" y="30" width="40" height="40" fill="#00A896"/>
                    <rect x="38" y="38" width="24" height="24" fill="white"/>
                    <text x="50" y="53" fill="black" fontSize="7" fontWeight="bold" textAnchor="middle">POS 95</text>

                    <rect x="75" y="35" width="20" height="10" fill="black"/>
                    <rect x="80" y="50" width="15" height="15" fill="black"/>

                    <rect x="35" y="75" width="15" height="10" fill="black"/>
                    <rect x="55" y="70" width="10" height="25" fill="black"/>
                    <rect x="70" y="75" width="25" height="5" fill="black"/>
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-black mt-1">
                  NMID: ID1020269588120 (KASIR UTAMA)
                </span>
              </div>

              <p className="text-xs font-bold text-gray-800">
                📲 Arahkan layar ini ke pembeli. Pembeli dapat melakukan scan QRIS menggunakan GoPay, OVO, DANA, ShopeePay, atau M-Banking.
              </p>

              <button
                onClick={() => handleCompleteOrder('qris')}
                className="retro-button bg-[#00A896] hover:bg-[#008f80] text-white font-bold px-6 py-3 w-full text-xs uppercase flex items-center justify-center gap-2 mt-2"
              >
                <span className="material-symbols-outlined text-sm">task_alt</span>
                <span>✅ KONFIRMASI LUNAS & CETAK STRUK</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS Cash Calculator Modal */}
      {isCashModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 modal-backdrop overscroll-contain">
          <div className="retro-window max-w-lg w-full bg-[#ecdaba] text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-mono-retro overscroll-contain">
            <div className="retro-titlebar bg-black text-white p-2 flex justify-between items-center text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">calculate</span>
                <span>C:\ILYASVIEL\POS_CASH_CALCULATOR.EXE</span>
              </div>
              <button onClick={() => setIsCashModalOpen(false)} className="bg-gray-200 text-black px-1.5 hover:bg-white font-bold">X</button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div className="bg-white p-3 border-2 border-black flex justify-between items-center shadow-[2px_2px_0px_#000]">
                <span className="font-bold text-xs text-gray-700">TOTAL TAGIHAN POS:</span>
                <span className="font-space-retro font-extrabold text-xl text-[#df551f]">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>

              <div>
                <label className="font-bold text-xs block mb-1">JUMLAH UANG DITERIMA (RP):</label>
                <input
                  type="number"
                  value={cashInputRaw || ''}
                  onChange={(e) => setCashInputRaw(Number(e.target.value))}
                  className="retro-input w-full h-10 px-3 font-bold text-right text-base bg-white border-2 border-black"
                  placeholder="Masukkan nominal uang..."
                />
              </div>

              {/* Preset Cash Buttons */}
              <div>
                <span className="text-[11px] font-bold text-gray-700 block mb-1">PRESET NOMINAL UANG CEPAT:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCashInputRaw(grandTotal)}
                    className="retro-button bg-[#00A896] text-white py-1.5 px-1 font-bold text-xs hover:bg-[#008f80]"
                  >
                    Uang Pas
                  </button>
                  <button
                    type="button"
                    onClick={() => setCashInputRaw(50000)}
                    className="retro-button bg-white text-black py-1.5 px-1 font-bold text-xs hover:bg-gray-100"
                  >
                    Rp 50K
                  </button>
                  <button
                    type="button"
                    onClick={() => setCashInputRaw(100000)}
                    className="retro-button bg-white text-black py-1.5 px-1 font-bold text-xs hover:bg-gray-100"
                  >
                    Rp 100K
                  </button>
                  <button
                    type="button"
                    onClick={() => setCashInputRaw(500000)}
                    className="retro-button bg-white text-black py-1.5 px-1 font-bold text-xs hover:bg-gray-100"
                  >
                    Rp 500K
                  </button>
                  <button
                    type="button"
                    onClick={() => setCashInputRaw((prev) => prev + 50000)}
                    className="retro-button bg-white text-black py-1.5 px-1 font-bold text-xs hover:bg-gray-100"
                  >
                    +50K
                  </button>
                  <button
                    type="button"
                    onClick={() => setCashInputRaw((prev) => prev + 100000)}
                    className="retro-button bg-white text-black py-1.5 px-1 font-bold text-xs hover:bg-gray-100"
                  >
                    +100K
                  </button>
                  <button
                    type="button"
                    onClick={() => setCashInputRaw((prev) => prev + 500000)}
                    className="retro-button bg-white text-black py-1.5 px-1 font-bold text-xs hover:bg-gray-100"
                  >
                    +500K
                  </button>
                  <button
                    type="button"
                    onClick={() => setCashInputRaw(50000000)}
                    className="retro-button bg-white text-black py-1.5 px-1 font-bold text-xs hover:bg-gray-100"
                  >
                    Rp 50JT
                  </button>
                </div>
              </div>

              {/* Change Calculator Display */}
              <div className="p-3 border-2 border-black mt-1">
                {cashInputRaw < grandTotal ? (
                  <div className="bg-red-100 text-red-800 p-2 border border-red-500 font-bold text-xs flex justify-between items-center">
                    <span>⚠️ UANG HARI INI KURANG:</span>
                    <span className="text-sm">Rp {(grandTotal - cashInputRaw).toLocaleString('id-ID')}</span>
                  </div>
                ) : (
                  <div className="bg-green-100 text-green-900 p-2 border border-green-600 font-bold text-xs flex justify-between items-center">
                    <span>💵 UANG KEMBALIAN (CHANGE DUE):</span>
                    <span className="text-base text-green-800 font-extrabold">Rp {(cashInputRaw - grandTotal).toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleCompleteOrder('cash')}
                disabled={cashInputRaw < grandTotal}
                className={`retro-button font-bold px-6 py-3 w-full text-xs uppercase flex items-center justify-center gap-2 mt-1 ${
                  cashInputRaw < grandTotal
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-50'
                    : 'bg-[#df551f] hover:bg-[#c44615] text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">receipt_long</span>
                <span>✅ BAYAR TUNAI & CETAK STRUK</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS Bank Transfer Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 modal-backdrop overscroll-contain">
          <div className="retro-window max-w-lg w-full bg-[#F4F1DE] text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-mono-retro overscroll-contain">
            <div className="retro-titlebar bg-[#00529C] text-white p-2 flex justify-between items-center text-xs font-bold border-b-2 border-black">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">account_balance</span>
                <span>C:\ILYASVIEL\POS_BANK_TRANSFER.EXE</span>
              </div>
              <button onClick={() => setIsBankModalOpen(false)} className="w-5 h-5 bg-gray-200 text-black border border-black flex items-center justify-center text-xs font-bold hover:bg-white">X</button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div className="bg-white p-3 border-2 border-black flex justify-between items-center shadow-[2px_2px_0px_#000]">
                <span className="font-bold text-xs text-gray-700">TOTAL TAGIHAN POS:</span>
                <span className="font-space-retro font-extrabold text-xl text-[#00529C]">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>

              <div>
                <label className="font-bold text-xs block mb-1">PILIH BANK TUJUAN TRANSFER:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['bca', 'mandiri', 'bri', 'bni'] as const).map((bKey) => (
                    <button
                      key={bKey}
                      type="button"
                      onClick={() => {
                        setSelectedPosBank(bKey);
                        setCopiedPosBank(false);
                      }}
                      className={`py-1.5 px-1 border-2 border-black font-mono-retro text-xs font-bold uppercase ${
                        selectedPosBank === bKey
                          ? 'bg-[#df551f] text-white shadow-[2px_2px_0px_#000]'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      {bKey}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bank Account Details Card */}
              <div className="p-3 bg-white border-2 border-black flex flex-col gap-2 shadow-[2px_2px_0px_#000]">
                <div className="flex justify-between items-center border-b border-black pb-1">
                  <span className="text-xs font-bold text-gray-600">BANK TERPILIH:</span>
                  <span className="text-xs font-bold text-white bg-[#00529C] px-2 py-0.5 border border-black">
                    {POS_BANK_DETAILS[selectedPosBank].name}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-600 block">NOMOR REKENING TOKO:</span>
                  <div className="flex items-center justify-between bg-[#f4f1de] p-2 border-2 border-black mt-1">
                    <span className="text-base font-extrabold text-[#df551f] tracking-wider">
                      {POS_BANK_DETAILS[selectedPosBank].accNo}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyPosBank(POS_BANK_DETAILS[selectedPosBank].accNo)}
                      className="retro-button bg-[#00A896] hover:bg-[#008f80] text-white px-2.5 py-1 text-[10px] font-bold uppercase flex items-center gap-1"
                    >
                      <span>📋</span>
                      <span>{copiedPosBank ? 'TERSALIN!' : 'SALIN REK'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] font-bold text-gray-700">
                  <span>A/N:</span> {POS_BANK_DETAILS[selectedPosBank].holder}
                </div>
              </div>

              {copiedPosBank && (
                <div className="p-1.5 bg-green-100 border border-green-800 text-green-900 text-xs font-bold text-center">
                  ✓ Nomor Rekening {POS_BANK_DETAILS[selectedPosBank].name} Disalin!
                </div>
              )}

              <button
                onClick={() => handleCompleteOrder('bank')}
                className="retro-button bg-[#00A896] hover:bg-[#008f80] text-white font-bold px-6 py-3 w-full text-xs uppercase flex items-center justify-center gap-2 mt-1"
              >
                <span className="material-symbols-outlined text-sm">task_alt</span>
                <span>✅ KONFIRMASI TRANSFER & CETAK STRUK</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS Receipt Modal */}
      {isCompletedModalOpen && completedReceiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 modal-backdrop overscroll-contain">
          <div className="retro-window max-w-md w-full text-black bg-white border-4 border-black font-mono-retro overscroll-contain">
            <div className="retro-titlebar bg-black text-white p-2 flex justify-between items-center text-xs font-bold">
              <span>🧾 STRUK TRANSAKSI POS 95</span>
              <button onClick={handleCloseReceipt} className="bg-gray-200 text-black px-1.5 hover:bg-white font-bold">X</button>
            </div>

            <div className="p-4 text-xs space-y-3 max-h-[80vh] overflow-y-auto touch-scroll">
              <div className="text-center border-b-2 border-black pb-3">
                <h3 className="font-space-retro font-bold text-lg">ILYASVIEL STORE POS</h3>
                <p className="text-[10px] text-gray-600">Jl. Gajah Mada No. 95, Jakarta Barat</p>
                <p className="text-[10px] font-bold">No. Struk: {completedReceiptData.receiptNo}</p>
                <p className="text-[10px] text-gray-500">{completedReceiptData.date}</p>
              </div>

              <div>
                <p className="font-bold border-b border-gray-300 pb-1 mb-2">DETAIL DAFTAR ITEM:</p>
                <ul className="space-y-2">
                  {completedReceiptData.items.map((item, idx) => (
                    <li key={idx} className="border-b border-dashed border-gray-300 pb-1">
                      <div className="flex justify-between font-bold">
                        <span>{item.product.name} x{item.quantity}</span>
                        <span>Rp {(item.product.priceIDR * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                      {item.imeiList.filter(Boolean).map((imei, iIdx) => (
                        <div key={iIdx} className="text-[10px] text-[#00a896] font-bold pl-2">
                          ↳ Serial IMEI: {imei}
                        </div>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t-2 border-black pt-2 space-y-1 font-bold">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rp {completedReceiptData.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak (11%):</span>
                  <span>Rp {completedReceiptData.tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm font-space-retro text-[#df551f] pt-1 border-t border-black">
                  <span>TOTAL:</span>
                  <span>Rp {completedReceiptData.grandTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Bayar ({completedReceiptData.paymentMethod}):</span>
                  <span>Rp {completedReceiptData.cashReceived.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Kembalian:</span>
                  <span>Rp {completedReceiptData.changeDue.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="text-center pt-3 border-t-2 border-black">
                <p className="text-[10px] font-bold text-[#00a896]">*** TERIMA KASIH ATAS KUNJUNGAN ANDA ***</p>
                <p className="text-[9px] text-gray-500">Garansi Resmi Ilyasviel Store Berlaku 12 Bulan</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => alert(currentLang === 'id' ? 'Mencetak struk ke printer thermal...' : 'Printing receipt to thermal printer...')}
                  className="retro-button bg-[#00a896] text-white font-bold px-4 py-2 flex-1 text-xs uppercase"
                >
                  🖨️ PRINT STRUK
                </button>
                <button
                  onClick={handleCloseReceipt}
                  className="retro-button retro-button-orange text-white font-bold px-4 py-2 flex-1 text-xs uppercase"
                >
                  SELESAI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
