'use client'

import { useEffect, useState } from 'react'

interface LogoProps {
  className?: string
  scale?: number
}

export function Logo({ className = "", scale = 1 }: LogoProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className={`opacity-0 ${className}`} />

  return (
    <div className={`flex flex-col items-center justify-center leading-none select-none ${className}`} style={{ transform: `scale(${scale})` }}>
      <div className="flex items-center gap-1">
        <span className="text-3xl font-black tracking-tighter text-white font-serif">D</span>
        <span className="text-3xl font-serif gold-text-gradient">&</span>
        <span className="text-3xl font-black tracking-tighter text-white font-serif">W</span>
      </div>
      <div className="flex items-center gap-1.5 w-full mt-0.5">
        <div className="h-px flex-1 bg-accent/40" />
        <span className="text-[9px] font-black tracking-[0.3em] text-accent uppercase font-sans">
          Solutions
        </span>
        <div className="h-px flex-1 bg-accent/40" />
      </div>
    </div>
  )
}
