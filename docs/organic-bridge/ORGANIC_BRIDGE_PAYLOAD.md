# Organic Bridge Payload Specification

Este documento descreve o formato do payload `JSON` exigido pelo endpoint `POST /api/organic-publisher/publish`.

---

## 1. Exemplo Completo de Payload

```json
{
  "workspace_id": "passacumaru",
  "content_id": "uuid-artigo-102",
  "title": "Guia Completo de Estudo para Concursos",
  "slug": "guia-estudo-concursos-2026",
  "excerpt": "Aprenda como se organizar e passar em concursos federais e estaduais.",
  "html": "<p>Conteúdo HTML completo...</p>",
  "markdown": "# Guia Completo...",
  "category": "Concursos",
  "tags": ["estudo", "concursos", "planejamento"],
  "status": "draft",
  "author": "Equipe Editorial",
  "featured_image": {
    "url": "https://supabase-storage/images/concurso.webp",
    "alt": "Estudante revisando cronograma em frente ao computador",
    "caption": "Estudos ativos são fundamentais para retenção.",
    "credit": "Freepik",
    "source": "Unsplash"
  },
  "images": [
    {
      "url": "https://supabase-storage/images/grafico.webp",
      "alt": "Gráfico mostrando distribuição de disciplinas cobradas em provas",
      "caption": "Distribuição percentual média.",
      "placement": "internal_1"
    }
  ],
  "cta": "Assine nossa newsletter para receber alertas de editais!",
  "metadata": {
    "word_count": 1200,
    "reading_time_minutes": 5
  }
}
```
