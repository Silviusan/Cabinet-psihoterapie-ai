'use client'

import { useState, useRef, useEffect } from 'react'
import { Therapist } from '@/lib/therapists'
import MessageBubble from './MessageBubble'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatInterfaceProps {
  therapist: Therapist
}

export default function ChatInterface({ therapist }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Bună ziua! Sunt ${therapist.name}, ${therapist.title}. ${therapist.description}\n\nCe te-a adus astăzi la mine? Povestește-mi ce simți sau ce gânduri te preocupă.`
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    // Add empty assistant message for streaming
    const assistantMessage: Message = { role: 'assistant', content: '' }
    setMessages([...newMessages, assistantMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          therapistId: therapist.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Eroare la trimiterea mesajului')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Nu s-a putut citi răspunsul')
      }

      let accumulatedText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulatedText += chunk

        // Update the last message with accumulated text
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            content: accumulatedText,
          }
          return updated
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Îmi pare rău, a apărut o eroare. Te rog să încerci din nou.',
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden max-w-4xl mx-auto w-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            therapistIcon={therapist.icon}
            therapistGradient={therapist.gradient}
          />
        ))}

        {/* Typing Indicator */}
        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div className="flex gap-3 mb-4">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${therapist.gradient} flex items-center justify-center text-sm text-white flex-shrink-0`}>
              {therapist.icon}
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex gap-1 items-center h-5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={`Scrie un mesaj pentru ${therapist.name}...`}
              className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent min-h-[48px] max-h-[200px] leading-relaxed"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all
              ${input.trim() && !isLoading
                ? `bg-gradient-to-br ${therapist.gradient} text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95`
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Apasă Enter pentru a trimite • Shift+Enter pentru linie nouă
        </p>
      </div>
    </div>
  )
}
