import { AnunciarOportunidadeForm } from '@/components/forms/AnunciarOportunidadeForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anunciar Oportunidade | DW Solutions',
  description: 'Anuncie sua vaga e encontre o candidato ideal com a curadoria da DW Solutions.',
}

export default function AnunciarOportunidadePage() {
  return (
    <div className="bg-background min-h-screen">
      <main className="pt-32 pb-12 px-6">
        <AnunciarOportunidadeForm />
      </main>
    </div>
  )
}
