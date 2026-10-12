import React, { useState, useMemo } from 'react';
import {
  Search,
  FileDown,
  Flame,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  X,
} from 'lucide-react';
import {
  DishItem,
  MENU_CATEGORIES,
  MenuCategory,
  RestaurantConfig,
  SpiceLevel,
} from '../data/restaurantData';
import { ResilientImage } from './ResilientImage';
import { downloadMenuPdf } from '../utils/pdfGenerator';
import { CartItem } from './OrderAndCustomizerDrawers';

interface MenuSectionProps {
  items: DishItem[];
  config: RestaurantConfig;
  cart: CartItem[];
  onUpdateQty: (dishId: string, delta: number) => void;
  onOpenOrderDrawer: () => void;
  isDark: boolean;
}

/**
 * Official Indian FSSAI-standard Veg (green square + circle)
 * and Non-Veg (crimson-brown square + triangle) symbol.
 */
export const DietarySymbol: React.FC<{ isVeg: boolean }> = ({ isVeg }) => {
  if (isVeg) {
    return (
      <span
        className="inline-flex items-center gap-1.5"
        title="100% Vegetarian"
      >
        <span className="w-4 h-4 border border-emerald-700 dark:border-emerald-500 flex items-center justify-center shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-700 dark:bg-emerald-500" />
        </span>
        <span className="text-xs font-medium text-emerald-800 dark:text-emerald-400">
          Veg
        </span>
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5"
      title="Non-Vegetarian"
    >
      <span className="w-4 h-4 border border-[#991B1B] dark:border-[#F87171] flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 10 10"
          className="w-2.5 h-2.5 fill-[#991B1B] dark:fill-[#F87171]"
          aria-hidden="true"
        >
          <polygon points="5,1.5 9,8.5 1,8.5" />
        </svg>
      </span>
      <span className="text-xs font-medium text-[#991B1B] dark:text-[#F87171]">
        Non-Veg
      </span>
    </span>
  );
};

export const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  config,
  cart,
  onUpdateQty,
  onOpenOrderDrawer,
  isDark,
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [spiceFilter, setSpiceFilter] = useState<'All' | SpiceLevel>('All');
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const filteredDishes = useMemo(() => {
    return items.filter((item) => {
      if (activeCategory !== 'All' && item.category !== activeCategory) return false;
      if (vegOnly && !item.isVeg) return false;
      if (spiceFilter !== 'All' && item.spiceLevel !== spiceFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchSpecial =
          (item.isChefSpecial && 'chef special'.includes(q)) ||
          (item.isBestseller && 'bestseller'.includes(q));
        return matchName || matchDesc || matchCat || matchSpecial;
      }
      return true;
    });
  }, [items, activeCategory, vegOnly, spiceFilter, searchQuery]);

  const handleDownloadPdf = () => {
    downloadMenuPdf(config, items);
    setPdfDownloaded(true);
    setTimeout(() => setPdfDownloaded(false), 3000);
  };

  const getCartQuantity = (dishId: string) => {
    return cart.find((c) => c.dish.id === dishId)?.quantity || 0;
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section
      id="menu"
      className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
        isDark ? 'border-[#261F1C]' : 'border-[#E6DFD1]'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header + PDF Download */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-current/10">
          <div>
            <p className="text-xs font-medium tracking-wide text-[#8B1E24] dark:text-[#D4AF37]">
              02. Royal Dastarkhwan Menu · Slow-Cooked to Order
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mt-2 text-balance">
              Curated Dishes from the Copper Deg
            </h2>
            <p className="text-sm sm:text-base opacity-75 mt-2 max-w-2xl">
              Every dish is prepared fresh using cold-pressed mustard oil, cultured desi ghee, and
              hand-pounded spices. Order directly on WhatsApp for 10% off menu prices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {totalCartItems > 0 && (
              <button
                type="button"
                onClick={onOpenOrderDrawer}
                className="px-4 py-2.5 rounded-lg bg-[#1F7A4C] hover:bg-[#18633D] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Order Tray ({totalCartItems})</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleDownloadPdf}
              className={`px-4 py-2.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                isDark
                  ? 'border-[#3A2F29] bg-[#1C1715] hover:bg-[#26201D] text-[#F5EFE6]'
                  : 'border-[#D5CBB8] bg-white hover:bg-[#F3EDE0] text-[#1C1613]'
              }`}
            >
              {pdfDownloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Menu PDF Downloaded</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-[#8B1E24] dark:text-[#D4AF37]" />
                  <span>Download Menu PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Controls Bar: Category Tabs + Search + Veg-Only Toggle */}
        <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Segmented Tabs */}
          <div
            role="tablist"
            aria-label="Menu Categories"
            className={`flex items-center gap-1 p-1 rounded-lg overflow-x-auto ${
              isDark ? 'bg-[#1A1513]' : 'bg-[#EFE9DC]'
            }`}
          >
            {(['All', ...MENU_CATEGORIES] as const).map((cat) => {
              const isActive = activeCategory === cat;
              const count =
                cat === 'All'
                  ? items.length
                  : items.filter((i) => i.category === cat).length;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#8B1E24] text-white shadow-xs'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  {cat} <span className="opacity-70 font-mono-tabular">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search, Veg-Only Toggle, and Spice Filter */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 opacity-50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search kebabs, biryani, paneer..."
                aria-label="Search menu dishes"
                className={`w-full pl-9 pr-8 py-2 text-xs rounded-lg border bg-transparent focus:outline-none focus:border-[#8B1E24] ${
                  isDark ? 'border-[#332924]' : 'border-[#D5CBB8]'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Veg-Only Toggle Button */}
            <button
              type="button"
              aria-pressed={vegOnly}
              onClick={() => setVegOnly((prev) => !prev)}
              className={`px-3.5 py-2 rounded-lg border text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                vegOnly
                  ? 'border-emerald-700 bg-emerald-700 text-white'
                  : isDark
                  ? 'border-[#332924] bg-[#1A1513] hover:bg-[#241E1B]'
                  : 'border-[#D5CBB8] bg-white hover:bg-[#F3EDE0]'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 border flex items-center justify-center ${
                  vegOnly ? 'border-white' : 'border-emerald-600'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    vegOnly ? 'bg-white' : 'bg-emerald-600'
                  }`}
                />
              </span>
              <span>Veg Only</span>
            </button>

            {/* Spice Filter Select */}
            <select
              aria-label="Filter by spice level"
              value={spiceFilter}
              onChange={(e) => setSpiceFilter(e.target.value as 'All' | SpiceLevel)}
              className={`px-3 py-2 rounded-lg border text-xs font-medium bg-transparent focus:outline-none focus:border-[#8B1E24] shrink-0 ${
                isDark ? 'border-[#332924]' : 'border-[#D5CBB8]'
              }`}
            >
              <option value="All" className="text-black">
                All Spice Levels
              </option>
              <option value="Mild" className="text-black">
                Mild Spice
              </option>
              <option value="Medium" className="text-black">
                Medium Spice
              </option>
              <option value="Fiery" className="text-black">
                Fiery Spice
              </option>
            </select>
          </div>
        </div>

        {/* Dish Grid */}
        {filteredDishes.length === 0 ? (
          <div className="mt-10 py-16 text-center border border-dashed border-current/15 rounded-xl">
            <p className="font-display text-2xl font-semibold">
              No dishes match your current filter
            </p>
            <p className="text-xs opacity-70 mt-1">
              Try clearing your search query or switching off the Veg-Only / Spice filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setVegOnly(false);
                setSpiceFilter('All');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#8B1E24] text-white text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDishes.map((dish) => {
              const qty = getCartQuantity(dish.id);
              return (
                <article
                  key={dish.id}
                  className={`group rounded-xl border overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 ${
                    isDark
                      ? 'bg-[#171311] border-[#2A221E]'
                      : 'bg-white border-[#E5DEC9]'
                  }`}
                >
                  <div>
                    {/* 4:3 Dish Photo */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1D1614]">
                      <ResilientImage
                        src={dish.image}
                        alt={dish.name}
                        objectPosition={dish.objectPosition}
                        fallbackTitle={dish.name}
                        className="w-full h-full transition-transform duration-300 group-hover:scale-103"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      {/* Unboxed Metadata Row (Zero-Pill Discipline) */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                        <DietarySymbol isVeg={dish.isVeg} />
                        <span aria-hidden="true" className="opacity-40">
                          ·
                        </span>
                        <span className="inline-flex items-center gap-1 opacity-75">
                          <Flame className="w-3.5 h-3.5 text-[#C59B27]" />
                          <span>{dish.spiceLevel}</span>
                        </span>
                        {dish.isChefSpecial && (
                          <>
                            <span aria-hidden="true" className="opacity-40">
                              ·
                            </span>
                            <span className="font-semibold text-[#8B1E24] dark:text-[#D4AF37]">
                              Chef’s Special
                            </span>
                          </>
                        )}
                        {dish.isBestseller && (
                          <>
                            <span aria-hidden="true" className="opacity-40">
                              ·
                            </span>
                            <span className="font-medium text-amber-700 dark:text-amber-400">
                              Bestseller
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title & Price */}
                      <div className="mt-2.5 flex items-baseline justify-between gap-3">
                        <h3 className="font-display text-xl font-semibold leading-snug">
                          {dish.name}
                        </h3>
                        <span className="font-mono-tabular text-base font-semibold text-[#8B1E24] dark:text-[#E5C158] shrink-0">
                          ₹{dish.price}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mt-2 text-xs sm:text-sm opacity-75 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Portion + Add to Order */}
                  <div className="px-5 pb-5 pt-3 border-t border-current/10 flex items-center justify-between gap-3">
                    <span className="text-xs opacity-60 font-mono-tabular">
                      {dish.caloriesOrPortion}
                    </span>

                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => onUpdateQty(dish.id, 1)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                          isDark
                            ? 'bg-[#261E1A] hover:bg-[#8B1E24] text-[#F5EFE6] hover:text-white border border-[#3B2E28]'
                            : 'bg-[#F5EFE4] hover:bg-[#8B1E24] text-[#1C1613] hover:text-white border border-[#DFD5C3]'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Order</span>
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-[#8B1E24] text-white px-2.5 py-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(dish.id, -1)}
                          aria-label={`Remove one ${dish.name}`}
                          className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/20"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono-tabular font-semibold w-4 text-center">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(dish.id, 1)}
                          aria-label={`Add one more ${dish.name}`}
                          className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/20"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
