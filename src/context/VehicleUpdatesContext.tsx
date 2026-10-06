import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import vehiclesData from "../../data/vehicles.json";
import type { Vehicle } from "../types";
import {
  createMockVehicleWebSocket,
  type VehicleUpdate,
} from "../utils/mockWebSocket";
import {
  recordUpdatePerformance,
  startPerformanceLogger,
} from "../utils/performanceLogger";

interface VehicleUpdatesContextValue {
  vehicles: Vehicle[];
  lastUpdateAt: string | null;
  connected: boolean;
}

const VehicleUpdatesContext = createContext<VehicleUpdatesContextValue | null>(
  null,
);

const initialVehicles = vehiclesData as Vehicle[];

function applyUpdates(vehicles: Vehicle[], updates: VehicleUpdate[]): Vehicle[] {
  const updatesById = new Map(updates.map((update) => [update.id, update]));
  let changed = false;

  const nextVehicles = vehicles.map((vehicle) => {
    const update = updatesById.get(vehicle.id);
    if (!update) return vehicle;

    const nextVehicle: Vehicle = {
      ...vehicle,
      latitude: update.latitude,
      longitude: update.longitude,
      speed: update.speed,
      updatedAt: update.updatedAt,
    };

    if (
      nextVehicle.latitude !== vehicle.latitude ||
      nextVehicle.longitude !== vehicle.longitude ||
      nextVehicle.speed !== vehicle.speed ||
      nextVehicle.updatedAt !== vehicle.updatedAt
    ) {
      changed = true;
      return nextVehicle;
    }

    // Preserve the original object reference when nothing actually changed.
    return vehicle;
  });

  return changed ? nextVehicles : vehicles;
}

export function VehicleUpdatesProvider({ children }: PropsWithChildren) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [lastUpdateAt, setLastUpdateAt] = useState<string | null>(null);
  const connected = true;

  useEffect(() => {
    const stopPerformanceLogger = startPerformanceLogger();

    const socket = createMockVehicleWebSocket(initialVehicles, (updates) => {
      setVehicles((currentVehicles) => applyUpdates(currentVehicles, updates));
      setLastUpdateAt(new Date().toISOString());
      recordUpdatePerformance();
    }, 5000);

    return () => {
      socket.close();
      stopPerformanceLogger();
    };
  }, []);

  const value = useMemo(
    () => ({ vehicles, lastUpdateAt, connected }),
    [vehicles, lastUpdateAt, connected],
  );

  return (
    <VehicleUpdatesContext.Provider value={value}>
      {children}
    </VehicleUpdatesContext.Provider>
  );
}

export function useVehicleUpdates() {
  const context = useContext(VehicleUpdatesContext);
  if (!context) {
    throw new Error("useVehicleUpdates must be used inside VehicleUpdatesProvider");
  }
  return context;
}

export { applyUpdates };
