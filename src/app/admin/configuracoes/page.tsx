'use client'

import { useState, useEffect } from 'react'
import { Settings, Shield, Bell, UserCircle, Phone, Layout } from 'lucide-react'
import { getConfiguracoes } from '@/app/actions/oportunidades'
import { ConfigWhatsApp } from './ConfigWhatsApp'
import { ConfigLandingPage } from './ConfigLandingPage'

export default function AdminConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('landing')
  const [configs, setConfigs] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getConfiguracoes()
      setConfigs(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'landing', label: 'Landing Page / Rodapé', icon: Layout },
    { id: 'whatsapp', label: 'WhatsApp / Leads', icon: Phone },
    { id: 'geral', label: 'Geral', icon: Settings, disabled: true },
    { id: 'seguranca', label: 'Segurança', icon: Shield, disabled: true },
    { id: 'perfil', label: 'Perfil Admin', icon: UserCircle, disabled: true },
  ]

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight mb-1">Configurações do Sistema</h1>
        <p className="text-muted-foreground text-sm font-medium opacity-70">Gerencie as preferências e parâmetros globais da plataforma.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu Lateral de Configs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              disabled={item.disabled}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                activeTab === item.id
                  ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/10' 
                  : item.disabled 
                    ? 'opacity-30 cursor-not-allowed'
                    : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Painel de Conteúdo */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-10 shadow-sm min-h-[500px]">
            {activeTab === 'whatsapp' && <ConfigWhatsApp initialConfigs={configs} />}
            {activeTab === 'landing' && <ConfigLandingPage initialConfigs={configs} />}
            
            {activeTab === 'geral' && (
              <div className="text-center py-20 opacity-50">
                <Settings className="w-12 h-12 mx-auto mb-4" />
                <p className="font-bold uppercase tracking-widest text-xs">Configurações Gerais em Breve</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
