'use client'

import { useEffect, useState, useRef } from 'react'

interface CountUpProps {
  value: string
}

export function CountUp({ value }: CountUpProps) {
  const [count, setCount] = useState('0')
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  // Extract numbers and non-numbers (like +, %)
  const match = value.match(/^([^\d]*)(\d+)([^\d]*)$/)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || !match) {
      if (!match) setCount(value) // If it's not a number format, just show it
      return
    }

    const prefix = match[1] || ''
    const targetNumber = parseInt(match[2], 10)
    const suffix = match[3] || ''

    let startTimestamp: number | null = null
    const duration = 2000 // 2 seconds

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      
      const currentNumber = Math.floor(easeProgress * targetNumber)
      
      setCount(`${prefix}${currentNumber}${suffix}`)

      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        setCount(value) // Ensure final value is exact
      }
    }

    window.requestAnimationFrame(step)
  }, [isVisible, value])

  return <span ref={elementRef}>{count}</span>
}
