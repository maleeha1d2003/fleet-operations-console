import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { KeyboardEvent } from "react";
import type { Vehicle } from "../types";

const ROW_HEIGHT = 76;
const OVERSCAN = 5;
const VIEWPORT_HEIGHT = 620;
const SCROLL_STORAGE_KEY = "fleet-console-scroll-top";

export const vehicleRowRenderObserver = {
  onRender: (_id: string) => {},
};

interface VehicleRowProps {
  vehicle: Vehicle;
  top: number;
  onSelect?: (vehicle: Vehicle) => void;
}
export const VehicleRow = memo(function VehicleRow({
  vehicle,
  top,
  onSelect,
}: VehicleRowProps) {
  vehicleRowRenderObserver.onRender(vehicle.id);

const handleSelect = () => {
  onSelect?.(vehicle);
};

const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleSelect();
  }
};
  return (
    <article
      className="vehicle-row"
      style={{ transform: `translateY(${top}px)` }}
      aria-label={`${vehicle.registration}, ${vehicle.status}`}
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
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

interface VirtualizedVehicleListProps {
  vehicles: Vehicle[];
  onSelect: (vehicle: Vehicle) => void;
}

export function VirtualizedVehicleList({
  vehicles,
  onSelect,
}: VirtualizedVehicleListProps) {
  const [scrollTop, setScrollTop] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const restoredRef = useRef(false);

  const restoreScrollPosition = useCallback(() => {
    const node = ref.current;

    if (!node || restoredRef.current) {
      return;
    }

    restoredRef.current = true;

    try {
      const saved = sessionStorage.getItem(SCROLL_STORAGE_KEY);
      const parsed = saved === null ? 0 : Number(saved);

      const maxScroll = Math.max(
        0,
        vehicles.length * ROW_HEIGHT - VIEWPORT_HEIGHT,
      );

      const restored = Number.isFinite(parsed)
        ? Math.min(Math.max(0, parsed), maxScroll)
        : 0;

      node.scrollTop = restored;
      setScrollTop(restored);
    } catch {
      // Keep the list usable if browser storage is unavailable.
    }
  }, [vehicles.length]);

  useEffect(() => {
    restoreScrollPosition();
  }, [restoreScrollPosition]);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const handleScroll = () => {
      const nextScrollTop = node.scrollTop;

      try {
        sessionStorage.setItem(
          SCROLL_STORAGE_KEY,
          String(nextScrollTop),
        );
      } catch {
        // Scrolling must continue to work without storage.
      }

      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        setScrollTop((previous) =>
          previous === nextScrollTop ? previous : node.scrollTop,
        );
      });
    };

    node.addEventListener("scroll", handleScroll, { passive: true });

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
    Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN,
  );

  const count =
    Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT) + OVERSCAN * 2;

  const end = Math.min(vehicles.length, start + count);

  const visible = useMemo(
    () => vehicles.slice(start, end),
    [vehicles, start, end],
  );

  return (
    <div
      ref={ref}
      className="vehicle-scroll"
      style={{ height: VIEWPORT_HEIGHT }}
      tabIndex={0}
      aria-label="Scrollable list of vehicles"
      role="region"
    >
      <div
        className="vehicle-spacer"
        style={{ height: vehicles.length * ROW_HEIGHT }}
      >
        {visible.map((vehicle, index) => (
          <VehicleRow
            key={vehicle.id}
            vehicle={vehicle}
            top={(start + index) * ROW_HEIGHT}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}