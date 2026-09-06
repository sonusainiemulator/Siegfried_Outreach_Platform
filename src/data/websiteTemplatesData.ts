export interface WebsiteDesignTemplate {
  id: string
  name: string
  industryId: string
  category: string
  description: string
  creditCost: number
  rating: number
  reviewsCount: number
  styleTheme: string
  thumbnailGradient: string
  colorPalette: string[]
  conversionBadge: string
  isNew?: boolean
  isPremium?: boolean
  features: string[]
  pagesIncluded: string[]
  previewMockup: {
    heroTitle: string
    heroSubtitle: string
    ctaText: string
    secondaryCta: string
    accentColor: string
    bgMode: 'dark' | 'light' | 'midnight'
    services: { title: string; desc: string; icon: string }[]
    testimonial: { quote: string; author: string; role: string }
    stats: { label: string; value: string }[]
  }
}

export const WEBSITE_TEMPLATES: WebsiteDesignTemplate[] = [
  // ─── RESTAURANT & FOOD (4 templates) ───
  {
    id: 'rest-1',
    name: 'Saffron & Smoke — Fine Dining Bistro',
    industryId: 'restaurant',
    category: 'Fine Dining & Bistro',
    description: 'Ultra-luxurious dark ambiance with multi-course digital tasting menu, OpenTable table reservations, and wine pairing showcase.',
    creditCost: 5,
    rating: 4.9,
    reviewsCount: 382,
    styleTheme: 'Dark Luxury & Amber Glow',
    thumbnailGradient: 'from-amber-600 to-red-900',
    colorPalette: ['#1c1917', '#f59e0b', '#dc2626', '#fef3c7'],
    conversionBadge: '🔥 4.2x Table Bookings',
    isNew: true,
    isPremium: true,
    features: ['Table Booking Engine', 'Dynamic Tasting Menu', 'Wine Pairing List', 'Chef Biography', 'Instagram Story Reel'],
    pagesIncluded: ['Home', 'Tasting Menus', 'Private Events', 'Chef Story', 'Reserve Table'],
    previewMockup: {
      heroTitle: 'Culinary Artistry Redefined with Fire & Spices',
      heroSubtitle: 'Experience wood-fired gastronomy crafted with organic heritage ingredients by Master Chef Julian Vance.',
      ctaText: 'Reserve Your Table',
      secondaryCta: 'Explore Autumn Menu',
      accentColor: '#f59e0b',
      bgMode: 'dark',
      services: [
        { title: 'Wood-Fired Signature Grill', desc: 'A5 Wagyu and dry-aged cuts grilled over mesquite coals.', icon: '🔥' },
        { title: 'Sommelier Wine Vault', desc: 'Over 400 curated biodynamic wines paired per course.', icon: '🍷' },
        { title: 'Private Dining Chambers', desc: 'Host up to 24 guests in soundproof acoustic luxury.', icon: '🥂' }
      ],
      testimonial: { quote: 'The smoothest digital booking experience our guests have ever had — reservations increased 64% in month one!', author: 'Chef Marco Rossi', role: 'Executive Chef & Owner' },
      stats: [{ label: 'Michelin Mentions', value: '3 Stars' }, { label: 'Wine Selections', value: '450+' }, { label: 'Guest Rating', value: '4.9 / 5' }]
    }
  },
  {
    id: 'rest-2',
    name: 'Artisan Crumb — Artisan Cafe & Bakehouse',
    industryId: 'restaurant',
    category: 'Cafe & Bakery',
    description: 'Warm, earthy French bakery design featuring fresh daily batch notifications, QR menu, and online pastry pre-ordering.',
    creditCost: 5,
    rating: 4.8,
    reviewsCount: 210,
    styleTheme: 'Warm Earthy & Pastel Cream',
    thumbnailGradient: 'from-amber-400 to-orange-600',
    colorPalette: ['#78350f', '#f59e0b', '#fef3c7', '#d97706'],
    conversionBadge: '⚡ 99/100 Mobile Speed',
    features: ['Live Batch Tracker', 'Bakery Pre-Order Cart', 'QR Code Dine-in Menu', 'Loyalty Stamp Card', 'Google Maps Geo-locate'],
    pagesIncluded: ['Home', 'Daily Bakes', 'Coffee Bar', 'Catering Orders', 'Locations'],
    previewMockup: {
      heroTitle: 'Slow Fermented Sourdough & Specialty Roasts',
      heroSubtitle: 'Baked before sunrise with 100% wild yeast and stoneground organic flours.',
      ctaText: 'Pre-Order Morning Box',
      secondaryCta: 'View Coffee Menu',
      accentColor: '#d97706',
      bgMode: 'light',
      services: [
        { title: 'Wild Sourdough Batards', desc: '36-hour slow fermentation with crunchy caramelized crust.', icon: '🥖' },
        { title: 'Specialty Espresso Bar', desc: 'Single-origin Ethiopian & Colombian micro-lots roasted in-house.', icon: '☕' },
        { title: 'Corporate Breakfast Catering', desc: 'Fresh viennoiserie platters delivered warm to your office.', icon: '🥐' }
      ],
      testimonial: { quote: 'Customers love the live batch countdown on the homepage. Our morning rush queues are handled seamlessly.', author: 'Sophie Laurent', role: 'Head Baker' },
      stats: [{ label: 'Daily Fresh Bakes', value: '800+' }, { label: 'Ferment Time', value: '36 Hrs' }, { label: 'Coffee Beans', value: 'Single Origin' }]
    }
  },
  {
    id: 'rest-3',
    name: 'Urban Melt — Gourmet Burger Bar & Taproom',
    industryId: 'restaurant',
    category: 'Burgers & Casual Bar',
    description: 'Punchy high-contrast neon design with interactive burger customizer, tap list updates, and 1-click delivery app integration.',
    creditCost: 5,
    rating: 4.7,
    reviewsCount: 165,
    styleTheme: 'Bold Neon & Urban Dark',
    thumbnailGradient: 'from-orange-500 to-yellow-500',
    colorPalette: ['#18181b', '#f97316', '#eab308', '#27272a'],
    conversionBadge: '🚀 Instant 1-Click Order',
    features: ['Burger Ingredient Builder', 'Live Craft Beer Taps', 'DoorDash & UberEats Sync', 'Late Night Specials Banner'],
    pagesIncluded: ['Home', 'Burger Stack', 'Craft Beer Taps', 'Happy Hour', 'Order Pickup'],
    previewMockup: {
      heroTitle: 'Smash Burgers, Crispy Fries & Craft Taps on Flow',
      heroSubtitle: 'Double Angus smashed patties, secret caramelized onion sauce, and house-made potato buns.',
      ctaText: 'Order Pickup Now',
      secondaryCta: 'See Tap List',
      accentColor: '#f97316',
      bgMode: 'dark',
      services: [
        { title: 'Signature Double Smash', desc: 'Laced with melted aged cheddar and bacon jam.', icon: '🍔' },
        { title: '16 Rotational Taps', desc: 'Hazy IPAs, barrel-aged stouts, and local ciders.', icon: '🍺' },
        { title: 'Truffle Parmesan Fries', desc: 'Hand-cut russet potatoes tossed with white truffle oil.', icon: '🍟' }
      ],
      testimonial: { quote: 'The visual burger builder is a viral hit on social media. Online orders jumped 200%.', author: 'Dave K.', role: 'Founder' },
      stats: [{ label: 'Burgers Smashed', value: '50,000+' }, { label: 'Craft Beers', value: '16 on Tap' }, { label: 'Pickup Time', value: '12 Mins' }]
    }
  },
  {
    id: 'rest-4',
    name: 'Green Bowl Sanctuary — Plant-Based & Juice Bar',
    industryId: 'restaurant',
    category: 'Healthy & Organic',
    description: 'Fresh botanical aesthetic with macro calculator, smoothie subscription builder, and farm-to-table traceability cards.',
    creditCost: 5,
    rating: 4.8,
    reviewsCount: 142,
    styleTheme: 'Botanical Green & Crisp White',
    thumbnailGradient: 'from-emerald-500 to-green-600',
    colorPalette: ['#064e3b', '#10b981', '#ecfdf5', '#047857'],
    conversionBadge: '🌱 100% Organic Certified',
    features: ['Nutritional Macro Calculator', 'Weekly Meal Subscriptions', 'Cold-Pressed Cleanses', 'Eco Packaging Tracker'],
    pagesIncluded: ['Home', 'Grain Bowls', 'Cold-Pressed Juices', 'Cleanse Plans', 'Sustainability'],
    previewMockup: {
      heroTitle: 'Superfood Grain Bowls & Cold-Pressed Elixirs',
      heroSubtitle: 'Fuel your day with nutrient-dense bowls harvested within 50 miles from regenerative farms.',
      ctaText: 'Build Your Bowl',
      secondaryCta: 'View Cleanse Plans',
      accentColor: '#10b981',
      bgMode: 'light',
      services: [
        { title: 'Superfood Power Bowls', desc: 'Quinoa, roasted avocado, hemp seeds, and miso ginger glaze.', icon: '🥗' },
        { title: 'Cold-Pressed Tonics', desc: 'Unpasteurized celery, spirulina, and ginger immune boosters.', icon: '🧃' },
        { title: 'Zero-Waste Catering', desc: 'Compostable packaging delivered for team lunches and summits.', icon: '♻️' }
      ],
      testimonial: { quote: 'Subscribers order their 5-day work lunch boxes through our automated portal. Best decision we made!', author: 'Elena Gomez', role: 'Nutritionist & Co-Founder' },
      stats: [{ label: 'Organic Farms', value: '14 Local' }, { label: 'Vitamins / Bowl', value: '100% Daily' }, { label: 'Plastic Free', value: '100%' }]
    }
  },

  // ─── E-COMMERCE & D2C (4 templates) ───
  {
    id: 'ecom-1',
    name: 'Aura Studio — Minimalist Luxury Fashion & D2C',
    industryId: 'ecommerce',
    category: 'Fashion & Apparel',
    description: 'Editorial high-fashion aesthetic with lookbook carousel, sticky bag drawer, size recommendation AI, and multi-currency checkout.',
    creditCost: 7,
    rating: 4.9,
    reviewsCount: 520,
    styleTheme: 'Editorial Monolith & High Fashion',
    thumbnailGradient: 'from-neutral-900 to-stone-800',
    colorPalette: ['#171717', '#a8a29e', '#ffffff', '#78716c'],
    conversionBadge: '💎 3.9x Average Order Value',
    isNew: true,
    isPremium: true,
    features: ['Dynamic Lookbook Sliders', 'Interactive 3D Clothing Viewer', 'One-Page Stripe & Razorpay Checkout', 'Size Fit AI Guide', 'Wishlist & Cart Drawer'],
    pagesIncluded: ['Home', 'New Arrivals', 'Lookbook Collection', 'Product Detail (PDP)', 'Checkout'],
    previewMockup: {
      heroTitle: 'Timeless Silhouettes in Heavyweight Japanese Linen',
      heroSubtitle: 'Sculptural garments designed for purposeful movement and effortless elegance. Autumn/Winter 2026.',
      ctaText: 'Explore Collection',
      secondaryCta: 'Watch Runway Film',
      accentColor: '#ffffff',
      bgMode: 'dark',
      services: [
        { title: 'Deadstock Japanese Textiles', desc: 'Crafted from rare vintage looms with lifetime durability.', icon: '🧵' },
        { title: 'Zero Plastics Guaranteed', desc: 'Packaged in biodegradable seaweed pouches with organic cotton wraps.', icon: '🌿' },
        { title: 'Complimentary Bespoke Tailoring', desc: 'Free custom hemming and sleeve adjustments on all outer coats.', icon: '✂️' }
      ],
      testimonial: { quote: 'Our bounce rate dropped by 38% after launching Aura Studio. The aesthetic feels like a Vogue editorial.', author: 'Anya Chen', role: 'Creative Director, Atelier Noir' },
      stats: [{ label: 'Global Orders', value: '45,000+' }, { label: 'Return Rate', value: '< 2.1%' }, { label: 'Customer CSAT', value: '99.4%' }]
    }
  },
  {
    id: 'ecom-2',
    name: 'Lumina Botanicals — Clean Skincare & Wellness',
    industryId: 'ecommerce',
    category: 'Beauty & Skincare',
    description: 'Gentle pastel rose aesthetic with skin quiz matcher, ingredient transparency glossary, and subscription replenishment builder.',
    creditCost: 6,
    rating: 4.8,
    reviewsCount: 440,
    styleTheme: 'Soft Pastel Rose & Clean Clinical',
    thumbnailGradient: 'from-pink-400 to-rose-500',
    colorPalette: ['#881337', '#f43f5e', '#fff1f2', '#fecdd3'],
    conversionBadge: '⭐ 52% Repeat Subscription Rate',
    features: ['Skin Diagnostic AI Quiz', 'Ingredient Purity Modal', 'Auto-Replenish 30/60 Days', 'Before/After Comparison Slider'],
    pagesIncluded: ['Home', 'Serums & Creams', 'Skin Type Quiz', 'Clinical Results', 'Subscribe & Save'],
    previewMockup: {
      heroTitle: 'Biocompatible Peptides & Cold-Pressed Squalane',
      heroSubtitle: 'Dermatologist formulated skincare tested on 1,200 skin types with zero synthetic fillers.',
      ctaText: 'Take 2-Min Skin Quiz',
      secondaryCta: 'Shop Barrier Cream',
      accentColor: '#f43f5e',
      bgMode: 'light',
      services: [
        { title: 'Clinical Barrier Repair', desc: 'Ceramide-complex restores moisture barrier in 72 hours.', icon: '💧' },
        { title: '100% Cold Processed', desc: 'Zero heat extraction preserves 98.4% of natural bioactive vitamins.', icon: '🧪' },
        { title: 'Refillable Glass Flasks', desc: 'Eco aluminium pump cartridges save 85% plastic waste.', icon: '🧴' }
      ],
      testimonial: { quote: 'The interactive skin quiz alone converts 18% of first-time visitors into paying subscribers!', author: 'Dr. Sarah Lin', role: 'Dermatological Founder' },
      stats: [{ label: 'Clinical Efficacy', value: '94.2%' }, { label: 'Skin Diagnostic Tests', value: '180,000+' }, { label: 'Eco Packaging', value: '100% Glass' }]
    }
  },
  {
    id: 'ecom-3',
    name: 'VoltGear — Consumer Electronics & Smart Gadgets',
    industryId: 'ecommerce',
    category: 'Tech & Electronics',
    description: 'High-tech dark futuristic theme featuring 360 interactive product spins, spec comparison matrix, and bundle savings builder.',
    creditCost: 7,
    rating: 4.8,
    reviewsCount: 310,
    styleTheme: 'Cyber Dark & Neon Cyan',
    thumbnailGradient: 'from-cyan-600 to-blue-800',
    colorPalette: ['#0f172a', '#06b6d4', '#3b82f6', '#1e293b'],
    conversionBadge: '⚡ 360° Interactive Product View',
    features: ['360° Product Rotation', 'Side-by-Side Spec Comparison', 'Dynamic Bundle Builder', 'Warranty Registration Portal'],
    pagesIncluded: ['Home', 'Noise-Canceling Pods', 'Smart Chargers', 'Tech Specs', 'Support & Drivers'],
    previewMockup: {
      heroTitle: 'Ultra-Low Latency Wireless Audio with Planar Drivers',
      heroSubtitle: 'Hi-Res certified dual planar magnetic acoustics with 48dB active noise cancellation.',
      ctaText: 'Pre-Order Volt Pro',
      secondaryCta: 'Compare Specs',
      accentColor: '#06b6d4',
      bgMode: 'dark',
      services: [
        { title: '50-Hour Battery Reserve', desc: 'Fast USB-C juice gives 8 hours playback from 10 minutes charging.', icon: '🔋' },
        { title: 'Quad-Core Neural ANC', desc: 'Calculates ambient acoustic anti-noise 40,000 times per second.', icon: '🎧' },
        { title: 'Spatial Head Tracking', desc: 'Cinema-grade Dolby Atmos immersion for gamers and music producers.', icon: '📡' }
      ],
      testimonial: { quote: 'VoltGear made our hardware launch look like Apple or Sony. Raised $350k in pre-orders during week 1.', author: 'Liam Wright', role: 'Hardware Product Lead' },
      stats: [{ label: 'Pre-Orders Shipped', value: '28,000+' }, { label: 'Noise Reduction', value: '-48 dB' }, { label: 'Battery Life', value: '50 Hrs' }]
    }
  },
  {
    id: 'ecom-4',
    name: 'Solace Home — Scandinavian Furniture & Living',
    industryId: 'ecommerce',
    category: 'Home & Furniture',
    description: 'Airy Nordic interior layout featuring AR room visualizer, fabric swatch order kit, and room package discounts.',
    creditCost: 6,
    rating: 4.7,
    reviewsCount: 290,
    styleTheme: 'Nordic Wood & Warm Linen',
    thumbnailGradient: 'from-amber-700 to-stone-700',
    colorPalette: ['#44403c', '#d97706', '#fafaf9', '#e7e5e4'],
    conversionBadge: '🛋️ AR Room Placement Tool',
    features: ['AR Room Preview Engine', 'Free Swatch Sample Kit', 'White Glove Delivery Booking', 'Financing Calculator (Klarna)'],
    pagesIncluded: ['Home', 'Living Room', 'Dining Tables', 'Order Swatches', 'Our Sustainable Woods'],
    previewMockup: {
      heroTitle: 'Solid Oak Dining & Modular Comfort Made in Scandinavia',
      heroSubtitle: 'Heirloom furniture constructed with FSC-certified European timber and non-toxic vegetable wax finishes.',
      ctaText: 'Shop New Arrivals',
      secondaryCta: 'Order Free Swatches',
      accentColor: '#d97706',
      bgMode: 'light',
      services: [
        { title: 'Solid White Oak Joinery', desc: 'Traditional mortise and tenon joinery built to endure for generations.', icon: '🪑' },
        { title: 'Stain-Proof Belgian Bouclé', desc: 'Hydrophobic nano-fibers repel wine, coffee, and pet accidents.', icon: '🧵' },
        { title: 'White Glove Room Setup', desc: 'Unboxed, assembled, and packaging removed by our certified team.', icon: '🚚' }
      ],
      testimonial: { quote: 'The fabric swatch ordering feature doubled our conversion rate on $3,000+ modular sofa sets.', author: 'Hanna Lindstrom', role: 'Brand Director' },
      stats: [{ label: 'FSC Certified', value: '100% Wood' }, { label: 'Warranty Period', value: '15 Years' }, { label: 'Customer Rating', value: '4.8 / 5' }]
    }
  },

  // ─── HEALTHCARE & CLINICS (4 templates) ───
  {
    id: 'health-1',
    name: 'Apex Dental Care — Multi-Specialty Dental Clinic',
    industryId: 'healthcare',
    category: 'Dental & Oral Health',
    description: 'Clean medical blue palette with instant appointment calendar, smile makeover gallery, insurance verifier, and doctor bios.',
    creditCost: 5,
    rating: 4.9,
    reviewsCount: 470,
    styleTheme: 'Clinical Precision & Soft Sky Blue',
    thumbnailGradient: 'from-cyan-500 to-blue-600',
    colorPalette: ['#0f172a', '#0284c7', '#38bdf8', '#f0f9ff'],
    conversionBadge: '🦷 #1 Rated Dental Clinic',
    isNew: true,
    features: ['Live Appointment Calendar', 'Smile Before/After Gallery', 'Instant Insurance Verification', 'Patient Portal Login', 'Emergency Hotline Bar'],
    pagesIncluded: ['Home', 'Cosmetic Dentistry', 'Invisalign & Implants', 'Our Dentists', 'Book Appointment'],
    previewMockup: {
      heroTitle: 'Modern Gentle Dentistry with Pain-Free Laser Technology',
      heroSubtitle: 'From Invisalign smile design to same-day porcelain crowns in a calming spa-like facility.',
      ctaText: 'Book Free Consultation',
      secondaryCta: 'Verify Insurance',
      accentColor: '#0284c7',
      bgMode: 'light',
      services: [
        { title: 'Same-Day CEREC Crowns', desc: 'Digital 3D oral scan and precision milled porcelain tooth in 60 minutes.', icon: '🦷' },
        { title: 'Diamond Invisalign Provider', desc: 'Invisible orthodontic aligners with AI progress tracking.', icon: '✨' },
        { title: 'Gentle Sleep Sedation', desc: 'Relax in comfort with certified dental anesthesiologists for nervous patients.', icon: '💤' }
      ],
      testimonial: { quote: 'Patient bookings surged from 40 to 120 per month. The online insurance check eliminated our front desk paperwork.', author: 'Dr. Michael Sterling, DDS', role: 'Chief Dental Officer' },
      stats: [{ label: 'Smiles Transformed', value: '12,500+' }, { label: 'Google Rating', value: '4.9 ★ (850+)' }, { label: 'Years Serving', value: '18 Years' }]
    }
  },
  {
    id: 'health-2',
    name: 'Prana Ayurveda & Holistic Wellness Sanctuary',
    industryId: 'healthcare',
    category: 'Wellness & Ayurveda',
    description: 'Calming botanical earth tones with Dosha body type quiz, retreat booking system, and Ayurvedic herb apothecary.',
    creditCost: 5,
    rating: 4.8,
    reviewsCount: 198,
    styleTheme: 'Earthy Sand & Sage Herbal',
    thumbnailGradient: 'from-emerald-700 to-teal-800',
    colorPalette: ['#1c1917', '#059669', '#d1fae5', '#f5f5f4'],
    conversionBadge: '🌿 Certified AYUSH Therapies',
    features: ['Dosha Analysis Quiz', 'Panchakarma Retreat Booking', 'Herbal Apothecary Store', 'Virtual Vaidya Consultation'],
    pagesIncluded: ['Home', 'Panchakarma Therapies', 'Dosha Quiz', 'Ayurvedic Doctors', 'Book Retreat'],
    previewMockup: {
      heroTitle: 'Ancient Ayurvedic Healing for Modern Stress & Vitality',
      heroSubtitle: 'Restorative Panchakarma programs, customized herbal medicines, and therapeutic oil therapies.',
      ctaText: 'Discover Your Dosha',
      secondaryCta: 'View Retreat Packages',
      accentColor: '#059669',
      bgMode: 'light',
      services: [
        { title: 'Classic Panchakarma Detox', desc: '7 to 21-day guided detoxification and cellular rejuvenation therapies.', icon: '🍃' },
        { title: 'Shirodhara Mind Calming', desc: 'Continuous stream of warm medicated herbal oil over the third eye.', icon: '🧘' },
        { title: 'Vaidya Pulse Diagnosis', desc: 'Root-cause Nadi Pariksha consultation with 5th generation doctors.', icon: '🩺' }
      ],
      testimonial: { quote: 'Patients rave about the Dosha quiz. It establishes immediate clinical trust before they even step into the clinic.', author: 'Dr. Ananya Sharma, BAMS', role: 'Lead Ayurvedic Physician' },
      stats: [{ label: 'Happy Patients', value: '8,200+' }, { label: 'Natural Herbs', value: '250+' }, { label: 'Doctor Experience', value: '25+ Yrs' }]
    }
  },
  {
    id: 'health-3',
    name: 'PulseCare — Pediatric & Family Medicine Clinic',
    industryId: 'healthcare',
    category: 'Pediatrics & Family',
    description: 'Friendly, warm pastel theme designed to comfort parents, with same-day sick child booking, vaccine schedule tracker, and telehealth.',
    creditCost: 5,
    rating: 4.9,
    reviewsCount: 340,
    styleTheme: 'Friendly Pastel Coral & Teal',
    thumbnailGradient: 'from-teal-500 to-indigo-500',
    colorPalette: ['#1e1b4b', '#0d9488', '#f43f5e', '#f0fdfa'],
    conversionBadge: '👶 Same-Day Sick Appointments',
    features: ['Same-Day Urgent Booking', 'Child Vaccine Milestones', 'Telehealth Video Visits', 'Pediatrician Q&A Chatbot'],
    pagesIncluded: ['Home', 'Pediatric Services', 'Vaccination Plans', 'Our Pediatricians', 'Patient Portal'],
    previewMockup: {
      heroTitle: 'Compassionate Pediatric Care from Newborns to Teens',
      heroSubtitle: 'Where children feel safe and parents find trusted medical answers 7 days a week.',
      ctaText: 'Book Sick Child Visit',
      secondaryCta: 'Telehealth Consultation',
      accentColor: '#0d9488',
      bgMode: 'light',
      services: [
        { title: 'Same-Day Sick Visits', desc: 'Dedicated morning slots reserved for ear aches, fevers, and coughs.', icon: '🧸' },
        { title: 'Developmental Milestones', desc: 'Comprehensive growth, cognitive, and sensory screenings.', icon: '📊' },
        { title: '24/7 On-Call Nurse Triage', desc: 'Speak to a registered pediatric nurse anytime of night or weekend.', icon: '📞' }
      ],
      testimonial: { quote: 'The emergency appointment scheduler gives frantic parents relief in 30 seconds. Truly invaluable.', author: 'Dr. Rebecca Miller, MD', role: 'Head Pediatrician' },
      stats: [{ label: 'Families Cared For', value: '6,400+' }, { label: 'Wait Time Avg', value: '< 8 Mins' }, { label: 'Days Open', value: '7 Days / Wk' }]
    }
  },
  {
    id: 'health-4',
    name: 'Precision Diagnostics & Pathology Laboratory',
    industryId: 'healthcare',
    category: 'Diagnostics & Pathology',
    description: 'Clean clinical corporate interface with home sample collection booking, 6-hour test report download, and health checkup packages.',
    creditCost: 5,
    rating: 4.8,
    reviewsCount: 275,
    styleTheme: 'Clinical Navy & Electric Emerald',
    thumbnailGradient: 'from-slate-800 to-emerald-900',
    colorPalette: ['#0f172a', '#10b981', '#38bdf8', '#f8fafc'],
    conversionBadge: '🔬 6-Hour Digital Report Delivery',
    features: ['Home Phlebotomy Booking', 'Download Reports with OTP', 'Comprehensive Health Packages', 'NABL Accredited Badging'],
    pagesIncluded: ['Home', 'Full Body Checkups', 'Blood Tests Directory', 'Book Home Sample', 'Download Reports'],
    previewMockup: {
      heroTitle: 'NABL-Accredited Diagnostic Accuracy at Your Doorstep',
      heroSubtitle: 'Over 1,500 blood tests and genetic panels analyzed by automated robotic analyzers with 99.98% accuracy.',
      ctaText: 'Book Home Sample Collection',
      secondaryCta: 'Download Reports',
      accentColor: '#10b981',
      bgMode: 'dark',
      services: [
        { title: 'Home Sample Phlebotomy', desc: 'Painless venous collection by vaccinated certified technicians.', icon: '💉' },
        { title: 'Full Body Health Packages', desc: '82-parameter vital profile with free doctor tele-consultation.', icon: '📋' },
        { title: 'Encrypted Report Portal', desc: 'SMS alert with 1-click WhatsApp and PDF download in 6 hours.', icon: '📱' }
      ],
      testimonial: { quote: 'Home sample collection orders grew 4x thanks to the frictionless geo-address picker on the new site.', author: 'Rajesh Varma', role: 'Operations Director' },
      stats: [{ label: 'Tests Conducted', value: '450,000+' }, { label: 'Report Turnaround', value: '6 Hours' }, { label: 'Accuracy Score', value: '99.98%' }]
    }
  },

  // ─── REAL ESTATE & ARCHITECTURE (4 templates) ───
  {
    id: 'real-1',
    name: 'Elysian Penthouse & Luxury Residences',
    industryId: 'real_estate',
    category: 'Luxury Properties',
    description: 'Breathtaking full-bleed cinematic property layout with 4K video tours, floorplan 3D toggle, mortgage calculator, and VIP broker calendar.',
    creditCost: 7,
    rating: 4.9,
    reviewsCount: 380,
    styleTheme: 'Dark Monolith & Champagne Gold',
    thumbnailGradient: 'from-zinc-900 via-amber-950 to-neutral-900',
    colorPalette: ['#18181b', '#d97706', '#fbbf24', '#27272a'],
    conversionBadge: '🏰 $120M+ Properties Sold',
    isNew: true,
    isPremium: true,
    features: ['4K Virtual Tour Player', 'Interactive 3D Floorplan Switcher', 'Direct VIP Broker Chat', 'Mortgage & ROI Calculator', 'High-Res Downloadable Brochure'],
    pagesIncluded: ['Home', 'Featured Penthouses', 'Floorplans & Specs', 'Neighborhood Guide', 'Schedule Private Viewing'],
    previewMockup: {
      heroTitle: 'Skyline Architecture & Ultra-Prime Penthouse Sanctuaries',
      heroSubtitle: 'Floor-to-ceiling panoramic glass, private infinity rooftop pools, and private elevator vestibules.',
      ctaText: 'Schedule Private Viewing',
      secondaryCta: 'Download 4K Brochure',
      accentColor: '#fbbf24',
      bgMode: 'dark',
      services: [
        { title: 'Architectural Masterpieces', desc: 'Designs by Pritzker-winning architects with Italian marble finishings.', icon: '🏛️' },
        { title: 'Private Helicopter Concierge', desc: 'Rooftop helipads and 24/7 dedicated estate management staff.', icon: '🚁' },
        { title: 'Automated Smart Living', desc: 'Integrated Crestron systems for climate, security, and ambient lighting.', icon: '📱' }
      ],
      testimonial: { quote: 'Our ultra-high-net-worth buyers were thoroughly impressed by the 3D floorplan engine. Sold 3 units directly through inquiries.', author: 'Victoria Sterling', role: 'Principal Broker, Elysian Estates' },
      stats: [{ label: 'Portfolio Value', value: '$140M+' }, { label: 'Private Viewings', value: '1,200+' }, { label: 'Average Days on Mkt', value: '28 Days' }]
    }
  },
  {
    id: 'real-2',
    name: 'UrbanNest Realty — Modern City Apartments & Condos',
    industryId: 'real_estate',
    category: 'Apartments & Condos',
    description: 'Clean modern grid layout with instant MLS search, interactive neighborhood map, school ratings, and virtual walkthroughs.',
    creditCost: 6,
    rating: 4.8,
    reviewsCount: 220,
    styleTheme: 'Clean Emerald & Slate Minimalist',
    thumbnailGradient: 'from-emerald-600 to-teal-800',
    colorPalette: ['#0f172a', '#059669', '#10b981', '#f8fafc'],
    conversionBadge: '📍 Interactive Neighborhood Map',
    features: ['MLS Property Search Filter', 'WalkScore & School Ratings', 'Instant Showing Booking', 'Open House Calendar Alert'],
    pagesIncluded: ['Home', 'Active Listings', 'Neighborhoods', 'Home Valuation Tool', 'Contact Agent'],
    previewMockup: {
      heroTitle: 'Find Your Next Contemporary Apartment in Downtown',
      heroSubtitle: 'Explore over 300 vetted lofts, condos, and townhomes with verified pricing and verified landlords.',
      ctaText: 'Search 300+ Listings',
      secondaryCta: 'Calculate Free Home Value',
      accentColor: '#10b981',
      bgMode: 'light',
      services: [
        { title: 'Curated Urban Condos', desc: 'Walk-to-work lofts with rooftop gym, co-working, and dog parks.', icon: '🏢' },
        { title: 'Neighborhood Intelligence', desc: 'Check transit scores, nearby cafes, top public schools, and safety metrics.', icon: '🗺️' },
        { title: 'Zero Buyer Broker Fees', desc: 'Transparent closing guarantees with cash-back at escrow.', icon: '💰' }
      ],
      testimonial: { quote: 'Lead quality skyrocketed. Buyers arrive at showings having already inspected the 3D walkthrough and transit ratings.', author: 'Marcus Vance', role: 'Managing Partner' },
      stats: [{ label: 'Active Listings', value: '340+' }, { label: 'Average Closing', value: '14 Days' }, { label: 'Agent Rating', value: '4.9 / 5' }]
    }
  },
  {
    id: 'real-3',
    name: 'Atelier Forma — Architectural & Interior Design Studio',
    industryId: 'real_estate',
    category: 'Architecture & Interiors',
    description: 'Minimalist editorial aesthetic highlighting high-resolution architectural photography, blueprints, materials moodboards, and consultation booking.',
    creditCost: 6,
    rating: 4.8,
    reviewsCount: 165,
    styleTheme: 'Warm Concrete & Minimalist Monolith',
    thumbnailGradient: 'from-stone-800 to-stone-600',
    colorPalette: ['#292524', '#a8a29e', '#fafaf9', '#57534e'],
    conversionBadge: '📐 AIA Award-Winning Studio',
    features: ['Full-Screen Case Study Sliders', 'Material Swatch Moodboard', 'Interactive Blueprint Viewer', 'Initial Project Brief Form'],
    pagesIncluded: ['Home', 'Residential Projects', 'Commercial Architecture', 'Design Philosophy', 'Start a Project'],
    previewMockup: {
      heroTitle: 'Sensory Architecture Harmonizing Light, Wood & Concrete',
      heroSubtitle: 'Bespoke residential sanctuaries and contextual commercial spaces crafted with sustainable passive design principles.',
      ctaText: 'Commission a Design',
      secondaryCta: 'Explore Recent Builds',
      accentColor: '#a8a29e',
      bgMode: 'light',
      services: [
        { title: 'Passive Solar Architecture', desc: 'Zero-net energy dwellings utilizing natural airflow and thermal mass.', icon: '☀️' },
        { title: 'Bespoke Interior Millwork', desc: 'Custom walnut cabinetry, travertine bathrooms, and integrated acoustic panels.', icon: '🪵' },
        { title: 'Planning & Permits Advisory', desc: 'Complete municipal regulatory approvals handled from concept to occupancy.', icon: '📐' }
      ],
      testimonial: { quote: 'Atelier Forma’s digital portfolio looks like a high-end coffee table book. Our clients mention it at every initial meeting.', author: 'Clara Berg', role: 'Principal Architect' },
      stats: [{ label: 'Completed Projects', value: '48 Works' }, { label: 'Design Awards', value: '11 Won' }, { label: 'Net Zero Homes', value: '24' }]
    }
  },
  {
    id: 'real-4',
    name: 'Haven Co-Living & Student Communities',
    industryId: 'real_estate',
    category: 'Co-Living & Community',
    description: 'Vibrant, welcoming community layout with room tour videos, flexible monthly lease selector, roommate matching, and resident event board.',
    creditCost: 5,
    rating: 4.7,
    reviewsCount: 185,
    styleTheme: 'Warm Yellow & Modern Terracotta',
    thumbnailGradient: 'from-amber-500 to-rose-500',
    colorPalette: ['#1c1917', '#f59e0b', '#f43f5e', '#fffbeb'],
    conversionBadge: '⚡ 100% Fully Furnished All-Inclusive',
    features: ['30-Day Flexible Lease Toggle', 'Roommate Compatibility Matcher', 'Virtual Community Walkthrough', '1-Click Deposit Payment'],
    pagesIncluded: ['Home', 'Available Suites', 'What is Included', 'Events Calendar', 'Apply in 5 Mins'],
    previewMockup: {
      heroTitle: 'Designer Co-Living Suites with High-Speed WiFi & Weekly Cleaning',
      heroSubtitle: 'Move in with just a suitcase. Fully furnished private bedrooms with chef kitchens and vibrant community lounges.',
      ctaText: 'Apply in 5 Minutes',
      secondaryCta: 'Schedule Video Tour',
      accentColor: '#f59e0b',
      bgMode: 'light',
      services: [
        { title: 'All Bills Included In One Check', desc: 'Ultra-fast gigabit fiber, electricity, gas, water, and Netflix all covered.', icon: '💡' },
        { title: 'Weekly Professional Housekeeping', desc: 'Communal areas and kitchens scrubbed spotless every Tuesday and Friday.', icon: '✨' },
        { title: 'Weekly Community Dinners', desc: 'Chef-catered suppers, yoga mornings, and networking evenings with founders.', icon: '🍕' }
      ],
      testimonial: { quote: 'Occupancy rate has remained at 98% year-round since switching to this automated room reservation template.', author: 'Jordan Lee', role: 'Community Lead' },
      stats: [{ label: 'Resident Community', value: '1,400+' }, { label: 'Occupancy Rate', value: '98.5%' }, { label: 'Lease Terms', value: 'Flexible 1-12 Mo' }]
    }
  },

  // ─── EDTECH & COACHING (4 templates) ───
  {
    id: 'ed-1',
    name: 'CodeCraft Academy — Full-Stack Tech Bootcamp',
    industryId: 'education',
    category: 'Coding & Tech',
    description: 'High-energy dark terminal theme featuring interactive syllabus explorer, live student salary outcomes, alumni career roadmap, and 1-click application.',
    creditCost: 6,
    rating: 4.9,
    reviewsCount: 420,
    styleTheme: 'Terminal Dark & Cyber Violet',
    thumbnailGradient: 'from-violet-700 via-indigo-800 to-slate-900',
    colorPalette: ['#09090b', '#8b5cf6', '#06b6d4', '#18181b'],
    conversionBadge: '💼 94% Hired Within 180 Days',
    isNew: true,
    isPremium: true,
    features: ['Interactive Syllabus Timeline', 'Hiring Partners Logo Marquee', 'Tuition & ISA Calculator', 'Live Coding Demo Sandbox', 'Alumni Portfolio Showcase'],
    pagesIncluded: ['Home', 'Full-Stack Curriculum', 'Tuition & ISA', 'Alumni Outcomes', 'Apply for Cohort'],
    previewMockup: {
      heroTitle: 'Become a Senior Software Engineer in 24 Weeks',
      heroSubtitle: 'Master Next.js 16, TypeScript, AI Agent pipelines, and Distributed Cloud Architecture with 1-on-1 FAANG mentors.',
      ctaText: 'Apply for Next Cohort',
      secondaryCta: 'Download Syllabus PDF',
      accentColor: '#8b5cf6',
      bgMode: 'dark',
      services: [
        { title: 'Real Production Codebases', desc: 'Build 4 enterprise web applications shipped to Kubernetes clusters.', icon: '💻' },
        { title: 'Daily 1-on-1 Mentor Code Reviews', desc: 'Feedback from senior engineers working at Google, Meta, and Stripe.', icon: '👨‍🏫' },
        { title: 'Unlimited Career Coaching', desc: 'Resume tuning, mock algorithms whiteboard prep, and salary negotiation.', icon: '🎯' }
      ],
      testimonial: { quote: 'Our student application volume tripled. The syllabus preview and transparent salary report won instant credibility.', author: 'Alex Rivera', role: 'Bootcamp Director' },
      stats: [{ label: 'Median Grad Salary', value: '$118,000' }, { label: 'Alumni Network', value: '2,800+' }, { label: 'Hiring Partners', value: '180+ Companies' }]
    }
  },
  {
    id: 'ed-2',
    name: 'Zenith Global — Competitive Exam Prep & Tutoring',
    industryId: 'education',
    category: 'K-12 & Exam Prep',
    description: 'Inspiring collegiate blue aesthetic with mock test score simulator, faculty rank holder badges, scholarship test registration, and live webinar schedule.',
    creditCost: 5,
    rating: 4.8,
    reviewsCount: 310,
    styleTheme: 'Collegiate Navy & Honor Gold',
    thumbnailGradient: 'from-blue-700 to-indigo-900',
    colorPalette: ['#0f172a', '#1d4ed8', '#f59e0b', '#f8fafc'],
    conversionBadge: '🏆 48 AIR Top-100 Rankers',
    features: ['Free Diagnostic Mock Test', 'National Rank Predictor', 'Live Doubt-Clearing Chat', 'Parent Dashboard Preview'],
    pagesIncluded: ['Home', 'Courses & Batches', 'Hall of Fame', 'Scholarship Test', 'Book Counseling'],
    previewMockup: {
      heroTitle: 'Master JEE, NEET & SAT with Proven Top-Rank Faculty',
      heroSubtitle: 'Personalized adaptive test engines, daily practice problem sets, and masterclasses by former Olympiad rankers.',
      ctaText: 'Take Free Scholarship Test',
      secondaryCta: 'Book 1-on-1 Counseling',
      accentColor: '#1d4ed8',
      bgMode: 'light',
      services: [
        { title: 'Adaptive AI Mock Tests', desc: 'Pinpoint weak topics across physics, chemistry, and calculus in real-time.', icon: '📝' },
        { title: 'Doubt Clearing in 15 Minutes', desc: 'Upload question photo, get step-by-step video solution from mentors.', icon: '💡' },
        { title: 'Parent Performance Telemetry', desc: 'Weekly WhatsApp attendance and test analytics sent to guardians.', icon: '📊' }
      ],
      testimonial: { quote: 'Enrollment for our weekend crash courses increased by 85%. Parents appreciate the live rank predictor.', author: 'Prof. K. Sharma', role: 'Academic Dean' },
      stats: [{ label: 'Selections in 2026', value: '1,420+' }, { label: 'Top 100 Ranks', value: '48 Students' }, { label: 'Scholarships Awarded', value: '$1.2M' }]
    }
  },
  {
    id: 'ed-3',
    name: 'Little Explorers — STEM & Robotics Early Learning',
    industryId: 'education',
    category: 'Kids & Early Learning',
    description: 'Joyful, bright playful design with gamified quest preview, interactive class calendar, safety protocol tours, and easy trial booking.',
    creditCost: 5,
    rating: 4.9,
    reviewsCount: 230,
    styleTheme: 'Playful Sunshine Yellow & Cyan',
    thumbnailGradient: 'from-yellow-400 to-amber-500',
    colorPalette: ['#1e1b4b', '#eab308', '#06b6d4', '#fefce8'],
    conversionBadge: '🤖 Free Saturday Trial Workshop',
    features: ['Gamified Project Demos', 'Class Schedule Filter by Age', 'Live Classroom Webcams Login', 'Parent Safety Guarantee'],
    pagesIncluded: ['Home', 'Robotics & Coding', 'Science Lab', 'Safety & Staff', 'Book Free Trial'],
    previewMockup: {
      heroTitle: 'Spark Lifelong Curiosity with LEGO Robotics & AI for Kids',
      heroSubtitle: 'Hands-on experiential learning for ages 5–14. Build mechanical rovers, game animations, and rocket experiments.',
      ctaText: 'Book Free Trial Class',
      secondaryCta: 'Explore Age 5-14 Tracks',
      accentColor: '#eab308',
      bgMode: 'light',
      services: [
        { title: 'Lego Mindstorms Robotics', desc: 'Assemble autonomous sensors, motors, and competitive obstacle racers.', icon: '🤖' },
        { title: 'Visual Game Coding (Scratch)', desc: 'Design playable arcade games and export them to share with friends.', icon: '🎮' },
        { title: 'Mad Science Chemistry Lab', desc: 'Safe bubbling reactions, magnetic levitation, and crystal gardens.', icon: '🔬' }
      ],
      testimonial: { quote: 'Our Saturday trial class bookings filled up 3 weeks in advance after we launched this vibrant, friendly website.', author: 'Emily Watson', role: 'Founder & Early Educator' },
      stats: [{ label: 'Young Inventors', value: '4,500+' }, { label: 'Projects Built', value: '18,000+' }, { label: 'Parent Recommendation', value: '99.1%' }]
    }
  },
  {
    id: 'ed-4',
    name: 'LinguaFluency — AI-Powered Language Immersion',
    industryId: 'education',
    category: 'Languages & Business',
    description: 'Modern European minimalist layout with pronunciation audio player, native coach matching, CEFR level testing, and corporate package booking.',
    creditCost: 5,
    rating: 4.8,
    reviewsCount: 195,
    styleTheme: 'Modern Indigo & Coral Accent',
    thumbnailGradient: 'from-indigo-600 to-purple-800',
    colorPalette: ['#0f172a', '#6366f1', '#f43f5e', '#f8fafc'],
    conversionBadge: '🗣️ Speak Fluently in 90 Days',
    features: ['Audio Accent Playback Tool', 'Free CEFR Language Level Test', 'Native Speaker Video Intros', 'Corporate Team Discount Engine'],
    pagesIncluded: ['Home', 'Spanish, German, French', 'CEFR Test', 'Pricing Plans', 'Enterprise Training'],
    previewMockup: {
      heroTitle: 'Speak Like a Native with Real-Time Conversational AI Coaching',
      heroSubtitle: 'Break through the hesitation barrier. Combine live native-speaker tutoring with 24/7 AI speech fluency practice.',
      ctaText: 'Test Your CEFR Level (Free)',
      secondaryCta: 'Meet Our Tutors',
      accentColor: '#6366f1',
      bgMode: 'light',
      services: [
        { title: 'Native Accent AI Feedback', desc: 'Instant phonetic analysis of pitch, vowel duration, and intonation.', icon: '🎙️' },
        { title: 'Real-Life Roleplay Scenarios', desc: 'Practice job interviews, airport customs, business pitches, and casual dining.', icon: '☕' },
        { title: 'Accredited CEFR Diplomas', desc: 'Official certification recognized by international universities and employers.', icon: '📜' }
      ],
      testimonial: { quote: 'Students spend an average of 8 minutes on the site taking the free CEFR audio test before purchasing a course bundle.', author: 'Carlos Mendez', role: 'Head of Pedagogy' },
      stats: [{ label: 'Languages Offered', value: '14 Tongues' }, { label: 'Fluency Rate', value: '91.4%' }, { label: 'Speaking Practice / Mo', value: '1.2M Mins' }]
    }
  },

  // ─── DIGITAL AGENCY & CREATIVE (4 templates) ───
  {
    id: 'agency-1',
    name: 'Nexus Void — Cyberpunk / Neo-Brutalist Creative Agency',
    industryId: 'agency',
    category: 'Creative & Digital Agency',
    description: 'High-voltage neo-brutalist dark mode with kinetic typography, case study breakdown with video reel, award showcase, and interactive client budget slider.',
    creditCost: 7,
    rating: 4.9,
    reviewsCount: 460,
    styleTheme: 'Neo-Brutalist Cyber Dark & Acid Lime',
    thumbnailGradient: 'from-neutral-950 via-lime-950 to-neutral-900',
    colorPalette: ['#0a0a0a', '#a3e635', '#22c55e', '#171717'],
    conversionBadge: '🏆 8x Awwwards Site of the Day',
    isNew: true,
    isPremium: true,
    features: ['Kinetic Mouse Follower', 'Dynamic Project Case Studies', 'Interactive Budget Estimator', 'Awwwards / FWA Trophy Grid', 'Direct Calendly Sync'],
    pagesIncluded: ['Home', 'Selected Works', 'Agency Ethos', 'Pricing & Scopes', 'Let’s Talk'],
    previewMockup: {
      heroTitle: 'We Engineer Viral Brand Systems & Unapologetic Digital Experiences',
      heroSubtitle: 'Turning ambitious startups and Fortune 500s into category-defining digital titans through 3D web and design-first engineering.',
      ctaText: 'Start a Project ($15k+)',
      secondaryCta: 'Watch 2026 Showreel',
      accentColor: '#a3e635',
      bgMode: 'dark',
      services: [
        { title: '3D Web & WebGL Immersion', desc: 'Fluid, 60fps GPU-accelerated interactive web experiences that wow audiences.', icon: '⚡' },
        { title: 'Brand Identity Systems', desc: 'Comprehensive typographic design systems, logo suites, and 3D design tokens.', icon: '🎨' },
        { title: 'High-Conversion Web Apps', desc: 'Full-stack Next.js and Tailwind interfaces built for explosive scale.', icon: '🚀' }
      ],
      testimonial: { quote: 'Nexus Void redefined what a creative agency web presence should look like. Inbound client inquiries grew by 450%.', author: 'Soren Frost', role: 'Managing Partner' },
      stats: [{ label: 'Awwwards Won', value: '8 SOTD' }, { label: 'Client Revenue Generated', value: '$450M+' }, { label: 'Average Client LTV', value: '3.4 Yrs' }]
    }
  },
  {
    id: 'agency-2',
    name: 'Kanso Studio — Minimalist Brand Strategy & Identity',
    industryId: 'agency',
    category: 'Branding & Strategy',
    description: 'Japanese-inspired minimalist luxury aesthetic with generous whitespace, case study storytelling, client logos ticker, and private pitch deck request.',
    creditCost: 6,
    rating: 4.8,
    reviewsCount: 280,
    styleTheme: 'Warm Beige & Clean Charcoal',
    thumbnailGradient: 'from-stone-900 via-stone-800 to-neutral-900',
    colorPalette: ['#1c1917', '#e7e5e4', '#fafaf9', '#78716c'],
    conversionBadge: '✨ Designed for 6-Figure Retainers',
    features: ['Storytelling Case Study Layout', 'Client ROI Metric Callouts', 'Private Deck Password Gate', 'Consultation Scheduling'],
    pagesIncluded: ['Home', 'Case Studies', 'Brand Strategy', 'About Kanso', 'Inquire'],
    previewMockup: {
      heroTitle: 'Clarity, Restraint & Timeless Identity for Modern Leaders',
      heroSubtitle: 'We strip away noise to reveal the unmistakable soul of your enterprise. Brand positioning for businesses seeking enduring legacy.',
      ctaText: 'Request Credentials Deck',
      secondaryCta: 'Read Case Studies',
      accentColor: '#e7e5e4',
      bgMode: 'dark',
      services: [
        { title: 'Brand Strategy & Narrative', desc: 'Uncover core positioning, competitive moats, and verbal messaging frameworks.', icon: '🖋️' },
        { title: 'Visual Identity & Typography', desc: 'Custom bespoke logotypes, typographic scales, and physical collateral print design.', icon: '📐' },
        { title: 'Digital Brand Guidelines', desc: 'Cloud design tokens accessible to internal engineering and marketing teams.', icon: '📖' }
      ],
      testimonial: { quote: 'The restraint and craftsmanship of this template communicates premium authority effortlessly. Worth every penny.', author: 'Hiroshi Tanaka', role: 'Creative Director' },
      stats: [{ label: 'Enterprise Clients', value: '65 Brands' }, { label: 'Avg Retainer', value: '$25,000/mo' }, { label: 'Net Promoter', value: '98 NPS' }]
    }
  },
  {
    id: 'agency-3',
    name: 'GrowthEngine — Performance Marketing & Growth Lab',
    industryId: 'agency',
    category: 'Marketing & Performance',
    description: 'Data-driven high-velocity dashboard theme with live ROAS metric ticker, ad creative gallery, audit request form, and customer acquisition calculator.',
    creditCost: 6,
    rating: 4.8,
    reviewsCount: 340,
    styleTheme: 'Vibrant Electric Blue & Growth Purple',
    thumbnailGradient: 'from-blue-600 to-indigo-700',
    colorPalette: ['#0f172a', '#2563eb', '#8b5cf6', '#f8fafc'],
    conversionBadge: '📈 4.8x Average Client ROAS',
    features: ['Interactive ROAS Calculator', 'Ad Creative A/B Gallery', 'Free Growth Audit Funnel', 'Real-Time Spend Tracker Counter'],
    pagesIncluded: ['Home', 'Paid Ads & Meta/Google', 'SEO & Organic Growth', 'Client Case Studies', 'Claim Free Audit'],
    previewMockup: {
      heroTitle: 'Scale from $50k to $1M Monthly Ad Spend Profitably',
      heroSubtitle: 'The performance growth agency trusted by top D2C brands. Creative that converts, attribution that tells the truth.',
      ctaText: 'Claim Free $2,500 Audit',
      secondaryCta: 'Explore 4.8x ROAS Case Studies',
      accentColor: '#2563eb',
      bgMode: 'light',
      services: [
        { title: 'Performance Creative Studio', desc: 'UGC videos, direct-response hooks, and static ad variations produced weekly.', icon: '🎬' },
        { title: 'Algorithmic Media Buying', desc: 'Meta, Google, TikTok, and YouTube ad campaigns optimized for first-order margin.', icon: '🎯' },
        { title: 'First-Party Attribution (Triple Whale)', desc: 'Eliminate iOS tracking blindspots with server-side Conversion API tracking.', icon: '📊' }
      ],
      testimonial: { quote: 'The free audit landing page generates 30+ qualified high-ticket leads every single week on autopilot.', author: 'Brett Miller', role: 'Managing Director' },
      stats: [{ label: 'Ad Spend Managed', value: '$85M+' }, { label: 'Average ROAS', value: '4.8x' }, { label: 'D2C Clients Scaled', value: '110+' }]
    }
  },
  {
    id: 'agency-4',
    name: 'Prism 3D & Motion — Spatial & Video Production Studio',
    industryId: 'agency',
    category: 'Motion & 3D',
    description: 'Dark cinematic theme with autoplay looping 4K reels, 3D model embedder, breakdown sliders, and production rate cards.',
    creditCost: 7,
    rating: 4.9,
    reviewsCount: 215,
    styleTheme: 'Cinematic Slate & Neon Fuchsia',
    thumbnailGradient: 'from-purple-900 via-fuchsia-950 to-neutral-900',
    colorPalette: ['#0a0a0a', '#d946ef', '#8b5cf6', '#262626'],
    conversionBadge: '🎬 4K HDR Showreel Ready',
    features: ['Looping Background Video Reels', '3D Model Interactive Viewer', 'Before/After VFX Wipe Slider', 'Instant Quote Estimator'],
    pagesIncluded: ['Home', 'Showreel 2026', 'Commercials & 3D Ads', 'VFX & Motion Design', 'Book Production'],
    previewMockup: {
      heroTitle: 'Hyper-Realistic 3D Product Visuals & Spatial Motion Design',
      heroSubtitle: 'We craft CGI commercials, 3D web assets, and motion brand identities that mesmerize audiences worldwide.',
      ctaText: 'Commission a 3D Reel',
      secondaryCta: 'Watch Full Showreel',
      accentColor: '#d946ef',
      bgMode: 'dark',
      services: [
        { title: 'Photorealistic CGI Renders', desc: 'Flawless lighting, liquid physics, and textures for unreleased hardware products.', icon: '💎' },
        { title: '3D Web Interactive Assets', desc: 'Optimized glTF and USDZ models ready for WebGL websites and Apple Vision Pro.', icon: '👓' },
        { title: 'Broadcast Motion Design', desc: 'Main titles, cinematic idents, and dynamic promotional teaser sequences.', icon: '🎥' }
      ],
      testimonial: { quote: 'Clients are hooked the second they land on the page. The full-screen showreel does 90% of the selling for us.', author: 'Leo Fontaine', role: 'VFX Director' },
      stats: [{ label: 'Video Views Generated', value: '120M+' }, { label: 'CGI Commercials', value: '350+' }, { label: 'Turnaround Avg', value: '10 Days' }]
    }
  },

  // ─── B2B SAAS & TECH (4 templates) ───
  {
    id: 'saas-1',
    name: 'CognitiveOS — AI Copilot & Automation Platform',
    industryId: 'b2b_saas',
    category: 'Artificial Intelligence & SaaS',
    description: 'Cutting-edge modern dark SaaS layout with glowing interactive workflow builder, code preview tabs, live ROI calculator, and Stripe pricing toggle.',
    creditCost: 7,
    rating: 4.9,
    reviewsCount: 580,
    styleTheme: 'Modern Dark Glass & Purple Glow',
    thumbnailGradient: 'from-purple-600 via-indigo-700 to-blue-900',
    colorPalette: ['#030712', '#a855f7', '#6366f1', '#1f2937'],
    conversionBadge: '🚀 14-Day Free Trial (No Card)',
    isNew: true,
    isPremium: true,
    features: ['Interactive Workflow Builder Demo', 'Code Sandbox Syntax Switcher', 'Annual / Monthly Pricing Toggle', 'SOC-2 Type II Trust Badges', 'Changelog Timeline Integration'],
    pagesIncluded: ['Home', 'Features & Agent Engine', 'Integrations (50+)', 'Pricing & Tiers', 'Documentation'],
    previewMockup: {
      heroTitle: 'Deploy Autonomous AI Employees That Execute Like Senior Engineers',
      heroSubtitle: 'Automate customer support, multi-step marketing campaigns, and database migrations with self-healing cognitive agent loops.',
      ctaText: 'Start Free 14-Day Trial',
      secondaryCta: 'Request Enterprise Demo',
      accentColor: '#a855f7',
      bgMode: 'dark',
      services: [
        { title: 'Zero-Code Agent Orchestration', desc: 'Chain LLMs, vector search, and webhooks into resilient autonomous workflows.', icon: '🧠' },
        { title: 'Enterprise SOC-2 Security', desc: 'End-to-end AES-256 encryption with self-hosted private VPC deployment options.', icon: '🛡️' },
        { title: '1-Click API Integrations', desc: 'Pre-built connectors for Slack, Salesforce, GitHub, Stripe, and HubSpot.', icon: '🔌' }
      ],
      testimonial: { quote: 'We went from 200 signups a week to 1,200. The interactive workflow mockup converted tire-kickers into enterprise POCs.', author: 'Maya Lin', role: 'VP of Growth, CognitiveOS' },
      stats: [{ label: 'Workflows Executed', value: '1.4B+' }, { label: 'Developer Stars', value: '18.4k' }, { label: 'Time Saved / Team', value: '42 Hrs/Wk' }]
    }
  },
  {
    id: 'saas-2',
    name: 'CloudArmor — DevSecOps & Cloud Compliance',
    industryId: 'b2b_saas',
    category: 'Security & Cloud Devops',
    description: 'Authoritative cybersecurity theme with interactive vulnerability map, live compliance checklist (SOC-2, HIPAA, GDPR), and CLI installation preview.',
    creditCost: 6,
    rating: 4.8,
    reviewsCount: 310,
    styleTheme: 'Deep Cyber Navy & Terminal Green',
    thumbnailGradient: 'from-slate-950 via-emerald-950 to-neutral-950',
    colorPalette: ['#020617', '#10b981', '#38bdf8', '#0f172a'],
    conversionBadge: '🛡️ Automated SOC-2 in 14 Days',
    features: ['Live Compliance Readiness Scorecard', 'Interactive Terminal Code Box', 'Security Whitepaper Gate', 'Integrations Hub'],
    pagesIncluded: ['Home', 'Continuous Monitoring', 'Compliance Frameworks', 'Security Trust Center', 'Book Security Audit'],
    previewMockup: {
      heroTitle: 'Continuous Cloud Security & Automated SOC-2 / HIPAA Compliance',
      heroSubtitle: 'Scan AWS, GCP, and Kubernetes clusters in real-time. Detect infrastructure misconfigurations before hackers do.',
      ctaText: 'Scan Your Cloud Free',
      secondaryCta: 'Download Whitepaper',
      accentColor: '#10b981',
      bgMode: 'dark',
      services: [
        { title: 'Real-Time Misconfiguration Scan', desc: 'Inspect IAM permissions, S3 bucket exposures, and open ports automatically.', icon: '🔍' },
        { title: 'Continuous Evidence Collection', desc: 'Zero manual screenshots. Automated auditor-ready compliance reports.', icon: '📑' },
        { title: 'Agentless Cloud Deployment', desc: 'Connect read-only IAM cross-account roles in under 3 minutes.', icon: '☁️' }
      ],
      testimonial: { quote: 'Our SOC-2 audit took 12 days instead of 6 months. The website communicates immense enterprise security trust.', author: 'Dan Vane', role: 'Chief Information Security Officer' },
      stats: [{ label: 'Audits Passed', value: '850+ Cos' }, { label: 'Cloud Resources Monitored', value: '4.2M' }, { label: 'False Positive Rate', value: '< 0.01%' }]
    }
  },
  {
    id: 'saas-3',
    name: 'LedgerFlow — FinTech Invoicing & Global Payroll',
    industryId: 'b2b_saas',
    category: 'FinTech & Payments',
    description: 'Ultra-clean Swiss finance aesthetic with multi-currency payout simulator, tax withholding breakdown, and automated invoice preview.',
    creditCost: 6,
    rating: 4.8,
    reviewsCount: 290,
    styleTheme: 'Swiss Minimalist & Electric Indigo',
    thumbnailGradient: 'from-indigo-600 to-blue-700',
    colorPalette: ['#0f172a', '#4f46e5', '#10b981', '#f8fafc'],
    conversionBadge: '💳 Pay Contractors in 150+ Countries',
    features: ['Global FX Exchange Simulator', 'Sample PDF Invoice Preview', 'Tax Compliance Matcher', 'Self-Serve Signup Modal'],
    pagesIncluded: ['Home', 'Global Payroll', 'Contractor Management', 'Pricing Calculator', 'Get Started'],
    previewMockup: {
      heroTitle: 'Pay Global Teams in 150+ Currencies with 1-Click Tax Compliance',
      heroSubtitle: 'Eliminate cross-border payroll headaches. Local contracts, automated localized tax withholding, and instant bank wire transfers.',
      ctaText: 'Get Started Free',
      secondaryCta: 'Compare Exchange Rates',
      accentColor: '#4f46e5',
      bgMode: 'light',
      services: [
        { title: 'Localized Independent Contracts', desc: 'Legally vetted contracts compliant with local labor laws across 150+ countries.', icon: '📄' },
        { title: 'Instant Same-Day Payouts', desc: 'Team members withdraw directly to local bank accounts, Wise, or digital wallets.', icon: '💸' },
        { title: 'Automated 1099 & W-8BEN Filing', desc: 'Zero manual paperwork at tax season. Tax documentation stored securely.', icon: '🏛️' }
      ],
      testimonial: { quote: 'Saved our finance team 25 hours every payroll cycle. Our international team loves the self-serve withdrawal portal.', author: 'Tara Singh', role: 'Head of People & Finance' },
      stats: [{ label: 'Countries Supported', value: '150+' }, { label: 'Processed Volume', value: '$850M+' }, { label: 'Payout Speed', value: '< 2 Hours' }]
    }
  },
  {
    id: 'saas-4',
    name: 'PipelinePro — CRM & AI Sales Intelligence',
    industryId: 'b2b_saas',
    category: 'Sales CRM & Analytics',
    description: 'High-conversion vibrant sales software layout with drag-and-drop Kanban preview, email cadence generator, and revenue pipeline forecaster.',
    creditCost: 6,
    rating: 4.7,
    reviewsCount: 360,
    styleTheme: 'Clean Slate & Energetic Amber',
    thumbnailGradient: 'from-amber-500 to-orange-600',
    colorPalette: ['#0f172a', '#f59e0b', '#3b82f6', '#f8fafc'],
    conversionBadge: '🎯 Close 35% More Deals',
    features: ['Interactive Deal Kanban Board', 'AI Email Prospecting Preview', 'Revenue Forecasting Graph', 'Free 1-Click Migration from HubSpot'],
    pagesIncluded: ['Home', 'Pipeline Automation', 'AI Sales Copilot', 'Customer Stories', 'Try Free'],
    previewMockup: {
      heroTitle: 'The All-In-One CRM Built to 10x Your Account Executive Velocity',
      heroSubtitle: 'Stop wasting hours entering manual data. Let AI research prospects, write personalized outreach, and update deals automatically.',
      ctaText: 'Try PipelinePro Free',
      secondaryCta: 'Watch 3-Min Product Tour',
      accentColor: '#f59e0b',
      bgMode: 'light',
      services: [
        { title: 'Zero-Click Meeting Notes', desc: 'AI listens to Zoom calls, summarizes objections, and logs action items in CRM.', icon: '🎙️' },
        { title: 'Visual Kanban Deal Flow', desc: 'Drag-and-drop pipeline stages with automated follow-up triggers and alerts.', icon: '📊' },
        { title: 'B2B Lead Enrichment', desc: 'Instant verified work email, mobile phone, and tech stack info on 250M contacts.', icon: '🔍' }
      ],
      testimonial: { quote: 'Our sales team adopted PipelinePro in one afternoon. Our reps close 35% more pipeline with half the administrative grunt work.', author: 'Nate Jacobs', role: 'VP of Sales' },
      stats: [{ label: 'Deals Closed', value: '$1.8B' }, { label: 'Sales Teams Active', value: '3,200+' }, { label: 'Admin Time Saved', value: '8 Hrs/Rep' }]
    }
  },

  // ─── FITNESS & WELLNESS (3 templates) ───
  {
    id: 'fit-1',
    name: 'IronForge — Elite CrossFit & Strength Arena',
    industryId: 'fitness',
    category: 'Gym & Strength',
    description: 'High-intensity athletic dark theme with live WOD (Workout of the Day) ticker, class booking calendar, coach bios, and membership tier cards.',
    creditCost: 5,
    rating: 4.8,
    reviewsCount: 290,
    styleTheme: 'Raw Industrial & Fire Orange',
    thumbnailGradient: 'from-orange-600 to-red-700',
    colorPalette: ['#18181b', '#f97316', '#dc2626', '#27272a'],
    conversionBadge: '🏋️ Free 1-Day Trial Pass',
    features: ['Daily Live WOD Display', 'Class Schedule & Spot Booking', 'Member Leaderboard Ticker', 'Membership Pass Purchase'],
    pagesIncluded: ['Home', 'Daily WODs', 'Class Schedule', 'Coaches', 'Get Free Day Pass'],
    previewMockup: {
      heroTitle: 'Forge Unstoppable Functional Strength & Mental Resilience',
      heroSubtitle: 'Olympic lifting platforms, rogue rig cages, infrared recovery saunas, and world-class certified coaching.',
      ctaText: 'Claim Free 1-Day Pass',
      secondaryCta: 'View Today’s WOD',
      accentColor: '#f97316',
      bgMode: 'dark',
      services: [
        { title: 'Competitive CrossFit', desc: 'High-intensity daily metcons, barbell complexes, and gymnastics progression.', icon: '🏋️' },
        { title: 'Infrared Saunas & Cold Plunges', desc: 'Contrast therapy recovery suite with 45°F water tanks and dry heat.', icon: '🧊' },
        { title: 'Personalized Nutrition Coaching', desc: 'Macro breakdown and body scan assessments every 4 weeks with certified dietitians.', icon: '🥗' }
      ],
      testimonial: { quote: 'New member trial signups doubled within 30 days of launching the instant day-pass SMS claim feature.', author: 'Marcus Brody', role: 'Head Coach & Owner' },
      stats: [{ label: 'Active Athletes', value: '450+' }, { label: 'Classes / Week', value: '62 Slots' }, { label: 'Average PR Increase', value: '24%' }]
    }
  },
  {
    id: 'fit-2',
    name: 'Serenity — Reformer Pilates & Mindful Movement',
    industryId: 'fitness',
    category: 'Pilates & Yoga',
    description: 'Serene warm travertine aesthetic with reformer bed reservations, instructor matching, pregnancy-safe filters, and intro pack purchase.',
    creditCost: 5,
    rating: 4.9,
    reviewsCount: 215,
    styleTheme: 'Warm Travertine & Soft Sage',
    thumbnailGradient: 'from-stone-600 to-emerald-800',
    colorPalette: ['#292524', '#059669', '#fafaf9', '#e7e5e4'],
    conversionBadge: '✨ Intro Offer: 3 Classes for $49',
    features: ['Interactive Bed Reservation', 'Prenatal / Injury Safe Tagging', 'Teacher Bio & Music Playlists', 'Gift Card Digital Delivery'],
    pagesIncluded: ['Home', 'Reformer Classes', 'First Timers Guide', 'Instructors', 'Buy Class Packs'],
    previewMockup: {
      heroTitle: 'Sculpt Long, Lean Core Strength on Custom Allegro Reformers',
      heroSubtitle: 'Low-impact, high-burn athletic reformer Pilates tailored for all fitness levels in a sun-drenched sanctuary.',
      ctaText: 'Book $49 Intro Pack',
      secondaryCta: 'Explore Class Styles',
      accentColor: '#059669',
      bgMode: 'light',
      services: [
        { title: 'Athletic Dynamic Reformer', desc: 'Fast-paced rhythmic core sculpting with resistance springs and jumpboards.', icon: '🧘‍♀️' },
        { title: 'Restorative Stretch & Align', desc: 'Gentle spinal decompression, breathwork, and deep myofascial release.', icon: '🌿' },
        { title: 'Small Intimate Groups (Max 8)', desc: 'Individual posture adjustments and hands-on alignment guidance every session.', icon: '✨' }
      ],
      testimonial: { quote: 'Clients constantly praise how peaceful yet effortless the online bed reservation process is.', author: 'Chloe Martin', role: 'Studio Director' },
      stats: [{ label: 'Class Capacity', value: 'Max 8 Beds' }, { label: 'Client Retention', value: '91.2%' }, { label: 'Studio Rating', value: '4.95 ★' }]
    }
  },
  {
    id: 'fit-3',
    name: 'Apex Strike — Boxing & Martial Arts Academy',
    industryId: 'fitness',
    category: 'Boxing & MMA',
    description: 'Gritty, cinematic dark gym style with bag spot reservation, sparring rules orientation, kids martial arts schedule, and glove package add-ons.',
    creditCost: 5,
    rating: 4.8,
    reviewsCount: 175,
    styleTheme: 'Monochrome Dark & Crimson Red',
    thumbnailGradient: 'from-red-700 via-neutral-900 to-black',
    colorPalette: ['#0a0a0a', '#ef4444', '#ffffff', '#262626'],
    conversionBadge: '🥊 First Boxing Class Free',
    features: ['Heavy Bag Spot Selector', 'Sparring Safety Waiver Sign', 'Kids Brazilian Jiu-Jitsu Track', 'Gear Pro-Shop Cart'],
    pagesIncluded: ['Home', 'Boxing & Muay Thai', 'BJJ Grappling', 'Trainers', 'Book Free Class'],
    previewMockup: {
      heroTitle: 'Authentic Boxing, Muay Thai & Brazilian Jiu-Jitsu',
      heroSubtitle: 'Learn genuine championship technique from seasoned fighters. Shed fat, build explosive power, and master self-defense.',
      ctaText: 'Claim Free Boxing Class',
      secondaryCta: 'Meet The Fighters',
      accentColor: '#ef4444',
      bgMode: 'dark',
      services: [
        { title: 'Championship Boxing Conditioning', desc: '10 rounds of heavy bag strikes, speed bag rhythm, and mitt work.', icon: '🥊' },
        { title: 'Muay Thai Kickboxing', desc: 'Dutch drills, heavy kick pads, knees, and tactical ring movement.', icon: '🥋' },
        { title: 'GI & No-GI Brazilian Jiu-Jitsu', desc: 'Ground leverage, joint locks, and positional sparring for all belt ranks.', icon: '🤼' }
      ],
      testimonial: { quote: 'The interactive bag reservation tool eliminated crowding and filled our weekday 6 PM evening classes to 100%.', author: 'Tyson Vance', role: 'Head Coach' },
      stats: [{ label: 'Pro Fighters Trained', value: '18 Pros' }, { label: 'Heavy Bags', value: '32 Bags' }, { label: 'Weight Loss Avg', value: '14 lbs / 60 Days' }]
    }
  },

  // ─── LEGAL & FINANCE (3 templates) ───
  {
    id: 'leg-1',
    name: 'Vanguard Legal Partners — Corporate Law & M&A',
    industryId: 'legal',
    category: 'Corporate Law',
    description: 'Distinguished prestige navy and gold aesthetic with confidential case assessment form, attorney directory with credentials, and publications library.',
    creditCost: 6,
    rating: 4.9,
    reviewsCount: 320,
    styleTheme: 'Prestigious Navy & Classic Gold',
    thumbnailGradient: 'from-slate-900 via-blue-950 to-neutral-900',
    colorPalette: ['#020617', '#1e3a8a', '#d97706', '#f8fafc'],
    conversionBadge: '⚖️ $4.2B in M&A Transactions',
    isNew: true,
    isPremium: true,
    features: ['Confidential Conflict Checker Form', 'Attorney Credential Filter', 'M&A Deal History Marquee', 'Client Portal Encrypted Upload'],
    pagesIncluded: ['Home', 'Mergers & Acquisitions', 'Commercial Litigation', 'Partners & Associates', 'Confidential Consultation'],
    previewMockup: {
      heroTitle: 'Strategic Legal Counsel for High-Stakes M&A, Capital & Dispute Defense',
      heroSubtitle: 'Advising boardrooms, institutional funds, and technology innovators across complex cross-border corporate transactions.',
      ctaText: 'Request Confidential Consultation',
      secondaryCta: 'Review Track Record',
      accentColor: '#d97706',
      bgMode: 'dark',
      services: [
        { title: 'Mergers & Acquisitions (M&A)', desc: 'Buy-side and sell-side representation from preliminary letters of intent through closing.', icon: '🤝' },
        { title: 'Commercial Dispute Defense', desc: 'Relentless trial litigation before state, federal, and international arbitration tribunals.', icon: '⚖️' },
        { title: 'Intellectual Property & Patents', desc: 'Defending proprietary algorithms, global patent portfolios, and brand trademarks.', icon: '🛡️' }
      ],
      testimonial: { quote: 'Our firm’s digital presence now accurately mirrors our $4B track record. Inbound corporate referrals are at an all-time high.', author: 'Arthur Sterling, Esq.', role: 'Senior Managing Partner' },
      stats: [{ label: 'Transaction Value', value: '$4.2B+' }, { label: 'Partner Experience', value: '25+ Yrs Avg' }, { label: 'Litigation Win Rate', value: '92.4%' }]
    }
  },
  {
    id: 'leg-2',
    name: 'Apex Wealth Advisory — Chartered Accountants & Tax Strategy',
    industryId: 'legal',
    category: 'Tax & Accounting',
    description: 'Authoritative crisp corporate design with tax savings calculator, corporate audit checklist, and 1-click tax filing discovery call.',
    creditCost: 5,
    rating: 4.8,
    reviewsCount: 260,
    styleTheme: 'Crisp Slate & Royal Blue',
    thumbnailGradient: 'from-slate-800 to-blue-900',
    colorPalette: ['#0f172a', '#2563eb', '#10b981', '#ffffff'],
    conversionBadge: '📊 Saved $18M+ in Legal Tax Deductions',
    features: ['Corporate Tax Savings Estimator', 'Audit Readiness Checklist', 'Secure Document Dropzone', 'Monthly CFO Retainer Plans'],
    pagesIncluded: ['Home', 'Tax Strategy & Planning', 'Fractional CFO', 'Audit & Compliance', 'Book Strategy Call'],
    previewMockup: {
      heroTitle: 'Proactive Tax Optimization & Fractional CFO for Growing Enterprises',
      heroSubtitle: 'Stop overpaying taxes. We structure corporate holdings, R&D credits, and cash flows so you retain maximum profit.',
      ctaText: 'Calculate Your Tax Savings',
      secondaryCta: 'Schedule Strategy Session',
      accentColor: '#2563eb',
      bgMode: 'light',
      services: [
        { title: 'R&D Tax Credit Maximization', desc: 'Claim up to $500k in payroll tax offsets for software and manufacturing R&D.', icon: '💡' },
        { title: 'Fractional CFO Leadership', desc: 'Boardroom cash-flow modeling, unit economics optimization, and runway forecasting.', icon: '📈' },
        { title: 'IRS & Audit Representation', desc: 'Licensed CPAs representing and resolving state and federal tax examinations.', icon: '📋' }
      ],
      testimonial: { quote: 'The tax savings calculator on the homepage converts 1 in 4 visitors into high-value monthly fractional CFO clients.', author: 'Pooja Agarwal, CPA', role: 'Principal Partner' },
      stats: [{ label: 'Corporate Clients', value: '380+' }, { label: 'Tax Legally Saved', value: '$18M+' }, { label: 'Audit Clear Rate', value: '100%' }]
    }
  },
  {
    id: 'leg-3',
    name: 'Horizon Venture Capital & Private Equity',
    industryId: 'legal',
    category: 'Venture Capital',
    description: 'Sleek dark minimalist layout highlighting portfolio company investments, investment thesis, founder pitch submission form, and LP portal login.',
    creditCost: 6,
    rating: 4.8,
    reviewsCount: 140,
    styleTheme: 'Minimalist Charcoal & Platinum',
    thumbnailGradient: 'from-neutral-900 via-zinc-800 to-black',
    colorPalette: ['#171717', '#e5e5e5', '#3b82f6', '#262626'],
    conversionBadge: '💼 $250M Assets Under Management',
    features: ['Interactive Portfolio Grid with Valuation Multiples', 'Pitch Deck Direct Upload Funnel', 'LP Investor Portal Gateway', 'Founder Testimonials'],
    pagesIncluded: ['Home', 'Investment Thesis', 'Portfolio Companies', 'Team & Partners', 'Submit Pitch Deck'],
    previewMockup: {
      heroTitle: 'Backing Visionary Founders Building the Infrastructure of Tomorrow',
      heroSubtitle: 'Early-stage venture capital focused on B2B SaaS, AI infrastructure, and autonomous commerce technologies.',
      ctaText: 'Submit Your Pitch Deck',
      secondaryCta: 'Explore Portfolio Companies',
      accentColor: '#3b82f6',
      bgMode: 'dark',
      services: [
        { title: 'Seed & Series A Check Sizes', desc: 'Leading rounds with $1M to $5M initial checks and dedicated reserves for follow-on.', icon: '💰' },
        { title: 'Customer Intro Network', desc: 'Direct access to 200+ Enterprise CIOs and CTOs for immediate enterprise pilot contracts.', icon: '🌐' },
        { title: 'Talent & Hiring SWAT Team', desc: 'Embedded talent partners placing key founding engineers and go-to-market executives.', icon: '👥' }
      ],
      testimonial: { quote: 'Founders frequently comment on how clean and frictionless our deck submission process is. High quality pipeline.', author: 'Sebastian Ross', role: 'General Partner' },
      stats: [{ label: 'AUM', value: '$250M' }, { label: 'Portfolio Companies', value: '42 Startups' }, { label: 'Unicorn Exits', value: '5 Exits' }]
    }
  },

  // ─── BEAUTY, SALON & SPA (3 templates) ───
  {
    id: 'beauty-1',
    name: 'Luxe Locks — Luxury Hair Atelier & Balayage Bar',
    industryId: 'beauty',
    category: 'Salon & Hair',
    description: 'Chic, fashionable editorial design with stylist portfolio gallery, instant chair appointment booking, hair treatment price list, and Instagram sync.',
    creditCost: 5,
    rating: 4.9,
    reviewsCount: 390,
    styleTheme: 'Champagne Rose & Chic Noir',
    thumbnailGradient: 'from-rose-400 via-pink-500 to-amber-600',
    colorPalette: ['#1c1917', '#f43f5e', '#fef08a', '#fff1f2'],
    conversionBadge: '💇‍♀️ 10,000+ Balayage Transformations',
    isNew: true,
    features: ['Live Stylist Chair Booking', 'Hair Transformation Before/After', 'Digital Service & Balayage Menu', 'Add-to-Calendar Reminders'],
    pagesIncluded: ['Home', 'Hair Services & Prices', 'Meet the Stylists', 'Client Transformations', 'Book Appointment'],
    previewMockup: {
      heroTitle: 'Custom French Balayage & Precision Hair Couture',
      heroSubtitle: 'Where master colorists blend effortless natural dimension, silky texture, and bespoke cuts suited to your facial profile.',
      ctaText: 'Book Master Stylist',
      secondaryCta: 'View Balayage Gallery',
      accentColor: '#f43f5e',
      bgMode: 'light',
      services: [
        { title: 'Custom Seamless Balayage', desc: 'Hand-painted highlights formulated with Olaplex bond repair technology.', icon: '🎨' },
        { title: 'Organic Keratin Smoothing', desc: 'Formaldehyde-free anti-humidity smoothing lasting up to 5 months.', icon: '✨' },
        { title: 'Luxury Scalp Rejuvenation Spa', desc: 'Japanese head spa wash, herbal exfoliating scrub, and neck acupressure massage.', icon: '💆‍♀️' }
      ],
      testimonial: { quote: 'Our stylists’ chairs are booked solid 6 weeks out. The Instagram feed integration on the home page is a huge converter.', author: 'Camille Dupont', role: 'Master Stylist & Owner' },
      stats: [{ label: 'Client Return Rate', value: '94%' }, { label: 'Color Formulations', value: '100% Custom' }, { label: 'Salon Awards', value: 'Best Salon 2026' }]
    }
  },
  {
    id: 'beauty-2',
    name: 'Aura MedSpa — Aesthetic Laser & Skin Clinic',
    industryId: 'beauty',
    category: 'MedSpa & Aesthetics',
    description: 'High-end clinical luxury aesthetic with facial treatment visualizer, Botox & filler pricing breakdown, dermatologist credentials, and VIP membership club.',
    creditCost: 6,
    rating: 4.8,
    reviewsCount: 280,
    styleTheme: 'Soft Quartz & Rose Gold',
    thumbnailGradient: 'from-neutral-900 to-pink-950',
    colorPalette: ['#171717', '#fb7185', '#f43f5e', '#fdf2f8'],
    conversionBadge: '💉 FDA-Approved Laser & Injectables',
    features: ['Treatment Area Face Map', 'VIP Monthly Glow Club', 'Medical Provider Credentials', 'Interactive Before/After Slider'],
    pagesIncluded: ['Home', 'Laser & Skin Rejuvenation', 'Injectables & Botox', 'VIP Glow Membership', 'Book Free Consultation'],
    previewMockup: {
      heroTitle: 'Advanced Non-Surgical Aesthetics & Natural Facial Harmonization',
      heroSubtitle: 'Administered solely by board-certified aesthetic doctors and nurse practitioners using state-of-the-art laser technology.',
      ctaText: 'Book Free Skin Analysis',
      secondaryCta: 'Explore Before/After Gallery',
      accentColor: '#fb7185',
      bgMode: 'light',
      services: [
        { title: 'HydraFacial Elite MD', desc: 'Vortex suction cleanses, extracts impurities, and saturates skin with peptides.', icon: '💧' },
        { title: 'Morpheus8 RF Microneedling', desc: 'Subdermal collagen remodeling for tightened skin and reduced acne scarring.', icon: '⚡' },
        { title: 'Subtle Lip & Cheek Fillers', desc: 'Natural hyaluronic acid contouring that honors your unique facial anatomy.', icon: '👄' }
      ],
      testimonial: { quote: 'Patients appreciate the transparent treatment descriptions and doctor bios. Consultations increased by 140%.', author: 'Dr. Evelyn Ward, MD', role: 'Medical Director' },
      stats: [{ label: 'Treatments Performed', value: '18,500+' }, { label: 'Doctor Supervised', value: '100%' }, { label: 'Satisfaction Score', value: '4.92 ★' }]
    }
  },
  {
    id: 'beauty-3',
    name: 'The Gentry — Classic Barber & Men’s Grooming Lounge',
    industryId: 'beauty',
    category: 'Barber & Men’s Grooming',
    description: 'Distinguished dark oak and leather aesthetic with hot towel shave booking, craft whiskey lounge photos, grooming product shop, and membership passes.',
    creditCost: 5,
    rating: 4.8,
    reviewsCount: 230,
    styleTheme: 'Dark Oak & Whiskey Amber',
    thumbnailGradient: 'from-amber-900 via-stone-900 to-black',
    colorPalette: ['#1c1917', '#d97706', '#fbbf24', '#292524'],
    conversionBadge: '🥃 Complimentary Single Malt with Cut',
    features: ['Barber Selection & Chair Booking', 'Beard Grooming Package Pricing', 'Subscription Grooming Pass', 'E-Commerce Beard Oils Store'],
    pagesIncluded: ['Home', 'Grooming Services', 'Barbers', 'Beard Apothecary', 'Reserve Chair'],
    previewMockup: {
      heroTitle: 'Master Barbering, Straight Razor Shaves & Complimentary Bourbon',
      heroSubtitle: 'A haven of classic masculine craftsmanship. Relax in vintage Belmont leather chairs with hot eucalyptus steam towels.',
      ctaText: 'Reserve Your Barber Chair',
      secondaryCta: 'View Grooming Menu',
      accentColor: '#d97706',
      bgMode: 'dark',
      services: [
        { title: 'Traditional Straight Razor Shave', desc: 'Pre-shave essential oils, hot lather, straight steel blade, and cold towel finish.', icon: '🪒' },
        { title: 'Signature Fade & Scissor Cut', desc: 'Precision skin taper tailored to growth patterns, styled with matte styling clay.', icon: '✂️' },
        { title: 'Full Beard Sculpting & Oil Treatment', desc: 'Length shaping, razor line definition, and argan oil steam absorption.', icon: '🧔' }
      ],
      testimonial: { quote: 'Our regulars book their bi-weekly fades right from their phones in 10 seconds. The whiskey lounge photos draw new walk-ins constantly.', author: 'Jack Thornton', role: 'Master Barber' },
      stats: [{ label: 'Shaves Mastered', value: '35,000+' }, { label: 'Single Malts on Bar', value: '24 Bottles' }, { label: 'Barber Experience', value: '15+ Yrs' }]
    }
  },

  // ─── TRAVEL & HOSPITALITY (3 templates) ───
  {
    id: 'travel-1',
    name: 'Villa Paradiso — Boutique Heritage Resort & Spa',
    industryId: 'travel',
    category: 'Hotels & Resorts',
    description: 'Cinematic Mediterranean luxury theme with direct room reservation engine, 360 villa suite tour, experiences calendar, and guest dining reservations.',
    creditCost: 7,
    rating: 4.9,
    reviewsCount: 410,
    styleTheme: 'Mediterranean Azure & Sandstone',
    thumbnailGradient: 'from-sky-500 via-blue-600 to-indigo-800',
    colorPalette: ['#0f172a', '#0284c7', '#38bdf8', '#f8fafc'],
    conversionBadge: '🏖️ Direct Booking Best Rate Guarantee',
    isNew: true,
    isPremium: true,
    features: ['Direct Room Booking Engine (No OTA Fees)', '360° Villa Virtual Walkthrough', 'Curated Excursion Concierge', 'Live Weather & Sea Temperature Widget'],
    pagesIncluded: ['Home', 'Suites & Villas', 'Resort Dining', 'Spa & Wellness', 'Book Stay'],
    previewMockup: {
      heroTitle: 'Cliffside Infinity Pools & Historic Olive Groves on the Coast',
      heroSubtitle: 'Wake up to the gentle waves of the azure Mediterranean sea. Private sea-access villas with dedicated butler service.',
      ctaText: 'Check Villa Availability',
      secondaryCta: 'Explore 360° Suites',
      accentColor: '#0284c7',
      bgMode: 'light',
      services: [
        { title: 'Cliffside Private Infinity Pools', desc: 'Heated salt-water pools with panoramic sunset views over the bay.', icon: '🏊‍♂️' },
        { title: 'Farm-to-Table Olive Oil Tastings', desc: 'Private tours through our 200-year-old estate groves with wine sommelier.', icon: '🫒' },
        { title: 'Private Yacht Charters', desc: 'Skippered Riva speedboats for secluded cove swimming and coastal dining.', icon: '⛵' }
      ],
      testimonial: { quote: 'By taking direct bookings on our own site with this template, we saved $85,000 in Booking.com and Expedia commission fees.', author: 'Matteo Bellini', role: 'General Manager' },
      stats: [{ label: 'Direct Bookings', value: '78%' }, { label: 'TripAdvisor Rating', value: '5.0 ★' }, { label: 'Guest Return Rate', value: '42%' }]
    }
  },
  {
    id: 'travel-2',
    name: 'WildPeak Expeditions — Adventure Trekking & Eco-Tours',
    industryId: 'travel',
    category: 'Adventure & Tours',
    description: 'Rugged outdoor aesthetic with route difficulty ratings, gear packing list, live expedition dates, and emergency satellite safety guarantees.',
    creditCost: 6,
    rating: 4.8,
    reviewsCount: 220,
    styleTheme: 'Mountain Slate & High-Vis Amber',
    thumbnailGradient: 'from-amber-600 via-stone-800 to-slate-900',
    colorPalette: ['#1c1917', '#f59e0b', '#10b981', '#f5f5f4'],
    conversionBadge: '🏔️ Certified Wilderness First Responders',
    features: ['Expedition Difficulty Badging', 'Live Departure Date Availability', 'Interactive Topographic Trail Map', 'Automated Gear Checklist PDF'],
    pagesIncluded: ['Home', 'Expeditions & Treks', 'Difficulty Ratings', 'Guides & Safety', 'Reserve Spot'],
    previewMockup: {
      heroTitle: 'Summit Himalayan Peaks & Trek Untamed Alpine Valleys',
      heroSubtitle: 'Small-group eco expeditions led by certified mountaineering guides. Zero-trace wilderness ethics and authentic local sherpa partnerships.',
      ctaText: 'Browse 2026 Expeditions',
      secondaryCta: 'Download Packing Guide',
      accentColor: '#f59e0b',
      bgMode: 'dark',
      services: [
        { title: 'Small Group Cap (Max 10)', desc: 'Guarantees personalized guide attention, flexible pacing, and low environmental impact.', icon: '🧗‍♂️' },
        { title: 'Garmin InReach Satellite Link', desc: '24/7 emergency SOS satellite communication on all high-altitude passes.', icon: '📡' },
        { title: 'Locally Sourced Hot Camp Meals', desc: 'Nutritious hot meals cooked fresh at high camps by experienced expedition chefs.', icon: '🍲' }
      ],
      testimonial: { quote: 'Our expedition departure dates sell out in minutes. The difficulty guide helps climbers pick the right route with confidence.', author: 'Tenzing Norgay Jr.', role: 'Expedition Leader' },
      stats: [{ label: 'Summits Reached', value: '380+' }, { label: 'Safety Record', value: '100%' }, { label: 'Local Communities Supported', value: '14 Villages' }]
    }
  },
  {
    id: 'travel-3',
    name: 'Monarch VIP — Chauffeur Services & Luxury Fleet Rental',
    industryId: 'travel',
    category: 'Luxury Transportation',
    description: 'Prestigious dark executive aesthetic with instant distance quote calculator, fleet vehicle spec showcase, and executive airport transfer booking.',
    creditCost: 6,
    rating: 4.9,
    reviewsCount: 195,
    styleTheme: 'Executive Black Tie & Platinum',
    thumbnailGradient: 'from-neutral-900 via-zinc-950 to-black',
    colorPalette: ['#0a0a0a', '#e5e5e5', '#3b82f6', '#171717'],
    conversionBadge: '🚗 Mercedes-Maybach & Escalade Fleet',
    features: ['Distance & Hourly Fare Calculator', 'Flight Number Automated Tracking', 'Chauffeur Security Clearance Badging', 'Corporate Invoicing Accounts'],
    pagesIncluded: ['Home', 'Fleet Gallery', 'Airport Transfers', 'Corporate Accounts', 'Reserve Vehicle'],
    previewMockup: {
      heroTitle: 'Private Executive Chauffeur Services for Diplomatic & VIP Travel',
      heroSubtitle: 'Impeccable punctuality, armored vehicle options, and vetted discreet professional chauffeurs available 24/7.',
      ctaText: 'Calculate Instant Fare',
      secondaryCta: 'View Luxury Fleet',
      accentColor: '#ffffff',
      bgMode: 'dark',
      services: [
        { title: 'Live Flight Tracker Sync', desc: 'Chauffeurs adjust pickup arrival automatically for delayed or early incoming flights.', icon: '✈️' },
        { title: 'Discreet Security Drivers', desc: 'Professionally trained in defensive evasive driving and close protection protocols.', icon: '🛡️' },
        { title: 'Mobile Office Amenities', desc: 'Onboard high-speed 5G WiFi, chilled mineral water, and device charging hubs.', icon: '💼' }
      ],
      testimonial: { quote: 'Corporate booking managers love the instant invoicing portal. Our corporate account volume grew 3x this quarter.', author: 'Marcus Vance', role: 'Operations Director' },
      stats: [{ label: 'Airport Transfers', value: '45,000+' }, { label: 'Punctuality Rate', value: '99.9%' }, { label: 'Fleet Vehicles', value: '60+ Luxury Cars' }]
    }
  }
]
