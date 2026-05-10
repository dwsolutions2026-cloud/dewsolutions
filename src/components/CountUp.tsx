'use client'

import { useEffect, useState, useRef } from 'react'

interface CountUpProps {
  value: string
}

export function CountUp({ value }: CountUpProps) {
  const [count, setCount] = useState('0')
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  // Extract prefix, number (with possible dots/commas), and suffix
  const match = value.match(/^([^\d]*)([\d.,]+)([^\d]*)$/)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || !match) {
      if (!match) setCount(value) // If it's completely irregular, just show it
      return
    }

    const prefix = match[1] || ''
    // Remove dots and commas to parse the raw number
    const rawNumberStr = match[2].replace(/[.,]/g, '')
    const targetNumber = parseInt(rawNumberStr, 10)
    const suffix = match[3] || ''

    if (isNaN(targetNumber)) {
      setCount(value)
      return
    }

    let startTimestamp: number | null = null
    const duration = 2000 // 2 seconds

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      
      const currentNumber = Math.floor(easeProgress * targetNumber)
      
      // Re-apply formatting (simplesmente usando toLocaleString para números acima de 1000)
      // Se a string original não tinha formatação, isso adicionará o ponto de milhar, o que geralmente é desejado.
      const formattedNumber = currentNumber >= 1000 ? currentNumber.toLocaleString('pt-BR') : currentNumber.toString()
      
      setCount(`${prefix}${formattedNumber}${suffix}`)

      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        setCount(value) // Ensure final value matches the original string exactly
      }
    }

    window.requestAnimationFrame(step)
  }, [isVisible, value])

  return <span ref={elementRef}>{count}</span>
}
