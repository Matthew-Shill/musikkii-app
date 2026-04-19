import { Link, Navigate, useLocation } from 'react-router';
import { useRole } from '../context/role-context';
import { useAuthSession } from '../context/auth-session-context';
import { hasRouteAccess } from '../config/route-permissions';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 *
 * Wraps page components to enforce role-based access control.
 * - If user has access: renders the page
 * - If user lacks access: shows access denied or redirects to dashboard
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { roleFamily } = useRole();
  const location = useLocation();
  const { isConfigured, session, loading } = useAuthSession();

  if (isConfigured && loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] px-4">
        <p className="text-sm text-gray-600">Loading session…</p>
      </div>
    );
  }

  if (isConfigured && !session) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  // Check if current role family has access to this route (UI preview role until wired to profile)
  const hasAccess = hasRouteAccess(roleFamily, location.pathname);

  if (!hasAccess) {
    // Option 1: Show access denied page (preferred for explicit feedback)
    return <AccessDenied />;

    // Option 2: Redirect to dashboard (alternative approach)
    // const redirectPath = getDefaultRedirect(roleFamily);
    // return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

/**
 * AccessDenied Component
 *
 * Displayed when a user attempts to access a route they don't have permission for.
 */
function AccessDenied() {
  const { roleFamily } = useRole();

  return (
    <div className="flex items-center justify-center p-8 py-24">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Access Restricted</h1>
        <p className="text-gray-600 mb-6">
          This page is not available for your account type. If you believe this is an error, please contact support.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--musikkii-blue)' }}
          >
            Go to Dashboard
          </Link>
          <Link
            to="/settings"
            className="px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Account Settings
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          Your role: <span className="font-medium capitalize">{roleFamily}</span>
        </p>
      </div>
    </div>
  );
}
