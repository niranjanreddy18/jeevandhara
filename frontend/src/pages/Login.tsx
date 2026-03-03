import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, User, Mail, Lock, Phone, ArrowRight } from "lucide-react";
import {
  getSession,
  clearSession,
  setSession,
  logout,
  useAuthGuard,
} from "@/lib/auth";

// no Supabase or external OTP packages; manual API calls only

// Helper function to determine redirect URL based on user role
function getRedirectUrl(role: string): string {
  const normalized = role ? role.toUpperCase() : "";
  switch (normalized) {
    case "UNIVERSITY":
      return "/university";
    case "ADMIN":
      return "/admin";
    case "NORMAL_USER":
    default:
      return "/home"; // Home page for normal users
  }
}

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [currentSession, setCurrentSession] = useState(getSession());

  // Login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [verifyType, setVerifyType] = useState<"email" | "phone">("email");
  const [regPhone, setRegPhone] = useState("");
  const [regOTP, setRegOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    const onSessionChange = (e: any) => {
      setCurrentSession(e.detail);
    };
    window.addEventListener("jh:session-changed", onSessionChange);
    return () =>
      window.removeEventListener("jh:session-changed", onSessionChange);
  }, []);

  // LOGIN using Django backend API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginUsername.trim()) {
      setLoginError("Email required");
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError("Password required");
      return;
    }
    if (loginPassword.length < 6) {
      setLoginError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginUsername.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data.detail || data.message || "Invalid credentials";
        setLoginError("Login failed: " + msg);
        return;
      }

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("userRole", data.role);
      setSession(data.role.toLowerCase() as any, data.username);

      const redirectUrl = getRedirectUrl(data.role);
      navigate(redirectUrl);
    } catch (err: any) {
      console.error("Login error", err);
      setLoginError("Login error: " + (err.message || "Unknown error"));
    }
  };

  // Send OTP for registration
  const handleSendOTP = async () => {
    setRegError("");
    if (!regUsername.trim()) {
      setRegError("Username required");
      return;
    }
    if (!regEmail.trim()) {
      setRegError("Email required");
      return;
    }
    if (!regPassword.trim()) {
      setRegError("Password required");
      return;
    }
    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername.trim(),
          email: regEmail.trim(),
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegError(data.detail || data.message || "Failed to send OTP");
        return;
      }
      setOtpSent(true);
      setRegError("");
      console.log("OTP sent successfully");
    } catch (err: any) {
      setRegError(err.message || "Failed to send OTP");
    }
  };

  // Handle registration (verify OTP and login)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regOTP.trim()) {
      setRegError("OTP code required");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername.trim(),
          email: regEmail.trim(),
          otp: regOTP.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegError(data.detail || data.message || "OTP verification failed");
        return;
      }
      // auto-login after successful verification
      const loginRes = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail.trim(),
          password: regPassword,
        }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setRegError(loginData.detail || loginData.message || "Login failed");
        return;
      }
      localStorage.setItem("accessToken", loginData.access);
      localStorage.setItem("refreshToken", loginData.refresh);
      localStorage.setItem("userRole", loginData.role);
      setSession(loginData.role.toLowerCase() as any, loginData.username);

      const redirectUrl = getRedirectUrl(loginData.role);
      navigate(redirectUrl);
    } catch (err: any) {
      console.error(err);
      setRegError(err.message || "Registration error");
    }
  };

  if (currentSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
        <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full shadow-xl">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Welcome Back!
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              You are logged in as{" "}
              <span className="font-semibold text-foreground">
                {currentSession.userId}
              </span>
            </p>
            <div className="space-y-3">
              <Button
                className="w-full bg-accent text-accent-foreground"
                onClick={() => {
                  const redirectUrl = getRedirectUrl(
                    currentSession.userType || "user",
                  );
                  navigate(redirectUrl);
                }}
              >
                Go to{" "}
                {currentSession.userType === "university" ?
                  "University Panel"
                : currentSession.userType === "admin" ?
                  "Admin Panel"
                : "Home"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  clearSession();
                  setCurrentSession(null);
                  setLoginUsername("");
                  setLoginPassword("");
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
      <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">JeevanDhara</h1>
          <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">
            Verified Medical Funding
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6 bg-muted p-1 rounded-lg">
          <button
            onClick={() => {
              setMode("login");
              setLoginError("");
              setRegError("");
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-colors text-sm ${
              mode === "login" ?
                "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode("register");
              setLoginError("");
              setRegError("");
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-colors text-sm ${
              mode === "register" ?
                "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Register
          </button>
        </div>

        {/* LOGIN MODE */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-destructive">{loginError}</p>
              </div>
            )}

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground"
            >
              Sign In
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-accent font-semibold hover:underline"
              >
                Create one
              </button>
            </p>
          </form>
        )}

        {/* REGISTER MODE */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            {regSuccess && (
              <div className="p-3 bg-success/10 border border-success/30 rounded-lg">
                <p className="text-sm text-success font-medium">
                  ✓ Registration successful! Redirecting to login...
                </p>
              </div>
            )}

            {regError && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-destructive">{regError}</p>
              </div>
            )}

            <div>
              <Label htmlFor="reg-username">Username</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-username"
                  type="text"
                  placeholder="Choose a username"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  disabled={otpSent || regSuccess}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reg-email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="Enter email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  disabled={otpSent || regSuccess}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email/Phone Verification Toggle */}
            {!otpSent && (
              <div className="flex gap-2">
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="verify"
                    value="email"
                    checked={verifyType === "email"}
                    onChange={(e) =>
                      setVerifyType(e.target.value as "email" | "phone")
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-muted-foreground">
                    Verify via Email
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="verify"
                    value="phone"
                    checked={verifyType === "phone"}
                    onChange={(e) =>
                      setVerifyType(e.target.value as "email" | "phone")
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-muted-foreground">
                    Verify via Phone
                  </span>
                </label>
              </div>
            )}

            {/* Phone Field - Show based on verification type */}
            {verifyType === "phone" && !otpSent && (
              <div>
                <Label htmlFor="reg-phone">Phone Number</Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {/* OTP Section */}
            {otpSent && (
              <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
                <p className="text-sm text-accent font-medium mb-3">
                  Verification code sent to{" "}
                  {verifyType === "email" ? regEmail : regPhone}
                </p>
                <Input
                  type="text"
                  placeholder="Enter OTP (e.g., 1234)"
                  value={regOTP}
                  onChange={(e) => setRegOTP(e.target.value)}
                  maxLength={6}
                  className="text-center font-semibold tracking-widest"
                  disabled={regSuccess}
                />
              </div>
            )}

            {/* Password Fields */}
            <div>
              <Label htmlFor="reg-password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="Create password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  disabled={otpSent || regSuccess}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reg-confirm">Confirm Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-confirm"
                  type="password"
                  placeholder="Confirm password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  disabled={otpSent || regSuccess}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!otpSent ?
                <Button
                  type="button"
                  onClick={handleSendOTP}
                  variant="outline"
                  className="flex-1"
                  disabled={regSuccess}
                >
                  Send OTP
                </Button>
              : <Button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setRegOTP("");
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={regSuccess}
                >
                  Change
                </Button>
              }
              <Button
                type="submit"
                className="flex-1 bg-accent text-accent-foreground"
                disabled={!otpSent || regSuccess}
              >
                Create Account
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-accent font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
