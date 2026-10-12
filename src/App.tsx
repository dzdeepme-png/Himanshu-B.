/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Calendar,
  ExternalLink,
  Sun,
  Moon,
  Copy,
  Check,
  X,
  ShieldCheck,
  Award,
  Flame,
  Utensils,
  Settings,
  ShoppingBag,
} from 'lucide-react';
import {
  DEFAULT_RESTAURANT_CONFIG,
  IMAGES,
  INITIAL_REVIEWS,
  MENU_ITEMS,
  RestaurantConfig,
  ReviewItem,
} from './data/restaurantData';
import { ResilientImage } from './components/ResilientImage';
import { MenuSection } from './components/MenuSection';
import { BookingAndReviewsSection } from './components/BookingAndReviewsSection';
import { GalleryDeliveryContactSection } from './components/GalleryDeliveryContactSection';
import {
  CartItem,
  RestaurantCustomizerModal,
  WhatsAppOrderDrawer,
} from './components/OrderAndCustomizerDrawers';

const STORAGE_CONFIG_KEY = 'zaffran_ember_config_v1';
const STORAGE_REVIEWS_KEY = 'zaffran_ember_reviews_v1';
const STORAGE_THEME_KEY = 'zaffran_ember_theme_v1';

export default function App() {
  // Theme state (Dark / Light mode)
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      return saved ? saved === 'dark' : false;
    } catch {
      return false;
    }
  });

  // Restaurant Config State (Customizable for any [Restaurant Name], [cuisine], [City])
  const [config, setConfig] = useState<RestaurantConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
      return saved ? { ...DEFAULT_RESTAURANT_CONFIG, ...JSON.parse(saved) } : DEFAULT_RESTAURANT_CONFIG;
    } catch {
      return DEFAULT_RESTAURANT_CONFIG;
    }
  });

  // Reviews State
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REVIEWS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Direct WhatsApp Cart State (Pre-populated with 1 signature dish so users can test immediately)
  const [cart, setCart] = useState<CartItem[]>([
    { dish: MENU_ITEMS[0], quantity: 1 },
  ]);

  // UI Drawers & Banner State
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [showOfferStrip, setShowOfferStrip] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THEME_KEY, isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Ignore storage errors in private mode
    }
  }, [isDark]);

  const handleSaveConfig = (newConfig: RestaurantConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(newConfig));
    } catch {
      // Ignore storage errors
    }
  };

  const handleAddReview = (newReview: ReviewItem) => {
    const updated = [newReview, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const handleUpdateQty = (dishId: string, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.dish.id === dishId);
      if (existing) {
        const nextQty = existing.quantity + delta;
        if (nextQty <= 0) {
          return prev.filter((c) => c.dish.id !== dishId);
        }
        return prev.map((c) =>
          c.dish.id === dishId ? { ...c, quantity: nextQty } : c
        );
      } else if (delta > 0) {
        const found = MENU_ITEMS.find((m) => m.id === dishId);
        if (found) {
          return [...prev, { dish: found, quantity: delta }];
        }
      }
      return prev;
    });
  };

  const handleCopyOfferCode = () => {
    navigator.clipboard?.writeText(config.offerCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2500);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark
          ? 'bg-[#110F0E] text-[#F5EFE6] tracking-[0.01em]'
          : 'bg-[#FAF7F2] text-[#1C1613]'
      }`}
    >
      {/* SLIM OFFERS STRIP (<= 40px height) */}
      {showOfferStrip && (
        <div className="bg-[#7A191F] text-[#FAF5E8] px-4 py-2 text-xs border-b border-[#C59B27]/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold">{config.offerBannerText}</span>
              <span aria-hidden="true" className="opacity-50">
                ·
              </span>
              <span className="hidden sm:inline opacity-90">{config.offerSecondaryText}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleCopyOfferCode}
                className="inline-flex items-center gap-1 font-mono-tabular font-semibold underline hover:text-[#E5C158] whitespace-nowrap shrink-0"
              >
                {codeCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied {config.offerCode}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 opacity-80" />
                    <span>Code: {config.offerCode}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowOfferStrip(false)}
                aria-label="Dismiss offer banner"
                className="opacity-75 hover:opacity-100 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
          isDark
            ? 'bg-[#110F0E]/90 border-[#261F1C]'
            : 'bg-[#FAF7F2]/90 border-[#E6DFD1]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-14 sm:h-16">
          {/* Zone 1: Single text element Brand Wordmark */}
          <a
            href="#"
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight whitespace-nowrap shrink-0"
          >
            {config.name}
          </a>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            <a
              href="#about"
              className="opacity-80 hover:opacity-100 hover:underline underline-offset-4 transition-opacity whitespace-nowrap shrink-0"
            >
              About
            </a>
            <a
              href="#menu"
              className="opacity-80 hover:opacity-100 hover:underline underline-offset-4 transition-opacity whitespace-nowrap shrink-0"
            >
              Menu
            </a>
            <a
              href="#booking"
              className="opacity-80 hover:opacity-100 hover:underline underline-offset-4 transition-opacity whitespace-nowrap shrink-0"
            >
              Reservations
            </a>
            <a
              href="#reviews"
              className="opacity-80 hover:opacity-100 hover:underline underline-offset-4 transition-opacity whitespace-nowrap shrink-0"
            >
              Reviews
            </a>
            <a
              href="#contact"
              className="opacity-80 hover:opacity-100 hover:underline underline-offset-4 transition-opacity whitespace-nowrap shrink-0"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action Button */}
          <div className="flex items-center shrink-0">
            <a
              href="#booking"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#8B1E24] hover:bg-[#70161B] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Book a Table
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main>
        {/* HERO SECTION */}
        <section className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Workspace / Theme & Customizer Utility Bar (Below Header per Top Bar Contract) */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-current/10 text-xs">
              <div className="flex flex-wrap items-center gap-2 opacity-80">
                <span className="font-semibold text-[#8B1E24] dark:text-[#D4AF37]">
                  {config.cuisine}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {config.neighborhood}, {config.city}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">Since {config.sinceYear}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsOrderDrawerOpen(true)}
                  className={`px-3 py-1.5 rounded-lg border font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'border-[#332924] bg-[#1A1513] hover:bg-[#241E1B]'
                      : 'border-[#D5CBB8] bg-white hover:bg-[#F3EDE0]'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#1F7A4C]" />
                  <span>Direct Order Tray ({totalCartItems})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCustomizerOpen(true)}
                  className={`px-3 py-1.5 rounded-lg border font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'border-[#332924] bg-[#1A1513] hover:bg-[#241E1B]'
                      : 'border-[#D5CBB8] bg-white hover:bg-[#F3EDE0]'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Customize Restaurant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDark((prev) => !prev)}
                  aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  className={`px-3 py-1.5 rounded-lg border font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'border-[#332924] bg-[#1A1513] hover:bg-[#241E1B] text-[#E5C158]'
                      : 'border-[#D5CBB8] bg-white hover:bg-[#F3EDE0] text-[#1C1613]'
                  }`}
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3.5 h-3.5" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 2-Column Split Hero with items-stretch */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left 6 Cols: Headline, Tagline & 4 Action Buttons */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
                <div className="space-y-5">
                  <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#8B1E24] dark:text-[#D4AF37]">
                    Authentic Dum Pukht & Charcoal Craft in {config.city}
                  </p>

                  <h1
                    className="font-display font-bold tracking-tight text-balance leading-[1.08]"
                    style={{ fontSize: 'clamp(2.35rem, 4.2vw, 3.85rem)' }}
                  >
                    Royal {config.cuisine} Feasts, Slow-Simmered Over Glowing Embers.
                  </h1>

                  <p className="text-base sm:text-lg opacity-80 leading-relaxed max-w-xl">
                    {config.tagline}
                  </p>
                </div>

                {/* Four Required Hero Action Buttons */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* 1. Order on WhatsApp (Direct Best Price) */}
                    <button
                      type="button"
                      onClick={() => setIsOrderDrawerOpen(true)}
                      className="py-3.5 px-5 rounded-lg bg-[#1F7A4C] hover:bg-[#18633D] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Order on WhatsApp (10% Off)</span>
                    </button>

                    {/* 2. Book a Table */}
                    <a
                      href="#booking"
                      className="py-3.5 px-5 rounded-lg bg-[#8B1E24] hover:bg-[#70161B] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 shadow-xs"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book a Table</span>
                    </a>

                    {/* 3. Order on Swiggy */}
                    <a
                      href={config.swiggyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`py-3 px-4 rounded-lg border text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                        isDark
                          ? 'border-[#3A2F29] bg-[#1A1513] hover:border-[#FC8019] text-[#F5EFE6]'
                          : 'border-[#D5CBB8] bg-white hover:border-[#FC8019] text-[#1C1613]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#FC8019]" aria-hidden="true" />
                      <span>Order on Swiggy</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-65" />
                    </a>

                    {/* 4. Order on Zomato */}
                    <a
                      href={config.zomatoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`py-3 px-4 rounded-lg border text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                        isDark
                          ? 'border-[#3A2F29] bg-[#1A1513] hover:border-[#E23744] text-[#F5EFE6]'
                          : 'border-[#D5CBB8] bg-white hover:border-[#E23744] text-[#1C1613]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#E23744]" aria-hidden="true" />
                      <span>Order on Zomato</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-65" />
                    </a>
                  </div>

                  <p className="text-xs opacity-65">
                    Open Daily for Lunch (12:00 PM – 03:30 PM) & Dinner (07:00 PM – 11:30 PM) ·
                    FSSAI Lic. <span className="font-mono-tabular">{config.fssaiNumber}</span>
                  </p>
                </div>
              </div>

              {/* Right 6 Cols: High-Impact 16:9 / Full-Height Food Feast Photography */}
              <div className="lg:col-span-6">
                <div
                  className={`relative w-full h-full min-h-[340px] sm:min-h-[420px] rounded-xl overflow-hidden border ${
                    isDark ? 'border-[#2E2520]' : 'border-[#DFD5C3]'
                  }`}
                >
                  <ResilientImage
                    src={IMAGES.heroFeast}
                    alt={`Royal ${config.cuisine} feast at ${config.name}`}
                    className="w-full h-full lg:h-full object-cover"
                  />
                  {/* Measured Contrast Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 text-white">
                    <p className="text-xs text-[#E5C158] font-medium">
                      Featured Dastarkhwan · Serves 4–6 Guests
                    </p>
                    <p className="font-display text-2xl font-semibold mt-0.5">
                      Purdah Gosht Dum Biryani, Galouti Kebabs & 24-Hour Dal Zaffrani
                    </p>
                    <p className="text-xs text-white/80 mt-1">
                      Prepared in tin-lined hammered brass handis over slow tamarind wood fire.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Heritage & Trust Strip Below Hero Split */}
            <div
              className={`mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-5 sm:p-6 rounded-xl border ${
                isDark ? 'bg-[#171311] border-[#2A221E]' : 'bg-white border-[#E5DEC9]'
              }`}
            >
              <div>
                <p className="text-xs opacity-65">Heritage Lineage</p>
                <p className="font-display text-2xl font-semibold mt-0.5 font-mono-tabular">
                  Since {config.sinceYear}
                </p>
                <p className="text-xs opacity-75 mt-0.5">4th-Gen Lucknowi Rakabdars</p>
              </div>
              <div>
                <p className="text-xs opacity-65">Guest Satisfaction</p>
                <p className="font-display text-2xl font-semibold mt-0.5 font-mono-tabular">
                  4.9 ★ / 5.0
                </p>
                <p className="text-xs opacity-75 mt-0.5">Across 1,420+ Google & Zomato Reviews</p>
              </div>
              <div>
                <p className="text-xs opacity-65">Food Safety & Hygiene</p>
                <p className="font-display text-2xl font-semibold mt-0.5 font-mono-tabular">
                  FSSAI 5/5 Rated
                </p>
                <p className="text-xs opacity-75 mt-0.5 font-mono-tabular">
                  Lic. No. {config.fssaiNumber}
                </p>
              </div>
              <div>
                <p className="text-xs opacity-65">Direct Order Advantage</p>
                <p className="font-display text-2xl font-semibold mt-0.5 text-[#8B1E24] dark:text-[#E5C158]">
                  Save 10% Instant
                </p>
                <p className="text-xs opacity-75 mt-0.5">Zero Aggregator Packaging Fees</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 01: ABOUT (STORY, CHEF, AMBIENCE, SINCE BADGE, FSSAI & HYGIENE BADGES) */}
        <section
          id="about"
          className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
            isDark ? 'bg-[#14110F] border-[#261F1C]' : 'bg-[#F4EFE4] border-[#E6DFD1]'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left 6 Cols: Story, Chef, Since Year, FSSAI & Hygiene Standards */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-medium tracking-wide text-[#8B1E24] dark:text-[#D4AF37]">
                    01. Our Heritage · Established {config.sinceYear} in {config.city}
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-balance">
                    The Art of Slow Fire, Saffron, and Sealed Clay
                  </h2>
                  <p className="text-sm sm:text-base opacity-80 leading-relaxed">
                    Founded in {config.sinceYear} in {config.neighborhood},{' '}
                    <strong>{config.name}</strong> was born to preserve the unhurried culinary
                    traditions of royal Awadh and Old Delhi. While modern kitchens rush gravies in
                    pressure cookers, our copper degs are sealed with whole-wheat dough (<em>dum</em>)
                    and left to breathe over dying tamarind charcoal for up to eight hours.
                  </p>
                  <p className="text-sm sm:text-base opacity-80 leading-relaxed">
                    Our kitchen is led by <strong>Executive Chef Ustad Mehmood Ali Khan</strong>, a
                    fourth-generation Rakabdar trained in Lucknow’s historic Chowk. Every spice
                    blend—from our 32-ingredient Galouti potli masala to our Kashmiri saffron and
                    kewra infusions—is stone-ground in-house each morning.
                  </p>
                </div>

                {/* Hygiene, Since Year & FSSAI Verification Grid */}
                <div
                  className={`p-5 sm:p-6 rounded-xl border space-y-4 ${
                    isDark ? 'bg-[#191513] border-[#2D2420]' : 'bg-white border-[#E5DEC9]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-current/10">
                    <span className="font-display text-xl font-semibold">
                      Kitchen Hygiene & Authenticity Credentials
                    </span>
                    <span className="text-xs font-mono-tabular font-semibold text-[#8B1E24] dark:text-[#D4AF37]">
                      Since {config.sinceYear} · FSSAI {config.fssaiNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>FSSAI 5-Star Hygiene</span>
                      </div>
                      <p className="opacity-70">
                        Separate Vegetarian & Non-Vegetarian prep zones, utensils, and clay tandoors.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Award className="w-4 h-4 text-[#C59B27] shrink-0" />
                        <span>Pure A2 Ghee & Saffron</span>
                      </div>
                      <p className="opacity-70">
                        Zero artificial colours, zero palm oil, and Grade-A Pampore Mongra saffron.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Flame className="w-4 h-4 text-[#8B1E24] dark:text-[#E5C158] shrink-0" />
                        <span>Tin-Lined Copper Vessels</span>
                      </div>
                      <p className="opacity-70">
                        Traditional <em>kalai</em> tin-coated degs for authentic heat distribution.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 6 Cols: Interior Ambience & Chef Showcase */}
              <div className="lg:col-span-6 flex flex-col">
                <div
                  className={`relative w-full h-full min-h-[360px] rounded-xl overflow-hidden border ${
                    isDark ? 'border-[#2E2520]' : 'border-[#DFD5C3]'
                  }`}
                >
                  <ResilientImage
                    src={IMAGES.interiorHall}
                    alt={`Ambience and open kitchen at ${config.name}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6 text-white">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#E5C158]">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Ambience & Live Copper Kitchen</span>
                      <span aria-hidden="true">·</span>
                      <span>84-Seat Heritage Dining Room</span>
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold mt-1">
                      Sandstone Arches, Brass Jaali Lanterns & Ustad Mehmood at the Pass
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 mt-1">
                      Watch our chefs hand-stretch Khamiri rotis and crack open sealed earthen
                      biryani handis from our glass-walled copper kitchen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: INTERACTIVE MENU */}
        <MenuSection
          items={MENU_ITEMS}
          config={config}
          cart={cart}
          onUpdateQty={handleUpdateQty}
          onOpenOrderDrawer={() => setIsOrderDrawerOpen(true)}
          isDark={isDark}
        />

        {/* SECTIONS 03 & 04: TABLE BOOKING + REVIEWS */}
        <BookingAndReviewsSection
          config={config}
          reviews={reviews}
          onAddReview={handleAddReview}
          isDark={isDark}
        />

        {/* SECTIONS 05, 06, 07 & FOOTER: GALLERY, DELIVERY PARTNERS, CONTACT, NEWSLETTER */}
        <GalleryDeliveryContactSection
          config={config}
          onOpenOrderDrawer={() => setIsOrderDrawerOpen(true)}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          isDark={isDark}
        />
      </main>

      {/* FLOATING "CALL NOW" BUTTON ON MOBILE (Compact to respect 15% mobile sticky cap) */}
      <div className="md:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <a
          href={`tel:${config.phone.replace(/\s+/g, '')}`}
          aria-label={`Call ${config.name} now`}
          className="h-11 px-4 rounded-lg bg-[#8B1E24] text-white text-xs font-semibold shadow-lg inline-flex items-center gap-2 border border-[#C59B27]/40 whitespace-nowrap shrink-0"
        >
          <Phone className="w-4 h-4" />
          <span>Call Now</span>
        </a>
      </div>

      {/* DIRECT WHATSAPP ORDER DRAWER */}
      <WhatsAppOrderDrawer
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onClearCart={() => setCart([])}
        config={config}
        isDark={isDark}
      />

      {/* RESTAURANT CUSTOMIZER MODAL */}
      <RestaurantCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        isDark={isDark}
      />
    </div>
  );
}
