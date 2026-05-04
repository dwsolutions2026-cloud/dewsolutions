'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const CONSENT_KEY = 'dw_consent_v1'

export function hasTrackingConsent() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(CONSENT_KEY) === 'accepted'
}

export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const storedValue = window.localStorage.getItem(CONSENT_KEY)
    setIsVisible(!storedValue)
  }, [])

  const handleChoice = (value: 'accepted' | 'rejected') => {
    window.localStorage.setItem(CONSENT_KEY, value)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-3xl rounded-3xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            Privacidade
          </p>
          <p className="text-sm font-medium leading-relaxed text-muted-foreground">
            Usamos cookies e medições internas para segurança, desempenho e análise
            de conversão. Você pode revisar os detalhes na{' '}
            <Link href="/privacidade" className="text-accent underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleChoice('rejected')}
            className="rounded-xl border border-border px-4 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground transition-colors hover:bg-muted"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => handleChoice('accepted')}
            className="rounded-xl bg-accent px-4 py-2 text-xs font-black uppercase tracking-widest text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-[1.02]"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  )
}
