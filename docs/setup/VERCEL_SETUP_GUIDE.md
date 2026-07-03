# Vercel Deployment & Setup Guide

Este manual orienta como subir o painel central do Organic Traffic OS na Vercel de forma segura e estável.

---

## 1. Passo a Passo do Deploy

1. Acesse o painel da [Vercel](https://vercel.com).
2. Clique em **Add New** > **Project**.
3. Importe o repositório `Organic-Traffic-OS` do seu GitHub.
4. Em **Framework Preset**, selecione **Next.js**.
5. Abra a seção **Environment Variables** e insira todas as chaves obrigatórias detalhadas no manual de variáveis.
6. Clique em **Deploy**.

---

## 2. Configurações por Ambiente

Você pode mapear chaves diferentes com base no ambiente de deploy:
- **Production**: Apenas para deploy da branch `main`. Exige chaves válidas de IA, Supabase de produção e domínio customizado.
- **Staging/Preview**: Para testar pull requests. Pode usar Supabase de testes ou credenciais com limites menores.
- **Development**: Mapeado para o seu ambiente local (`.env.local`).
