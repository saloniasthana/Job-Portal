import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import JobsBoard from './pages/candidate/JobsBoard';
import JobDetail from './pages/candidate/JobDetail';
import Profile from './pages/candidate/Profile';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import Companies from './pages/recruiter/Companies';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Terms from './pages/legal/Terms';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />

      {/* Browsing jobs doesn't require login — only applying/saving does */}
      <Route path="/jobs" element={<JobsBoard />} />
      <Route path="/jobs/:id" element={<JobDetail />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute role="candidate">
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter"
        element={
          <ProtectedRoute role="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/companies"
        element={
          <ProtectedRoute role="recruiter">
            <Companies />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
