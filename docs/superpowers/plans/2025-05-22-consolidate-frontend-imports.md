# Consolidate Frontend Imports Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all literal occurrences of `@/frontend/` with `@/` in the `storefront-web` application to reflect the directory consolidation where `src/frontend/` was moved to `src/`.

**Architecture:** This is a batch text replacement across the TypeScript/React codebase. We will also update the `tsconfig.json` to remove the redundant path mapping.

**Tech Stack:** TypeScript, Next.js

---

### Task 1: Batch Find and Replace imports in src

**Files:**
- Modify: All files in `apps/storefront-web/src` containing `@/frontend/`

- [ ] **Step 1: Replace `@/frontend/` with `@/` in `src/app/about/page.tsx`**
- [ ] **Step 2: Replace `@/frontend/` with `@/` in `src/app/catalogue/cart/page.tsx`**
- [ ] **Step 3: Replace `@/frontend/` with `@/` in `src/app/catalogue/cart/pembayaran/page.tsx`**
- [ ] **Step 4: Replace `@/frontend/` with `@/` in `src/app/catalogue/page.tsx`**
- [ ] **Step 5: Replace `@/frontend/` with `@/` in `src/components/atoms/ProductCard.tsx`**
- [ ] **Step 6: Replace `@/frontend/` with `@/` in `src/components/features/ClothingCarousel.tsx`**
- [ ] **Step 7: Replace `@/frontend/` with `@/` in `src/components/features/CursorTrail.tsx`**
- [ ] **Step 8: Replace `@/frontend/` with `@/` in `src/components/features/InfiniteMarquee.tsx`**
- [ ] **Step 9: Replace `@/frontend/` with `@/` in `src/components/sections/DiscoverSection.tsx`**
- [ ] **Step 10: Replace `@/frontend/` with `@/` in `src/components/sections/EssentializedSection.tsx`**
- [ ] **Step 11: Replace `@/frontend/` with `@/` in `src/features/catalog/CatalogueClient.tsx`**
- [ ] **Step 12: Replace `@/frontend/` with `@/` in `src/lib/actions/catalogue.ts`**

### Task 2: Clean up relative imports pointing to frontend

**Files:**
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/register/page.tsx`

- [ ] **Step 1: Fix relative import in `src/app/login/page.tsx`** (Change `../../frontend/components/...` to `../../components/...`)
- [ ] **Step 2: Fix relative import in `src/app/register/page.tsx`** (Change `../../frontend/components/...` to `../../components/...`)

### Task 3: Update tsconfig.json

**Files:**
- Modify: `apps/storefront-web/tsconfig.json`

- [ ] **Step 1: Remove `./src/frontend/*` from paths mapping**

### Task 4: Verification

- [ ] **Step 1: Run type check**
- [ ] **Step 2: Run build to ensure no broken imports**
