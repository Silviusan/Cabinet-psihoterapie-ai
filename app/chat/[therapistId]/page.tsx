"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTherapist } from "@/lib/therapists";
import { ArrowLeft, Send, AlertCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const therapistId = params.therapistId as string;
  const therapist = getTherapist(therapistId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!therapist) {
      router.push("/");
      return;
    }
    // Welcome message
    setMessages([
      {
        role: "assistant",
        content: `Bun venit! Sunt ${therapist.name}, ${therapist.title}. ${getWelcomeMessage(therapistId)}\n\n*Notă: Sunt un asistent AI și nu înlocuiesc un psihoterapeut uman licențiat. Dacă ai o urgență, contactează 112.*`,
      },
    ]);
  }, [therapistId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  if (!therapist) return null;

  async function sendMessage() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setStreamingText("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          therapistId,
        }),
      });

      if (!res.ok) throw new Error("Eroare la server");
      if (!res.body) throw new Error("Fără răspuns");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamingText(fullText);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fullText },
      ]);
      setStreamingText("");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Îmi pare rău, a apărut o eroare. Te rog să verifici conexiunea și să încerci din nou.",
        },
      ]);
      setStreamingText("");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const allMessages = streamingText
    ? [...messages, { role: "assistant" as const, content: streamingText }]
    : messages;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-violet-50 to-emerald-50">
      {/* Header */}
      <header
        className="flex items-center gap-4 px-4 py-3 border-b border-white/60 bg-white/80 backdrop-blur-sm shadow-sm"
        style={{ borderBottomColor: therapist.color + "30" }}
      >
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: therapist.color + "20" }}
        >
          {therapist.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-gray-800 text-sm md:text-base truncate">
            {therapist.name}
          </h1>
          <p
            className="text-xs font-medium truncate"
            style={{ color: therapist.color }}
          >
            {therapist.school}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1">
          <AlertCircle className="w-3 h-3" />
          <span>Asistent AI, nu terapie reală</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 chat-container">
        {allMessages.map((msg, i) => (
          <div
            key={i}
            className={`message-bubble flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1"
                style={{ backgroundColor: therapist.color + "20" }}
              >
                {therapist.emoji}
              </div>
            )}

            <div
              className={`max-w-[80%] md:max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-violet-600 text-white rounded-br-sm"
                  : "bg-white/90 text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
              }`}
            >
              {msg.content.split("\n").map((line, j) => (
                <span key={j}>
                  {line}
                  {j < msg.content.split("\n").length - 1 && <br />}
                </span>
              ))}
              {i === allMessages.length - 1 &&
                isLoading &&
                msg.role === "assistant" && (
                  <span className="inline-block w-1 h-4 ml-1 bg-gray-400 animate-pulse rounded" />
                )}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-sm flex-shrink-0 ml-2 mt-1">
                👤
              </div>
            )}
          </div>
        ))}

        {isLoading && !streamingText && (
          <div className="flex justify-start">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mr-2"
              style={{ backgroundColor: therapist.color + "20" }}
            >
              {therapist.emoji}
            </div>
            <div className="bg-white/90 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
              <div
                className="typing-indicator flex gap-1"
                style={{ color: therapist.color }}
              >
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-white/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Scrie-i lui ${therapist.name}...`}
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all max-h-32 shadow-sm"
            style={
              { "--tw-ring-color": therapist.color + "60" } as React.CSSProperties
            }
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 128) + "px";
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-medium transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 flex-shrink-0"
            style={{ backgroundColor: therapist.color }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Enter pentru trimitere • Shift+Enter pentru linie nouă
        </p>
      </div>
    </div>
  );
}

function getWelcomeMessage(id: string): string {
  const messages: Record<string, string> = {
    jungian:
      "Mă bucur să te întâlnesc în acest spațiu de explorare a lumii interioare. Împreună putem descoperi simbolurile, visele și arhetipurile care modelează experiența ta de viață.",
    cbt: "Sunt bucuroasă să lucrăm împreună pentru a înțelege tiparele de gândire și comportament care îți influențează bunăstarea. Care este principala preocupare cu care vrei să începem astăzi?",
    integrative:
      "Sunt aici pentru tine, cu o abordare deschisă și adaptată nevoilor tale unice. Nu există o singură cale - vom găsi împreună ce funcționează cel mai bine pentru tine.",
    gestalt:
      "Sunt prezentă cu tine, în momentul acesta. Gestalt-ul lucrează în 'aici și acum' - ce este viu în tine chiar în acest moment?",
    experiential:
      "Mă bucur că ești aici. Vom lucra cu înțelepciunea emoțiilor tale și cu ceea ce simți în corp. Nu trebuie să știi dinainte ce vrei să explorezi.",
  };
  return messages[id] || "Bine ai venit!";
}
