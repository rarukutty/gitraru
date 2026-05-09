// ============================================================
// Recycling Guide Page — Tips for each waste category
// ============================================================

import { recyclingSuggestions } from "@/lib/recyclingData";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Lightbulb, ShieldAlert } from "lucide-react";

export default function RecyclingGuide() {
  const types = Object.values(recyclingSuggestions);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground animate-fade-up">♻️ Recycling Guide</h1>
      <p className="text-muted-foreground animate-fade-up-delay-1">Learn how to properly handle each waste type for a cleaner planet.</p>

      <div className="space-y-6">
        {types.map((s, i) => (
          <Card key={s.type} className={`glass-card animate-fade-up-delay-${Math.min(i + 1, 4)}`}>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">{s.icon}</span> {s.type} Waste
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Recycle className="h-4 w-4" />
                    <span className="font-medium text-sm">How to Recycle</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.recycle}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-accent">
                    <Lightbulb className="h-4 w-4" />
                    <span className="font-medium text-sm">DIY Reuse Ideas</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.diy}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <span className="font-medium text-sm">Safety Tips</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.safety}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
