'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { createOportunidadeLeadAction } from '@/app/actions/oportunidades'
import { toast } from 'react-hot-toast'

export function FooterLeadForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      empresa: formData.get('empresa'),
      nome_contato: formData.get('nome_contato'),
      telefone: formData.get('telefone'),
      email: formData.get('email'),
      mensagem: 'Lead via rodapé do site',
    }

    try {
      const result = await createOportunidadeLeadAction(data)
      if (result.error) throw new Error(result.error)
      
      setSuccess(true)
      toast.success('Recebemos seu contato!')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar dados.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center space-y-3">
        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto text-accent">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-white">Contato Recebido!</h4>
          <p className="text-xs text-white/60 mt-1">Nossa equipe comercial entrará em contato em breve.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="mb-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Para Empresas</h4>
        <p className="text-xs font-medium text-white/70 mt-1">Deseja contratar nossos serviços? Deixe seu contato.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="empresa"
          type="text"
          required
          placeholder="Nome da sua empresa"
          className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
        />
        <input
          name="nome_contato"
          type="text"
          required
          placeholder="Seu nome"
          className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            name="telefone"
            type="tel"
            required
            placeholder="Telefone / WhatsApp"
            className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
          <input
            name="email"
            type="email"
            placeholder="E-mail (opcional)"
            className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-black font-black text-[10px] uppercase tracking-widest py-3 rounded-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>Enviar Contato <ArrowRight className="w-3 h-3" /></>
          )}
        </button>
      </form>
    </div>
  )
}
