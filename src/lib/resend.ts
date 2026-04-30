import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

const FROM = `D&W Solutions <${process.env.GMAIL_USER}>`
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

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
              
              <!-- Header -->
              <tr>
                <td style="background:#0D0D0D;padding:32px 40px;text-align:center;">
                  <h1 style="margin:0;font-size:32px;letter-spacing:4px;color:#ffffff;font-family:Georgia,serif;">
                    D<span style="color:#D4AF37;">&amp;</span>W
                  </h1>
                  <p style="margin:4px 0 0;color:#D4AF37;font-size:11px;letter-spacing:6px;text-transform:uppercase;">Solutions</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding:40px;">
                  ${content}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9f9f9;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
                  <p style="margin:0;color:#999;font-size:12px;">
                    © ${new Date().getFullYear()} D&amp;W Solutions — Soluções em Recrutamento e Seleção
                  </p>
                  <p style="margin:6px 0 0;color:#bbb;font-size:11px;">Este e-mail foi enviado automaticamente. Não responda.</p>
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
    <h2 style="margin:0 0 8px;color:#0D0D0D;font-size:24px;font-family:Georgia,serif;">Bem-vindo à D&amp;W Solutions!</h2>
    <p style="margin:0 0 24px;color:#666;font-size:15px;">Olá, <strong>${nomeEmpresa}</strong>! Sua conta de empresa parceira foi criada com sucesso.</p>

    <p style="margin:0 0 12px;color:#444;font-size:14px;">Utilize as credenciais abaixo para acessar o portal e publicar suas vagas:</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f6;border:1px solid #e8e0d0;border-radius:8px;margin:0 0 28px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 12px;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">E-MAIL DE ACESSO</span>
            <strong style="color:#0D0D0D;">${email}</strong>
          </p>
          <p style="margin:0;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">SENHA PROVISÓRIA</span>
            <strong style="color:#0D0D0D;font-size:18px;letter-spacing:2px;">${temporaryPassword}</strong>
          </p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${APP_URL}/login" style="display:inline-block;background:#D4AF37;color:#0D0D0D;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:bold;font-size:15px;letter-spacing:1px;">
            Acessar o Portal →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:28px 0 0;color:#999;font-size:12px;text-align:center;">
      Recomendamos alterar sua senha após o primeiro acesso.
    </p>
  `

  try {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: '🎯 Suas credenciais de acesso — D&W Solutions',
      html: baseTemplate(content),
    })
    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar e-mail de credenciais:', error)
    return { error: String(error) }
  }
}

export async function sendWelcomeEmail(email: string, nome: string) {
  const content = `
    <h2 style="margin:0 0 8px;color:#0D0D0D;font-size:24px;font-family:Georgia,serif;">Seu cadastro foi realizado!</h2>
    <p style="margin:0 0 24px;color:#666;font-size:15px;">Olá, <strong>${nome}</strong>! Sua conta foi criada com sucesso na plataforma D&amp;W Solutions.</p>

    <p style="margin:0 0 20px;color:#444;font-size:14px;">Agora você pode:</p>
    <ul style="margin:0 0 28px;padding:0 0 0 20px;color:#444;font-size:14px;line-height:2;">
      <li>Explorar as vagas disponíveis</li>
      <li>Se candidatar com apenas um clique</li>
      <li>Acompanhar suas candidaturas</li>
      <li>Completar seu currículo online</li>
    </ul>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${APP_URL}/vagas" style="display:inline-block;background:#D4AF37;color:#0D0D0D;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:bold;font-size:15px;letter-spacing:1px;">
            Ver Vagas Disponíveis →
          </a>
        </td>
      </tr>
    </table>
  `

  try {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: '✅ Bem-vindo à D&W Solutions!',
      html: baseTemplate(content),
    })
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
    <p style="margin:0 0 24px;color:#666;font-size:15px;">Olá, <strong>${nomeCandidato}</strong>! Sua candidatura foi registrada e está em análise.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f6;border:1px solid #e8e0d0;border-radius:8px;margin:0 0 28px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 12px;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">VAGA</span>
            <strong style="color:#0D0D0D;font-size:16px;">${tituloVaga}</strong>
          </p>
          <p style="margin:0;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">EMPRESA</span>
            <strong style="color:#0D0D0D;">${nomeEmpresa}</strong>
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 24px;color:#666;font-size:14px;">
      Nossa equipe irá analisar seu perfil e entraremos em contato caso seu currículo seja selecionado para as próximas etapas.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${APP_URL}/candidato/candidaturas" style="display:inline-block;background:#D4AF37;color:#0D0D0D;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:bold;font-size:15px;letter-spacing:1px;">
            Minhas Candidaturas →
          </a>
        </td>
      </tr>
    </table>
  `

  try {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: `📋 Candidatura registrada: ${tituloVaga}`,
      html: baseTemplate(content),
    })
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
  const content = `
    <h2 style="margin:0 0 8px;color:#0D0D0D;font-size:24px;font-family:Georgia,serif;">Parabéns! Você foi selecionado!</h2>
    <p style="margin:0 0 24px;color:#666;font-size:15px;">Olá, <strong>${nomeCandidato}</strong>! Seu perfil se destacou e você está convocado para uma entrevista.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f6;border:2px solid #D4AF37;border-radius:8px;margin:0 0 28px;">
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 16px;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">VAGA</span>
            <strong style="color:#0D0D0D;font-size:16px;">${tituloVaga}</strong>
          </p>
          <p style="margin:0 0 16px;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">EMPRESA</span>
            <strong style="color:#0D0D0D;">${nomeEmpresa}</strong>
          </p>
          <p style="margin:0 0 16px;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">DATA E HORA</span>
            <strong style="color:#0D0D0D;">${dataEntrevista}</strong>
          </p>
          <p style="margin:0;font-size:14px;color:#444;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">LOCAL / LINK</span>
            <strong style="color:#0D0D0D;">${localEntrevista}</strong>
          </p>
          ${observacao ? `
          <p style="margin:16px 0 0;font-size:14px;color:#444;padding-top:16px;border-top:1px solid #e8e0d0;">
            <span style="color:#999;font-size:12px;display:block;margin-bottom:2px;">OBSERVAÇÕES</span>
            ${observacao}
          </p>` : ''}
        </td>
      </tr>
    </table>

    <p style="margin:0 0 24px;color:#666;font-size:14px;text-align:center;">
      Compareça com antecedência e boa sorte! Estamos torcendo por você. 🍀
    </p>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${APP_URL}/candidato/candidaturas" style="display:inline-block;background:#D4AF37;color:#0D0D0D;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:bold;font-size:15px;letter-spacing:1px;">
            Ver Minhas Candidaturas →
          </a>
        </td>
      </tr>
    </table>
  `

  try {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: `🎯 Convocação para Entrevista: ${tituloVaga} — ${nomeEmpresa}`,
      html: baseTemplate(content),
    })
    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar e-mail de convocação:', error)
    return { error: String(error) }
  }
}
