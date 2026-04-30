'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { candidatarAction } from '@/app/actions/candidaturas'

interface BotaoCandidatarProps {
  vagaId: string
  jaCandidatou: boolean
  isLogado: boolean
}

export function BotaoCandidatar({ vagaId, jaCandidatou, isLogado }: BotaoCandidatarProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCandidatar = async () => {
    if (!isLogado) {
      router.push('/login?redirect=/vagas/' + vagaId)
      return
    }

    if (!confirm('Tem certeza que deseja se candidatar a esta vaga usando seu perfil atual?')) {
      return
    }

    setLoading(true)
    setError(null)

    const result = await candidatarAction(vagaId)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // If success, the page will revalidate and update `jaCandidatou`
  }

  if (jaCandidatou) {
    return (
      <button 
        disabled
        className="w-full bg-green-50 text-green-700 border border-green-200 px-6 py-4 rounded-xl font-bold text-lg text-center"
      >
        Você já se candidatou a esta vaga
      </button>
    )
  }

  return (
    <div className="w-full">
      <button 
        onClick={handleCandidatar}
        disabled={loading}
        className="w-full bg-accent text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Processando...' : 'Candidatar-se a esta vaga'}
      </button>
      {error && (
        <p className="mt-2 text-red-500 text-sm text-center font-medium">{error}</p>
      )}
    </div>
  )
}
