'use client'

import { useState } from 'react'
import { X, Calendar, MapPin, Info, Loader2, Send } from 'lucide-react'
import { convocarEntrevistaAction } from '@/app/actions/candidaturas'
import { toast } from 'react-hot-toast'

interface Props {
  candidaturaId: string
  nomeCandidato: string
  tituloVaga: string
  onClose: () => void
  onSuccess: () => void
}

export function ModalConvocacao({ candidaturaId, nomeCandidato, tituloVaga, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    formData.append('candidatura_id', candidaturaId)

    const result = await convocarEntrevistaAction(formData)

    if (result.success) {
      toast.success('Convocação enviada com sucesso!')
      onSuccess()
    } else {
      toast.error(result.error || 'Erro ao enviar convocação')
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none transition-all font-medium text-sm"

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bg-card w-full max-w-lg rounded-[2rem] border border-border shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 bg-accent text-accent-foreground">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <h2 className="text-2xl font-black mb-1">Convocar para Entrevista</h2>
          <p className="text-accent-foreground/80 text-sm font-medium">Candidato: {nomeCandidato}</p>
          <p className="text-accent-foreground/60 text-[10px] uppercase font-black tracking-widest mt-1">Vaga: {tituloVaga}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> Data e Hora
            </label>
            <input
              type="datetime-local"
              name="data_entrevista"
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Local ou Link
            </label>
            <input
              type="text"
              name="local_entrevista"
              required
              placeholder="Ex: Google Meet ou Endereço físico"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Info className="w-3.5 h-3.5" /> Observações (Opcional)
            </label>
            <textarea
              name="observacao"
              rows={3}
              placeholder="Informações adicionais para o candidato..."
              className={inputClass + " resize-none"}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-muted-foreground hover:bg-muted transition-colors border border-border"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-accent text-accent-foreground px-6 py-4 rounded-2xl font-black shadow-xl shadow-accent/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Enviando...' : 'Confirmar Convocação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
