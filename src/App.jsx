import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import SplashScreen from "./components/SplashScreen";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Public Pages
import Landing from "./pages/Landing";
import Technologies from "./pages/quiz/Technologies";
import SelectLevel from "./pages/quiz/SelectLevel";
import Quiz from "./pages/quiz/Quiz";
import Result from "./pages/quiz/Result";

// Dashboard
import DashboardLayout from "./layouts/DashboardLayout";
import UserDashboard from "./pages/dashboard/UserDashboard";
import Certificates from "./pages/certificates/Certificates";
import CertificateView from "./pages/certificates/CertificateView";
import Leaderboard from "./pages/leaderboard/Leaderboard";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";

function AppContent() {
    const { resolvedTheme } = useTheme();

    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/technologies" element={<Technologies />} />
                <Route path="/technologies/level" element={<SelectLevel />} />
                <Route path="/quiz/start" element={<Quiz />} />
                <Route path="/quiz/result" element={<Result />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/certificate/view" element={<CertificateView />} />

                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<UserDashboard />} />
                    <Route path="technologies" element={<Technologies />} />
                    <Route path="quizzes" element={<Technologies />} />
                    <Route path="certificates" element={<Certificates />} />
                    <Route path="leaderboard" element={<Leaderboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="admin" element={<AdminDashboard />} />
                </Route>
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                toastClassName="!rounded-xl !shadow-lg"
            />
        </AuthProvider>
    );
}

function App() {
    const [splashDone, setSplashDone] = useState(false);

    return (
        <ThemeProvider>
            {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
            {splashDone && <AppContent />}
        </ThemeProvider>
    );
}

export default App;
