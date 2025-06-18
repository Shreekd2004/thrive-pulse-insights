
// Auth pages
export { default as LoginPage } from "./auth/LoginPage";
export { default as UnauthorizedPage } from "./auth/UnauthorizedPage";

// Dashboard pages
export { default as HRDashboard } from "./dashboard/HRDashboard";
export { default as ManagerDashboard } from "./dashboard/ManagerDashboard";
export { default as EmployeeDashboard } from "./dashboard/EmployeeDashboard";

// HR specific pages
export { default as EmployeesPage } from "./hr/EmployeesPage";
export { default as ManagersPage } from "./hr/ManagersPage";
export { default as DepartmentsPage } from "./hr/DepartmentsPage";
export { default as LeavesPage } from "./hr/LeavesPage";
export { default as SalaryPage } from "./hr/SalaryPage";
export { default as UsersPage } from "./hr/UsersPage";

// Shared pages (accessible by multiple roles)
export { default as GoalsPage } from "./shared/GoalsPage";
export { default as FeedbackPage } from "./shared/FeedbackPage";
export { default as TeamPerformancePage } from "./shared/TeamPerformancePage";
export { default as MyPerformancePage } from "./shared/MyPerformancePage";
export { default as LeaveRequestPage } from "./shared/LeaveRequestPage";
export { default as AssessmentsPage } from "./shared/AssessmentsPage";
export { default as NotificationsPage } from "./shared/NotificationsPage";
export { default as SettingsPage } from "./shared/SettingsPage";

// Page not found
export { default as NotFoundPage } from "./NotFound";
