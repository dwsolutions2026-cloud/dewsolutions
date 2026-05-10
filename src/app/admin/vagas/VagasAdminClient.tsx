'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Briefcase,
  MapPin,
  Building2,
  Users,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { updateVagaStatusAction, deleteVagaAdminAction } from '@/app/actions/vagas'
import { toast } from 'react-hot-toast'

interface Vaga {
  id: string
  titulo: string
  status: string
  cidade: string
  estado: string
  empresa: { nome: string }
  candidaturas: [{ count: number }]
}

interface Props {
  vagas: any[]
}

export function VagasAdminClient({ vagas }: Props) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    setLoadingId(id)
    const newStatus = currentStatus === 'ativa' ? 'encerrada' : 'ativa'
    const result = await updateVagaStatusAction(id, newStatus)

    if (result.success) {
      toast.success(`Vaga ${newStatus === 'ativa' ? 'ativada' : 'encerrada'} com sucesso!`)
      router.refresh()
    } else {
      toast.error(result.error || 'Erro ao alterar status')
    }
    setLoadingId(null)
  }

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`Tem certeza que deseja excluir permanentemente a vaga: ${titulo}?`)) return

    setLoadingId(id)
    const result = await deleteVagaAdminAction(id)

    if (result.success) {
      toast.success('Vaga excluída com sucesso!')
      router.refresh()
    } else {
      toast.error(result.error || 'Erro ao excluir vaga')
    }
    setLoadingId(null)
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {vagas.map((vaga) => (
        <div key={vaga.id} className="bg-secondary p-5 rounded-sm border-none hover:border-accent/30 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-sm flex items-center justify-center transition-all shadow-inner shrink-0 ${vaga.status === 'ativa'
                ? 'bg-muted text-accent group-hover:bg-accent group-hover:text-white'
                : 'bg-red-50 text-red-400'
                }`}>
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-black text-primary truncate">{vaga.titulo}</h3>
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> {vaga.empresa?.nome}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {vaga.cidade} - {vaga.estado}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] ${vaga.status === 'ativa' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {vaga.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 lg:border-l lg:border-border lg:pl-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-muted-foreground mb-0.5">Candidatos</span>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xl font-black text-primary">{vaga.candidaturas?.[0]?.count || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/vagas/${vaga.slug || vaga.id}/editar`}
                  className="p-2.5 bg-muted text-primary hover:bg-primary hover:text-white rounded-sm transition-all"
                  title="Editar Vaga"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleToggleStatus(vaga.id, vaga.status)}
                  disabled={loadingId === vaga.id}
                  className={`p-2.5 rounded-sm transition-all ${vaga.status === 'ativa'
                    ? 'bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white'
                    : 'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white'
                    }`}
                  title={vaga.status === 'ativa' ? 'Encerrar Vaga' : 'Reativar Vaga'}
                >
                  {loadingId === vaga.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    vaga.status === 'ativa' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => handleDelete(vaga.id, vaga.titulo)}
                  disabled={loadingId === vaga.id}
                  className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-sm transition-all"
                  title="Excluir Permanentemente"
                >
                  {loadingId === vaga.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>

                <Link
                  href={`/admin/candidatos?vaga=${vaga.id}`}
                  className="ml-1 px-4 py-2 bg-accent text-accent-foreground rounded-sm font-black text-[10px] uppercase tracking-widest transition-all shadow-md shadow-accent/10 hover:scale-105 active:scale-95"
                >
                  Candidatos
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
