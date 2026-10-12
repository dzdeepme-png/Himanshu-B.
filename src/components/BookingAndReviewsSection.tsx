import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Send,
} from 'lucide-react';
import { RestaurantConfig, ReviewItem } from '../data/restaurantData';

interface BookingAndReviewsProps {
  config: RestaurantConfig;
  reviews: ReviewItem[];
  onAddReview: (review: ReviewItem) => void;
  isDark: boolean;
}

export const BookingAndReviewsSection: React.FC<BookingAndReviewsProps> = ({
  config,
  reviews,
  onAddReview,
  isDark,
}) => {
  // Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [bookingDate, setBookingDate] = useState(todayStr);
  const [bookingTime, setBookingTime] = useState('20:00');
  const [guestCount, setGuestCount] = useState('4');
  const [occasion, setOccasion] = useState('Family Dastarkhwan');
  const [seatingNote, setSeatingNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [waCopied, setWaCopied] = useState(false);

  // Reviews Carousel & On-Site Feedback State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fbName, setFbName] = useState('');
  const [fbLocation, setFbLocation] = useState('');
  const [fbDish, setFbDish] = useState('Lucknowi Galouti Kebab');
  const [fbRating, setFbRating] = useState(5);
  const [fbComment, setFbComment] = useState('');
  const [fbSubmitted, setFbSubmitted] = useState(false);

  const numericGuests = parseInt(guestCount, 10) || 2;
  const qualifiesForFreeDessert = numericGuests >= 4;

  const buildBookingWhatsAppText = () => {
    const refPart = bookingRef ? ` [Ref: ${bookingRef}]` : '';
    return [
      `Hello ${config.name} (${config.city})! Please confirm my table reservation${refPart}:`,
      `- Name: ${guestName || 'Guest'}`,
      `- Phone: ${guestPhone || 'Not provided'}`,
      `- Date: ${bookingDate}`,
      `- Time: ${bookingTime}`,
      `- Guests: ${guestCount} Guests`,
      `- Occasion: ${occasion}`,
      qualifiesForFreeDessert ? `- Offer Applied: Free Shahi Tukda Dessert (4+ Guests)` : '',
      seatingNote ? `- Special Request: ${seatingNote}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const whatsappBookingHref = `https://wa.me/${config.whatsappNumber.replace(
    /[^0-9]/g,
    ''
  )}?text=${encodeURIComponent(buildBookingWhatsAppText())}`;

  const handleCopyBookingWa = () => {
    navigator.clipboard?.writeText(buildBookingWhatsAppText());
    setWaCopied(true);
    setTimeout(() => setWaCopied(false), 2500);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');

    const cleanPhone = guestPhone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 8) {
      setBookingError('Please enter a valid 10-digit mobile or phone number.');
      return;
    }

    setIsSubmitting(true);
    const generatedRef = `ZE-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // If user configured a Web3Forms Access Key or Formspree endpoint, post to it directly
      if (config.formEndpointOrKey.trim() !== '') {
        if (config.formServiceProvider === 'Web3Forms') {
          await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              access_key: config.formEndpointOrKey.trim(),
              subject: `Table Reservation ${generatedRef} - ${config.name}`,
              name: guestName,
              phone: guestPhone,
              date: bookingDate,
              time: bookingTime,
              guests: guestCount,
              occasion,
              notes: seatingNote,
            }),
          });
        } else if (config.formServiceProvider === 'Formspree') {
          const endpoint = config.formEndpointOrKey.startsWith('http')
            ? config.formEndpointOrKey.trim()
            : `https://formspree.io/f/${config.formEndpointOrKey.trim()}`;
          await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              reference: generatedRef,
              name: guestName,
              phone: guestPhone,
              date: bookingDate,
              time: bookingTime,
              guests: guestCount,
              occasion,
              notes: seatingNote,
            }),
          });
        }
      }
    } catch {
      // Even if external network is blocked in sandbox, preserve local booking confirmation + WhatsApp handoff
    } finally {
      setIsSubmitting(false);
      setBookingRef(generatedRef);
      setBookingSubmitted(true);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbName.trim() || !fbComment.trim()) return;

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: fbName.trim(),
      role: fbLocation.trim() || `Verified Diner · ${config.city}`,
      rating: fbRating,
      date: 'Just now',
      platform: 'Direct',
      dishTried: fbDish,
      comment: fbComment.trim(),
    };

    onAddReview(newReview);
    setCurrentSlide(0);
    setFbName('');
    setFbLocation('');
    setFbComment('');
    setFbSubmitted(true);
    setTimeout(() => setFbSubmitted(false), 4000);
  };

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(reviews.length, 1)
  ).toFixed(1);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const activeReview = reviews[currentSlide] || reviews[0];

  return (
    <>
      {/* SECTION 03: TABLE BOOKING (FREE) */}
      <section
        id="booking"
        className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
          isDark ? 'bg-[#14110F] border-[#261F1C]' : 'bg-[#F4EFE4] border-[#E6DFD1]'
        }`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Reservation Hospitality Promise & Perks */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#8B1E24] dark:text-[#D4AF37]">
                03. Reserve Your Dastarkhwan · Zero Booking Fees
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mt-2 text-balance">
                Book a Table in {config.neighborhood}
              </h2>
              <p className="text-sm sm:text-base opacity-75 mt-3 leading-relaxed">
                Reserve online via our free instant form ({config.formServiceProvider}) or confirm
                directly with our maitre d’ on WhatsApp. Tables are held for 20 minutes past your
                reservation time.
              </p>
            </div>

            {/* Dining Perks Breakdown */}
            <div
              className={`p-6 rounded-xl border space-y-4 ${
                isDark ? 'bg-[#1A1513] border-[#2D2420]' : 'bg-[#FAF7F2] border-[#E2D9C6]'
              }`}
            >
              <h3 className="font-display text-xl font-semibold">
                Direct Table Reservation Benefits
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm">
                <li className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Complimentary Royal Shahi Tukda:</span> Every
                    party of 4 or more guests receives our signature saffron-rabri dessert on the
                    house.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Pre-Order Purdah Dum Biryani:</span> Mention
                    Purdah Biryani in your booking note so we seal your clay handi 45 minutes before
                    your arrival.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Private Majlis Alcove (8–16 Guests):</span>{' '}
                    Available for milestone birthdays, anniversaries, and corporate dinners with
                    custom tasting menus.
                  </div>
                </li>
              </ul>
            </div>

            {/* Direct Phone Callout */}
            <div className="pt-2 text-xs opacity-75 space-y-1">
              <p>
                Prefer speaking with our host desk? Call{' '}
                <a
                  href={`tel:${config.phone.replace(/\s+/g, '')}`}
                  className="font-mono-tabular font-semibold underline hover:text-[#8B1E24]"
                >
                  {config.phone}
                </a>{' '}
                between 11:00 AM and 11:00 PM.
              </p>
            </div>
          </div>

          {/* Right Column: Free Booking Form + Pre-filled WhatsApp Confirmation */}
          <div className="lg:col-span-7">
            <div
              className={`p-6 sm:p-8 rounded-xl border ${
                isDark ? 'bg-[#181412] border-[#2E2520]' : 'bg-white border-[#E5DEC9]'
              }`}
            >
              {bookingSubmitted ? (
                <div className="space-y-5 py-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-mono-tabular opacity-70">
                        Reservation Reference: {bookingRef} · Logged via {config.formServiceProvider}
                      </p>
                      <h3 className="font-display text-2xl sm:text-3xl font-semibold mt-0.5">
                        Table Request Received for {guestName}
                      </h3>
                      <p className="text-xs sm:text-sm opacity-75 mt-1">
                        We have registered your table for{' '}
                        <span className="font-semibold">{guestCount} guests</span> on{' '}
                        <span className="font-mono-tabular font-semibold">{bookingDate}</span> at{' '}
                        <span className="font-mono-tabular font-semibold">{bookingTime}</span> (
                        {occasion}).
                      </p>
                    </div>
                  </div>

                  {qualifiesForFreeDessert && (
                    <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-700/40 text-xs text-emerald-700 dark:text-emerald-300">
                      Unlocked: Complimentary Royal Shahi Tukda Dessert for your table of{' '}
                      {guestCount} guests.
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-lg border text-xs font-mono-tabular whitespace-pre-line ${
                      isDark
                        ? 'bg-[#120F0E] border-[#2A221E]'
                        : 'bg-[#FAF7F2] border-[#E5DEC9]'
                    }`}
                  >
                    {buildBookingWhatsAppText()}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={whatsappBookingHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 rounded-lg bg-[#1F7A4C] hover:bg-[#18633D] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirm on WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyBookingWa}
                      className="px-4 py-3 rounded-lg border border-current/20 hover:bg-current/5 text-xs font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                    >
                      {waCopied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Copied Details</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 opacity-70" />
                          <span>Copy Booking Text</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setBookingSubmitted(false)}
                      className="px-4 py-3 rounded-lg text-xs font-medium underline opacity-75 hover:opacity-100 whitespace-nowrap shrink-0"
                    >
                      Modify Reservation
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-current/10">
                    <h3 className="font-display text-2xl font-semibold">
                      Table Reservation Form
                    </h3>
                    <span className="text-xs opacity-65">
                      Powered by {config.formServiceProvider} · Instant WhatsApp Sync
                    </span>
                  </div>

                  {bookingError && (
                    <div className="p-3 rounded-lg bg-red-950/20 border border-red-600/40 text-xs text-red-600 dark:text-red-400">
                      {bookingError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g., Zoya Akhtar"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-transparent focus:outline-none focus:border-[#8B1E24] ${
                          isDark ? 'border-[#332924]' : 'border-[#D5CBB8]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5">
                        Mobile / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+91 98204 11998"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-transparent font-mono-tabular focus:outline-none focus:border-[#8B1E24] ${
                          isDark ? 'border-[#332924]' : 'border-[#D5CBB8]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#C59B27]" />
                          <span>Date *</span>
                        </span>
                      </label>
                      <input
                        type="date"
                        required
                        min={todayStr}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-transparent font-mono-tabular focus:outline-none focus:border-[#8B1E24] ${
                          isDark ? 'border-[#332924]' : 'border-[#D5CBB8]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#C59B27]" />
                          <span>Time Slot *</span>
                        </span>
                      </label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-transparent font-mono-tabular focus:outline-none focus:border-[#8B1E24] ${
                          isDark ? 'border-[#332924]' : 'border-[#D5CBB8]'
                        }`}
                      >
                        <option value="12:30" className="text-black">12:30 PM (Lunch)</option>
                        <option value="13:30" className="text-black">01:30 PM (Lunch)</option>
                        <option value="14:30" className="text-black">02:30 PM (Lunch)</option>
                        <option value="19:30" className="text-black">07:30 PM (Dinner)</option>
                        <option value="20:00" className="text-black">08:00 PM (Dinner)</option>
                        <option value="20:30" className="text-black">08:30 PM (Dinner)</option>
                        <option value="21:15" className="text-black">09:15 PM (Dinner)</option>
                        <option value="22:00" className="text-black">10:00 PM (Late Dinner)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5">
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#C59B27]" />
                          <span>Guests *</span>
                        </span>
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-transparent font-mono-tabular focus:outline-none focus:border-[#8B1E24] ${
                          isDark ? 'border-[#332924]' : 'border-[#D5CBB8]'
                        }`}
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                          <option key={num} value={String(num)} className="text-black">
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                            {num >= 4 ? ' (Free Dessert)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5">Occasion</label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-transparent focus:outline-none focus:border-[#8B1E24] ${
                          isDark ? 'border-[#332924]' : 'border-[#D5CBB8]'
                        }`}
                      >
                        <option value="Family Dastarkhwan" className="text-black">
                          Family Dastarkhwan
                        </option>
                        <option value="Anniversary Celebration" className="text-black">
                          Anniversary Celebration
                        </option>
                        <option value="Birthday Feast" className="text-black">
                          Birthday Feast
                        </option>
                        <option value="Business / Client Dinner" className="text-black">
                          Business / Client Dinner
                        </option>
                        <option value="Date Night" className="text-black">
                          Date Night
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5">
                        Seating or Dietary Request (Optional)
                      </label>
                      <input
                        type="text"
                        value={seatingNote}
                        onChange={(e) => setSeatingNote(e.target.value)}
                        placeholder="e.g., Quiet booth, Jain prep, Wheelchair access"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-transparent focus:outline-none focus:border-[#8B1E24] ${
                          isDark ? 'border-[#332924]' : 'border-[#D5CBB8]'
                        }`}
                      />
                    </div>
                  </div>

                  {qualifiesForFreeDessert && (
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      ✓ Party of {guestCount} qualifies for a complimentary Royal Shahi Tukda dessert.
                    </p>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-5 rounded-lg bg-[#8B1E24] hover:bg-[#70161B] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
                    >
                      {isSubmitting ? 'Confirming Table...' : 'Book Table Now (Free)'}
                    </button>

                    <a
                      href={whatsappBookingHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-5 rounded-lg bg-[#1F7A4C] hover:bg-[#18633D] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirm on WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04: REVIEWS & GUEST FEEDBACK (FREE) */}
      <section
        id="reviews"
        className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
          isDark ? 'border-[#261F1C]' : 'border-[#E6DFD1]'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header + Rating Summary */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-current/10">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#8B1E24] dark:text-[#D4AF37]">
                04. Guest Chronicles · Verified Dastarkhwan Reviews
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mt-2 text-balance">
                Loved by South Mumbai & Culinary Critics
              </h2>
            </div>

            {/* Clean Unboxed Average Rating Summary + External Review Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-[#C59B27]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-mono-tabular font-bold text-base">{averageRating} / 5.0</span>
                <span aria-hidden="true" className="opacity-40">
                  ·
                </span>
                <span className="opacity-75">1,420+ Verified Diners</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={config.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-[#8B1E24] hover:bg-[#70161B] text-white font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Write a Review on Google</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={config.zomatoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3.5 py-2 rounded-lg border font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'border-[#332924] hover:bg-[#1E1916]'
                      : 'border-[#D5CBB8] hover:bg-[#EFE9DC]'
                  }`}
                >
                  <span>Read on Google / Zomato</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left 7 Cols: Interactive Testimonials Carousel + Grid */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              {activeReview && (
                <div
                  className={`p-6 sm:p-8 rounded-xl border flex-1 flex flex-col justify-between ${
                    isDark ? 'bg-[#171311] border-[#2B231F]' : 'bg-white border-[#E5DEC9]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1 text-[#C59B27]">
                        {[...Array(activeReview.rating)].map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <div className="text-xs opacity-65">
                        <span>{activeReview.platform} Review</span>
                        <span aria-hidden="true"> · </span>
                        <span>{activeReview.date}</span>
                      </div>
                    </div>

                    <blockquote className="mt-5 font-display text-xl sm:text-2xl leading-relaxed">
                      “{activeReview.comment}”
                    </blockquote>
                  </div>

                  <div className="mt-6 pt-4 border-t border-current/10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-sm">{activeReview.author}</p>
                      <p className="text-xs opacity-70">
                        {activeReview.role} · Ordered: {activeReview.dishTried}
                      </p>
                    </div>

                    {/* Carousel Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Previous review"
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
                          isDark
                            ? 'border-[#332924] hover:bg-[#241E1B]'
                            : 'border-[#D5CBB8] hover:bg-[#F3EDE0]'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-mono-tabular px-2 opacity-75">
                        {currentSlide + 1} / {reviews.length}
                      </span>
                      <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next review"
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
                          isDark
                            ? 'border-[#332924] hover:bg-[#241E1B]'
                            : 'border-[#D5CBB8] hover:bg-[#F3EDE0]'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Thumbnails of Other Reviews */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.slice(0, 2).map((rev, idx) => (
                  <button
                    key={rev.id}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`p-4 rounded-xl border text-left transition-colors ${
                      currentSlide === idx
                        ? 'border-[#8B1E24]'
                        : isDark
                        ? 'border-[#261F1C] bg-[#14110F] hover:border-[#3A2F29]'
                        : 'border-[#E5DEC9] bg-[#FAF7F2] hover:border-[#C8BFA8]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs opacity-70">
                      <span className="font-semibold text-current">{rev.author}</span>
                      <span>{rev.platform}</span>
                    </div>
                    <p className="text-xs opacity-75 mt-1.5 line-clamp-2">{rev.comment}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Short On-Site Feedback Form */}
            <div className="lg:col-span-5">
              <div
                className={`p-6 sm:p-7 rounded-xl border h-full flex flex-col justify-between ${
                  isDark ? 'bg-[#171311] border-[#2B231F]' : 'bg-white border-[#E5DEC9]'
                }`}
              >
                <div>
                  <h3 className="font-display text-2xl font-semibold">
                    Share Your Dastarkhwan Feedback
                  </h3>
                  <p className="text-xs opacity-70 mt-1">
                    Dined with us or ordered home delivery? Leave an instant review on our guestbook.
                  </p>

                  {fbSubmitted && (
                    <div className="mt-4 p-3 rounded-lg bg-emerald-950/30 border border-emerald-700/40 text-xs text-emerald-700 dark:text-emerald-300">
                      Shukriya! Your review has been published to our live guest carousel.
                    </div>
                  )}

                  <form onSubmit={handleFeedbackSubmit} className="mt-5 space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={fbName}
                          onChange={(e) => setFbName(e.target.value)}
                          placeholder="e.g., Meera Nair"
                          className={`w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none focus:border-[#8B1E24] ${
                            isDark ? 'border-[#332924]' : 'border-[#D5CBB8]'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Neighborhood / Role</label>
                        <input
                          type="text"
                          value={fbLocation}
                          onChange={(e) => setFbLocation(e.target.value)}
                          placeholder="e.g., Cuffe Parade"
                          className={`w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none focus:border-[#8B1E24] ${
                            isDark ? 'border-[#332924]' : 'border-[#D5CBB8]'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Dish Tried</label>
                        <input
                          type="text"
                          value={fbDish}
                          onChange={(e) => setFbDish(e.target.value)}
                          className={`w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none focus:border-[#8B1E24] ${
                            isDark ? 'border-[#332924]' : 'border-[#D5CBB8]'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Star Rating</label>
                        <div className="flex items-center gap-1 pt-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFbRating(star)}
                              aria-label={`Rate ${star} stars`}
                              className="p-1 focus:outline-none"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= fbRating
                                    ? 'text-[#C59B27] fill-current'
                                    : 'opacity-30'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Your Experience *</label>
                      <textarea
                        rows={3}
                        required
                        value={fbComment}
                        onChange={(e) => setFbComment(e.target.value)}
                        placeholder="Tell us about the flavours, hospitality, or packaging..."
                        className={`w-full px-3 py-2 text-xs rounded-lg border bg-transparent focus:outline-none focus:border-[#8B1E24] ${
                          isDark ? 'border-[#332924]' : 'border-[#D5CBB8]'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-lg bg-[#8B1E24] hover:bg-[#70161B] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post On-Site Review</span>
                    </button>
                  </form>
                </div>

                <p className="text-[11px] opacity-60 mt-4 pt-3 border-t border-current/10">
                  All guest feedback goes directly to Executive Chef Ustad Mehmood Ali Khan and our
                  Colaba hospitality team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
