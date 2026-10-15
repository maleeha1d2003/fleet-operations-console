import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { MemoryRouter } from "react-router-dom";
import { OfflineActionProvider } from "../context/OfflineActionContext";
import { VehicleUpdatesProvider } from "../context/VehicleUpdatesContext";
import Layout from "../components/Layout";

expect.extend(toHaveNoViolations);

function renderConsole() {
  return render(
    <MemoryRouter>
      <OfflineActionProvider>
        <VehicleUpdatesProvider>
          <Layout />
        </VehicleUpdatesProvider>
      </OfflineActionProvider>
    </MemoryRouter>,
  );
}

describe("Offline and keyboard integration", () => {
  beforeEach(() => {
    window.dispatchEvent(new Event("online"));
    localStorage.clear();
    sessionStorage.clear();
  });

  it("shows the offline banner and hides it after reconnection", async () => {
    renderConsole();

    expect(screen.queryByText(/you are offline/i)).not.toBeInTheDocument();

    fireEvent(window, new Event("offline"));

    expect(await screen.findByText(/you are offline/i)).toBeInTheDocument();

    fireEvent(window, new Event("online"));

    await waitFor(() => {
      expect(screen.queryByText(/you are offline/i)).not.toBeInTheDocument();
    });
  });

  it("queues an inspection while offline and clears it after reconnection", async () => {
    renderConsole();

    fireEvent(window, new Event("offline"));

    const firstVehicle = await screen.findByText("RB-001");
    fireEvent.click(firstVehicle);

    const detailPanel = screen.getByRole("dialog", {
      name: /RB-001/i,
    });

    fireEvent.click(
      within(detailPanel).getByRole("button", {
        name: /mark as inspected/i,
      }),
    );

    expect(
      within(detailPanel).getByText(/inspection action is waiting to sync/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/1 pending action/i)).toBeInTheDocument();

    fireEvent(window, new Event("online"));

    await waitFor(() => {
      expect(screen.queryByText(/1 pending action/i)).not.toBeInTheDocument();
      expect(
        screen.getByText(/queued action.*dispatched after reconnection/i),
      ).toBeInTheDocument();
    });
  });

  it("moves keyboard focus through the vehicle list and opens details with Enter", async () => {
    renderConsole();

    const listbox = screen.getByRole("listbox", { name: "Vehicles" });

    listbox.focus();
    fireEvent.keyDown(listbox, { key: "ArrowDown" });

    await waitFor(() => {
      expect(document.activeElement).toHaveAttribute(
        "id",
        "vehicle-option-veh-121",
      );
    });

    fireEvent.keyDown(listbox, { key: "Enter" });

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("has no axe accessibility violations in the initial dashboard", async () => {
    const { container } = renderConsole();

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("has no axe accessibility violations while offline", async () => {
    const { container } = renderConsole();

    fireEvent(window, new Event("offline"));

    expect(await screen.findByText(/you are offline/i)).toBeInTheDocument();

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});