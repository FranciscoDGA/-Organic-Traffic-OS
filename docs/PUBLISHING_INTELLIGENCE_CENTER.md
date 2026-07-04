# Publishing Intelligence Center (PIC)

## Visão Geral
O PIC é a camada de inteligência do **Organic Traffic OS** responsável por planejar e cadenciar as publicações.
Ele protege a audiência e o AdSense contra "floods" (muitas publicações ao mesmo tempo) ou ausência de publicações, garantindo uma distribuição saudável do conteúdo.

## Estratégias por Workspace
O PIC suporta diferentes ritmos baseados na identidade do Workspace:
- **PassaCumaru:** Educacional, suporta bom volume (até 10/semana).
- **Qual o Seguro:** Focado em lead gen, ritmo cadenciado e horários nobres de acesso.
- **UtilPro Brasil:** Conteúdos evergreen e reviews, que suportam publicações amplas e constantes (até 15/semana).
- **Tabuômetro:** Editorial puro, o motor aceita o maior fluxo diário de todos (até 30/semana).
- **AI Agency OS:** Publicações de altíssima autoridade e estudos de caso, limitadas para manter a exclusividade (3/semana).

## Fila Inteligente (Smart Queue)
Quando o "Universal Publisher" recebe um pacote aprovado pelo fluxo de QA e Mission Control, ele não publica imediatamente (a menos que seja `publishNow`). O pacote é colocado na Smart Queue e recebe um `scheduled_for` baseado no limite diário e horário preferencial do Workspace.

*Na v1.0, o mecanismo funciona de modo rule-based na memória.*
