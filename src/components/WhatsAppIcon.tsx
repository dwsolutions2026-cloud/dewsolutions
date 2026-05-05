type WhatsAppIconProps = {
  className?: string
  variant?: 'brand' | 'mono'
}

const glyphPath =
  'M16 7.25c-4.76 0-8.62 3.72-8.62 8.31 0 1.47.4 2.88 1.16 4.15L7.38 24l4.44-1.15c1.25.75 2.68 1.14 4.18 1.14 4.76 0 8.62-3.72 8.62-8.31S20.76 7.25 16 7.25Zm0 14.99c-1.28 0-2.53-.34-3.63-.99l-.26-.15-2.64.68.69-2.55-.17-.27a7.08 7.08 0 0 1-1.09-3.8c0-3.77 3.18-6.85 7.1-6.85 3.91 0 7.1 3.08 7.1 6.85s-3.19 6.85-7.1 6.85Zm3.9-5.12c-.21-.11-1.25-.6-1.44-.67-.19-.07-.33-.1-.47.11-.14.21-.54.67-.67.81-.12.14-.25.16-.46.05-.21-.11-.88-.32-1.68-1.02-.62-.55-1.04-1.22-1.16-1.43-.12-.21-.01-.32.09-.43.1-.1.21-.25.32-.37.11-.12.14-.21.21-.35.07-.14.04-.27-.02-.38-.05-.11-.47-1.11-.64-1.52-.17-.4-.34-.34-.47-.35h-.4c-.14 0-.36.05-.55.25-.19.21-.72.7-.72 1.7s.74 1.96.84 2.1c.11.14 1.46 2.3 3.6 3.12 2.14.82 2.14.55 2.52.52.38-.03 1.25-.49 1.42-.96.18-.47.18-.88.13-.96-.05-.09-.19-.14-.4-.24Z'

export function WhatsAppIcon({ className, variant = 'brand' }: WhatsAppIconProps) {
  if (variant === 'mono') {
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <path d={glyphPath} fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="16" cy="16" r="16" fill="#25D366" />
      <path d={glyphPath} fill="#FFFFFF" />
    </svg>
  )
}
