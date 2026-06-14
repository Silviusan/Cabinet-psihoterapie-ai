import Link from 'next/link'
import { therapists } from '@/lib/therapists'
import TherapistCard from '@/components/TherapistCard'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm">
            <span>🧠</span>
            <span>Explorare Terapeutică AI</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Cabinet de
            <br />
            <span className="text-yellow-300">Psihoterapie AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explorează diferite abordări terapeutice într-un spațiu sigur și confidențial.
            Alege terapeutul AI care rezonează cu tine și începe conversația.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1">✓ Complet în română</span>
            <span className="flex items-center gap-1">✓ 5 școli terapeutice</span>
            <span className="flex items-center gap-1">✓ Disponibil oricând</span>
          </div>
        </div>
      </section>

      {/* Therapists Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Alege Terapeutul Tău
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fiecare terapeut AI reprezintă o școală terapeutică distinctă cu tehnici și perspective unice.
            Explorează-le pe toate pentru a găsi cea care ți se potrivește.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapists.map((therapist) => (
            <TherapistCard key={therapist.id} therapist={therapist} />
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex gap-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">Notă Importantă</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                Acest cabinet virtual este un instrument educațional și de explorare personală,
                <strong> nu un substitut pentru terapia psihologică profesională reală</strong>.
                Terapeuții AI nu pot oferi diagnostic, nu sunt echipați pentru situații de criză
                și nu înlocuiesc relația cu un profesionist calificat. Dacă te confrunți cu
                probleme serioase de sănătate mintală sau te afli într-o situație de urgență,
                te rugăm să contactezi un specialist sau să suni la <strong>112</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
