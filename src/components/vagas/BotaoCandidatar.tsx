'use client'

import { useState } from 'react'
import { CheckCircle, Loader2, Send } from 'lucide-react'
import { candidatarAction } from '@/app/actions/candidaturas'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Props {
  vagaId: string
  jaCandidatou: boolean
}

export function BotaoCandidatar({ vagaId, jaCandidatou }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCandidatar() {
    setLoading(true)
    try {
      const result = await candidatarAction(vagaId)
      if (result.success) {
        toast.success('Candidatura realizada com sucesso!')
        router.refresh()
      } else {
        toast.error(result.error || 'Erro ao se candidatar')
      }
    } catch (error) {
      toast.error('Erro interno ao processar candidatura')
    } finally {
      setLoading(false)
    }
  }

  if (jaCandidatou) {
    return (
      <div className="w-full flex items-center justify-center gap-3 py-5 bg-green-100 text-green-700 rounded-2xl font-black text-xl border-2 border-green-200">
        <CheckCircle className="w-6 h-6" /> Já Candidatado
      </div>
    )
  }

  return (
    <button
      onClick={handleCandidatar}
      disabled={loading}
      className="w-full py-5 bg-accent text-accent-foreground rounded-2xl font-black text-xl shadow-2xl shadow-accent/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
      {loading ? 'Processando...' : 'Candidatar-se Agora'}
    </button>
  )
}
