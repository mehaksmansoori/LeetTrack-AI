import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

const App = () => {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--text-primary)]">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-[var(--text-secondary)] backdrop-blur">
          Preparing your LeetTrack AI workspace...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/" element={user ? <DashboardPage /> : <Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default App;
