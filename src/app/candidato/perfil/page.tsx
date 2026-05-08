import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  ArrowLeft,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'
import { AvatarUpload } from '@/components/candidato/AvatarUpload'

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
    <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link 
            href="/candidato/minha-area" 
            className="group flex items-center gap-2 text-muted-foreground hover:text-accent transition-all font-bold text-xs mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" /> 
            VOLTAR PARA MINHA ÁREA
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-accent rounded-full hidden md:block" />
            <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight">Meu Perfil</h1>
          </div>
        </div>

        <Link 
          href="/candidato/perfil/editar"
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-[10px] uppercase tracking-[0.2em]"
        >
          <Edit3 className="w-4 h-4" /> Atualizar Dados
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card Lateral: Foto e Status */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-card rounded-[3rem] border border-border p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <AvatarUpload 
              currentUrl={candidato.avatar_url} 
              userName={candidato.nome} 
            />

            <div className="mt-8 pt-8 border-t border-border/50 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Status da Conta</span>
                <span className="text-green-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verificado
                </span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full w-[100%] rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
              </div>
              <p className="text-[9px] text-center text-muted-foreground italic font-medium">Perfil 100% completo e visível</p>
            </div>
          </div>

          <div className="bg-accent/5 rounded-[2.5rem] border border-accent/10 p-8 space-y-4">
            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent">
              <ShieldCheck className="w-4 h-4" /> Privacidade & LGPD
            </h4>
            <p className="text-[11px] leading-relaxed text-primary/70 font-medium">
              Seus dados estão protegidos sob a LGPD. Apenas empresas parceiras da D&W Solutions podem visualizar seu perfil completo durante processos seletivos ativos.
            </p>
          </div>
        </div>

        {/* Informações Principais */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-[3rem] border border-border p-10 shadow-sm h-full">
            <div className="mb-10 flex items-center gap-3">
              <UserIcon className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary/80">Dados Pessoais</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
              <InfoItem 
                icon={Mail} 
                label="E-mail de Acesso" 
                value={candidato.email} 
              />
              <InfoItem 
                icon={Phone} 
                label="Telefone / WhatsApp" 
                value={candidato.telefone || 'Não informado'} 
              />
              <InfoItem 
                icon={MapPin} 
                label="Localização Atual" 
                value={`${candidato.cidade || 'Não informada'} - ${candidato.estado || 'UF'}`} 
              />
              <InfoItem 
                icon={Calendar} 
                label="Membro da Plataforma" 
                value={new Date(candidato.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} 
              />
            </div>

            <div className="mt-16 pt-10 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-1">Currículo Ativo</h4>
                  <p className="text-[11px] text-muted-foreground font-medium">Última atualização: {new Date(candidato.updated_at || candidato.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
                <Link 
                  href="/candidato/curriculo/editar"
                  className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline"
                >
                  Ver Currículo Completo →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-300">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1.5 opacity-60">{label}</p>
        <p className="text-base font-bold text-primary group-hover:text-accent transition-colors">{value}</p>
      </div>
    </div>
  )
}

