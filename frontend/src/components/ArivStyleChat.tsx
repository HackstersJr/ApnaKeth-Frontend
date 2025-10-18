import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Sparkles, Loader } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import MiniOrb from './MiniOrb';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

// ApnaKeth-specific route mappings for agriculture context
const ROUTE_ALIASES: Record<string, string> = {
  // Land management
  'land': '/lands',
  'lands': '/lands',
  'my lands': '/lands',
  'खेत': '/lands',
  'मेरी जमीन': '/lands',
  
  // Map and visualization
  'map': '/',
  'नक्शा': '/',
  'view map': '/',
  
  // Land details
  'land details': '/land-details',
  'crop details': '/land-details',
  'फसल': '/land-details',
  
  // Home/Dashboard
  'home': '/',
  'dashboard': '/',
  'होम': '/',
};

// Form descriptions for ApnaKeth agriculture forms
const FORM_DESCRIPTIONS: Record<string, string> = {
  '/': 'Map view - select your farm location',
  '/lands': 'View and manage all your land plots',
  '/land-details': 'Enter detailed information about crops, irrigation, and fertilizers',
};

// Helper to parse bot response text
function parseBotResponse(data: any): string {
  if (typeof data === 'string') return data;
  if (data.text) return data.text;
  if (data.output) return data.output;
  if (data.result) return data.result;
  if (data.response) return data.response;
  if (data.message) return data.message;
  if (data.body && typeof data.body === 'string') return data.body;
  if (data.data && typeof data.data === 'string') return data.data;
  
  try { return JSON.stringify(data); } catch { return ''; }
}

const ArivStyleChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'नमस्ते! 🌾 मैं आपका स्मार्ट कृषि सहायक हूँ।\n\nI can help you with:\n• View your land plots\n• Monitor crop health (NDVI)\n• Weather and climate data\n• Soil analysis\n• Irrigation planning\n• Fertilizer recommendations\n\nHow can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.pipfactor.com/webhook/apnaketh';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect current page type for context
  const detectPageType = (): string => {
    const path = window.location.pathname;
    return FORM_DESCRIPTIONS[path] || 'general page';
  };

  // Parse commands from AI response
  const parseCommands = (text: string): any[] => {
    const commands: any[] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Navigation command
      if (trimmed.toLowerCase().startsWith('[navigate:')) {
        const match = trimmed.match(/\[navigate:\s*(.+?)\]/i);
        if (match) {
          commands.push({ type: 'navigate', route: match[1].trim() });
        }
      }
      
      // Info message
      if (trimmed.toLowerCase().startsWith('[info:')) {
        const match = trimmed.match(/\[info:\s*(.+?)\]/i);
        if (match) {
          commands.push({ type: 'info', message: match[1].trim() });
        }
      }
    }
    
    return commands;
  };

  // Execute commands from AI
  const executeCommands = (commands: any[]) => {
    commands.forEach((cmd) => {
      if (cmd.type === 'navigate' && cmd.route) {
        const targetRoute = ROUTE_ALIASES[cmd.route.toLowerCase()] || cmd.route;
        console.log(`🧭 Navigating to: ${targetRoute}`);
        // Note: In actual implementation, use react-router's navigate
        // navigate(targetRoute);
        window.location.href = targetRoute; // Fallback for this prototype
      }
      
      if (cmd.type === 'info') {
        console.log(`ℹ️ Info: ${cmd.message}`);
      }
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isPending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const originalMessage = inputMessage;
    setInputMessage('');
    setIsPending(true);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      // Send to N8N webhook with session context
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: originalMessage,
          sessionId: sessionId,
          timestamp: new Date().toISOString(),
          context: {
            page: detectPageType(),
            userType: 'farmer',
            app: 'apnaketh',
          },
        }),
      });

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== 'typing'));

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const responseText = parseBotResponse(data);
      
      // Parse and execute any commands in the response
      const commands = parseCommands(responseText);
      if (commands.length > 0) {
        executeCommands(commands);
      }
      
      // Clean response text (remove command tags)
      const cleanText = responseText
        .replace(/\[navigate:.+?\]/gi, '')
        .replace(/\[info:.+?\]/gi, '')
        .trim();

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: cleanText || 'मुझे आपका सवाल समझने में समस्या हो रही है। कृपया फिर से पूछें।',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      // Remove typing indicator on error
      setMessages((prev) => prev.filter((msg) => msg.id !== 'typing'));
      
      console.error('❌ Chat error:', error);

      // Fallback to local API
      try {
        const fallbackResponse = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: originalMessage,
            serviceType: 'agriculture',
            context: detectPageType(),
          }),
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const fallbackText =
            parseBotResponse(fallbackData.data) ||
            'मुझे आपकी मदद करने में समस्या हो रही है। कृपया फिर से कोशिश करें।';

          const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: fallbackText,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiResponse]);
          return;
        }
      } catch (fallbackError) {
        console.error('❌ Fallback API error:', fallbackError);
      }

      // Final error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'क्षमा करें, मुझे तकनीकी समस्या हो रही है। थोड़ी देर में फिर कोशिश करें। 🙏',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsPending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Floating button when closed (Animated Orb)
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <MiniOrb 
          onClick={() => setIsOpen(true)}
          hue={220}
          size={64}
        />
      </div>
    );
  }

  return (
    <>
      {/* Backdrop blur (EXACT SIH ERP Style) */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Chat Container (EXACT SIH ERP Style) */}
      <div
        ref={chatContainerRef}
        className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold">कृषि सहायक</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.isTyping ? (
                // Typing Indicator
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                    </div>
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                // Regular Message
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-100'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && (
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-1.5 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="अपना सवाल यहाँ लिखें... (Type in Hindi/English)"
                disabled={isPending}
                className="w-full"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isPending}
              variant="primary"
              size="md"
              className="h-10"
            >
              {isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="mt-2 flex items-center justify-center space-x-1 text-gray-500">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span className="text-xs">Powered by AI for Smart Agriculture</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArivStyleChat;
