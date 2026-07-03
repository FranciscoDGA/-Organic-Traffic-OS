# GitHub Integration & Tokens Guide

Este guia orienta a conexão segura com os repositórios do GitHub.

---

## 1. Criando o Personal Access Token (PAT)

O Organic Traffic OS precisa de um token de acesso para salvar configurações nos arquivos do repositório:

1. Acesse o GitHub > Perfil > **Settings** > **Developer Settings** > **Personal Access Tokens** > **Tokens (classic)**.
2. Clique em **Generate new token**.
3. Defina um nome descritivo (ex: `Organic OS Deploy`).
4. Selecione os seguintes escopos:
   - `repo` (Acesso total a repositórios públicos e privados).
5. Clique em **Generate Token** e copie o valor exibido.

---

## 2. Configurando o Repositório

Preencha as seguintes chaves no ambiente do Organic OS:
```env
GITHUB_TOKEN="seu_pat_gerado"
GITHUB_OWNER="FranciscoDGA"
GITHUB_REPO="Organic-Traffic-OS"
GITHUB_DEFAULT_BRANCH="main"
```
