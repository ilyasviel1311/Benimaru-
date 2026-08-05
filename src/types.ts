export type Language = 'id' | 'en';
export type ActiveModule = 'store' | 'pos' | 'admin';

export interface TranslationDictionary {
  site_title: string;
  hero_title: string;
  btn_explore: string;
  search_ph: string;
  btn_all: string;
  btn_laptop: string;
  btn_phone: string;
  btn_acc: string;
  stock_label: string;
  warranty_label: string;
  btn_buy: string;
  track_title: string;
  track_ph: string;
  btn_check: string;
  // POS Specific Translations
  pos_cashier: string;
  pos_shift_end: string;
  pos_search_ph: string;
  pos_scan_barcode: string;
  pos_current_order: string;
  pos_subtotal: string;
  pos_tax: string;
  pos_grand_total: string;
  pos_payment_cash: string;
  pos_payment_qris: string;
  pos_cash_received: string;
  pos_change_due: string;
  pos_complete_print: string;
  pos_imei_ph: string;
  pos_stock: string;
  pos_remove: string;
}

export interface Translations {
  id: TranslationDictionary;
  en: TranslationDictionary;
}

export interface Product {
  id: string;
  name: string;
  category: 'laptop' | 'phone' | 'acc';
  filename: string;
  imageUrl: string;
  hasWarranty: boolean;
  stock: number;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserProfile {
  fullName: string;
  phone: string;
  email: string;
}

export interface PosProduct {
  id: string;
  name: string;
  category: 'laptop' | 'phone' | 'acc';
  priceIDR: number;
  stock: number;
  imageUrl: string;
  requiresImei?: boolean;
}

export interface PosCartItem {
  product: PosProduct;
  quantity: number;
  imeiList: string[];
}
