'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteCandidatoAction } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

interface Props {
  candidatoId: string
  userId: string
  curriculoUrl: string | null
  nome: string
}

export function DeleteCandidatoButton({ candidatoId, userId, curriculoUrl, nome }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir permanentemente o candidato "${nome}"? Isso removerá o acesso dele à plataforma e todos os seus dados.`)) {
      return
    }

    setLoading(true)
    const result = await deleteCandidatoAction(candidatoId, userId, curriculoUrl)
    setLoading(false)

    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-muted-foreground hover:text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
      title="Excluir Candidato"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
