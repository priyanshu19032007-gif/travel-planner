import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Compass,
  Bot,
  User,
  HelpCircle,
} from 'lucide-react';

interface ConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  tripSummary: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ConciergeModal: React.FC<ConciergeModalProps> = ({
  isOpen,
  onClose,
  destination,
  tripSummary,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am your personal concierge for ${destination}. Feel free to ask about neighborhood safety, train routes, restaurant dress codes, or secret photo spots!`,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query || isAsking) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInputValue('');
    setIsAsking(true);

    try {
      const res = await fetch('/api/itinerary/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          destination,
          contextSummary: tripSummary,
        }),
      });

      const data = await res.json();
      if (data.answer) {
        setMessages([...newMessages, { role: 'assistant', content: data.answer }]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: "I'm sorry, I couldn't reach the concierge service right now. Please try again!",
          },
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Network connection issue. Please verify your connection and try again.',
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const QUICK_QUESTIONS = [
    'What should I wear to religious or temple sites?',
    'What is the best way to get from the airport to the city center?',
    'Can you recommend a late-night street food spot?',
    'Is water safe to drink directly from the tap here?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-xl w-full h-[600px] shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {destination} AI Concierge
              </h3>
              <p className="text-[11px] text-stone-400">
                Instant real-time answers for your custom itinerary
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-none'
                    : 'bg-white text-stone-800 border border-stone-200 shadow-sm rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-stone-700 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isAsking && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-stone-200 shadow-sm text-xs text-stone-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Consulting local intelligence...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="p-3 bg-white border-t border-stone-100 flex flex-wrap gap-1.5 text-[11px]">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputValue(q)}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors border border-stone-200/60 text-left"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Footer */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about trains, dress codes, tipping, dishes..."
            className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isAsking}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 rounded-xl transition-all font-bold flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
