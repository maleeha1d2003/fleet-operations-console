import { useMemo } from "react";
import { VirtualizedVehicleList } from "./VirtualizedVehicleList";
import type { Vehicle } from "../types";
import vehiclesData from "../../data/vehicles.json";

export default function Layout() {
  const vehicles = vehiclesData as Vehicle[];

  const counts = useMemo(
    () =>
      vehicles.reduce(
        (a, v) => {
          a.total++;
          if (v.status === "En Route") a.active++;
          if (v.status === "Delayed") a.delayed++;
          return a;
        },
        { total: 0, active: 0, delayed: 0 }
      ),
    [vehicles]
  );

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
          Operations online
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

      <section className="workspace" aria-label="Fleet workspace">
        <div className="list-panel">
          <div className="panel-header">
            <div>
              <h2>Vehicles</h2>
              <p>Windowed list · {vehicles.length} records</p>
            </div>

            <span className="panel-tag">Virtualized</span>
          </div>

          <VirtualizedVehicleList vehicles={vehicles} />
        </div>

        <aside className="map-panel" aria-label="Map placeholder">
          <div className="map-grid" />

          <div className="map-placeholder">
            <div className="map-icon" aria-hidden="true">
              ⌖
            </div>

            <h2>Map</h2>

            <p>
              Live vehicle positions will appear here in a later task.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}