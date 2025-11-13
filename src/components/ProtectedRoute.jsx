import { Redirect } from "wouter";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log(isAuthenticated)
  console.log(user)

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (adminOnly && user?.rol !== "Admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Acceso Denegado</p>
          <p>No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
