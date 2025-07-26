
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
  EmployeesPage,
  ManagersPage,
  DepartmentsPage,
  LeavesPage,
  SalaryPage,
  UsersPage,
  GoalsPage,
  FeedbackPage,
  TeamPerformancePage,
  MyPerformancePage,
  LeaveRequestPage,
  AssessmentsPage,
  NotificationsPage,
  SettingsPage,
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
            <Route path="/hr/dashboard" element={<AppLayout allowedRoles={["hr"]}><HRDashboard /></AppLayout>} />
            <Route path="/hr/employees" element={<AppLayout allowedRoles={["hr"]}><EmployeesPage /></AppLayout>} />
            <Route path="/hr/managers" element={<AppLayout allowedRoles={["hr"]}><ManagersPage /></AppLayout>} />
            <Route path="/hr/departments" element={<AppLayout allowedRoles={["hr"]}><DepartmentsPage /></AppLayout>} />
            <Route path="/hr/leaves" element={<AppLayout allowedRoles={["hr"]}><LeavesPage /></AppLayout>} />
            <Route path="/hr/goals" element={<AppLayout allowedRoles={["hr"]}><GoalsPage /></AppLayout>} />
            <Route path="/hr/feedback" element={<AppLayout allowedRoles={["hr"]}><FeedbackPage /></AppLayout>} />
            <Route path="/hr/salary" element={<AppLayout allowedRoles={["hr"]}><SalaryPage /></AppLayout>} />
            <Route path="/hr/users" element={<AppLayout allowedRoles={["hr"]}><UsersPage /></AppLayout>} />
            <Route path="/hr/assessments" element={<AppLayout allowedRoles={["hr"]}><AssessmentsPage /></AppLayout>} />
            <Route path="/hr/team-performance" element={<AppLayout allowedRoles={["hr"]}><TeamPerformancePage /></AppLayout>} />
            <Route path="/hr/notifications" element={<AppLayout allowedRoles={["hr"]}><NotificationsPage /></AppLayout>} />
            <Route path="/hr/settings" element={<AppLayout allowedRoles={["hr"]}><SettingsPage /></AppLayout>} />
            
            {/* Manager routes */}
            <Route path="/manager/dashboard" element={<AppLayout allowedRoles={["manager"]}><ManagerDashboard /></AppLayout>} />
            <Route path="/manager/goals" element={<AppLayout allowedRoles={["manager"]}><GoalsPage /></AppLayout>} />
            <Route path="/manager/feedback" element={<AppLayout allowedRoles={["manager"]}><FeedbackPage /></AppLayout>} />
            <Route path="/manager/team-performance" element={<AppLayout allowedRoles={["manager"]}><TeamPerformancePage /></AppLayout>} />
            <Route path="/manager/my-performance" element={<AppLayout allowedRoles={["manager"]}><MyPerformancePage /></AppLayout>} />
            <Route path="/manager/leave-request" element={<AppLayout allowedRoles={["manager"]}><LeaveRequestPage /></AppLayout>} />
            <Route path="/manager/assessments" element={<AppLayout allowedRoles={["manager"]}><AssessmentsPage /></AppLayout>} />
            <Route path="/manager/notifications" element={<AppLayout allowedRoles={["manager"]}><NotificationsPage /></AppLayout>} />
            <Route path="/manager/settings" element={<AppLayout allowedRoles={["manager"]}><SettingsPage /></AppLayout>} />
            
            {/* Employee routes */}
            <Route path="/employee/dashboard" element={<AppLayout allowedRoles={["employee"]}><EmployeeDashboard /></AppLayout>} />
            <Route path="/employee/goals" element={<AppLayout allowedRoles={["employee"]}><GoalsPage /></AppLayout>} />
            <Route path="/employee/feedback" element={<AppLayout allowedRoles={["employee"]}><FeedbackPage /></AppLayout>} />
            <Route path="/employee/my-performance" element={<AppLayout allowedRoles={["employee"]}><MyPerformancePage /></AppLayout>} />
            <Route path="/employee/leave-request" element={<AppLayout allowedRoles={["employee"]}><LeaveRequestPage /></AppLayout>} />
            <Route path="/employee/assessments" element={<AppLayout allowedRoles={["employee"]}><AssessmentsPage /></AppLayout>} />
            <Route path="/employee/notifications" element={<AppLayout allowedRoles={["employee"]}><NotificationsPage /></AppLayout>} />
            <Route path="/employee/settings" element={<AppLayout allowedRoles={["employee"]}><SettingsPage /></AppLayout>} />
            
            {/* Wildcard redirect to not found page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
