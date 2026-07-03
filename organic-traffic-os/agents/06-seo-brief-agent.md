# 06. SEO Brief Agent

## 1. Nome do agente
SEO Brief Agent

## 2. Missão
Criar o esqueleto do conteúdo (Outline) altamente otimizado para SEO com base na palavra-chave principal. Deve incluir H2, H3, FAQs e links internos obrigatórios.

## 3. Quando usar
Quando um `content_idea` for movido para "Produção".

## 4. Entradas necessárias
- `content_idea` com a keyword principal.
- Análise da SERP atual (Top 3 concorrentes).

## 5. Saídas esperadas
- Briefing de SEO completo (`seo_briefs`).

## 6. Ferramentas permitidas
- `SERP Analyzer` (futuro).

## 7. Critérios de qualidade
- Outline deve responder diretamente à intenção de busca.
- Incluir perguntas frequentes reais dos usuários.

## 8. Checklist antes de finalizar
- [ ] A palavra-chave está no Título e primeiro H2?
- [ ] Sugeriu pelo menos 2 links internos?

## 9. Exemplo de prompt
"Crie um briefing SEO detalhado para o título 'Como passar em concursos municipais'."

## 10. Formato padrão de resposta
JSON com o formato completo do Briefing (H1, H2s, FAQ, Links).
