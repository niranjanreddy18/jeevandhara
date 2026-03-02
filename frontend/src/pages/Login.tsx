import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getSession, clearSession, isAnyUserLoggedIn, getLoggedInUserType } from "@/lib/auth";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("hospital");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentSession, setCurrentSession] = useState(getSession());

  useEffect(() => {
    const onSessionChange = (e: any) => {
      setCurrentSession(e.detail);
    };
    window.addEventListener('jh:session-changed', onSessionChange);
    return () => window.removeEventListener('jh:session-changed', onSessionChange);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "hospital") navigate("/hospital");
    else if (role === "university") navigate("/university");
    else if (role === "admin") navigate("/admin");
    else navigate("/");
  };

  const handleLogout = () => {
    clearSession();
    setCurrentSession(null);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="py-10">
      <div className="container max-w-md">
        <div className="bg-card rounded-xl border border-border p-6">
          <h1 className="text-lg font-semibold mb-4">Sign In</h1>
          
          {currentSession && (
            <div className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded-lg">
              <p className="text-sm text-accent font-medium">
                ✓ {currentSession.userType.charAt(0).toUpperCase() + currentSession.userType.slice(1)} logged in
              </p>
              <p className="text-xs text-accent/70 mt-1">ID: {currentSession.userId}</p>
              <Button size="sm" variant="outline" className="mt-2 w-full text-xs" onClick={handleLogout}>
                Logout & Switch Account
              </Button>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                disabled={isAnyUserLoggedIn()}
                className="w-full p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="hospital">Hospital</option>
                <option value="university">University</option>
                <option value="admin">Admin</option>
              </select>
              {isAnyUserLoggedIn() && (
                <p className="text-xs text-muted-foreground mt-1">Logout to switch roles</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={isAnyUserLoggedIn()}
                className="w-full p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed" 
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                disabled={isAnyUserLoggedIn()}
                className="w-full p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed" 
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isAnyUserLoggedIn()}>Sign In</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
