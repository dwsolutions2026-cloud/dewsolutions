'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Briefcase, MapPin, Building2, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export function CandidaturasListClient({ 
  initialData, 
  candidatoId 
}: { 
  initialData: any[]; 
  candidatoId: string 
}) {
  const [candidaturas, setCandidaturas] = useState(initialData)
  const supabase = createClient()

  useEffect(() => {
    if (!candidatoId) return

    const fetchCandidaturas = async () => {
      const { data } = await supabase
        .from('candidaturas')
        .select(`
          *,
          vaga:vagas (
            id,
            titulo,
            cidade,
            estado,
            empresa:empresas (nome)
          )
        `)
        .eq('candidato_id', candidatoId)
        .order('created_at', { ascending: false })

      if (data) {
        setCandidaturas(data)
      }
    }

    const channel = supabase
      .channel(`candidato-candidaturas-${candidatoId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'candidaturas',
          filter: `candidato_id=eq.${candidatoId}`
        },
        (payload: any) => {
          // Play a sound or show a toast when status changes
          if (payload.eventType === 'UPDATE') {
            const oldStatus = payload.old.status
            const newStatus = payload.new.status
            if (oldStatus !== newStatus) {
              toast.success(`Uma das suas candidaturas mudou para: ${getStatusLabel(newStatus)}`, {
                icon: '🔔',
                duration: 5000
              })
            }
          }
          fetchCandidaturas()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [candidatoId, supabase])

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'inscrito': return 'Inscrito'
      case 'em_analise': return 'Em Análise'
      case 'entrevista': return 'Entrevista'
      case 'aprovado': return 'Aprovado'
      case 'reprovado': return 'Não Seguiu'
      default: return 'Inscrito'
    }
  }

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'inscrito': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
      case 'em_analise': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
      case 'entrevista': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
      case 'aprovado': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
      case 'reprovado': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {candidaturas && candidaturas.length > 0 ? (
        candidaturas.map((cand: any) => {
          const vaga = Array.isArray(cand.vaga) ? cand.vaga[0] : cand.vaga
          const empresa = vaga?.empresa
          const empresaNome = Array.isArray(empresa) ? empresa[0]?.nome : empresa?.nome

          return (
            <div key={cand.id} className="bg-secondary p-5 rounded-sm border-none shadow-sm transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-background rounded-sm flex items-center justify-center text-accent transition-all shadow-inner shrink-0">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-black text-primary mb-0.5 truncate uppercase tracking-tight">{vaga?.titulo}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {empresaNome}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {vaga?.cidade} - {vaga?.estado}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Inscrito em {new Date(cand.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 lg:w-48 justify-between lg:justify-end shrink-0">
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">Status Atual</p>
                    <span className={`inline-block px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest ${getStatusStyle(cand.status)}`}>
                      {getStatusLabel(cand.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className="bg-secondary border-none shadow-sm p-12 text-center rounded-sm">
          <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-black text-primary mb-2">Nenhuma candidatura encontrada</h3>
          <p className="text-sm font-medium text-muted-foreground max-w-md mx-auto mb-6">Você ainda não se candidatou a nenhuma vaga na plataforma.</p>
          <Link href="/vagas" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20">
            Explorar Vagas Abertas <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
