# Email Server (Resend & SMTP) Setup Guide

Este manual orienta o setup de envio de e-mails do sistema.

---

## 1. Configurando o Resend (Recomendado)

1. Crie uma conta no [Resend](https://resend.com).
2. Vá em **Domains** e adicione o domínio do seu site.
3. Configure os registros DNS (**SPF**, **DKIM**, **DMARC**) apontando para o seu registrador de domínios (Cloudflare, GoDaddy, etc.).
4. Gere uma chave em **API Keys** e configure:
   ```env
   RESEND_API_KEY="sua_chave_do_resend"
   SMTP_FROM="noreply@seu-dominio-verificado.com"
   ```

---

## 2. SMTP Fallback (Opcional)

Se preferir usar seu servidor próprio SMTP, defina as variáveis:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` e `SMTP_FROM`.
