import { applyUpdates } from "../context/VehicleUpdatesContext";
import type { Vehicle } from "../types";
import type { VehicleUpdate } from "../utils/mockWebSocket";

const vehicleA: Vehicle = {
  id: "veh-001",
  registration: "RB-001",
  driver: "Driver 001",
  status: "En Route",
  location: "Rawalpindi",
  speed: 50,
  latitude: 33.5651,
  longitude: 73.0169,
  updatedAt: "2026-10-20T12:00:00.000Z",
};

const vehicleB: Vehicle = {
  ...vehicleA,
  id: "veh-002",
  registration: "RB-002",
  driver: "Driver 002",
};

describe("applyUpdates", () => {
  it("updates only the vehicle whose live data changed", () => {
    const vehicles = [vehicleA, vehicleB];

    const updates: VehicleUpdate[] = [
      {
        id: "veh-001",
        latitude: 33.57,
        longitude: 73.02,
        speed: 64,
        updatedAt: "2026-10-20T12:00:05.000Z",
      },
    ];

    const result = applyUpdates(vehicles, updates);

    expect(result).not.toBe(vehicles);
    expect(result[0]).not.toBe(vehicleA);
    expect(result[0]).toEqual({
      ...vehicleA,
      latitude: 33.57,
      longitude: 73.02,
      speed: 64,
      updatedAt: "2026-10-20T12:00:05.000Z",
    });

    expect(result[1]).toBe(vehicleB);
  });

  it("preserves the array and vehicle references when values are unchanged", () => {
    const vehicles = [vehicleA, vehicleB];

    const updates: VehicleUpdate[] = [
      {
        id: vehicleA.id,
        latitude: vehicleA.latitude,
        longitude: vehicleA.longitude,
        speed: vehicleA.speed,
        updatedAt: vehicleA.updatedAt,
      },
    ];

    const result = applyUpdates(vehicles, updates);

    expect(result).toBe(vehicles);
    expect(result[0]).toBe(vehicleA);
    expect(result[1]).toBe(vehicleB);
  });

  it("returns the original array for an empty update batch", () => {
    const vehicles = [vehicleA, vehicleB];

    expect(applyUpdates(vehicles, [])).toBe(vehicles);
  });

  it("ignores updates for unknown vehicle IDs", () => {
    const vehicles = [vehicleA, vehicleB];

    const updates: VehicleUpdate[] = [
      {
        id: "unknown-vehicle",
        latitude: 40,
        longitude: 70,
        speed: 10,
        updatedAt: "2026-10-20T12:00:05.000Z",
      },
    ];

    expect(applyUpdates(vehicles, updates)).toBe(vehicles);
  });
});