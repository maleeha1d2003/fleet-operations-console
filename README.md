# Riverbend Fleet Operations Console

A responsive fleet management dashboard developed as part of the Ezitech Frontend Development project for Riverbend Logistics.

**Live application:** https://maleeha1d2003.github.io/fleet-operations-console/

## Project Overview

The Fleet Operations Console provides a live operations interface for fleet dispatchers to monitor vehicles, filter and sort vehicle records, inspect vehicle details, and handle simulated connectivity interruptions.

The application uses React 18, TypeScript, and Vite. It includes 400 vehicle records, a virtualized vehicle list, simulated live updates, performance logging, keyboard navigation, offline action queuing, automated tests, and continuous deployment through GitHub Actions.

## Features

### Vehicle Monitoring and Performance

- Displays 400 vehicle records using a virtualized list.
- Simulates live vehicle position updates every five seconds.
- Uses `React.memo` and reference-preserving state updates to reduce unnecessary vehicle row renders.
- Records animation frame timing metrics for performance inspection.
- Preserves the vehicle list's scroll position during live updates.

### Filtering, Sorting, and Vehicle Details

- Filters vehicles by status.
- Sorts drivers alphabetically in ascending or descending order.
- Synchronizes filter and sorting selections with URL query parameters.
- Restores the vehicle list's scroll position using session storage.
- Displays vehicle information in a sliding detail panel.
- Supports keyboard navigation and accessible panel interactions.

### Offline Support and Accessibility

- Detects browser connectivity changes and displays an offline banner.
- Queues vehicle inspection actions locally while offline.
- Processes queued actions through a simulated dispatcher after reconnection.
- Pauses simulated vehicle updates while offline and resumes them when online.
- Supports Arrow Up and Arrow Down navigation, including wrapping at list boundaries.
- Opens vehicle details with Enter and supports accessible keyboard interaction.
- Includes accessibility tests using `jest-axe`.

### Automated Testing and Deployment

- Uses Jest and React Testing Library for automated testing.
- Tests vehicle update behavior, mock WebSocket behavior, performance logging, rendering, offline handling, and keyboard interactions.
- Measures statement, branch, function, and line coverage.
- Uses GitHub Actions to install dependencies, run tests with coverage, build the production application, and deploy it to GitHub Pages when changes are pushed to `main`.

## Technology Stack

- React 18
- TypeScript
- Vite
- React Router
- Jest
- React Testing Library
- `jest-axe` and `axe-core`
- CSS
- JSON seed data
- GitHub Actions
- GitHub Pages

## Requirements

Install the following before running the project locally:

- Node.js 22 or a compatible supported version
- npm
- Git

## Installation and Setup

Clone the repository:

```bash
git clone https://github.com/maleeha1d2003/fleet-operations-console.git
cd fleet-operations-console
```

Install the project dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal. With the current Vite base configuration, the application is normally available at:

```text
http://localhost:5173/fleet-operations-console/
```

## Automated Testing

Run the complete Jest test suite:

```bash
npm test
```

Run tests with a code coverage report:

```bash
npm test -- --coverage
```

The coverage report is generated in the `coverage/` directory, which is excluded from version control.

The latest verified local test run completed with:

- **Test suites:** 5 passed
- **Tests:** 20 passed
- **Statement coverage:** 81.19%
- **Line coverage:** 82.49%
- **Function coverage:** 87.50%
- **Branch coverage:** 60.76%

These figures describe the recorded test run and may change as the application and test suite evolve.

## Production Build

Compile TypeScript and create the production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

The generated production files are written to the `dist/` directory.

## Performance Monitoring

The utility `src/utils/performanceLogger.ts` uses `requestAnimationFrame` to sample animation frame durations. It records the latest frame duration, maximum frame duration, average frame duration, and number of samples.

The metrics can be inspected in the browser console while testing live vehicle updates.

The project performance target is an average frame time of no more than 16 ms during live updates. The actual result must be measured using Chrome DevTools on the running application.

Mobile Lighthouse targets are at least 90 for Performance, Accessibility, and Best Practices. These scores must be measured and recorded separately; they are not inferred from successful tests or builds.

## Continuous Integration and Deployment

The GitHub Actions workflow is located at:

```text
.github/workflows/deploy.yml
```

The workflow runs automatically when changes are pushed to the `main` branch. It can also be started manually from the repository's Actions tab.

The deployment process is:

1. Check out the repository.
2. Set up Node.js.
3. Install dependencies using `npm ci`.
4. Run Jest tests with code coverage.
5. Build the production application.
6. Upload the `dist/` directory as a GitHub Pages artifact.
7. Deploy the artifact to GitHub Pages.

If the test or build step fails, the workflow does not proceed to deployment.

**Repository:** https://github.com/maleeha1d2003/fleet-operations-console

**GitHub Actions:** https://github.com/maleeha1d2003/fleet-operations-console/actions

**Live application:** https://maleeha1d2003.github.io/fleet-operations-console/

## Demo Video

**Demo video:** [Add the link to the recorded demonstration here.]

The demonstration should be approximately 30 seconds and show the main application interface, vehicle filtering or sorting, the vehicle detail panel, live updates, and offline behavior if time permits.

Replace the placeholder above with the actual video URL after recording and uploading the demonstration.

## Project Structure

```text
fleet-operations-console/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── data/
│   └── vehicles.json
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── VirtualizedVehicleList.tsx
│   ├── context/
│   │   ├── OfflineActionContext.tsx
│   │   └── VehicleUpdatesContext.tsx
│   ├── tests/
│   │   ├── OfflineAndKeyboard.test.tsx
│   │   ├── VehicleRow.test.tsx
│   │   ├── VehicleUpdatesContext.test.ts
│   │   ├── mockWebSocket.test.ts
│   │   └── performanceLogger.test.ts
│   ├── utils/
│   │   ├── mockWebSocket.ts
│   │   └── performanceLogger.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── types.ts
├── .gitignore
├── jest.config.cjs
├── jest.setup.ts
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.jest.json
├── vite.config.ts
└── README.md
```

## Implementation Notes

The live vehicle feed is simulated by `src/utils/mockWebSocket.ts`; it does not connect to a real vehicle tracking service.

Vehicle inspection actions are stored locally while offline and dispatched through a mock handler after reconnection. The application does not currently submit inspection actions to a production backend.

The map area is a styled placeholder rather than an integrated interactive mapping service.

## Verification Checklist

- [x] Mock vehicle updates run every five seconds.
- [x] Vehicle row rendering uses reference-preserving updates and `React.memo`.
- [x] Vehicle filtering, sorting, and detail panel are implemented.
- [x] Offline status handling and local inspection action queuing are implemented.
- [x] Keyboard navigation and accessibility tests are included.
- [x] Automated test suite passes: 20 tests across 5 suites.
- [x] Statement and line coverage exceed 80%.
- [x] Production build succeeds.
- [x] GitHub Actions tests, builds, and deploys the application.
- [ ] Record and add the demonstration video link.
- [ ] Measure and document Chrome frame-time performance.
- [ ] Measure and document mobile Lighthouse scores.
