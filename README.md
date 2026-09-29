# Riverbend Fleet Operations Console

Task 1 of the Ezitech Frontend Development project for Riverbend Logistics.

## Project overview

This task establishes the foundation for a live operations console used by fleet dispatchers. The interface contains a responsive two-column workspace with a virtualised vehicle list containing 400 seed records and a styled map placeholder for later live-position features.

## Tech stack
- Vite
- React
- TypeScript
- React Router
- CSS
- JSON seed data

## Setup
Requirements: Node.js 18 or newer and npm.

Install dependencies:
```bash
npm install
```
Start the development server:
```bash
npm run dev
```
Open the Vite URL, normally `http://localhost:5173/console`.

## Build
```bash
npm run build
```

## Windowing approach
The vehicle list uses fixed-height rows and calculates a visible range from the scroll position. An overscan buffer is added above and below the visible range. The scroll container preserves the full 400-row height through a spacer while only the visible rows are mounted.

## Seed data
`data/vehicles.json` contains exactly 400 mock vehicle objects. Each record includes an identifier, registration, driver, status, location, speed, coordinates, and update timestamp.

## Routing
React Router provides a clean `/console` route. The root route redirects to `/console`, and unknown routes also redirect to the console.

## Task 1 scope
This task focuses on the scaffold, data model, basic layout, virtualization, and routing described in the project brief. Live position updates, filters, sorting, detail panels, offline handling, keyboard navigation, automated tests, performance profiling, and final deployment belong to later tasks.

## Project structure
```text
fleet-operations-console/
├── data/vehicles.json
├── src/
│   ├── components/Layout.tsx
│   ├── components/VirtualizedVehicleList.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── types.ts
├── index.html
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

Prepared as an original implementation from the supplied Ezitech project brief; no example implementation was copied.
