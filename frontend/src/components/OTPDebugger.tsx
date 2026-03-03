import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { sendEmailOTP } from "@/lib/emailOTP";
import { sendPhoneOTP } from "@/lib/phoneOTP";

/**
 * OTP Debugger Component
 *
 * Quick test to verify if email and phone OTP is working
 * Uses real Supabase OTP integration
 * Check browser console for detailed logs
 */

export default function OTPDebugger() {
  const [testEmail, setTestEmail] = useState("test@example.com");
  const [testPhone, setTestPhone] = useState("+1234567890");
  const [emailResult, setEmailResult] = useState<any>(null);
  const [phoneResult, setPhoneResult] = useState<any>(null);
  const [loading, setLoading] = useState<"email" | "phone" | null>(null);

  // Check if Supabase is properly initialized
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const hasCredentials =
    supabaseUrl && supabaseKey && supabaseUrl.startsWith("https");
  const isReady = hasCredentials && supabase;

  const testEmailOTP = async () => {
    setLoading("email");
    console.log("🔵 Testing Email OTP with:", testEmail);

    const result = await sendEmailOTP(testEmail);

    if (!result.success) {
      setEmailResult({
        status: "❌ FAILED",
        message: result.error,
      });
    } else {
      setEmailResult({
        status: "✅ SUCCESS",
        message: result.message,
        note: "Check your email inbox for magic link or code",
      });
    }
    setLoading(null);
  };

  const testPhoneOTP = async () => {
    setLoading("phone");
    console.log("🔵 Testing Phone OTP with:", testPhone);

    const result = await sendPhoneOTP(testPhone);

    if (!result.success) {
      setPhoneResult({
        status: "❌ FAILED",
        message: result.error,
      });
    } else {
      setPhoneResult({
        status: "✅ SUCCESS",
        message: result.message,
        note: "Check your phone for SMS with code",
      });
    }
    setLoading(null);
  };

  const checkSupabaseConfig = () => {
    console.log("🔍 Supabase Configuration:");
    console.log("URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log(
      "Key:",
      import.meta.env.VITE_SUPABASE_ANON_KEY ? "✅ SET" : "❌ NOT SET",
    );
    console.log("Client:", supabase ? "✅ INITIALIZED" : "❌ NOT INITIALIZED");
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 overflow-auto bg-slate-900 text-white rounded-lg shadow-2xl p-4 border border-slate-700 z-50">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-400">OTP Debugger</h3>

        {/* Status Indicator */}
        <div
          className={`p-3 rounded-lg text-sm font-medium ${
            isReady ?
              "bg-green-900 border border-green-700 text-green-200"
            : "bg-red-900 border border-red-700 text-red-200"
          }`}
        >
          {isReady ? "✅ Supabase Configured" : "❌ Supabase NOT Configured"}
          <p className="text-xs mt-1 opacity-80">
            {!hasCredentials &&
              "Missing: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"}
          </p>
        </div>

        {/* Config Check */}
        <button
          onClick={checkSupabaseConfig}
          className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
        >
          📋 Check Config
        </button>

        {/* Email Testing */}
        <div className="border-t border-slate-700 pt-4">
          <label className="block text-sm mb-2">📧 Email OTP Test</label>
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="w-full px-3 py-1 bg-slate-800 text-white rounded text-sm mb-2 border border-slate-600"
            placeholder="test@example.com"
          />
          <button
            onClick={testEmailOTP}
            disabled={loading === "email" || !isReady}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-sm font-medium"
          >
            {loading === "email" ? "Testing..." : "Test Email OTP"}
          </button>
          {emailResult && (
            <div
              className={`mt-2 p-3 rounded text-sm ${
                emailResult.status.includes("SUCCESS") ?
                  "bg-yellow-900 border border-yellow-700"
                : "bg-slate-800 border border-slate-600"
              }`}
            >
              <p className="font-bold">{emailResult.status}</p>
              <p className="text-slate-200 text-xs mt-1">
                {emailResult.message}
              </p>
              {emailResult.code && (
                <div className="mt-2 p-2 bg-black rounded">
                  <p className="text-xs text-gray-400">COPY & USE THIS CODE:</p>
                  <p className="text-center text-white font-mono text-lg font-bold tracking-widest">
                    {emailResult.code}
                  </p>
                </div>
              )}
              {emailResult.note && (
                <p className="text-xs text-yellow-300 mt-2">
                  {emailResult.note}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Phone Testing */}
        <div className="border-t border-slate-700 pt-4">
          <label className="block text-sm mb-2">📱 Phone OTP Test</label>
          <input
            type="tel"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            className="w-full px-3 py-1 bg-slate-800 text-white rounded text-sm mb-2 border border-slate-600"
            placeholder="+1234567890"
          />
          <button
            onClick={testPhoneOTP}
            disabled={loading === "phone" || !isReady}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-sm font-medium"
          >
            {loading === "phone" ? "Testing..." : "Test Phone OTP"}
          </button>
          {phoneResult && (
            <div
              className={`mt-2 p-3 rounded text-sm ${
                phoneResult.status.includes("SUCCESS") ?
                  "bg-yellow-900 border border-yellow-700"
                : "bg-slate-800 border border-slate-600"
              }`}
            >
              <p className="font-bold">{phoneResult.status}</p>
              <p className="text-slate-200 text-xs mt-1">
                {phoneResult.message}
              </p>
              {phoneResult.code && (
                <div className="mt-2 p-2 bg-black rounded">
                  <p className="text-xs text-gray-400">COPY & USE THIS CODE:</p>
                  <p className="text-center text-white font-mono text-lg font-bold tracking-widest">
                    {phoneResult.code}
                  </p>
                </div>
              )}
              {phoneResult.note && (
                <p className="text-xs text-yellow-300 mt-2">
                  {phoneResult.note}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="border-t border-slate-700 pt-4 text-xs text-slate-400">
          <p className="font-bold text-slate-300 mb-2">📖 Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Check Config" first</li>
            <li>Enter test email/phone</li>
            <li>Click test buttons</li>
            <li>Open DevTools Console (F12) to see detailed responses</li>
            <li>If error: check Supabase settings</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
