# ✅ Checklist para Deploy na Cloudflare Pages

## Status Atual: ✅ PRONTO PARA DEPLOY (via OpenNext)

Este projeto está configurado para rodar na infraestrutura da Cloudflare usando `@opennextjs/cloudflare`.

---

## 📋 Pré-requisitos Verificados

- ✅ **Build**: Compatível com Cloudflare Workers (Next.js 16.2.4)
- ✅ **Tool**: `@opennextjs/cloudflare` integrado
- ✅ **Environment**: Variáveis compatíveis com Cloudflare Pages

---

## 🔐 Variáveis de Ambiente Necessárias

Configure estas variáveis no painel da Cloudflare (Settings > Functions > Environment Variables):

### Supabase (Obrigatório)
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
```

### Resend (Obrigatório para Emails)
```env
RESEND_API_KEY=sua-chave-resend
```

### Configurações
```env
NEXT_PUBLIC_SITE_URL=https://seu-dominio.pages.dev
```

---

## 🚀 Passos para Deploy

### 1️⃣ Build Local (Para Teste)
```bash
npx opennextjs-cloudflare build
```

### 2️⃣ Deploy via CLI
```bash
npx wrangler pages deploy .open-next/assets --project-name seu-projeto
```

### 3️⃣ Deploy Automático (GitHub)
1. Conecte seu repositório na Cloudflare Pages.
2. Configure o comando de build: `npx opennextjs-cloudflare build`
3. Configure o diretório de saída: `.open-next/assets`
4. Adicione as Variáveis de Ambiente no painel.

---

## ⚙️ Configurações Importantes

- **Compatibility Date**: `2024-05-06` (ou superior)
- **Compatibility Flags**: `nodejs_compat` (Obrigatório)

---

## 🔍 O Que Foi Verificado

✅ Suporte a Server Actions  
✅ Middleware simulado via Proxy  
✅ Integração com Supabase Auth  
✅ Envio de emails via Resend  
✅ Design responsivo Tailwind v4  

---

## ⚠️ Importante (Cloudflare Workers)

1. **Edge Runtime**: O projeto roda em ambiente V8 isolado. Evite APIs nativas de Node.js que não sejam compatíveis com `nodejs_compat`.
2. **Cold Starts**: Mínimos devido à arquitetura global da Cloudflare.
3. **Limites de Tamanho**: O worker final deve respeitar os limites do seu plano Cloudflare (Free: 1MB comprimido).

---

## 🆘 Troubleshooting

### Erro de Build: "Module not found"
**Solução**: Verifique se todas as dependências estão em `dependencies` e não apenas em `devDependencies` se forem necessárias em runtime.

### Erro de Variável: "NEXT_PUBLIC_... is undefined"
**Solução**: Variáveis `NEXT_PUBLIC` precisam estar presentes no momento do build. Certifique-se de que elas foram adicionadas ao painel da Cloudflare ANTES de iniciar um novo deploy.

---

**Última atualização**: 08 de Maio de 2026  
**Status**: ✅ Pronto para produção na Cloudflare
