import { CurriculoBuilderClient } from '@/components/vagas/CurriculoBuilderClient'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CurriculoCriarPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div>
        <Link 
          href="/candidato/minha-area" 
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-4xl font-black text-primary tracking-tight">Criar Meu Currículo</h1>
        <p className="text-muted-foreground text-lg font-medium">Construa seu perfil profissional passo a passo.</p>
      </div>

      <CurriculoBuilderClient />
    </div>
  )
}
