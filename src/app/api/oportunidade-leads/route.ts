import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { OportunidadeLeadSchema } from '@/lib/schemas'
import { generateWhatsAppLink } from '@/lib/whatsapp'
import nodemailer from 'nodemailer'
import { escapeHtml } from '@/lib/security'

const rateLimitMap = new Map<string, { count: number, lastTime: number }>()

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const limitWindow = 15 * 60 * 1000

  const userLimit = rateLimitMap.get(ip)
  if (userLimit && now - userLimit.lastTime < limitWindow) {
    if (userLimit.count >= 3) {
      return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 })
    }
    userLimit.count++
  } else {
    rateLimitMap.set(ip, { count: 1, lastTime: now })
  }

  try {
    const data = await req.json()

    if (data.website) {
      console.log('Honeypot triggered')
      return NextResponse.json({ success: true, message: "OK" })
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
      return NextResponse.json({ error: "Muitas tentativas recentes para este telefone." }, { status: 429 })
    }

    const { error: insertError } = await supabaseAdmin
      .from('oportunidade_leads')
      .insert({
        nome_empresa: parsed.data.nome_empresa,
        nome_responsavel: parsed.data.nome_responsavel,
        email: parsed.data.email,
        telefone: normalizedPhone,
        cargo_vaga: parsed.data.cargo_vaga,
        cidade: parsed.data.cidade,
        mensagem: parsed.data.mensagem || null,
        status: 'novo'
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
    const prazoTexto = configs.prazo_retorno_texto || 'Retornamos em até 1 dia útil'
    const adminEmail = configs.admin_email_notificacao || ''

    const whatsappUrl = generateWhatsAppLink(whatsappNumero, whatsappTemplate, parsed.data)

    await sendEmails(parsed.data, whatsappNumero, adminEmail, prazoTexto)

    return NextResponse.json({
      success: true,
      whatsapp_url: whatsappUrl,
      message: `Recebemos seus dados. Em breve nossa equipe entrará em contato. Prazo: ${prazoTexto}`
    })
  } catch (error: any) {
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
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const safeLead = {
      nome_empresa: escapeHtml(data.nome_empresa),
      nome_responsavel: escapeHtml(data.nome_responsavel),
      cargo_vaga: escapeHtml(data.cargo_vaga),
      telefone: escapeHtml(data.telefone),
    }

    const siteName = "Plataforma de Vagas"
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    if (data.email) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: data.email,
        subject: "Recebemos seu contato!",
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-bottom: 1px solid #eee;">
               <h2 style="margin: 0; color: #000;">${siteName}</h2>
            </div>
            <div style="padding: 30px;">
              <p>Olá, <strong>${safeLead.nome_responsavel}</strong>!</p>
              <p>Recebemos o interesse da empresa <strong>${safeLead.nome_empresa}</strong> em anunciar uma oportunidade.</p>
              <div style="background: #f1f3f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #666;">Dados recebidos:</p>
                <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
                  <li style="margin-bottom: 5px;">Empresa: ${safeLead.nome_empresa}</li>
                  <li style="margin-bottom: 5px;">Responsável: ${safeLead.nome_responsavel}</li>
                  <li>Vaga: ${safeLead.cargo_vaga}</li>
                </ul>
              </div>
              <p style="font-size: 16px; font-weight: bold;">${escapeHtml(prazoTexto)}</p>
              <p style="font-size: 14px; color: #666;">Qualquer dúvida, fale conosco pelo WhatsApp: <a href="https://wa.me/55${whatsappNumero}" style="color: #25d366; text-decoration: none; font-weight: bold;">${escapeHtml(whatsappNumero)}</a></p>
              <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 13px; color: #999;">Att,<br>Equipe ${siteName}</p>
            </div>
          </div>
        `
      })
    }

    if (adminEmail) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: adminEmail,
        subject: `Novo lead: ${safeLead.nome_empresa} quer anunciar vaga`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
             <div style="background: #333; color: #fff; padding: 20px; text-align: center;">
               <h3 style="margin: 0;">Novo lead recebido!</h3>
            </div>
            <div style="padding: 30px;">
              <p style="margin-bottom: 5px;"><strong>Empresa:</strong> ${safeLead.nome_empresa}</p>
              <p style="margin-bottom: 5px;"><strong>Responsável:</strong> ${safeLead.nome_responsavel}</p>
              <p style="margin-bottom: 5px;"><strong>WhatsApp:</strong> ${safeLead.telefone}</p>
              <p style="margin-bottom: 5px;"><strong>Vaga:</strong> ${safeLead.cargo_vaga}</p>
              <p style="margin-bottom: 20px;"><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
              <div style="text-align: center; margin-top: 30px;">
                <a href="${siteUrl}/admin/oportunidades" style="background: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">Abrir no Painel</a>
              </div>
            </div>
          </div>
        `
      })
    }
  } catch (err) {
    console.error('Error sending emails:', err)
  }
}
