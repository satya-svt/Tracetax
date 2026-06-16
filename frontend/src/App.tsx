import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import RoleGate from "./pages/RoleGate";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import CollectorDashboard from "./pages/CollectorDashboard";
import FundManagerDashboard from "./pages/FundManagerDashboard";
import ACBDashboard from "./pages/ACBDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import PublicPortal from "./pages/PublicPortal";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { GlassTransparencyModal } from "./components/GlassTransparencyModal";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<RoleGate />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/collector" element={<CollectorDashboard />} />
        <Route path="/fund-manager" element={<FundManagerDashboard />} />
        <Route path="/acb" element={<ACBDashboard />} />
        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/public" element={<PublicPortal />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
        {/* Glass Transparency Button - appears on all pages */}
        <GlassTransparencyModal />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

