# Opportunity Discovery & Content Intelligence (ODCI)

## Visão Geral
O ODCI atua como um prospector estratégico dentro do Organic Traffic OS. Ele monitora constantemente métricas de performance e estrutura (Knowledge Graph) em busca de oportunidades editoriais de alto impacto.

## Metodologia de Priorização
A priorização é calculada cruzando três variáveis chave:
1. **Impacto Esperado:** Qual o ganho projetado em tráfego, autoridade ou leads.
2. **Esforço Estimado:** Quanto tempo e recursos de IA custarão para executar.
3. **Confiança (Confidence Score):** Quão sólido é o dado que baseou esta oportunidade (ex: dados do Analytics vs previsão genérica).

## Tipos de Oportunidades
- **Atualização de Conteúdo (Decay):** Detecta páginas que historicamente iam bem, mas perderam tráfego.
- **Lacunas de Clusters:** Detecta tópicos "órfãos" que precisam de páginas satélite para completar a autoridade de um cluster (Silo SEO).
- **Formatos Ausentes:** Sugere, por exemplo, criar um "Estudo de Caso" para usuários que ficam retidos no Meio do Funil (MoFu).

## Fluxo Operacional
O ODCI não toma a decisão de gastar recursos de IA. Quando uma oportunidade é selecionada no Dashboard, ela aciona o endpoint `/create-mission`, que por sua vez submete uma nova Missão ao **Mission Control**, aguardando aprovação humana para ser processada pela Content Factory.
