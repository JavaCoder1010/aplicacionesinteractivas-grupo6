import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ children, requireAdmin = false }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/login" replace />;

  if (requireAdmin && user.rol !== 'ADMIN') {
    return <Navigate to="/clientes" replace />;
  }

  return children;
}
