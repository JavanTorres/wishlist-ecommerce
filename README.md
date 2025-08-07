# Wishlist E-commerce

Projeto de wishlist para e-commerce composto por API REST (NestJS) e BFF GraphQL (NestJS).

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Docker** - Para containerização da aplicação
- **Node.js** - Com NPM, PNPM ou Yarn
- **Rede Docker compartilhada** - Para comunicação entre serviços

## 🚀 Configuração Inicial

### 1. Criar a Rede Docker (OBRIGATÓRIO)

⚠️ **Execute este comando apenas uma vez:**

```bash
docker network create wishlist-net
```

**Importante:** Se a rede não existir, o container do BFF não conseguirá se comunicar com a API pelo nome do serviço.

Depois disso, ambos os projetos (BFF e API) poderão usar a mesma rede, bastando referenciar `wishlist-net` como `external: true` em seus docker-compose.

### 2. Executar a API

Navegue até a pasta da API:

```bash
cd api-wishlist
```

E execute:

```bash
npm run start:api:docker:dev
```

### 3. Executar o BFF

Em um novo terminal, navegue até a pasta do BFF:

```bash
cd bff-wishlist
```

E execute:

```bash
npm run start:bff:docker:dev
```

## 📚 Endpoints

- **API Swagger**: http://localhost:3000/api-docs-v1
- **BFF GraphQL**: http://localhost:4000/graphql
- **Mongo Express**: http://localhost:8081/db/mydb/

📖 **Tutorial GraphQL**: Veja o [Guia GraphQL](./bff-wishlist/GRAPHQL_GUIDE.md) para instruções detalhadas sobre como usar o BFF.

## 🔧 Arquitetura

- **API**: NestJS com Clean Architecture, MongoDB, JWT
- **BFF**: NestJS com GraphQL, comunicação HTTP com a API
- **Containerização**: Docker Compose com rede compartilhada

## ⚠️ Observações

- O **Husky** pode (E VAI) apresentar problemas de funcionamento em repositórios monorepo (dois projetos em um único git), pois espera a estrutura padrão do Git.
- Como os projetos usam arquivos `docker-compose.yml` separados, as redes criadas automaticamente por cada compose não são compartilhadas entre si. Por isso, é necessário criar manualmente a rede Docker compartilhada.