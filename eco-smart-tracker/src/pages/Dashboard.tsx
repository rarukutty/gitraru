// ============================================================
// Dashboard — Welcome + stats + quick actions
// ============================================================

import { useAuth } from "@/contexts/AuthContext";
import { getDetections, getPoints, getBadge } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Camera, History, Recycle, Trophy, BarChart3, Leaf } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const points = getPoints();
  const badge = getBadge(points);
  const detections = getDetections();

  const progressPercent = badge.next === Infinity ? 100 : Math.min(100, ((points - badge.min) / (badge.next - badge.min)) * 100);

  const quickActions = [
    { label: "Start AI Detection", icon: Camera, path: "/detect", color: "eco-gradient" },
    { label: "View History", icon: History, path: "/history", color: "bg-secondary" },
    { label: "Recycling Guide", icon: Recycle, path: "/recycling", color: "bg-secondary" },
    { label: "Rewards", icon: Trophy, path: "/rewards", color: "bg-secondary" },
    { label: "Analytics", icon: BarChart3, path: "/analytics", color: "bg-secondary" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="animate-fade-up">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          Welcome, {user?.username}!
        </h1>
        <p className="text-muted-foreground mt-1">Let's make the world cleaner together 🌍</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card animate-fade-up-delay-1">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Points</p>
            <p className="text-3xl font-bold text-primary">{points}</p>
          </CardContent>
        </Card>
        <Card className="glass-card animate-fade-up-delay-2">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Badge Level</p>
            <p className="text-2xl font-bold">{badge.emoji} {badge.name}</p>
            <Progress value={progressPercent} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card className="glass-card animate-fade-up-delay-3">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Detections</p>
            <p className="text-3xl font-bold text-accent">{detections.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-up-delay-4">
        <h2 className="text-lg font-semibold mb-3 text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className={`h-auto py-4 flex flex-col gap-2 glass-card hover:scale-105 transition-transform ${action.color === "eco-gradient" ? "eco-gradient text-primary-foreground border-0" : ""}`}
              onClick={() => navigate(action.path)}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
