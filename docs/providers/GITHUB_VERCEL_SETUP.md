# GitHub & Vercel Integration Guide

Este guia detalha a configuração das chaves de infraestrutura para permitir o deploy das páginas estáticas e atualizações automatizadas no repositório do Organic Traffic OS.

---

## 1. Configurando o GitHub

O Organic Traffic OS precisa de um **Personal Access Token (PAT)** para ler e salvar configurações.

### Passo a Passo:
1. Vá nas configurações do seu perfil no GitHub.
2. Clique em **Developer settings** > **Personal Access Tokens** > **Tokens (classic)** ou *Fine-grained tokens*.
3. Crie um token com os scopes:
   - `repo` (Acesso total para commits e leitura em repositórios privados).
4. Configure as seguintes chaves nas variáveis:
   ```env
   GITHUB_TOKEN="seu_github_token"
   GITHUB_OWNER="FranciscoDGA"
   GITHUB_REPO="Organic-Traffic-OS"
   GITHUB_DEFAULT_BRANCH="main"
   ```

---

## 2. Configurando o Vercel

O token da Vercel é necessário para que a orquestração envie o sinal de deploy estático ou ISR sempre que um artigo for aprovado.

### Passo a Passo:
1. Acesse o painel da [Vercel Personal Tokens](https://vercel.com/account/tokens).
2. Crie um novo token de acesso.
3. Obtenha o seu `VERCEL_PROJECT_ID` acessando as configurações do seu projeto na Vercel.
4. Preencha as chaves:
   ```env
   VERCEL_TOKEN="seu_token_da_vercel"
   VERCEL_PROJECT_ID="project_id_do_seu_app"
   VERCEL_TEAM_ID="team_id_caso_use_conta_organizacao_opcional"
   ```
5. Você pode testar e validar o deploy rodando os scripts do publisher queue.
