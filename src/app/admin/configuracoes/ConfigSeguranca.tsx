'use client'


// Refresh trigger
import { useState } from 'react'
import { Shield, Lock, Eye, EyeOff, UserPlus, Power } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { updateConfiguracoesAction } from '@/app/actions/oportunidades'

export function ConfigSeguranca({ initialConfigs }: { initialConfigs: any }) {
  const [loading, setLoading] = useState(false)
  const [configs, setConfigs] = useState({
    manutencao: initialConfigs.manutencao === 'true',
    bloquear_cadastro: initialConfigs.bloquear_cadastro === 'true',
    senha_min_length: initialConfigs.senha_min_length || '8',
    log_retention_days: initialConfigs.log_retention_days || '30',
  })

  async function handleSave() {
    setLoading(true)
    try {
      const payload = {
        ...configs,
        manutencao: String(configs.manutencao),
        bloquear_cadastro: String(configs.bloquear_cadastro),
      }
      const { error } = await updateConfiguracoesAction(payload)
      if (error) throw new Error(error)
      toast.success('Configurações de segurança atualizadas!')
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
            <Shield className="w-4 h-4 text-accent" /> Segurança e Acesso
          </h3>
          <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Políticas de sistema e visibilidade</p>
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
        <div 
          onClick={() => setConfigs({ ...configs, manutencao: !configs.manutencao })}
          className={`p-6 rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
            configs.manutencao 
              ? 'bg-red-500/10 border-red-500/50' 
              : 'bg-background border-border hover:border-accent/50'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-sm ${configs.manutencao ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground'}`}>
              <Power className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Modo Manutenção</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase">{configs.manutencao ? 'O site está offline para o público' : 'O site está online'}</p>
            </div>
          </div>
          <div className={`w-10 h-5 rounded-full p-1 transition-all ${configs.manutencao ? 'bg-red-500' : 'bg-muted'}`}>
            <div className={`w-3 h-3 bg-white rounded-full transition-all ${configs.manutencao ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </div>

        <div 
          onClick={() => setConfigs({ ...configs, bloquear_cadastro: !configs.bloquear_cadastro })}
          className={`p-6 rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
            configs.bloquear_cadastro 
              ? 'bg-amber-500/10 border-amber-500/50' 
              : 'bg-background border-border hover:border-accent/50'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-sm ${configs.bloquear_cadastro ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground'}`}>
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Bloquear Novos Cadastros</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase">{configs.bloquear_cadastro ? 'Cadastros desativados' : 'Novos usuários permitidos'}</p>
            </div>
          </div>
          <div className={`w-10 h-5 rounded-full p-1 transition-all ${configs.bloquear_cadastro ? 'bg-amber-500' : 'bg-muted'}`}>
            <div className={`w-3 h-3 bg-white rounded-full transition-all ${configs.bloquear_cadastro ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2">
            <Lock className="w-3 h-3" /> Tamanho Mínimo da Senha
          </label>
          <select
            value={configs.senha_min_length}
            onChange={(e) => setConfigs({ ...configs, senha_min_length: e.target.value })}
            className="w-full px-4 py-2.5 rounded-sm bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
          >
            <option value="6">6 caracteres</option>
            <option value="8">8 caracteres (Recomendado)</option>
            <option value="12">12 caracteres (Forte)</option>
            <option value="16">16 caracteres (Máxima)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2">
            <Eye className="w-3 h-3" /> Retenção de Logs (Dias)
          </label>
          <input
            type="number"
            value={configs.log_retention_days}
            onChange={(e) => setConfigs({ ...configs, log_retention_days: e.target.value })}
            className="w-full px-4 py-2.5 rounded-sm bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
          />
        </div>
      </div>
    </div>
  )
}
