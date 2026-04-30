import { Settings, Shield, Bell, UserCircle, Phone } from 'lucide-react'
import { getConfiguracoes } from '@/app/actions/oportunidades'
import { ConfigWhatsApp } from './ConfigWhatsApp'

export default async function AdminConfiguracoesPage() {
  const initialConfigs = await getConfiguracoes()

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight mb-1">Configurações do Sistema</h1>
        <p className="text-muted-foreground text-sm font-medium opacity-70">Gerencie as preferências e parâmetros globais da plataforma.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu Lateral de Configs */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { label: 'Geral', icon: Settings, active: false },
            { label: 'WhatsApp / Leads', icon: Phone, active: true },
            { label: 'Segurança', icon: Shield, active: false },
            { label: 'Notificações', icon: Bell, active: false },
            { label: 'Perfil Admin', icon: UserCircle, active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                item.active 
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
          <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-10 shadow-sm">
            <ConfigWhatsApp initialConfigs={initialConfigs} />
          </div>
        </div>
      </div>
    </div>
  )
}
