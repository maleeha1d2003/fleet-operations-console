import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { VirtualizedVehicleList } from "./VirtualizedVehicleList";
import { useVehicleUpdates } from "../context/VehicleUpdatesContext";
import type { Vehicle, VehicleStatus } from "../types";

const STATUSES = [
  "All",
  "Available",
  "En Route",
  "Delayed",
  "Idle",
  "Offline",
] as const;

type StatusFilter = (typeof STATUSES)[number];
type SortOrder = "asc" | "desc";

export default function Layout() {
  const { vehicles, lastUpdateAt, connected } = useVehicleUpdates();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialStatus = searchParams.get("status") ?? "All";
  const initialSort = searchParams.get("sort") ?? "asc";

  const [status, setStatus] = useState<StatusFilter>(
    STATUSES.includes(initialStatus as StatusFilter)
      ? (initialStatus as StatusFilter)
      : "All",
  );
  const [sort, setSort] = useState<SortOrder>(
    initialSort === "desc" ? "desc" : "asc",
  );
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
    null,
  );

  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const nextStatus = searchParams.get("status") ?? "All";
    const nextSort = searchParams.get("sort") ?? "asc";

    setStatus(
      STATUSES.includes(nextStatus as StatusFilter)
        ? (nextStatus as StatusFilter)
        : "All",
    );
    setSort(nextSort === "desc" ? "desc" : "asc");
  }, [searchParams]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);

    if (status === "All") nextParams.delete("status");
    else nextParams.set("status", status);

    if (sort === "asc") nextParams.delete("sort");
    else nextParams.set("sort", sort);

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [status, sort, searchParams, setSearchParams]);

  useEffect(() => {
    if (!selectedVehicle) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedVehicle(null);
      }

      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedVehicle]);

  useEffect(() => {
    if (!selectedVehicle && previouslyFocusedRef.current) {
      previouslyFocusedRef.current.focus();
      previouslyFocusedRef.current = null;
    }
  }, [selectedVehicle]);

  const filteredVehicles = useMemo(() => {
    const result = vehicles.filter(
      (vehicle) => status === "All" || vehicle.status === status,
    );

    result.sort((a, b) => {
      const comparison = a.driver.localeCompare(b.driver, undefined, {
        sensitivity: "base",
        numeric: true,
      });
      return sort === "asc" ? comparison : -comparison;
    });

    return result;
  }, [vehicles, status, sort]);

  const counts = useMemo(
    () =>
      vehicles.reduce(
        (a, v) => {
          a.total++;
          if (v.status === "En Route") a.active++;
          if (v.status === "Delayed") a.delayed++;
          return a;
        },
        { total: 0, active: 0, delayed: 0 },
      ),
    [vehicles],
  );

  const openDetails = (vehicle: Vehicle) => {
    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setSelectedVehicle(vehicle);
  };

  const closeDetails = () => setSelectedVehicle(null);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">RIVERBEND LOGISTICS</p>
          <h1>Fleet Operations Console</h1>
          <p className="subtitle">
            Live dispatch view for delivery vehicles across the network.
          </p>
        </div>
        <div className="status-pill">
          <span className="status-dot" />
          {connected ? "Live updates · every 5s" : "Updates offline"}
        </div>
      </header>

      <section className="metrics" aria-label="Fleet summary">
        <article className="metric-card">
          <span>Total vehicles</span>
          <strong>{counts.total}</strong>
        </article>
        <article className="metric-card">
          <span>En route</span>
          <strong>{counts.active}</strong>
        </article>
        <article className="metric-card">
          <span>Delayed</span>
          <strong>{counts.delayed}</strong>
        </article>
      </section>

      <p className="live-update-status" aria-live="polite">
        {lastUpdateAt
          ? `Last live position update: ${new Date(lastUpdateAt).toLocaleTimeString()}`
          : "Waiting for the first live position update..."}
      </p>

      <section className="workspace" aria-label="Fleet workspace">
        <div className="list-panel">
          <div className="panel-header">
            <div>
              <h2>Vehicles</h2>
              <p>Showing {filteredVehicles.length} of {vehicles.length} vehicles</p>
            </div>
            <span className="panel-tag">Virtualized</span>
          </div>

          <div className="list-controls">
            <label>
              Filter by status
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as StatusFilter)
                }
              >
                {STATUSES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              Sort by driver name
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as SortOrder)
                }
              >
                <option value="asc">A to Z</option>
                <option value="desc">Z to A</option>
              </select>
            </label>
          </div>

          <VirtualizedVehicleList
            vehicles={filteredVehicles}
            onSelect={openDetails}
          />
        </div>

        <aside className="map-panel" aria-label="Map placeholder">
          <div className="map-grid" />
          <div className="map-placeholder">
            <div className="map-icon" aria-hidden="true">⌖</div>
            <h2>Map</h2>
            <p>Live vehicle positions will appear here in a later task.</p>
          </div>
        </aside>
      </section>

      {selectedVehicle && (
        <div
          className="detail-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDetails();
          }}
        >
          <aside
            ref={panelRef}
            className="detail-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
          >
            <div className="detail-header">
              <div>
                <p className="eyebrow">VEHICLE DETAILS</p>
                <h2 id="detail-title">{selectedVehicle.registration}</h2>
              </div>
              <button
                ref={closeButtonRef}
                className="detail-close"
                onClick={closeDetails}
                aria-label="Close vehicle details"
              >
                ×
              </button>
            </div>

            <p className="detail-intro">
              Full details for {selectedVehicle.driver}
            </p>

            <dl className="detail-fields">
              {Object.entries(selectedVehicle).map(([key, value]) => (
                <div className="detail-field" key={key}>
                  <dt>{key.replace(/([A-Z])/g, " $1")}</dt>
                  <dd>{String(value ?? "—")}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      )}
    </main>
  );
}