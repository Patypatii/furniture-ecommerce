'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Loader2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useChatbot } from '@/lib/hooks/useChatbot';
import { cn } from '@/lib/utils';
import { useChatbotContext } from '@/contexts/ChatbotContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatBot() {
  const pathname = usePathname();
  const { isChatbotOpen, setIsChatbotOpen } = useChatbotContext();
  const [input, setInput] = useState('');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousLoadingRef = useRef<boolean>(false);

  // Use local state synced with context
  const isOpen = isChatbotOpen;
  const setIsOpen = setIsChatbotOpen;

  // Load sound preference from localStorage
  useEffect(() => {
    const soundPref = localStorage.getItem('chatbot-sound-enabled');
    if (soundPref !== null) {
      setIsSoundEnabled(soundPref === 'true');
    }
  }, []);

  const {
    messages,
    isLoading,
    suggestions,
    sendMessage,
  } = useChatbot(pathname);

  // Initialize notification sound
  useEffect(() => {
    // Create a simple notification sound using Web Audio API
    const createNotificationSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frequency in Hz
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play notification sound when AI completes response
  useEffect(() => {
    if (isSoundEnabled && previousLoadingRef.current === true && isLoading === false && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        try {
          // Create notification sound
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

          // First beep
          const oscillator1 = audioContext.createOscillator();
          const gainNode1 = audioContext.createGain();
          oscillator1.connect(gainNode1);
          gainNode1.connect(audioContext.destination);
          oscillator1.frequency.value = 800;
          oscillator1.type = 'sine';
          gainNode1.gain.setValueAtTime(0.15, audioContext.currentTime);
          gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
          oscillator1.start(audioContext.currentTime);
          oscillator1.stop(audioContext.currentTime + 0.15);

          // Second beep (higher pitch)
          const oscillator2 = audioContext.createOscillator();
          const gainNode2 = audioContext.createGain();
          oscillator2.connect(gainNode2);
          gainNode2.connect(audioContext.destination);
          oscillator2.frequency.value = 1000;
          oscillator2.type = 'sine';
          gainNode2.gain.setValueAtTime(0.15, audioContext.currentTime + 0.15);
          gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator2.start(audioContext.currentTime + 0.15);
          oscillator2.stop(audioContext.currentTime + 0.3);
        } catch (error) {
          console.log('Notification sound not supported:', error);
        }
      }
    }
    previousLoadingRef.current = isLoading;
  }, [isLoading, messages, isSoundEnabled]);

  const toggleSound = () => {
    const newValue = !isSoundEnabled;
    setIsSoundEnabled(newValue);
    localStorage.setItem('chatbot-sound-enabled', String(newValue));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    await sendMessage(userMessage);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setInput(suggestion);
    await sendMessage(suggestion);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-24 right-6 z-40',
          'w-16 h-16 rounded-full',
          'bg-gradient-to-br from-primary-500 to-primary-600',
          'text-white shadow-2xl',
          'flex items-center justify-center',
          'hover:shadow-primary-500/50 transition-all',
          isOpen && 'hidden'
        )}
      >
        <Bot className="w-7 h-7" />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-40 w-[400px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]"
          >
            <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-border overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Sparkles className="w-6 h-6" />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Assistant</h3>
                    <p className="text-xs opacity-90">Ask me anything about furniture!</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSound}
                    className="p-1.5 hover:bg-white/20 rounded-full transition"
                    title={isSoundEnabled ? 'Mute notifications' : 'Enable notifications'}
                  >
                    {isSoundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded-full transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground mt-8">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary-500" />
                    <p className="text-sm">Hi! I'm your AI furniture assistant.</p>
                    <p className="text-sm">
                      {pathname === '/' ? "Welcome to Tangerine Furniture! How can I help you today?" :
                        pathname.includes('/products/') ? "I can help you learn more about this product!" :
                          pathname === '/products' ? "Looking for something specific? I can help you find the perfect furniture!" :
                            pathname === '/cart' ? "Need help with your cart or have questions about checkout?" :
                              pathname === '/checkout' ? "I'm here to help with your order!" :
                                pathname.includes('/account') ? "Need help with your account?" :
                                  "How can I help you today?"}
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'flex',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-2',
                          message.role === 'user'
                            ? 'bg-primary-500 text-white rounded-br-sm'
                            : 'bg-secondary text-secondary-foreground rounded-bl-sm'
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                        {/* WhatsApp Button for complex questions */}
                        {message.role === 'assistant' && message.showWhatsAppButton && (
                          <motion.a
                            href={`https://wa.me/254791708894?text=${encodeURIComponent('Hi, I need assistance with: ' + messages.find(m => m.timestamp < message.timestamp && m.role === 'user')?.content || 'furniture inquiry')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-2 mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-xs font-semibold transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Chat on WhatsApp
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && !isLoading && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-full transition"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-border bg-background">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background"
                    disabled={isLoading}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={cn(
                      'p-2 rounded-full transition',
                      input.trim() && !isLoading
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-secondary text-muted-foreground cursor-not-allowed'
                    )}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

