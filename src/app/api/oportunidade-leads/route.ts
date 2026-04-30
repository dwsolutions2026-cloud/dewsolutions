import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { OportunidadeLeadSchema } from '@/lib/schemas'
import { generateWhatsAppLink } from '@/lib/whatsapp'
import nodemailer from 'nodemailer'

// Basic in-memory rate limit for demo/dev purposes
const rateLimitMap = new Map<string, { count: number, lastTime: number }>()

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const limitWindow = 15 * 60 * 1000 // 15 mins
  
  const userLimit = rateLimitMap.get(ip)
  if (userLimit && (now - userLimit.lastTime < limitWindow)) {
    if (userLimit.count >= 3) {
      return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 })
    }
    userLimit.count++
  } else {
    rateLimitMap.set(ip, { count: 1, lastTime: now })
  }

  try {
    const data = await req.json()

    // 1. Honeypot
    if (data.website) {
      console.log('Honeypot triggered')
      return NextResponse.json({ success: true, message: "OK" })
    }

    // 2. Validation
    const parsed = OportunidadeLeadSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const supabase = await createClient()

    // 3. Save lead
    const { error: insertError } = await supabase
      .from('oportunidade_leads')
      .insert({
        nome_empresa: parsed.data.nome_empresa,
        nome_responsavel: parsed.data.nome_responsavel,
        email: parsed.data.email,
        telefone: parsed.data.telefone.replace(/\D/g, ''),
        cargo_vaga: parsed.data.cargo_vaga,
        cidade: parsed.data.cidade,
        status: 'novo'
      })

    if (insertError) throw insertError

    // 4. Get configs for WhatsApp URL and Emails
    const { data: configsData } = await supabase.from('configuracoes_site').select('chave, valor')
    const configs: Record<string, string> = {}
    configsData?.forEach(c => configs[c.chave] = c.valor)

    const whatsappNumero = configs.whatsapp_numero || '4197010813'
    const whatsappTemplate = configs.whatsapp_mensagem || ''
    const prazoTexto = configs.prazo_retorno_texto || 'Retornamos em até 1 dia útil'
    const adminEmail = configs.admin_email_notificacao || ''

    const whatsappUrl = generateWhatsAppLink(whatsappNumero, whatsappTemplate, parsed.data)

    // 5. Send Emails (Async - don't await in the main flow)
    // In Next.js App Router, we can't easily "fire and forget" without a background worker
    // but for this task we'll just await it or wrap in try/catch to not block if one fails.
    // However, to keep response fast, we should ideally not await.
    // For now, we'll await them because in serverless environments, 
    // the function might be killed before they finish if we don't.
    await sendEmails(parsed.data, configs, whatsappNumero, adminEmail, prazoTexto)

    return NextResponse.json({ 
      success: true, 
      whatsapp_url: whatsappUrl,
      message: `✅ Recebemos seus dados! Em breve nossa equipe entrará em contato. Prazo: ${prazoTexto}`
    })

  } catch (error: any) {
    console.error('Error in lead submission:', error)
    return NextResponse.json({ error: 'Erro interno ao processar lead.' }, { status: 500 })
  }
}

async function sendEmails(data: any, configs: any, whatsappNumero: string, adminEmail: string, prazoTexto: string) {
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

    const siteName = "Plataforma de Vagas" 
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Email for Lead (if provided)
    if (data.email) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: data.email,
        subject: "Recebemos seu contato! ✅",
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-bottom: 1px solid #eee;">
               <h2 style="margin: 0; color: #000;">${siteName}</h2>
            </div>
            <div style="padding: 30px;">
              <p>Olá, <strong>${data.nome_responsavel}</strong>!</p>
              <p>Recebemos o interesse da empresa <strong>${data.nome_empresa}</strong> em anunciar uma oportunidade.</p>
              
              <div style="background: #f1f3f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #666;">📋 Dados recebidos:</p>
                <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
                  <li style="margin-bottom: 5px;">Empresa: ${data.nome_empresa}</li>
                  <li style="margin-bottom: 5px;">Responsável: ${data.nome_responsavel}</li>
                  <li>Vaga: ${data.cargo_vaga}</li>
                </ul>
              </div>

              <p style="font-size: 16px; font-weight: bold;">⏱️ ${prazoTexto}</p>
              
              <p style="font-size: 14px; color: #666;">Qualquer dúvida, fale conosco pelo WhatsApp: <a href="https://wa.me/55${whatsappNumero}" style="color: #25d366; text-decoration: none; font-weight: bold;">${whatsappNumero}</a></p>
              
              <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 13px; color: #999;">Att,<br>Equipe ${siteName}</p>
            </div>
          </div>
        `
      })
    }

    // Email for Admin
    if (adminEmail) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: adminEmail,
        subject: `🔔 Novo lead: ${data.nome_empresa} quer anunciar vaga`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
             <div style="background: #333; color: #fff; padding: 20px; text-align: center;">
               <h3 style="margin: 0;">Novo lead recebido!</h3>
            </div>
            <div style="padding: 30px;">
              <p style="margin-bottom: 5px;">🏢 <strong>Empresa:</strong> ${data.nome_empresa}</p>
              <p style="margin-bottom: 5px;">👤 <strong>Responsável:</strong> ${data.nome_responsavel}</p>
              <p style="margin-bottom: 5px;">📱 <strong>WhatsApp:</strong> ${data.telefone}</p>
              <p style="margin-bottom: 5px;">💼 <strong>Vaga:</strong> ${data.cargo_vaga}</p>
              <p style="margin-bottom: 20px;">📅 <strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${siteUrl}/admin/oportunidades" style="background: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">Abrir no Painel →</a>
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
