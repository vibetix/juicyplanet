// AdminProtectedRoute.tsx

import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: JSX.Element;
}

const AdminProtectedRoute = ({ children }: Props) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading state while checking token
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  // Not logged in or not admin – redirect
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  // Admin is authenticated – show the page
  return children;
};

export default AdminProtectedRoute;
