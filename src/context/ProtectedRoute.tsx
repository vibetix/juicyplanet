// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { login } from "@/store/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const auth = useAppSelector((state) => state.auth || { user: null, isAuthenticated: false });
  const { isAuthenticated, user } = auth;

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // console.log("🔒 Checking ProtectedRoute");

    const storedUser = localStorage.getItem("auth_user");
    const token = localStorage.getItem("token");

    // console.log("LocalStorage user:", storedUser);
    // console.log("Redux auth state:", auth);

    // Attempt to restore user session from localStorage
    if (!isAuthenticated && storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(login(parsedUser));
      } catch (err) {
        // console.warn("⚠️ Failed to parse stored user:", err);
      }
    }

    setChecking(false);
  }, [isAuthenticated, dispatch]);

  if (checking) return <div className="p-6 text-center">Loading...</div>;

  if (!user || !isAuthenticated) {
    console.log("🔴 User not authenticated. Redirecting to login.");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log(`⚠️ User lacks required role (${requiredRole}). Redirecting to home.`);
    return <Navigate to="/" replace />;
  }

  // console.log("✅ User authenticated:", user.email);
  return <>{children}</>;
};

export default ProtectedRoute;
