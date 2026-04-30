import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  UserCircle2, 
  FileText, 
  Send, 
  ChevronRight, 
  Briefcase,
  AlertCircle
} from 'lucide-react'

export default async function MinhaAreaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Buscar dados do candidato
  const { data: candidato } = await supabase
    .from('candidatos')
    .select('id, nome, curriculo_json, curriculo_url')
    .eq('user_id', user.id)
    .single()

  // Buscar candidaturas
  const { count: totalCandidaturas } = await supabase
    .from('candidaturas')
    .select('*', { count: 'exact', head: true })
    .eq('candidato_id', (candidato as any)?.id)

  const hasResume = !!(candidato?.curriculo_url || candidato?.curriculo_json)

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight mb-1">Olá, {candidato?.nome || 'Candidato'}</h1>
        <p className="text-muted-foreground text-sm font-medium opacity-70">Bem-vindo à sua área exclusiva.</p>
      </div>

      {!hasResume && (
        <div className="bg-accent/10 border border-accent/20 p-5 rounded-xl flex items-center gap-4 text-accent">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-sm">Seu currículo ainda não está completo!</p>
            <p className="text-xs opacity-80">Complete seu perfil e envie seu currículo para se candidatar às melhores vagas.</p>
          </div>
          <Link 
            href="/candidato/curriculo"
            className="bg-accent text-accent-foreground px-5 py-2 rounded-lg font-black text-xs hover:scale-105 transition-all shadow-md shadow-accent/10 whitespace-nowrap"
          >
            Completar Agora
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex flex-col items-center text-center group">
          <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-4 text-accent group-hover:scale-110 transition-transform">
            <Send className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Candidaturas Ativas</p>
          <p className="text-3xl font-black text-primary">{totalCandidaturas || 0}</p>
        </div>

        {/* Link Perfil */}
        <Link 
          href="/candidato/perfil"
          className="bg-card p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-lg hover:border-accent/40 transition-all group flex flex-col h-full"
        >
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent group-hover:bg-accent group-hover:text-white transition-all">
            <UserCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-primary mb-1">Meu Perfil</h3>
          <p className="text-xs text-muted-foreground font-medium mb-4 flex-1">Mantenha seus dados de contato e localização sempre atualizados.</p>
          <div className="flex items-center gap-2 text-accent font-black text-[10px] uppercase tracking-widest">
            Acessar Perfil <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Link Currículo */}
        <Link 
          href="/candidato/curriculo"
          className="bg-card p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-lg hover:border-accent/40 transition-all group flex flex-col h-full"
        >
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent group-hover:bg-accent group-hover:text-white transition-all">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-primary mb-1">Currículo</h3>
          <p className="text-xs text-muted-foreground font-medium mb-4 flex-1">Edite sua experiência, formação e habilidades no nosso construtor.</p>
          <div className="flex items-center gap-2 text-accent font-black text-[10px] uppercase tracking-widest">
            Editar Currículo <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* CTA Vagas */}
      <div className="bg-primary rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-primary/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent opacity-20 blur-3xl -mr-24 -mt-24" />
        <div className="max-w-xl relative">
          <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-tight leading-tight">Encontre sua próxima grande oportunidade.</h2>
          <p className="text-white/70 text-sm mb-8 leading-relaxed">
            Temos centenas de vagas abertas esperando por um talento como o seu. Comece sua busca agora mesmo!
          </p>
          <Link 
            href="/vagas" 
            className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground px-8 py-3 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-accent/20"
          >
            <Briefcase className="w-4 h-4" /> Explorar Vagas
          </Link>
        </div>
      </div>
    </div>
  )
}
