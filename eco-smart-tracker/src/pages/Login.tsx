// ============================================================
// Login Page — Glassmorphism card with eco theme
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Recycle } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refreshSession } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { setError("All fields are required"); return; }
    const success = loginUser(username, password);
    if (!success) { setError("Invalid username or password"); return; }
    refreshSession();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center eco-gradient-subtle p-4">
      <div className="glass-card w-full max-w-md p-8 animate-fade-up">
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-2xl eco-gradient flex items-center justify-center mb-3">
            <Recycle className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Sign in to EcoWaste AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
          </div>
          <Button type="submit" className="w-full eco-gradient text-primary-foreground hover:opacity-90">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
