import { createMockVehicleWebSocket } from "../utils/mockWebSocket";
import type { Vehicle } from "../types";

const vehicle: Vehicle = {
  id: "veh-001",
  registration: "RB-001",
  driver: "Driver 001",
  status: "En Route",
  location: "Rawalpindi",
  speed: 50,
  latitude: 33.5651,
  longitude: 73.0169,
  updatedAt: "2026-10-20T12:00:01.000Z",
};

describe("createMockVehicleWebSocket", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-10-20T12:00:00.000Z"));
    jest.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("emits vehicle updates at the configured interval", () => {
    const onMessage = jest.fn();

    const socket = createMockVehicleWebSocket([vehicle], onMessage, 1000);

    expect(onMessage).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(onMessage).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledWith([
      expect.objectContaining({
        id: "veh-001",
        latitude: vehicle.latitude,
        longitude: vehicle.longitude,
        speed: vehicle.speed,
        updatedAt: "2026-10-20T12:00:01.000Z",
      }),
    ]);

    socket.close();
  });

  it("does not emit updates after the connection is closed", () => {
    const onMessage = jest.fn();

    const socket = createMockVehicleWebSocket([vehicle], onMessage, 1000);

    socket.close();
    jest.advanceTimersByTime(3000);

    expect(onMessage).not.toHaveBeenCalled();
  });

  it("emits an empty batch when there are no vehicles", () => {
    const onMessage = jest.fn();

    const socket = createMockVehicleWebSocket([], onMessage, 1000);

    jest.advanceTimersByTime(1000);

    expect(onMessage).toHaveBeenCalledWith([]);

    socket.close();
  });

  it("never generates a negative vehicle speed", () => {
    jest.spyOn(Math, "random").mockReturnValue(0);

    const onMessage = jest.fn();
    const socket = createMockVehicleWebSocket(
      [{ ...vehicle, speed: 1 }],
      onMessage,
      1000,
    );

    jest.advanceTimersByTime(1000);

    expect(onMessage.mock.calls[0][0][0].speed).toBeGreaterThanOrEqual(0);

    socket.close();
  });
});