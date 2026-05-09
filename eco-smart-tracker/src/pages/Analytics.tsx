// ============================================================
// Analytics Page — Charts for waste detection statistics
// ============================================================

import { getDetections } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart3 } from "lucide-react";

const COLORS: Record<string, string> = {
  Wet: "hsl(200, 70%, 50%)",
  Dry: "hsl(35, 80%, 55%)",
  Hazardous: "hsl(0, 72%, 51%)",
};

export default function Analytics() {
  const detections = getDetections();

  // Pie data
  const typeCounts: Record<string, number> = { Wet: 0, Dry: 0, Hazardous: 0 };
  detections.forEach((d) => typeCounts[d.wasteType]++);
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

  // Bar data — last 7 days
  const today = new Date();
  const barData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    const dayStr = date.toLocaleDateString("en-US", { weekday: "short" });
    const count = detections.filter((d) => {
      const dd = new Date(d.timestamp);
      return dd.toDateString() === date.toDateString();
    }).length;
    return { day: dayStr, count };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground animate-fade-up flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" /> Analytics Dashboard
      </h1>

      {detections.length === 0 ? (
        <Card className="glass-card animate-fade-up-delay-1">
          <CardContent className="p-10 text-center text-muted-foreground">
            <p>No data yet. Run some detections first!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pie Chart */}
          <Card className="glass-card animate-fade-up-delay-1">
            <CardContent className="p-5">
              <h2 className="font-semibold mb-4 text-foreground">Waste Type Breakdown</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="glass-card animate-fade-up-delay-2">
            <CardContent className="p-5">
              <h2 className="font-semibold mb-4 text-foreground">Weekly Detections</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData}>
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(142, 55%, 35%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="glass-card animate-fade-up-delay-3 lg:col-span-2">
            <CardContent className="p-5 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold" style={{ color: COLORS.Wet }}>{typeCounts.Wet}</p>
                <p className="text-xs text-muted-foreground">Wet Waste</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: COLORS.Dry }}>{typeCounts.Dry}</p>
                <p className="text-xs text-muted-foreground">Dry Waste</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: COLORS.Hazardous }}>{typeCounts.Hazardous}</p>
                <p className="text-xs text-muted-foreground">Hazardous Waste</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
