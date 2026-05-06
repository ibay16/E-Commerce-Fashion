# Layered Backend Refactoring Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor `commerce-service` and `admin-service` to a Layered Architecture (Controllers, Services, Repositories) following the provided references.
**Architecture:** Layered pattern: `src/controllers`, `src/services`, `src/routes`, `src/db`. Removing `src/modules`.
**Tech Stack:** Node.js, Express, TypeScript, Prisma

---

### Task 1: Layered Restructuring for Commerce Service

**Files:**
- Create Directories: `src/controllers`, `src/services`, `src/routes`, `src/db`, `src/dtos`, `src/middleware`, `src/utils`
- Move: `src/modules/*/controller.ts` to `src/controllers/`
- Delete: `src/modules` (after migration)

- [ ] **Step 1: Create directory structure**
Execute: `mkdir -p services/commerce-service/src/{controllers,services,routes,db,dtos,middleware,utils}`

- [ ] **Step 2: Move logic to Layered folders**
Move existing controllers from `src/modules/product/product.controller.ts` etc. to `src/controllers/product.controller.ts`.
Create a `src/services/` layer if any logic can be extracted from controllers.

- [ ] **Step 3: Define Layered Routes**
Create `src/routes/product.routes.ts`, `category.routes.ts`, etc., and wire them to the new controller locations.

- [ ] **Step 4: Centralize DB**
Move Prisma logic to `src/db/client.ts`.

### Task 2: Layered Restructuring for Admin Service

**Files:**
- Create Directories: `src/controllers`, `src/services`, `src/routes`, `src/db`, `src/dtos`, `src/middleware`, `src/utils`

- [ ] **Step 1: Create directory structure**
Execute: `mkdir -p services/admin-service/src/{controllers,services,routes,db,dtos,middleware,utils}`

- [ ] **Step 2: Move logic to Layered folders**
Move `src/modules/auth/auth.controller.ts` to `src/controllers/auth.controller.ts`, etc.

- [ ] **Step 3: Define Layered Routes**
Create `src/routes/auth.routes.ts`, `order.routes.ts`, and `shipping.routes.ts`. Wire them correctly.

### Task 4: Update Documentation and Cleanup

**Files:**
- Modify: `services/api-gateway/AGENTS.md`
- Modify: `apps/storefront-web/AGENTS.md`
- Modify: `apps/admin-web/AGENTS.md`

- [ ] **Step 1: Update Source of Truth**
Update all `AGENTS.md` files to describe the new Layered Architecture for backend services instead of the Module pattern.

- [ ] **Step 2: Remove old module folders**
Delete all `src/modules` directories in both services.