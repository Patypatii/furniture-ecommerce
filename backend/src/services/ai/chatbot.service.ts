import { generateChatCompletion } from '../../config/openai';
import { logger } from '../../utils/logger';
import Product from '../../models/Product';
import Category from '../../models/Category';
import { IChatMessage } from '@tangerine/shared';
import axios from 'axios';

interface ChatContext {
  conversationHistory: IChatMessage[];
  userId?: string;
  sessionId: string;
  pageContext?: string;
  currentPage?: string;
}

// VERIFIED BUSINESS INFORMATION - Only facts from original site
const VERIFIED_BUSINESS_INFO = {
  name: "Tangerine Furniture",
  description: "furniture shop in Nairobi, Mombasa, Kenya. We make timeless sofas, dining sets, coffee tables, beds, accent chairs and tv stands",
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
  delivery: {
    verified: "Same day deliveries within Nairobi for ready made orders",
    note: "Contact +254791708894 for delivery to other regions"
  },
  contact: {
    whatsapp: "+254791708894"
  }
};

// STRICT SYSTEM PROMPT - Anti-hallucination rules
const STRICT_SYSTEM_PROMPT = `You are the official AI assistant for Tangerine Furniture in Nairobi, Kenya.

CONTEXT AWARENESS:
- You know which page the user is currently viewing
- Provide relevant responses based on their current page context
- If they're on a product page, help them with that specific product
- If they're in the cart, help with checkout questions
- Always be contextually relevant to their current location on the website

CRITICAL RULES - FOLLOW STRICTLY:

1. BE HELPFUL FIRST
   - Answer common questions directly without always redirecting to WhatsApp
   - Use your knowledge base and context to provide useful information
   - Only suggest WhatsApp for complex issues (custom orders, bulk orders, complaints)

2. ORDER TRACKING
   - If asked about tracking orders, explain: "You can track your order in the 'My Orders' section of your account. Login and go to Account > Orders to see your order status and tracking details."
   - No WhatsApp needed for this common question

3. POPULAR PRODUCTS
   - If products ARE in database: Show them with names, prices, ratings
   - If products are NOT in database: Say "Let me help you find furniture! What type are you looking for? (sofas, beds, dining sets, etc.)"
   - NEVER immediately redirect to WhatsApp for product questions

4. PRICING & AVAILABILITY
   - ONLY quote prices from the product database provided
   - If products shown: Display their actual prices
   - If no products: "I can help you find the right furniture. What are you looking for?"

5. DELIVERY
   - VERIFIED: "Same day deliveries within Nairobi for ready made orders"
   - For other regions: "For delivery outside Nairobi, please WhatsApp +254791708894"
   - Free shipping on orders over KES 10,000

6. PAYMENT METHODS
   - We accept: M-Pesa, Credit/Debit Cards, Cash on Delivery
   - No WhatsApp needed for this standard info

7. PRODUCT RESPONSES:
   If products found in database:
   - Show product names, prices, ratings
   - Describe features from database
   - Be enthusiastic and helpful
   
   If NO products found:
   - Ask clarifying questions to help them find what they need
   - Suggest browsing categories
   - Only suggest WhatsApp if truly stuck

8. FORMATTING:
   - Use emojis to make responses friendly and engaging
   - DO NOT use markdown formatting (**, ##, _, etc.)
   - Use plain text with emojis only
   - Keep responses clear, concise and helpful

VERIFIED BUSINESS INFO:
${JSON.stringify(VERIFIED_BUSINESS_INFO, null, 2)}

Remember: Be helpful and informative first. Only redirect to WhatsApp for complex issues that truly need human assistance!`;

/**
 * AI Chatbot Service with Web Search & Anti-Hallucination
 */
class ChatbotService {
  /**
   * Process chat message with multi-source intelligence
   */
  async processMessage(
    userMessage: string,
    context: ChatContext
  ): Promise<{
    message: IChatMessage;
    suggestions?: string[];
    relatedProducts?: any[];
    showWhatsAppButton?: boolean;
  }> {
    try {
      // Detect user intent
      const intent = await this.detectIntent(userMessage);
      logger.info(`Intent: ${intent} | Session: ${context.sessionId}`);

      // Initialize context sources
      let productContext = '';
      let webSearchContext = '';
      let categoryContext = '';
      let relatedProducts: any[] = [];
      let showWhatsAppButton = false;

      // 1. Get products from database if relevant
      if (intent === 'product_search' || intent === 'product_inquiry' || intent === 'recommendation') {
        relatedProducts = await this.searchRelevantProducts(userMessage);
        if (relatedProducts.length > 0) {
          productContext = this.formatProductContext(relatedProducts);
          showWhatsAppButton = false; // Has products, no need for WhatsApp
        }
      }

      // 2. Get category information
      const categories = await this.getCategoryContext();
      categoryContext = categories;

      // 3. Use web search for general furniture knowledge (NOT business-specific)
      const needsWebSearch = this.shouldUseWebSearch(intent, userMessage);
      if (needsWebSearch) {
        webSearchContext = await this.performWebSearch(userMessage);
      }

      // 4. Determine if question needs human assistance (only for complex issues)
      // Don't override if we already have products to show
      if (relatedProducts.length === 0) {
        showWhatsAppButton = this.needsHumanAssistance(intent, userMessage);
      }

      // 5. Build AI prompt with all context (including page context)
      const systemPrompt = this.buildSystemPrompt(
        productContext,
        categoryContext,
        webSearchContext,
        context.pageContext,
        context.currentPage
      );

      const messages = [
        {
          role: 'system' as const,
          content: systemPrompt,
        },
        ...context.conversationHistory.slice(-8).map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: userMessage,
        },
      ];

      // 6. Generate AI response
      let aiResponse = await generateChatCompletion({
        messages,
        temperature: 0.7,
        maxTokens: 600,
      });

      // Remove emojis and symbols from response
      aiResponse = this.removeEmojis(aiResponse);

      // 7. Create response
      const responseMessage: IChatMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        showWhatsAppButton,
        metadata: {
          intent,
          productsCount: relatedProducts.length,
          usedWebSearch: needsWebSearch,
        },
      };

      // 8. Generate suggestions
      const suggestions = this.generateSuggestions(intent);

      return {
        message: responseMessage,
        suggestions,
        relatedProducts: relatedProducts.slice(0, 4),
        showWhatsAppButton,
      };
    } catch (error: any) {
      logger.error('Chatbot error:', error);

      // Fallback response
      return {
        message: {
          id: this.generateMessageId(),
          role: 'assistant',
          content: 'I apologize, but I\'m having trouble right now. Please WhatsApp us at +254791708894 for immediate assistance.',
          timestamp: new Date(),
        },
        showWhatsAppButton: true,
      };
    }
  }

  /**
   * Build comprehensive system prompt with all context
   */
  private buildSystemPrompt(
    productContext: string,
    categoryContext: string,
    webSearchContext: string,
    pageContext?: string,
    currentPage?: string
  ): string {
    let prompt = STRICT_SYSTEM_PROMPT;

    // Add current page context first for relevance
    if (pageContext && currentPage) {
      prompt += `\n\nCURRENT PAGE CONTEXT:\nThe user is currently on: ${pageContext} (${currentPage})\nProvide contextually relevant responses based on this page. If they ask "what page am I on" or "where am I", tell them clearly.`;
    }

    if (categoryContext) {
      prompt += `\n\nOUR PRODUCT CATEGORIES:\n${categoryContext}`;
    }

    if (productContext) {
      prompt += `\n\nAVAILABLE PRODUCTS (From our database):\n${productContext}`;
    }

    if (webSearchContext) {
      prompt += `\n\nGENERAL FURNITURE KNOWLEDGE (For reference only - NOT our store info):\n${webSearchContext}\n\nIMPORTANT: This web search is for general furniture knowledge only. DO NOT use it to quote prices or make claims about Tangerine Furniture.`;
    }

    return prompt;
  }

  /**
   * Perform web search for general furniture knowledge (OPTIONAL FEATURE)
   * Disabled by default - enable with ENABLE_WEB_SEARCH=true env variable
   */
  private async performWebSearch(query: string): Promise<string> {
    try {
      // Check if web search is enabled
      if (process.env.ENABLE_WEB_SEARCH !== 'true') {
        return '';
      }

      // Use OpenRouter API with web_search enabled models
      const openRouterKey = process.env.OPENROUTER_API_KEY;
      if (!openRouterKey) {
        logger.warn('Web search requested but OPENROUTER_API_KEY not configured');
        return '';
      }

      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'perplexity/llama-3.1-sonar-large-128k-online', // Model with web search
          messages: [
            {
              role: 'user',
              content: `Search the web for general information about: ${query}. Focus on furniture types, styles, and general knowledge. Keep it brief (2-3 sentences).`
            }
          ],
          max_tokens: 150,
        },
        {
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 5000, // 5 second timeout
        }
      );

      const searchResult = response.data.choices[0]?.message?.content || '';
      logger.info('✅ Web search completed successfully');
      return searchResult;
    } catch (error: any) {
      // Silently fail - web search is optional enhancement
      if (error.response?.status === 404) {
        logger.debug('Web search model not available (404) - continuing without web search');
      } else {
        logger.debug(`Web search unavailable: ${error.message} - continuing without it`);
      }
      return '';
    }
  }

  /**
   * Determine if web search should be used
   */
  private shouldUseWebSearch(intent: string, message: string): boolean {
    // Disable web search by default - it's optional and requires Perplexity API access
    // Enable only if ENABLE_WEB_SEARCH env variable is set to 'true'
    const webSearchEnabled = process.env.ENABLE_WEB_SEARCH === 'true';

    if (!webSearchEnabled) {
      return false;
    }

    const lowerMessage = message.toLowerCase();

    // Use web search for general furniture knowledge questions
    const webSearchIntents = ['comparison', 'recommendation', 'general_inquiry'];
    if (!webSearchIntents.includes(intent)) {
      return false;
    }

    // Don't use for business-specific questions
    const businessKeywords = ['price', 'cost', 'deliver', 'location', 'showroom', 'contact', 'buy'];
    const hasBusinessKeyword = businessKeywords.some(kw => lowerMessage.includes(kw));

    return !hasBusinessKeyword;
  }

  /**
   * Determine if question needs human assistance
   */
  private needsHumanAssistance(intent: string, message: string): boolean {
    const lowerMessage = message.toLowerCase();

    // Only show WhatsApp for genuine issues that need human help
    const humanNeededIntents = ['complaint'];
    if (humanNeededIntents.includes(intent)) {
      return true;
    }

    // Show for specific complex queries only
    const humanKeywords = ['custom', 'bulk', 'wholesale', 'negotiate', 'custom order', 'special request'];
    return humanKeywords.some(kw => lowerMessage.includes(kw));
  }

  /**
   * Get category context from database
   */
  private async getCategoryContext(): Promise<string> {
    try {
      const categories = await Category.find({ isActive: true })
        .select('name slug subcategories')
        .lean();

      return categories.map(cat => `- ${cat.name}`).join('\n');
    } catch (error) {
      return 'Living Room, Dining Sets, Beds, Hotel & Restaurants';
    }
  }

  /**
   * Detect user intent from message
   */
  private async detectIntent(message: string): Promise<string> {
    const lowerMessage = message.toLowerCase();

    // Intent patterns (ordered by specificity)
    const intents: Record<string, RegExp[]> = {
      greeting: [/^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening))/i],
      order_tracking: [/(track|tracking|status of.*order|where.*order|order.*status)/i],
      product_search: [/(looking for|need|want|searching|find me|show me)/i, /(sofa|bed|table|chair|furniture|dining|bedroom|living)/i],
      product_inquiry: [/(tell me about|details|specifications|spec|dimensions|size|material)/i],
      price_inquiry: [/(how much|what's the price|cost of|pricing for|price range)/i],
      delivery_inquiry: [/(deliver|shipping|delivery time|how long.*deliver|delivery cost|shipping cost)/i],
      availability: [/(available|in stock|do you have|got any|have you got)/i],
      comparison: [/(compare|difference|better|versus|vs|which is better)/i],
      recommendation: [/(recommend|suggest|best|top|popular|trending|featured)/i],
      payment_inquiry: [/(payment|pay|mpesa|card|cash|how to pay|payment method)/i],
      complaint: [/(problem|issue|complaint|not happy|disappointed|angry|frustrated)/i],
      thanks: [/(thank|thanks|appreciate|grateful)/i],
      goodbye: [/(bye|goodbye|see you|later|close chat)/i],
    };

    for (const [intent, patterns] of Object.entries(intents)) {
      for (const pattern of patterns) {
        if (pattern.test(lowerMessage)) {
          return intent;
        }
      }
    }

    return 'general_inquiry';
  }

  /**
   * Search for relevant products based on user message
   */
  private async searchRelevantProducts(message: string): Promise<any[]> {
    try {
      const lowerMessage = message.toLowerCase();

      // Check for "popular" or "trending" requests
      if (lowerMessage.includes('popular') || lowerMessage.includes('trending') ||
        lowerMessage.includes('best') || lowerMessage.includes('featured')) {
        // Return featured/popular products
        const products = await Product.find({ inStock: true })
          .sort({ rating: -1, reviewCount: -1, featured: -1 })
          .populate('category', 'name')
          .limit(6)
          .select('name slug price salePrice images rating reviewCount category featured')
          .lean();

        return products;
      }

      // Extract keywords for specific searches
      const keywords = this.extractKeywords(message);

      if (keywords.length === 0) {
        // If no keywords but it's a product query, return some featured products
        if (lowerMessage.includes('show') || lowerMessage.includes('products')) {
          const products = await Product.find({ inStock: true, featured: true })
            .populate('category', 'name')
            .limit(6)
            .select('name slug price salePrice images rating reviewCount category')
            .lean();
          return products;
        }
        return [];
      }

      // Search products by keywords
      const products = await Product.find({
        $or: [
          { name: { $regex: keywords.join('|'), $options: 'i' } },
          { description: { $regex: keywords.join('|'), $options: 'i' } },
          { tags: { $in: keywords } },
        ],
        inStock: true,
      })
        .populate('category', 'name')
        .limit(8)
        .select('name slug price salePrice images rating reviewCount category')
        .lean();

      return products;
    } catch (error) {
      logger.error('Product search error:', error);
      return [];
    }
  }

  /**
   * Extract keywords from message
   */
  private extractKeywords(message: string): string[] {
    const furnitureKeywords = [
      'sofa', 'couch', 'chair', 'table', 'bed', 'mattress', 'wardrobe',
      'dresser', 'cabinet', 'desk', 'bookshelf', 'dining', 'coffee table',
      'nightstand', 'armchair', 'recliner', 'ottoman', 'bench', 'stool',
      'sectional', 'loveseat', 'futon', 'sleeper', 'bunk bed', 'storage',
      'living room', 'bedroom', 'office', 'outdoor',
    ];

    const lowerMessage = message.toLowerCase();
    const keywords: string[] = [];

    for (const keyword of furnitureKeywords) {
      if (lowerMessage.includes(keyword)) {
        keywords.push(keyword);
      }
    }

    // Also extract category names
    const categoryKeywords = ['living', 'bedroom', 'dining', 'office', 'outdoor', 'storage'];
    for (const cat of categoryKeywords) {
      if (lowerMessage.includes(cat)) {
        keywords.push(cat);
      }
    }

    return [...new Set(keywords)]; // Remove duplicates
  }

  /**
   * Format product information for AI context
   */
  private formatProductContext(products: any[]): string {
    return products
      .map(
        (p: any, i: number) =>
          `${i + 1}. ${p.name} - KES ${p.salePrice || p.price} (Rating: ${p.rating}/5, ${p.reviewCount} reviews)`
      )
      .join('\n');
  }

  /**
   * Generate follow-up suggestions
   */
  private generateSuggestions(intent: string): string[] {
    const suggestionMap: Record<string, string[]> = {
      greeting: [
        'Show me popular products',
        'What furniture do you have?',
        'Do you deliver in Nairobi?',
      ],
      order_tracking: [
        'How do I view my orders?',
        'What payment methods do you accept?',
        'Tell me about delivery',
      ],
      product_search: [
        'Show me more sofas',
        'What about dining sets?',
        'Do you have bedroom furniture?',
      ],
      recommendation: [
        'Show me more popular items',
        'What is on sale?',
        'Best rated products',
      ],
      price_inquiry: [
        'Do you offer discounts?',
        'What payment methods do you accept?',
        'Is there free delivery?',
      ],
      delivery_inquiry: [
        'What areas do you deliver to?',
        'Is assembly included?',
        'What is the return policy?',
      ],
      payment_inquiry: [
        'Can I pay with M-Pesa?',
        'Do you accept cards?',
        'Is cash on delivery available?',
      ],
    };

    return suggestionMap[intent] || [
      'Show me popular products',
      'Tell me about delivery',
      'What payment methods work?',
    ];
  }

  /**
   * Remove markdown symbols but keep emojis
   */
  private removeEmojis(text: string): string {
    // Remove markdown symbols only, keep emojis
    return text
      .replace(/\*\*/g, '')   // Remove markdown bold (**)
      .replace(/^#{1,6}\s/gm, '') // Remove markdown headers (#, ##, etc.)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links [text](url) -> text
      .replace(/`([^`]+)`/g, '$1')  // Remove inline code backticks
      .replace(/```[^`]*```/g, '')  // Remove code blocks
      .replace(/_([^_]+)_/g, '$1')  // Remove italic underscores
      .replace(/~~([^~]+)~~/g, '$1') // Remove strikethrough
      .trim();
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get conversation summary
   */
  async getConversationSummary(messages: IChatMessage[]): Promise<string> {
    if (messages.length === 0) return 'New conversation';

    try {
      const response = await generateChatCompletion({
        messages: [
          {
            role: 'system',
            content: 'Summarize this customer service conversation in one sentence.',
          },
          {
            role: 'user',
            content: messages.map((m: any) => `${m.role}: ${m.content}`).join('\n'),
          },
        ],
        temperature: 0.3,
        maxTokens: 50,
      });

      return response.trim();
    } catch (error: any) {
      return 'Conversation summary unavailable';
    }
  }
}

export default new ChatbotService();

