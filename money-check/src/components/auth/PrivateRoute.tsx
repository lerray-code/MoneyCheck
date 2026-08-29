import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Загрузка...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;