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
import { useThemeStore } from "../store/themeStore";

const TableroDetalle = () => {
  const [, params] = useRoute("/tableros/:id");
  const [, setLocation] = useLocation();
  const [tablero, setTablero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatingLista, setCreatingLista] = useState(false);
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
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {tablero.listas.map((lista) => (
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
