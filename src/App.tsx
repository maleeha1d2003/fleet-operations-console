import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { VehicleUpdatesProvider } from "./context/VehicleUpdatesContext";
import { OfflineActionProvider } from "./context/OfflineActionContext";

function App() {
  return (
    <BrowserRouter basename="/fleet-operations-console">
      <OfflineActionProvider>
        <VehicleUpdatesProvider>
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="/console" element={<Layout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </VehicleUpdatesProvider>
      </OfflineActionProvider>
    </BrowserRouter>
  );
}

export default App;