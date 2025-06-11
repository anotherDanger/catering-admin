import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/home/Layout";
import Dashboard from "./components/home/Dashboard";
import Orders from "./components/home/Orders";
import Products from "./components/home/Products";
import LoginPage from "./components/login/LoginPage";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/auth";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
          </Route>
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;