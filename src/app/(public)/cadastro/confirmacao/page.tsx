import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function ConfirmacaoPage() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-sm border border-border text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-accent" />
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-primary">
          Cadastro Concluído!
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          Seu currículo foi cadastrado com sucesso. Você já pode visualizar as vagas disponíveis e se candidatar.
        </p>
        <div className="pt-6">
          <Link
            href="/vagas"
            className="flex w-full justify-center rounded-md bg-accent px-3 py-4 text-sm font-semibold text-white hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors"
          >
            Ver Vagas Disponíveis
          </Link>
        </div>
      </div>
    </div>
  )
}
