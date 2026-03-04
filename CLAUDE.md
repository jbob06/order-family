# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

OrderFamily is a React/Next.js web app for managing telecom customer orders grouped into "order families."

## Commands

- `npm run dev` — dev server at http://localhost:3000 (Turbopack)
- `npm run build` — production build
- `npm run lint` — ESLint

## Stack

- Next.js 16.1.6 (App Router), React 19, TypeScript 5
- Tailwind CSS v4 (`@import "tailwindcss"` in globals.css, `@tailwindcss/postcss` in postcss config — no tailwind.config.js)
- @dnd-kit/core for drag-and-drop (order rows → family drop zones)
- Zustand 5 for all client state (no backend)

## Architecture

Two top-level views (tab nav in page.tsx):

**Orders view** — three-column layout with DndContext wrapper:
- `CustomerSidebar` (w-64): lists current user's tracked customers; right-click to remove, + button to track new
- `OrdersPanel` (flex-1): sortable/reorderable table + card view; bulk select; assign to family dropdown
- `FamiliesPanel` (w-80): family cards as @dnd-kit drop targets; unassigned drop zone

**Communications view** — `CommsView`:
- Left panel: three-level tree (customer → family → orders); blue dot = unread inbound; right-click → mark read/unread; unassigned orders are draggable into families via HTML5 drag
- Right panel: breadcrumb header, family order summary (when family selected), email thread, compose + Generate AI Update

## Key files

- `src/types/index.ts` — all types: `Order` (has `dueDate`), `OrderFamily`, `Customer`, `Communication`, `AppUser`, `FAMILY_COLORS`
- `src/store/useStore.ts` — Zustand store: orders, families, communications, multi-user state (`users`, `currentUserId`), `readThreadKeys` for unread tracking
- `src/data/placeholder.ts` — 7 customers, 42 orders (with dueDates), 5 families, 31 comms, 3 users (Sarah/Michael/David)
- `src/components/CommsView.tsx` — full comms view; AI generates contextual replies based on inbound message keywords
- `src/components/OrdersPanel.tsx` — columns defined in `ALL_COLUMNS`; native HTML5 drag for column reorder; `onMouseUp` for sort (not onClick)

## Patterns

- `FAMILY_COLORS` array in types/index.ts drives all color rendering (bg, border, badge, dot)
- Column reorder uses native HTML5 drag (`draggable`, `onDragStart/Over/Drop`) on `<th>` — avoids nested DndContext inside table
- `onMouseUp` on `<th>` for sort — `onClick` is suppressed after a drag
- Read tracking key format: `"customer:id"` | `"family:id"` | `"order:id"`
- Switching comms context (`setCtx`) clears draft subject/body and marks thread read
- User switcher in top nav; CustomerSidebar filters to current user's `customerIds`
