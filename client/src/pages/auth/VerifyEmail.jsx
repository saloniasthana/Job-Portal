import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Button from '../../components/ui/Button';
import { api, getErrorMessage } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function VerifyEmail() {
  const { token } = useParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');
  // The verification token is single-use; guard against React StrictMode's
  // double effect invocation in dev firing the request twice.
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    (async () => {
      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);
        localStorage.setItem('token', data.token);
        await refreshUser();
        setStatus('success');
      } catch (err) {
        setMessage(getErrorMessage(err));
        setStatus('error');
      }
    })();
  }, [token, refreshUser]);

  return (
    <AuthLayout title="Email verification">
      <div className="flex flex-col items-center text-center py-6">
        {status === 'loading' && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-brand-400" />
            <p className="mt-4 text-sm text-ink-300">Verifying your email…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="h-12 w-12 text-mint-500" />
            <p className="mt-4 text-sm text-ink-200">Your email is verified. You're all set.</p>
            <Button as={Link} to="/jobs" className="mt-6 w-full">
              Continue to Hirely
            </Button>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="h-12 w-12 text-coral-500" />
            <p className="mt-4 text-sm text-ink-200">{message}</p>
            <Button as={Link} to="/login" variant="secondary" className="mt-6 w-full">
              Back to login
            </Button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
