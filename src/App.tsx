import { useState } from 'react';
import { Language, Product, CartItem, ActiveModule, UserProfile } from './types';
import { translations, initialProducts } from './data/translations';
import { useBodyScrollLock } from './hooks/useBodyScrollLock';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SearchFilter } from './components/SearchFilter';
import { ProductCard } from './components/ProductCard';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { UserAuthModal } from './components/UserAuthModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { PosView } from './components/PosView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { RetroToast } from './components/RetroToast';
import { Footer } from './components/Footer';

export default function App() {
  const [lang, setLang] = useState<Language>('id');
  const [activeModule, setActiveModule] = useState<ActiveModule>('store');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User Auth & Track Order Modal states
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isTrackOrderModalOpen, setIsTrackOrderModalOpen] = useState<boolean>(false);
  const [selectedResi, setSelectedResi] = useState<string>('JNE-95082101');

  const handleOpenTrackWithResi = (resi: string) => {
    setSelectedResi(resi);
    setIsAuthModalOpen(false);
    setIsTrackOrderModalOpen(true);
  };

  useBodyScrollLock(isUpgradeModalOpen);

  const t = translations[lang];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    const msg = newLang === 'id' ? 'Bahasa diubah ke Indonesia 🇮🇩' : 'Language switched to English 🇬🇧';
    showToast(msg);
  };

  const handleModuleChange = (module: ActiveModule) => {
    setActiveModule(module);
    let msg = '';
    if (module === 'pos') {
      msg = lang === 'id' ? '📟 Beralih ke Modul Kasir iPad POS' : '📟 Switched to iPad POS Cashier Module';
    } else if (module === 'admin') {
      msg = lang === 'id' ? '📊 Beralih ke Modul Dashboard Admin' : '📊 Switched to Admin Dashboard Module';
    } else {
      msg = lang === 'id' ? '🏪 Beralih ke Modul Ilyasviel 95 Store' : '🏪 Switched to Ilyasviel 95 Store Module';
    }
    showToast(msg);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    const msg = lang === 'id' 
      ? `Produk masuk keranjang! (${product.name})` 
      : `Product added to cart! (${product.name})`;
    showToast(msg);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const filteredProducts = initialProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (activeModule === 'pos') {
    return (
      <div className="relative min-h-screen">
        <RetroToast message={toastMessage} onClose={() => setToastMessage(null)} />

        <PosView
          currentLang={lang}
          t={t}
          onLanguageChange={handleLanguageChange}
          onSwitchToStoreView={() => handleModuleChange('store')}
          onModuleChange={handleModuleChange}
          onShowToast={showToast}
        />
      </div>
    );
  }

  if (activeModule === 'admin') {
    return (
      <div className="relative min-h-screen">
        <RetroToast message={toastMessage} onClose={() => setToastMessage(null)} />

        <AdminDashboardView
          currentLang={lang}
          onLanguageChange={handleLanguageChange}
          onModuleChange={handleModuleChange}
          onShowToast={showToast}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-on-surface font-work-retro antialiased flex flex-col pt-[76px] pb-16 relative">
      {/* Top Header */}
      <Header
        t={t}
        currentLang={lang}
        onLanguageChange={handleLanguageChange}
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
        cartCount={cartCount}
        onOpenCart={() => setIsCheckoutOpen(true)}
        userProfile={userProfile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          setUserProfile(null);
          showToast(lang === 'id' ? 'Berhasil Logout dari Akun' : 'Successfully Logged Out');
        }}
        onOpenTrackOrder={() => setIsTrackOrderModalOpen(true)}
      />

      {/* Retro 90s Notification Toast (SYSTEM_ALERT.EXE) */}
      <RetroToast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full touch-scroll">
        {/* Hero Window Section */}
        <HeroSection
          t={t}
          onExploreClick={() => {
            setSelectedCategory('all');
            const catalogElem = document.getElementById('catalog');
            if (catalogElem) {
              catalogElem.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* Search & Filter Buttons */}
        <SearchFilter
          t={t}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Product Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              t={t}
              onAddToCart={handleAddToCart}
              onOpenDetail={(prod) => {
                setSelectedDetailProduct(prod);
                setIsDetailModalOpen(true);
              }}
            />
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12 retro-window bg-[#F4F1DE] text-black font-mono-retro">
              <span className="material-symbols-outlined text-4xl mb-2 text-[#df551f]">search_off</span>
              <p className="font-bold">
                {lang === 'id' ? 'Tidak ada produk elektronik yang ditemukan.' : 'No electronics products found.'}
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Upgrade OS Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 modal-backdrop overscroll-contain">
          <div className="retro-window max-w-md w-full text-black max-h-[85vh] overflow-y-auto touch-scroll overscroll-contain">
            <div className="retro-titlebar px-2 py-1 flex justify-between items-center text-white">
              <span className="font-mono-retro text-xs font-bold">SYSTEM_UPGRADE.EXE</span>
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="border border-black bg-[#c0c0c0] text-black px-1 text-xs font-bold hover:bg-white"
              >
                X
              </button>
            </div>
            <div className="p-6 bg-[#F4F1DE] font-mono-retro text-xs text-center">
              <span className="material-symbols-outlined text-5xl text-[#00A896] mb-2">memory</span>
              <h3 className="font-space-retro font-bold text-lg mb-2">
                {lang === 'id' ? 'ILYASVIEL STORE SYSTEM 95 TERINTEGRASI' : 'ILYASVIEL STORE SYSTEM 95 INTEGRATED'}
              </h3>
              <p className="mb-4">
                {lang === 'id'
                  ? 'Anda sedang menjalankan versi stabil Ilyasviel System 95 dengan dukungan Multi-Bahasa Dinamis (ID/EN) dan Resi JNE.'
                  : 'You are running the stable Ilyasviel System 95 build with Dynamic Multi-language (ID/EN) and JNE tracking.'}
              </p>
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="retro-button retro-button-orange px-4 py-2 font-bold text-white uppercase"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail & Customer Reviews Modal */}
      <ProductDetailModal
        product={selectedDetailProduct}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDetailProduct(null);
        }}
        t={t}
        currentLang={lang}
        onAddToCart={handleAddToCart}
      />

      {/* Checkout Payment Gateway Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currentLang={lang}
        t={t}
        onClearCart={() => setCartItems([])}
        userProfile={userProfile}
      />

      {/* User Login & Registration Retro Modal (USER_AUTH.EXE) */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentLang={lang}
        userProfile={userProfile}
        onLogout={() => {
          setUserProfile(null);
          showToast(lang === 'id' ? 'Berhasil Logout dari Akun' : 'Successfully Logged Out');
        }}
        onTrackOrderWithResi={handleOpenTrackWithResi}
        onLoginSuccess={(profile, isNewRegister) => {
          setUserProfile(profile);
          const msg = isNewRegister
            ? (lang === 'id' ? `Pendaftaran Berhasil! Selamat datang, ${profile.fullName}` : `Registration Successful! Welcome, ${profile.fullName}`)
            : (lang === 'id' ? `Login Berhasil! Selamat datang, ${profile.fullName}` : `Login Successful! Welcome, ${profile.fullName}`);
          showToast(msg);
        }}
      />

      {/* Order Tracking & Digital Warranty Retro Modal (TRACK_ORDER.EXE) */}
      <TrackOrderModal
        isOpen={isTrackOrderModalOpen}
        onClose={() => setIsTrackOrderModalOpen(false)}
        currentLang={lang}
        t={t}
        initialResi={selectedResi}
      />

      {/* Footer */}
      <Footer currentLang={lang} />
    </div>
  );
}

