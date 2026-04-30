import { Building2, MapPin, Briefcase, Calendar } from 'lucide-react'
import Link from 'next/link'

interface Props {
  vaga: any
}

export function VagaCard({ vaga }: Props) {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border hover:border-accent/40 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
      <div className="mb-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-bold text-lg text-primary leading-tight group-hover:text-accent transition-colors">
            {vaga.titulo}
          </h3>
          <span className="text-[10px] font-black uppercase bg-accent/10 text-accent px-2 py-1 rounded">
            {vaga.modalidade}
          </span>
        </div>
        <p className="text-sm font-bold text-muted-foreground flex items-center gap-1.5 uppercase">
          <Building2 className="w-4 h-4" /> {(vaga.empresa as any)?.nome}
        </p>
      </div>

      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <MapPin className="w-4 h-4 text-accent" />
          {vaga.cidade} - {vaga.estado}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Briefcase className="w-4 h-4 text-accent" />
          {vaga.area}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Calendar className="w-4 h-4 text-accent" />
          Postada em {new Date(vaga.created_at).toLocaleDateString('pt-BR')}
        </div>
      </div>

      <Link 
        href={`/vagas/${vaga.id}`}
        className="w-full py-3 bg-muted text-primary hover:bg-accent hover:text-accent-foreground rounded-xl font-bold text-sm text-center transition-all"
      >
        Ver Oportunidade
      </Link>
    </div>
  )
}
