import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { VERIFIED_BUSINESS_INFO, CHATBOT_SYSTEM_PROMPT, FALLBACK_RESPONSES, SUGGESTED_QUESTIONS } from '../chatbot-knowledge';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  showWhatsAppButton?: boolean;
}

// Helper function to get page context
function getPageContext(pathname: string): string {
  if (pathname === '/') return 'Home Page';
  if (pathname === '/products') return 'Products Listing Page';
  if (pathname.startsWith('/products/')) return 'Product Detail Page';
  if (pathname === '/cart') return 'Shopping Cart Page';
  if (pathname === '/checkout') return 'Checkout Page';
  if (pathname.includes('/account')) return 'User Account Page';
  if (pathname.includes('/category/')) return 'Category Page';
  if (pathname === '/furniture-in-nairobi-kenya') return 'About Us Page';
  if (pathname === '/contact-us' || pathname === '/contact') return 'Contact Page';
  return 'Website';
}

// Helper function to get page-specific suggestions
function getPageSuggestions(pathname: string): string[] {
  if (pathname === '/') {
    return ['What furniture do you have?', 'Tell me about your sofas', 'Do you deliver?', 'What are your prices?'];
  }
  if (pathname === '/products' || pathname.includes('/category/')) {
    return ['Show me popular items', 'What\'s on sale?', 'Tell me about materials', 'Do you offer warranties?'];
  }
  if (pathname.startsWith('/products/')) {
    return ['What are the dimensions?', 'What colors are available?', 'Tell me about delivery', 'Is this in stock?'];
  }
  if (pathname === '/cart') {
    return ['How do I checkout?', 'What payment methods do you accept?', 'What about delivery times?', 'Can I get a discount?'];
  }
  if (pathname === '/checkout') {
    return ['What payment methods work?', 'How long is delivery?', 'Can I track my order?', 'What\'s your return policy?'];
  }
  return SUGGESTED_QUESTIONS;
}

export function useChatbot(pathname: string = '/') {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(getPageSuggestions(pathname));
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);

  // Update suggestions when page changes
  useEffect(() => {
    if (messages.length === 0) {
      setSuggestions(getPageSuggestions(pathname));
    }
  }, [pathname, messages.length]);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setSuggestions([]);

    try {
      // Get page context to send to backend
      const pageContext = getPageContext(pathname);

      // Always call backend API - no local responses
      const response = await axios.post(`${API_URL}/chatbot/message`, {
        message: content,
        sessionId,
        conversationHistory: messages.slice(-10),
        pageContext, // Include current page context
        currentPage: pathname, // Include current URL path
      });

      const { message: aiMessage, suggestions: newSuggestions, showWhatsAppButton } = response.data.data;

      // Add AI response
      setMessages(prev => [...prev, {
        id: aiMessage.id,
        role: 'assistant',
        content: aiMessage.content,
        timestamp: new Date(aiMessage.timestamp),
        showWhatsAppButton: aiMessage.showWhatsAppButton || showWhatsAppButton,
      }]);

      if (newSuggestions && newSuggestions.length > 0) {
        setSuggestions(newSuggestions);
      }
    } catch (error) {
      console.error('Chatbot error:', error);

      // Add error message with WhatsApp button
      setMessages(prev => [...prev, {
        id: `msg_error_${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble right now. Please contact us directly at +254791708894 for immediate assistance.',
        timestamp: new Date(),
        showWhatsAppButton: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, sessionId, pathname]);


  const clearMessages = useCallback(() => {
    setMessages([]);
    setSuggestions(SUGGESTED_QUESTIONS);
  }, []);

  return {
    messages,
    isLoading,
    suggestions,
    sendMessage,
    clearMessages,
  };
}

