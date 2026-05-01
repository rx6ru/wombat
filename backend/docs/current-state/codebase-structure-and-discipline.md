# Codebase Structure and Discipline

## Purpose

This guide explains the logic behind the current backend structure so future work follows the same style consistently.

## Core idea

The backend stays intentionally lightweight, but responsibilities are separated so the codebase scales without losing clarity.

The main principle is:

> keep HTTP wiring, business rules, persistence, and infrastructure setup in different layers

## Directory rules

### `src/app/`

Use for:

- app creation
- top-level route composition
- process boot and server startup
- global middleware order

Do not put domain business logic here.

### `src/api/v1/`

Use for:

- version-specific route grouping
- mounting domain routers under the v1 API surface

Do not put domain rules or Prisma access here.

### `src/modules/<domain>/`

Use for real feature ownership.

Each module should contain the domain logic for one bounded area.

Current domains:

- `user`
- `key`
- `profile`
- `encryption`

Recommended internal discipline:

- `*.controller.ts` → translate HTTP to service calls and shape responses
- `*.service.ts` → own orchestration, business rules, and cross-module coordination
- `*.repository.ts` → own Prisma/database access only
- `*.schemas.ts` → own validation contracts for that domain

### `src/middleware/`

Use for reusable Express middleware only.

Examples:

- auth
- error handling
- rate limiting
- request validation adapters
- logging wrappers

### `src/infrastructure/`

Use for external systems and low-level client setup.

Examples:

- env/config loading
- Prisma client setup
- Supabase client setup
- Redis client setup

Infrastructure code should not contain domain rules.

### `src/shared/`

Use for cross-domain helpers that are truly generic.

Examples:

- shared error classes
- generic async-handler helpers
- auth-id extraction helper
- generic utilities with no strong domain ownership

Do not turn `shared/` into a dumping ground for unclear code.

## How requests should flow

Recommended flow:

1. request enters app
2. top-level middleware runs
3. v1 route selects the domain controller
4. controller validates/translates HTTP concerns
5. service performs business logic and orchestration
6. repository performs data access
7. controller returns response
8. centralized error handler serializes uncaught errors

## What belongs where

### Controller should do

- read `req.params`, `req.query`, `req.body`
- extract authenticated identity from request context
- call service functions
- return HTTP status + JSON

### Controller should not do

- run Prisma queries directly
- contain encryption orchestration directly
- embed complex ownership/business logic
- contain infrastructure client setup

### Service should do

- business rules
- orchestration across repositories/modules
- ownership checks
- profile bootstrap flow
- encryption flow coordination

### Service should not do

- know Express request/response objects
- build global infrastructure clients
- become a second controller layer with HTTP-only concerns

### Repository should do

- Prisma queries only
- select/include/order/pagination definitions
- persistence-specific data access details

### Repository should not do

- know about HTTP
- decide endpoint behavior
- hide business rules that belong at service level

## How to add a new module

When adding a new domain such as `proxy`, `usage`, or `limits`:

1. create `src/modules/<domain>/`
2. add controller/service/repository/schema files only if needed
3. keep the controller thin
4. keep orchestration in the service
5. keep Prisma access in the repository
6. mount the router through `src/api/v1/`
7. only put code into `shared/` if multiple domains truly need it

## Anti-patterns to avoid

Avoid these patterns in this codebase:

- controllers that query Prisma directly
- services that depend on Express request/response
- repositories that implement business policy
- generic utility folders that hide domain logic
- putting unrelated helpers into `shared/` just to avoid choosing a domain owner
- creating duplicate folder systems for old and new structures at the same time

## Why this structure is useful for Wombat

This structure is meant to support future growth without needing another rewrite when new domains arrive.

It is especially useful because future Wombat work will likely add domains such as:

- proxy request handling
- limits and quota enforcement
- usage accounting
- provider adapters
- SDK support layers
- audit and analytics

A domain-centered structure makes that growth easier while keeping the codebase readable.
