// ============================================================
// Rewards Page — Points, badges, and gamification
// ============================================================

import { getPoints, getBadge } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

const allBadges = [
  { name: "Eco Beginner", emoji: "🌱", range: "0–50 pts", min: 0, max: 50 },
  { name: "Eco Hero", emoji: "🌟", range: "51–200 pts", min: 51, max: 200 },
  { name: "Eco Master", emoji: "🏆", range: "200+ pts", min: 201, max: Infinity },
];

export default function Rewards() {
  const points = getPoints();
  const badge = getBadge(points);
  const progressPercent = badge.next === Infinity ? 100 : Math.min(100, ((points - badge.min) / (badge.next - badge.min)) * 100);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground animate-fade-up flex items-center gap-2">
        <Trophy className="h-6 w-6 text-primary" /> Rewards & Badges
      </h1>

      {/* Current status */}
      <Card className="glass-card animate-fade-up-delay-1">
        <CardContent className="p-6 text-center space-y-3">
          <p className="text-5xl">{badge.emoji}</p>
          <h2 className="text-2xl font-bold text-foreground">{badge.name}</h2>
          <p className="text-3xl font-bold text-primary">{points} pts</p>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {badge.next === Infinity ? "Max level reached!" : `${badge.next - points} pts to next badge`}
            </p>
            <Progress value={progressPercent} className="h-3 max-w-xs mx-auto" />
          </div>
        </CardContent>
      </Card>

      {/* All badge tiers */}
      <div className="grid gap-4 sm:grid-cols-3">
        {allBadges.map((b, i) => {
          const isActive = badge.name === b.name;
          return (
            <Card key={b.name} className={`glass-card animate-fade-up-delay-${Math.min(i + 2, 4)} ${isActive ? "ring-2 ring-primary" : "opacity-60"}`}>
              <CardContent className="p-5 text-center space-y-2">
                <p className="text-3xl">{b.emoji}</p>
                <h3 className="font-semibold text-foreground">{b.name}</h3>
                <p className="text-xs text-muted-foreground">{b.range}</p>
                {isActive && <p className="text-xs text-primary font-medium">✓ Current</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
