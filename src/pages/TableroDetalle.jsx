import React, { useEffect, useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { tablerosService } from "../services/tablerosService";
import { tarjetasService } from "../services/tarjetasService";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import ListaForm from "../components/ListaForm";
import { ArrowLeft, Plus } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const TableroDetalle = () => {
  const [, params] = useRoute("/tableros/:id");
  const [, setLocation] = useLocation();
  const [tablero, setTablero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatingLista, setCreatingLista] = useState(false);
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
      setIsModalOpen(false);
      await loadTablero(params.id);
    } catch (err) {
      setError(err);
    } finally {
      setCreatingLista(false);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Si no hay destino o se soltó en el mismo lugar
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Crear una copia del tablero para actualizar localmente
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
        <DragDropContext onDragEnd={onDragEnd}>
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

                <Droppable droppableId={lista.id.toString()}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[100px] ${
                        snapshot.isDraggingOver ? "bg-gray-300" : ""
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
                                snapshot.isDragging ? "opacity-50" : ""
                              }`}
                            >
                              <Link href={`/tarjetas/${tarjeta.id}`}>
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
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {lista.tarjetas.length === 0 && (
                        <p className="text-center text-gray-500 text-sm py-4">
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
                  className="w-full bg-gray-200 hover:bg-gray-300 rounded-lg p-4 flex items-center justify-center text-gray-600 hover:text-gray-800 transition"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar Lista
                </button>
              </div>
            )}
          </div>
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
    </div>
  );
};

export default TableroDetalle;
