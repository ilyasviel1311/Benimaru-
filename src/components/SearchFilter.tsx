import React from 'react';
import { TranslationDictionary } from '../types';

interface SearchFilterProps {
  t: TranslationDictionary;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  t,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <section id="catalog" className="mb-8 max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center">
      {/* Search Bar Input */}
      <div className="retro-window flex-grow flex items-center p-2 text-black w-full">
        <span className="material-symbols-outlined mr-2 text-black select-none">search</span>
        <input
          id="search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.search_ph}
          className="retro-input w-full p-2 font-mono-retro text-sm outline-none placeholder:text-gray-500"
        />
      </div>

      {/* Category Filter Buttons */}
      <div className="flex gap-2 flex-wrap justify-center w-full md:w-auto">
        <button
          id="btn-filter-all"
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`retro-button px-4 py-2 font-mono-retro font-bold text-xs uppercase ${
            selectedCategory === 'all'
              ? 'retro-titlebar-active text-white'
              : 'text-black bg-[#F4F1DE]'
          }`}
        >
          {t.btn_all}
        </button>

        <button
          id="btn-filter-laptop"
          type="button"
          onClick={() => onSelectCategory('laptop')}
          className={`retro-button px-4 py-2 font-mono-retro font-bold text-xs uppercase ${
            selectedCategory === 'laptop'
              ? 'retro-titlebar-active text-white'
              : 'text-black bg-[#F4F1DE]'
          }`}
        >
          {t.btn_laptop}
        </button>

        <button
          id="btn-filter-phone"
          type="button"
          onClick={() => onSelectCategory('phone')}
          className={`retro-button px-4 py-2 font-mono-retro font-bold text-xs uppercase ${
            selectedCategory === 'phone'
              ? 'retro-titlebar-active text-white'
              : 'text-black bg-[#F4F1DE]'
          }`}
        >
          {t.btn_phone}
        </button>

        <button
          id="btn-filter-acc"
          type="button"
          onClick={() => onSelectCategory('acc')}
          className={`retro-button px-4 py-2 font-mono-retro font-bold text-xs uppercase ${
            selectedCategory === 'acc'
              ? 'retro-titlebar-active text-white'
              : 'text-black bg-[#F4F1DE]'
          }`}
        >
          {t.btn_acc}
        </button>
      </div>
    </section>
  );
};
