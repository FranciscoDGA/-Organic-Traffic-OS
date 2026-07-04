# BACKUP GUIDE — Organic Traffic OS v1.0

## O que precisa de backup

| Item | Frequência | Método |
|---|---|---|
| Banco de dados Supabase | Semanal | Dashboard Supabase → Backups |
| Variáveis de ambiente (.env.local) | A cada alteração | Cofre de senhas seguro |
| Código-fonte | A cada deploy | Git (GitHub/GitLab) |
| Manifests (`/manifests/`) | A cada versão | Commit no repositório |

## Backup do Supabase

1. Acessar dashboard.supabase.com
2. Selecionar projeto
3. Ir em **Settings → Database**
4. Clicar em **Download backup**
5. Armazenar arquivo `.sql.gz` em local seguro (ex: Google Drive criptografado)

## Backup das Variáveis de Ambiente

Nunca salvar `.env.local` no repositório Git.
Recomendado: usar **Vercel Environment Variables** como fonte primária e guardar cópia em gerenciador de senhas (1Password, Bitwarden, etc.).

## Recuperação de Desastre

Em caso de perda total do banco de dados:
1. Criar novo projeto Supabase
2. Restaurar backup `.sql.gz` via psql
3. Atualizar variáveis de ambiente na Vercel com novas URLs
4. Fazer novo deploy

## Frequência Recomendada de Revisão

- **Diário**: Checar alertas de sistema no Morning Briefing
- **Semanal**: Verificar se backup do Supabase foi gerado
- **Mensal**: Testar restore de backup em ambiente de staging
