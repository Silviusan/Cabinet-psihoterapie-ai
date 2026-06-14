'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Therapist, Message } from '@/lib/therapists';
import MessageBubble from './MessageBubble';

interface Props {
  therapist: Therapist;
}

export default function ChatInterface({ therapist }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Bun venit! Sunt ${therapist.name}, ${therapist.title}. Sunt aici să vă ascult și să vă însoțesc în explorarea lumii interioare.\n\n*Notă: Sunt un asistent AI și nu înlocuiesc un psihoterapeut uman licențiat. Dacă aveți o urgență, contactați 112.*`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Add empty assistant message for streaming
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, therapistId: therapist.id }),
      });

      if (!res.ok) throw new Error('Eroare la server');
      if (!res.body) throw new Error('Fără răspuns');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        // Update the last assistant message in real-time
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: fullText };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Îmi pare rău, a apărut o eroare. Te rog să verifici conexiunea și să încerci din nou.',
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const lastMessage = messages[messages.length - 1];
  const showLoadingDots =
    isLoading && lastMessage?.role === 'assistant' && lastMessage?.content === '';

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-violet-50 to-emerald-50">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-3 border-b border-white/60 bg-white/80 backdrop-blur-sm shadow-sm">
        <Link
          href="/"
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
        >
          ← Înapoi
        </Link>

        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: therapist.color + '20' }}
        >
          {therapist.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-gray-800 text-sm md:text-base truncate">
            {therapist.name}
          </h1>
          <p className="text-xs font-medium truncate" style={{ color: therapist.color }}>
            {therapist.title}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1">
          ⚠️ Asistent AI, nu terapie reală
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 chat-container">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            therapistName={therapist.name}
            therapistIcon={therapist.emoji}
          />
        ))}

        {/* Loading dots */}
        {showLoadingDots && (
          <div className="flex justify-start mb-4">
            <div className="mr-2 flex-shrink-0 w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
              {therapist.emoji}
            </div>
            <div className="bg-white shadow rounded-tr-2xl rounded-br-2xl rounded-tl-sm px-4 py-3 border border-gray-100">
              <div className="typing-indicator flex gap-1" style={{ color: therapist.color }}>
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-white/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Scrie-i lui ${therapist.name}...`}
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all max-h-32 shadow-sm"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 128) + 'px';
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-medium transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 flex-shrink-0"
            style={{ backgroundColor: therapist.color }}
          >
            →
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Enter pentru trimitere • Shift+Enter pentru linie nouă
        </p>
        {/* Disclaimer footer */}
        <p className="text-center text-xs text-gray-400 mt-1">
          Acest asistent AI nu înlocuiește terapia profesională. În situații de urgență sunați la <strong>112</strong>.
        </p>
      </div>
    </div>
  );
}
