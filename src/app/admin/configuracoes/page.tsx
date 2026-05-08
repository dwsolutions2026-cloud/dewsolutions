import { getConfiguracoes } from '@/app/actions/oportunidades'
import { ConfigManager } from './ConfigManager'

export default async function AdminConfiguracoesPage() {
  const configs = await getConfiguracoes()

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight mb-1">Configurações do Sistema</h1>
        <p className="text-muted-foreground text-sm font-medium opacity-70">Gerencie as preferências e parâmetros globais da plataforma.</p>
      </div>

      <ConfigManager initialConfigs={configs} />
    </div>
  )
}
