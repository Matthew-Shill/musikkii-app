import { useState, useEffect, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Logo } from '../shared/logo';

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate(from, { replace: true });
    });
  }, [configured, from, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!configured) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env');
      return;
    }
    setSubmitting(true);
    const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (signErr) {
      setError(signErr.message);
      return;
    }
    navigate(from, { replace: true });
  }

  if (!configured) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <Link to="/" className="mb-8">
          <Logo className="h-12" />
        </Link>
        <div className="max-w-md w-full bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <p className="text-gray-700 mb-4">
            Supabase environment variables are not set. The app runs in preview mode without remote auth.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-lg font-medium text-white"
            style={{ backgroundColor: 'var(--musikkii-blue)' }}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <Link to="/" className="mb-8">
        <Logo className="h-12" />
      </Link>
      <div className="max-w-md w-full bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Sign in</h1>
        <p className="text-sm text-gray-600 mb-6">Use your Musikkii account credentials.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg font-medium text-white disabled:opacity-60"
            style={{ backgroundColor: 'var(--musikkii-blue)' }}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Return to dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
