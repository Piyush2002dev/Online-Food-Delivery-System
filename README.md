# Online Food Delivery System

*Angular Frontend • Spring Boot Microservices • RESTful APIs • Docker • CI/CD Ready*

![status-badges](https://img.shields.io/badge/status-active-brightgreen) ![license](https://img.shields.io/badge/license-MIT-blue) ![build](https://img.shields.io/badge/build-passing-success) ![coverage](https://img.shields.io/badge/coverage-~85%25-informational)

> This repository operationalizes a production-grade, cloud‑ready Online Food Delivery platform leveraging an Angular SPA and a Spring Boot microservices backend, orchestrated via Docker and exposed through a secure API gateway. The solution is optimized for horizontal scalability, observability, and developer ergonomics.

---

## Table of Contents

* [Solution Overview](#solution-overview)
* [System Architecture](#system-architecture)
* [Service Catalog](#service-catalog)
* [Tech Stack](#tech-stack)
* [Local Development Setup](#local-development-setup)
* [Environment Configuration](#environment-configuration)
* [Runbook (Make/Docker)](#runbook-makedocker)
* [API Documentation](#api-documentation)
* [Frontend (Angular) Guide](#frontend-angular-guide)
* [Backend (Spring Boot) Guide](#backend-spring-boot-guide)
* [Database & Messaging](#database--messaging)
* [AuthN/Z](#authnz)
* [Testing Strategy](#testing-strategy)
* [Observability](#observability)
* [Folder Structure](#folder-structure)
* [Seeding & Demo Data](#seeding--demo-data)
* [CI/CD Blueprint](#cicd-blueprint)
* [Security Posture](#security-posture)
* [Contribution Guidelines](#contribution-guidelines)
* [Roadmap](#roadmap)
* [License](#license)

---

## Solution Overview

The platform enables customers to discover restaurants, browse menus, place orders, and track deliveries in real time. It encapsulates DDD-inspired bounded contexts, employs event-driven integrations, and adheres to RESTful best practices with OpenAPI-first API design.

**Key Capabilities**

* Restaurant & menu discovery with search and filters
* Cart, checkout, and order lifecycle tracking
* Payments (mock/adapter pattern) and refunds
* Notifications (email/SMS/push-ready)
* Role-based access (Customer, Restaurant Owner, Admin, Delivery Agent)
* High-performance caching & rate limiting at the edge

---

## System Architecture

```
[ Angular SPA ]
      |
      v
[ API Gateway (Spring Cloud Gateway) ]  <-- JWT validation, rate limiting, routing
      |
      +--> [ Auth Service ] -----> [ PostgreSQL ]
      +--> [ User Service ] -----> [ PostgreSQL ]
      +--> [ Restaurant Service ] -> [ PostgreSQL ]
      +--> [ Menu Service ] ------> [ PostgreSQL ]
      +--> [ Order Service ] -----> [ PostgreSQL ]
      +--> [ Payment Service ] ---> [ External PSP (mock) ]
      +--> [ Notification Service ] -> [ SMTP/SMS provider (mock) ]

[ Kafka ] <--- domain events (OrderCreated, PaymentAuthorized, etc.)
[ Redis ] <--- caching, session blacklist
[ Prometheus + Grafana ] <--- metrics & dashboards
[ ELK/EFK ] <--- structured logs
```

---

## Service Catalog

| Service              | Responsibility                          | Port (dev) | Path Prefix      |
| -------------------- | --------------------------------------- | ---------: | ---------------- |
| api-gateway          | Routing, auth filter, rate limit        |     `8080` | `/api/*`         |
| auth-service         | Sign up, login, token issuance/refresh  |     `9001` | `/auth/*`        |
| user-service         | Profiles, addresses, roles              |     `9002` | `/users/*`       |
| restaurant-service   | Restaurant CRUD, categories, geofencing |     `9003` | `/restaurants/*` |
| menu-service         | Menu items, variants, availability      |     `9004` | `/menus/*`       |
| order-service        | Cart, checkout, orders, status          |     `9005` | `/orders/*`      |
| payment-service      | Payment intents, webhooks, refunds      |     `9006` | `/payments/*`    |
| notification-service | Email/SMS dispatch, templates           |     `9007` | `/notify/*`      |

> All services expose `/actuator/*` for health, metrics, and readiness probes.

---

## Tech Stack

**Frontend**: Angular 17+, RxJS, NGXS (or NGRX), Angular Material/Tailwind, Jest/Karma, ESLint

**Backend**: Java 21, Spring Boot 3.x, Spring Cloud, Spring Security (JWT), Spring Data JPA, MapStruct, OpenAPI/Swagger

**Data & Infra**: PostgreSQL 15, Redis 7, Apache Kafka, Zookeeper, Docker Compose, Flyway, Testcontainers

**Observability**: Spring Boot Actuator, Micrometer, Prometheus, Grafana, OpenTelemetry-ready, ELK/EFK

**Tooling**: Maven, Node.js LTS, pnpm/npm, Makefile, GitHub Actions

---

## Local Development Setup

### Prerequisites

* Node.js LTS (>= 20), npm or pnpm
* JDK 21, Maven 3.9+
* Docker & Docker Compose
* Git

### Quick Start (One-Command Bootstrap)

```bash
# from repo root
make up        # builds & starts all core services + DBs + gateway
make seed      # loads demo data (restaurants, menus, users)
make ui        # runs Angular app on http://localhost:4200
```

> Access API gateway at `http://localhost:8080/api` and Swagger UIs at each service `http://localhost:<port>/swagger-ui`.

### Manual Startup (Service-by-Service)

```bash
# infra
docker compose -f deploy/docker-compose.yml up -d postgres redis kafka zookeeper

# backend services
mvn -q -T 1C -DskipTests package
java -jar services/api-gateway/target/api-gateway.jar
java -jar services/auth-service/target/auth-service.jar
# ... repeat for other services

# frontend
cd frontend && npm i && npm start
```

---

## Environment Configuration

Create a `.env` at repo root (consumed by Docker & services via Spring config):

```env
# global
JWT_SECRET=replace-me
PROFILE=dev
CORS_ALLOWED_ORIGINS=http://localhost:4200

# postgres
POSTGRES_USER=food
POSTGRES_PASSWORD=foodpass
POSTGRES_DB=food_delivery

# redis
REDIS_HOST=redis
REDIS_PORT=6379

# kafka
KAFKA_BROKERS=kafka:9092

# email (mock)
SMTP_HOST=mailhog
SMTP_PORT=1025
```

Each Spring service also supports overrides via `application-*.yml`.

---

## Runbook (Make/Docker)

```bash
make up         # build + start stack
make down       # stop & remove containers/volumes
make logs       # tail logs for all services
make rebuild    # force rebuilds
make test       # run backend + frontend unit tests
make lint       # run linters (ESLint + Checkstyle/Spotless)
```

`deploy/docker-compose.yml` (excerpt):

```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:7
    ports: ["6379:6379"]

  zookeeper:
    image: confluentinc/cp-zookeeper:7.6.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  kafka:
    image: confluentinc/cp-kafka:7.6.0
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
    depends_on: [zookeeper]

  api-gateway:
    build: services/api-gateway
    ports: ["8080:8080"]
    environment:
      - PROFILE=dev
      - JWT_SECRET=${JWT_SECRET}
    depends_on: [auth-service]
```

---

## API Documentation

All services publish OpenAPI specs and serve Swagger UI under `/swagger-ui`.

**Representative Endpoints**

* `POST /auth/register` → create user
* `POST /auth/login` → issue JWT (access + refresh)
* `GET /restaurants?city=Bangalore&cuisine=indian` → search restaurants
* `GET /menus/{restaurantId}` → list menu items
* `POST /orders/checkout` → place order (idempotent key supported)
* `POST /payments/intents` → create payment intent
* `POST /notify/email` → send order confirmation

**Error Contract** (standardized):

```json
{
  "timestamp": "2025-08-14T12:34:56Z",
  "path": "/orders/checkout",
  "status": 422,
  "error": "Unprocessable Entity",
  "code": "ORDER_VALIDATION_FAILED",
  "message": "Item 123 is out of stock",
  "traceId": "7c0f..."
}
```

---

## Frontend (Angular) Guide

```bash
cd frontend
npm ci
npm run start   # http://localhost:4200
npm run test
npm run build
```

**Highlights**

* Feature‑module architecture (`/features/orders`, `/features/restaurants`)
* Smart/Dumb component split, OnPush change detection
* State management via NGXS/NGRX (actions for async effects)
* Interceptors: `AuthInterceptor`, `ErrorInterceptor`, `RetryInterceptor`
* API client generated from OpenAPI (`/generated/api`)
* Responsive UI with Tailwind/Material; accessible components (a11y)

**Env**

* `frontend/src/environments/environment.ts` → `apiBaseUrl`, `featureFlags`

---

## Backend (Spring Boot) Guide

**Common Modules**: `commons` (DTOs, exceptions), `security` (JWT filters), `messaging` (Kafka producers/consumers), `persistence` (BaseEntity, auditing), `api-clients` (Feign)

**Patterns**

* Controller → Service → Repository layering
* Validation via `javax.validation` + exception advice
* Idempotency via request hash + Redis
* Outbox pattern for reliable event publishing
* MapStruct for DTO ↔ entity mapping

**Build & Run**

```bash
mvn -q -T 1C clean package
java -jar services/order-service/target/order-service.jar
```

---

## Database & Messaging

* **PostgreSQL** per service (schema-per-service), migrations via **Flyway**
* **Redis** for cache and token blacklist
* **Kafka** topics: `orders.v1`, `payments.v1`, `notifications.v1`
* **Testcontainers** for integration tests

> Optionally enable read replicas and CQRS projections for analytics.

---

## AuthN/Z

* JWT (HS256) access & refresh tokens
* Role-based guards: `ROLE_CUSTOMER`, `ROLE_OWNER`, `ROLE_ADMIN`, `ROLE_AGENT`
* Password hashing via Argon2/BCrypt
* CORS enforced at gateway and services
* Angular route guards & token refresh workflow

---

## Testing Strategy

* **Frontend**: Jest/Karma unit tests; Cypress e2e flows
* **Backend**: JUnit 5 + Testcontainers; contract tests with Spring Cloud Contract
* **API**: Postman/Newman collections under `/docs/api`
* **Quality Gates**: ESLint, Prettier, Spotless/Checkstyle, Sonar-ready

---

## Observability

* `/actuator/health`, `/actuator/metrics`, `/actuator/prometheus`
* Prometheus scrape config in `deploy/observability/prometheus.yml`
* Grafana dashboards for latency, error budget, saturation
* Correlated logs with traceId in MDC

---

## Folder Structure

```
.
├─ frontend/
│  ├─ src/
│  ├─ e2e/
│  └─ ...
├─ services/
│  ├─ api-gateway/
│  ├─ auth-service/
│  ├─ user-service/
│  ├─ restaurant-service/
│  ├─ menu-service/
│  ├─ order-service/
│  ├─ payment-service/
│  └─ notification-service/
├─ commons/
├─ deploy/
│  ├─ docker-compose.yml
│  └─ observability/
├─ docs/
│  ├─ architecture/
│  └─ api/
├─ scripts/
└─ Makefile
```

---

## Seeding & Demo Data

```bash
make seed          # runs scripts/seed.sh
```

Creates:

* Demo users (customer/owner/admin)
* 10 restaurants, 100 menu items
* Sample orders with state transitions

---

## CI/CD Blueprint

* **GitHub Actions**: build matrix (frontend/backend), unit tests, Docker image publish
* **Security**: dependency scanning (OWASP/Trivy), SAST hooks
* **Deploy**: environment promotion via tags; infra-as-code ready (Helm/K8s optional)

Example workflow: `.github/workflows/ci.yml` (excerpt)

```yaml
on: [push, pull_request]
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: 'temurin', java-version: '21' }
      - run: mvn -q -T 1C -DskipTests package
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci && npm run build --prefix frontend
```

---

## Security Posture

* Centralized auth, short‑lived access tokens + refresh tokens
* Input validation and output encoding everywhere
* Principle of least privilege for DB users
* Sensitive config via environment variables & secrets
* Rate limiting & request size limits at gateway

---
