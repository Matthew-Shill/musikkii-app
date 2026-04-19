import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router';

interface RestrictedAccessProps {
  pageName: string;
  allowedRoles?: string;
}

export function RestrictedAccess({ pageName, allowedRoles }: RestrictedAccessProps) {
  return (
    <div className="flex items-center justify-center p-8 py-24">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Access Restricted</h1>
        <p className="text-gray-600 mb-2">
          The {pageName} page is not available for your account type.
        </p>
        {allowedRoles && (
          <p className="text-sm text-gray-500 mb-6">
            Available to: {allowedRoles}
          </p>
        )}
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--musikkii-blue)' }}
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
