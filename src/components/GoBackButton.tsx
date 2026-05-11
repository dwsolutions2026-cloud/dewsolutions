'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface Props {
  fallbackHref: string
  label?: string
}

export function GoBackButton({ fallbackHref, label = 'Voltar' }: Props) {
  const router = useRouter()

  return (
    <button
      onClick={() => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
          router.back()
        } else {
          router.push(fallbackHref)
        }
      }}
      className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-xs mb-4 cursor-pointer bg-transparent border-none p-0 outline-none"
    >
      <ArrowLeft className="w-3.5 h-3.5" /> {label}
    </button>
  )
}
