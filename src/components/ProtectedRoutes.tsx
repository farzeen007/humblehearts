import { Navigate, Outlet } from 'react-router';
import { getRole, getToken } from './utils/tokens';

const ProtectedRoute = ({ allowedRoles }) => {
  const userRole = getRole()
  const token = getToken()

  if (!userRole || !token) {
    return <Navigate to="/signin" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;