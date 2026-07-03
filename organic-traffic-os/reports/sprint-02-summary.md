# Resumo da Sprint 02 - Knowledge Core (PassaCumaru)

## O que foi criado
Nesta sprint, criamos a base de conhecimento (Knowledge Core) fundamental para que a IA entenda as regras, a audiência e o tom do primeiro blog do ecossistema: o **PassaCumaru**.

A estrutura foi adaptada para rodar dentro do `/shared/knowledge/`, garantindo que todo o *AI Agency OS* possa consultar as diretrizes de qualquer blog no futuro.

### 1. Arquivos JSON do Blog
Local: `shared/knowledge/blogs/passacumaru/`
Foram criados os seguintes arquivos com as restrições e diretrizes de SEO:
- `01-blog-profile.json`: Missão, descrição e dados básicos.
- `02-target-audience.json`: Personas e dores dos estudantes de concursos.
- `03-editorial-guidelines.json`: Proibições de conteúdos e tom acolhedor.
- `04-categories.json`: Temas principais das matérias.
- `05-products.json`: Produtos à venda com CTA embutidos.
- `06-content-rules.json`: Regras vitais como não alucinar legislação.
- `07-writing-style.json`: Estrutura padrão de H1/H2 e volume de palavras.
- `08-seo-rules.json`: Exigências técnicas e links internos obrigatórios.
- `09-knowledge-index.json`: Índice global para o loader.

### 2. Validador e Carregador (Loader)
Local: `shared/knowledge/`
- `knowledge-validator.ts`: Analisa o diretório do blog garantindo que nenhum arquivo JSON obrigatório esteja faltando ou mal formatado.
- `knowledge-loader.ts`: Junta os arquivos em um único objeto de configuração (Blog, SEO, Público, Regras) pronto para ser injetado no prompt dos agentes.

### 3. API e Dashboard
- `GET /api/organic-os/knowledge?blog_id=passacumaru`: Retorna o JSON unificado e o status de validação.
- `/organic-os/knowledge`: Painel visual para consultar as regras, os públicos e os produtos. Contém indicadores caso o JSON quebre.

## Próximos Passos
Na Sprint 03, os Agentes Autônomos de Pesquisa (Discovery Agent e Keyword Hunter) começarão a fazer consultas a este Knowledge Core para encontrar pautas que condizem 100% com as dores das Personas mapeadas hoje.
