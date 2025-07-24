import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle, RotateCw } from "lucide-react";
import { motion } from "framer-motion";

const VerifyEmail = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [retrying, setRetrying] = useState(false);
  const { token } = useParams(); // 👈 get token from path param like /verify-email/:token
  const navigate = useNavigate();
  const controllerRef = useRef<AbortController | null>(null);

  const playSound = (type: "success" | "error") => {
    const sound = new Audio(`/sounds/${type}.mp3`);
    sound.play().catch(() => {}); // Ignore if browser blocks autoplay
  };

  const verify = async () => {
    if (!token) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    setRetrying(true);

    controllerRef.current?.abort(); // Abort any previous requests
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetch(
        `http://localhost:4000/user/verify-email/${token}`, // 👈 token as path param
        { signal: controller.signal }
      );

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Verification success:", data);
        setStatus("success");
        playSound("success");
        setTimeout(() => navigate("/login"), 3500);
      } else {
        console.warn("❌ Verification failed:", data);
        setStatus("error");
        playSound("error");
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("🚨 Fetch error:", err);
        setStatus("error");
        playSound("error");
      }
    } finally {
      setRetrying(false);
    }
  };

  useEffect(() => {
    verify();
    return () => controllerRef.current?.abort(); // cleanup
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
      {status === "loading" && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 1.2 }}
        >
          <Loader2 className="w-14 h-14 text-blue-600 animate-spin" />
        </motion.div>
      )}

      {status === "success" && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 8 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          </motion.div>
          <motion.h2
            className="text-3xl font-bold text-green-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Email Verified Successfully!
          </motion.h2>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            You’ll be redirected to login shortly...
          </motion.p>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: [-8, 8, -6, 6, -4, 4, 0] }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <motion.h2
            className="text-2xl font-bold text-red-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Invalid or Expired Link
          </motion.h2>
          <motion.p
            className="text-gray-600 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Please try again or re-register.
          </motion.p>
          <motion.button
            onClick={verify}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
            disabled={retrying}
          >
            {retrying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <RotateCw className="w-4 h-4" />
                Retry
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default VerifyEmail;
