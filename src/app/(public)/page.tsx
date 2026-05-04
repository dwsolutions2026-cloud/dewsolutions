import Link from 'next/link'
import { ArrowRight, Target, Users, TrendingUp, MessageCircle } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'D&W Solutions | Recrutamento e Seleção de Alta Performance',
  description: 'Soluções inteligentes em recrutamento e seleção. Conectamos talentos às oportunidades certas.',
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0c0c0c] text-white overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c] via-[#0c0c0c]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent z-10" />
          <Image
            src="/images/hero-team.png"
            alt="D&W Solutions Team"
            fill
            className="object-cover object-right lg:object-center opacity-60 lg:opacity-100"
            priority
          />
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-2xl space-y-10 animate-in fade-in slide-in-from-left duration-1000">
            
            {/* Brand Header */}
            <div className="space-y-2 group">
              <div className="flex items-center gap-3">
                <span className="text-7xl lg:text-9xl font-serif font-black tracking-tighter text-white">D</span>
                <span className="text-7xl lg:text-9xl font-serif gold-text-gradient">&</span>
                <span className="text-7xl lg:text-9xl font-serif font-black tracking-tighter text-white">W</span>
              </div>
              <div className="flex items-center gap-4 w-full">
                <div className="h-[2px] flex-1 bg-accent/40" />
                <span className="text-xl lg:text-2xl font-bold tracking-[0.4em] text-accent uppercase font-sans">
                  Solutions
                </span>
                <div className="h-[2px] flex-1 bg-accent/40" />
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Soluções inteligentes em <br />
                <span className="gold-text-gradient">recrutamento e seleção.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed max-w-lg">
                Conectamos talentos às oportunidades certas. <br />
                <span className="text-accent italic">Inteligência. Estratégia. Resultados.</span>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link 
                href="/anunciar-oportunidade" 
                className="gold-gradient text-black px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20"
              >
                Solicitar Orçamento <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/vagas" 
                className="border-2 border-accent text-accent px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent/5 hover:scale-105 transition-all"
              >
                Ver Vagas <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS / FEATURES FOOTER */}
      <section className="relative z-20 border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-10 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            
            {/* Feature 1 */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 h-14 rounded-full border border-accent/30 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all duration-500 shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Precisão</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  Processos assertivos <br /> e eficientes.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 h-14 rounded-full border border-accent/30 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all duration-500 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Conexão</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  Conectamos pessoas <br /> a propósito.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 h-14 rounded-full border border-accent/30 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all duration-500 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Resultados</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  Foco em resultados <br /> que geram impacto.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <Link 
        href="https://wa.me/5541999999999" 
        target="_blank"
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all animate-bounce"
      >
        <MessageCircle className="w-8 h-8" />
      </Link>

    </div>
  )
}
