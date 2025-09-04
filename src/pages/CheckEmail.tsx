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

    if (!storedEmail || !storedUserId) navigate("/register");

    setEmail(storedEmail || "");
    setUserId(storedUserId || "");
  }, [navigate]);

  const handleChange = (value: string, index: number) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1); // only last digit
      setOtp(newOtp);

      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  // Paste full OTP handler
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("").concat(Array(6).fill("")).slice(0, 6);
      setOtp(newOtp);
      // focus last non-empty input
      const lastFilled = newOtp.findIndex((digit) => digit === "");
      inputRefs.current[lastFilled === -1 ? 5 : lastFilled]?.focus();
    }
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const code = otp.join("");
      const res = await fetch(
        "https://juicy-backend.onrender.com/user/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp: code, email, user_id: userId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
          setError(data.message || "Invalid OTP. Try again.");
        } else {
          setVerified(true);
        
          // ✅ Hybrid flow support
          if (data.token && data.user) {
            // auto-login
            localStorage.setItem("token", data.token);
            localStorage.setItem("auth_user", JSON.stringify(data.user));
            setTimeout(() => navigate("/"), 2000);
          } else {
            // normal redirect to login
            setTimeout(() => navigate("/login"), 3000);
          }
        
          localStorage.removeItem("registeredEmail");
          localStorage.removeItem("registeredUserId");
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
      setCooldown(30);

      const res = await fetch(
        "https://juicy-backend.onrender.com/user/resend-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, email }),
        }
      );

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

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white to-juicy-yellow-light">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full text-center border-2 border-juicy-yellow"
      >
        {!verified ? (
          <>
            {/* Logo */}
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-juicy-yellow to-juicy-yellow-light flex items-center justify-center shadow-lg">
              <span className="text-4xl">🧃</span>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-juicy-green">
              Verify Your Account
            </h1>
            <p className="text-gray-600 mb-6">
              Enter the{" "}
              <span className="font-semibold text-juicy-yellow">6-digit OTP</span>{" "}
              sent to <strong>{email}</strong>
            </p>

            {error && (
              <p className="text-juicy-red mb-3 text-sm font-medium">{error}</p>
            )}

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
                    onPaste={handlePaste}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    className="w-12 h-14 text-center text-lg font-bold rounded-lg border-2 border-juicy-yellow focus:border-juicy-green focus:ring-2 focus:ring-juicy-green/50 outline-none transition-all"
                  />
                ))}
              </div>

              <Button
                type="submit"
                disabled={loading || otp.some((digit) => digit === "")}
                className="w-full bg-juicy-yellow hover:bg-juicy-yellow-light text-gray-800 font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>

            <div className="mt-6 text-sm text-gray-500">
              {cooldown > 0 ? (
                <p>⏳ You can resend in {cooldown}s</p>
              ) : (
                <button
                  disabled={resending}
                  onClick={handleResend}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-juicy-green text-white hover:bg-juicy-green/90 disabled:opacity-50 transition-all"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${resending ? "animate-spin" : ""}`}
                  />
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
            <CheckCircle className="text-juicy-green w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold text-juicy-green">
              OTP Verified!
            </h2>
            <p className="text-gray-600">Redirecting you to login...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default OTPVerification;
