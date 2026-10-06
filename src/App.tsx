import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { VehicleUpdatesProvider } from "./context/VehicleUpdatesContext";

function App() {
  return (
    <BrowserRouter basename="/fleet-operations-console">
      <VehicleUpdatesProvider>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/console" element={<Layout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </VehicleUpdatesProvider>
    </BrowserRouter>
  );
}

export default App;
