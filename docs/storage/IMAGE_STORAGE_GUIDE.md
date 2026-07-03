# Image Storage Guide

Este guia descreve como as imagens são gerenciadas e armazenadas de forma segura e acessível no Organic Traffic OS.

---

## 1. Buckets Dedicados para Imagens

### `images` (Público)
- **Propósito**: Guarda as imagens definitivas de produção (ilustrações, fotos dos artigos, infográficos).
- **Acesso**: Leitura pública e anônima permitida para que os leitores do blog visualizem as imagens nos artigos publicados.

### `generated-images` (Público)
- **Propósito**: Armazena rascunhos de imagens gerados de forma automatizada por modelos de IA (ex: DALL-E, Midjourney) para análise e aprovação prévia.

---

## 2. Regras de Otimização e SEO

- **Extensões de Arquivo**: Dê preferência aos formatos `.webp` (altamente comprimido) ou `.svg` (vetorial). Evite `.png` pesados de alta resolução.
- **Alt Text Obrigatório**: Toda imagem enviada pela Organic Bridge deve possuir um texto de descrição alternativo (`alt`) estruturado para acessibilidade, caso contrário, a postagem é rejeitada no validador do blog.
