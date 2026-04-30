'use client'

import { useActionState, useState } from 'react'
import { registerCandidateAction } from '@/app/actions/auth'
import Link from 'next/link'
import { FileText, UserPlus } from 'lucide-react'

const initialState = {
  error: null as string | null,
}

export default function CadastroPage() {
  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await registerCandidateAction(formData)
      return result || { error: null }
    },
    initialState
  )
  
  const [fileName, setFileName] = useState<string | null>(null)

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted">
      <div className="w-full max-w-2xl space-y-8 bg-card p-8 rounded-xl shadow-sm border border-border">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-accent" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-primary">
            Cadastre seu Currículo
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Crie sua conta gratuitamente e conecte-se com as melhores empresas.
          </p>
        </div>

        <form className="mt-8 space-y-6" action={formAction}>
          {state.error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="nome" className="block text-sm font-medium text-primary">
                Nome Completo
              </label>
              <input id="nome" name="nome" type="text" required className="mt-1 block w-full rounded-md border border-border px-3 py-2 bg-card text-foreground" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary">
                E-mail
              </label>
              <input id="email" name="email" type="email" required className="mt-1 block w-full rounded-md border border-border px-3 py-2 bg-card text-foreground" />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-primary">
                Telefone (WhatsApp)
              </label>
              <input id="telefone" name="telefone" type="tel" className="mt-1 block w-full rounded-md border border-border px-3 py-2 bg-card text-foreground" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary">
                Senha
              </label>
              <input id="password" name="password" type="password" required className="mt-1 block w-full rounded-md border border-border px-3 py-2 bg-card text-foreground" />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-primary">
                Confirmação de Senha
              </label>
              <input id="passwordConfirm" name="passwordConfirm" type="password" required className="mt-1 block w-full rounded-md border border-border px-3 py-2 bg-card text-foreground" />
            </div>

            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-primary">
                Cidade
              </label>
              <input id="cidade" name="cidade" type="text" className="mt-1 block w-full rounded-md border border-border px-3 py-2 bg-card text-foreground" />
            </div>

            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-primary">
                Estado (UF)
              </label>
              <input id="estado" name="estado" type="text" maxLength={2} className="mt-1 block w-full rounded-md border border-border px-3 py-2 uppercase" />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-start mb-4 bg-accent/5 p-4 rounded-lg border border-accent/20">
                <div className="flex h-5 items-center">
                  <input
                    id="sem_curriculo"
                    name="sem_curriculo"
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    onChange={(e) => {
                      if (e.target.checked) setFileName(null);
                    }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="sem_curriculo" className="font-medium text-primary cursor-pointer">
                    Não possuo currículo pronto — quero criar um pelo sistema após o cadastro
                  </label>
                  <p className="text-muted-foreground text-xs mt-1">Marque esta opção se você não tem um PDF e deseja preencher seus dados manualmente na próxima tela.</p>
                </div>
              </div>

              <label className="block text-sm font-medium text-primary mb-2">
                Currículo em PDF (Opcional se marcar a opção acima)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileText className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-accent">Clique para anexar</span> ou arraste e solte
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fileName || 'Apenas arquivos PDF (Máx 5MB).'}
                  </p>
                </div>
                <input 
                  id="curriculo" 
                  name="curriculo" 
                  type="file" 
                  accept="application/pdf" 
                  className="hidden" 
                  onChange={(e) => {
                    setFileName(e.target.files?.[0]?.name || null)
                    const checkbox = document.getElementById('sem_curriculo') as HTMLInputElement;
                    if (checkbox && e.target.files?.length) checkbox.checked = false;
                  }}
                />
              </label>
            </div>

            <div className="sm:col-span-2 flex items-start mt-4">
              <div className="flex h-5 items-center">
                <input
                  id="lgpd"
                  name="lgpd"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="lgpd" className="text-muted-foreground">
                  Li e concordo com os termos da{' '}
                  <Link href="/privacidade" className="font-medium text-accent hover:underline">
                    Política de Privacidade (LGPD)
                  </Link>
                  , e autorizo o armazenamento dos meus dados para candidatura em vagas.
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={pending}
              className="flex w-full justify-center rounded-md bg-accent px-3 py-4 text-sm font-semibold text-white hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-70 transition-colors"
            >
              {pending ? 'Criando sua conta...' : 'Finalizar Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
