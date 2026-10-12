export type MenuCategory = 'Starters' | 'Mains' | 'Breads' | 'Rice' | 'Desserts' | 'Drinks';
export type SpiceLevel = 'Mild' | 'Medium' | 'Fiery';

export interface DishItem {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number;
  isVeg: boolean;
  spiceLevel: SpiceLevel;
  isChefSpecial?: boolean;
  isBestseller?: boolean;
  caloriesOrPortion: string;
  image: string;
  objectPosition?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  platform: 'Google' | 'Zomato' | 'Direct';
  dishTried: string;
  comment: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Signature Dishes' | 'Ambience & Craft';
  caption: string;
  image: string;
  aspectClass: string;
  objectPosition?: string;
}

export interface RestaurantConfig {
  name: string;
  cuisine: string;
  city: string;
  neighborhood: string;
  tagline: string;
  sinceYear: number;
  fssaiNumber: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
  googleReviewUrl: string;
  zomatoUrl: string;
  swiggyUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  formServiceProvider: 'Web3Forms' | 'Formspree' | 'GoogleForms';
  formEndpointOrKey: string;
  offerBannerText: string;
  offerSecondaryText: string;
  offerCode: string;
}

export const IMAGES = {
  heroFeast: '/src/assets/images/hero_royal_feast_1791784159704.jpg',
  galoutiKebab: '/src/assets/images/dish_galouti_kebab_1791784172061.jpg',
  nalliNihari: '/src/assets/images/dish_nalli_nihari_1791784187178.jpg',
  dumBiryani: '/src/assets/images/dish_dum_biryani_1791784197185.jpg',
  interiorHall: '/src/assets/images/interior_dining_hall_1791784209820.jpg',
};

export const DEFAULT_RESTAURANT_CONFIG: RestaurantConfig = {
  name: 'Zaffran & Ember',
  cuisine: 'Royal Awadhi & North Indian',
  city: 'Mumbai',
  neighborhood: 'Colaba Heritage Precinct',
  tagline: 'Slow-cooked in sealed copper handis over glowing tamarind charcoal, preserving the royal kitchens of Lucknow and Old Delhi.',
  sinceYear: 1998,
  fssaiNumber: '11521002000482',
  phone: '+91 22 2284 7910',
  whatsappNumber: '919820411998',
  email: 'dastarkhwan@zaffranandember.in',
  address: '14 Mandlik Road, Apollo Bunder, Behind Taj Mahal Palace, Colaba, Mumbai 400001',
  googleMapsEmbedUrl: 'https://www.google.com/maps?q=Apollo+Bunder+Colaba+Mumbai&output=embed',
  googleMapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Apollo+Bunder+Colaba+Mumbai+400001',
  googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJwe1EZjDG5zsRaYx0Y_ef0_0',
  zomatoUrl: 'https://www.zomato.com/mumbai',
  swiggyUrl: 'https://www.swiggy.com/city/mumbai',
  instagramHandle: '@zaffranandember',
  instagramUrl: 'https://www.instagram.com/',
  formServiceProvider: 'Web3Forms',
  formEndpointOrKey: '',
  offerBannerText: '10% off on direct WhatsApp orders',
  offerSecondaryText: 'Free Shahi Tukda dessert on table bookings of 4+ guests',
  offerCode: 'DASTARKHWAN10',
};

export const MENU_CATEGORIES: MenuCategory[] = [
  'Starters',
  'Mains',
  'Breads',
  'Rice',
  'Desserts',
  'Drinks',
];

export const MENU_ITEMS: DishItem[] = [
  // STARTERS
  {
    id: 'starter-1',
    name: 'Lucknowi Galouti Kebab',
    category: 'Starters',
    description: 'Finely minced lamb tenderized with raw papaya and 32 house-ground potli spices, seared in clarified butter on miniature saffron warqi parathas.',
    price: 640,
    isVeg: false,
    spiceLevel: 'Medium',
    isChefSpecial: true,
    isBestseller: true,
    caloriesOrPortion: '4 Pcs · 240g',
    image: IMAGES.galoutiKebab,
    objectPosition: 'center center',
  },
  {
    id: 'starter-2',
    name: 'Subz Nadru & Lotus Stem Shammi',
    category: 'Starters',
    description: 'Crisp Kashmiri lotus stem and chana dal medallions stuffed with smoked hung curd, green chilli, and fresh mint chutney.',
    price: 490,
    isVeg: true,
    spiceLevel: 'Mild',
    isChefSpecial: false,
    isBestseller: true,
    caloriesOrPortion: '4 Pcs · 220g',
    image: IMAGES.galoutiKebab,
    objectPosition: 'left center',
  },
  {
    id: 'starter-3',
    name: 'Tandoori Bharwan Guchhi',
    category: 'Starters',
    description: 'Wild Himalayan morel mushrooms filled with aged malai paneer, roasted pistachio dust, and yellow chilli marinade, char-grilled in a clay tandoor.',
    price: 780,
    isVeg: true,
    spiceLevel: 'Medium',
    isChefSpecial: true,
    isBestseller: false,
    caloriesOrPortion: '6 Pcs · 210g',
    image: IMAGES.heroFeast,
    objectPosition: 'right bottom',
  },
  {
    id: 'starter-4',
    name: 'Kakori Charcoal Seekh',
    category: 'Starters',
    description: 'Silky hand-pounded mutton skewers perfumed with kewra water, rose petals, and black cardamom, smoked live over glowing tamarind embers.',
    price: 680,
    isVeg: false,
    spiceLevel: 'Fiery',
    isChefSpecial: false,
    isBestseller: true,
    caloriesOrPortion: '4 Skewers · 260g',
    image: IMAGES.heroFeast,
    objectPosition: 'left bottom',
  },

  // MAINS
  {
    id: 'main-1',
    name: 'Shahi Nalli Nihari',
    category: 'Mains',
    description: 'Prime lamb shanks slow-braised for 8 hours in a sealed copper deg with caramelized onions, long pepper (pipli), saffron threads, and bone marrow jus.',
    price: 820,
    isVeg: false,
    spiceLevel: 'Medium',
    isChefSpecial: true,
    isBestseller: true,
    caloriesOrPortion: '500g Handi',
    image: IMAGES.nalliNihari,
    objectPosition: 'left center',
  },
  {
    id: 'main-2',
    name: '24-Hour Dal Zaffrani',
    category: 'Mains',
    description: 'Whole black urad lentils simmered overnight over dying tandoor coals, finished with churned white butter, double cream, and Pampore saffron.',
    price: 540,
    isVeg: true,
    spiceLevel: 'Mild',
    isChefSpecial: true,
    isBestseller: true,
    caloriesOrPortion: '450g Handi',
    image: IMAGES.nalliNihari,
    objectPosition: 'right center',
  },
  {
    id: 'main-3',
    name: 'Paneer Kundan Kaliya',
    category: 'Mains',
    description: 'Char-grilled cottage cheese batons simmered in a velvety golden turmeric, cashew, and charmagaz gravy finished with edible silver leaf.',
    price: 590,
    isVeg: true,
    spiceLevel: 'Mild',
    isChefSpecial: false,
    isBestseller: false,
    caloriesOrPortion: '420g Handi',
    image: IMAGES.heroFeast,
    objectPosition: 'right center',
  },
  {
    id: 'main-4',
    name: 'Rajasthani Laal Maas',
    category: 'Mains',
    description: 'Fiery heritage mutton curry cooked with whole Mathania red chillies, smoked garlic cloves, and farm-fresh dahi in a traditional earthen pot.',
    price: 790,
    isVeg: false,
    spiceLevel: 'Fiery',
    isChefSpecial: false,
    isBestseller: true,
    caloriesOrPortion: '480g Handi',
    image: IMAGES.nalliNihari,
    objectPosition: 'center center',
  },

  // BREADS
  {
    id: 'bread-1',
    name: 'Saffron Warqi Paratha',
    category: 'Breads',
    description: 'Multi-layered flaky whole-wheat bread brushed with saffron-infused desi ghee and baked on an inverted iron tawa.',
    price: 130,
    isVeg: true,
    spiceLevel: 'Mild',
    isChefSpecial: true,
    isBestseller: true,
    caloriesOrPortion: '1 Pc · 110g',
    image: IMAGES.galoutiKebab,
    objectPosition: 'center bottom',
  },
  {
    id: 'bread-2',
    name: 'Smoked Garlic & Kalonji Naan',
    category: 'Breads',
    description: 'Leavened fine flour bread hand-stretched and slapped onto scorching clay tandoor walls, topped with roasted garlic, nigella seeds, and cilantro.',
    price: 120,
    isVeg: true,
    spiceLevel: 'Mild',
    isChefSpecial: false,
    isBestseller: true,
    caloriesOrPortion: '1 Pc · 125g',
    image: IMAGES.heroFeast,
    objectPosition: 'right bottom',
  },
  {
    id: 'bread-3',
    name: 'Old Delhi Khamiri Roti',
    category: 'Breads',
    description: 'Traditional Mughlai sourdough flatbread fermented naturally for 12 hours, yielding a pillowy crumb ideal for soaking up Nalli Nihari.',
    price: 110,
    isVeg: true,
    spiceLevel: 'Mild',
    isChefSpecial: false,
    isBestseller: false,
    caloriesOrPortion: '1 Pc · 100g',
    image: IMAGES.nalliNihari,
    objectPosition: 'right top',
  },

  // RICE
  {
    id: 'rice-1',
    name: 'Purdah Gosht Dum Biryani',
    category: 'Rice',
    description: 'Aged Dehraduni basmati rice and succulent mutton layered with saffron milk, birista, and ittar, sealed under a crisp flaky pastry crust.',
    price: 760,
    isVeg: false,
    spiceLevel: 'Medium',
    isChefSpecial: true,
    isBestseller: true,
    caloriesOrPortion: '650g Earthen Handi',
    image: IMAGES.dumBiryani,
    objectPosition: 'center center',
  },
  {
    id: 'rice-2',
    name: 'Subz Guchhi & Kathal Dum Biryani',
    category: 'Rice',
    description: 'Aromatic dum-cooked basmati layered with tender raw jackfruit, morels, mint, caramelized onions, and rose water, served with burhani raita.',
    price: 620,
    isVeg: true,
    spiceLevel: 'Medium',
    isChefSpecial: true,
    isBestseller: false,
    caloriesOrPortion: '650g Earthen Handi',
    image: IMAGES.dumBiryani,
    objectPosition: 'left center',
  },
  {
    id: 'rice-3',
    name: 'Awadhi Murgh Yakhni Pulao',
    category: 'Rice',
    description: 'Long-grain rice slow-simmered in a fragrant chicken and whole-spice bone broth (fennel, star anise, mace), topped with roasted cashews.',
    price: 690,
    isVeg: false,
    spiceLevel: 'Mild',
    isChefSpecial: false,
    isBestseller: true,
    caloriesOrPortion: '600g Handi',
    image: IMAGES.heroFeast,
    objectPosition: 'center center',
  },

  // DESSERTS
  {
    id: 'dessert-1',
    name: 'Royal Shahi Tukda',
    category: 'Desserts',
    description: 'Ghee-toasted artisanal brioche steeped in cardamom-saffron syrup, crowned with slow-reduced rabri, Iranian pistachios, and Damascus rose petals.',
    price: 360,
    isVeg: true,
    spiceLevel: 'Mild',
    isChefSpecial: true,
    isBestseller: true,
    caloriesOrPortion: '220g Portion',
    image: IMAGES.dumBiryani,
    objectPosition: 'right bottom',
  },
  {
    id: 'dessert-2',
    name: 'Earthen Kasoori Phirni',
    category: 'Desserts',
    description: 'Stone-ground basmati rice pudding set in unglazed clay sakoras for an earthy aroma, infused with Kashmiri saffron and toasted almonds.',
    price: 310,
    isVeg: true,
    spiceLevel: 'Mild',
    isChefSpecial: false,
    isBestseller: true,
    caloriesOrPortion: '180g Sakora',
    image: IMAGES.nalliNihari,
    objectPosition: 'right center',
  },

  // DRINKS
  {
    id: 'drink-1',
    name: 'Pampore Zaffrani Badam Thandai',
    category: 'Drinks',
    description: 'Chilled heritage elixir blended with blanched almonds, melon seeds, black pepper, fennel, rose petals, and saffron threads.',
    price: 260,
    isVeg: true,
    spiceLevel: 'Mild',
    isChefSpecial: true,
    isBestseller: true,
    caloriesOrPortion: '300ml Kulhad',
    image: IMAGES.galoutiKebab,
    objectPosition: 'right top',
  },
  {
    id: 'drink-2',
    name: 'Smoked Bhuna Jeera Chaas',
    category: 'Drinks',
    description: 'Hand-churned artisanal buttermilk tempered with charcoal-smoked cumin, black rock salt, ginger juice, and crushed garden mint.',
    price: 190,
    isVeg: true,
    spiceLevel: 'Mild',
    isChefSpecial: false,
    isBestseller: false,
    caloriesOrPortion: '300ml Glass',
    image: IMAGES.heroFeast,
    objectPosition: 'left center',
  },
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Arundhati Deshmukh',
    role: 'Culinary Historian · South Mumbai',
    rating: 5,
    date: 'October 2026',
    platform: 'Google',
    dishTried: 'Lucknowi Galouti Kebab & Shahi Nalli Nihari',
    comment: 'Before visiting Zaffran & Ember, finding authentic Lucknowi Galouti kebabs in Mumbai without flying to Chowk was nearly impossible. Ustad Mehmood’s 32-spice grind melts effortlessly on the warqi paratha, and our family of six now books our Sunday dastarkhwan here every month.',
  },
  {
    id: 'rev-2',
    author: 'Rohan Mehta',
    role: 'Founder, Malabar Hill Ventures',
    rating: 5,
    date: 'September 2026',
    platform: 'Zomato',
    dishTried: 'Purdah Gosht Dum Biryani',
    comment: 'We ordered directly on WhatsApp for a 12-person boardroom dinner at Nariman Point. The clay handis arrived piping hot with the purdah crust intact, saving us 10% over aggregator prices and earning unanimous praise from our visiting international guests.',
  },
  {
    id: 'rev-3',
    author: 'Dr. FaridaContractor',
    role: 'Architect · Colaba',
    rating: 5,
    date: 'September 2026',
    platform: 'Google',
    dishTried: '24-Hour Dal Zaffrani & Tandoori Bharwan Guchhi',
    comment: 'As a lifelong vegetarian, I rarely see royal North Indian menus give vegetarian craft equal reverence. The stuffed Himalayan morels and 24-hour Dal Zaffrani have extraordinary depth of smoke and saffron without feeling heavy.',
  },
  {
    id: 'rev-4',
    author: 'Vikramaditya Singhania',
    role: 'Hospitality Critic · Bandra West',
    rating: 5,
    date: 'August 2026',
    platform: 'Google',
    dishTried: 'Rajasthani Laal Maas & Royal Shahi Tukda',
    comment: 'Booked an anniversary table for four using the online form and confirmed via WhatsApp in 15 seconds. The brass jaali lantern lighting, copper open kitchen, and complimentary Shahi Tukda made the evening unforgettable.',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'The Royal Dastarkhwan Spread',
    category: 'Signature Dishes',
    caption: 'Hammered brass handis filled with saffron dum biryani, seekh kebabs, and garlic naan served by candlelight.',
    image: IMAGES.heroFeast,
    aspectClass: 'md:col-span-2 aspect-[16/9]',
    objectPosition: 'center center',
  },
  {
    id: 'gal-2',
    title: 'Colaba Heritage Dining Room & Open Tandoor',
    category: 'Ambience & Craft',
    caption: 'Hand-carved sandstone arches, brass jaali lanterns, crimson velvet banquettes, and our copper-clad live kitchen.',
    image: IMAGES.interiorHall,
    aspectClass: 'md:col-span-1 aspect-[4/3]',
    objectPosition: 'center center',
  },
  {
    id: 'gal-3',
    title: 'Lucknowi Galouti on Saffron Warqi Paratha',
    category: 'Signature Dishes',
    caption: 'Our signature 32-spice melt-in-the-mouth kebab plated with emerald mint chutney and pickled pearl onions.',
    image: IMAGES.galoutiKebab,
    aspectClass: 'md:col-span-1 aspect-[4/3]',
    objectPosition: 'center center',
  },
  {
    id: 'gal-4',
    title: 'Purdah Dum Pukht Biryani',
    category: 'Signature Dishes',
    caption: 'Cracking open the golden flaky purdah crust to release aromatic steam of Dehraduni basmati and rose petals.',
    image: IMAGES.dumBiryani,
    aspectClass: 'md:col-span-1 aspect-[4/3]',
    objectPosition: 'center center',
  },
  {
    id: 'gal-5',
    title: '8-Hour Copper Deg Nalli Nihari & Dal Zaffrani',
    category: 'Signature Dishes',
    caption: 'Slow-simmered overnight over tamarind embers and served in traditional tin-lined copper vessels.',
    image: IMAGES.nalliNihari,
    aspectClass: 'md:col-span-1 aspect-[4/3]',
    objectPosition: 'center center',
  },
  {
    id: 'gal-6',
    title: 'Ustad Mehmood at the Copper Pass',
    category: 'Ambience & Craft',
    caption: 'Every dish is finished to order with saffron, hand-churned butter, and fresh micro-herbs in our open kitchen.',
    image: IMAGES.interiorHall,
    aspectClass: 'md:col-span-2 aspect-[16/9]',
    objectPosition: 'right center',
  },
];

export interface DayHours {
  day: string;
  dayIndex: number; // 0 = Sunday, 1 = Monday, ...
  lunch: string;
  dinner: string;
  openHour: number; // 12 = 12:00 PM
  closeHour: number; // 23.5 = 11:30 PM
}

export const OPENING_HOURS: DayHours[] = [
  { day: 'Monday', dayIndex: 1, lunch: '12:00 PM – 03:30 PM', dinner: '07:00 PM – 11:30 PM', openHour: 12, closeHour: 23.5 },
  { day: 'Tuesday', dayIndex: 2, lunch: '12:00 PM – 03:30 PM', dinner: '07:00 PM – 11:30 PM', openHour: 12, closeHour: 23.5 },
  { day: 'Wednesday', dayIndex: 3, lunch: '12:00 PM – 03:30 PM', dinner: '07:00 PM – 11:30 PM', openHour: 12, closeHour: 23.5 },
  { day: 'Thursday', dayIndex: 4, lunch: '12:00 PM – 03:30 PM', dinner: '07:00 PM – 11:30 PM', openHour: 12, closeHour: 23.5 },
  { day: 'Friday', dayIndex: 5, lunch: '12:00 PM – 04:00 PM', dinner: '07:00 PM – 12:00 AM', openHour: 12, closeHour: 24 },
  { day: 'Saturday', dayIndex: 6, lunch: '12:00 PM – 04:00 PM', dinner: '07:00 PM – 12:00 AM', openHour: 12, closeHour: 24 },
  { day: 'Sunday', dayIndex: 0, lunch: '12:00 PM – 04:00 PM', dinner: '07:00 PM – 11:30 PM', openHour: 12, closeHour: 23.5 },
];
