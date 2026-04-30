import { Building2, MapPin, Briefcase, Calendar } from 'lucide-react'
import Link from 'next/link'

interface Props {
  vaga: any
}

export function VagaCard({ vaga }: Props) {
  return (
    <div className="bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-border hover:border-accent/40 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
      <div className="mb-3 sm:mb-4">
        <div className="flex justify-between items-start gap-2 sm:gap-3 mb-1.5 sm:mb-2">
          <h3 className="font-bold text-base sm:text-lg text-primary leading-tight group-hover:text-accent transition-colors">
            {vaga.titulo}
          </h3>
          <span className="text-[8px] sm:text-[10px] font-black uppercase bg-accent/10 text-accent px-2 py-1 rounded whitespace-nowrap shrink-0">
            {vaga.modalidade}
          </span>
        </div>
        <p className="text-[10px] sm:text-sm font-bold text-muted-foreground flex items-center gap-1.5 uppercase">
          <Building2 className="w-3 sm:w-4 h-3 sm:h-4" /> <span className="truncate">{(vaga.empresa as any)?.nome}</span>
        </p>
      </div>

      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 flex-1">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs text-muted-foreground font-medium">
          <MapPin className="w-3 sm:w-4 h-3 sm:h-4 text-accent shrink-0" />
          <span className="truncate">{vaga.cidade} - {vaga.estado}</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs text-muted-foreground font-medium">
          <Briefcase className="w-3 sm:w-4 h-3 sm:h-4 text-accent shrink-0" />
          {vaga.area}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs text-muted-foreground font-medium">
          <Calendar className="w-3 sm:w-4 h-3 sm:h-4 text-accent shrink-0" />
          Postada em {new Date(vaga.created_at).toLocaleDateString('pt-BR')}
        </div>
      </div>

      <Link 
        href={`/vagas/${vaga.id}`}
        className="w-full py-2.5 sm:py-3 bg-muted text-primary hover:bg-accent hover:text-accent-foreground rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm text-center transition-all"
      >
        Ver Oportunidade
      </Link>
    </div>
  )
}
