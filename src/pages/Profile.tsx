import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Phone, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">Loading...</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
    <Header />
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        My Profile
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl p-6 space-y-4 border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-juicy-green" />
          <span className="text-gray-800 font-medium">{user?.username}</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-juicy-green" />
          <span className="text-gray-800">{user?.email}</span>
        </div>

        {user?.phone && (
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-juicy-green" />
            <span className="text-gray-800">{user?.phone}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-juicy-green" />
          <span className="text-gray-800">
            {user?.is_verified ? "Verified" : "Not Verified"}
          </span>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}
