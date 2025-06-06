
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { ThemeProvider } from "./hooks/use-theme";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Profile from "./pages/Profile";
import ProjectDetails from "./components/ProjectDetails";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import ProjectFormPage from "./pages/ProjectFormPage";
import TaskFormPage from "./pages/TaskFormPage";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }
  
  return <>{children}</>;
};

// Public route that redirects to dashboard if logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/landing" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/" element={<Index />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/project/:projectId" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
      
      {/* New form routes */}
      <Route path="/projects/new" element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>} />
      <Route path="/projects/edit/:projectId" element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>} />
      <Route path="/tasks/new" element={<ProtectedRoute><TaskFormPage /></ProtectedRoute>} />
      <Route path="/project/:projectId/tasks/new" element={<ProtectedRoute><TaskFormPage /></ProtectedRoute>} />
      <Route path="/tasks/edit/:taskId" element={<ProtectedRoute><TaskFormPage /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <AppRoutes />
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
