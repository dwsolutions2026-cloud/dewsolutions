'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, MessageCircle } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useState, useEffect } from 'react'

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/sobre', label: 'SOBRE NÓS' },
    { href: '/planos', label: 'SERVIÇOS' },
    { href: '/vagas', label: 'VAGAS' },
    { href: '/blog', label: 'BLOG' },
    { href: '/contato', label: 'CONTATO' },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0c0c0c]/90 backdrop-blur-md py-3 border-b border-white/10' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Logo scale={0.8} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] font-bold tracking-[0.2em] transition-all hover:text-accent ${
                pathname === link.href ? 'text-accent' : 'text-white/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden lg:flex items-center">
          <Link
            href="https://wa.me/5541999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-accent/40 text-accent text-[10px] font-black tracking-widest px-6 py-2.5 rounded-lg hover:bg-accent hover:text-black transition-all group"
          >
            <MessageCircle className="w-4 h-4" />
            FALE CONOSCO
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-accent transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#0c0c0c] border-t border-white/10 animate-in slide-in-from-top-4 duration-300">
          <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold tracking-widest transition-colors ${
                  pathname === link.href ? 'text-accent' : 'text-white/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://wa.me/5541999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-accent text-accent font-black text-xs py-4 rounded-xl"
            >
              <MessageCircle className="w-4 h-4" /> FALE CONOSCO
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
