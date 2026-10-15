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
  index?: number;
  active?: boolean;
  onSelect?: (vehicle: Vehicle) => void;
  onFocusRow?: (index: number) => void;
}

export const VehicleRow = memo(function VehicleRow({
  vehicle,
  top,
  index = 0,
  active = false,
  onSelect,
  onFocusRow,
}: VehicleRowProps) {
  vehicleRowRenderObserver.onRender(vehicle.id);

  return (
    <div
      id={`vehicle-option-${vehicle.id}`}
      className="vehicle-row"
      style={{ transform: `translateY(${top}px)` }}
      role="option"
      aria-selected={active}
      aria-label={`${vehicle.registration}, ${vehicle.driver}, ${vehicle.status}`}
      tabIndex={active ? 0 : -1}
      onClick={() => onSelect?.(vehicle)}
      onFocus={() => onFocusRow?.(index)}
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
    </div>
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
  const [activeIndex, setActiveIndex] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const restoredRef = useRef(false);

  const restoreScrollPosition = useCallback(() => {
    const node = ref.current;
    if (!node || restoredRef.current) return;

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
      // The list remains usable when browser storage is unavailable.
    }
  }, [vehicles.length]);

  useEffect(() => {
    restoreScrollPosition();
  }, [restoreScrollPosition]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleScroll = () => {
      const nextScrollTop = node.scrollTop;

      try {
        sessionStorage.setItem(
          SCROLL_STORAGE_KEY,
          String(nextScrollTop),
        );
      } catch {
        // Scrolling remains available without storage.
      }

      if (frameRef.current !== null) return;

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        setScrollTop(node.scrollTop);
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

  useEffect(() => {
    setActiveIndex((current) =>
      vehicles.length === 0
        ? 0
        : Math.min(current, vehicles.length - 1),
    );
  }, [vehicles.length]);

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

  const focusIndex = useCallback(
    (index: number) => {
      if (!vehicles.length) return;

      const nextIndex =
        (index + vehicles.length) % vehicles.length;

      setActiveIndex(nextIndex);

      const node = ref.current;
      if (!node) return;

      const rowTop = nextIndex * ROW_HEIGHT;
      const rowBottom = rowTop + ROW_HEIGHT;

      if (rowTop < node.scrollTop) {
        node.scrollTop = rowTop;
      } else if (rowBottom > node.scrollTop + VIEWPORT_HEIGHT) {
        node.scrollTop = rowBottom - VIEWPORT_HEIGHT;
      }

      setScrollTop(node.scrollTop);

      requestAnimationFrame(() => {
        document
          .getElementById(`vehicle-option-${vehicles[nextIndex].id}`)
          ?.focus();
      });
    },
    [vehicles],
  );

  const handleListKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusIndex(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusIndex(activeIndex - 1);
    } else if (event.key === "Enter" && vehicles[activeIndex]) {
      event.preventDefault();
      onSelect(vehicles[activeIndex]);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusIndex(vehicles.length - 1);
    }
  };

  return (
    <div
      ref={ref}
      className="vehicle-scroll"
      style={{ height: VIEWPORT_HEIGHT }}
      tabIndex={0}
      aria-label="Vehicles"
      aria-describedby="vehicle-list-help"
      aria-activedescendant={
        vehicles[activeIndex]
          ? `vehicle-option-${vehicles[activeIndex].id}`
          : undefined
      }
      role="listbox"
      onKeyDown={handleListKeyDown}
    >
      <span id="vehicle-list-help" className="sr-only">
        Use the up and down arrow keys to navigate vehicles.
        Press Enter to open vehicle details.
      </span>

      <div
        className="vehicle-spacer"
        style={{ height: vehicles.length * ROW_HEIGHT }}
      >
        {visible.map((vehicle, index) => {
          const actualIndex = start + index;

          return (
            <VehicleRow
              key={vehicle.id}
              vehicle={vehicle}
              top={actualIndex * ROW_HEIGHT}
              index={actualIndex}
              active={actualIndex === activeIndex}
              onSelect={onSelect}
              onFocusRow={setActiveIndex}
            />
          );
        })}
      </div>
    </div>
  );
}