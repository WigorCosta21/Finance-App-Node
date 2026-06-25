# Finance App — Backend

API REST para gerenciamento financeiro pessoal. Permite cadastrar transações (receitas e despesas), filtrar por período, visualizar balanço com percentuais e gerenciar a conta do usuário com autenticação segura.

## Deploy

A API está disponível em produção com documentação interativa:

🔗 **Swagger:** [https://finance-app-node.onrender.com/api-docs](https://finance-app-node.onrender.com/docs)

> O plano gratuito do Render entra em hibernação após inatividade. A primeira requisição pode levar ~30s para responder.

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **ORM:** Prisma
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT com refresh token + bcrypt
- **Validação:** Zod
- **Documentação:** Swagger UI
- **Testes:** Jest + Supertest (unitários e e2e)
- **CI/CD:** GitHub Actions
- **Containerização:** Docker Compose
- **Linting:** ESLint + Prettier

## Funcionalidades

- Cadastro e autenticação de usuários (signup, login, refresh token)
- CRUD completo de transações financeiras
- Filtragem de transações por intervalo de datas
- Balanço financeiro com cálculo de percentuais (receitas vs despesas)
- Rotas protegidas com middleware de autenticação
- Validação de ownership em operações de exclusão
- Prefixo `/me` para rotas do usuário autenticado
- Documentação interativa via Swagger

## Arquitetura

O projeto segue princípios de **clean architecture**, separando responsabilidades em camadas:

```
src/
├── controllers/     # Camada de apresentação (req/res)
├── use-cases/       # Regras de negócio
├── repositories/    # Acesso a dados (Prisma)
├── routes/          # Definição de rotas Express
├── middlewares/     # Auth, validação, error handling
├── schemas/         # Schemas de validação (Zod)
└── server.ts        # Entry point
```

## Como rodar

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose (para o banco)

### Setup

```bash
# Clone o repositório
git clone https://github.com/WigorCosta21/Finance-App-Node.git
cd Finance-App-Node

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env-example .env
# Edite o .env com suas credenciais

# Suba o banco de dados
docker compose up -d

# Execute as migrations
npx prisma migrate dev

# Inicie o servidor em modo desenvolvimento
npm run dev
```

O servidor roda em `http://localhost:3000` e a documentação Swagger fica disponível em `/api-docs`.

### Testes

```bash
# Rodar testes em modo watch
npm run test:dev

# Rodar testes (CI)
npm run test:ci

# Rodar testes com cobertura
npm run test:coverage
```

## Variáveis de ambiente

Consulte o arquivo `.env-example` para ver todas as variáveis necessárias (conexão com banco, secret do JWT, etc).

## Endpoints principais

| Método   | Rota                       | Descrição           |
| -------- | -------------------------- | ------------------- |
| `POST`   | `/api/users`               | Criar conta         |
| `POST`   | `/api/login`               | Autenticar          |
| `POST`   | `/api/refresh-token`       | Renovar token       |
| `GET`    | `/api/me/transactions`     | Listar transações   |
| `POST`   | `/api/me/transactions`     | Criar transação     |
| `PUT`    | `/api/me/transactions/:id` | Atualizar transação |
| `DELETE` | `/api/me/transactions/:id` | Excluir transação   |
| `GET`    | `/api/me/balance`          | Consultar balanço   |

> A documentação completa com schemas de request/response está disponível no Swagger (`/api-docs`).

## Scripts disponíveis

| Script                  | Descrição                                     |
| ----------------------- | --------------------------------------------- |
| `npm run dev`           | Servidor em modo desenvolvimento (hot reload) |
| `npm start`             | Servidor em modo produção                     |
| `npm run lint`          | Verificar linting                             |
| `npm run lint:fix`      | Corrigir linting automaticamente              |
| `npm run format:write`  | Formatar código com Prettier                  |
| `npm run test:dev`      | Testes em modo watch                          |
| `npm run test:ci`       | Testes para CI                                |
| `npm run test:coverage` | Testes com relatório de cobertura             |
