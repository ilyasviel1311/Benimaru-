import React, { useState, useEffect } from 'react';
import { Language, ActiveModule, Product, CartItem, UserProfile } from './types';
import { translations } from './data/translations';
import { supabase } from './lib/supabase';
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
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isTrackOrderModalOpen, setIsTrackOrderModalOpen] = useState<boolean>(false);
  const [selectedResi, setSelectedResi] = useState<string>('JNE-95082101');

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (data && data.length > 0) {
        const mappedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          filename: item.filename,
          imageUrl: item.image_url,
          hasWarranty: item.has_warranty,
          stock: item.stock,
          price: Number(item.price),
          requiresImei: item.requires_imei
        }));
        setProducts(mappedProducts);
      }
    };

    fetchProducts();
  }, []);

  const t = translations[lang];

  const handleOpenTrackWithResi = (resi: string) => {
    setSelectedResi(resi);
    setIsAuthModalOpen(false);
    setIsTrackOrderModalOpen(true);
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
    setToastMessage(`${product.name} telah ditambahkan ke keranjang`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenDetail = (product: Product) => {
    setSelectedDetailProduct(product);
    setIsDetailModalOpen(true);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.filename.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#008080] text-[#000000] font-mono-retro flex flex-col justify-between selection:bg-[#df551f] selection:text-white">
      <Header
        t={t}
        currentLang={lang}
        onLanguageChange={setLang}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        cartCount={cartCount}
        onOpenCart={() => setIsCheckoutOpen(true)}
        userProfile={userProfile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => setUserProfile(null)}
        onOpenTrackOrder={() => setIsTrackOrderModalOpen(true)}
      />

      {activeModule === 'store' && (
        <main className="pt-24 pb-12 px-2 sm:px-4 max-w-7xl mx-auto w-full flex-grow">
          <HeroSection t={t} />

          <SearchFilter
            t={t}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                t={t}
                onAddToCart={handleAddToCart}
                onOpenDetail={handleOpenDetail}
              />
            ))}
          </div>
        </main>
      )}

      {activeModule === 'pos' && (
        <main className="pt-20 pb-12 px-2 sm:px-4 max-w-7xl mx-auto w-full flex-grow">
          <PosView products={products} t={t} />
        </main>
      )}

      {activeModule === 'admin' && (
        <main className="pt-20 pb-12 px-2 sm:px-4 max-w-7xl mx-auto w-full flex-grow">
          <AdminDashboardView products={products} setProducts={setProducts} t={t} />
        </main>
      )}

      <Footer t={t} />

      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
          t={t}
        />
      )}

      {isDetailModalOpen && selectedDetailProduct && (
        <ProductDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          product={selectedDetailProduct}
          onAddToCart={handleAddToCart}
          t={t}
        />
      )}

      {isAuthModalOpen && (
        <UserAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(profile) => {
            setUserProfile(profile);
            setIsAuthModalOpen(false);
            setToastMessage(`Selamat datang kembali, ${profile.fullName}!`);
          }}
          onOpenTrackWithResi={handleOpenTrackWithResi}
          t={t}
        />
      )}

      {isTrackOrderModalOpen && (
        <TrackOrderModal
          isOpen={isTrackOrderModalOpen}
          onClose={() => setIsTrackOrderModalOpen(false)}
          initialResi={selectedResi}
          t={t}
        />
      )}

      {toastMessage && (
        <RetroToast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
