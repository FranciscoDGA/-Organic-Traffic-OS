# Sprint CONFIG-01 — Organic Bridge Endpoints & Secrets for Blogs

Este documento resume a implementação da Sprint CONFIG-01, que prepara os blogs do ecossistema para receber postagens e gerenciar imagens de forma segura e manual, alinhada com as diretrizes do Organic Traffic OS.

---

## 1. Endpoints Criados (Mock / Template)

Implementamos em Next.js os arquivos padrão que servem como especificação e código-fonte modelo para serem implantados em cada blog externo:

- **`POST /api/organic-publisher/publish`** em [route.ts](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/app/api/organic-publisher/publish/route.ts): Recebe o payload do artigo contendo todos os dados e metadados. Realiza validações de token, workspace, CORS de origem, obrigatoriedade de imagem destacada (`featured_image`) e presença de texto alternativo (`alt`) em todas as imagens. Salva o post como `draft` (rascunho) por padrão.
- **`POST /api/organic-publisher/approve`** em [route.ts](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/app/api/organic-publisher/approve/route.ts): Simula a aprovação manual de um rascunho por parte do administrador do blog, promovendo o status para `published` e gerando a URL pública.
- **`GET /api/organic-publisher/status`** em [route.ts](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/app/api/organic-publisher/status/route.ts): Consulta o estado do post no blog.
- **`POST /api/revalidate`** em [route.ts](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/app/api/revalidate/route.ts): Endpoint de revalidação de caminhos estáticos (Next.js ISR) seguro por `REVALIDATE_SECRET`.

---

## 2. Complemento de Imagens Obrigatoriedade

Conforme as regras do complemento, a lógica de publicação agora exige:
- `featured_image`: Dicionário contendo `url` e `alt` (obrigatórios), além de campos adicionais recomendados (`caption`, `credit`, `source`). Caso não seja fornecido, o envio falha com erro 400.
- `images` (Lista de imagens internas): Cada imagem informada na lista deve ter `url` e `alt`. A falta de `alt` bloqueia a requisição.
- Adicionamos um sistema de avisos (`warnings`) que avisa se o artigo contiver menos de 2 ou mais de 3 imagens internas sugeridas, incentivando a densidade ideal para a legibilidade do usuário.

---

## 3. Configurações de Segurança

Os endpoints foram blindados contra:
- **Origens não autorizadas**: Validação de CORS com base em `ORGANIC_ALLOWED_ORIGIN`.
- **Acesso direto incorreto**: Validação de segredo com `ORGANIC_PUBLISHER_SECRET`.
- **Destinatário incorreto**: Validação de workspace comparando o ID com `ORGANIC_ALLOWED_WORKSPACE`.
- **Publicação indesejada**: Forçado `auto_publish = false` e `require_approval = true` para garantir que o fluxo inicial seja sempre rascunho e aprovação manual.

---

## 4. Guia de Configuração e Setup

Foi criado o arquivo [ORGANIC_BRIDGE_SETUP.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/ORGANIC_BRIDGE_SETUP.md) no diretório raiz do projeto para que o Francisco e a equipe possam copiar as diretrizes de código e configurarem facilmente os domínios do Vercel e blogs reais.
