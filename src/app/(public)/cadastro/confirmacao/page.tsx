import { ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ConfirmacaoCadastroPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-background animate-in fade-in zoom-in duration-500">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-green-200">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-primary tracking-tight">Verifique seu e-mail</h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            Enviamos um link de confirmação para o seu e-mail. Por favor, valide sua conta para continuar o processo.
          </p>
        </div>
        <Link 
          href="/login" 
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20"
        >
          Ir para o Login <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
