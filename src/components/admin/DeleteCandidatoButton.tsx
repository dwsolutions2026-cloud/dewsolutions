'use client'

import { useState } from 'react'
import { Trash2, Loader2, AlertCircle } from 'lucide-react'
import { deleteCandidatoAction } from '@/app/actions/admin'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Props {
  candidatoId: string
  userId: string
  curriculoUrl: string | null
  nome: string
}

export function DeleteCandidatoButton({ candidatoId, userId, curriculoUrl, nome }: Props) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      const result = await deleteCandidatoAction(candidatoId, userId, curriculoUrl)
      if (result.success) {
        toast.success(`Candidato ${nome} excluído com sucesso!`)
        router.refresh()
      } else {
        toast.error(result.error || 'Erro ao excluir candidato')
      }
    } catch (error) {
      toast.error('Erro interno ao processar exclusão')
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-1.5 text-muted-foreground hover:text-red-500 rounded-md hover:bg-red-50 transition-all"
        title="Excluir Candidato"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="bg-card w-full max-w-sm rounded-[2rem] border border-border p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-primary text-center mb-2">Excluir Candidato?</h3>
            <p className="text-muted-foreground text-center text-sm mb-8">
              Esta ação é irreversível e removerá permanentemente o perfil de <span className="font-bold text-primary">{nome}</span> e todos os seus dados de acesso.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
