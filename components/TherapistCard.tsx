'use client';

import Link from 'next/link';
import { Therapist } from '@/lib/therapists';

interface Props {
  therapist: Therapist;
}

export default function TherapistCard({ therapist }: Props) {
  return (
    <div
      className={`therapist-card rounded-2xl border-2 ${therapist.borderColor} ${therapist.bgColor} p-6 h-full cursor-pointer hover:shadow-xl transition-all`}
    >
      {/* Gradient header */}
      <div
        className="rounded-xl p-4 mb-4 flex items-center gap-3"
        style={{ background: `linear-gradient(135deg, ${therapist.color}15, ${therapist.color}30)` }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm flex-shrink-0"
          style={{ backgroundColor: therapist.color + '20' }}
        >
          {therapist.emoji}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{therapist.name}</h3>
          <p className="text-sm font-medium" style={{ color: therapist.color }}>
            {therapist.title}
          </p>
        </div>
      </div>

      {/* School badge */}
      <div className="mb-3">
        <span
          className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
          style={{ backgroundColor: therapist.color + '15', color: therapist.color }}
        >
          {therapist.school}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {therapist.shortDescription}
      </p>

      {/* Techniques */}
      {therapist.techniques && (
        <div className="flex flex-wrap gap-2 mb-5">
          {therapist.techniques.map((technique) => (
            <span
              key={technique}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: therapist.color + '10', color: therapist.color }}
            >
              {technique}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="pt-4 border-t border-gray-200">
        <Link
          href={`/chat/${therapist.id}`}
          className="inline-block w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: therapist.color }}
        >
          Începe sesiunea →
        </Link>
      </div>
    </div>
  );
}
