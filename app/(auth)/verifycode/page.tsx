"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const VerifyCode = () => {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [email, setEmail] = useState<string>(""); // راح نخزّن الإيميل من localStorage
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const router = useRouter()     

  // اجلب الإيميل من localStorage عند تحميل الصفحة
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    const char = value.slice(0, 1);
    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // دالة الإرسال
  const handleSubmit = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      setMessage("Please enter the full 6-digit code.");
      return;
    }

    if (!email) {
      setMessage("No email found in localStorage!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/verifyCodeView/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          code: fullCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ " + data.message);
        setTimeout(() => router.push("/signin"), 1500);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setMessage("No email found in localStorage!");
      return;
    }

    setResending(true);
    setMessage("");

    try{
      const response = await fetch("http://127.0.0.1:8000/api/auth/resend-verification/", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({email}),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("✅ " + data.message);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("Server error, please try again.");
    } finally {
      setResending(false);
    }
  };

  
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 overflow-hidden">
    {/* خلفية مضيئة */}
    <div className="absolute w-80 h-80 bg-blue-400/30 rounded-full blur-3xl top-10 left-10"></div>
    <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl bottom-20 right-10"></div>

    {/* الكارد */}
    <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl px-10 py-12 flex flex-col items-center border border-white/20">
      <h1 className="text-3xl font-bold text-white mb-3">Verify Your Code</h1>
      <p className="text-blue-100 mb-7 text-center text-sm">
        Please enter the 6-digit code sent to <b>{email}</b>
      </p>

      {/* إدخال الكود */}
      <div className="flex justify-center gap-3 mb-7">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-14 rounded-lg border border-white/30 bg-white/10 text-white text-center text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 transform focus:scale-110"
            autoComplete="one-time-code"
            inputMode="numeric"
          />
        ))}
      </div>

      {/* زر التأكيد */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Confirm"}
      </button>

      {/* رسالة */}
      {message && (
        <p
          className={`mt-5 text-sm font-medium ${
            message.startsWith("✅") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      {/* إعادة إرسال */}
      <p className="mt-6 text-blue-100 text-sm">
        Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-white hover:underline font-medium disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend"}
          </button>
      </p>
    </div>
  </div>
  );
};

export default VerifyCode;
