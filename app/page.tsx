"use client";

import Link from "next/link";
import { therapists } from "@/lib/therapists";
import { Shield, Heart, Brain, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-purple-50 to-emerald-50 opacity-60" />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
            Cabinet de{" "}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Psihoterapie
            </span>{" "}
            AI
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Explorează diverse abordări psihoterapeutice cu agenți AI specializați. Fiecare
            terapeut aduce o perspectivă unică pentru a te ajuta să înțelegi mai bine lumea
            ta interioară.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-500" />
              <span>Confidențial</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Empatic</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Bazat pe dovezi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
          <p className="text-amber-800 text-sm">
            <strong>⚠️ Important:</strong> Această aplicație este un instrument de explorare și suport emoțional asistat
            de AI. Nu înlocuiește terapia cu un psihoterapeut uman licențiat. Dacă te confrunți cu o criză sau gânduri
            de autovătămare, contactează <strong>112</strong> sau o linie de criză.
          </p>
        </div>
      </div>

      {/* Therapist Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-10">
          Alege terapeutul tău
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapists.map((therapist) => (
            <Link
              key={therapist.id}
              href={`/chat/${therapist.id}`}
              className="block"
            >
              <div
                className={`therapist-card rounded-2xl border-2 ${therapist.borderColor} ${therapist.bgColor} p-6 h-full cursor-pointer hover:shadow-xl`}
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0"
                    style={{ backgroundColor: therapist.color + "20" }}
                  >
                    {therapist.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{therapist.name}</h3>
                    <p className={`text-sm font-medium ${therapist.textColor}`}>
                      {therapist.school}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {therapist.shortDescription}
                </p>

                {/* Techniques */}
                <div className="flex flex-wrap gap-2">
                  {therapist.techniques.map((technique) => (
                    <span
                      key={technique}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: therapist.color + "15",
                        color: therapist.color,
                      }}
                    >
                      {technique}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-5 pt-4 border-t border-gray-200">
                  <div
                    className="text-sm font-semibold flex items-center gap-1"
                    style={{ color: therapist.color }}
                  >
                    Începe sesiunea →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>
            Cabinet de Psihoterapie AI • Instrument de explorare emoțională •{" "}
            <strong>Nu înlocuiește terapia profesională</strong>
          </p>
        </div>
      </footer>
    </main>
  );
}
