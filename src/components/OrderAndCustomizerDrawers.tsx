import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  Check,
  Copy,
  Settings,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { DishItem, RestaurantConfig, DEFAULT_RESTAURANT_CONFIG } from '../data/restaurantData';

export interface CartItem {
  dish: DishItem;
  quantity: number;
}

interface WhatsAppOrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (dishId: string, delta: number) => void;
  onClearCart: () => void;
  config: RestaurantConfig;
  isDark: boolean;
}

export const WhatsAppOrderDrawer: React.FC<WhatsAppOrderDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onClearCart,
  config,
  isDark,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [orderMode, setOrderMode] = useState<'Delivery' | 'Takeaway'>('Delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const directDiscount = Math.round(subtotal * 0.1);
  const grandTotal = subtotal - directDiscount;

  const buildWhatsAppMessage = () => {
    const header = `Hello ${config.name} (${config.city})! I would like to place a direct ${orderMode} order:`;
    const itemsList =
      cart.length > 0
        ? cart
            .map(
              (c) =>
                `- ${c.quantity}x ${c.dish.name} (${c.dish.isVeg ? 'Veg' : 'Non-Veg'}) — ₹${
                  c.dish.price * c.quantity
                }`
            )
            .join('\n')
        : '- Please share today’s Chef’s Special Dastarkhwan recommendations.';

    const pricing =
      cart.length > 0
        ? `\nSubtotal: ₹${subtotal}\nDirect Order 10% Savings (${config.offerCode}): -₹${directDiscount}\nEstimated Total: ₹${grandTotal}`
        : '';

    const customerDetails = [
      customerName ? `Name: ${customerName}` : '',
      orderMode === 'Delivery' && deliveryAddress ? `Delivery Address: ${deliveryAddress}` : '',
      specialNotes ? `Kitchen Note: ${specialNotes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return [header, '', itemsList, pricing, customerDetails ? `\n${customerDetails}` : '']
      .filter(Boolean)
      .join('\n');
  };

  const whatsappHref = `https://wa.me/${config.whatsappNumber.replace(
    /[^0-9]/g,
    ''
  )}?text=${encodeURIComponent(buildWhatsAppMessage())}`;

  const handleCopyText = () => {
    navigator.clipboard?.writeText(buildWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div
        className={`relative w-full max-w-md h-full flex flex-col justify-between overflow-y-auto p-6 border-l ${
          isDark
            ? 'bg-[#161311] text-[#F5EFE6] border-[#2E2520]'
            : 'bg-[#FAF7F2] text-[#1C1613] border-[#E5DEC9]'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-current/10">
            <div>
              <h3 className="font-display text-2xl font-semibold">Direct WhatsApp Order</h3>
              <p className="text-xs opacity-70 mt-0.5">
                10% instant discount applied · Zero aggregator packaging fees
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close WhatsApp order drawer"
              className="p-2 rounded-md hover:bg-current/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="mt-5 grid grid-cols-2 gap-1 p-1 rounded-lg bg-current/5">
            {(['Delivery', 'Takeaway'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setOrderMode(mode)}
                className={`py-2 px-4 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  orderMode === mode
                    ? 'bg-[#8B1E24] text-white'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                {mode === 'Delivery' ? 'Home Delivery' : 'Self Pickup (Colaba)'}
              </button>
            ))}
          </div>

          {/* Cart Items */}
          <div className="mt-5 space-y-3">
            {cart.length === 0 ? (
              <div className="py-8 px-4 text-center border border-dashed border-current/15 rounded-lg">
                <p className="text-sm font-medium">Your direct order tray is empty</p>
                <p className="text-xs opacity-65 mt-1">
                  Add dishes from the menu below to calculate your 10% direct savings, or message our
                  kitchen directly on WhatsApp.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs opacity-70">
                  <span>Selected Dishes ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="inline-flex items-center gap-1 hover:text-[#8B1E24] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear tray</span>
                  </button>
                </div>
                <div className="divide-y divide-current/10 border-y border-current/10">
                  {cart.map(({ dish, quantity }) => (
                    <div key={dish.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{dish.name}</p>
                        <p className="text-xs opacity-65 font-mono-tabular">
                          ₹{dish.price} × {quantity} = ₹{dish.price * quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(dish.id, -1)}
                          aria-label={`Decrease quantity of ${dish.name}`}
                          className="w-7 h-7 rounded-md border border-current/20 flex items-center justify-center hover:bg-current/10"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono-tabular w-5 text-center">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(dish.id, 1)}
                          aria-label={`Increase quantity of ${dish.name}`}
                          className="w-7 h-7 rounded-md border border-current/20 flex items-center justify-center hover:bg-current/10"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bill Breakdown */}
                <div className="p-4 rounded-lg bg-current/5 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="opacity-75">Menu Subtotal</span>
                    <span className="font-mono-tabular">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Direct Order 10% Off ({config.offerCode})</span>
                    <span className="font-mono-tabular">-₹{directDiscount}</span>
                  </div>
                  <div className="pt-2 border-t border-current/10 flex justify-between text-sm font-semibold">
                    <span>Payable on WhatsApp / UPI</span>
                    <span className="font-mono-tabular">₹{grandTotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Customer fields */}
          <div className="mt-5 space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Your Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g., Kabir Oberoi"
                className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent focus:outline-none focus:border-[#8B1E24]"
              />
            </div>
            {orderMode === 'Delivery' && (
              <div>
                <label className="block text-xs font-medium mb-1">
                  Delivery Address & Landmark ({config.city})
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Flat, Building, Street, Locality"
                  className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent focus:outline-none focus:border-[#8B1E24]"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium mb-1">
                Spice Preference or Cutlery Note (Optional)
              </label>
              <input
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g., Less oil, extra mint chutney"
                className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent focus:outline-none focus:border-[#8B1E24]"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-current/10 space-y-2.5">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-lg bg-[#1F7A4C] hover:bg-[#18633D] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Order on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <button
            type="button"
            onClick={handleCopyText}
            className="w-full py-2.5 px-4 rounded-lg border border-current/20 hover:bg-current/5 text-xs font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Order Summary Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 opacity-70" />
                <span>Copy Pre-filled WhatsApp Order Text</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
  onSaveConfig: (newConfig: RestaurantConfig) => void;
  isDark: boolean;
}

export const RestaurantCustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  isDark,
}) => {
  const [draft, setDraft] = useState<RestaurantConfig>(config);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(draft);
    onClose();
  };

  const handleReset = () => {
    setDraft(DEFAULT_RESTAURANT_CONFIG);
    onSaveConfig(DEFAULT_RESTAURANT_CONFIG);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 border ${
          isDark
            ? 'bg-[#161311] text-[#F5EFE6] border-[#2E2520]'
            : 'bg-[#FAF7F2] text-[#1C1613] border-[#E5DEC9]'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-current/10">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#C59B27]" />
            <div>
              <h3 className="font-display text-2xl font-semibold">
                Customize Restaurant Profile
              </h3>
              <p className="text-xs opacity-70">
                Personalize [Restaurant Name], [Cuisine], [City], WhatsApp, FSSAI & Free Form Key
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customizer modal"
            className="p-2 rounded-md hover:bg-current/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Restaurant Name</label>
              <input
                type="text"
                required
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Cuisine Type</label>
              <input
                type="text"
                required
                value={draft.cuisine}
                onChange={(e) => setDraft({ ...draft, cuisine: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">City</label>
              <input
                type="text"
                required
                value={draft.city}
                onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Neighborhood / Area</label>
              <input
                type="text"
                value={draft.neighborhood}
                onChange={(e) => setDraft({ ...draft, neighborhood: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Established Year (Since)</label>
              <input
                type="number"
                value={draft.sinceYear}
                onChange={(e) =>
                  setDraft({ ...draft, sinceYear: Number(e.target.value) || 1998 })
                }
                className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">14-Digit FSSAI Number</label>
              <input
                type="text"
                value={draft.fssaiNumber}
                onChange={(e) => setDraft({ ...draft, fssaiNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent font-mono-tabular"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Phone Number (Call Now CTA)</label>
              <input
                type="text"
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent font-mono-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                WhatsApp Number (Digits with Country Code)
              </label>
              <input
                type="text"
                value={draft.whatsappNumber}
                onChange={(e) => setDraft({ ...draft, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent font-mono-tabular"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Full Street Address</label>
            <input
              type="text"
              value={draft.address}
              onChange={(e) => setDraft({ ...draft, address: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Swiggy Listing URL</label>
              <input
                type="url"
                value={draft.swiggyUrl}
                onChange={(e) => setDraft({ ...draft, swiggyUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Zomato Listing URL</label>
              <input
                type="url"
                value={draft.zomatoUrl}
                onChange={(e) => setDraft({ ...draft, zomatoUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Free Form Service Provider</label>
              <select
                value={draft.formServiceProvider}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    formServiceProvider: e.target.value as RestaurantConfig['formServiceProvider'],
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent"
              >
                <option value="Web3Forms" className="text-black">
                  Web3Forms (Free 250 submissions/mo)
                </option>
                <option value="Formspree" className="text-black">
                  Formspree (Free endpoint)
                </option>
                <option value="GoogleForms" className="text-black">
                  Google Forms (Free response sheet)
                </option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Web3Forms Key or Formspree Endpoint (Optional)
              </label>
              <input
                type="text"
                value={draft.formEndpointOrKey}
                onChange={(e) => setDraft({ ...draft, formEndpointOrKey: e.target.value })}
                placeholder="Leave blank for built-in instant booking + WhatsApp"
                className="w-full px-3 py-2 text-sm rounded-md border border-current/20 bg-transparent"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-current/10 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-current/20 hover:bg-current/5 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-current/20 hover:bg-current/5 whitespace-nowrap shrink-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#8B1E24] hover:bg-[#70161B] text-white whitespace-nowrap shrink-0"
              >
                Save Restaurant Details
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
