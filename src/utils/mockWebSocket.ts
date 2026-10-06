import type { Vehicle } from "../types";

export interface VehicleUpdate {
  id: string;
  latitude: number;
  longitude: number;
  speed: number;
  updatedAt: string;
}

export interface MockVehicleWebSocket {
  close: () => void;
}

/**
 * A tiny WebSocket-like mock. Every five seconds it emits one position
 * payload for every vehicle, just like a live fleet feed would.
 */
export function createMockVehicleWebSocket(
  vehicles: Vehicle[],
  onMessage: (updates: VehicleUpdate[]) => void,
  intervalMs = 5000,
): MockVehicleWebSocket {
  const sendBatch = () => {
    const now = new Date().toISOString();
    const updates = vehicles.map((vehicle) => {
      const latitudeDelta = (Math.random() - 0.5) * 0.001;
      const longitudeDelta = (Math.random() - 0.5) * 0.001;
      const speedDelta = Math.round((Math.random() - 0.5) * 8);

      return {
        id: vehicle.id,
        latitude: vehicle.latitude + latitudeDelta,
        longitude: vehicle.longitude + longitudeDelta,
        speed: Math.max(0, vehicle.speed + speedDelta),
        updatedAt: now,
      };
    });

    onMessage(updates);
  };

  const timer = window.setInterval(sendBatch, intervalMs);

  return {
    close: () => window.clearInterval(timer),
  };
}
