'use client'


// Refresh trigger
import { useState } from 'react'
import { Settings, Save, Globe, Mail, Image as ImageIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { updateConfiguracoesAction } from '@/app/actions/oportunidades'

export function ConfigGeral({ initialConfigs }: { initialConfigs: any }) {
  const [loading, setLoading] = useState(false)
  const [configs, setConfigs] = useState({
    site_name: initialConfigs.site_name || 'D&W Solutions',
    support_email: initialConfigs.support_email || 'suporte@dwsolutions.com.br',
    site_description: initialConfigs.site_description || 'Soluções inteligentes em recrutamento e seleção.',
    logo_url: initialConfigs.logo_url || '',
  })

  async function handleSave() {
    setLoading(true)
    try {
      const { error } = await updateConfiguracoesAction(configs)
      if (error) throw new Error(error)
      toast.success('Configurações gerais atualizadas!')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar configurações.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <Settings className="w-4 h-4 text-accent" /> Configurações Gerais
          </h3>
          <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Informações básicas da plataforma</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-accent text-accent-foreground px-6 py-2 rounded-sm font-black text-[10px] uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2">
            <Globe className="w-3 h-3" /> Nome do Site
          </label>
          <input
            type="text"
            value={configs.site_name}
            onChange={(e) => setConfigs({ ...configs, site_name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-sm bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2">
            <Mail className="w-3 h-3" /> E-mail de Suporte
          </label>
          <input
            type="email"
            value={configs.support_email}
            onChange={(e) => setConfigs({ ...configs, support_email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-sm bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2">
            <Settings className="w-3 h-3" /> Descrição Curta (SEO)
          </label>
          <textarea
            rows={3}
            value={configs.site_description}
            onChange={(e) => setConfigs({ ...configs, site_description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-sm bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium resize-none"
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2">
            <ImageIcon className="w-3 h-3" /> URL do Logo (Opcional)
          </label>
          <input
            type="text"
            value={configs.logo_url}
            onChange={(e) => setConfigs({ ...configs, logo_url: e.target.value })}
            placeholder="https://exemplo.com/logo.png"
            className="w-full px-4 py-2.5 rounded-sm bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
          />
        </div>
      </div>
    </div>
  )
}
