import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { OportunidadeLeadSchema } from '@/lib/schemas'
import { generateWhatsAppLink } from '@/lib/whatsapp'
import { escapeHtml } from '@/lib/security'
import { sendLeadAutoReplyEmail, sendLeadNotificationEmail } from '@/lib/resend'

export const runtime = 'edge'

const rateLimitMap = new Map<string, { count: number; lastTime: number }>()

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const limitWindow = 15 * 60 * 1000

  const userLimit = rateLimitMap.get(ip)
  if (userLimit && now - userLimit.lastTime < limitWindow) {
    if (userLimit.count >= 3) {
      return NextResponse.json({ error: 'Muitas tentativas. Aguarde alguns minutos.' }, { status: 429 })
    }
    userLimit.count++
  } else {
    rateLimitMap.set(ip, { count: 1, lastTime: now })
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()
    const data = await req.json()

    if (data.website) {
      console.log('Honeypot triggered')
      return NextResponse.json({ success: true, message: 'OK' })
    }

    const parsed = OportunidadeLeadSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const normalizedPhone = parsed.data.telefone.replace(/\D/g, '')

    const { count: recentAttempts } = await supabaseAdmin
      .from('oportunidade_leads')
      .select('*', { count: 'exact', head: true })
      .eq('telefone', normalizedPhone)
      .gte('criado_em', new Date(now - limitWindow).toISOString())

    if ((recentAttempts ?? 0) >= 3) {
      return NextResponse.json({ error: 'Muitas tentativas recentes para este telefone.' }, { status: 429 })
    }

    const { error: insertError } = await supabaseAdmin.from('oportunidade_leads').insert({
      nome_empresa: parsed.data.nome_empresa,
      nome_responsavel: parsed.data.nome_responsavel,
      email: parsed.data.email,
      telefone: normalizedPhone,
      cargo_vaga: parsed.data.cargo_vaga,
      cidade: parsed.data.cidade,
      mensagem: parsed.data.mensagem || null,
      status: 'novo',
    })

    if (insertError) throw insertError

    const { data: configsData } = await supabaseAdmin
      .from('configuracoes_site')
      .select('chave, valor')

    const configs: Record<string, string> = {}
    configsData?.forEach((config) => {
      configs[config.chave] = config.valor
    })

    const whatsappNumero = configs.whatsapp_numero || '4197010813'
    const whatsappTemplate = configs.whatsapp_mensagem || ''
    const prazoTexto = configs.prazo_retorno_texto || 'Retornamos em ate 1 dia util'
    const adminEmail = configs.admin_email_notificacao || ''

    const whatsappUrl = generateWhatsAppLink(whatsappNumero, whatsappTemplate, parsed.data)

    await sendEmails(parsed.data, whatsappNumero, adminEmail, prazoTexto)

    return NextResponse.json({
      success: true,
      whatsapp_url: whatsappUrl,
      message: `Recebemos seus dados. Em breve nossa equipe entrara em contato. Prazo: ${prazoTexto}`,
    })
  } catch (error: unknown) {
    console.error('Error in lead submission:', error)
    return NextResponse.json({ error: 'Erro interno ao processar lead.' }, { status: 500 })
  }
}

async function sendEmails(
  data: Record<string, string>,
  whatsappNumero: string,
  adminEmail: string,
  prazoTexto: string
) {
  try {
    const safeLead = {
      nome_empresa: escapeHtml(data.nome_empresa),
      nome_responsavel: escapeHtml(data.nome_responsavel),
      cargo_vaga: escapeHtml(data.cargo_vaga),
      telefone: escapeHtml(data.telefone),
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    if (data.email) {
      await sendLeadAutoReplyEmail({
        email: data.email,
        nomeResponsavel: safeLead.nome_responsavel,
        nomeEmpresa: safeLead.nome_empresa,
        cargoVaga: safeLead.cargo_vaga,
        prazoTexto: escapeHtml(prazoTexto),
        whatsappNumero: escapeHtml(whatsappNumero),
      })
    }

    if (adminEmail) {
      await sendLeadNotificationEmail({
        adminEmail,
        nomeEmpresa: safeLead.nome_empresa,
        nomeResponsavel: safeLead.nome_responsavel,
        telefone: safeLead.telefone,
        cargoVaga: safeLead.cargo_vaga,
        siteUrl,
        dataHora: new Date().toLocaleString('pt-BR'),
      })
    }
  } catch (err) {
    console.error('Error sending emails:', err)
  }
}
