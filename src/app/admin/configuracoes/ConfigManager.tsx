'use client'

import { useState } from 'react'
import { Settings, Shield, UserCircle, Phone, Layout } from 'lucide-react'
import { ConfigWhatsApp } from './ConfigWhatsApp'
import { ConfigLandingPage } from './ConfigLandingPage'
import { ConfigGeral } from './ConfigGeral'
import { ConfigSeguranca } from './ConfigSeguranca'
import { ConfigPerfil } from './ConfigPerfil'

interface Props {
  initialConfigs: any
}

export function ConfigManager({ initialConfigs }: Props) {
  const [activeTab, setActiveTab] = useState('landing')

  const tabs = [
    { id: 'landing', label: 'Landing Page / Rodapé', icon: Layout },
    { id: 'whatsapp', label: 'WhatsApp / Leads', icon: Phone },
    { id: 'geral', label: 'Geral', icon: Settings },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'perfil', label: 'Perfil Admin', icon: UserCircle },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Menu Lateral de Configs */}
      <div className="lg:col-span-1 space-y-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all ${
              activeTab === item.id
                ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/10' 
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
        <div className="bg-secondary rounded-sm border-none p-8 md:p-10 shadow-sm min-h-[500px]">
          {activeTab === 'whatsapp' && <ConfigWhatsApp initialConfigs={initialConfigs} />}
          {activeTab === 'landing' && <ConfigLandingPage initialConfigs={initialConfigs} />}
          {activeTab === 'geral' && <ConfigGeral initialConfigs={initialConfigs} />}
          {activeTab === 'seguranca' && <ConfigSeguranca initialConfigs={initialConfigs} />}
          {activeTab === 'perfil' && <ConfigPerfil />}
        </div>
      </div>
    </div>
  )
}
