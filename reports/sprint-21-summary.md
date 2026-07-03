# Sprint 21 - Natural Language Engine V1

## Resumo
A Sprint 21 representa a virada de chave entre "texto escrito por IA" e "texto fluido e humano". O `Natural Language Engine` recebe o plano de adaptação (Sprint 20) e o rascunho de qualidade e o reescreve ativamente visando o ritmo, UX Reading e eliminação daquela famosa "voz passiva robótica".

## Proteção Algorítmica
Como estamos reescrevendo texto, o perigo de "alucinação" aumenta. Para blindar isso, criamos o `LanguageValidator`, que analisa o texto ANTES (`score_antes`) e o DEPOIS (`score_depois`). Ele é programado para jogar o novo texto no lixo e disparar o workflow novamente se detectar que:
1. O *CTA* sumiu.
2. Os tópicos originais (Blueprint H2) foram aglutinados.
3. Informações factuais foram perdidas.

Não há alteração de regras de SEO on-page nesta Sprint. Ela é puramente focada no design semântico e fluidez mental do leitor.
