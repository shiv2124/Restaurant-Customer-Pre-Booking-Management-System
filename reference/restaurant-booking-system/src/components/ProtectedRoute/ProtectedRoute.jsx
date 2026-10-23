import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES, dashboardPathFor } from '../../constants/routes';

/**
 * Wraps a page that needs a signed-in user.
 *   <ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>
 *
 * - Not signed in           -> back to the login page.
 * - Signed in as other role -> sent to their own dashboard.
 */
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (role && user.userType !== role) {
    return <Navigate to={dashboardPathFor(user.userType)} replace />;
  }
  return children;
}
