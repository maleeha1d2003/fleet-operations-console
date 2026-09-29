import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
export default function App(){return <Routes><Route path="/" element={<Navigate to="/console" replace/>}/><Route path="/console" element={<Layout/>}/><Route path="*" element={<Navigate to="/console" replace/>}/></Routes>}
