import React, { useEffect, useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { tablerosService } from "../services/tablerosService";
import LoadingSpinner from "../components/LoadingSpinner";
import { ArrowLeft, Plus } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const TableroDetalle = () => {
  const [, params] = useRoute("/tableros/:id");
  const [, setLocation] = useLocation();
  const [tablero, setTablero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuthStore();

  useEffect(() => {
    if (params?.id) {
      loadTablero(params.id);
    }
  }, [params?.id]);

  const loadTablero = async (id) => {
    try {
      setLoading(true);
      const data = await tablerosService.getById(id);
      setTablero(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>
    );
  if (!tablero) return null;

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case "Alta":
        return "border-l-4 border-red-500";
      case "Media":
        return "border-l-4 border-yellow-500";
      case "Baja":
        return "border-l-4 border-green-500";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => setLocation("/tableros")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {tablero.titulo}
              </h1>
              <p className="text-gray-600">{tablero.descripcion}</p>
            </div>
            {user?.rol === "Admin" && (
              <Link href="/admin/tarjetas/new">
                <a className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-1" />
                  Nueva Tarjeta
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {tablero.listas.map((lista) => (
            <div
              key={lista.id}
              className="flex-shrink-0 w-80 bg-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">{lista.titulo}</h2>
                <span className="bg-gray-400 text-white px-2 py-1 rounded text-sm">
                  {lista.tarjetas.length}
                </span>
              </div>

              <div className="space-y-3">
                {lista.tarjetas.map((tarjeta) => (
                  <Link key={tarjeta.id} href={`/tarjetas/${tarjeta.id}`}>
                    <a
                      className={`block bg-white rounded shadow hover:shadow-md transition p-3 ${getPrioridadColor(
                        tarjeta.prioridad
                      )}`}
                    >
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {tarjeta.titulo}
                      </h3>
                      {tarjeta.descripcion && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {tarjeta.descripcion}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {tarjeta.prioridad}
                        </span>
                        {tarjeta.nombreAsignado && (
                          <span>{tarjeta.nombreAsignado}</span>
                        )}
                      </div>
                    </a>
                  </Link>
                ))}

                {lista.tarjetas.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-4">
                    No hay tarjetas
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableroDetalle;
