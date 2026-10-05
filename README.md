# Solar Permit Kanban

Offline-first Angular 17+ Kanban board tracking real NYC solar permits through the full installation lifecycle. Data sourced from NYC Open Data Solar Permits dataset via Socrata API.

## Tech Stack
- Angular 17+ with Vite
- TypeScript, NgRx SignalStore
- Dexie.js (IndexedDB) for offline persistence
- Apollo Client (GraphQL) with persisted queries
- Sentry for error monitoring
- Jest + Cypress for testing

## Data Source
NYC Open Data Solar Permits: `https://data.cityofnewyork.us/resource/rvxe-9y9u.json`
1,200+ active permits with status, dates, contractor, and location.

## Setup
```bash
npm install
cp .env.example .env  # Add SENTRY_DSN and GRAPHQL_ENDPOINT
npm run dev
```

## Scripts
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run test` - Run Jest unit tests
- `npm run test:e2e` - Run Cypress e2e tests
- `npm run lint` - ESLint + Prettier

## Features
- **5-stage Kanban**: Submitted → Approved → Scheduled → Installed → Closed
- **Drag-drop updates** persisted offline via IndexedDB, synced when online
- **GraphQL** with persisted queries, Apollo cache normalization
- **Sentry** error tracking with >1% error rate alerts
- **Optimistic UI** with background sync reconciliation

## Project Structure
```
src/
├── app/
│   ├── components/kanban-board, kanban-column, permit-card
│   ├── store/permit.store.ts          # NgRx SignalStore
│   ├── services/permit.service.ts     # API + GraphQL + IndexedDB
│   ├── services/sentry.service.ts     # Sentry integration
│   ├── graphql/queries.ts             # Persisted queries
│   └── models/permit.model.ts         # TypeScript interfaces
```