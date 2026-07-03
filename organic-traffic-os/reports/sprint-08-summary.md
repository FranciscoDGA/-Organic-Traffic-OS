# Resumo da Sprint 08 - Opportunity Discovery Engine V1

## A Primeira Decisão Inteligente
Até a Sprint 07, o Organic Traffic OS estava "estudando". Ele mapeou o inventário, catalogou inimigos, separou palavras-chave por intenção e criou escudos de coleta.
Nesta Sprint 08, nós criamos o **Cérebro**.

O `OpportunityEngine` não produz os textos finais, mas ele decide o que **deve** ser escrito.

### O Pipeline de Extração (`runWorkflow`)
O que o nosso Workflow Inteligente faz quando você clica em "Gerar Oportunidades"?
1. Ele carrega toda a base de **Keywords**.
2. Ele carrega todo o mapa de fraquezas dos **Competitors**.
3. Ele varre o **Inventory** para saber o que já escrevemos.
4. Ele gera dezenas de rascunhos de pautas (candidatos).
5. Ele joga os candidatos na parede das **Regras (`OpportunityRules`)**:
   - Já temos um artigo com nome parecido? Deleta o candidato.
   - É uma Keyword genérica demais sem intenção clara? Deleta o candidato.
6. Os que sobrevivem vão para o **Ranking Engine (`OpportunityRankingEngine`)**.
   - Se é uma intenção de venda (Transacional), ganha muitos pontos.
   - Se é um conteúdo que os concorrentes não cobrem (*gap*), ganha pontuação máxima.
   - O algoritmo amarra uma Prioridade baseada num Score de 0 a 100.
7. O banco limpo, organizado e ranqueado é salvo em `opportunities.json`.

### A Magia da Arquitetura Distribuída
Ao colocarmos toda essa regra matemática em `shared/opportunities/`, garantimos que, no futuro, quando os Agentes Autônomos de escrita começarem a trabalhar 24 horas por dia, eles só precisam dar um `GET /api/organic-os/opportunities/high-priority` e eles saberão exatamente qual artigo vai render mais dinheiro/tráfego para escrever primeiro.

### Frontend
No painel em `/organic-os/opportunities`, criamos a interface para rodar esse Workflow pesado com um clique, vendo imediatamente a tabela ordenada pelo Score, Intenção e Motivo da geração da pauta.

Temos agora uma máquina autônoma de Planejamento Editorial.
