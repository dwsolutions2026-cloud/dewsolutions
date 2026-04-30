import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Edit, Briefcase, MapPin, CheckCircle, AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'Minha Área | D&W Solutions',
}

export default async function MinhaAreaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: candidato } = await supabase
    .from('candidatos')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!candidato) {
    return <div className="p-8">Perfil não encontrado.</div>
  }

  const { data: candidaturas } = await supabase
    .from('candidaturas')
    .select(`
      id,
      status,
      created_at,
      vaga:vagas(titulo, empresa:empresas(nome))
    `)
    .eq('candidato_id', candidato.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const hasPdf = !!candidato.curriculo_url
  const hasJson = !!candidato.curriculo_json

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Minha Área</h1>
        <p className="text-muted-foreground mt-2">Acompanhe seu status e suas candidaturas recentes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Perfil Summary */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm col-span-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-2xl">
              {candidato.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">{candidato.nome}</h2>
              {(candidato.cidade || candidato.estado) && (
                <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4" /> {candidato.cidade}{candidato.estado ? ` - ${candidato.estado}` : ''}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link href="/candidato/perfil/editar" className="flex-1 flex justify-center items-center gap-2 bg-muted hover:bg-muted/80 text-foreground py-2 rounded-lg text-sm font-medium transition-colors">
              <Edit className="w-4 h-4" /> Editar Perfil
            </Link>
          </div>
        </div>

        {/* Status do Currículo */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" /> Status do Currículo
            </h3>
            
            {hasPdf && (
              <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 p-4 rounded-lg border border-green-200 dark:border-green-900/50 mb-4">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Currículo em PDF enviado</p>
                  <p className="text-sm opacity-90">Seu arquivo está disponível para os recrutadores.</p>
                </div>
              </div>
            )}
            
            {hasJson && !hasPdf && (
              <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 p-4 rounded-lg border border-blue-200 dark:border-blue-900/50 mb-4">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Currículo criado no sistema</p>
                  <p className="text-sm opacity-90">Suas informações estão preenchidas e prontas.</p>
                </div>
              </div>
            )}

            {!hasPdf && !hasJson && (
               <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 p-4 rounded-lg border border-amber-200 dark:border-amber-900/50 mb-4">
                 <AlertCircle className="w-6 h-6" />
                 <div>
                   <p className="font-semibold">Você ainda não tem currículo</p>
                   <p className="text-sm opacity-90">As empresas não poderão avaliar seu perfil completo.</p>
                 </div>
               </div>
            )}
          </div>

          <div className="flex gap-3 mt-4">
             {(!hasPdf && !hasJson) ? (
                <Link href="/candidato/curriculo/criar" className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Criar Currículo Agora
                </Link>
             ) : (
                <Link href="/candidato/curriculo/editar" className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Atualizar Currículo
                </Link>
             )}
          </div>
        </div>
      </div>

      {/* Últimas Candidaturas */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-accent" /> Candidaturas Recentes
          </h3>
          <Link href="/candidato/candidaturas" className="text-sm text-accent hover:underline font-medium">
            Ver todas
          </Link>
        </div>

        {candidaturas && candidaturas.length > 0 ? (
          <div className="divide-y divide-border">
            {candidaturas.map((cand) => {
              const vaga = cand.vaga as any
              const empresa = vaga?.empresa as any
              
              const statusMap: Record<string, { label: string, color: string }> = {
                inscrito: { label: 'Inscrito', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
                em_analise: { label: 'Em Análise', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
                entrevista: { label: 'Entrevista', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
                aprovado: { label: 'Aprovado', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
                reprovado: { label: 'Não foi dessa vez', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
              }
              const st = statusMap[cand.status] || statusMap.inscrito

              return (
                <div key={cand.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-primary">{vaga?.titulo}</p>
                    <p className="text-sm text-muted-foreground">{empresa?.nome}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${st.color}`}>
                      {st.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(cand.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Você ainda não se candidatou a nenhuma vaga.</p>
            <Link href="/vagas" className="inline-block mt-4 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Explorar Vagas
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
