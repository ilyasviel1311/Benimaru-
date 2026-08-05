import { Translations, Product, PosProduct } from '../types';

export const translations: Translations = {
  id: {
    site_title: "Ilyasviel Store",
    hero_title: "SUASANA RETRO, TEKNOLOGI MODERN",
    btn_explore: "JELAJAHI KATALOG",
    search_ph: "Cari produk elektronik...",
    btn_all: "SEMUA PRODUK",
    btn_laptop: "LAPTOP",
    btn_phone: "HANDPHONE",
    btn_acc: "AKSESORI",
    stock_label: "Stok Tersedia:",
    warranty_label: "Garansi 12 Bulan",
    btn_buy: "TAMBAH KE KERANJANG",
    track_title: "Cek Resi JNE & Garansi Digital",
    track_ph: "Masukkan Nomor HP Pembeli...",
    btn_check: "PERIKSA",
    // POS Specific
    pos_cashier: "Kasir: Alex",
    pos_shift_end: "AKHIR SHIFT",
    pos_search_ph: "Cari produk kasir...",
    pos_scan_barcode: "SCAN BARCODE / IMEI",
    pos_current_order: "PESANAN SAAT INI",
    pos_subtotal: "Subtotal",
    pos_tax: "Pajak (11%)",
    pos_grand_total: "Total Keseluruhan",
    pos_payment_cash: "TUNAI",
    pos_payment_qris: "QRIS",
    pos_cash_received: "Uang Diterima",
    pos_change_due: "Kembalian Uang",
    pos_complete_print: "SELESAIKAN & CETAK STRUK",
    pos_imei_ph: "Pilih / Scan No. Seri IMEI...",
    pos_stock: "Stok",
    pos_remove: "Hapus"
  },
  en: {
    site_title: "Ilyasviel Store",
    hero_title: "RETRO VIBES, MODERN TECH",
    btn_explore: "EXPLORE CATALOG",
    search_ph: "Search electronics...",
    btn_all: "ALL PRODUCTS",
    btn_laptop: "LAPTOP",
    btn_phone: "PHONES",
    btn_acc: "ACCESSORIES",
    stock_label: "In Stock:",
    warranty_label: "12 Months Warranty",
    btn_buy: "ADD TO CART",
    track_title: "Track JNE Order & Warranty",
    track_ph: "Enter Customer Phone Number...",
    btn_check: "CHECK NOW",
    // POS Specific
    pos_cashier: "Cashier: Alex",
    pos_shift_end: "SHIFT END",
    pos_search_ph: "Search product...",
    pos_scan_barcode: "SCAN BARCODE / IMEI",
    pos_current_order: "CURRENT ORDER",
    pos_subtotal: "Subtotal",
    pos_tax: "Tax (11%)",
    pos_grand_total: "Grand Total",
    pos_payment_cash: "CASH",
    pos_payment_qris: "QRIS",
    pos_cash_received: "Cash Received",
    pos_change_due: "Change Due",
    pos_complete_print: "COMPLETE & PRINT",
    pos_imei_ph: "Select / Scan IMEI Serial No.",
    pos_stock: "Stock",
    pos_remove: "Remove"
  }
};

export const initialProducts: Product[] = [
  {
    id: 'prod_01',
    name: 'ThinkBrick 2000',
    category: 'laptop',
    filename: 'PRODUCT_01.EXE',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF-E2pkBa59zUswWvQ98R2ZQNPwWmyxr_S9s75Jl3mRp6rY3GbQpzT1FJSLgmde8Yo97k0aDh9mL_SM7-HqztMazc0Ii7NtknE8CFIiFD51GBlOvqTHoU8cliBmRsR71pLrC2_d56Xxe6jCKdhYm6ZuoBBJ0m19pabBjpFDnuEzK9ca-1Rt6xVLCZ7kcnzGSBeg-xNHtNhSD3mewzlfLB7tcgcLqmtR64k2r3TF7CLu7AXDk0MYTHV',
    hasWarranty: true,
    stock: 5,
    price: 7750000
  },
  {
    id: 'prod_02',
    name: 'ClearTalk 95',
    category: 'phone',
    filename: 'PRODUCT_02.EXE',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBer_dx4kOKKzAZ1ox_v7DicQlVF50M_rhBDmFVWDRFJk_kEGeqzdagZxhdoEYd_DArtciAyUL3_DQHTnYIdGg__dFWz4Hsn-NPHSRYLGkawlZJgVmuuTT5PhaNaHPdVsdJsX7SSrXw7upgbWOJJZNeIajeFrau-MvhfrJtVb0imTBGQOPxjQDJqCBbM-48BRTn7GYDwptLNNG8oRxTVhjPTVe31kFqJkdLElB6yoIIkHsoYSLDkpo9',
    hasWarranty: true,
    stock: 12,
    price: 1380000
  },
  {
    id: 'prod_03',
    name: 'ClickClack M',
    category: 'acc',
    filename: 'PRODUCT_03.EXE',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAmTm322fjOg4TTU5uvZXmbev0PJo3MoiokWmJO4Z7ROyniVF0G92f_EJA0Q0BfBWT4WXW5s1N5ku-rTcODyWMHViDnHu6KHWTfjCFXi0Yq1DD4mlO__0_QuORx3_n2L5oJ2LNeQcil2-KVnCdkVm5KpekPTZ4hFJ7da0GcQg36Q15E6Rpo5EPyE2xfYE5jdoqUZMGZMRwydAvN30HCtMN5Iza28wPJqOinphwtbSc_fSGZR83HlMp',
    hasWarranty: false,
    stock: 3,
    price: 1860000
  },
  {
    id: 'prod_04',
    name: 'ViewTube 15"',
    category: 'laptop',
    filename: 'PRODUCT_04.EXE',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR9x5xkxSUKQMcv-NH94Pq6pW_Mvvy8M5uEOQ2EkYtN_756hDIfnMUWNNKAAUWhvw9XTIAUxivQT_kWGDKqQFAZ3uekmzDJyv7fe949XBZ8Ek7sB4gskNhhk0ZPAmF4_5N2-QjgrVYRqcTheIg2xvw-A2aum6mL_HfevzryDDHrGmksrrS8pImw8jFQ9hoVJ7tyDao6nUnHmKHL67gCw1xkCYXQDQ8VLylb39lHvGKOuBHhFgbqsLP',
    hasWarranty: true,
    stock: 1,
    price: 3875000
  }
];

export const posProducts: PosProduct[] = [
  {
    id: 'pos_01',
    name: 'ThinkPad X1 Carbon Gen 10',
    category: 'laptop',
    priceIDR: 12990000,
    stock: 5,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO_T13djOidcXmLsfsCGr2SjGiVx1hyqBmkZt7s-m-zpv1oeeRk-sBJqqxw0LBA0QFlzjXXNr90PfOTtiutDUatjslGqAa-56kQ95NU6k8OniWeR9DOWDjHQ0uRt15_hPKsvEJA5v-PwG0Dun8D7yA7ue89z470aDtGCMWQhrTTMxzBnWGv0_L91gI_yjuqWCVu-y2vrX1Vx0HioCASiVU6De1sr1AxMQ1xepRy2kzixJ4TzFOfnIU',
    requiresImei: true
  },
  {
    id: 'pos_02',
    name: 'Pixel 8 Pro 256GB',
    category: 'phone',
    priceIDR: 9990000,
    stock: 12,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA0crdiYBHU8fzkd0S1xC8ZBwOMQb6-NYFcJAdHGS8yJArnf9jRrmFCVhq1Zp_tI0mhR3Vzod7JDcCh5tfWasTRkOsY8aJuJ2ih1JzcMVa4YZTM8DoUdRxhVTMPjrggPuK1VR-wQgNPEoqX_LOc4r_N4seGgs1Sv3LKDumtVJFM2B7I6fjpLegeva1qt7FK4UCuSWsjsaNpc6hGmjgZbZNycru02o8mXLA7fWJn1IPUZCeb46TWX9D',
    requiresImei: true
  },
  {
    id: 'pos_03',
    name: 'Galaxy Buds 2 Pro',
    category: 'acc',
    priceIDR: 1990000,
    stock: 2,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx-O71y3cUCce6rXEiljKSYuulOsMIc_Ta1rr3rzqjNGs7G1TzCwCeMslKt6r0pKYvZ44yTrdJC9WHyOGixImUf6JPEUmmHX3vR5StiwbAQ-iXrRPiFH1NYLDSxwbeVn-vVcHD6xUL0PRuiN2lEjlFDgeKpwU2ovfFtMxF-tiuKfwjWdxgfzfX4ilfD9O4nt_LS6Aqr9wuUdPhoB_xh43VOOmANODvyqv0XlaJ3W_jKFkcrkVBWTZx',
    requiresImei: false
  },
  {
    id: 'pos_04',
    name: 'Keychron K2 V2 Wireless',
    category: 'acc',
    priceIDR: 950000,
    stock: 8,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2JHzDWwndMPo1pbV5TsenaqRJSGh8I7O0bj0sFGz99XnlXC3895pW96P-1X0_4PUc85JnqMrIa4LOJfKm2AHJq-lkietiUgaAsyheRhs1VIQAlv-W31CARPAPhnsjwV8IwY8c7evp3ZurhNE0pnkj6CJAceK9nKSuNFvvSWwMVfdjCvyswKWOa2ZeJ0G4wj5qHpKwxHtWzQvqr5gV94mX-ZUu9kgPN4S1fh3EZoj8l1RuYcyhuRlw',
    requiresImei: false
  }
];
