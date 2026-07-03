# AI Providers Guide

Este manual descreve como obter as credenciais e configurar o funcionamento dos modelos de Inteligência Artificial no Organic Traffic OS.

---

## 1. Onde Obter Chaves de API

### A. OpenAI
1. Acesse o [OpenAI API Dashboard](https://platform.openai.com/).
2. Crie uma chave em **API Keys**.
3. Adicione fundos de saldo para ativar a chave de produção.
4. Defina limites de uso mensal para controle de custos em *Billing* > *Usage limits*.
5. Cole o valor em `OPENAI_API_KEY`.

### B. Google Gemini
1. Acesse o [Google AI Studio](https://aistudio.google.com/).
2. Clique em **Get API Key**.
3. Crie uma chave associada a um projeto do Google Cloud.
4. Cole o valor em `GEMINI_API_KEY` (ou `GOOGLE_API_KEY`).

### C. Anthropic (Claude)
1. Acesse a [Anthropic Console](https://console.anthropic.com/).
2. Crie uma chave em **API Keys**.
3. Cole o valor em `ANTHROPIC_API_KEY`.

---

## 2. Escolhendo o Provedor e Modelo Padrão

Defina as variáveis abaixo para controlar o comportamento do robô escritor:

```env
DEFAULT_AI_PROVIDER="gemini" # opções: openai, gemini, anthropic
DEFAULT_AI_MODEL="gemini-1.5-pro" # opções de modelo recomendadas por custo/benefício
```

### Modelos Sugeridos:
- **Gemini**: `gemini-1.5-pro` (nicho e artigos longos) ou `gemini-1.5-flash` (ideação rápida).
- **OpenAI**: `gpt-4o` (artigos longos de alta fidelidade) ou `gpt-4o-mini` (desenvolvimento local e testes rápidos).
- **Anthropic**: `claude-3-5-sonnet` (revisão editorial de alta precisão).
