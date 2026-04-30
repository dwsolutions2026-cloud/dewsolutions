'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Plus, Pencil, Trash2, CheckCircle, XCircle, MapPin, Users, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { createVagaAdminAction, updateVagaStatusAction, deleteVagaAdminAction, updateVagaAdminAction } from '@/app/actions/vagas'
import { AREAS_TRABALHO, REGIMES, MODALIDADES, ESTADOS_BR } from '@/lib/constants'

interface Vaga {
  id: string
  titulo: string
  area: string | null
  cidade: string | null
  estado: string | null
  status: string
  created_at: string
  regime: string | null
  modalidade: string | null
  quantidade_vagas: number | null
  salario_min: number | null
  salario_max: number | null
  exibir_salario: boolean
  descricao: string
  requisitos: string | null
  beneficios: string | null
  empresa_id: string
  empresa: { id: string; nome: string } | null
  candidaturas: { count: number }[]
}

interface Empresa {
  id: string
  nome: string
}

interface Props {
  vagas: Vaga[]
  empresas: Empresa[]
  error?: string
}

function VagaForm({
  empresas,
  vaga,
  onCancel,
}: {
  empresas: Empresa[]
  vaga?: Vaga
  onCancel: () => void
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = vaga
      ? await updateVagaAdminAction(vaga.id, formData)
      : await createVagaAdminAction(formData)
    setLoading(false)
    if (result?.error) {
      setMsg(result.error)
    } else {
      router.refresh()
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-accent/30 shadow-sm p-6 space-y-5">
      <h3 className="font-serif font-bold text-lg text-primary">
        {vaga ? 'Editar Vaga' : 'Nova Vaga'}
      </h3>

      {msg && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{msg}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Empresa */}
        {!vaga && (
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">Empresa *</label>
            <select name="empresa_id" required defaultValue="" className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-accent outline-none">
              <option value="" disabled>Selecione a empresa...</option>
              {empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
            </select>
          </div>
        )}

        {/* Título */}
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Título da Vaga *</label>
          <input name="titulo" required defaultValue={vaga?.titulo} placeholder="Ex: Analista de Recursos Humanos" className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
        </div>

        {/* Área */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Área de Trabalho *</label>
          <select name="area" required defaultValue={vaga?.area || ''} className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-accent outline-none">
            <option value="" disabled>Selecione a área...</option>
            {AREAS_TRABALHO.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Quantidade de vagas */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Quantidade de Vagas</label>
          <input name="quantidade_vagas" type="number" min={1} defaultValue={vaga?.quantidade_vagas || 1} className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
        </div>

        {/* Regime */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Regime de Contratação</label>
          <select name="regime" defaultValue={vaga?.regime || ''} className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-accent outline-none">
            <option value="">Selecione...</option>
            {REGIMES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Modalidade */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Modalidade</label>
          <select name="modalidade" defaultValue={vaga?.modalidade || ''} className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-accent outline-none">
            <option value="">Selecione...</option>
            {MODALIDADES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Cidade */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Cidade</label>
          <input name="cidade" defaultValue={vaga?.cidade || ''} placeholder="Ex: São Paulo" className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
        </div>

        {/* Estado */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Estado</label>
          <select name="estado" defaultValue={vaga?.estado || ''} className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-accent outline-none">
            <option value="">Selecione...</option>
            {ESTADOS_BR.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Salário */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Salário Mínimo (R$)</label>
          <input name="salario_min" type="number" step="0.01" defaultValue={vaga?.salario_min || ''} placeholder="Ex: 3000" className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Salário Máximo (R$)</label>
          <input name="salario_max" type="number" step="0.01" defaultValue={vaga?.salario_max || ''} placeholder="Ex: 5000" className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input type="checkbox" name="exibir_salario" defaultChecked={vaga?.exibir_salario} className="rounded border-border accent-yellow-600" />
            Exibir faixa salarial publicamente
          </label>
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Descrição da Vaga *</label>
          <textarea name="descricao" required rows={4} defaultValue={vaga?.descricao} placeholder="Descreva a função, responsabilidades e o dia a dia do cargo..." className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-accent outline-none resize-none" />
        </div>

        {/* Requisitos */}
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Requisitos</label>
          <textarea name="requisitos" rows={3} defaultValue={vaga?.requisitos || ''} placeholder="Ex: Ensino superior completo, experiência mínima de 2 anos..." className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-accent outline-none resize-none" />
        </div>

        {/* Benefícios */}
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Benefícios</label>
          <textarea name="beneficios" rows={2} defaultValue={vaga?.beneficios || ''} placeholder="Ex: VT, VR, Plano de Saúde, Gympass..." className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:ring-2 focus:ring-accent outline-none resize-none" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent/90 disabled:opacity-60 transition-colors">
          {loading ? 'Salvando...' : vaga ? 'Salvar Alterações' : 'Publicar Vaga'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function VagasAdminClient({ vagas, empresas, error }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editingVaga, setEditingVaga] = useState<Vaga | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleToggleStatus = async (vaga: Vaga) => {
    setLoadingId(vaga.id)
    const newStatus = vaga.status === 'ativa' ? 'encerrada' : 'ativa'
    await updateVagaStatusAction(vaga.id, newStatus)
    setLoadingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta vaga? Todos os candidatos inscritos serão removidos.')) return
    setLoadingId(id)
    await deleteVagaAdminAction(id)
    setLoadingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-primary">Gestão de Vagas</h1>
          <p className="text-muted-foreground mt-1">Crie, edite e gerencie todas as vagas da plataforma.</p>
        </div>
        {!showForm && !editingVaga && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Nova Vaga
          </button>
        )}
      </div>

      {/* Formulário Nova Vaga */}
      {showForm && (
        <VagaForm empresas={empresas} onCancel={() => setShowForm(false)} />
      )}

      {/* Formulário Edição */}
      {editingVaga && (
        <VagaForm vaga={editingVaga} empresas={empresas} onCancel={() => setEditingVaga(null)} />
      )}

      {/* Tabela */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-red-500">
            <p className="font-bold">Erro ao carregar vagas:</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        ) : vagas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b border-border text-sm text-muted-foreground">
                  <th className="p-4 font-medium">Vaga / Empresa</th>
                  <th className="p-4 font-medium">Área / Local</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-center">Vagas / Candidatos</th>
                  <th className="p-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {vagas.map((vaga) => {
                  const candidaturasCount = vaga.candidaturas[0]?.count || 0
                  const isLoading = loadingId === vaga.id

                  return (
                    <tr key={vaga.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-primary">{vaga.titulo}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">{vaga.empresa?.nome}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(vaga.created_at).toLocaleDateString('pt-BR')}
                          {vaga.regime && ` · ${vaga.regime}`}
                          {vaga.modalidade && ` · ${vaga.modalidade}`}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {vaga.area && <div className="font-medium text-primary text-xs mb-1">{vaga.area}</div>}
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {vaga.cidade ? `${vaga.cidade} - ${vaga.estado}` : 'Não informado'}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          vaga.status === 'ativa' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {vaga.status === 'ativa' ? 'Ativa' : 'Encerrada'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="text-sm font-bold text-primary">{vaga.quantidade_vagas || 1}</div>
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />{candidaturasCount}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/vagas/${vaga.id}`} target="_blank" title="Ver vaga pública" className="p-1.5 text-muted-foreground hover:text-accent rounded-md transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setEditingVaga(vaga)} title="Editar" className="p-1.5 text-muted-foreground hover:text-blue-600 rounded-md transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(vaga)}
                            disabled={isLoading}
                            title={vaga.status === 'ativa' ? 'Encerrar vaga' : 'Reativar vaga'}
                            className={`p-1.5 rounded-md transition-colors ${vaga.status === 'ativa' ? 'text-muted-foreground hover:text-amber-600' : 'text-muted-foreground hover:text-green-600'}`}
                          >
                            {vaga.status === 'ativa' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(vaga.id)}
                            disabled={isLoading}
                            title="Excluir vaga"
                            className="p-1.5 text-muted-foreground hover:text-red-600 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-primary mb-2">Nenhuma vaga publicada</h3>
            <p>Clique em "Nova Vaga" para criar a primeira.</p>
          </div>
        )}
      </div>
    </div>
  )
}
