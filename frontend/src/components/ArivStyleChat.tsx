import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageCircle, X } from 'lucide-react';
import Button from './Button';
import Input from './Input';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

// Helper to extract bot response text
function parseBotResponse(data: any): string {
  if (typeof data === 'string') return data;
  if (data.text) return data.text;
  if (data.output) return data.output;
  if (data.result) return data.result;
  if (data.response) return data.response;
  if (data.message) return data.message;
  if (data.body && typeof data.body === 'string') return data.body;
  if (data.data && typeof data.data === 'string') return data.data;
  
  try { return JSON.stringify(data); } catch { return '';}
}

const ArivStyleChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'नमस्ते! मैं आपका खेती सहायक हूँ। 🌾\n\nMain aapke khet ke baare mein help kar sakta hoon:\n\n• Fasal ki sehat\n• Mausam ki jankari\n• Mitti ka analysis\n• Pani aur sinchai\n• Keede-makode\n\nKaise madad karoon?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.pipfactor.com/webhook/apnaketh';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const originalMessage = inputMessage;
    setInputMessage('');

    try {
      setIsPending(true);
      
      // Send to N8N webhook for ApnaKeth
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: originalMessage,
          timestamp: new Date().toISOString(),
          sender: 'apnaketh-farmer',
          context: 'agriculture'
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }

      const data = await response.json();
      const responseText = parseBotResponse(data);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: responseText || 'मुझे आपका सवाल समझने में समस्या हो रही है। कृपया फिर से पूछें।',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Fallback to local backend API
      try {
        const fallbackResponse = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            query: originalMessage,
            serviceType: 'crop_analysis'
          }),
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const fallbackText = parseBotResponse(fallbackData.data) || 
            "मुझे आपकी मदद करने में समस्या हो रही है। कृपया फिर से कोशिश करें।";
          
          const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: fallbackText,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
          return;
        }
      } catch (fallbackError) {
        console.error('❌ Fallback API error:', fallbackError);
      }

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'क्षमा करें, मुझे तकनीकी समस्या हो रही है। थोड़ी देर में फिर कोशिश करें। 🙏',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
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

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        style={{ zIndex: 9999 }}
      >
        <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
      style={{ 
        height: '32rem',
        zIndex: 9999,
      }}
    >
      {/* Header - Ariv Style */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">खेती सहायक</h3>
            <p className="text-xs text-blue-100">AI Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Container - Ariv Style */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
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
                <div className="flex-1">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1.5 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
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
          </div>
        ))}
        
        {/* Typing Indicator - Ariv Style */}
        {isPending && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Ariv Style */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="अपना सवाल यहाँ लिखें..."
            className="flex-1 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isPending}
            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2 flex items-center justify-center space-x-1">
          <Sparkles className="w-3 h-3 text-blue-600" />
          <span className="text-xs text-gray-500">Powered by AI</span>
        </div>
      </div>
    </div>
  );
};

export default ArivStyleChat;
