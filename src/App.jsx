import React, { Suspense, lazy } from "react";
import { Route, Switch, Redirect } from "wouter";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Tableros from "./pages/Tableros";
import TarjetaForm from "./pages/TarjetaForm";

// Componentes cargados de forma perezosa (Lazy Loading)
const TarjetaDetalle = lazy(() => import("./pages/TarjetaDetalle"));
const TableroDetalle = lazy(() => import("./pages/TableroDetalle"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function App() {
  const { isAuthenticated, login } = useAuthStore();
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      login(JSON.parse(user), token);
    }
  }, [login]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navbar />

      <Suspense fallback={<LoadingSpinner message="Cargando página..." />}>
        <Switch>
          {/* Ruta pública */}
          <Route path="/login">
            {isAuthenticated ? <Redirect to="/tableros" /> : <Login />}
          </Route>

          {/* Ruta pública */}
          <Route path="/register">
            {isAuthenticated ? <Redirect to="/tableros" /> : <Register />}
          </Route>

          {/* Ruta home */}
          <Route path="/">
            {isAuthenticated ? <Redirect to="/tableros" /> : <Home />}
          </Route>

          {/* Rutas protegidas */}
          <Route path="/tableros">
            <ProtectedRoute>
              <Tableros />
            </ProtectedRoute>
          </Route>

          <Route path="/tableros/:id">
            <ProtectedRoute>
              <TableroDetalle />
            </ProtectedRoute>
          </Route>

          <Route path="/tarjetas/:id">
            <ProtectedRoute>
              <TarjetaDetalle />
            </ProtectedRoute>
          </Route>

          {/* Rutas de admin */}
          <Route path="/admin">
            <ProtectedRoute adminOnly>
              <AdminPanel />
            </ProtectedRoute>
          </Route>

          <Route path="/admin/tarjetas/new">
            <ProtectedRoute adminOnly>
              <TarjetaForm />
            </ProtectedRoute>
          </Route>

          <Route path="/admin/tarjetas/:id/edit">
            <ProtectedRoute adminOnly>
              <TarjetaForm />
            </ProtectedRoute>
          </Route>

          {/* Ruta 404 */}
          <Route>
            <div className="container mx-auto px-4 py-16 text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-600 mb-8">Página no encontrada</p>
              <a href="/" className="text-blue-600 hover:text-blue-800">
                Volver al inicio
              </a>
            </div>
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
