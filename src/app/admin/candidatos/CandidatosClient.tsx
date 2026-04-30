'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Building2, Briefcase, FileText, CalendarClock } from 'lucide-react'
import Link from 'next/link'
import { ModalConvocacao } from '@/components/ModalConvocacao'
import { DeleteCandidatoButton } from '@/components/admin/DeleteCandidatoButton'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  inscrito: { label: 'Inscrito', color: 'bg-blue-100 text-blue-700' },
  em_analise: { label: 'Em análise', color: 'bg-amber-100 text-amber-700' },
  entrevista: { label: 'Entrevista', color: 'bg-purple-100 text-purple-700' },
  aprovado: { label: 'Aprovado', color: 'bg-green-100 text-green-700' },
  reprovado: { label: 'Reprovado', color: 'bg-red-100 text-red-600' },
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

export function CandidatosClient({ empresas, error, supabaseUrl }: Props) {
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Candidaturas por Vaga</h1>
        <p className="text-muted-foreground">Candidatos organizados por empresa e oportunidade</p>
      </div>

      <div className="space-y-6">
        {error ? (
          <div className="bg-white p-8 rounded-xl border border-red-200 text-red-500 text-center">
            Erro ao carregar candidaturas: {error}
          </div>
        ) : empresas.length > 0 ? (
          empresas.map((empresa) => {
            const vagasComCandidatos = empresa.vagas.filter(v => v.candidaturas.length > 0)
            if (vagasComCandidatos.length === 0) return null

            return (
              <div key={empresa.id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                {/* Cabeçalho da Empresa */}
                <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-accent" />
                  <h2 className="font-serif font-bold text-lg text-primary">{empresa.nome}</h2>
                </div>

                <div className="divide-y divide-border">
                  {vagasComCandidatos.map((vaga) => (
                    <div key={vaga.id} className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-semibold text-primary">{vaga.titulo}</h3>
                        <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-0.5 rounded-full">
                          {vaga.candidaturas.length} inscritos
                        </span>
                      </div>

                      <div className="space-y-2">
                        {vaga.candidaturas.map((c) => {
                          const st = STATUS_LABELS[c.status] || STATUS_LABELS['inscrito']
                          return (
                            <div
                              key={c.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-border hover:border-accent/40 transition-colors"
                            >
                              {/* Info do candidato */}
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Link 
                                    href={`/admin/talentos/${c.candidato.id}`}
                                    className="text-sm font-medium text-primary hover:text-accent transition-colors"
                                  >
                                    {c.candidato.nome}
                                  </Link>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${st.color}`}>
                                    {st.label}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">{c.candidato.email}</span>
                                {c.status === 'entrevista' && c.data_entrevista && (
                                  <span className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                                    <CalendarClock className="w-3 h-3" />
                                    {new Date(c.data_entrevista).toLocaleString('pt-BR', {
                                      dateStyle: 'short',
                                      timeStyle: 'short',
                                    })}
                                    {c.local_entrevista && ` · ${c.local_entrevista}`}
                                  </span>
                                )}
                              </div>

                              {/* Ações */}
                              <div className="flex items-center gap-2 shrink-0">
                                {/* Ver Perfil */}
                                <Link
                                  href={`/admin/talentos/${c.candidato.id}`}
                                  className="p-1.5 text-muted-foreground hover:text-accent rounded-md hover:bg-accent/5 transition-colors"
                                  title="Ver Perfil Completo"
                                >
                                  <FileText className="w-4 h-4" />
                                </Link>

                                {/* Botão de Convocar */}
                                {c.status !== 'aprovado' && c.status !== 'reprovado' && (
                                  <button
                                    onClick={() => handleConvocar(c, vaga.titulo)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                      c.status === 'entrevista'
                                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                        : 'bg-accent/10 text-accent hover:bg-accent/20'
                                    }`}
                                    title="Convocar para entrevista"
                                  >
                                    <CalendarClock className="w-3.5 h-3.5" />
                                    {c.status === 'entrevista' ? 'Reagendar' : 'Convocar'}
                                  </button>
                                )}

                                <DeleteCandidatoButton 
                                  candidatoId={c.candidato.id}
                                  userId={c.candidato.user_id}
                                  curriculoUrl={c.candidato.curriculo_url}
                                  nome={c.candidato.nome}
                                />
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
          <div className="bg-white p-12 text-center rounded-xl border border-border text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p>Ainda não há candidaturas registradas.</p>
          </div>
        )}
      </div>

      {/* Modal de Convocação */}
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
