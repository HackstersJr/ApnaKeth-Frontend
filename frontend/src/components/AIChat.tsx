import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Mic, Volume2, Sprout } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import ScrollArea from "./ScrollArea";
import Orb from "./Orb";
import { speechToText } from "../utils/speechToText";

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

// Helper: convert camelCase keys to snake_case recursively
function camelToSnake(str: string) {
  return str.replace(/([A-Z])/g, (_, c) => `_${c.toLowerCase()}`);
}

function deepSnakeCase(obj: any): any {
  if (Array.isArray(obj)) return obj.map(deepSnakeCase);
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, val]) => {
      const snakeKey = camelToSnake(key);
      acc[snakeKey] = deepSnakeCase(val);
      return acc;
    }, {} as any);
  }
  return obj;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "नमस्ते! मैं आपका खेती सहायक हूँ। 🌾\n\nMain aapke khet ke baare mein sawal ka jawab de sakta hoon:\n\n• Fasal ki sehat\n• Mausam ki jankari\n• Mitti ka haal\n• Pani ki zarurat\n• Keede-makode ki samsya\n\nKya madad chahiye?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTTS, setIsTTS] = useState(false);
  const inputValueRef = useRef("");
  const isOpenRef = useRef(isOpen);
  const nextIdRef = useRef(1);

  // TODO: Replace with your N8N webhook URL from .env
  const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.pipfactor.com/webhook/apnaketh';
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAWz4pZRDx5OJbFDsQqK1-s8dTjTfXcOig';

  useEffect(() => {
    console.log('🌾 ApnaKeth AI Chat mounted');
  }, []);

  useEffect(() => {
    speechToText.setLanguage('hi-IN'); // Default to Hindi for farmers
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  useEffect(() => { inputValueRef.current = inputValue; }, [inputValue]);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  // Google Gemini TTS for voice responses
  const speakText = async (text: string) => {
    console.log('⏳ Gemini TTS request');
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        model: "gemini-2.0-flash-exp",
        contents: [{ parts: [{ text }] }],
        config: {
          response_modalities: ['AUDIO'],
          speech_config: {
            voice_config: {
              prebuilt_voice_config: { voice_name: 'Kore' },
            },
          },
        },
      };
      const snakePayload = deepSnakeCase(payload);
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snakePayload),
      });

      if (!res.ok) throw new Error(`Gemini TTS HTTP ${res.status}`);
      
      const responseJson = await res.json();
      const part = responseJson.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
      const inline = part?.inlineData;
      const audioData = inline?.data;
      const mimeType = inline?.mimeType || 'audio/mp3';
      
      if (!audioData) {
        // Fallback to browser TTS
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.onend = () => {
          if (isTTS && isOpenRef.current) handleMicClick();
        };
        speechSynthesis.speak(utterance);
        return;
      }

      const audioBuffer = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
      const blob = new Blob([audioBuffer], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const audio = new Audio(url);
      audio.play().then(() => {
        audio.onended = () => {
          URL.revokeObjectURL(url);
          if (isTTS && isOpenRef.current) handleMicClick();
        };
      }).catch(() => {
        URL.revokeObjectURL(url);
        // Fallback
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        speechSynthesis.speak(utterance);
      });
    } catch (err) {
      console.error('❌ Gemini TTS error:', err);
      // Fallback
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (overrideValue?: string) => {
    const valueToSend = overrideValue !== undefined ? overrideValue : inputValueRef.current;
    if (!valueToSend.trim()) return;

    const userMessage: Message = {
      id: nextIdRef.current++,
      text: valueToSend,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    try {
      console.log('📤 Sending to N8N webhook:', valueToSend);

      // TODO: Update this URL with your N8N webhook for ApnaKeth
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: valueToSend,
          timestamp: new Date().toISOString(),
          sender: 'apnaketh-farmer',
          context: 'agriculture' // Important: tells AI this is farming context
        }),
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }

      const data = await response.json();
      const text = parseBotResponse(data);

      const aiResponse: Message = {
        id: nextIdRef.current++,
        text,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      if (isTTS) speakText(text);

    } catch (error) {
      console.error('❌ N8N webhook failed:', error);
      
      // Fallback to local backend API
      try {
        const fallbackResponse = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            query: valueToSend,
            serviceType: 'crop_analysis'
          }),
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const fallbackText = parseBotResponse(fallbackData.data) || 
            "मुझे आपकी मदद करने में समस्या हो रही है। कृपया फिर से कोशिश करें।";
          
          const aiResponse: Message = {
            id: nextIdRef.current++,
            text: fallbackText,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
          if (isTTS) speakText(fallbackText);
          return;
        }
      } catch (fallbackError) {
        console.error('❌ Fallback API error:', fallbackError);
      }

      // Final error message
      const errorMessage: Message = {
        id: nextIdRef.current++,
        text: "क्षमा करें, मुझे तकनीकी समस्या हो रही है। थोड़ी देर में फिर कोशिश करें। 🙏",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleMicClick = () => {
    if (!speechToText.isSupported()) {
      alert('आपका ब्राउज़र आवाज़ पहचान नहीं करता। Chrome या Safari इस्तेमाल करें।');
      return;
    }

    if (isListening) {
      speechToText.stop();
      setIsListening(false);
      setIsRecording(false);
      setCurrentTranscript("");
    } else {
      setIsRecording(true);
      setCurrentTranscript("");
      speechToText.start(
        (transcript: string) => {
          setInputValue(transcript);
          setCurrentTranscript("");
          setIsListening(false);
          setIsRecording(false);
          handleSendMessage(transcript);
        },
        (listening: boolean) => {
          setIsListening(listening);
          if (!listening) {
            setIsRecording(false);
            setCurrentTranscript("");
          }
        },
        (interimTranscript: string) => {
          setCurrentTranscript(interimTranscript);
        }
      );
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 h-14 w-14 md:h-16 md:w-16 rounded-full shadow-2xl"
        size="icon"
        style={{
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          zIndex: 999999,
          animation: 'pulse-slow 3s infinite'
        }}
      >
        <Sprout className="h-7 w-7 md:h-8 md:w-8 text-white" />
      </Button>
    );
  }

  return (
    <div 
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[calc(100vw-2rem)] max-w-md md:w-96 h-[75vh] md:h-[520px] rounded-2xl flex flex-col overflow-hidden shadow-2xl" 
      style={{ 
        zIndex: 999999,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '2px solid rgba(34, 197, 94, 0.3)'
      }}
    >
      {/* ORB - Centered */}
      <div 
        className={`absolute pointer-events-none transition-opacity duration-500 ${
          isListening ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          width: '200px',
          height: '200px',
        }}
      >
        <Orb
          hoverIntensity={isListening ? 0.9 : 0.5}
          rotateOnHover={true}
          hue={140} // Green for agriculture
          forceHoverState={isListening}
        />
      </div>

      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-2xl"
      >
        <div className="flex items-center gap-2">
          <Sprout className="h-5 w-5" />
          <span className="text-base font-semibold">खेती सहायक</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 rounded-lg h-8 w-8"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea 
        className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-green-50 to-white"
        style={{ position: 'relative', zIndex: 5 }}
      >
        <div 
          className={`flex flex-col space-y-3 transition-all duration-300 ${
            isListening ? 'opacity-20' : 'opacity-100'
          }`}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-xl ${
                message.sender === 'user' 
                  ? 'ml-8 bg-green-500 text-white self-end' 
                  : 'mr-8 bg-white border-2 border-green-200 text-gray-800'
              }`}
              style={{
                boxShadow: message.sender === 'ai' 
                  ? '0 2px 8px rgba(34, 197, 94, 0.1)' 
                  : 'none'
              }}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.text}
              </p>
              <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>

        {/* Listening State */}
        {isListening && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="text-green-700 text-xl font-bold mb-2 animate-pulse">
              बोलें... 🎤
            </div>
            <div className="text-green-600 text-sm text-center px-4">
              अपना सवाल साफ़-साफ़ बोलें
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-3 bg-white border-t-2 border-green-200">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder={isListening ? "सुन रहा हूँ..." : "अपना सवाल लिखें या बोलें..."}
              value={isListening && currentTranscript ? currentTranscript : inputValue}
              onChange={(e) => {
                if (!isListening) {
                  setInputValue(e.target.value);
                  if (typingTimeout) clearTimeout(typingTimeout);
                  setIsTyping(true);
                  const timeout = setTimeout(() => setIsTyping(false), 2000);
                  setTypingTimeout(timeout);
                }
              }}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="w-full border-2 border-green-300 focus:border-green-500 rounded-xl pr-10 text-sm"
              readOnly={isListening}
            />
            <Button
              onClick={handleMicClick}
              size="icon"
              className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-lg ${
                isListening || isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                  : 'bg-green-100 hover:bg-green-200 text-green-700'
              }`}
            >
              <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
          
          <Button
            onClick={() => handleSendMessage()}
            size="icon"
            className="h-10 w-10 bg-green-600 hover:bg-green-700 text-white rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => setIsTTS(prev => !prev)}
            size="icon"
            className={`h-10 w-10 rounded-xl ${
              isTTS 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title="आवाज़ में जवाब (On/Off)"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Helper text */}
        <div className="mt-2 text-xs text-center text-gray-500">
          🎤 Mic = बोलें | 📝 Type = लिखें | 🔊 = आवाज़ में सुनें
        </div>
      </div>
    </div>
  );
}
