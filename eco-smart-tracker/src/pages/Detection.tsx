// ============================================================
// AI Detection Page — Webcam + mock waste classification
// ============================================================

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { addDetection, DetectionResult } from "@/lib/storage";
import { recyclingSuggestions } from "@/lib/recyclingData";
import { Camera, StopCircle, Loader2, Recycle, Lightbulb, ShieldAlert } from "lucide-react";

const wasteTypes: Array<"Wet" | "Dry" | "Hazardous"> = ["Wet", "Dry", "Hazardous"];

export default function Detection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);

  // Start webcam
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setResult(null);
      }
    } catch {
      alert("Unable to access camera. Please allow camera permissions.");
    }
  }, []);

  // Stop webcam
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    streamRef.current = null;
    setIsStreaming(false);
  }, []);

  // Mock detection — simulate AI classification
  const runDetection = useCallback(() => {
    setIsDetecting(true);
    setTimeout(() => {
      const wasteType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
      const confidence = Math.round(70 + Math.random() * 28);
      const points = Math.round(confidence / 10);
      const detection: DetectionResult = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        wasteType,
        confidence,
        points,
      };
      addDetection(detection);
      setResult(detection);
      setIsDetecting(false);
    }, 1800);
  }, []);

  const suggestion = result ? recyclingSuggestions[result.wasteType] : null;

  const badgeColor = (type: string) => {
    if (type === "Wet") return "bg-eco-wet text-primary-foreground";
    if (type === "Dry") return "bg-eco-dry text-primary-foreground";
    return "bg-eco-hazardous text-primary-foreground";
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground animate-fade-up">🤖 AI Waste Detection</h1>

      {/* Camera area */}
      <Card className="glass-card overflow-hidden animate-fade-up-delay-1">
        <CardContent className="p-0 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full aspect-video bg-muted object-cover ${!isStreaming ? "hidden" : ""}`}
          />
          {!isStreaming && (
            <div className="w-full aspect-video bg-muted flex flex-col items-center justify-center gap-3">
              <Camera className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground">Camera is off</p>
            </div>
          )}
          {isDetecting && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="text-sm font-medium text-foreground">Analyzing waste...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex gap-3 justify-center animate-fade-up-delay-2">
        {!isStreaming ? (
          <Button onClick={startCamera} className="eco-gradient text-primary-foreground">
            <Camera className="mr-2 h-4 w-4" /> Start Camera
          </Button>
        ) : (
          <>
            <Button onClick={runDetection} disabled={isDetecting} className="eco-gradient text-primary-foreground">
              {isDetecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
              Detect Waste
            </Button>
            <Button onClick={stopCamera} variant="destructive">
              <StopCircle className="mr-2 h-4 w-4" /> Stop Camera
            </Button>
          </>
        )}
      </div>

      {/* Detection Result */}
      {result && (
        <Card className="glass-card animate-fade-up">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Detection Result</h2>
              <Badge className={badgeColor(result.wasteType)}>{result.wasteType} Waste</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Confidence: {result.confidence}%</p>
              <Progress value={result.confidence} className="h-3" />
            </div>
            <p className="text-sm text-primary font-medium">+{result.points} points earned! 🎉</p>
          </CardContent>
        </Card>
      )}

      {/* Recycling Suggestions */}
      {suggestion && (
        <div className="space-y-3 animate-fade-up-delay-1">
          <h2 className="text-lg font-semibold">♻️ Recycling Suggestions</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Recycle className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm">How to Recycle</span>
                </div>
                <p className="text-xs text-muted-foreground">{suggestion.recycle}</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  <span className="font-medium text-sm">DIY Reuse Ideas</span>
                </div>
                <p className="text-xs text-muted-foreground">{suggestion.diy}</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                  <span className="font-medium text-sm">Safety Tips</span>
                </div>
                <p className="text-xs text-muted-foreground">{suggestion.safety}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
