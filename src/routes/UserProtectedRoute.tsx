// src/routes/UserProtectedRoute.tsx

import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const UserProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isUser, loading } = useAuth();

  if (loading) return null; // You can show a spinner here if you like

  if (!isAuthenticated || !isUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserProtectedRoute;
