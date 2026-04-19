import type { ComponentType } from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { ProtectedRoute } from "./components/protected-route";
import { DashboardPage } from "./components/pages/dashboard-page";
import { CalendarPage } from "./components/pages/calendar-page";
import { PracticePage } from "./components/pages/practice-page";
import { PracticeInsightsPage } from "./components/pages/practice-insights-page";
import { ProgressPage } from "./components/pages/progress-page";
import { MessagesPage } from "./components/pages/messages-page";
import { ResourcesPage } from "./components/pages/resources-page";
import { BillingPage } from "./components/pages/billing-page";
import { PayoutsPage } from "./components/pages/payouts-page";
import { SettingsPage } from "./components/pages/settings-page";
import { StudentsPage } from "./components/pages/students-page";
import { TeachersPage } from "./components/pages/teachers-page";
import { UsersPage } from "./components/pages/users-page";
import { OperationsPage } from "./components/pages/operations-page";
import { ReportsPage } from "./components/pages/reports-page";

// Helper to wrap components with ProtectedRoute
const withProtection = (Component: ComponentType) => {
  return () => (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage }, // Dashboard is accessible to all
      { path: "calendar", Component: withProtection(CalendarPage) },
      { path: "practice", Component: withProtection(PracticePage) },
      { path: "practice-insights", Component: withProtection(PracticeInsightsPage) },
      { path: "progress", Component: withProtection(ProgressPage) },
      { path: "messages", Component: withProtection(MessagesPage) },
      { path: "resources", Component: withProtection(ResourcesPage) },
      { path: "billing", Component: withProtection(BillingPage) },
      { path: "payouts", Component: withProtection(PayoutsPage) },
      { path: "settings", Component: withProtection(SettingsPage) },
      { path: "students", Component: withProtection(StudentsPage) },
      { path: "teachers", Component: withProtection(TeachersPage) },
      { path: "users", Component: withProtection(UsersPage) },
      { path: "operations", Component: withProtection(OperationsPage) },
      { path: "reports", Component: withProtection(ReportsPage) },
    ],
  },
]);