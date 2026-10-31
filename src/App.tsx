import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/auth/AuthProvider";
import { AppAuthProvider, useAppAuth } from "@/context/AuthContext";
import { Navigation } from "@/components/Navigation";
import { AppLoader } from "@/components/AppLoader";
import { StudentPortal } from "@/pages/StudentPortal";
import { AdminCMS } from "@/pages/AdminCMS";
import { LoginPage } from "@/auth/LoginPage";
import { SignupPage } from "@/auth/SignupPage";
import { ProtectedRoute } from "@/auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30000, retry: 1 } },
});

function AppShell({ area }: { area?: "admin" | "student" }) {
  const { user, loading, isAdmin } = useAppAuth();

  if (loading) return <AppLoader label="Restoring your session" />;

  if (!user) return <Navigate to="/login" replace />;

  // Area guards: the admin console only renders for role = 'admin'.
  if (area === "admin" && !isAdmin) return <Navigate to="/" replace />;
  if (area === "student" && isAdmin) return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navigation />
      <main className="flex-1 overflow-y-auto">
        {(area === "admin" ? true : area === "student" ? false : isAdmin) ? (
          <AdminCMS />
        ) : (
          <StudentPortal />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppAuthProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/login"
                element={
                  <LoginPage
                    onSwitchToSignup={() => {
                      window.location.href = "/signup";
                    }}
                  />
                }
              />
              {/* Student self-signup only — no public admin registration. */}
              <Route
                path="/signup"
                element={
                  <SignupPage
                    onSwitchToLogin={() => {
                      window.location.href = "/login";
                    }}
                  />
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AppShell area="admin" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute>
                    <AppShell area="student" />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" richColors closeButton />
        </AppAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}