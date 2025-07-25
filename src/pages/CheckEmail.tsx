import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const CheckEmail = () => {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [checking, setChecking] = useState(true);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
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

    setChecking(true);
    setTimeoutReached(false);

    let retryCount = 0;
    const maxRetries = 24; // 2 minutes
    const interval = setInterval(async () => {
      retryCount++;

      try {
        const res = await axios.post("https://juicy-backend.onrender.com/user/check-verification", {
          email: storedEmail,
        });

        if (res.data?.verified) {
          clearInterval(interval);
          setVerified(true);
          localStorage.removeItem("registeredEmail");
          localStorage.removeItem("registeredUserId");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (err) {
        console.error("Verification check failed:", err);
      }

      if (retryCount >= maxRetries) {
        clearInterval(interval);
        setTimeoutReached(true);
        setChecking(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleResend = async () => {
    try {
      setResending(true);
      const res = await fetch("https://juicy-backend.onrender.com/user/resend-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          email: email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      alert("✅ Verification email resent!");
    } catch (err: any) {
      console.error("❌ Resend failed:", err);
      alert(err.message);
    } finally {
      setResending(false);
    }
  };

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
            <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
            <p className="text-gray-600 mb-4">
              We've sent a confirmation link to <strong>{email}</strong>.
            </p>

            {checking && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="animate-spin h-5 w-5 text-primary" />
                Waiting for confirmation...
              </div>
            )}

            {timeoutReached && (
              <div className="text-sm text-gray-500 mt-4">
                Taking longer than usual? Check your spam or click below to resend.
              </div>
            )}

            <button
              disabled={resending}
              onClick={handleResend}
              className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Resending..." : "Resend Verification Email"}
            </button>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center"
          >
            <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold">Email Verified!</h2>
            <p className="text-gray-600">Redirecting you to login...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CheckEmail;
