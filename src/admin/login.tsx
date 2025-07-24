import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:4000/admin/login", {
        email,
        password,
      });

      localStorage.setItem("admin_token", res.data.token);
      setMessage("✅ Login successful!");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "❌ Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-juicy-yellow to-juicy-yellow-light rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl">🧃</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Juicy Planet</h2>
          <p className="text-slate-600 mt-2">Admin Dashboard</p>
        </div>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl text-center text-slate-800">
              Sign In
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@juicyplanet.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border-gray-200 focus:bg-white"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin w-4 h-4" />}
                {loading ? "Processing..." : "Sign In"}
              </Button>

              {message && (
                <p
                  className={`text-center text-sm mt-3 transition-colors duration-300 ${
                    message.includes("success")
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
            <div className="mt-4 text-center">
              <a
                href="#"
                className="text-sm text-green-600 hover:text-green-700"
              >
                Forgot your password?
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
