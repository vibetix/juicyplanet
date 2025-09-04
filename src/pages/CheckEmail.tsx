import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle } from "lucide-react";

const OTPVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("registeredEmail");
    const storedUserId = localStorage.getItem("registeredUserId");

    if (!storedEmail || !storedUserId) {
      navigate("/register");
      return;
    }

    setEmail(storedEmail);
    setUserId(storedUserId);
  }, [navigate]);

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const code = otp.join("");
      const res = await fetch("https://juicy-backend.onrender.com/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: code, email, user_id: userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP. Try again.");
      } else {
        setVerified(true);
        localStorage.removeItem("registeredEmail");
        localStorage.removeItem("registeredUserId");
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setCooldown(30); // 30s cooldown

      const res = await fetch("https://juicy-backend.onrender.com/user/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      alert("✅ OTP resent to your email/phone!");
    } catch (err: any) {
      console.error("❌ Resend failed:", err);
      alert(err.message);
    } finally {
      setResending(false);
    }
  };

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white to-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center"
      >
        {!verified ? (
          <>
            <h1 className="text-2xl font-bold mb-2">Verify Your Account</h1>
            <p className="text-gray-600 mb-6">
              Enter the <span className="font-semibold text-primary">6-digit OTP</span> sent to{" "}
              <strong>{email}</strong>
            </p>

            {error && (
              <p className="text-red-500 mb-3 text-sm font-medium">{error}</p>
            )}

            {/* OTP Inputs */}
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-between gap-2 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    className="w-12 h-14 text-center text-lg font-bold rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                  />
                ))}
              </div>

              <Button
                type="submit"
                disabled={loading || otp.some((digit) => digit === "")}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>

            {/* Resend */}
            <div className="mt-6 text-sm text-gray-500">
              {cooldown > 0 ? (
                <p>⏳ You can resend in {cooldown}s</p>
              ) : (
                <button
                  disabled={resending}
                  onClick={handleResend}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
                  {resending ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center"
          >
            <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold">OTP Verified!</h2>
            <p className="text-gray-600">Redirecting you to login...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default OTPVerification;
