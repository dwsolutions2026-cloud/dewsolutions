import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const allowedEvents = new Set([
  'pagina_visualizada',
  'formulario_submetido',
  'whatsapp_aberto',
])

export async function POST(req: Request) {
  try {
    const { evento } = await req.json()
    if (!allowedEvents.has(evento)) {
      return NextResponse.json({ error: 'Evento inválido' }, { status: 400 })
    }

    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const ipHash = await sha256Hex(ip)

    const supabase = await createClient()
    const { error } = await supabase
      .from('eventos_funil')
      .insert({ evento, ip_hash: ipHash })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking event:', error)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}
