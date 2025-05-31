# 🧩 NestJS GraphQL API - Clean Architecture

This project is a modular GraphQL API built with [NestJS](https://nestjs.com/) and PostgreSQL, following Clean Architecture principles. It separates domain logic from infrastructure, promotes testability, and uses TypeORM as the ORM layer.

> ✅ Built with a Clean Architecture structure, decoupling core logic from frameworks and persistence concerns.

---

## ⚙️ Tech Stack

- **NestJS** — Scalable Node.js framework
- **GraphQL** — API query language
- **PostgreSQL** — Relational database
- **TypeORM** — ORM for database abstraction
- **Docker** — Containerization for local development
- **Jest** — Unit testing framework
- **Pino Logger** — Structured logging
- **TypeScript** — Static typing
- **Clean Architecture** — Layered architecture for maintainability

---

## 🧱 Architecture Overview

This project uses a Clean Architecture approach:

```
src/
├── domain/ # Core business logic
├── application/ # Use cases and ports
│ ├── ports/in # Input interfaces
│ └── ports/out # Output interfaces
├── infrastructure/ # Framework and implementation details
├── common/ # Shared logic: errors, logger, filters
├── config/ # App and database config
└── main.ts # Entry point
```


---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/project-name.git
cd project-name
```

### 2. Create environment variables
Create a .env file or use defaults set in env.schema.ts.
```
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=db-name
DB_HOST=db-link-friend //# Do not change this value

DB_PORT=5432
DB_USER=user
DB_PASS=password
DB_NAME=db-name

REDIS_PORT=6379
LOG_LEVEL=debug
```
### 3. Install dependencies
```
npm install
```
### 4. Run with Docker
```
docker-compose up
```

## 🧪 Running Tests
```
# Run unit tests
npm run test

# Run coverage
npm run test:cov
```

## 🔍 GraphQL Playground
Once the app is running, access the GraphQL Playground at:
```http://localhost:3000/graphql```
You can explore available queries, mutations, and types here.

## 🧪 Use Cases Implemented
### Users Module
  - Create users
  - Update users
  - Paginate and filter users
  - Link users as friends

## 📜 GraphQL Operations

Here are some example GraphQL queries and mutations you can use to test the API via [Playground](http://localhost:3000/graphql):

### 🔹 Create a User
```graphql
mutation {
  createUser(input: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    gender: "MALE",
    imageUrl: "https://example.com/avatar.jpg"
  }) {
    id
    firstName
    lastName
    email
    gender
    createdAt
  }
}
```

### 🔹 Update a User
```graphql
mutation {
  updateUser(input: {
    id: 1,
    data: {
      firstName: "Jhon",
      lastName: "Smith",
    }
  }) {
    id
    email
    firstName
    lastName
    gender
    imageUrl
    createdAt
  }
}
```

### 🔹 Link User as Friend
```graphql
mutation {
  linkUserFriend(input: { userId: 1, friendId: 2 }) {
    id
    user {
      id
      firstName
    }
    friend {
      id
      firstName
    }
  }
}
```

### 🔹 Find All Users (Paginated)
```graphql
query {
  findAllUsers(input: { page: 1, pageSize: 10, cursor: 0 }) {
    data { 
      id,
      firstName, 
      lastName, 
      email, 
      gender, 
      imageUrl,
      createdAt
    }
    currentPage,
    pageSize,
    hasNextPage,
    hasPreviousPage
  }
}
```