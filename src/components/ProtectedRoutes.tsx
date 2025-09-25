// ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import { AuthContext } from './common/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.includes(auth.role)) {
    return <Outlet />;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;