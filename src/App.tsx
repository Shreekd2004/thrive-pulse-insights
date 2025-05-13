
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";

import {
  LoginPage,
  UnauthorizedPage,
  HRDashboard,
  ManagerDashboard,
  EmployeeDashboard,
  NotFoundPage
} from "@/pages";
import Index from "@/pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* HR routes */}
            <Route
              path="/hr/dashboard"
              element={
                <AppLayout allowedRoles={["hr"]}>
                  <HRDashboard />
                </AppLayout>
              }
            />
            
            {/* Manager routes */}
            <Route
              path="/manager/dashboard"
              element={
                <AppLayout allowedRoles={["manager"]}>
                  <ManagerDashboard />
                </AppLayout>
              }
            />
            
            {/* Employee routes */}
            <Route
              path="/employee/dashboard"
              element={
                <AppLayout allowedRoles={["employee"]}>
                  <EmployeeDashboard />
                </AppLayout>
              }
            />
            
            {/* Wildcard redirect to not found page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
