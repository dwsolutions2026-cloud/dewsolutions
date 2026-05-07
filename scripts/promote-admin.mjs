import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const cwd = process.cwd()

function loadEnvFile(filename) {
  const filePath = path.join(cwd, filename)

  if (!fs.existsSync(filePath)) {
    return
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) continue

    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue

    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env')
loadEnvFile('.dev.vars')

const email = process.argv[2]?.trim()

if (!email) {
  console.error('Uso: node scripts/promote-admin.mjs email@exemplo.com')
  process.exit(1)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Variáveis ausentes: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local ou .dev.vars.'
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers()

if (usersError) {
  console.error('Erro ao listar usuários:', usersError.message)
  process.exit(1)
}

const user = usersData.users.find(
  (entry) => entry.email?.toLowerCase() === email.toLowerCase()
)

if (!user) {
  console.error(`Usuário não encontrado para o e-mail: ${email}`)
  process.exit(1)
}

const { error: upsertError } = await supabase.from('profiles').upsert(
  {
    id: user.id,
    role: 'admin',
  },
  {
    onConflict: 'id',
  }
)

if (upsertError) {
  console.error('Erro ao promover perfil para admin:', upsertError.message)
  process.exit(1)
}

console.log(`Usuário ${email} promovido para admin com sucesso.`)
