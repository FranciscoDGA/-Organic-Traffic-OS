# Email Providers Guide (Resend & SMTP)

Este guia apresenta o procedimento de configuração de e-mail para envio automático de newsletters, relatórios executivos e alertas de infraestrutura.

---

## 1. Configurando o Resend (Recomendado)

O Resend é o provedor nativo e recomendado pela velocidade e taxa de entrega.

### Passo a Passo:
1. Acesse o painel do [Resend](https://resend.com).
2. Adicione o seu domínio em **Domains** e configure os registros DNS necessários (**SPF**, **DKIM**, **DMARC**) fornecidos pela plataforma para evitar que os e-mails caiam na caixa de spam dos assinantes.
3. Crie uma chave em **API Keys**.
4. Configure a variável:
   ```env
   RESEND_API_KEY="sua_chave_do_resend"
   SMTP_FROM="noreply@seu-dominio-verificado.com"
   ```

---

## 2. Configurando o SMTP Fallback (Opcional)

Se você preferir usar seu próprio servidor de e-mail ou outro SMTP:
1. Preencha as credenciais correspondentes:
   ```env
   SMTP_HOST="smtp.seuprovedor.com"
   SMTP_PORT="587"
   SMTP_USER="seu-usuario-email"
   SMTP_PASSWORD="sua-senha-segura"
   SMTP_FROM="contato@seu-dominio.com"
   ```
2. Mapeie o status do SMTP como `active` no arquivo de registro para habilitá-lo.
