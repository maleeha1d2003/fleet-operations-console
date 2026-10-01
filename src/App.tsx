import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter basename="/fleet-operations-console">
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/console" element={<Layout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App