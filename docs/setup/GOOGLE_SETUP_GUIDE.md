# Google OAuth, Analytics & Search Console Guide

Este manual orienta a liberação das APIs e chaves de acesso do Google Cloud Platform.

---

## 1. Passo a Passo do Console do Google Cloud

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie ou selecione seu projeto.
3. Acesse **APIs & Services** > **Library** e ative as seguintes APIs:
   - Google Search Console API
   - Google Analytics Reporting API
4. Vá em **APIs & Services** > **Credentials**:
   - Clique em **Create Credentials** > **OAuth client ID**.
   - Tipo de aplicativo: **Web application**.
   - Adicione sua redirect URI de produção (ex: `https://app.organic-os.com/api/organic-os/connectors/google-search-console/callback`).
5. Copie o **Client ID** e o **Client Secret** gerados.
