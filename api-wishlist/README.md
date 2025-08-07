# API Wishlist - Microserviço de Lista de Desejos

Microserviço RESTful para gerenciamento de listas de desejos em e-commerce, desenvolvido com NestJS, MongoDB e arquitetura limpa.

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Docker** - Para containerização da aplicação
- **Node.js** Com NPM, PNPM ou Yarn
- **Rede Docker compartilhada** - Para comunicação entre serviços

## 🚀 Configuração Inicial

### 1. Criar a Rede Docker (OBRIGATÓRIO)

**⚠️ Execute este comando apenas uma vez:**

```bash
docker network create wishlist-net
```

> **Importante:** Se a rede não existir, o container da API não conseguirá se comunicar com outros serviços pelo nome.

### 2. Instalação das Dependências (local - desaconselhável)

```bash
pnpm install
```
Gerenciador escolhido pelo alto desempenho

## 🏃‍♂️ Executando o Projeto

### Modo Desenvolvimento com Docker (Recomendado)

```bash
npm run start:api:docker:dev
```

Este comando irá:

- Construir a imagem Docker se necessário
- Iniciar o container na rede `wishlist-net`
- Iniciar MongoDB e MongoDB Express
- Expor a aplicação na porta `3000`
- Habilitar hot-reload para desenvolvimento

### Modo Desenvolvimento Local

```bash
# Com hot-reload
npm run start:dev

# Com debug
npm run start:debug

# Modo produção
npm run start:prod
```

## 🔗 Endpoints Disponíveis

Após iniciar a aplicação, ela estará disponível em:

- **API REST**: `http://localhost:3000/v1`
- **Swagger (Documentação)**: `http://localhost:3000/api-docs-v1`
- **MongoDB Express**: `http://localhost:8081/db/mydb/`
- **Health Check**: `http://localhost:3000/v1/health-check`

### Autenticação

Todas as rotas (exceto login e health check) requerem autenticação JWT:

```bash
Authorization: Bearer <jwt_token>
```

### Exemplos de Uso

#### Login
```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'
```

## 🐳 Docker

### Estrutura do Docker

- **Dockerfile**: Imagem de produção otimizada
- **Dockerfile.dev**: Imagem para desenvolvimento com hot-reload
- **docker-compose.yml**: Orquestração completa (API + MongoDB + MongoDB Express)

### Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env`:

```env
# MongoDB
MONGODB_URI=mongodb://mongodb:27017/wishlist

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Application
MONGO_URI=mongodb://mymongoadmin:mymongopassword@mongodb:27017/mydb?authSource=admin


## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com watch mode
npm run test:watch

# Testes com coverage
npm run test:cov

# Testes de integração
npm run test:e2e

# Linting
npm run lint
```

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture**:

```text
src/
├── application/              # Casos de uso e lógica de negócio
│   ├── mocks/               # Dados mockados para testes
│   ├── ports/               # Interfaces (contratos)
│   └── usecases/            # Casos de uso
│       └── wishlist/        # Use cases de wishlist
├── domain/                  # Entidades de domínio
│   └── entities/            # Modelos de dados puros
│       ├── repositories/    # Contratos de repositório
│       └── __tests__/       # Testes das entidades
├── infrastructure/          # Implementações concretas
│   ├── database/            # Implementação MongoDB
│   ├── messaging/           # RabbitMQ (publisher)
│   └── swagger/             # Configuração Swagger
├── modules/                 # Módulos do NestJS
│   └── health-check/        # Health check endpoint
├── presentation/            # Camada de apresentação
│   ├── controllers/         # Controllers REST
│   ├── dto/                 # Data Transfer Objects
│   └── mappers/             # Mapeadores de dados
├── services/                # Orquestração de use cases
├── shared/                  # Código compartilhado
│   ├── constants/           # Constantes da aplicação
│   ├── exceptions/          # Exceções customizadas
│   ├── mongodb/             # Schemas MongoDB
│   └── utils/               # Utilitários
└── main.ts                  # Ponto de entrada da aplicação
```

### Princípios Aplicados

- **Inversão de Dependência**: Use cases dependem de abstrações
- **Responsabilidade Única**: Cada classe tem uma responsabilidade específica
- **Separação de Responsabilidades**: Camadas bem definidas
- **Testabilidade**: Código facilmente testável com mocks

## 🔧 Tecnologias Utilizadas

- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Linguagem de programação tipada
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação stateless
- **Swagger** - Documentação da API
- **Docker** - Containerização
- **Jest** - Framework de testes
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Husky** - Git hooks (quando GIT na raiz)
- **CommitLint** - Padronização de commits (quando GIT na raiz)

### 🔄 Regras de Negócio

1. **Limite de Itens**: Cada wishlist pode ter no máximo 20 produtos
2. **Produtos Únicos**: Não é possível adicionar o mesmo produto duas vezes

## 📈 Próximos Passos

- [ ] Implementar lazy loading para consultas pesadas
- [ ] Adicionar headers de segurança (nosniff, etc.)
- [ ] Implementar paginação nas listagens
- [ ] Adicionar filtros avançados e busca
- [ ] Implementar cache com Redis
- [ ] Adicionar métricas e observabilidade (Prometheus/Grafana)
- [ ] Implementar rate limiting por usuário/IP
- [ ] Implementar soft delete para auditoria
- [ ] Adicionar logs estruturados
- [ ] Implementar testes de carga
- [ ] Adicionar versionamento da API

## 🤝 Integração com BFF

Esta API foi projetada para trabalhar em conjunto com o BFF Wishlist:

- **API (Port 3000)**: Lógica de negócio e persistência
- **BFF (Port 4000)**: Interface GraphQL para o frontend
- **Comunicação**: HTTP REST entre BFF e API
- **Rede**: Ambos compartilham a rede Docker `wishlist-net`
