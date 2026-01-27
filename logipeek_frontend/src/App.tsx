import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TelegramFloatingButton } from "@/components/TelegramFloatingButton";
import { LandingPage } from "./pages/LandingPage";
import Index from "./pages/Index";
import Login from "./pages/Login";
import RegisterWithVerification from "./pages/RegisterWithVerification";
import ForgotPassword from "./pages/ForgotPassword";
import Driver from "./pages/Driver";
import Shipper from "./pages/Shipper";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterWithVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected dashboard route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver"
              element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <Driver />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipper"
              element={
                <ProtectedRoute allowedRoles={['shipper']}>
                  <Shipper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Telegram Floating Button - appears on all pages */}
          <TelegramFloatingButton />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
