interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface MessageBubbleProps {
  message: Message
  therapistIcon?: string
  therapistGradient?: string
}

export default function MessageBubble({ message, therapistIcon, therapistGradient }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm
        ${isUser
          ? 'bg-gray-200 text-gray-600'
          : `bg-gradient-to-br ${therapistGradient || 'from-purple-500 to-indigo-600'} text-white`
        }`}
      >
        {isUser ? '👤' : (therapistIcon || '🧠')}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3
        ${isUser
          ? 'bg-indigo-600 text-white rounded-tr-sm'
          : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  )
}
