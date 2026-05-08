'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Clock } from 'lucide-react'

interface CandidaturaRecente {
  id: string
  created_at: string
  status: string
  candidato: { nome: string }[] | null
  vaga: { 
    titulo: string
    empresa: { nome: string }[] | null
  }[] | null
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  inscrito: { label: 'Inscrito', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  em_analise: { label: 'Em Análise', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  entrevista: { label: 'Entrevista', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  aprovado: { label: 'Aprovado', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  reprovado: { label: 'Reprovado', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

export function UltimasCandidaturasClient({
  initialData,
}: {
  initialData: CandidaturaRecente[]
}) {
  const [candidaturas, setCandidaturas] = useState<CandidaturaRecente[]>(initialData)
  const supabase = createClient()

  useEffect(() => {
    const fetchCandidaturas = async () => {
      const { data } = await supabase
        .from('candidaturas')
        .select(`
          id,
          created_at,
          status,
          candidato:candidatos(nome),
          vaga:vagas(
            titulo,
            empresa:empresas(nome)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(6)

      if (data) {
        setCandidaturas(data as unknown as CandidaturaRecente[])
      }
    }

    const channel = supabase
      .channel('realtime-candidaturas')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'candidaturas' },
        () => {
          fetchCandidaturas()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <div className="flex-1 space-y-2.5">
      {candidaturas.length > 0 ? (
        candidaturas.map((cand) => {
          const st = STATUS_LABELS[cand.status] ?? STATUS_LABELS['inscrito']
          const candidatoNome = Array.isArray(cand.candidato) ? cand.candidato[0]?.nome : '—'
          const vagaInfo = Array.isArray(cand.vaga) ? cand.vaga[0] : null
          const vagaTitulo = vagaInfo?.titulo || '—'
          const empresaNome = Array.isArray(vagaInfo?.empresa) ? vagaInfo.empresa[0]?.nome : 'Empresa não identificada'

          return (
            <div
              key={cand.id}
              className="flex items-center justify-between rounded-sm bg-secondary p-4 transition-all hover:bg-muted/50 border-none shadow-sm"
            >
              <div className="min-w-0 space-y-0.5">
                <p className="truncate text-xs font-black text-primary uppercase tracking-tight">
                  {/* Tenta pegar o nome se for array ou se for objeto direto */}
                  {Array.isArray(cand.candidato) ? cand.candidato[0]?.nome : (cand.candidato as any)?.nome || 'Candidato s/ nome'}
                </p>
                <p className="truncate text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {Array.isArray(cand.vaga) ? cand.vaga[0]?.titulo : (cand.vaga as any)?.titulo || 'Vaga não identificada'} 
                  <span className="mx-1 font-normal opacity-50 lowercase italic">em</span> 
                  <span className="font-black text-accent">
                    {(() => {
                      const v = Array.isArray(cand.vaga) ? cand.vaga[0] : (cand.vaga as any);
                      const e = v?.empresa;
                      return Array.isArray(e) ? e[0]?.nome : (e as any)?.nome || 'Empresa não identificada';
                    })()}
                  </span>
                </p>
              </div>
              <div className="ml-3 shrink-0 text-right">
                <p className="text-[9px] font-black text-muted-foreground uppercase">
                  {new Date(cand.created_at).toLocaleDateString('pt-BR')}
                </p>
                <span
                  className={`mt-1 inline-block rounded-sm px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter ${st.color}`}
                >
                  {st.label}
                </span>
              </div>
            </div>
          )
        })
      ) : (
        <div className="rounded-sm border border-dashed border-border p-6 text-center text-sm font-medium text-muted-foreground">
          Nenhuma candidatura recente encontrada.
        </div>
      )}
    </div>
  )
}
