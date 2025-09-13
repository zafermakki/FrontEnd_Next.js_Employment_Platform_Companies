"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";


const ResetPassword = () => {
  const [step, setStep] = useState<"form" | "verify">("form");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();     


  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !newPassword) return;

    try {
      setLoading(true);
      setMessage("");

      const { data } = await axios.post("http://127.0.0.1:8000/api/auth/password-reset/", {
        email,
        new_password: newPassword,
      });

      setMessage("✅ " + data.message);
      setStep("verify");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage("❌ " + err.response.data.message);
      } else {
        setMessage("❌ Server error, please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    try {
      setLoading(true);
      setMessage("");

      const { data } = await axios.post("http://127.0.0.1:8000/api/auth/make-reset/", {
        email,
        code,
      });

      setMessage("✅ " + data.message);
      setTimeout(() => router.push("/signin"), 1500);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage("❌ " + err.response.data.message);
      } else {
        setMessage("❌ Server error, please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Reset Password
        </h2>
        <p className="text-blue-100 text-center text-sm mb-4">
          Please enter your email and new password. We’ll send you a verification code.
        </p>

        {message && (
          <p
            className={`text-center mb-4 text-sm font-medium ${
              message.startsWith("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.form
              key="form"
              onSubmit={handleSendCode}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-white mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </motion.button>
            </motion.form>
          )}

          {step === "verify" && (
            <motion.form
              key="verify"
              onSubmit={handleVerify}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {/* Disabled Email */}
              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white/70 cursor-not-allowed"
                />
              </div>

              {/* Disabled New Password */}
              <div>
                <label className="block text-white mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white/70 cursor-not-allowed"
                />
              </div>

              {/* Verification Code */}
              <div>
                <label className="block text-white mb-2">Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter the code"
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Reset Password"}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
