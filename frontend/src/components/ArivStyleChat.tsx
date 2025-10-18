import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Loader } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import MiniOrb from './MiniOrb';
import GradualBlur from './GradualBlur';

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

  // Floating button when closed (Animated Orb - Bottom Center)
  if (!isOpen) {
    return (
      <div 
        className="fixed bottom-8 z-50 transition-all duration-700 ease-out"
        style={{ 
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
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
      {/* Gradual Blur Background - Animated from bottom */}
      {isOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
          {/* Green tint overlay with gradient opacity */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-green-400/25 via-green-400/12 to-transparent animate-in fade-in duration-500"
            style={{ height: '12rem' }}
          />
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
            <GradualBlur
              position="bottom"
              height="12rem"
              strength={5}
              divCount={6}
              curve="bezier"
              exponential={true}
              opacity={0.95}
              animated={true}
              duration="0.5s"
              easing="ease-out"
            />
          </div>
        </div>
      )}

      {/* Minimal Horizontal Chat Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 pb-6">
          <div className="flex items-center gap-4">
            {/* Animated Orb - Slides smoothly to left when active */}
            <div 
              className="flex-shrink-0 transition-all duration-700 ease-out"
            >
              <MiniOrb 
                onClick={() => setIsOpen(false)}
                hue={220}
                size={64}
              />
            </div>

            {/* Chat Input Bar - Slides and fades in */}
            <div 
              className={`flex-1 transition-all duration-700 ease-out ${
                isOpen 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-8 pointer-events-none'
              }`}
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-4">
                <div className="flex items-center gap-3">
                  {/* AI Icon - Pop in animation */}
                  <div 
                    className={`w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                      isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}
                    style={{ transitionDelay: isOpen ? '200ms' : '0ms' }}
                  >
                    <Bot className="w-5 h-5 text-white" />
                  </div>

                  {/* Last AI Response - Fade and slide up */}
                  <div 
                    className={`flex-1 max-h-16 overflow-y-auto transition-all duration-500 ${
                      isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                    style={{ transitionDelay: isOpen ? '300ms' : '0ms' }}
                  >
                    {messages.length > 0 && messages[messages.length - 1].type === 'ai' && !isPending ? (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {messages[messages.length - 1].content}
                      </p>
                    ) : isPending ? (
                      <div className="flex items-center gap-2">
                        <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                        <span className="text-sm text-gray-500">Thinking...</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Ask me anything about your farm...</p>
                    )}
                  </div>

                  {/* Input Field - Fade and slide up */}
                  <div 
                    className={`flex items-center gap-2 flex-shrink-0 transition-all duration-500 ${
                      isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                    style={{ transitionDelay: isOpen ? '400ms' : '0ms' }}
                  >
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your question..."
                      disabled={isPending}
                      className="w-64"
                    />
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

                  {/* Powered by AI badge - Scale and fade in */}
                  <div 
                    className={`flex items-center gap-1 text-gray-400 flex-shrink-0 transition-all duration-500 ${
                      isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}
                    style={{ transitionDelay: isOpen ? '500ms' : '0ms' }}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span className="text-xs">AI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArivStyleChat;
