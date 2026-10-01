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

## Task 1 Verification

The Task 1 implementation was tested locally before GitHub deployment.

Verified items:

- The project installs successfully with `npm install`.
- The development server runs with `npm run dev`.
- The console is available at `/console`.
- The seed dataset contains 400 vehicle records.
- The vehicle list uses windowing logic so only the visible range is rendered.
- The two-column desktop layout displays the vehicle list and Map placeholder side by side.
- The responsive layout stacks the workspace on smaller screens.
- The production build completes successfully with `npm run build`.

## Implementation Notes

The vehicle list uses a lightweight manual windowing approach rather than rendering all 400 rows at the same time. The scroll position is used to calculate the visible range, with a small overscan buffer around the viewport. This keeps the full list height available for normal scrolling while limiting the number of mounted vehicle rows.

Vehicle rows are memoized so unchanged rows can avoid unnecessary React re-renders. The implementation uses fixed row heights to keep the window calculations predictable and lightweight.

The Map area is intentionally implemented as a styled placeholder in Task 1. Live vehicle positions and map integration are reserved for the later project tasks.

## Final Verification

Task 1 was rechecked on October 1, 2026. The project installs successfully with `npm install`, runs with `npm run dev`, and builds successfully with `npm run build`. The repository contains 400 vehicle records, a windowed vehicle list, a responsive two-column layout, a Map placeholder, client-side routing, and setup instructions.
