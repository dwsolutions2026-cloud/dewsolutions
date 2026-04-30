'use client'

import { VagaForm } from '@/components/vagas/VagaForm'
import { updateVagaAdminAction } from '@/app/actions/vagas'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
  vaga: any
  empresas: any[]
}

export default function VagaEditarClient({ vaga, empresas }: Props) {
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    const result = await updateVagaAdminAction(vaga.id, formData)
    
    if (result.success) {
      toast.success('Vaga atualizada com sucesso!')
      router.push('/admin/vagas')
      router.refresh()
    } else {
      toast.error(result.error || 'Erro ao atualizar vaga')
    }
  }

  return (
    <div className="max-w-5xl space-y-6 animate-in fade-in duration-700">
      <div>
        <Link 
          href="/admin/vagas" 
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-xs mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar para Vagas
        </Link>
        <h1 className="text-2xl font-black text-primary tracking-tight">Editar Vaga</h1>
        <p className="text-muted-foreground text-xs font-medium opacity-70">Atualize os detalhes da oportunidade.</p>
      </div>

      <div className="bg-card rounded-[2rem] border border-border p-6 shadow-sm">
        <VagaForm 
          initialData={vaga} 
          empresas={empresas} 
          onSubmit={handleSubmit} 
        />
      </div>
    </div>
  )
}
