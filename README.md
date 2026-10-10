# Riverbend Fleet Operations Console

Task 2 of the Ezitech Frontend Development project for Riverbend Logistics.

## Project overview

This project is a live operations console for fleet dispatchers. It contains a responsive two-column workspace with a virtualised list of 400 vehicles and a styled map placeholder. Task 2 adds a mock WebSocket feed that updates vehicle positions every five seconds while preserving object references for unchanged rows so `React.memo` can prevent unnecessary row re-renders.

## Tech stack
- Vite
- React 18
- TypeScript
- React Router
- Jest
- React Testing Library
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

Open the Vite URL, normally:

```text
http://localhost:5173/fleet-operations-console/
```

## Test

Run the automated render-isolation test:

```bash
npm test
```

The Jest test verifies that when one vehicle object changes, the unchanged vehicle row is not rendered again.

## Build

```bash
npm run build
```

## Live updates

`src/utils/mockWebSocket.ts` provides a small WebSocket-like mock using `setInterval`. Every five seconds it emits a position update for every vehicle containing latitude, longitude, speed, and an update timestamp.

`src/context/VehicleUpdatesContext.tsx` owns the live vehicle state and applies updates without replacing objects that did not actually change. This is important because `React.memo` compares the vehicle object reference passed to each row.

## Minimal re-render strategy

Each vehicle row is wrapped in `React.memo` in `src/components/VirtualizedVehicleList.tsx`. The update reducer creates a new object only for vehicles whose live data changed and keeps the existing object reference for unchanged vehicles.

The virtualised list continues to calculate the visible window from the existing scroll position. Live state updates do not manually reset the scroll container, so the current scroll position is preserved.

## Performance logging

`src/utils/performanceLogger.ts` samples animation-frame durations with `requestAnimationFrame`. A performance snapshot is logged to the browser console after each live update batch so frame timing can be inspected with Chrome DevTools.

The Task 2 performance target is a frame time below 16 ms during normal scrolling and live updates. This should be verified in Chrome DevTools on the deployed application.

## Live deployment

GitHub Pages deployment:

```text
https://maleeha1d2003.github.io/fleet-operations-console/
```

The Vite base path is configured as `/fleet-operations-console/` and the GitHub Actions workflow builds the project and deploys the `dist` directory to GitHub Pages.

## Project structure

```text
fleet-operations-console/
├── data/vehicles.json
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── VirtualizedVehicleList.tsx
│   ├── context/
│   │   └── VehicleUpdatesContext.tsx
│   ├── tests/
│   │   └── VehicleRow.test.tsx
│   ├── utils/
│   │   ├── mockWebSocket.ts
│   │   └── performanceLogger.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── types.ts
├── jest.config.cjs
├── jest.setup.ts
├── tsconfig.jest.json
├── package.json
├── vite.config.ts
└── README.md
```

## Task 2 verification checklist

- Mock update feed runs every 5 seconds.
- Each vehicle receives a live position payload.
- Vehicle state updates preserve references for unchanged rows.
- Vehicle rows use `React.memo`.
- Scroll position is maintained by the existing virtualised scroll container.
- Performance frame metrics are logged during update batches.
- Jest test checks that an unchanged row does not re-render when another row changes.
- Production build completes with `npm run build`.

## Task 3: Filtering, Sorting, and Vehicle Details

### Features Implemented

- **Status filtering:** Filter vehicles by Available, En Route, Delayed, Idle, Offline, or All.
- **Driver name sorting:** Sort the vehicle list alphabetically in ascending or descending order.
- **URL synchronization:** Filter and sort selections are synchronized with URL query parameters and restored when the page reloads.
- **Scroll persistence:** The vehicle list's scroll position is saved in session storage and restored after a reload.
- **Vehicle detail panel:** Clicking a vehicle opens a sliding side panel containing all available vehicle fields without intentionally resetting the list's scroll position.
- **Accessibility:** Vehicle rows support keyboard interaction, and the detail panel supports closing with Escape and includes focus management.

### Validation

- Production build completed successfully using `npm run build`.
- Automated tests passed using `npm test`.
- Filter, sorting, URL synchronization, scroll restoration, and vehicle detail display were manually checked in the browser.