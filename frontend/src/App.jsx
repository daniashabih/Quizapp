import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/dashboard/Home";
import SelectLanguage from "./pages/quiz/SelectLanguage";
import SelectLevel from "./pages/quiz/SelectLevel";
import Quiz from "./pages/quiz/Quiz";
import Result from "./pages/quiz/Result";
import UserDashboard from "./pages/dashboard/UserDashboard";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import MainLayout from "./layouts/MainLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";

function AppContent() {
  const { theme } = useTheme();

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="quiz" element={<SelectLanguage />} />
          <Route path="quiz/level" element={<SelectLevel />} />
          <Route path="quiz/start" element={<Quiz />} />
          <Route path="quiz/result" element={<Result />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={true}
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </AuthProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
