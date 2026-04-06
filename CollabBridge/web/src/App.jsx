import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './stores/useAuthStore';
import useSocket from './hooks/useSocket';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DiscoverPage from './pages/DiscoverPage';
import MatchesPage from './pages/MatchesPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import Spinner from './components/ui/Spinner';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/discover" replace />;
  return children;
}

function AppInitializer({ children }) {
  const { isAuthenticated, fetchUser, token } = useAuthStore();
  useSocket(); // Initialize socket connection

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, []);

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInitializer>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/project/:id" element={<ProjectPage />} />
          </Route>

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/discover" replace />} />
          <Route path="*" element={<Navigate to="/discover" replace />} />
        </Routes>
      </AppInitializer>
    </BrowserRouter>
  );
}
