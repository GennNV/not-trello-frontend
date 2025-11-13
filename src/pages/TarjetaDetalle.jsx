import React, { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import toast from "react-hot-toast";
import { tarjetasService } from "../services/tarjetasService";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import { Calendar, User, Tag, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

const TarjetaDetalle = () => {
  const { darkMode } = useThemeStore();
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
        className="flex items-center mb-6 transition"
        style={{ color: 'rgb(37, 99, 235)' }}
        onMouseEnter={(e) => e.target.style.color = 'rgb(29, 78, 216)'}
        onMouseLeave={(e) => e.target.style.color = 'rgb(37, 99, 235)'}
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        {tableroId ? "Volver al tablero" : "Volver a tableros"}
      </button>

      <div 
        className="rounded-lg shadow-lg p-8"
        style={{
          backgroundColor: darkMode ? 'rgb(31, 41, 55)' : 'white'
        }}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)' }}>
              {tarjeta.titulo}
            </h1>
            <p style={{ color: darkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)' }}>
              En lista: {tarjeta.nombreLista}
            </p>
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
                  className="p-2 rounded transition"
                  style={{
                    color: 'rgb(37, 99, 235)',
                    backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'rgb(239, 246, 255)'
                  }}
                  title="Editar tarjeta"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 rounded transition"
                  style={{
                    color: 'rgb(220, 38, 38)',
                    backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'rgb(254, 242, 242)'
                  }}
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
            <h2 className="text-lg font-semibold mb-2" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)' }}>
              Descripción
            </h2>
            <p className="whitespace-pre-wrap" style={{ color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)' }}>
              {tarjeta.descripcion || "Sin descripción"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tarjeta.fechaVencimiento && (
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 mt-1" style={{ color: darkMode ? 'rgb(156, 163, 175)' : 'rgb(156, 163, 175)' }} />
                <div>
                  <h3 className="font-semibold" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)' }}>
                    Fecha de vencimiento
                  </h3>
                  <p style={{ color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)' }}>
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
                <User className="w-5 h-5 mt-1" style={{ color: darkMode ? 'rgb(156, 163, 175)' : 'rgb(156, 163, 175)' }} />
                <div>
                  <h3 className="font-semibold" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)' }}>Asignado a</h3>
                  <p style={{ color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)' }}>{tarjeta.nombreAsignado}</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <Tag className="w-5 h-5 mt-1" style={{ color: darkMode ? 'rgb(156, 163, 175)' : 'rgb(156, 163, 175)' }} />
              <div>
                <h3 className="font-semibold" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)' }}>Estado</h3>
                <p style={{ color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)' }}>
                  {tarjeta.estado === "Todo" && "Por Hacer"}
                  {tarjeta.estado === "InProgress" && "En Progreso"}
                  {tarjeta.estado === "Done" && "Completado"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 mt-1" style={{ color: darkMode ? 'rgb(156, 163, 175)' : 'rgb(156, 163, 175)' }} />
              <div>
                <h3 className="font-semibold" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)' }}>
                  Fecha de creación
                </h3>
                <p style={{ color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)' }}>
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
