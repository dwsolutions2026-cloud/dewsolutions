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

export const ExperienciaSchema = z.object({
  cargo: z.string().min(2, "Cargo obrigatório"),
  empresa: z.string().min(2, "Empresa obrigatória"),
  periodo: z.string().min(2, "Período obrigatório"),
  descricao: z.string().optional(),
})

export const FormacaoSchema = z.object({
  curso: z.string().min(2, "Curso obrigatório"),
  instituicao: z.string().min(2, "Instituição obrigatória"),
  periodo: z.string().min(2, "Período obrigatório"),
  status: z.string().min(2, "Status obrigatório"),
})

export const IdiomaSchema = z.object({
  idioma: z.string().min(2, "Idioma obrigatório"),
  nivel: z.string().min(2, "Nível obrigatório"),
})

export const CurriculoJsonSchema = z.object({
  linkedin: z.string().url("URL do LinkedIn inválida").optional().or(z.literal('')),
  github: z.string().url("URL do GitHub inválida").optional().or(z.literal('')),
  objetivo: z.string().max(300, "Máximo de 300 caracteres").optional(),
  experiencias: z.array(ExperienciaSchema).optional().default([]),
  formacoes: z.array(FormacaoSchema).optional().default([]),
  habilidades: z.string().optional(),
  idiomas: z.array(IdiomaSchema).optional().default([]),
})

export const PerfilSchema = z.object({
  nome: z.string().min(3, "Nome completo obrigatório"),
  telefone: z.string().min(10, "Telefone inválido").optional().or(z.literal('')),
  cidade: z.string().min(2, "Cidade obrigatória").optional().or(z.literal('')),
  estado: z.string().length(2, "UF deve ter 2 letras").toUpperCase().optional().or(z.literal('')),
})

export const EmpresaSchema = z.object({
  nome: z.string().min(3, "Razão Social obrigatória"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  cnpj: z.string().min(14, "CNPJ inválido"),
  setor: z.string().optional(),
  site: z.string().url("URL inválida").optional().or(z.literal('')),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cep: z.string().optional(),
  cidade: z.string().min(2, "Cidade obrigatória"),
  estado: z.string().length(2, "UF deve ter 2 letras").toUpperCase(),
})
