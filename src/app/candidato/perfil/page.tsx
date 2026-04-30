import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react'

export default async function PerfilCandidatoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: candidato } = await supabase
    .from('candidatos')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!candidato) return <div>Perfil não encontrado.</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Minhas Informações</h1>
        <p className="text-muted-foreground text-sm">Gerencie seus dados pessoais e de contato.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-8 bg-muted/30 border-b border-border flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-accent/20">
            {candidato.nome.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">{candidato.nome}</h2>
            <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4" /> {candidato.email}
            </p>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground block mb-2">Telefone de Contato</label>
              <div className="flex items-center gap-3 text-primary font-bold">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </div>
                {candidato.telefone || 'Não informado'}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground block mb-2">Localização</label>
              <div className="flex items-center gap-3 text-primary font-bold">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                </div>
                {candidato.cidade} - {candidato.estado}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-green-800 font-bold mb-1 text-sm">Privacidade LGPD</h4>
                  <p className="text-green-700/70 text-xs leading-relaxed">
                    Seus dados estão protegidos conforme a LGPD. 
                    Aceito em: {new Date(candidato.lgpd_aceito_em).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
            
            <Link 
              href="/candidato/perfil/editar"
              className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              Editar Informações
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
