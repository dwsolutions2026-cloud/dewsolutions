import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { checkAdmin } from '@/app/actions/admin'
import { stringify } from 'csv-stringify/sync'
import { sanitizePostgrestTextSearch } from '@/lib/security'

export async function GET(req: Request) {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const status = searchParams.get('status')

    const supabase = await createClient()

    let query = supabase
      .from('oportunidade_leads')
      .select('*')
      .order('criado_em', { ascending: false })

    if (q) {
      const cleanQ = sanitizePostgrestTextSearch(q)
      if (cleanQ) {
        query = query.or(`nome_empresa.ilike.%${cleanQ}%,nome_responsavel.ilike.%${cleanQ}%`)
      }
    }
    if (status) {
      query = query.eq('status', status)
    }

    const { data: leads, error } = await query

    if (error) throw error

    const csvData = (leads || []).map(l => ({
      Data: new Date(l.criado_em).toLocaleString('pt-BR'),
      Empresa: l.nome_empresa,
      Responsável: l.nome_responsavel,
      Email: l.email || '',
      Telefone: l.telefone,
      'Cargo da Vaga': l.cargo_vaga,
      Cidade: l.cidade || '',
      Status: l.status,
      Mensagem: l.mensagem || ''
    }))

    const csv = stringify(csvData, {
      header: true,
      bom: true
    })

    const date = new Date().toISOString().split('T')[0]

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="leads_${date}.csv"`
      }
    })

  } catch (error: any) {
    console.error('Error exporting CSV:', error)
    return NextResponse.json({ error: 'Erro ao exportar CSV.' }, { status: 500 })
  }
}
