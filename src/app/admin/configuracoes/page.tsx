import { Settings, Shield, Bell, UserCircle, Save } from 'lucide-react'

export default function AdminConfiguracoesPage() {
  const inputClass = "w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
  const labelClass = "text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1 mb-1.5 block opacity-70"

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight mb-1">Configurações do Sistema</h1>
        <p className="text-muted-foreground text-sm font-medium opacity-70">Gerencie as preferências e parâmetros globais da plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Menu Lateral de Configs */}
        <div className="md:col-span-1 space-y-2">
          {[
            { label: 'Geral', icon: Settings, active: true },
            { label: 'Segurança', icon: Shield, active: false },
            { label: 'Notificações', icon: Bell, active: false },
            { label: 'Perfil Admin', icon: UserCircle, active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all ${
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
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card rounded-[2rem] border border-border p-8 shadow-sm space-y-8">
            <section className="space-y-6">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest border-b border-border pb-4">Preferências Gerais</h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1.5">
                  <label className={labelClass}>Nome da Plataforma</label>
                  <div className="relative">
                    <Settings className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input className={inputClass} defaultValue="Plataforma de Vagas" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>E-mail de Suporte</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input className={inputClass} defaultValue="suporte@plataforma.com" />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-primary">Manutenção do Sistema</p>
                  <p className="text-[10px] text-muted-foreground">Ativa o modo de manutenção para todos os usuários.</p>
                </div>
                <div className="w-10 h-5 bg-muted rounded-full relative cursor-pointer border border-border">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-muted-foreground rounded-full" />
                </div>
              </div>
            </section>

            <div className="pt-4 flex justify-end">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/10">
                <Save className="w-3.5 h-3.5" /> Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
