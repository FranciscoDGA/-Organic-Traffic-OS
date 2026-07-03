# Sprint 26.5 — Fact Agent V1

## O Que Foi Criado
O quarto agente autônomo da cadeia editorial: o **Fact Agent**. Responsável por validar, consolidar e identificar conflitos em todas as informações antes que o conteúdo seja redigido.

## Arquitetura do Evidence Pack
O Research Pack agora passa pelo Fact Agent, que gera o **Evidence Pack**. O pacote contém:
- **Fatos Aprovados**: Informações validadas ou extraídas diretamente do Knowledge Core.
- **Fatos Pendentes**: Informações que carecem de validação em fonte primária.
- **Conflitos**: Discrepâncias detectadas entre múltiplas fontes.
- **Métricas de Confiança**: 
  - **Grade**: Uma nota (`A`, `B`, `C`, `D`, `F`) indicando a confiabilidade do conjunto.
  - **Rastreabilidade Global (%)**: Percentual de fatos que possuem origem confirmada e rastreável.
  - **Confiança Média**: Score numérico refletindo a confiança agregada nos dados.

## Cadeia Atual (Pipeline de Agentes)
```
Discovery Agent  →  Planning Agent  →  Research Agent  →  Fact Agent
       🤖                 📋                 🔬                 ⚖️
  Oportunidades        Backlog        Research Pack     Evidence Pack
```
A API `/api/organic-os/agents/fact/run` agora executa o pipeline automaticamente a partir da descoberta (se nenhum pacote anterior for fornecido).

## Regras de Qualidade Implementadas
- O agente não escreve conteúdo.
- Nenhuma informação conflitante é suprimida ou resolvida arbitrariamente; elas são explicitadas para revisão humana.
- Histórico e origem dos dados são rigorosamente preservados.

## UI Premium
O painel foi criado seguindo o padrão premium:
- 4 abas interativas (Evidence Pack, Fatos Aprovados, Conflitos, Métricas de Confiança).
- Visualização clara dos conflitos com alertas avermelhados (HSL-based tokens).
- Exibição de score (grade) em tempo real, condicionado aos resultados da validação.

## Próximos Passos
Na próxima etapa, o **Writer Agent** deverá consumir os dados aprovados pelo Evidence Pack, garantindo que o conteúdo final seja factualmente seguro e rastreável.
