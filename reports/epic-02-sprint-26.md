# Epic 02 - Sprint 26: Search Intelligence Engine

## Resumo
Na Sprint 26 nós implementamos a fundação sensorial do Epic 02. O `Search Intelligence Engine` é capaz de puxar dados reais de busca através do **Adapter Pattern** (Camada de Connectors).

## A Camada de Connectors
Para evitar dívida técnica, o core da Engine *nunca* fala direto com APIs externas (que costumam mudar, sofrer Rate Limit, etc). Em vez disso, a inteligência conversa com uma interface limpa (`IConnector`).
Implementamos o `ConnectorManager` para registrar e invocar Mocks ou Arquivos Manuais, deixando a porta escancarada para GSC, Bing Webmaster e Google Trends através de Injeção de Dependência via variáveis de ambiente.

## O Motor de Oportunidades
O núcleo do sistema roda um algoritmo de vetores para apontar Oportunidades ("Striking Distance", "Baixo CTR", etc). Ele cospe um relatório direto para o novo Dashboard analítico, permitindo que a equipe retroalimente o sistema no "Opportunity Discovery" da Sprint 05.
