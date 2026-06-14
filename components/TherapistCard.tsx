import Link from 'next/link'
import { Therapist } from '@/lib/therapists'

interface TherapistCardProps {
  therapist: Therapist
}

export default function TherapistCard({ therapist }: TherapistCardProps) {
  return (
    <Link href={`/chat/${therapist.id}`}>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent hover:-translate-y-1 cursor-pointer h-full">
        {/* Card Header with gradient */}
        <div className={`bg-gradient-to-br ${therapist.gradient} p-6 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full translate-y-6 -translate-x-4" />
          <div className="relative">
            <div className="text-4xl mb-3">{therapist.icon}</div>
            <span className="text-xs font-semibold tracking-wider text-white/70 uppercase">
              {therapist.school}
            </span>
            <h3 className="text-xl font-bold mt-1">{therapist.name}</h3>
            <p className="text-white/80 text-sm">{therapist.title}</p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {therapist.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Disponibil acum</span>
            <span className={`text-xs font-medium bg-gradient-to-r ${therapist.gradient} bg-clip-text text-transparent group-hover:underline`}>
              Începe sesiunea →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
