import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHooks";
import Footer from "@/components/Footer";
import { login } from "@/store/authSlice";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());



const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await fetch("https://juicy-backend.onrender.com/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();

   if (!res.ok) {
  setError(data.message || "Login failed. Try again.");
    } else {
      dispatch(login(data.user)); // ✅ correct object
      localStorage.setItem("auth_user", JSON.stringify(data.user)); // ✅ store only necessary parts if needed
      localStorage.setItem("token", data.token);
      navigate("/");
    }

  } catch (err) {
    setError("Network error. Please try again later.");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center pt-[80px] pb-[20px]">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white border border-juicy-yellow/20 shadow-md rounded-lg p-8 space-y-6"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-juicy-yellow to-juicy-yellow-light rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl">🧃</span>
            </div>
            <h2 className="text-xl font-raleway font-bold text-center text-juicy-green">
              Welcome Back
            </h2>
          </div>

          {error && <p className="text-juicy-red text-center text-sm">{error}</p>}

          <Input
            placeholder="Email, Username or Phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full border-juicy-yellow focus:ring-juicy-green focus:border-juicy-green"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-juicy-yellow focus:ring-juicy-green focus:border-juicy-green pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-juicy-yellow hover:bg-juicy-yellow-light text-gray-800 font-quicksand font-semibold rounded-full shadow-md hover:shadow-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <a href="/register" className="text-juicy-green hover:underline">
              Register
            </a>
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
}
