import { z } from 'zod'

const ExperienciaSchema = z.object({
  cargo: z.string(),
  empresa: z.string(),
  periodo: z.string(),
  descricao: z.string().optional(),
})

const CurriculoJsonSchema = z.object({
  experiencias: z.array(ExperienciaSchema).default([]),
})

type CurriculoData = z.infer<typeof CurriculoJsonSchema>

// This should NOT error if CurriculoData.experiencias is not optional
const data: CurriculoData = {
  experiencias: []
}

console.log('Type check successful')
