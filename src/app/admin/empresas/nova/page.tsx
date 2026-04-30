'use client'

import { useActionState, useState, useRef } from 'react'
import { createEmpresaAction } from '@/app/actions/admin'
import Link from 'next/link'
import { ArrowLeft, Building2, Search, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { ESTADOS_BR } from '@/lib/constants'

const initialState = {
  error: null as string | null,
}

// Formata CNPJ: 00.000.000/0000-00
function formatCNPJ(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

// Valida CNPJ (algoritmo oficial)
function isValidCNPJ(cnpj: string) {
  const digits = cnpj.replace(/\D/g, '')
  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return false

  const calc = (d: string, n: number) => {
    let sum = 0
    let pos = n - 7
    for (let i = n; i >= 1; i--) {
      sum += parseInt(d[n - i]) * pos--
      if (pos < 2) pos = 9
    }
    const rem = sum % 11
    return rem < 2 ? 0 : 11 - rem
  }

  return (
    calc(digits, 12) === parseInt(digits[12]) &&
    calc(digits, 13) === parseInt(digits[13])
  )
}

interface EmpresaData {
  nome: string
  setor: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cep: string
  cidade: string
  estado: string
  site: string
}

export default function NovaEmpresaPage() {
  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await createEmpresaAction(formData)
      return result || { error: null }
    },
    initialState
  )

  const [cnpj, setCnpj] = useState('')
  const [cnpjStatus, setCnpjStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid' | 'error'>('idle')
  const [empresaData, setEmpresaData] = useState<EmpresaData | null>(null)
  const cnpjRawRef = useRef('')

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value)
    setCnpj(formatted)
    cnpjRawRef.current = formatted.replace(/\D/g, '')
    // Reset status ao editar
    if (cnpjStatus !== 'idle') setCnpjStatus('idle')
    setEmpresaData(null)
  }

  const handleConsultarCNPJ = async () => {
    const raw = cnpjRawRef.current
    if (!isValidCNPJ(raw)) {
      setCnpjStatus('invalid')
      return
    }

    setCnpjStatus('loading')
    try {
      let nome = '', setor = '', logradouro = '', numero = '', complemento = '', bairro = '', cep = '', cidade = '', estado = ''

      // 1ª tentativa: BrasilAPI
      const res1 = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${raw}`)
      if (res1.ok) {
        const data = await res1.json()
        nome = data.razao_social || data.nome_fantasia || ''
        setor = data.cnae_fiscal_descricao || ''
        logradouro = [data.descricao_tipo_de_logradouro, data.logradouro].filter(Boolean).join(' ')
        numero = data.numero || ''
        complemento = data.complemento || ''
        bairro = data.bairro || ''
        cep = data.cep || ''
        cidade = data.municipio || ''
        estado = data.uf || ''
      } else {
        // 2ª tentativa: cnpj.ws (cobertura maior)
        const res2 = await fetch(`https://publica.cnpj.ws/cnpj/${raw}`)
        if (res2.ok) {
          const data = await res2.json()
          nome = data.razao_social || data.nome_fantasia || ''
          setor = data.cnae_fiscal?.descricao || ''
          logradouro = data.estabelecimento?.tipo_logradouro
            ? `${data.estabelecimento.tipo_logradouro} ${data.estabelecimento.logradouro || ''}`
            : data.estabelecimento?.logradouro || ''
          numero = data.estabelecimento?.numero || ''
          complemento = data.estabelecimento?.complemento || ''
          bairro = data.estabelecimento?.bairro || ''
          cep = data.estabelecimento?.cep || ''
          cidade = data.estabelecimento?.cidade?.nome || ''
          estado = data.estabelecimento?.estado?.sigla || ''
        } else {
          setCnpjStatus('error')
          return
        }
      }

      setEmpresaData({ nome, setor, logradouro, numero, complemento, bairro, cep, cidade, estado, site: '' })
      setCnpjStatus('valid')
    } catch {
      setCnpjStatus('error')
    }
  }

  const inputClass = "w-full px-3 py-2 rounded-md border border-border focus:ring-1 focus:ring-accent outline-none bg-background text-foreground text-sm"
  const labelClass = "block text-sm font-medium text-primary mb-1"

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/empresas" className="p-2 bg-white border border-border rounded-lg text-muted-foreground hover:text-primary transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-serif text-primary">Cadastrar Nova Empresa</h1>
          <p className="text-muted-foreground text-sm mt-1">Crie as credenciais de acesso para um novo cliente.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 md:p-8">
        <form action={formAction} className="space-y-6">
          {state.error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm font-medium border border-red-200">
              {state.error}
            </div>
          )}

          {/* BLOCO: CNPJ + Consulta */}
          <div>
            <h3 className="text-lg font-bold font-serif text-primary flex items-center gap-2 mb-4 pb-2 border-b border-border">
              <Building2 className="w-5 h-5 text-accent" />
              Dados Cadastrais
            </h3>

            <div className="space-y-1 mb-4">
              <label className={labelClass}>CNPJ *</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    name="cnpj"
                    type="text"
                    required
                    value={cnpj}
                    onChange={handleCnpjChange}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    className={`${inputClass} pr-10 ${
                      cnpjStatus === 'invalid' ? 'border-red-400 focus:ring-red-400' :
                      cnpjStatus === 'valid' ? 'border-green-400 focus:ring-green-400' : ''
                    }`}
                  />
                  {cnpjStatus === 'valid' && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                  {cnpjStatus === 'invalid' && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleConsultarCNPJ}
                  disabled={cnpjStatus === 'loading' || cnpj.replace(/\D/g, '').length < 14}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  {cnpjStatus === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Consultar
                </button>
              </div>
              {cnpjStatus === 'invalid' && (
                <p className="text-xs text-red-500 mt-1">CNPJ inválido. Verifique os dígitos.</p>
              )}
              {cnpjStatus === 'error' && (
                <p className="text-xs text-amber-600 mt-1">Não foi possível consultar. Preencha os dados manualmente.</p>
              )}
              {cnpjStatus === 'valid' && (
                <p className="text-xs text-green-600 mt-1">✓ Dados preenchidos automaticamente pela Receita Federal.</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Razão Social / Nome Fantasia *</label>
                <input
                  name="nome"
                  type="text"
                  required
                  defaultValue={empresaData?.nome || ''}
                  key={`nome-${empresaData?.nome}`}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Setor / Segmento</label>
                <input
                  name="setor"
                  type="text"
                  defaultValue={empresaData?.setor || ''}
                  key={`setor-${empresaData?.setor}`}
                  placeholder="Ex: Tecnologia, Saúde..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Site</label>
                <input name="site" type="url" placeholder="https://..." className={inputClass} />
              </div>

              {/* Endereço Completo */}
              <div className="md:col-span-2 mt-2">
                <h4 className="text-sm font-semibold text-primary mb-3 pb-1 border-b border-border">Endereço</h4>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Logradouro</label>
                <input
                  name="logradouro"
                  type="text"
                  defaultValue={empresaData?.logradouro || ''}
                  key={`logradouro-${empresaData?.logradouro}`}
                  placeholder="Ex: Avenida Paulista"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Número</label>
                <input
                  name="numero"
                  type="text"
                  defaultValue={empresaData?.numero || ''}
                  key={`numero-${empresaData?.numero}`}
                  placeholder="Ex: 1000"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Complemento</label>
                <input
                  name="complemento"
                  type="text"
                  defaultValue={empresaData?.complemento || ''}
                  key={`complemento-${empresaData?.complemento}`}
                  placeholder="Ex: Sala 42, Andar 3"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Bairro</label>
                <input
                  name="bairro"
                  type="text"
                  defaultValue={empresaData?.bairro || ''}
                  key={`bairro-${empresaData?.bairro}`}
                  placeholder="Ex: Centro"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>CEP</label>
                <input
                  name="cep"
                  type="text"
                  defaultValue={empresaData?.cep || ''}
                  key={`cep-${empresaData?.cep}`}
                  placeholder="00000-000"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Cidade *</label>
                <input
                  name="cidade"
                  type="text"
                  required
                  defaultValue={empresaData?.cidade || ''}
                  key={`cidade-${empresaData?.cidade}`}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Estado *</label>
                <select
                  name="estado"
                  required
                  defaultValue={empresaData?.estado || ''}
                  key={`estado-${empresaData?.estado}`}
                  className={`${inputClass} bg-white`}
                >
                  <option value="">Selecione...</option>
                  {ESTADOS_BR.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* BLOCO: Credenciais */}
          <div>
            <h3 className="text-lg font-bold font-serif text-primary flex items-center gap-2 mb-4 pb-2 border-b border-border">
              Credenciais de Acesso
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>E-mail Corporativo *</label>
                <input name="email" type="email" required className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Senha Provisória *</label>
                <input name="password" type="text" required className={inputClass} />
                <p className="text-xs text-muted-foreground mt-1">Compartilhe com o cliente. Ele poderá alterar depois.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-4">
            <Link
              href="/admin/empresas"
              className="px-6 py-2 border border-border rounded-md text-primary font-medium hover:bg-muted transition-colors text-sm"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={pending}
              className="px-6 py-2 bg-accent text-white rounded-md font-medium hover:bg-accent/90 transition-colors disabled:opacity-70 text-sm"
            >
              {pending ? 'Criando Conta...' : 'Cadastrar Empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
