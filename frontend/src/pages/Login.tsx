import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("hospital");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple role-based redirect (replace with real auth later)
    if (role === "hospital") navigate("/hospital");
    else if (role === "university") navigate("/university");
    else if (role === "admin") navigate("/admin");
    else navigate("/");
  };

  return (
    <div className="py-10">
      <div className="container max-w-md">
        <div className="bg-card rounded-xl border border-border p-6">
          <h1 className="text-lg font-semibold mb-4">Sign In</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded">
                <option value="hospital">Hospital</option>
                <option value="university">University</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Sign In</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
