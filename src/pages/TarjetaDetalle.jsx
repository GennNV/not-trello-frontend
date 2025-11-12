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
  const { user } = useAuthStore();

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
      setLocation("/tableros");
    } catch (err) {
      toast.error("Error al eliminar la tarjeta");
    }
  };

  const handleEdit = () => {
    setLocation(`/admin/tarjetas/${tarjeta.id}/edit`);
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
        return "bg-red-500";
      case "Media":
        return "bg-yellow-500";
      case "Baja":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => setLocation("/tableros")}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver a tableros
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {tarjeta.titulo}
            </h1>
            <p className="text-gray-600">En lista: {tarjeta.nombreLista}</p>
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
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                  title="Editar tarjeta"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
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
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Descripción
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {tarjeta.descripcion || "Sin descripción"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tarjeta.fechaVencimiento && (
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Fecha de vencimiento
                  </h3>
                  <p className="text-gray-600">
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
                <User className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Asignado a</h3>
                  <p className="text-gray-600">{tarjeta.nombreAsignado}</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <Tag className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800">Estado</h3>
                <p className="text-gray-600">
                  {tarjeta.estado === "Todo" && "Por Hacer"}
                  {tarjeta.estado === "InProgress" && "En Progreso"}
                  {tarjeta.estado === "Done" && "Completado"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800">
                  Fecha de creación
                </h3>
                <p className="text-gray-600">
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
