import React, { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import toast from "react-hot-toast";
import { tarjetasService } from "../services/tarjetasService";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import { Calendar, User, Tag, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const TarjetaDetalle = () => {
  const [, params] = useRoute("/tarjetas/:id");
  const [, setLocation] = useLocation();
  const [tarjeta, setTarjeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tableroId, setTableroId] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tableroIdParam = urlParams.get("tableroId");
    if (tableroIdParam) {
      setTableroId(tableroIdParam);
    }
  }, []);

  useEffect(() => {
    if (params?.id) {
      loadTarjeta(params.id);
    }
  }, [params?.id]);

  const loadTarjeta = async (id) => {
    try {
      setLoading(true);
      const data = await tarjetasService.getById(id);
      setTarjeta(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await tarjetasService.delete(tarjeta.id);
      toast.success("Tarjeta eliminada correctamente");
      // Volver al tablero específico si venimos de uno, sino a la lista de tableros
      setLocation(tableroId ? `/tableros/${tableroId}` : "/tableros");
    } catch (err) {
      toast.error("Error al eliminar la tarjeta");
      console.error(err);
    }
  };

  const handleEdit = () => {
    // Pasar el tableroId al formulario de edición para poder volver al tablero correcto
    const editUrl = tableroId
      ? `/admin/tarjetas/${tarjeta.id}/edit?tableroId=${tableroId}`
      : `/admin/tarjetas/${tarjeta.id}/edit`;
    setLocation(editUrl);
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>
    );
  if (!tarjeta) return null;

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case "Alta":
        return "bg-red-500 dark:bg-red-600";
      case "Media":
        return "bg-yellow-500 dark:bg-yellow-600";
      case "Baja":
        return "bg-green-500 dark:bg-green-600";
      default:
        return "bg-gray-500 dark:bg-gray-600";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() =>
          setLocation(tableroId ? `/tableros/${tableroId}` : "/tableros")
        }
        className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        {tableroId ? "Volver al tablero" : "Volver a tableros"}
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-200">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {tarjeta.titulo}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">En lista: {tarjeta.nombreLista}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-white text-sm ${getPrioridadColor(
                tarjeta.prioridad
              )}`}
            >
              {tarjeta.prioridad}
            </span>
            {user?.rol === "Admin" && (
              <>
                <button
                  onClick={handleEdit}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition cursor-pointer"
                  title="Editar tarjeta"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded transition cursor-pointer"
                  title="Eliminar tarjeta"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Descripción
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {tarjeta.descripcion || "Sin descripción"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tarjeta.fechaVencimiento && (
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    Fecha de vencimiento
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(tarjeta.fechaVencimiento).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            )}

            {tarjeta.nombreAsignado && (
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Asignado a</h3>
                  <p className="text-gray-600 dark:text-gray-400">{tarjeta.nombreAsignado}</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <Tag className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Estado</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {tarjeta.estado === "Todo" && "Por Hacer"}
                  {tarjeta.estado === "InProgress" && "En Progreso"}
                  {tarjeta.estado === "Done" && "Completado"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  Fecha de creación
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(tarjeta.fechaCreacion).toLocaleDateString("es-ES")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Eliminar tarjeta"
        message="¿Estás seguro de eliminar esta tarjeta? Esta acción no se puede deshacer."
        confirmText="Eliminar"
      />
    </div>
  );
};

export default TarjetaDetalle;
