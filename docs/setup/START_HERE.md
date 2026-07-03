# Start Here — Guia de Configuração e Implantação

Bem-vindo ao guia oficial de implantação do **Organic Traffic OS**! Este documento orienta você na ordem correta de configuração do sistema para garantir uma implantação tranquila e sem incidentes.

---

## 1. Ordem Correta de Configuração

Recomendamos seguir esta ordem estritamente para evitar dependências ausentes:

1. **GitHub**: Conecte o repositório e configure os tokens necessários.
2. **Supabase (Banco e Storage)**: Provisione o banco Postgres, crie as tabelas (via SQL Editor) e os buckets de storage.
3. **Provedores de IA**: Crie suas contas de API (OpenAI/Gemini) e configure os limites iniciais de faturamento.
4. **Google Cloud e OAuth**: Crie o projeto do Google Cloud, libere as APIs e defina o Client ID e Secret.
5. **E-mail (Resend ou SMTP)**: Configure o domínio de remetente e chaves de envio.
6. **Vercel**: Crie o projeto central, conecte o GitHub e configure todas as Environment Variables agrupadas.
7. **Organic Bridge**: Configure as variáveis e chaves correspondentes nos blogs externos.

---

## 2. Riscos Comuns a Evitar

- **Service Role Key Vazada**: Nunca comite ou envie a Service Role Key do Supabase em chats ou código público.
- **Formato do Redirect URI**: O callback do OAuth do Google deve corresponder exatamente à URL cadastrada, incluindo a barra final se houver.
- **Modo Automático**: Inicie sempre no modo **Manual** (`auto_publish = false` e `require_approval = true`) para auditar as primeiras postagens.
