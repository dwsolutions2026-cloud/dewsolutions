'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Building2, Briefcase, FileText, CalendarClock } from 'lucide-react'
import Link from 'next/link'
import { ModalConvocacao } from '@/components/ModalConvocacao'
import { DeleteCandidatoButton } from '@/components/admin/DeleteCandidatoButton'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  inscrito: { label: 'Inscrito', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  em_analise: { label: 'Em análise', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  entrevista: { label: 'Entrevista', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  aprovado: { label: 'Aprovado', color: 'bg-green-50 text-green-600 border-green-100' },
  reprovado: { label: 'Reprovado', color: 'bg-red-50 text-red-600 border-red-100' },
}

interface Candidatura {
  id: string
  status: string
  data_entrevista: string | null
  local_entrevista: string | null
  candidato: {
    id: string
    nome: string
    email: string
    curriculo_url: string | null
    user_id: string
  }
}

interface Vaga {
  id: string
  titulo: string
  candidaturas: Candidatura[]
}

interface Empresa {
  id: string
  nome: string
  vagas: Vaga[]
}

interface Props {
  empresas: Empresa[]
  error?: string
  supabaseUrl: string
}

interface ModalState {
  candidaturaId: string
  nomeCandidato: string
  tituloVaga: string
}

export function CandidatosClient({ empresas, error }: Props) {
  const router = useRouter()
  const [modal, setModal] = useState<ModalState | null>(null)

  const handleConvocar = (c: Candidatura, tituloVaga: string) => {
    setModal({
      candidaturaId: c.id,
      nomeCandidato: c.candidato.nome,
      tituloVaga,
    })
  }

  const handleSuccess = () => {
    setModal(null)
    router.refresh()
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight">Candidaturas por Vaga</h1>
        <p className="text-muted-foreground text-sm font-medium opacity-70">Gestão de talentos organizados por empresa.</p>
      </div>

      <div className="space-y-8">
        {error ? (
          <div className="bg-card p-10 rounded-[2rem] border border-red-200 text-red-500 text-center font-bold shadow-sm text-sm">
            Erro ao carregar candidaturas: {error}
          </div>
        ) : empresas.length > 0 ? (
          empresas.map((empresa) => {
            const vagasComCandidatos = empresa.vagas.filter(v => v.candidaturas.length > 0)
            if (vagasComCandidatos.length === 0) return null

            return (
              <div key={empresa.id} className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden hover:shadow-md transition-all">
                {/* Cabeçalho da Empresa */}
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-black text-primary tracking-tight">{empresa.nome}</h2>
                </div>

                <div className="divide-y divide-border/50">
                  {vagasComCandidatos.map((vaga) => (
                    <div key={vaga.id} className="p-6">
                      <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-7 h-7 bg-muted rounded flex items-center justify-center text-muted-foreground">
                          <Briefcase className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="text-base font-bold text-primary">{vaga.titulo}</h3>
                        <span className="bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                          {vaga.candidaturas.length} inscritos
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {vaga.candidaturas.map((c) => {
                          const st = STATUS_LABELS[c.status] || STATUS_LABELS['inscrito']
                          return (
                            <div
                              key={c.id}
                              className="flex flex-col p-5 rounded-2xl border border-border bg-muted/5 hover:border-accent/20 transition-all group"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="min-w-0">
                                  <Link 
                                    href={`/admin/talentos/${c.candidato.id}`}
                                    className="text-sm font-bold text-primary hover:text-accent transition-colors block truncate"
                                  >
                                    {c.candidato.nome}
                                  </Link>
                                  <span className="text-[10px] text-muted-foreground font-medium">{c.candidato.email}</span>
                                </div>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${st.color}`}>
                                  {st.label}
                                </span>
                              </div>

                              {c.status === 'entrevista' && c.data_entrevista && (
                                <div className="mb-3 p-2 bg-purple-50 rounded-lg border border-purple-100 flex items-center gap-2.5">
                                  <CalendarClock className="w-3.5 h-3.5 text-purple-600" />
                                  <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-purple-700 uppercase">Agendada</span>
                                    <span className="text-[10px] font-bold text-purple-600">
                                      {new Date(c.data_entrevista).toLocaleString('pt-BR', {
                                        dateStyle: 'short',
                                        timeStyle: 'short',
                                      })}
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Link
                                    href={`/admin/talentos/${c.candidato.id}`}
                                    className="p-1.5 text-muted-foreground hover:text-accent rounded hover:bg-accent/5 transition-all"
                                    title="Ver Perfil"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </Link>
                                  <DeleteCandidatoButton 
                                    candidatoId={c.candidato.id}
                                    userId={c.candidato.user_id}
                                    curriculoUrl={c.candidato.curriculo_url}
                                    nome={c.candidato.nome}
                                  />
                                </div>

                                {c.status !== 'aprovado' && c.status !== 'reprovado' && (
                                  <button
                                    onClick={() => handleConvocar(c, vaga.titulo)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                      c.status === 'entrevista'
                                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                        : 'bg-accent text-accent-foreground shadow-md shadow-accent/10 hover:scale-105'
                                    }`}
                                  >
                                    {c.status === 'entrevista' ? 'Reagendar' : 'Convocar'}
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div className="bg-card p-16 text-center rounded-[2.5rem] border border-border shadow-sm">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20 text-muted-foreground" />
            <p className="text-xl font-bold text-primary">Nenhuma candidatura ainda.</p>
            <p className="text-sm text-muted-foreground font-medium opacity-60">As candidaturas aparecerão aqui conforme os talentos se inscreverem nas vagas.</p>
          </div>
        )}
      </div>

      {modal && (
        <ModalConvocacao
          candidaturaId={modal.candidaturaId}
          nomeCandidato={modal.nomeCandidato}
          tituloVaga={modal.tituloVaga}
          onClose={() => setModal(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
