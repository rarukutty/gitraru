// ============================================================
// Admin Panel — Simulated admin view with stats and reset
// ============================================================

import { getUsers, getDetections, resetAllData } from "@/lib/storage";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Camera, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [users] = useState(getUsers());
  const [detections] = useState(getDetections());
  const { logout } = useAuth();
  const navigate = useNavigate();

  const typeCounts: Record<string, number> = { Wet: 0, Dry: 0, Hazardous: 0 };
  detections.forEach((d) => typeCounts[d.wasteType]++);

  const handleReset = () => {
    resetAllData();
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground animate-fade-up flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" /> Admin Panel
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-card animate-fade-up-delay-1">
          <CardContent className="p-5 flex items-center gap-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Registered Users</p>
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card animate-fade-up-delay-2">
          <CardContent className="p-5 flex items-center gap-4">
            <Camera className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Total Detections</p>
              <p className="text-2xl font-bold text-foreground">{detections.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card animate-fade-up-delay-3">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-2">Waste Breakdown</p>
            <div className="space-y-1 text-sm">
              <p>💧 Wet: <span className="font-semibold">{typeCounts.Wet}</span></p>
              <p>📦 Dry: <span className="font-semibold">{typeCounts.Dry}</span></p>
              <p>☢️ Hazardous: <span className="font-semibold">{typeCounts.Hazardous}</span></p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="animate-fade-up-delay-4">
            <Trash2 className="mr-2 h-4 w-4" /> Reset All Data
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset all application data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all users, detections, points, and session data. You will be logged out.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>Reset Everything</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
