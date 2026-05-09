// ============================================================
// Register Page — Create a new user account
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Recycle } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refreshSession } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !confirm) { setError("All fields are required"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }
    const success = registerUser(username, password);
    if (!success) { setError("Username already exists"); return; }
    loginUser(username, password);
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
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground text-sm">Join EcoWaste AI today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" />
          </div>
          <Button type="submit" className="w-full eco-gradient text-primary-foreground hover:opacity-90">
            Register
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
