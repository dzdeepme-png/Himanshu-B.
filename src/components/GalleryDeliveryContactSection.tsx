import React, { useState } from 'react';
import {
  Instagram,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Mail,
  CheckCircle2,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import {
  GALLERY_ITEMS,
  GalleryItem,
  OPENING_HOURS,
  RestaurantConfig,
} from '../data/restaurantData';
import { ResilientImage } from './ResilientImage';

interface GalleryDeliveryContactProps {
  config: RestaurantConfig;
  onOpenOrderDrawer: () => void;
  onOpenCustomizer: () => void;
  isDark: boolean;
}

export const GalleryDeliveryContactSection: React.FC<GalleryDeliveryContactProps> = ({
  config,
  onOpenOrderDrawer,
  onOpenCustomizer,
  isDark,
}) => {
  // Gallery & Lightbox State
  const [galleryFilter, setGalleryFilter] = useState<
    'All' | 'Signature Dishes' | 'Ambience & Craft'
  >('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Newsletter / WhatsApp Broadcast State
  const [signupChannel, setSignupChannel] = useState<'WhatsApp' | 'Email'>('WhatsApp');
  const [signupInput, setSignupInput] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Privacy Modal State
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const filteredGallery: GalleryItem[] =
    galleryFilter === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((g) => g.category === galleryFilter);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const nextLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredGallery.length);
  };
  const prevLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length);
  };

  // Compute real-time "Open Now" status
  const now = new Date();
  const currentDayIndex = now.getDay();
  const currentHourDecimal = now.getHours() + now.getMinutes() / 60;
  const todaySchedule =
    OPENING_HOURS.find((d) => d.dayIndex === currentDayIndex) || OPENING_HOURS[0];

  const isLunchOpen = currentHourDecimal >= 12 && currentHourDecimal <= 15.5;
  const isDinnerOpen =
    currentHourDecimal >= 19 && currentHourDecimal <= todaySchedule.closeHour;
  const isCurrentlyOpen = isLunchOpen || isDinnerOpen;

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupInput.trim()) return;
    setSignupSuccess(true);
    setSignupInput('');
    setTimeout(() => setSignupSuccess(false), 5000);
  };

  return (
    <>
      {/* SECTION 05: GALLERY WITH LIGHTBOX + INSTAGRAM LINK */}
      <section
        id="gallery"
        className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
          isDark ? 'bg-[#14110F] border-[#261F1C]' : 'bg-[#F4EFE4] border-[#E6DFD1]'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-current/10">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#8B1E24] dark:text-[#D4AF37]">
                05. Visual Anthology · Culinary Craft & Architecture
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mt-2 text-balance">
                Inside {config.name}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Filter Segmented Control */}
              <div
                className={`flex items-center gap-1 p-1 rounded-lg ${
                  isDark ? 'bg-[#1D1815]' : 'bg-[#E6DEC8]'
                }`}
              >
                {(['All', 'Signature Dishes', 'Ambience & Craft'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setGalleryFilter(tab);
                      setLightboxIndex(null);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      galleryFilter === tab
                        ? 'bg-[#8B1E24] text-white'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Instagram Link */}
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-lg border text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                  isDark
                    ? 'border-[#332924] bg-[#1A1513] hover:bg-[#241E1B]'
                    : 'border-[#D5CBB8] bg-white hover:bg-[#FAF7F2]'
                }`}
              >
                <Instagram className="w-4 h-4 text-[#8B1E24] dark:text-[#D4AF37]" />
                <span>{config.instagramHandle}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>

          {/* Gallery Bento Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredGallery.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => openLightbox(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(idx);
                  }
                }}
                className={`group relative rounded-xl overflow-hidden border cursor-pointer ${
                  item.aspectClass
                } ${isDark ? 'border-[#2B231F]' : 'border-[#DFD5C3]'}`}
              >
                <ResilientImage
                  src={item.image}
                  alt={item.title}
                  objectPosition={item.objectPosition}
                  fallbackTitle={item.title}
                  className="w-full h-full transition-transform duration-300 group-hover:scale-103"
                />
                {/* Measured Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#E5C158] font-medium">{item.category}</p>
                      <h3 className="font-display text-xl sm:text-2xl font-semibold mt-0.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/80 mt-1 line-clamp-2">{item.caption}</p>
                    </div>
                    <span className="p-2 rounded-lg bg-black/50 text-white shrink-0 group-hover:bg-[#8B1E24] transition-colors">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <div
              className="relative max-w-4xl w-full bg-[#14110F] text-[#F5EFE6] rounded-xl overflow-hidden border border-[#332924]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2A221E]">
                <div className="text-xs opacity-75">
                  <span>{filteredGallery[lightboxIndex].category}</span>
                  <span aria-hidden="true"> · </span>
                  <span className="font-mono-tabular">
                    Image {lightboxIndex + 1} of {filteredGallery.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Close lightbox"
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-[16/9] w-full bg-black">
                <ResilientImage
                  src={filteredGallery[lightboxIndex].image}
                  alt={filteredGallery[lightboxIndex].title}
                  objectPosition={filteredGallery[lightboxIndex].objectPosition}
                  className="w-full h-full"
                />
                <button
                  type="button"
                  onClick={prevLightbox}
                  aria-label="Previous gallery photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-black/70 hover:bg-[#8B1E24] text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextLightbox}
                  aria-label="Next gallery photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-black/70 hover:bg-[#8B1E24] text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-display text-2xl font-semibold">
                    {filteredGallery[lightboxIndex].title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#D6CBB9] mt-1">
                    {filteredGallery[lightboxIndex].caption}
                  </p>
                </div>
                <a
                  href={config.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#8B1E24] hover:bg-[#70161B] text-white text-xs font-semibold inline-flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <Instagram className="w-4 h-4" />
                  <span>View on Instagram</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 06: DELIVERY PARTNERS (SWIGGY, ZOMATO & DIRECT WHATSAPP SAVINGS) */}
      <section
        id="delivery"
        className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
          isDark ? 'border-[#261F1C]' : 'border-[#E6DFD1]'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-xs font-medium tracking-wide text-[#8B1E24] dark:text-[#D4AF37]">
              06. Royal Home Delivery · Sealed Earthen Handis
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mt-2 text-balance">
              Order Online via Swiggy, Zomato, or Direct
            </h2>
            <p className="text-sm sm:text-base opacity-75 mt-2">
              Order direct on WhatsApp for the best price — enjoy flat 10% off menu rates, zero
              aggregator packaging surcharges, and priority dispatch from our Colaba kitchen.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Swiggy Card */}
            <div
              className={`p-6 rounded-xl border flex flex-col justify-between ${
                isDark ? 'bg-[#171311] border-[#2B231F]' : 'bg-white border-[#E5DEC9]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-[#FC8019] text-white font-display font-bold text-xl flex items-center justify-center shrink-0">
                      S
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold">Swiggy</h3>
                      <p className="text-xs opacity-70">Live Rider Tracking · {config.city}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono-tabular opacity-75">35–45 mins</span>
                </div>
                <p className="mt-4 text-xs sm:text-sm opacity-75 leading-relaxed">
                  Available across South & Central {config.city} with Swiggy One free delivery
                  benefits and temperature-sealed handi boxes.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-current/10">
                <a
                  href={config.swiggyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#FC8019] hover:bg-[#E36F0E] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Order on Swiggy</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Zomato Card */}
            <div
              className={`p-6 rounded-xl border flex flex-col justify-between ${
                isDark ? 'bg-[#171311] border-[#2B231F]' : 'bg-white border-[#E5DEC9]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-[#E23744] text-white font-display font-bold text-xl flex items-center justify-center shrink-0">
                      Z
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold">Zomato</h3>
                      <p className="text-xs opacity-70">4.9★ Top Rated · {config.city}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono-tabular opacity-75">35–45 mins</span>
                </div>
                <p className="mt-4 text-xs sm:text-sm opacity-75 leading-relaxed">
                  Order our full Awadhi menu on Zomato with Gold member offers, custom spice
                  instructions, and scheduled group orders.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-current/10">
                <a
                  href={config.zomatoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#E23744] hover:bg-[#C72B37] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Order on Zomato</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Direct WhatsApp Best Price Card */}
            <div
              className={`p-6 rounded-xl border flex flex-col justify-between ${
                isDark
                  ? 'bg-[#1A1512] border-[#C59B27]/50'
                  : 'bg-[#FAF3E3] border-[#C59B27]/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-[#1F7A4C] text-white flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold">
                        Direct on WhatsApp
                      </h3>
                      <p className="text-xs font-semibold text-[#8B1E24] dark:text-[#D4AF37]">
                        Best Price Guarantee · Save 10%
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono-tabular font-semibold">Code: {config.offerCode}</span>
                </div>
                <p className="mt-4 text-xs sm:text-sm opacity-85 leading-relaxed">
                  Order direct on WhatsApp for the best price. Pay menu prices minus 10%, skip
                  third-party commissions, and get direct Dunzo/WeFast express dispatch.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-current/10">
                <button
                  type="button"
                  onClick={onOpenOrderDrawer}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#1F7A4C] hover:bg-[#18633D] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Direct on WhatsApp (Save 10%)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07: CONTACT, GOOGLE MAP, OPENING HOURS & NEWSLETTER SIGNUP */}
      <section
        id="contact"
        className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
          isDark ? 'bg-[#14110F] border-[#261F1C]' : 'bg-[#F4EFE4] border-[#E6DFD1]'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left 6 Cols: Contact Info & Opening Hours with Open Now Indicator */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
              <div>
                <p className="text-xs font-medium tracking-wide text-[#8B1E24] dark:text-[#D4AF37]">
                  07. Visit Our Dastarkhwan · Location & Hours
                </p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mt-2 text-balance">
                  Find Us in {config.neighborhood}, {config.city}
                </h2>

                {/* Address & Phone Block */}
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#8B1E24] dark:text-[#D4AF37] shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Restaurant Address</p>
                      <p className="opacity-75 mt-0.5">{config.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#8B1E24] dark:text-[#D4AF37] shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Host Desk & Direct Line</p>
                      <p className="opacity-75 mt-0.5 font-mono-tabular">
                        <a
                          href={`tel:${config.phone.replace(/\s+/g, '')}`}
                          className="hover:underline"
                        >
                          {config.phone}
                        </a>{' '}
                        ·{' '}
                        <a href={`mailto:${config.email}`} className="hover:underline">
                          {config.email}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Opening Hours Table with Real-Time Open Now Indicator */}
                <div
                  className={`mt-6 p-5 rounded-xl border ${
                    isDark ? 'bg-[#191513] border-[#2C231F]' : 'bg-white border-[#E5DEC9]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-current/10">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C59B27]" />
                      <h3 className="font-display text-xl font-semibold">Opening Hours</h3>
                    </div>

                    {/* Clean Typographic + Icon Open Now Indicator (No decorative pulsing dots) */}
                    <span
                      className={`text-xs font-semibold inline-flex items-center gap-1.5 ${
                        isCurrentlyOpen
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {isCurrentlyOpen
                          ? 'Open Now · Serving Royal Dastarkhwan'
                          : 'Kitchen Resting · Opens at 12:00 PM & 07:00 PM'}
                      </span>
                    </span>
                  </div>

                  <div className="mt-3 divide-y divide-current/5 text-xs">
                    {OPENING_HOURS.map((row) => {
                      const isToday = row.dayIndex === currentDayIndex;
                      return (
                        <div
                          key={row.day}
                          className={`py-2 flex flex-wrap items-center justify-between gap-2 ${
                            isToday
                              ? 'font-semibold text-[#8B1E24] dark:text-[#E5C158]'
                              : 'opacity-75'
                          }`}
                        >
                          <span>
                            {row.day} {isToday ? '(Today)' : ''}
                          </span>
                          <span className="font-mono-tabular">
                            {row.lunch} · {row.dinner}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Get Directions + Call Now */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={config.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-lg bg-[#8B1E24] hover:bg-[#70161B] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href={`tel:${config.phone.replace(/\s+/g, '')}`}
                  className={`px-5 py-3 rounded-lg border text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'border-[#332924] bg-[#1A1513] hover:bg-[#241E1B]'
                      : 'border-[#D5CBB8] bg-white hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Phone className="w-4 h-4 text-[#C59B27]" />
                  <span>Call {config.phone}</span>
                </a>
              </div>
            </div>

            {/* Right 6 Cols: Embedded Google Map */}
            <div className="lg:col-span-6 min-h-[380px] flex flex-col">
              <div
                className={`w-full h-full min-h-[380px] rounded-xl overflow-hidden border relative ${
                  isDark ? 'border-[#2C231F]' : 'border-[#DFD5C3]'
                }`}
              >
                <iframe
                  title={`Google Map location for ${config.name}`}
                  src={config.googleMapsEmbedUrl}
                  className="w-full h-full min-h-[380px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* NEWSLETTER / WHATSAPP BROADCAST OFFERS SIGNUP */}
          <div
            className={`p-6 sm:p-10 rounded-xl border ${
              isDark ? 'bg-[#181412] border-[#2E2520]' : 'bg-white border-[#E5DEC9]'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <p className="text-xs font-medium tracking-wide text-[#8B1E24] dark:text-[#D4AF37]">
                  The Royal Dastarkhwan Circle · Free VIP Broadcast
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold mt-1">
                  Get Secret Seasonal Menus & 15% Dining Invitations
                </h3>
                <p className="text-xs sm:text-sm opacity-75 mt-1.5 max-w-xl">
                  Join our zero-spam WhatsApp broadcast or email letter for winter Guchhi specials,
                  Eid dastarkhwan pre-bookings, and subscriber-only direct order codes.
                </p>
              </div>

              <div className="lg:col-span-5">
                {signupSuccess ? (
                  <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-700/40 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>
                      Welcome to the Dastarkhwan Circle! Your welcome code{' '}
                      <strong className="font-mono-tabular">{config.offerCode}</strong> is ready to
                      use.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleBroadcastSubmit} className="space-y-3">
                    <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-current/5">
                      {(['WhatsApp', 'Email'] as const).map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setSignupChannel(ch)}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                            signupChannel === ch
                              ? 'bg-[#8B1E24] text-white'
                              : 'opacity-75 hover:opacity-100'
                          }`}
                        >
                          {ch === 'WhatsApp' ? 'WhatsApp Broadcast' : 'Email Newsletter'}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <div className="relative flex-1">
                        {signupChannel === 'WhatsApp' ? (
                          <MessageCircle className="w-4 h-4 opacity-50 absolute left-3 top-1/2 -translate-y-1/2" />
                        ) : (
                          <Mail className="w-4 h-4 opacity-50 absolute left-3 top-1/2 -translate-y-1/2" />
                        )}
                        <input
                          type={signupChannel === 'Email' ? 'email' : 'tel'}
                          required
                          value={signupInput}
                          onChange={(e) => setSignupInput(e.target.value)}
                          placeholder={
                            signupChannel === 'WhatsApp'
                              ? 'Enter WhatsApp number (+91...)'
                              : 'Enter your email address'
                          }
                          className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border bg-transparent focus:outline-none focus:border-[#8B1E24] ${
                            isDark ? 'border-[#332924]' : 'border-[#D5CBB8]'
                          }`}
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-lg bg-[#8B1E24] hover:bg-[#70161B] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                      >
                        Join Circle
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUIET FOOTER */}
      <footer
        className={`py-12 px-4 sm:px-6 lg:px-8 border-t text-xs ${
          isDark
            ? 'bg-[#100D0C] border-[#261F1C] text-[#BFB3A4]'
            : 'bg-[#EBE4D4] border-[#DCD2BE] text-[#4A3F37]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2">
            <p className="font-display text-2xl font-semibold text-current">{config.name}</p>
            <p>
              {config.cuisine} · {config.address}
            </p>
            <p className="font-mono-tabular">
              Established {config.sinceYear} · FSSAI Lic. No. {config.fssaiNumber}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline whitespace-nowrap shrink-0"
            >
              Instagram ({config.instagramHandle})
            </a>
            <a
              href={config.swiggyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline whitespace-nowrap shrink-0"
            >
              Swiggy
            </a>
            <a
              href={config.zomatoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline whitespace-nowrap shrink-0"
            >
              Zomato
            </a>
            <a
              href={config.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline whitespace-nowrap shrink-0"
            >
              Google Reviews
            </a>
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="hover:underline whitespace-nowrap shrink-0"
            >
              Privacy Note
            </button>
            <button
              type="button"
              onClick={onOpenCustomizer}
              className="inline-flex items-center gap-1.5 font-semibold text-[#8B1E24] dark:text-[#D4AF37] hover:underline whitespace-nowrap shrink-0"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Customize Restaurant Info</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-current/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-75">
          <p>
            © {new Date().getFullYear()} {config.name}, {config.city}. All rights reserved.
          </p>
          <p>
            Privacy Note: Guest phone numbers and emails submitted for table bookings or WhatsApp
            orders are used strictly for order fulfillment and never shared with third parties.
          </p>
        </div>

        {/* Privacy Modal */}
        {showPrivacyModal && (
          <div
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowPrivacyModal(false)}
          >
            <div
              className={`max-w-lg w-full p-6 rounded-xl border space-y-4 ${
                isDark
                  ? 'bg-[#161311] text-[#F5EFE6] border-[#2E2520]'
                  : 'bg-[#FAF7F2] text-[#1C1613] border-[#E5DEC9]'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-current/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#C59B27]" />
                  <h4 className="font-display text-xl font-semibold">
                    Guest Privacy & Food Safety Note
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-1 rounded hover:bg-current/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2.5 text-xs leading-relaxed opacity-85">
                <p>
                  <strong>1. Zero Tracking & Direct Communication:</strong> {config.name} uses free,
                  transparent tools (WhatsApp Direct & {config.formServiceProvider}) without third-party
                  advertising trackers.
                </p>
                <p>
                  <strong>2. Reservation & Order Data:</strong> Your name, mobile number, and dining
                  preferences are used solely to confirm your table reservation or dispatch your direct
                  delivery order.
                </p>
                <p>
                  <strong>3. FSSAI & Kitchen Transparency:</strong> Licensed under FSSAI No.{' '}
                  <span className="font-mono-tabular">{config.fssaiNumber}</span>. Guests are welcome to
                  view our open copper tandoor kitchen in {config.neighborhood} at any time.
                </p>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#8B1E24] text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </footer>
    </>
  );
};
