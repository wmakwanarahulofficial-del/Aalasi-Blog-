import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/aalsi-admin-login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      return <Navigate to="/aalsi-admin-login" replace />;
    }
  } catch (e) {
    return <Navigate to="/aalsi-admin-login" replace />;
  }

  return <Outlet />;
}
