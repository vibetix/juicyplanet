import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import supabase  from "@/lib/supabaseClient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema
const formSchema = z
  .object({
    username: z.string().min(3, "Username is too short"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone number is too short"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

const onSubmit = async (values: FormData) => {
  setLoading(true);

  try {
    const res = await fetch(`https://juicy-backend.onrender.com/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Something went wrong.");
    }

    // ✅ Extract email and user_id from the response
    const { email, user_id } = result;

    // ✅ Store the email
    // After successful registration
      localStorage.setItem("registeredEmail", email);
      localStorage.setItem("registeredUserId", user_id); // Add this

    // ✅ Send verification email
    await fetch("https://juicy-backend.onrender.com/user/send-verification-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, user_id }), // Now it's correctly passed
    });

    // ✅ Redirect
    navigate("/check-email", { state: { email } });

  } catch (err) {
    console.error("Registration failed:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 pt-[80px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm bg-white border border-juicy-yellow/20 shadow-md rounded-lg p-8 space-y-6"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-juicy-yellow to-juicy-yellow-light rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl">🧃</span>
            </div>
            <h2 className="text-xl font-raleway font-bold text-center text-juicy-green">
              Create Account
            </h2>
          </div>

          <Input
            placeholder="Username"
            {...register("username")}
            className="w-full border-juicy-yellow focus:ring-juicy-green focus:border-juicy-green"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}

          <Input
            placeholder="Email"
            type="email"
            {...register("email")}
            className="w-full border-juicy-yellow focus:ring-juicy-green focus:border-juicy-green"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <Input
            placeholder="Phone"
            {...register("phone")}
            className="w-full border-juicy-yellow focus:ring-juicy-green focus:border-juicy-green"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}

          {/* Password Field */}
          <div className="relative">
            <Input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="w-full border-juicy-yellow focus:ring-juicy-green focus:border-juicy-green pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <Input
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className="w-full border-juicy-yellow focus:ring-juicy-green focus:border-juicy-green pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-juicy-yellow hover:bg-juicy-yellow-light text-gray-800 font-quicksand font-semibold rounded-full shadow-md hover:shadow-lg"
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-juicy-green hover:underline">
              Log In
            </a>
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
