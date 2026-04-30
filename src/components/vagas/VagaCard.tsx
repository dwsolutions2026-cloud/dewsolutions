import Link from 'next/link'
import { MapPin, Briefcase, Clock, Building } from 'lucide-react'

interface VagaCardProps {
  vaga: {
    id: string
    titulo: string
    empresa: {
      nome: string
      logo_url?: string
    }
    cidade: string
    estado: string
    modalidade: string
    regime: string
    salario_min?: number
    salario_max?: number
    exibir_salario: boolean
    created_at: string
  }
}

export function VagaCard({ vaga }: VagaCardProps) {
  const dataPublicacao = new Date(vaga.created_at).toLocaleDateString('pt-BR')

  const formatCurrency = (value?: number) => {
    if (!value) return ''
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  return (
    <Link href={`/vagas/${vaga.id}`} className="block">
      <div className="bg-card p-6 rounded-xl border border-border hover:border-accent hover:shadow-md transition-all duration-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border">
            {vaga.empresa.logo_url ? (
              <img src={vaga.empresa.logo_url} alt={`Logo ${vaga.empresa.nome}`} className="w-full h-full object-cover" />
            ) : (
              <Building className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-primary mb-1 line-clamp-1">{vaga.titulo}</h3>
            <p className="text-sm font-medium text-muted-foreground mb-4">{vaga.empresa.nome}</p>
            
            <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{vaga.cidade} - {vaga.estado}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>{vaga.modalidade}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{vaga.regime}</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm font-medium text-primary">
                {vaga.exibir_salario && vaga.salario_min ? (
                  <span>
                    {formatCurrency(vaga.salario_min)} 
                    {vaga.salario_max && ` a ${formatCurrency(vaga.salario_max)}`}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Salário a combinar</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                Publicado em {dataPublicacao}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
