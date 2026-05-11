'use client'

import { useState } from 'react'
import { Mail, Phone, CalendarClock, MessageSquare, Loader2, X, Check, Award, Ban } from 'lucide-react'
import { atualizarStatusCandidaturaAction, convocarEntrevistaAction } from '@/app/actions/candidaturas'
import Link from 'next/link'

interface Candidato {
  id: string
  nome: string
  email: string
  telefone: string
  avatar_url: string | null
}

interface Candidatura {
  id: string
  status: 'inscrito' | 'em_analise' | 'entrevista' | 'aprovado' | 'reprovado'
  created_at: string
  data_entrevista: string | null
  local_entrevista?: string | null
  observacao?: string | null
  candidato: Candidato
}

interface Props {
  candidaturas: Candidatura[]
  vagaTitulo: string
}

export function CandidatosListClient({ candidaturas, vagaTitulo }: Props) {
  const [list, setList] = useState<Candidatura[]>(candidaturas)
  const [selectedCand, setSelectedCand] = useState<Candidatura | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [status, setStatus] = useState<Candidatura['status']>('inscrito')
  
  // Form para Entrevista
  const [dataEntrevista, setDataEntrevista] = useState('')
  const [localEntrevista, setLocalEntrevista] = useState('')
  const [observacao, setObservacao] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const openManageModal = (cand: Candidatura) => {
    setSelectedCand(cand)
    setStatus(cand.status)
    setDataEntrevista(cand.data_entrevista ? new Date(cand.data_entrevista).toISOString().slice(0, 16) : '')
    setLocalEntrevista(cand.local_entrevista || '')
    setObservacao(cand.observacao || '')
    setError(null)
    setSuccess(false)
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!selectedCand) return
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (status === 'entrevista') {
        if (!dataEntrevista || !localEntrevista) {
          setError('Data e local da entrevista são obrigatórios.')
          setLoading(false)
          return
        }

        const formData = new FormData()
        formData.append('candidatura_id', selectedCand.id)
        formData.append('data_entrevista', dataEntrevista)
        formData.append('local_entrevista', localEntrevista)
        if (observacao) formData.append('observacao', observacao)

        const res = await convocarEntrevistaAction(formData)
        if (res.error) {
          setError(res.error)
        } else {
          setSuccess(true)
          // Atualiza lista local
          setList(prev => prev.map(item => {
            if (item.id === selectedCand.id) {
              return {
                ...item,
                status: 'entrevista',
                data_entrevista: dataEntrevista,
                local_entrevista: localEntrevista,
                observacao: observacao
              }
            }
            return item
          }))

          // Abrir WhatsApp se o usuário preferir enviar a convocação manualmente também
          const text = encodeURIComponent(
            `Olá, ${res.nomeCandidato}! Aqui é da equipe de recrutamento da ${res.nomeEmpresa}.\n\nGostaríamos de convidar você para uma entrevista para a vaga de *${res.tituloVaga}*.\n\n📅 *Data:* ${new Date(dataEntrevista).toLocaleString('pt-BR')}\n📍 *Local/Link:* ${localEntrevista}\n${observacao ? `📝 *Observação:* ${observacao}\n` : ''}\nPor favor, confirme se recebeu esta mensagem e se está disponível neste horário.`
          )
          const cleanPhone = res.telefone.replace(/\D/g, '')
          if (cleanPhone) {
            setTimeout(() => {
              window.open(`https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${text}`, '_blank')
            }, 1000)
          }

          setTimeout(() => setIsModalOpen(false), 2000)
        }
      } else {
        // Atualização de status comum
        const res = await atualizarStatusCandidaturaAction(selectedCand.id, status)
        if (res.error) {
          setError(res.error)
        } else {
          setSuccess(true)
          setList(prev => prev.map(item => {
            if (item.id === selectedCand.id) {
              return { ...item, status }
            }
            return item
          }))
          setTimeout(() => setIsModalOpen(false), 1500)
        }
      }
    } catch (err: any) {
      setError('Erro interno ao atualizar status.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {list.length > 0 ? (
        list.map((c: Candidatura) => (
          <div 
            key={c.id} 
            className="bg-secondary p-5 rounded-sm border border-border/10 hover:border-accent/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group shadow-sm"
          >
            <div className="flex items-center gap-4 min-w-0">
              {/* Avatar do Candidato */}
              <div className="w-12 h-12 rounded-sm overflow-hidden bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 shadow-inner">
                {c.candidato.avatar_url ? (
                  <img src={c.candidato.avatar_url} alt={c.candidato.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-accent text-white text-base font-black">
                    {c.candidato.nome.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base font-bold text-primary group-hover:text-accent transition-colors truncate">
                    {c.candidato.nome}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded border text-[9px] font-black uppercase tracking-widest ${
                    c.status === 'aprovado' ? 'border-green-500 bg-green-500/10 text-green-500' :
                    c.status === 'reprovado' ? 'border-red-500 bg-red-500/10 text-red-500' :
                    c.status === 'entrevista' ? 'border-purple-500 bg-purple-500/10 text-purple-500' :
                    c.status === 'em_analise' ? 'border-amber-500 bg-amber-500/10 text-amber-500' :
                    'border-blue-500 bg-blue-500/10 text-blue-500'
                  }`}>
                    {c.status === 'inscrito' ? 'Inscrito' :
                     c.status === 'em_analise' ? 'Em Análise' :
                     c.status === 'entrevista' ? 'Entrevista' :
                     c.status === 'aprovado' ? 'Aprovado' : 'Reprovado'}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-accent" /> {c.candidato.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-accent" /> {c.candidato.telefone || 'Não informado'}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold">
                    Inscrito em {new Date(c.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
              {c.data_entrevista && c.status === 'entrevista' && (
                <div className="hidden lg:flex items-center gap-2 text-xs text-purple-500 font-bold border border-purple-500/20 bg-purple-500/5 px-3 py-1.5 rounded-sm mr-2">
                  <CalendarClock className="w-3.5 h-3.5" /> 
                  {new Date(c.data_entrevista).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                </div>
              )}
              
              <Link 
                href={`/empresa/talentos/${c.candidato.id}`}
                className="px-4 py-2 bg-muted text-primary hover:bg-primary hover:text-white rounded-sm font-black text-[10px] transition-all uppercase tracking-wider"
              >
                Ver Perfil
              </Link>
              <button 
                onClick={() => openManageModal(c)}
                className="px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm font-black text-[10px] transition-all uppercase tracking-wider shadow-sm"
              >
                Gerenciar
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="p-16 bg-secondary border-none rounded-sm text-center space-y-4 shadow-sm opacity-70">
          <p className="text-xl font-bold text-primary">Nenhum candidato inscrito ainda</p>
        </div>
      )}

      {/* Premium Drawer/Modal */}
      {isModalOpen && selectedCand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-secondary rounded-sm border border-border/40 max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-5 border-b border-border/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-primary">Gerenciar Candidatura</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Candidato: <span className="text-accent">{selectedCand.candidato.nome}</span></p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-sm text-xs font-semibold">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-sm text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  {status === 'entrevista' 
                    ? 'Entrevista agendada e e-mail enviado! Abrindo convite do WhatsApp...'
                    : 'Status atualizado com sucesso!'
                  }
                </div>
              )}

              {/* Seletor de Status */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Status da Candidatura</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'inscrito', label: 'Inscrito', color: 'border-blue-500/20 text-blue-500 hover:bg-blue-500/5' },
                    { value: 'em_analise', label: 'Em Análise', color: 'border-amber-500/20 text-amber-500 hover:bg-amber-500/5' },
                    { value: 'entrevista', label: 'Entrevista', color: 'border-purple-500/20 text-purple-500 hover:bg-purple-500/5' },
                    { value: 'aprovado', label: 'Aprovado', color: 'border-green-500/20 text-green-500 hover:bg-green-500/5' },
                    { value: 'reprovado', label: 'Reprovado', color: 'border-red-500/20 text-red-500 hover:bg-red-500/5' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setStatus(opt.value as any)}
                      className={`p-2.5 rounded-sm border text-[10px] font-black uppercase tracking-wider text-center transition-all ${
                        status === opt.value 
                          ? 'bg-accent border-accent text-accent-foreground shadow-md' 
                          : `bg-muted/10 border-border/35 text-muted-foreground hover:text-primary ${opt.color}`
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form de Agendamento (Apenas se Status === 'entrevista') */}
              {status === 'entrevista' && (
                <div className="space-y-4 p-4 rounded-sm border border-purple-500/10 bg-purple-500/5 animate-in slide-in-from-top-2 duration-300">
                  <h4 className="text-xs font-black text-purple-500 flex items-center gap-1.5 uppercase tracking-wide">
                    <CalendarClock className="w-4 h-4" /> Detalhes da Entrevista
                  </h4>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Data e Horário</label>
                    <input 
                      type="datetime-local" 
                      value={dataEntrevista}
                      onChange={e => setDataEntrevista(e.target.value)}
                      className="w-full bg-background border border-border/40 rounded-sm p-2 text-xs font-bold text-primary focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Local ou Link da Reunião</label>
                    <input 
                      type="text" 
                      placeholder="Google Meet, Zoom, Endereço da Empresa..."
                      value={localEntrevista}
                      onChange={e => setLocalEntrevista(e.target.value)}
                      className="w-full bg-background border border-border/40 rounded-sm p-2 text-xs font-semibold text-primary focus:outline-none focus:border-accent placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Observações adicionais (Opcional)</label>
                    <textarea 
                      placeholder="Ex: Trazer portfólio, procurar por Débora na recepção..."
                      value={observacao}
                      onChange={e => setObservacao(e.target.value)}
                      rows={2}
                      className="w-full bg-background border border-border/40 rounded-sm p-2 text-xs font-semibold text-primary focus:outline-none focus:border-accent placeholder:text-muted-foreground/50 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/10 bg-muted/20 flex items-center justify-between">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
              >
                Cancelar
              </button>
              <button
                disabled={loading}
                onClick={handleSave}
                className="px-5 py-2 bg-primary hover:bg-primary/95 text-primary-foreground font-black text-xs rounded-sm transition-all flex items-center gap-1.5 shadow-md shadow-primary/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Salvando...
                  </>
                ) : (
                  'Confirmar Alteração'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
