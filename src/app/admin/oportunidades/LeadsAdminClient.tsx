'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  ExternalLink, 
  MoreVertical, 
  Trash2, 
  MessageSquare,
  Eye,
  CheckCircle2,
  Clock,
  User,
  Building2,
  MapPin,
  Mail,
  Phone,
  XCircle,
  AlertCircle,
  Loader2,
  Briefcase
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { updateLeadStatusAction, deleteLeadAction } from '@/app/actions/oportunidades'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Lead {
  id: string
  nome_empresa: string
  nome_responsavel: string
  email: string
  telefone: string
  cargo_vaga: string
  cidade: string
  mensagem: string
  status: 'novo' | 'em_contato' | 'fechado' | 'sem_interesse'
  criado_em: string
}

export function LeadsAdminClient({ leads }: { leads: Lead[] }) {
  const router = useRouter()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleStatusChange = async (id: string, newStatus: string) => {
    setIsUpdating(id)
    const result = await updateLeadStatusAction(id, newStatus)
    if (result.success) {
      toast.success('Status atualizado!')
      router.refresh()
    } else {
      toast.error(result.error || 'Erro ao atualizar.')
    }
    setIsUpdating(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) return
    setIsDeleting(id)
    const result = await deleteLeadAction(id)
    if (result.success) {
      toast.success('Lead excluído!')
      router.refresh()
    } else {
      toast.error(result.error || 'Erro ao excluir.')
    }
    setIsDeleting(null)
  }

  const getStatusBadge = (status: Lead['status']) => {
    const styles = {
      novo: 'bg-amber-100 text-amber-700 border-amber-200',
      em_contato: 'bg-blue-100 text-blue-700 border-blue-200',
      fechado: 'bg-green-100 text-green-700 border-green-200',
      sem_interesse: 'bg-red-100 text-red-700 border-red-200'
    }
    const labels = {
      novo: 'Novo',
      em_contato: 'Em Contato',
      fechado: 'Fechado',
      sem_interesse: 'Sem Interesse'
    }
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabela de Leads */}
      <div className="bg-card rounded-4xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Data</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Empresa / Resp.</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Telefone</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vaga / Cidade</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-primary">{format(new Date(lead.criado_em), 'dd/MM/yyyy')}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{format(new Date(lead.criado_em), 'HH:mm')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-primary truncate max-w-[200px]">{lead.nome_empresa}</p>
                    <p className="text-xs text-muted-foreground font-bold flex items-center gap-1.5 mt-0.5">
                      <User className="w-3 h-3" /> {lead.nome_responsavel}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <a 
                      href={`https://wa.me/55${lead.telefone}`} 
                      target="_blank"
                      className="text-xs font-bold text-accent hover:underline flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> {lead.telefone}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-primary uppercase tracking-tight">{lead.cargo_vaga}</p>
                    <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {lead.cidade}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block group/status">
                      {isUpdating === lead.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-accent" />
                      ) : (
                        getStatusBadge(lead.status)
                      )}
                      
                      {/* Hover Menu for Quick Status Change */}
                      <div className="absolute top-full left-0 mt-1 hidden group-hover/status:block z-50 bg-card border border-border rounded-xl shadow-xl p-1 w-40">
                        {['novo', 'em_contato', 'fechado', 'sem_interesse'].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(lead.id, s)}
                            className="w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-muted rounded-lg transition-colors"
                          >
                            {s.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                        title="Ver Detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        disabled={isDeleting === lead.id}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Excluir"
                      >
                        {isDeleting === lead.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-medium">
                    Nenhuma empresa interessada encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalhes */}
      {selectedLead && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-2xl rounded-[2.5rem] border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-primary tracking-tight">{selectedLead.nome_empresa}</h2>
                  {getStatusBadge(selectedLead.status)}
                </div>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            <div className="p-8 grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">Responsável</p>
                  <p className="text-sm font-bold text-primary flex items-center gap-2">
                    <User className="w-4 h-4 text-accent" /> {selectedLead.nome_responsavel}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">WhatsApp</p>
                  <a 
                    href={`https://wa.me/55${selectedLead.telefone}`} 
                    target="_blank"
                    className="text-sm font-bold text-accent hover:underline flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" /> {selectedLead.telefone}
                  </a>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">E-mail</p>
                  <p className="text-sm font-bold text-primary flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent" /> {selectedLead.email}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">Vaga Desejada</p>
                  <p className="text-sm font-bold text-primary flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-accent" /> {selectedLead.cargo_vaga}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">Cidade</p>
                  <p className="text-sm font-bold text-primary flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" /> {selectedLead.cidade}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">Data do Lead</p>
                  <p className="text-sm font-bold text-primary flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" /> {format(new Date(selectedLead.criado_em), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">Mensagem / Observações</p>
                <div className="bg-muted/30 p-4 rounded-2xl border border-border min-h-[100px]">
                  <p className="text-sm font-medium text-primary whitespace-pre-wrap leading-relaxed italic opacity-80">
                    {selectedLead.mensagem || "Nenhuma observação enviada."}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-muted/20 border-t border-border flex justify-end gap-3">
              <button 
                onClick={() => setSelectedLead(null)}
                className="px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
              >
                Fechar
              </button>
              <a 
                href={`https://wa.me/55${selectedLead.telefone}`} 
                target="_blank"
                className="flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
              >
                <MessageSquare className="w-4 h-4" /> Atender no WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
