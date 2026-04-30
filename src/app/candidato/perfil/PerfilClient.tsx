'use client'

import { useState } from 'react'
import { 
  User, Briefcase, GraduationCap, Plus, Trash2, FileText, 
  CheckCircle, MapPin, Phone, Mail
} from 'lucide-react'
import { addExperienciaAction, deleteExperienciaAction, addFormacaoAction, deleteFormacaoAction } from '@/app/actions/candidato'

interface Candidato {
  id: string
  nome: string
  email: string
  telefone: string | null
  cidade: string | null
  estado: string | null
  curriculo_url: string | null
}

interface Experiencia {
  id: string
  empresa: string
  cargo: string
  inicio: string
  fim: string | null
  atual: boolean
  descricao: string | null
}

interface Formacao {
  id: string
  instituicao: string
  curso: string
  nivel: string | null
  conclusao: string | null
}

interface Props {
  candidato: Candidato
  experiencias: Experiencia[]
  formacoes: Formacao[]
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  return `${month}/${year}`
}

export function PerfilClient({ candidato, experiencias, formacoes }: Props) {
  const [activeTab, setActiveTab] = useState<'perfil' | 'experiencias' | 'formacao'>('perfil')
  const [showExpForm, setShowExpForm] = useState(false)
  const [showFormForm, setShowFormForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleAddExp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await addExperienciaAction(formData)
    setLoading(false)
    if (result?.error) {
      setMsg({ type: 'error', text: result.error })
    } else {
      setMsg({ type: 'success', text: 'Experiência adicionada!' })
      setShowExpForm(false);
      (e.target as HTMLFormElement).reset()
    }
    setTimeout(() => setMsg(null), 3000)
  }

  const handleDeleteExp = async (id: string) => {
    if (!confirm('Remover esta experiência?')) return
    await deleteExperienciaAction(id)
  }

  const handleAddForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await addFormacaoAction(formData)
    setLoading(false)
    if (result?.error) {
      setMsg({ type: 'error', text: result.error })
    } else {
      setMsg({ type: 'success', text: 'Formação adicionada!' })
      setShowFormForm(false);
      (e.target as HTMLFormElement).reset()
    }
    setTimeout(() => setMsg(null), 3000)
  }

  const handleDeleteForm = async (id: string) => {
    if (!confirm('Remover esta formação?')) return
    await deleteFormacaoAction(id)
  }

  const tabs = [
    { id: 'perfil', label: 'Meu Perfil', icon: User },
    { id: 'experiencias', label: 'Experiências', icon: Briefcase },
    { id: 'formacao', label: 'Formação', icon: GraduationCap },
  ] as const

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header do Perfil */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent shrink-0">
          {candidato.nome.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-serif font-bold text-primary">{candidato.nome}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{candidato.email}</span>
            {candidato.telefone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{candidato.telefone}</span>}
            {candidato.cidade && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{candidato.cidade} - {candidato.estado}</span>}
          </div>
        </div>
        {candidato.curriculo_url ? (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 shrink-0">
            <FileText className="w-3.5 h-3.5" /> PDF Anexado
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 shrink-0">
            <Plus className="w-3.5 h-3.5" /> Currículo Online
          </span>
        )}
      </div>

      {/* Feedback */}
      {msg && (
        <div className={`p-3 rounded-lg text-sm text-center font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Aba: Perfil */}
      {activeTab === 'perfil' && (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-primary">Seus Dados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div><p className="text-muted-foreground text-xs mb-1">Nome</p><p className="font-medium">{candidato.nome}</p></div>
            <div><p className="text-muted-foreground text-xs mb-1">E-mail</p><p className="font-medium">{candidato.email}</p></div>
            <div><p className="text-muted-foreground text-xs mb-1">Telefone</p><p className="font-medium">{candidato.telefone || 'Não informado'}</p></div>
            <div><p className="text-muted-foreground text-xs mb-1">Localização</p><p className="font-medium">{candidato.cidade ? `${candidato.cidade} - ${candidato.estado}` : 'Não informado'}</p></div>
          </div>
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-primary mb-3">Status do Currículo</h3>
            {candidato.curriculo_url ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-700">Currículo PDF anexado</p>
                  <p className="text-xs text-green-600">Seu PDF está salvo e visível para as empresas parceiras</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
                <Plus className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-700">Currículo online em andamento</p>
                  <p className="text-xs text-amber-600">Preencha suas experiências e formação nas abas acima para seu perfil ficar completo</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Aba: Experiências */}
      {activeTab === 'experiencias' && (
        <div className="space-y-4">
          {experiencias.length === 0 && !showExpForm && (
            <div className="bg-white rounded-2xl border border-border p-8 text-center text-muted-foreground">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Nenhuma experiência cadastrada ainda.</p>
            </div>
          )}
          {experiencias.map(exp => (
            <div key={exp.id} className="bg-white rounded-2xl border border-border shadow-sm p-5 flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">{exp.cargo}</h3>
                  <p className="text-sm text-muted-foreground">{exp.empresa}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(exp.inicio)} — {exp.atual ? 'Atualmente' : formatDate(exp.fim)}
                  </p>
                  {exp.descricao && <p className="text-sm mt-2 text-muted-foreground">{exp.descricao}</p>}
                </div>
              </div>
              <button onClick={() => handleDeleteExp(exp.id)} className="text-red-400 hover:text-red-600 p-1 shrink-0 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {showExpForm ? (
            <form onSubmit={handleAddExp} className="bg-white rounded-2xl border border-accent/30 shadow-sm p-6 space-y-4">
              <h3 className="font-semibold text-primary">Nova Experiência</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Cargo *</label>
                  <input name="cargo" required placeholder="Ex: Analista de RH" className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Empresa *</label>
                  <input name="empresa" required placeholder="Nome da empresa" className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Início *</label>
                  <input name="inicio" type="month" required className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Fim (deixe vazio se ainda trabalha)</label>
                  <input name="fim" type="month" className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input type="checkbox" name="atual" className="rounded border-border accent-yellow-600" />
                    Trabalho aqui atualmente
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">Descrição das atividades</label>
                  <textarea name="descricao" rows={3} placeholder="Descreva brevemente suas responsabilidades..." className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="bg-accent text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 disabled:opacity-60 transition-colors">
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" onClick={() => setShowExpForm(false)} className="px-6 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <button onClick={() => setShowExpForm(true)} className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-border rounded-2xl text-sm text-muted-foreground hover:border-accent hover:text-accent transition-colors">
              <Plus className="w-4 h-4" /> Adicionar Experiência
            </button>
          )}
        </div>
      )}

      {/* Aba: Formação */}
      {activeTab === 'formacao' && (
        <div className="space-y-4">
          {formacoes.length === 0 && !showFormForm && (
            <div className="bg-white rounded-2xl border border-border p-8 text-center text-muted-foreground">
              <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Nenhuma formação cadastrada ainda.</p>
            </div>
          )}
          {formacoes.map(form => (
            <div key={form.id} className="bg-white rounded-2xl border border-border shadow-sm p-5 flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">{form.curso}</h3>
                  <p className="text-sm text-muted-foreground">{form.instituicao}</p>
                  {form.nivel && <span className="inline-block mt-1 text-xs bg-muted px-2 py-0.5 rounded-full">{form.nivel}</span>}
                  {form.conclusao && <p className="text-xs text-muted-foreground mt-1">Conclusão: {formatDate(form.conclusao)}</p>}
                </div>
              </div>
              <button onClick={() => handleDeleteForm(form.id)} className="text-red-400 hover:text-red-600 p-1 shrink-0 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {showFormForm ? (
            <form onSubmit={handleAddForm} className="bg-white rounded-2xl border border-accent/30 shadow-sm p-6 space-y-4">
              <h3 className="font-semibold text-primary">Nova Formação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Curso *</label>
                  <input name="curso" required placeholder="Ex: Administração de Empresas" className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Instituição *</label>
                  <input name="instituicao" required placeholder="Nome da faculdade/escola" className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Nível</label>
                  <select name="nivel" className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none bg-white">
                    <option value="">Selecione...</option>
                    <option>Ensino Médio</option>
                    <option>Técnico</option>
                    <option>Superior (Graduação)</option>
                    <option>Pós-Graduação</option>
                    <option>MBA</option>
                    <option>Mestrado</option>
                    <option>Doutorado</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Conclusão (ou previsão)</label>
                  <input name="conclusao" type="month" className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="bg-accent text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 disabled:opacity-60 transition-colors">
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" onClick={() => setShowFormForm(false)} className="px-6 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <button onClick={() => setShowFormForm(true)} className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-border rounded-2xl text-sm text-muted-foreground hover:border-accent hover:text-accent transition-colors">
              <Plus className="w-4 h-4" /> Adicionar Formação
            </button>
          )}
        </div>
      )}
    </div>
  )
}
