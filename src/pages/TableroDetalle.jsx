import React, { useEffect, useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { tablerosService } from "../services/tablerosService";
import { tarjetasService } from "../services/tarjetasService";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import ListaForm from "../components/ListaForm";
import ConfirmModal from "../components/ConfirmModal";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

const TableroDetalle = () => {
  const [, params] = useRoute("/tableros/:id");
  const [, setLocation] = useLocation();
  const [tablero, setTablero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatingLista, setCreatingLista] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listaToDelete, setListaToDelete] = useState(null);
  const { user } = useAuthStore();
  const { darkMode } = useThemeStore();

  useEffect(() => {
    if (params?.id) {
      loadTablero(params.id);
    }
  }, [params?.id]);

  const loadTablero = async (id) => {
    try {
      setLoading(true);
      const data = await tablerosService.getById(id);

      // 🔍 DEBUG
      console.log("=== TABLERO CARGADO ===");
      console.log("Tablero completo:", data);
      console.log("Tiene listas?:", data.listas);
      console.log("Cantidad de listas:", data.listas?.length);
      if (data.listas?.length > 0) {
        console.log("Primera lista:", data.listas[0]);
        console.log("Tarjetas de primera lista:", data.listas[0].tarjetas);
      }
      console.log("=====================");
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

  const handleCreateLista = async (data) => {
    try {
      setCreatingLista(true);
      await tablerosService.createLista(params.id, data);
      toast.success("Lista creada correctamente");
      setIsModalOpen(false);
      await loadTablero(params.id);
    } catch (err) {
      toast.error("Error al crear la lista");
      setError(err);
    } finally {
      setCreatingLista(false);
    }
  };

  const handleDeleteClick = (e, lista) => {
    e.preventDefault();
    e.stopPropagation();

    // Verificar si la lista tiene tarjetas
    if (lista.tarjetas && lista.tarjetas.length > 0) {
      toast.error(
        "No es posible eliminar una lista con tarjetas. Elimina primero todas las tarjetas."
      );
      return;
    }

    setListaToDelete(lista);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!listaToDelete) return;

    try {
      await tablerosService.deleteLista(listaToDelete.id);
      toast.success("Lista eliminada correctamente");
      await loadTablero(params.id);
    } catch (err) {
      toast.error("Error al eliminar la lista");
      console.error(err);
    } finally {
      setListaToDelete(null);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId, type } = result;

    // Si no hay destino o se soltó en el mismo lugar
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Manejar drag and drop de LISTAS
    if (type === "lista") {
      const newTablero = { ...tablero };
      const listasReordenadas = Array.from(newTablero.listas);

      // Remover la lista de su posición original
      const [listaMovida] = listasReordenadas.splice(source.index, 1);

      // Insertar la lista en su nueva posición
      listasReordenadas.splice(destination.index, 0, listaMovida);

      // Actualizar el estado local inmediatamente para mejor UX
      setTablero({ ...newTablero, listas: listasReordenadas });

      // Enviar actualización al backend
      try {
        const listaIds = listasReordenadas.map((lista) => lista.id);
        await tablerosService.reorderListas(params.id, listaIds);
      } catch (err) {
        console.error("Error al reordenar listas:", err);
        // Si hay error, recargar el tablero para restaurar el orden original
        loadTablero(params.id);
      }

      return;
    }

    // Manejar drag and drop de TARJETAS (código original)
    const newTablero = { ...tablero };
    const sourceLista = newTablero.listas.find(
      (l) => l.id.toString() === source.droppableId
    );
    const destLista = newTablero.listas.find(
      (l) => l.id.toString() === destination.droppableId
    );

    if (!sourceLista || !destLista) return;

    // Remover la tarjeta de la lista origen
    const [movedTarjeta] = sourceLista.tarjetas.splice(source.index, 1);

    // Agregar la tarjeta a la lista destino
    destLista.tarjetas.splice(destination.index, 0, movedTarjeta);

    // Actualizar el estado local inmediatamente para mejor UX
    setTablero(newTablero);

    // Enviar actualización al backend
    try {
      await tarjetasService.mover(
        parseInt(draggableId),
        parseInt(destination.droppableId),
        destination.index
      );
    } catch (err) {
      // Recargar el tablero si hay error
      loadTablero(params.id);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: darkMode ? 'rgb(17, 24, 39)' : 'rgb(243, 244, 246)' }}>
      <div className="shadow" style={{ backgroundColor: darkMode ? 'rgb(31, 41, 55)' : 'white' }}>
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => setLocation("/tableros")}
            className="flex items-center mb-2"
            style={{ color: darkMode ? 'rgb(96, 165, 250)' : 'rgb(37, 99, 235)' }}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)' }}>
                {tablero.titulo}
              </h1>
              <p style={{ color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)' }}>{tablero.descripcion}</p>
            </div>
            {user?.rol === "Admin" && (
              <Link href="/admin/tarjetas/new">
                <div className="flex items-center px-4 py-2 rounded" style={{ backgroundColor: 'rgb(37, 99, 235)', color: 'white' }}>
                  <Plus className="w-4 h-4 mr-1" />
                  Nueva Tarjeta
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="all-listas"
            direction="horizontal"
            type="lista"
          >
            {(provided) => (
              <div
                key={lista.id}
                className="flex-shrink-0 w-80 rounded-lg p-4"
                style={{ backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)' }}>{lista.titulo}</h2>
                  <span className="px-2 py-1 rounded text-sm" style={{ backgroundColor: darkMode ? 'rgb(75, 85, 99)' : 'rgb(156, 163, 175)', color: 'white' }}>
                    {lista.tarjetas.length}
                  </span>
                </div>

                <Droppable droppableId={lista.id.toString()}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[100px] rounded p-2 transition-colors`}
                      style={{
                        backgroundColor: snapshot.isDraggingOver 
                          ? (darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)')
                          : 'transparent'
                      }}
                    >
                      {lista.tarjetas.map((tarjeta, index) => (
                        <Draggable
                          key={tarjeta.id}
                          draggableId={tarjeta.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${
                                snapshot.isDragging ? "opacity-50" : ""
                              }`}
                            >
                              <Link href={`/tarjetas/${tarjeta.id}`}>
                                <div
                                  className={`block rounded shadow hover:shadow-md transition p-3 ${getPrioridadColor(
                                    tarjeta.prioridad
                                  )}`}
                                  style={{ backgroundColor: darkMode ? 'rgb(31, 41, 55)' : 'white' }}
                                >
                                  <h3 className="font-semibold mb-1" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)' }}>
                                    {tarjeta.titulo}
                                  </h3>
                                  {tarjeta.descripcion && (
                                    <p className="text-sm line-clamp-2 mb-2" style={{ color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)' }}>
                                      {tarjeta.descripcion}
                                    </p>
                                  )}
                                  <div className="flex items-center justify-between text-xs" style={{ color: darkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }}>
                                    <span className="px-2 py-1 rounded" style={{ backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'rgb(243, 244, 246)' }}>
                                      {tarjeta.prioridad}
                                    </span>
                                    {tarjeta.nombreAsignado && (
                                      <span>{tarjeta.nombreAsignado}</span>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {lista.tarjetas.length === 0 && (
                        <p className="text-center text-sm py-4" style={{ color: darkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }}>
                          No hay tarjetas
                        </p>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}

            {/* Botón para agregar nueva lista */}
            {user?.rol === "Admin" && (
              <div className="flex-shrink-0 w-80">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full rounded-lg p-4 flex items-center justify-center transition"
                  style={{
                    backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)',
                    color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'
                  }}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar Lista
                </button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Modal para crear lista */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nueva Lista"
      >
        <ListaForm
          onSubmit={handleCreateLista}
          onCancel={() => setIsModalOpen(false)}
          loading={creatingLista}
        />
      </Modal>

      {/* Modal de confirmación para eliminar lista */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setListaToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Lista"
        message={`¿Estás seguro de que deseas eliminar la lista "${listaToDelete?.titulo}"? Esta acción eliminará todas las tarjetas contenidas en la lista y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default TableroDetalle;
