import { RouterProvider } from 'react-router';
import { ErrorBoundary } from './components/error-boundary';
import { RoleProvider } from './context/role-context';
import { router } from './routes';

export default function App() {
  return (
    <ErrorBoundary>
      <RoleProvider>
        <RouterProvider router={router} />
      </RoleProvider>
    </ErrorBoundary>
  );
}
