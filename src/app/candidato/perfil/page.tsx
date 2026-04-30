import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  ArrowLeft 
} from 'lucide-react'

export default async function PerfilCandidatoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: candidato } = await supabase
    .from('candidatos')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!candidato) redirect('/candidato/minha-area')

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            href="/candidato/minha-area" 
            className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-xs mb-2.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar para Minha Área
          </Link>
          <h1 className="text-2xl font-black text-primary tracking-tight">Meu Perfil</h1>
          <p className="text-muted-foreground text-sm font-medium opacity-70">Suas informações pessoais e de contato.</p>
        </div>
        <Link 
          href="/candidato/perfil/editar"
          className="bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-black flex items-center gap-2 shadow-lg shadow-accent/20 hover:scale-105 transition-all text-xs uppercase tracking-widest"
        >
          <Edit3 className="w-4 h-4" /> Editar Perfil
        </Link>
      </div>

      <div className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm">
        <div className="p-8 bg-muted/30 border-b border-border flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-accent/20 mb-4">
            {candidato.nome.charAt(0)}
          </div>
          <h2 className="text-xl font-black text-primary mb-1">{candidato.nome}</h2>
          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[9px] font-black uppercase tracking-[0.2em]">
            Candidato Ativo
          </span>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-accent shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.15em] mb-0.5">E-mail de Contato</p>
                <p className="text-sm font-bold text-primary">{candidato.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-accent shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.15em] mb-0.5">Telefone / WhatsApp</p>
                <p className="text-sm font-bold text-primary">{candidato.telefone || 'Não informado'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-accent shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.15em] mb-0.5">Localização</p>
                <p className="text-sm font-bold text-primary">{candidato.cidade} - {candidato.estado}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-accent shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.15em] mb-0.5">Membro desde</p>
                <p className="text-sm font-bold text-primary uppercase">{new Date(candidato.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
