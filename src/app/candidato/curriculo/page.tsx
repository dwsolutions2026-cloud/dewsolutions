import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { FileText, Plus, Eye, Download, Info } from 'lucide-react'
import Link from 'next/link'

export default async function CurriculoCandidatoPage() {
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
        <h1 className="text-3xl font-serif font-bold text-primary">Meu Currículo</h1>
        <p className="text-muted-foreground text-sm">Visualize seu currículo atual ou crie um novo usando nossa plataforma.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Opção 1: Currículo em PDF */}
        <div className="bg-white rounded-2xl border border-border p-8 flex flex-col items-center text-center shadow-sm hover:border-accent/40 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
            <FileText className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">Arquivo PDF</h3>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Se você já possui um currículo pronto em PDF, pode visualizá-lo ou substituí-lo aqui.
          </p>

          {candidato.curriculo_url ? (
            <div className="w-full space-y-3">
              <Link
                href={`/api/curriculo/${candidato.curriculo_url}`}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-white rounded-xl font-bold text-sm hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
              >
                <Eye className="w-4 h-4" /> Visualizar PDF
              </Link>
              <button className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                Substituir arquivo (PDF)
              </button>
            </div>
          ) : (
            <button className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-border text-muted-foreground rounded-xl font-bold text-sm hover:border-accent hover:text-accent transition-all">
              <Plus className="w-4 h-4" /> Enviar PDF
            </button>
          )}
        </div>

        {/* Opção 2: Currículo Interno */}
        <div className="bg-[#0D0D0D] rounded-2xl p-8 flex flex-col items-center text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] flex items-center justify-center mb-6">
            <div className="text-[#D4AF37] font-black text-xl">D&W</div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Currículo Interno</h3>
          <p className="text-[#525252] text-sm mb-8 leading-relaxed">
            Crie um currículo profissional em nossa plataforma e aumente suas chances de ser selecionado.
          </p>

          <Link
            href="/candidato/curriculo/novo"
            className="flex items-center justify-center gap-2 w-full py-3 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-bold text-sm hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all"
          >
            <Plus className="w-4 h-4" /> Criar Currículo D&W
          </Link>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-[#525252] font-medium">
            <Info className="w-3 h-3" />
            Empresas preferem currículos padronizados
          </div>
        </div>
      </div>
    </div>
  )
}
