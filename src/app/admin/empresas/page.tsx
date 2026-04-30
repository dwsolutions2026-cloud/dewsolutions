import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Building2, MapPin } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminEmpresasPage() {
  const supabase = await createClient()

  const { data: empresas, error } = await supabase
    .from('empresas')
    .select(`
      id,
      nome,
      cnpj,
      cidade,
      estado,
      setor,
      created_at,
      vagas (count)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-primary">Empresas Parceiras</h1>
          <p className="text-muted-foreground mt-1">Gerencie as empresas com acesso ao sistema.</p>
        </div>
        <Link 
          href="/admin/empresas/nova"
          className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Cadastrar Empresa
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-red-500">
            <p className="font-bold">Erro ao carregar empresas:</p>
            <p className="text-sm opacity-80">{error.message}</p>
          </div>
        ) : empresas && empresas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b border-border text-sm text-muted-foreground">
                  <th className="p-4 font-medium">Empresa</th>
                  <th className="p-4 font-medium">CNPJ / Setor</th>
                  <th className="p-4 font-medium">Localização</th>
                  <th className="p-4 font-medium text-center">Vagas Totais</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {empresas.map((empresa: any) => {
                  const vagasCount = empresa.vagas[0]?.count || 0
                  
                  return (
                    <tr key={empresa.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-primary">{empresa.nome}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Desde {new Date(empresa.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-primary">
                          {empresa.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {empresa.setor || 'Não informado'}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {empresa.cidade} - {empresa.estado}
                        </div>
                      </td>
                      <td className="p-4 text-center font-bold text-primary">
                        {vagasCount}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-primary mb-2">Nenhuma empresa cadastrada</h3>
            <p className="text-muted-foreground mb-6">Cadastre a primeira empresa para que ela possa publicar vagas.</p>
          </div>
        )}
      </div>
    </div>
  )
}
