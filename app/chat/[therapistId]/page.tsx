import { notFound } from 'next/navigation'
import { therapists } from '@/lib/therapists'
import ChatInterface from '@/components/ChatInterface'
import Link from 'next/link'

interface PageProps {
  params: {
    therapistId: string
  }
}

export default function ChatPage({ params }: PageProps) {
  const therapist = therapists.find(t => t.id === params.therapistId)

  if (!therapist) {
    notFound()
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${therapist.gradient} text-white shadow-lg`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-white/80 hover:text-white transition-colors text-sm"
          >
            ← Înapoi
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              {therapist.icon}
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">{therapist.name}</h1>
              <p className="text-white/80 text-xs">{therapist.title}</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs bg-white/20 rounded-full px-3 py-1">
              {therapist.school}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface therapist={therapist} />
    </div>
  )
}
