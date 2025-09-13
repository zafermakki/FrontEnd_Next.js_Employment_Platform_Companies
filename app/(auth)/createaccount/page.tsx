"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

// أيقونات من MUI
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const CreateAccount = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: name, email, password }),
        }
      );

      if (response.ok) {
        localStorage.setItem("email", email);
        router.push("/verifycode");
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setErrorMessage("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-700 p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8">
          Create <span className="text-blue-300">Account</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-white/80 font-medium mb-1">
              Full Name
            </label>
            <div className="relative">
              <PersonIcon className="absolute left-3 top-3 text-white/70" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-white/80 font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <EmailIcon className="absolute left-3 top-3 text-white/70" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@mail.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white/80 font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-3 text-white/70" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-white/70 hover:text-white"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="p-3 bg-red-500/20 text-red-200 border border-red-400/50 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-white/70 text-sm mt-8">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-blue-300 hover:underline font-semibold"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;
