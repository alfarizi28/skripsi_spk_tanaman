# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**SPK Tanaman** — frontend for a *Sistem Pendukung Keputusan* (Decision Support System) for crop/plant selection. UI copy is in Indonesian. This is the frontend only; it is expected to talk to a separate backend API.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the whole project

There is no test runner configured yet.

## Stack

- **React 19** + **Vite 8** (JavaScript, not TypeScript — files are `.jsx`)
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin (configured in `vite.config.js`). There is **no `tailwind.config.js`** — Tailwind v4 is configured in CSS. `src/index.css` is just `@import "tailwindcss";`; add theme/customization there with `@theme`, not a JS config file.
- ESLint flat config in `eslint.config.js` (includes `react-hooks` and `react-refresh` rules). Note: it flags unused variables but ignores ones matching `^[A-Z_]` (intended for constants).

## Entry points

- `index.html` → `src/main.jsx` (mounts `<App />` in StrictMode) → `src/App.jsx`
- Global styles / Tailwind import live in `src/index.css`.

## UI architecture

The app is an MFEP (Multifactor Evaluation Process) decision-support dashboard, ported from a standalone HTML mockup. Navigation is **state-based, not react-router**: `App.jsx` holds `authed` + `page` and renders one component from the `PAGES` map; the sidebar/topbar call `setPage`. `src/nav.js` is the single source of truth for menu items and breadcrumb labels.

- `src/store/SpkContext.jsx` — central state via Context, **wired to the backend API**. Holds entity lists (`kriteria`, `subkriteria`, `alternatif`, `rawinput`, `evaluasi`, `nilaiAkhir`) of the raw server shapes (Mongo `_id`, populated relations — see `docs/api.md`), plus `user`, `loading`, and `toast`. On mount it `loadAll()`s every list in parallel. Every CRUD action goes through the `mutate(fn, reloads, msg)` helper: call service → reload affected lists → toast (error toast on throw). The backend does the MFEP math — `proses()` chains `normalize → evaluasi-faktor/hitung → nilai-akhir/hitung`; there is no client-side calc. "Penilaian" maps to RawInput (`saveRawInputBatch` upserts one row per kriteria for an alternatif).
- `src/pages/*` one per menu item (read store, call actions, show `Loading` while `loading`); `src/components/*` shared (`Modal`, `Toast`, `Sidebar`, `Topbar`, `LoginPage`, `Footer`, `Loading`).
- Auth: `LoginPage` calls `authService.login` (username/password) which stores the JWT; `App` gates on `getToken()` and logs out via `authService.logout`.
- Theme colors (`primary`, `accent`, `danger`, `info`) and reusable component classes (`.card`, `.btn*`, `.icon-btn*`, `.form-control`, `.data-table`, `.formula-box`) are defined in `src/index.css` via `@theme` / `@layer components` — prefer these over re-deriving long utility chains.

Gotcha: the `react-hooks/set-state-in-effect` lint rule forbids calling `setState` synchronously in an effect body (only inside callbacks like `setTimeout`). See `Toast.jsx` for the derive-don't-set pattern.

## Backend & API layer

The frontend talks to a separate REST backend (Node, `localhost:3000` in dev). `VITE_API_URL` in `.env` sets the base URL.

- `src/lib/api.js` — single `fetch` wrapper. Auto-injects `Authorization: Bearer <token>` from `localStorage` (`token` key), JSON-encodes bodies, throws `ApiError` on non-2xx. Use `api.get/post/put/del`; pass `{ auth: false }` for public routes.
- `src/services/*.js` — one module per domain (`auth`, `user`, `kriteria`, `subkriteria`, `alternatif`, `rawInput`, `evaluasiFaktor`, `nilaiAkhir`), re-exported from `src/services/index.js`.
- **API contract is documented in `docs/api.md`** — routes there were verified against the running server, and supersede the original `tanaman.postman_collection.json` (which has several wrong/empty URLs).

Backend quirks to remember: **update and delete use `POST`** (not PUT/DELETE); `login` returns the JWT at `res.data.token`.
