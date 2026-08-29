import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Загрузка...</div>;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export default PublicRoute;