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
        return "border-l-4 border-red-500 dark:border-red-400";
      case "Media":
        return "border-l-4 border-yellow-500 dark:border-yellow-400";
      case "Baja":
        return "border-l-4 border-green-500 dark:border-green-400";
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
      console.error("Error al mover tarjeta:", err);
      // Recargar el tablero si hay error
      loadTablero(params.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 shadow transition-colors duration-200">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => setLocation("/tableros")}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {tablero.titulo}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{tablero.descripcion}</p>
            </div>
            {user?.rol === "Admin" && (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar Lista
                </button>
                <Link href={`/admin/tarjetas/new?tableroId=${tablero.id}`}>
                  <a className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer">
                    <Plus className="w-4 h-4 mr-1" />
                    Nueva Tarjeta
                  </a>
                </Link>
              </div>
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
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex space-x-4 overflow-x-auto pb-4"
              >
                {tablero.listas.map((lista, listaIndex) => (
                  <Draggable
                    key={lista.id}
                    draggableId={`lista-${lista.id}`}
                    index={listaIndex}
                  >
                    {(providedLista, snapshotLista) => (
                      <div
                        ref={providedLista.innerRef}
                        {...providedLista.draggableProps}
                        className={`flex-shrink-0 w-80 ${
                          snapshotLista.isDragging ? "opacity-70" : ""
                        }`}
                      >
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 relative group transition-colors duration-200">
                          {/* Botón de eliminar lista - solo visible en hover y para Admin */}
                          {user?.rol === "Admin" && (
                            <button
                              onClick={(e) => handleDeleteClick(e, lista)}
                              className="absolute top-1 right-1 flex items-center gap-1 px-2 py-1 bg-red-500/90 hover:bg-red-600 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer"
                              title="Eliminar lista"
                            >
                              <X className="w-3 h-3" />
                              <span>Eliminar</span>
                            </button>
                          )}

                          <div
                            {...providedLista.dragHandleProps}
                            className="flex items-center justify-between mb-4 cursor-move"
                          >
                            <h2 className="font-bold text-gray-800 dark:text-gray-100">
                              {lista.titulo}
                            </h2>
                            <span className="bg-gray-400 dark:bg-gray-600 text-white px-2 py-1 rounded text-sm">
                              {lista.tarjetas.length}
                            </span>
                          </div>

                          <Droppable
                            droppableId={lista.id.toString()}
                            type="tarjeta"
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`space-y-3 min-h-[100px] ${
                                  snapshot.isDraggingOver ? "bg-gray-300 dark:bg-gray-600" : ""
                                } rounded p-2 transition-colors`}
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
                                          snapshot.isDragging
                                            ? "opacity-50"
                                            : ""
                                        }`}
                                      >
                                        <Link
                                          href={`/tarjetas/${tarjeta.id}?tableroId=${tablero.id}`}
                                        >
                                          <a
                                            className={`block bg-white dark:bg-gray-800 rounded shadow hover:shadow-md hover:-translate-y-1 transition-all duration-200 p-3 cursor-pointer ${getPrioridadColor(
                                              tarjeta.prioridad
                                            )}`}
                                          >
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                                              {tarjeta.titulo}
                                            </h3>
                                            {tarjeta.descripcion && (
                                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                                {tarjeta.descripcion}
                                              </p>
                                            )}
                                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                {tarjeta.prioridad}
                                              </span>
                                              {tarjeta.nombreAsignado && (
                                                <span>
                                                  {tarjeta.nombreAsignado}
                                                </span>
                                              )}
                                            </div>
                                          </a>
                                        </Link>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}

                                {lista.tarjetas.length === 0 && (
                                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                                    No hay tarjetas
                                  </p>
                                )}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
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
