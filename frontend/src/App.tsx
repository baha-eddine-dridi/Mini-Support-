import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';

function ProtectedDashboard() {
  const { user } = useAuth();
  return user ? <DashboardPage /> : <Navigate to="/login" replace />;
}

function PublicAuth({ mode }: { mode: 'login' | 'register' }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <AuthPage mode={mode} />;
}

export default function App() {
  return <Layout><Routes><Route path="/" element={<ProtectedDashboard />} /><Route path="/login" element={<PublicAuth mode="login" />} /><Route path="/register" element={<PublicAuth mode="register" />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></Layout>;
}

