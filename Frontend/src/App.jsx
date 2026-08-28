import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Pages
import Landing        from "./pages/Landing";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import CreateChallenge from "./pages/CreateChallenge";
import Journal        from "./pages/Journal";
import Journey        from "./pages/Journey";
import Archive        from "./pages/Archive";
import Goals          from "./pages/Goals";
import Profile        from "./pages/Profile";

function AppLayout({ children, showNav = true }) {
  return (
    <div className="min-h-screen flex flex-col">
      {showNav && <Navbar />}
      <main className="flex-grow">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public — no navbar */}
            <Route path="/" element={<Landing />} />
            <Route path="/login"    element={<AppLayout showNav={false}><Login /></AppLayout>} />
            <Route path="/register" element={<AppLayout showNav={false}><Register /></AppLayout>} />

            {/* Protected — with navbar */}
            <Route path="/create" element={
              <ProtectedRoute>
                <AppLayout><CreateChallenge /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/journal" element={
              <ProtectedRoute>
                <AppLayout><Journal /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/journal/:day" element={
              <ProtectedRoute>
                <AppLayout><Journal /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/journey" element={
              <ProtectedRoute>
                <AppLayout><Journey /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/archive" element={
              <ProtectedRoute>
                <AppLayout><Archive /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/goals" element={
              <ProtectedRoute>
                <AppLayout><Goals /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout><Profile /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
