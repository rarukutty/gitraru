// ============================================================
// App Root — Routes, auth provider, and layout
// ============================================================

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Detection from "@/pages/Detection";
import HistoryPage from "@/pages/HistoryPage";
import RecyclingGuide from "@/pages/RecyclingGuide";
import Rewards from "@/pages/Rewards";
import Analytics from "@/pages/Analytics";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
            <Route path="/detect" element={<ProtectedPage><Detection /></ProtectedPage>} />
            <Route path="/history" element={<ProtectedPage><HistoryPage /></ProtectedPage>} />
            <Route path="/recycling" element={<ProtectedPage><RecyclingGuide /></ProtectedPage>} />
            <Route path="/rewards" element={<ProtectedPage><Rewards /></ProtectedPage>} />
            <Route path="/analytics" element={<ProtectedPage><Analytics /></ProtectedPage>} />
            <Route path="/admin" element={<ProtectedPage><Admin /></ProtectedPage>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
