'use client'

import { useState } from 'react'
import { saveVagaAction } from '@/app/actions/empresa'

interface VagaFormProps {
  empresaId: string
  vaga?: any // If editing
}

export function VagaForm({ empresaId, vaga }: VagaFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append('empresaId', empresaId)
    if (vaga) {
      formData.append('id', vaga.id)
    }

    const result = await saveVagaAction(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // If successful, the server action will redirect to /empresa/vagas
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-primary mb-1">Título da Vaga *</label>
          <input 
            name="titulo" 
            type="text" 
            defaultValue={vaga?.titulo}
            required 
            className="w-full px-3 py-2 rounded-md border border-border focus:ring-1 focus:ring-accent outline-none" 
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-primary mb-1">Descrição *</label>
          <textarea 
            name="descricao" 
            rows={5}
            defaultValue={vaga?.descricao}
            required 
            className="w-full px-3 py-2 rounded-md border border-border focus:ring-1 focus:ring-accent outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Requisitos</label>
          <textarea 
            name="requisitos" 
            rows={3}
            defaultValue={vaga?.requisitos}
            className="w-full px-3 py-2 rounded-md border border-border focus:ring-1 focus:ring-accent outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Benefícios</label>
          <textarea 
            name="beneficios" 
            rows={3}
            defaultValue={vaga?.beneficios}
            className="w-full px-3 py-2 rounded-md border border-border focus:ring-1 focus:ring-accent outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Modalidade *</label>
          <select 
            name="modalidade" 
            required 
            defaultValue={vaga?.modalidade || 'Presencial'}
            className="w-full px-3 py-2 rounded-md border border-border focus:ring-1 focus:ring-accent outline-none bg-white"
          >
            <option value="Presencial">Presencial</option>
            <option value="Híbrido">Híbrido</option>
            <option value="Remoto">Remoto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Regime *</label>
          <select 
            name="regime" 
            required 
            defaultValue={vaga?.regime || 'CLT'}
            className="w-full px-3 py-2 rounded-md border border-border focus:ring-1 focus:ring-accent outline-none bg-white"
          >
            <option value="CLT">CLT</option>
            <option value="PJ">PJ</option>
            <option value="Estágio">Estágio</option>
            <option value="Temporário">Temporário</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Cidade *</label>
          <input 
            name="cidade" 
            type="text" 
            required 
            defaultValue={vaga?.cidade}
            className="w-full px-3 py-2 rounded-md border border-border focus:ring-1 focus:ring-accent outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Estado (UF) *</label>
          <input 
            name="estado" 
            type="text" 
            required 
            maxLength={2}
            defaultValue={vaga?.estado}
            className="w-full px-3 py-2 rounded-md border border-border focus:ring-1 focus:ring-accent outline-none uppercase" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Salário Mínimo</label>
          <input 
            name="salario_min" 
            type="number" 
            step="0.01"
            defaultValue={vaga?.salario_min}
            className="w-full px-3 py-2 rounded-md border border-border focus:ring-1 focus:ring-accent outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Salário Máximo</label>
          <input 
            name="salario_max" 
            type="number" 
            step="0.01"
            defaultValue={vaga?.salario_max}
            className="w-full px-3 py-2 rounded-md border border-border focus:ring-1 focus:ring-accent outline-none" 
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-2">
          <input 
            name="exibir_salario" 
            id="exibir_salario" 
            type="checkbox" 
            defaultChecked={vaga?.exibir_salario}
            className="w-4 h-4 text-accent border-border rounded focus:ring-accent" 
          />
          <label htmlFor="exibir_salario" className="text-sm font-medium text-primary">Exibir faixa salarial no anúncio</label>
        </div>

        {vaga && (
          <div className="md:col-span-2 flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <input 
              name="status" 
              id="status_ativa" 
              type="radio" 
              value="ativa"
              defaultChecked={vaga.status === 'ativa'}
              className="w-4 h-4 text-accent border-border" 
            />
            <label htmlFor="status_ativa" className="text-sm font-medium text-primary mr-4">Vaga Ativa</label>

            <input 
              name="status" 
              id="status_encerrada" 
              type="radio" 
              value="encerrada"
              defaultChecked={vaga.status === 'encerrada'}
              className="w-4 h-4 text-red-600 border-border" 
            />
            <label htmlFor="status_encerrada" className="text-sm font-medium text-red-600">Vaga Encerrada</label>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-border flex justify-end gap-4">
        <button 
          type="button" 
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-border rounded-md text-primary font-medium hover:bg-muted transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-2 bg-accent text-white rounded-md font-medium hover:bg-accent/90 transition-colors disabled:opacity-70"
        >
          {loading ? 'Salvando...' : (vaga ? 'Salvar Alterações' : 'Publicar Vaga')}
        </button>
      </div>
    </form>
  )
}
