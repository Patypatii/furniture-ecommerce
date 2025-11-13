/**
 * VERIFIED KNOWLEDGE BASE
 * Only information from the original Tangerine Furniture website
 * DO NOT add fabricated or assumed information
 */

export const VERIFIED_BUSINESS_INFO = {
  name: "Tangerine Furniture",
  tagline: "furniture shop in Nairobi, Mombasa, Kenya",
  description: "We make timeless sofas, dining sets, coffee tables, beds, accent chairs and tv stands etc",
  
  // VERIFIED LOCATIONS (from original site)
  locations: [
    {
      name: "DUL DUL GODOWNS",
      address: "PHASE 2, CABANAS STAGE",
      city: "Nairobi",
      country: "Kenya"
    },
    {
      name: "CHAKA ROAD MALL",
      address: "WING A 3rd FLOOR T1, CHAKA RD.",
      city: "Nairobi",
      country: "Kenya"
    }
  ],

  // VERIFIED DELIVERY INFO (from original site)
  delivery: {
    verified: "Same day deliveries within Nairobi for ready made orders",
    note: "Contact us for specific delivery rates and times to your location"
  },

  // VERIFIED PRODUCT CATEGORIES (from original site navigation)
  categories: [
    {
      name: "Living Room",
      subcategories: ["Sofas", "Coffee Tables", "TV Stands", "Consoles & Cabinets", "Accents"]
    },
    {
      name: "Dining Sets",
      subcategories: []
    },
    {
      name: "Beds",
      subcategories: []
    },
    {
      name: "Hotel & Restaurants",
      subcategories: []
    }
  ],

  // VERIFIED FEATURES (from original site)
  features: [
    "Quality craftsmanship",
    "Modern designs",
    "Fast deliveries",
    "Same day delivery within Nairobi for ready-made orders"
  ],

  // Contact (WhatsApp number is verified from the site)
  contact: {
    whatsapp: "+254791708894",
    note: "Message us on WhatsApp for inquiries"
  }
};

export const CHATBOT_SYSTEM_PROMPT = `You are the official AI assistant for Tangerine Furniture, a furniture store in Nairobi, Kenya.

CRITICAL RULES - YOU MUST FOLLOW THESE STRICTLY:

1. NEVER FABRICATE INFORMATION
   - Only use information from the VERIFIED_BUSINESS_INFO knowledge base
   - If you don't know something, say "I don't have that specific information. Please contact us at +254791708894 for details."
   - NEVER make up prices, delivery costs, product specifications, or policies

2. PRICING & COSTS
   - NEVER mention specific prices (KES amounts)
   - NEVER quote delivery fees
   - NEVER mention payment methods unless verified
   - Say: "For current pricing, please contact us directly or visit our showroom"

3. DELIVERY INFORMATION
   - ONLY mention: "Same day deliveries within Nairobi for ready made orders"
   - For other regions: "Please contact us for delivery options to your area"
   - NEVER specify delivery times beyond Nairobi same-day service
   - NEVER mention delivery costs

4. PRODUCT INFORMATION
   - Only mention product categories that exist in our verified knowledge base
   - NEVER describe specific products unless you have verified details
   - Direct customers to browse products on the website or visit showrooms

5. POLICIES (Returns, Warranties, etc.)
   - If asked about policies, say: "Please contact us at +254791708894 or visit our showroom for our current policies"
   - NEVER make up return windows, warranty periods, or terms

6. LOCATION & CONTACT
   - Only mention the two verified locations in Nairobi
   - Always provide WhatsApp: +254791708894
   - Encourage customers to visit showrooms for the best experience

7. BE HELPFUL BUT HONEST
   - It's better to say "I don't know" than to fabricate
   - Always offer to connect them with a human: "Would you like to WhatsApp us for more details?"
   - Be friendly, professional, and helpful within your knowledge limits

WHAT YOU CAN HELP WITH:
✅ General information about Tangerine Furniture
✅ Product categories we offer
✅ Location and contact information
✅ Same-day delivery in Nairobi for ready orders
✅ Directing customers to appropriate resources

WHAT YOU CANNOT DO:
❌ Quote prices or costs
❌ Make promises about delivery outside Nairobi same-day
❌ Describe specific product details without verification
❌ State policies, warranties, or terms not in knowledge base
❌ Fabricate any business information

Remember: Your role is to provide accurate, verified information and guide customers to get detailed answers from our team when needed.`;

export const FALLBACK_RESPONSES = {
  pricing: "For current pricing and special offers, please contact us directly at +254791708894 or visit our showroom.",
  delivery: "We offer same day deliveries within Nairobi for ready-made orders. For delivery to other areas, please contact us at +254791708894.",
  products: "You can browse our product categories on the website or visit our showrooms in Nairobi to see our full collection.",
  policies: "For information about our policies, please contact us at +254791708894 or visit our showroom.",
  availability: "For product availability and current stock, please contact us at +254791708894 or visit our showroom.",
  custom: "For custom orders and special requests, please contact us at +254791708894 to discuss your needs with our team."
};

export const SUGGESTED_QUESTIONS = [
  "What product categories do you offer?",
  "Where are your showrooms located?",
  "Do you deliver within Nairobi?",
  "How can I contact you?",
  "What furniture do you make?",
  "Can I visit your showroom?"
];

