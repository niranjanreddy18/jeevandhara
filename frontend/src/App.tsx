import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import VerifiedCases from "./pages/VerifiedCases";
import HospitalPortal from "./pages/HospitalPortal";
import UniversityPortal from "./pages/UniversityPortal";
import AdminDashboard from "./pages/AdminDashboard";
import Transparency from "./pages/Transparency";
import CaseDetail from "./pages/CaseDetail";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
              <Route path="/cases" element={<VerifiedCases />} />
              <Route path="/cases/:id" element={<CaseDetail />} />
              <Route path="/hospital" element={<HospitalPortal />} />
              <Route path="/university" element={<UniversityPortal />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/transparency" element={<Transparency />} />
              <Route path="/login" element={<Login />} />
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
