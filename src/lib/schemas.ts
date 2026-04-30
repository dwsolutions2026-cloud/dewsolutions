import { z } from 'zod'

export const VagaSchema = z.object({
  empresa_id: z.string().uuid("ID da empresa inválido"),
  titulo: z.string().min(5, "O título deve ter no mínimo 5 caracteres").max(100),
  area: z.string().min(2, "Área é obrigatória"),
  descricao: z.string().min(20, "A descrição deve ter no mínimo 20 caracteres"),
  requisitos: z.string().optional(),
  beneficios: z.string().optional(),
  regime: z.string().optional(),
  modalidade: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().max(2).optional(),
  quantidade_vagas: z.number().int().min(1, "A quantidade deve ser no mínimo 1"),
  salario_min: z.number().nullable().optional(),
  salario_max: z.number().nullable().optional(),
  exibir_salario: z.boolean().default(false),
})

export const CandidatoRegistrationSchema = z.object({
  nome: z.string().min(3, "Nome completo obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().optional(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  passwordConfirm: z.string(),
  cidade: z.string().optional(),
  estado: z.string().max(2).optional(),
  lgpd: z.literal('on', {
    errorMap: () => ({ message: "Você deve aceitar os termos de privacidade" })
  }),
}).refine(data => data.password === data.passwordConfirm, {
  message: "As senhas não coincidem",
  path: ["passwordConfirm"],
})

export const ConvocacaoSchema = z.object({
  candidatura_id: z.string().uuid(),
  data_entrevista: z.string().min(5, "Data obrigatória"),
  local_entrevista: z.string().min(5, "Local obrigatório"),
  observacao: z.string().optional(),
})
