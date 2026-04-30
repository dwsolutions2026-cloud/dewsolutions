import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { evento } = await req.json()
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex')

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
