# Google Setup Guide (GSC, GA4 & OAuth)

Este documento descreve como conectar o Google Search Console, Google Analytics 4 e o fluxo de autenticação do Google OAuth 2.0 no Organic Traffic OS.

---

## 1. Passo a Passo no Google Cloud Console

1. Vá em [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um projeto chamado `Organic Traffic OS`.
3. Acesse **APIs & Services** > **OAuth consent screen**:
   - Defina o consentimento como **External**.
   - Insira os e-mails e as informações de contato do seu projeto.
   - Adicione os escopos necessários:
     - `https://www.googleapis.com/auth/webmasters.readonly` (Search Console)
     - `https://www.googleapis.com/auth/analytics.readonly` (Analytics 4)
4. Acesse **APIs & Services** > **Credentials**:
   - Clique em **Create Credentials** > **OAuth client ID**.
   - Tipo de aplicativo: **Web application**.
   - Em **Authorized redirect URIs**, adicione:
     - Para dev local: `http://localhost:3000/api/organic-os/connectors/google-search-console/callback`
     - Para produção: `https://seu-app-central.vercel.app/api/organic-os/connectors/google-search-console/callback`
5. Salve e copie o **Client ID** e o **Client Secret**.

---

## 2. Copiando as Chaves para a Vercel

Preencha as seguintes chaves no painel da Vercel:

```env
GOOGLE_CLIENT_ID="seu_client_id_do_google"
GOOGLE_CLIENT_SECRET="seu_client_secret_do_google"
GOOGLE_REDIRECT_URI="https://seu-app-central.vercel.app/api/organic-os/connectors/google-search-console/callback"
```

---

## 3. Identificadores de Propriedade

- **Google Analytics 4**: 
  - Acesse o painel do Google Analytics Admin.
  - Na propriedade do seu blog, copie o **Property ID** (um número de 9 dígitos) e adicione em `GOOGLE_ANALYTICS_PROPERTY_ID`.
- **Search Console**:
  - Copie o domínio completo cadastrado e verificado no Search Console (ex: `https://passacumaru.com.br`) e adicione em `GOOGLE_SEARCH_CONSOLE_SITE_URL`.
