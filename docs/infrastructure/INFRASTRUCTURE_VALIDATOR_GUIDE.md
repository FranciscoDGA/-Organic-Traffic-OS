# Infrastructure Validator Guide

O **Infrastructure Validator** é o serviço responsável por auditar de forma autônoma todas as chaves de API, segredos, banco de dados, storage, RLS e endpoints dos blogs associados ao Organic Traffic OS.

---

## 1. Funcionamento

O validador é acionado de duas formas:
- **Sob Demanda (Dashboard)**: O painel em `/organic-os/infrastructure` dispara uma requisição POST que executa o diagnósticos de todas as chaves e retorna os scores recalculados.
- **API Externa**: Chamadas automatizadas do CI/CD podem requisitar `GET /api/infrastructure/health` para obter o status da infraestrutura antes de compilar deploys em produção.

---

## 2. Manifest do Validador

O arquivo [validator.manifest.json](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/infrastructure/validator/validator.manifest.json) define quais áreas do sistema são mapeadas e validadas a cada scan, organizadas entre provedores externos, banco e canais de deploy.
