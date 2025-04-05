
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import QRGeneratorPage from "./pages/QRGeneratorPage";
import AttendancePage from "./pages/AttendancePage";
import FaceVerificationPage from "./pages/FaceVerificationPage";
import FaceAttendancePage from "./pages/FaceAttendancePage";
import MarkAttendancePage from "./pages/MarkAttendancePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import { StrictMode } from "react";
import { ThemeProvider } from "@/hooks/use-theme";

const queryClient = new QueryClient();

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/qr-generator" element={<QRGeneratorPage />} />
              <Route path="/attendance/:classId" element={<AttendancePage />} />
              <Route path="/face-verification/:classId" element={<FaceVerificationPage />} />
              <Route path="/face-attendance/:classId" element={<FaceAttendancePage />} />
              <Route path="/mark-attendance" element={<MarkAttendancePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
