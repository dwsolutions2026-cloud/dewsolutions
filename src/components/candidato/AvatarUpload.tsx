'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Camera, Loader2, User } from 'lucide-react'
import { uploadAvatarAction } from '@/app/actions/candidato'
import { toast } from 'react-hot-toast'

interface AvatarUploadProps {
  currentUrl?: string | null
  userName: string
}

export function AvatarUpload({ currentUrl, userName }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview imediato
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setIsUploading(true)
    const formData = new FormData()
    formData.append('avatar', file)

    const result = await uploadAvatarAction(formData)
    if (result.success) {
      toast.success('Foto de perfil atualizada!')
    } else {
      toast.error(result.error || 'Erro ao carregar foto.')
      setPreview(currentUrl || null) // Reverter se der erro
    }
    setIsUploading(false)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-background shadow-2xl relative bg-muted flex items-center justify-center">
          {preview ? (
            <Image 
              src={preview} 
              alt={userName} 
              fill 
              className="object-cover transition-transform group-hover:scale-110 duration-500" 
            />
          ) : (
            <div className="text-accent/30">
              <User className="w-16 h-16" />
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20 border-4 border-background"
          title="Alterar foto"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="text-center">
        <h2 className="text-xl font-black text-primary mb-0.5">{userName}</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent opacity-80">Perfil do Candidato</p>
      </div>
    </div>
  )
}
