# Sprint 20 - Audience Adaptation Engine V1

## Resumo
A Sprint 20 garante que a linguagem fria, técnica ou acadêmica que as IAs redatoras (Draft Writer) produzem nativamente seja mapeada e exposta. O **Audience Adaptation Engine** lê o rascunho aprovado em Qualidade e traça paralelos imediatos com as especificações locais, como o uso de contextos para concursos municipais.

## Como a adaptação ocorre
O sistema NÃO reescreve automaticamente. Ele cria um **Plano de Adaptação** explícito (identificando palavras que precisam ser substituídas, parágrafos que estão muito densos, etc). Esse plano (`adaptation-report.json`) alimenta diretamente o status `needs_adaptation` na arquitetura.

## Benefício do Workflow
Com isso, o conteúdo só entra para o estágio de `Humanization` quando se tem um mapa de exatamente onde estão as falhas de conexão empática, economizando tokens e barateando custos operacionais na reescrita direcionada.
