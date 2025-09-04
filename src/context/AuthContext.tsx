import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ named import

// Token structure decoded from JWT
interface DecodedToken {
  id: string;
  email: string;
  role: "admin" | "user";
  username?: string;
  phone?: string;
  exp: number;
}

// Authenticated user data stored in state
export interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  username?: string;
  phone?: string;
  token: string;
}

// Context value shape
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage token on load
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(savedToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (!isExpired) {
          setUser({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            username: decoded.username,
            phone: decoded.phone,
            token: savedToken,
          });
        } else {
          localStorage.removeItem("auth_token");
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("auth_token");
      }
    }
    setLoading(false);
  }, []);

  // Handle login and save token
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("auth_token", userData.token);

    if (userData.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  // Handle logout and redirect
  const logout = () => {
    const userRole = user?.role;
    setUser(null);
    localStorage.removeItem("auth_token");

    if (userRole === "admin") {
      navigate("/admin/login");
    } else {
      navigate("/login");
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
