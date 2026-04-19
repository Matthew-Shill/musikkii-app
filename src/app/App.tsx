import { RouterProvider } from 'react-router';
import { ErrorBoundary } from './components/error-boundary';
import { AuthSessionProvider } from './context/auth-session-context';
import { RoleProvider } from './context/role-context';
import { router } from './routes';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthSessionProvider>
        <RoleProvider>
          <RouterProvider router={router} />
        </RoleProvider>
      </AuthSessionProvider>
    </ErrorBoundary>
  );
}
