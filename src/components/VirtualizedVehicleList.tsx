import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Vehicle } from "../types";

const ROW_HEIGHT = 76;
const OVERSCAN = 5;
const VIEWPORT_HEIGHT = 620;

export const vehicleRowRenderObserver = {
  onRender: (_id: string) => {},
};

export const VehicleRow = memo(function VehicleRow({
  vehicle,
  top,
}: {
  vehicle: Vehicle;
  top: number;
}) {
  vehicleRowRenderObserver.onRender(vehicle.id);

  return (
    <article
      className="vehicle-row"
      style={{ transform: `translateY(${top}px)` }}
      aria-label={`${vehicle.registration}, ${vehicle.status}`}
    >
      <div className="vehicle-main">
        <span className="vehicle-id">{vehicle.registration}</span>
        <strong>{vehicle.driver}</strong>
      </div>

      <div className="vehicle-location">
        <span>{vehicle.location}</span>
        <small>{vehicle.speed} km/h</small>
      </div>

      <span
        className={`badge badge-${vehicle.status
          .toLowerCase()
          .replace(" ", "-")}`}
      >
        {vehicle.status}
      </span>
    </article>
  );
});

export function VirtualizedVehicleList({
  vehicles,
}: {
  vehicles: Vehicle[];
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const handleScroll = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;

        const nextScrollTop = node.scrollTop;

        setScrollTop((previous) =>
          previous === nextScrollTop ? previous : nextScrollTop
        );
      });
    };

    node.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      node.removeEventListener("scroll", handleScroll);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  const start = Math.max(
    0,
    Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN
  );

  const count =
    Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT) + OVERSCAN * 2;

  const end = Math.min(
    vehicles.length,
    start + count
  );

  const visible = useMemo(
    () => vehicles.slice(start, end),
    [vehicles, start, end]
  );

  return (
    <div
      ref={ref}
      className="vehicle-scroll"
      style={{ height: VIEWPORT_HEIGHT }}
      tabIndex={0}
      aria-label="Scrollable list of 400 vehicles"
    >
      <div
        className="vehicle-spacer"
        style={{
          height: vehicles.length * ROW_HEIGHT,
        }}
      >
        {visible.map((vehicle, index) => (
          <VehicleRow
            key={vehicle.id}
            vehicle={vehicle}
            top={(start + index) * ROW_HEIGHT}
          />
        ))}
      </div>
    </div>
  );
}