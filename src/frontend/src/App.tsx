import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import AdmissionsPage from "./pages/AdmissionsPage";
import AttendancePage from "./pages/AttendancePage";
import DashboardPage from "./pages/DashboardPage";
import FeesPage from "./pages/FeesPage";
import LoginPage from "./pages/LoginPage";
import NewApplicationPage from "./pages/NewApplicationPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import SchedulePage from "./pages/SchedulePage";

const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  ),
});

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <Protected>
      <DashboardPage />
    </Protected>
  ),
});

const admissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admissions",
  component: () => (
    <Protected>
      <AdmissionsPage />
    </Protected>
  ),
});

const newApplicationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admissions/new",
  component: () => (
    <Protected>
      <NewApplicationPage />
    </Protected>
  ),
});

const studentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students",
  component: () => (
    <Protected>
      <PlaceholderPage
        title="Students"
        description="Manage student records, profiles, and academic progress."
      />
    </Protected>
  ),
});

const teachersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teachers",
  component: () => (
    <Protected>
      <PlaceholderPage
        title="Teachers"
        description="View teacher profiles, assignments, and performance."
      />
    </Protected>
  ),
});

const attendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/attendance",
  component: () => (
    <Protected>
      <AttendancePage />
    </Protected>
  ),
});

const feesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fees",
  component: () => (
    <Protected>
      <FeesPage />
    </Protected>
  ),
});

const examsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exams",
  component: () => (
    <Protected>
      <PlaceholderPage
        title="Exams"
        description="Schedule exams, enter grades, and generate report cards."
      />
    </Protected>
  ),
});

const scheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedule",
  component: () => (
    <Protected>
      <SchedulePage />
    </Protected>
  ),
});

const staffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staff",
  component: () => (
    <Protected>
      <PlaceholderPage
        title="Staff & HR"
        description="Manage staff records, payroll, and human resources."
      />
    </Protected>
  ),
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: () => (
    <Protected>
      <PlaceholderPage
        title="Reports & Analytics"
        description="Generate comprehensive reports and view school analytics."
      />
    </Protected>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <Protected>
      <PlaceholderPage
        title="Settings"
        description="Configure system preferences, user roles, and integrations."
      />
    </Protected>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  indexRoute,
  dashboardRoute,
  admissionsRoute,
  newApplicationRoute,
  studentsRoute,
  teachersRoute,
  attendanceRoute,
  feesRoute,
  examsRoute,
  scheduleRoute,
  staffRoute,
  reportsRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}
