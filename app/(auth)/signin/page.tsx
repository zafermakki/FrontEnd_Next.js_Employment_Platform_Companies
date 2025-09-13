"use client";

import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);

        router.push("/dashbordpage");
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 overflow-hidden">
      {/* خلفية دوائر مضيئة */}
      <div className="absolute w-72 h-72 bg-blue-400/30 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl bottom-20 right-10"></div>

      {/* الكارد */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl px-10 py-12 flex flex-col items-center border border-white/20">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-lg mb-4">
            <Lock className="text-white text-3xl" fontSize="large" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-blue-100 text-sm">
            Sign in to continue to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
          {/* Email */}
          <TextField
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            autoComplete="email"
            placeholder="Email Address"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email className="text-blue-400" />
                </InputAdornment>
              ),
              style: {
                borderRadius: 12,
                color: "#fff",
              },
            }}
            inputProps={{
              style: { color: "#fff" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.4)",
                },
                "&:hover fieldset": {
                  borderColor: "#60a5fa",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3b82f6",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#fff",
              },
            }}
          />

          {/* Password */}
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            autoComplete="current-password"
            placeholder="Password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock className="text-blue-400" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <VisibilityOff className="text-gray-300" />
                    ) : (
                      <Visibility className="text-gray-300" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
              style: {
                borderRadius: 12,
                color: "#fff",
              },
            }}
            inputProps={{
              style: { color: "#fff" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.4)",
                },
                "&:hover fieldset": {
                  borderColor: "#60a5fa",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3b82f6",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#fff",
              },
            }}
          />

          {/* Error */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition text-lg disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Links */}
        <div className="w-full flex justify-between mt-8 text-sm">
          <a
            href="/resetpassword"
            className="hover:underline text-blue-200 hover:text-white"
          >
            Forgot password?
          </a>
          <a
            href="/createaccount"
            className="hover:underline text-blue-200 hover:text-white"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
