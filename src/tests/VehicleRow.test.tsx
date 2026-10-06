import { render, screen } from "@testing-library/react";
import {
  VehicleRow,
  vehicleRowRenderObserver,
} from "../components/VirtualizedVehicleList";
import type { Vehicle } from "../types";

const vehicleA: Vehicle = {
  id: "1",
  registration: "RB-001",
  driver: "Driver 001",
  status: "En Route",
  location: "Rawalpindi",
  speed: 50,
  latitude: 33.5651,
  longitude: 73.0169,
  updatedAt: "2026-10-06T12:00:00.000Z",
};

const vehicleB: Vehicle = {
  ...vehicleA,
  id: "2",
  registration: "RB-002",
  driver: "Driver 002",
};

describe("VehicleRow render isolation", () => {
  it("re-renders only the row whose vehicle data changed", () => {
    const renderSpy = jest.spyOn(vehicleRowRenderObserver, "onRender");

    const { rerender } = render(
      <>
        <VehicleRow vehicle={vehicleA} top={0} />
        <VehicleRow vehicle={vehicleB} top={76} />
      </>,
    );

    renderSpy.mockClear();

    rerender(
      <>
        <VehicleRow vehicle={{ ...vehicleA, speed: 63 }} top={0} />
        <VehicleRow vehicle={vehicleB} top={76} />
      </>,
    );

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenCalledWith("1");
    expect(screen.getByText("63 km/h")).toBeInTheDocument();

    renderSpy.mockRestore();
  });
});
