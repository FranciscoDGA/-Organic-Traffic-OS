# Resumo da Sprint 04 - Competitor Intelligence Engine

## O que foi criado
O **Competitor Intelligence Engine** é a nossa arma secreta para entender quem manda no Google hoje e onde estão as brechas na armadura deles. Com este motor, o PassaCumaru não precisa adivinhar pautas, ele ataca nas fraquezas dos gigantes.

Mantendo a coesão da V2, dividimos:

### 1. Lógica do Motor
Local: `shared/competitors/`
- `competitor-engine.ts`: Faz o scan de concorrência.
- `competitor-validator.ts`: Protege a integridade do banco JSON contra corrupções manuais ou quebras de APIs de scraping (futuras).
- `competitor-loader.ts`: Junta os 5 arquivos de catálogo e monta um único "mapa de guerra".

### 2. Base de Conhecimento (Dados)
Local: `shared/knowledge/blogs/passacumaru/competitors/`
Fingimos o cadastro de 3 tubarões reais/genéricos do nicho de concursos para ver o motor funcionar:
- `competitors.json`: Cadastro master (Estratégia Concursos, QConcursos, Concursos no Brasil).
- `competitor-profile.json`: Descobrimos que o Estratégia não liga muito para prefeituras minúsculas.
- `content-strategy.json`: Vimos a frequência esmagadora deles.
- `opportunity-map.json`: Mapeamos lacunas. O principal foi notar que artigos chamados "O que cai na prova da Banca IVIN" são raríssimos e domináveis.
- `strengths-weaknesses.json`: O clássico SWOT. Se a fraqueza deles é o foco hiper-local, a nossa força tem que ser essa.

### 3. Painel Frontend
Local: `/organic-os/competitors`
Criamos o Radar de Concorrência. Lá é possível ver os totais de concorrentes rastreados, o nível de ameaça, os Destaques de Fraquezas (SWOT) e as Oportunidades de Ouro (ex: criar resumos muito locais).

## Uso Futuro
A partir das próximas Sprints, os agentes de Keyword Research e Content Generation já farão uso do `CompetitorLoader`. Um artigo só será escrito se tiver chance de desbancar pelo menos 1 dos 3 concorrentes mapeados.
