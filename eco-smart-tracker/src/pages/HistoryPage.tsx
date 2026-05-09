// ============================================================
// Waste History Page — Shows all past detections
// ============================================================

import { useState } from "react";
import { getDetections, clearDetections } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Trash2, History } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HistoryPage() {
  const [detections, setDetections] = useState(getDetections());

  const handleClear = () => {
    clearDetections();
    setDetections([]);
  };

  const badgeVariant = (type: string) => {
    if (type === "Wet") return "bg-eco-wet text-primary-foreground";
    if (type === "Dry") return "bg-eco-dry text-primary-foreground";
    return "bg-eco-hazardous text-primary-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <History className="h-6 w-6 text-primary" /> Detection History
        </h1>
        {detections.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently delete all detection records and reset your points.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClear}>Delete All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {detections.length === 0 ? (
        <Card className="glass-card animate-fade-up-delay-1">
          <CardContent className="p-10 text-center text-muted-foreground">
            <p className="text-lg">No detections yet</p>
            <p className="text-sm">Start scanning waste to build your history!</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card animate-fade-up-delay-1 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Waste Type</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detections.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="text-sm">{new Date(d.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={badgeVariant(d.wasteType)}>{d.wasteType}</Badge>
                  </TableCell>
                  <TableCell>{d.confidence}%</TableCell>
                  <TableCell className="text-primary font-medium">+{d.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
