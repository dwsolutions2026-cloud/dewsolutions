'use client'

import { useState } from 'react'
import { CalendarClock, X, MapPin, MessageSquare, Loader2 } from 'lucide-react'
import { convocarEntrevistaAction } from '@/app/actions/candidaturas'

interface Props {
  candidaturaId: string
  nomeCandidato: string
  tituloVaga: string
  onClose: () => void
  onSuccess: () => void
}

export function ModalConvocacao({ candidaturaId, nomeCandidato, tituloVaga, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('candidatura_id', candidaturaId)

    const result = await convocarEntrevistaAction(formData)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      onSuccess()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <CalendarClock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-primary">Convocar para Entrevista</h2>
              <p className="text-xs text-muted-foreground">{nomeCandidato} · {tituloVaga}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-primary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          <div>
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
              <CalendarClock className="w-3.5 h-3.5" />
              DATA E HORA DA ENTREVISTA *
            </label>
            <input
              name="data_entrevista"
              type="datetime-local"
              required
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5" />
              LOCAL OU LINK *
            </label>
            <input
              name="local_entrevista"
              type="text"
              required
              placeholder="Ex: Rua das Flores, 100 – Sala 5 / ou link do Meet"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              OBSERVAÇÕES (OPCIONAL)
            </label>
            <textarea
              name="observacao"
              rows={3}
              placeholder="Ex: Trazer RG e currículo impresso. Vestimenta social."
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
            />
          </div>

          <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-100 p-3 rounded-lg">
            📧 Um e-mail de convocação será enviado automaticamente para <strong>{nomeCandidato}</strong> com todos os detalhes.
          </p>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-accent/90 disabled:opacity-60 transition-colors"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
              ) : (
                <><CalendarClock className="w-4 h-4" /> Convocar e Enviar E-mail</>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
