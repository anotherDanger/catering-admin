import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/home/Layout";
import Dashboard from "./components/home/Dashboard";
import Orders from "./components/home/Orders";
import Products from "./components/home/Products";
import LoginPage from "./components/login/LoginPage";
import { AuthProvider } from "./context/auth";
import Users from "./components/home/Users";
import Logs from "./components/home/Logs";

async function refreshToken() {
  const response = await fetch("https://khatering.shop/v1/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return true;
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  return false;
}

function ProtectedRoute() {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("access_token");
      if (!token) {
        const refreshed = await refreshToken();
        setIsAuth(refreshed);
      } else {
        setIsAuth(true);
      }
    }
    checkAuth();
  }, []);

  if (isAuth === null) return null;

  if (!isAuth) return <Navigate to="/login" replace />;

  return <Outlet />;
}

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
            <Route path="users" element={<Users />} />
            <Route path="logs" element={<Logs />} />
          </Route>
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
