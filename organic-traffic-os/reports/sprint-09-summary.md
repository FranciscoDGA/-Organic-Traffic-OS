# Resumo da Sprint 09 - Editorial Planning Engine V1

## O Editor-Chefe
Nesta Sprint, consolidamos o workflow estratégico do Organic Traffic OS com o **Editorial Planning Engine**.
Enquanto a Sprint 08 dizia *o que é bom fazer*, a Sprint 09 diz **quando e em que ordem fazer**.

### O Sistema de Agendamento (`EditorialPlanner`)
Quando o método `generate()` é chamado, ele pega as Oportunidades geradas anteriormente e executa a mágica de alocação:
1. **Regras e Dependências (`EditorialRules`)**: O sistema verifica a topologia de dependências (Pilar vs. Filhos). Se um artigo satélite foi aprovado, mas a Página Pilar dele não existe, ele é automaticamente jogado na gaveta dos `bloqueados` no Backlog.
2. **Ranking Tático (`EditorialRanking`)**: Ele re-calcula o score da pauta somando o peso da sua categoria (ex: notícias ganham *Freshness*) e se a pauta é pai de outras pautas (desbloqueando trabalho para o futuro).
3. **Divisão de Funil**:
   - Os 10 artigos mais críticos entram no **Calendário (`calendar.json`)** e recebem uma data de publicação automática (distribuída a cada 2 dias).
   - O restante cai no **Backlog de Curto/Médio Prazo (`backlog.json`)** aguardando a próxima janela do calendário.

### Padronização em JSON
Tudo é persistido no diretório `shared/knowledge/blogs/passacumaru/editorial/`, isolando a inteligência para que qualquer blog no futuro consiga ter seu próprio calendário sem misturar os bancos de dados.

### A Central do Editor
Na interface gráfica (`/organic-os/editorial`), criamos uma visualização em Kanban-Style de duas colunas:
- À esquerda: O Calendário Tático contendo datas reais.
- À direita: A "geladeira" (Backlog), listando os títulos que estão aguardando vez.

Com o clique em "Montar Editoria Completa", toda a cadeia desde as Keywords até as datas de publicação é calculada sem zero intervenção humana. A automação completa pré-escrita está pronta!
