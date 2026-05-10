import { escapeHtml } from '@/lib/security'

const FROM =
  process.env.RESEND_FROM ||
  process.env.SMTP_FROM ||
  (process.env.GMAIL_USER ? `D&W Solutions <${process.env.GMAIL_USER}>` : 'D&W Solutions <onboarding@resend.dev>')

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

import nodemailer from 'nodemailer'

async function sendEmail(to: string, subject: string, html: string) {
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD

  // Se as credenciais de SMTP / Gmail estiverem configuradas, prioriza este canal
  if (smtpUser && smtpPass) {
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10)

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true para SSL na porta 465, false para outras como 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    try {
      await transporter.sendMail({
        from: FROM,
        to,
        subject,
        html,
      })
      return { success: true }
    } catch (error) {
      console.error('Erro ao enviar e-mail via SMTP / Gmail:', error)
      throw error
    }
  }

  // Fallback para o Resend caso configurado
  const apiKey = process.env.RESEND_API_KEY

  if (apiKey) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Resend API error: ${response.status} ${errorText}`)
    }

    return { success: true }
  }

  console.warn('Nenhum serviço de e-mail (Gmail/SMTP ou Resend) configurado. Pulando envio.')
  return { skipped: true }
}

function baseTemplate(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>D&W Solutions</title>
    </head>
    <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:#0D0D0D;padding:32px 40px;text-align:center;">
                  <img src="${APP_URL}/logo-branco.png" alt="D&W Solutions" style="height:60px;width:auto;display:block;margin:0 auto;" />
                </td>
              </tr>
              <tr>
                <td style="padding:40px;">
                  ${content}
                </td>
              </tr>
              <tr>
                <td style="background:#f9f9f9;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
                  <p style="margin:0;color:#999;font-size:12px;">
                    &copy; ${new Date().getFullYear()} D&amp;W Solutions
                  </p>
                  <p style="margin:6px 0 0;color:#bbb;font-size:11px;">Este e-mail foi enviado automaticamente. Nao responda.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export async function sendCompanyCredentials(
  email: string,
  nomeEmpresa: string,
  temporaryPassword: string
) {
  const content = `
    <h2 style="margin:0 0 8px;color:#0D0D0D;font-size:24px;font-family:Georgia,serif;">Bem-vindo a D&amp;W Solutions!</h2>
    <p style="margin:0 0 24px;color:#666;font-size:15px;">Ola, <strong>${escapeHtml(nomeEmpresa)}</strong>! Sua conta de empresa parceira foi criada com sucesso.</p>
    <p style="margin:0 0 12px;color:#444;font-size:14px;">Utilize as credenciais abaixo para acessar o portal e publicar suas vagas:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f6;border:1px solid #e8e0d0;border-radius:8px;margin:0 0 28px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 12px;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">E-MAIL DE ACESSO</span>
            <strong style="color:#0D0D0D;">${escapeHtml(email)}</strong>
          </p>
          <p style="margin:0;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">SENHA PROVISORIA</span>
            <strong style="color:#0D0D0D;font-size:18px;letter-spacing:2px;">${escapeHtml(temporaryPassword)}</strong>
          </p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${APP_URL}/login" style="display:inline-block;background:#D4AF37;color:#0D0D0D;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:bold;font-size:15px;letter-spacing:1px;">
            Acessar o Portal
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:28px 0 0;color:#999;font-size:12px;text-align:center;">
      Recomendamos alterar sua senha apos o primeiro acesso.
    </p>
  `

  try {
    await sendEmail(email, 'Suas credenciais de acesso - D&W Solutions', baseTemplate(content))
    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar e-mail de credenciais:', error)
    return { error: String(error) }
  }
}

export async function sendWelcomeEmail(email: string, nome: string) {
  const content = `
    <h2 style="margin:0 0 8px;color:#0D0D0D;font-size:24px;font-family:Georgia,serif;">Seu cadastro foi realizado!</h2>
    <p style="margin:0 0 24px;color:#666;font-size:15px;">Ola, <strong>${escapeHtml(nome)}</strong>! Sua conta foi criada com sucesso na plataforma D&amp;W Solutions.</p>
    <p style="margin:0 0 20px;color:#444;font-size:14px;">Agora voce pode:</p>
    <ul style="margin:0 0 28px;padding:0 0 0 20px;color:#444;font-size:14px;line-height:2;">
      <li>Explorar as vagas disponiveis</li>
      <li>Se candidatar com apenas um clique</li>
      <li>Acompanhar suas candidaturas</li>
      <li>Completar seu curriculo online</li>
    </ul>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${APP_URL}/vagas" style="display:inline-block;background:#D4AF37;color:#0D0D0D;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:bold;font-size:15px;letter-spacing:1px;">
            Ver Vagas Disponiveis
          </a>
        </td>
      </tr>
    </table>
  `

  try {
    await sendEmail(email, 'Bem-vindo a D&W Solutions!', baseTemplate(content))
    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar e-mail de boas-vindas:', error)
    return { error: String(error) }
  }
}

export async function sendCandidaturaConfirmacao(
  email: string,
  nomeCandidato: string,
  tituloVaga: string,
  nomeEmpresa: string
) {
  const content = `
    <h2 style="margin:0 0 8px;color:#0D0D0D;font-size:24px;font-family:Georgia,serif;">Candidatura enviada com sucesso!</h2>
    <p style="margin:0 0 24px;color:#666;font-size:15px;">Ola, <strong>${escapeHtml(nomeCandidato)}</strong>! Sua candidatura foi registrada e esta em analise.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f6;border:1px solid #e8e0d0;border-radius:8px;margin:0 0 28px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 12px;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">VAGA</span>
            <strong style="color:#0D0D0D;font-size:16px;">${escapeHtml(tituloVaga)}</strong>
          </p>
          <p style="margin:0;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">EMPRESA</span>
            <strong style="color:#0D0D0D;">${escapeHtml(nomeEmpresa)}</strong>
          </p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 24px;color:#666;font-size:14px;">
      Nossa equipe ira analisar seu perfil e entraremos em contato caso seu curriculo seja selecionado para as proximas etapas.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${APP_URL}/candidato/candidaturas" style="display:inline-block;background:#D4AF37;color:#0D0D0D;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:bold;font-size:15px;letter-spacing:1px;">
            Minhas Candidaturas
          </a>
        </td>
      </tr>
    </table>
  `

  try {
    await sendEmail(email, `Candidatura registrada: ${escapeHtml(tituloVaga)}`, baseTemplate(content))
    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar e-mail de candidatura:', error)
    return { error: String(error) }
  }
}

export async function sendConvocacaoEntrevista(
  email: string,
  nomeCandidato: string,
  tituloVaga: string,
  nomeEmpresa: string,
  dataEntrevista: string,
  localEntrevista: string,
  observacao?: string
) {
  const safeObservation = observacao ? escapeHtml(observacao) : ''

  const content = `
    <h2 style="margin:0 0 8px;color:#0D0D0D;font-size:24px;font-family:Georgia,serif;">Parabens! Voce foi selecionado!</h2>
    <p style="margin:0 0 24px;color:#666;font-size:15px;">Ola, <strong>${escapeHtml(nomeCandidato)}</strong>! Seu perfil se destacou e voce esta convocado para uma entrevista.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f6;border:2px solid #D4AF37;border-radius:8px;margin:0 0 28px;">
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 16px;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">VAGA</span>
            <strong style="color:#0D0D0D;font-size:16px;">${escapeHtml(tituloVaga)}</strong>
          </p>
          <p style="margin:0 0 16px;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">EMPRESA</span>
            <strong style="color:#0D0D0D;">${escapeHtml(nomeEmpresa)}</strong>
          </p>
          <p style="margin:0 0 16px;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">DATA E HORA</span>
            <strong style="color:#0D0D0D;">${escapeHtml(dataEntrevista)}</strong>
          </p>
          <p style="margin:0;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">LOCAL / LINK</span>
            <strong style="color:#0D0D0D;">${escapeHtml(localEntrevista)}</strong>
          </p>
          ${safeObservation ? `
          <p style="margin:16px 0 0;font-size:14px;color:#444;padding-top:16px;border-top:1px solid #e8e0d0;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">OBSERVACOES</span>
            ${safeObservation}
          </p>` : ''}
        </td>
      </tr>
    </table>
    <p style="margin:0 0 24px;color:#666;font-size:14px;text-align:center;">
      Compareca com antecedencia e boa sorte!
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${APP_URL}/candidato/candidaturas" style="display:inline-block;background:#D4AF37;color:#0D0D0D;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:bold;font-size:15px;letter-spacing:1px;">
            Ver Minhas Candidaturas
          </a>
        </td>
      </tr>
    </table>
  `

  try {
    await sendEmail(
      email,
      `Convocacao para Entrevista: ${escapeHtml(tituloVaga)} - ${escapeHtml(nomeEmpresa)}`,
      baseTemplate(content)
    )
    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar e-mail de convocacao:', error)
    return { error: String(error) }
  }
}

export async function sendLeadAutoReplyEmail({
  email,
  nomeResponsavel,
  nomeEmpresa,
  cargoVaga,
  prazoTexto,
  whatsappNumero,
}: {
  email: string
  nomeResponsavel: string
  nomeEmpresa: string
  cargoVaga: string
  prazoTexto: string
  whatsappNumero: string
}) {
  const content = `
    <p>Ola, <strong>${nomeResponsavel}</strong>!</p>
    <p>Recebemos o interesse da empresa <strong>${nomeEmpresa}</strong> em anunciar uma oportunidade.</p>
    <div style="background:#f1f3f5;padding:20px;border-radius:8px;margin:20px 0;">
      <p style="margin:0 0 10px 0;font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#666;">Dados recebidos:</p>
      <ul style="margin:0;padding-left:20px;font-size:15px;">
        <li style="margin-bottom:5px;">Empresa: ${nomeEmpresa}</li>
        <li style="margin-bottom:5px;">Responsavel: ${nomeResponsavel}</li>
        <li>Vaga: ${cargoVaga}</li>
      </ul>
    </div>
    <p style="font-size:16px;font-weight:bold;">${prazoTexto}</p>
    <p style="font-size:14px;color:#666;">Qualquer duvida, fale conosco pelo WhatsApp: <a href="https://wa.me/55${whatsappNumero}" style="color:#25d366;text-decoration:none;font-weight:bold;">${whatsappNumero}</a></p>
    <p style="margin-top:30px;border-top:1px solid #eee;padding-top:20px;font-size:13px;color:#999;">Att,<br>Equipe Plataforma de Vagas</p>
  `

  return sendEmail(email, 'Recebemos seu contato!', baseTemplate(content))
}

export async function sendLeadNotificationEmail({
  adminEmail,
  nomeEmpresa,
  nomeResponsavel,
  telefone,
  cargoVaga,
  siteUrl,
  dataHora,
}: {
  adminEmail: string
  nomeEmpresa: string
  nomeResponsavel: string
  telefone: string
  cargoVaga: string
  siteUrl: string
  dataHora: string
}) {
  const content = `
    <div style="font-family:sans-serif;color:#333;max-width:600px;margin:0 auto;">
      <h3 style="margin:0 0 20px;">Novo lead recebido!</h3>
      <p style="margin-bottom:5px;"><strong>Empresa:</strong> ${nomeEmpresa}</p>
      <p style="margin-bottom:5px;"><strong>Responsavel:</strong> ${nomeResponsavel}</p>
      <p style="margin-bottom:5px;"><strong>WhatsApp:</strong> ${telefone}</p>
      <p style="margin-bottom:5px;"><strong>Vaga:</strong> ${cargoVaga}</p>
      <p style="margin-bottom:20px;"><strong>Data:</strong> ${dataHora}</p>
      <div style="text-align:center;margin-top:30px;">
        <a href="${siteUrl}/admin/oportunidades" style="background:#000;color:#fff;padding:12px 25px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:14px;">Abrir no Painel</a>
      </div>
    </div>
  `

  return sendEmail(adminEmail, `Novo lead: ${nomeEmpresa} quer anunciar vaga`, baseTemplate(content))
}

export async function sendPasswordResetEmail(email: string, actionLink: string) {
  const content = `
    <h2 style="margin:0 0 8px;color:#0D0D0D;font-size:24px;font-family:Georgia,serif;">Recuperacao de Senha</h2>
    <p style="margin:0 0 24px;color:#666;font-size:15px;">Ola!</p>
    <p style="margin:0 0 24px;color:#666;font-size:15px;">Recebemos uma solicitacao para redefinir a senha da sua conta na plataforma D&amp;W Solutions.</p>
    <p style="margin:0 0 24px;color:#666;font-size:15px;">Para criar uma nova senha, clique no botao dourado abaixo:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td align="center">
          <a href="${actionLink}" style="display:inline-block;background:#D4AF37;color:#0D0D0D;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:bold;font-size:15px;letter-spacing:1px;box-shadow: 0 4px 10px rgba(212,175,55,0.3);">
            Redefinir Minha Senha
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0;color:#999;font-size:12px;text-align:center;">
      Se voce nao solicitou essa redefinicao, pode ignorar este e-mail com seguranca. Seu link de redefinicao expirara em breve.
    </p>
  `

  try {
    await sendEmail(email, 'Recuperacao de senha - D&W Solutions', baseTemplate(content))
    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar e-mail de recuperacao de senha:', error)
    return { error: String(error) }
  }
}

