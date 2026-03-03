import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import VerifiedCases from "./pages/VerifiedCases";
import UniversityPortal from "./pages/UniversityPortal";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import RegisterCase from "./pages/RegisterCase";
import Transparency from "./pages/Transparency";
import CaseDetail from "./pages/CaseDetail";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { getSession } from "./lib/auth";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const session = getSession();
  return session ? element : <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes - Redirect to Home if not logged in */}
              <Route
                path="/cases"
                element={<ProtectedRoute element={<VerifiedCases />} />}
              />
              <Route
                path="/cases/:id"
                element={<ProtectedRoute element={<CaseDetail />} />}
              />
              <Route
                path="/dashboard"
                element={<ProtectedRoute element={<Dashboard />} />}
              />
              <Route
                path="/register-case"
                element={<ProtectedRoute element={<RegisterCase />} />}
              />
              <Route
                path="/transparency"
                element={<ProtectedRoute element={<Transparency />} />}
              />

              {/* Role-specific Routes */}
              <Route
                path="/university/*"
                element={<ProtectedRoute element={<UniversityPortal />} />}
              />
              <Route
                path="/admin"
                element={<ProtectedRoute element={<AdminDashboard />} />}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
