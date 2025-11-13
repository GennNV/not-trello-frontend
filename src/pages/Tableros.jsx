import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import toast from "react-hot-toast";
import { tablerosService } from "../services/tablerosService";
import { useTarjetasStore } from "../store/tarjetasStore";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import LoadingSpinner from "../components/LoadingSpinner";
import TarjetaCard from "../components/TarjetaCard";
import Modal from "../components/Modal";
import TableroForm from "../components/TableroForm";
import ConfirmModal from "../components/ConfirmModal";
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";

const Tableros = () => {
  const { darkMode } = useThemeStore();
  const [tableros, setTableros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados locales para búsqueda y filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [sortOrder, setSortOrder] = useState(null); // null, 'asc', 'desc'

  // Estados para el modal de crear tablero
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatingTablero, setCreatingTablero] = useState(false);

  // Estados para el modal de eliminar tablero
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tableroToDelete, setTableroToDelete] = useState(null);

  const { tarjetas, setTarjetas } = useTarjetasStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadTableros();
  }, []);

  const loadTableros = async () => {
    try {
      setLoading(true);
      const data = await tablerosService.getAll();
      setTableros(data);

      // Extraer todas las tarjetas
      const allTarjetas = data.flatMap((tablero) =>
        tablero.listas.flatMap((lista) => lista.tarjetas)
      );
      setTarjetas(allTarjetas);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTablero = async (data) => {
    try {
      setCreatingTablero(true);
      await tablerosService.create(data);
      toast.success("Tablero creado correctamente");
      setIsModalOpen(false);
      await loadTableros();
    } catch (err) {
      toast.error("Error al crear el tablero");
      setError(err);
    } finally {
      setCreatingTablero(false);
    }
  };

  const handleDeleteClick = (e, tablero) => {
    e.preventDefault();
    e.stopPropagation();

    // Verificar si el tablero tiene listas
    if (tablero.listas && tablero.listas.length > 0) {
      toast.error(
        "No es posible eliminar un tablero con listas. Elimina primero todas las listas."
      );
      return;
    }

    setTableroToDelete(tablero);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tableroToDelete) return;

    try {
      await tablerosService.delete(tableroToDelete.id);
      toast.success("Tablero eliminado correctamente");
      await loadTableros();
    } catch (err) {
      toast.error("Error al eliminar el tablero");
      console.error(err);
    } finally {
      setTableroToDelete(null);
    }
  };

  const toggleSortOrder = () => {
    if (sortOrder === null) {
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder(null);
    }
  };

  // Filtrado y ordenamiento de tarjetas
  const tarjetasFiltradas = tarjetas
    .filter((tarjeta) => {
      const matchSearch =
        searchTerm === "" ||
        tarjeta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tarjeta.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEstado =
        estadoFilter === "" || tarjeta.estado === estadoFilter;

      return matchSearch && matchEstado;
    })
    .sort((a, b) => {
      if (sortOrder === null) return 0;

      const dateA = new Date(a.fechaCreacion);
      const dateB = new Date(b.fechaCreacion);

      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

  if (loading) return <LoadingSpinner message="Cargando tableros..." />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 
          className="text-3xl font-bold px-4 py-2 rounded-lg" 
          style={{ 
            color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)',
            backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(8px)'
          }}
        >
          Mis Tableros
        </h1>
        {user?.rol === "Admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 text-white rounded-lg transition"
            style={{
              backgroundColor: darkMode ? 'rgb(29, 78, 216)' : 'rgb(37, 99, 235)',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? 'rgb(37, 99, 235)' : 'rgb(29, 78, 216)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = darkMode ? 'rgb(29, 78, 216)' : 'rgb(37, 99, 235)'}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Tablero
          </button>
        )}
      </div>

      {/* Barra de búsqueda y filtros */}
      <div 
        className="rounded-lg shadow p-4 mb-6"
        style={{
          backgroundColor: darkMode ? 'rgb(31, 41, 55)' : 'white'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar tarjetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{
                  borderColor: darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
                  backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'white',
                  color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
                }}
              />
            </div>
          </div>

          <div>
            {/* <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">Todos los estados</option>
                <option value="Todo">Por Hacer</option>
                <option value="InProgress">En Progreso</option>
                <option value="Done">Completado</option>
              </select>
            </div> */}
          </div>
        </div>

        {(searchTerm || estadoFilter) && (
          <div className="mt-3 text-sm" style={{ color: darkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)' }}>
            Mostrando {tarjetasFiltradas.length} de {tarjetas.length} tarjetas
          </div>
        )}
      </div>

      {/* Grid de tableros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {tableros.map((tablero) => (
          <Link key={tablero.id} href={`/tableros/${tablero.id}`}>
            <div
              className="block rounded-lg shadow hover:shadow-xl transition p-6 border-l-4 cursor-pointer"
              style={{ 
                borderLeftColor: tablero.color,
                backgroundColor: darkMode ? 'rgb(31, 41, 55)' : 'white'
              }}
            >
              {/* Botón de eliminar - solo visible en hover y para Admin */}
              {user?.rol === "Admin" && (
                <button
                  onClick={(e) => handleDeleteClick(e, tablero)}
                  className="absolute top-0 left-0 flex items-center gap-1 px-3 py-1.5 bg-red-500/90 hover:bg-red-600 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer"
                  title="Eliminar tablero"
                >
                  <X className="w-3 h-3" />
                  <span>Eliminar</span>
                </button>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-1" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)' }}>
                    {tablero.titulo}
                  </h2>
                  <p className="text-sm" style={{ color: darkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)' }}>
                    {tablero.descripcion}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded"
                  style={{ backgroundColor: tablero.color }}
                />
              </div>

              <div className="flex items-center justify-between text-sm" style={{ color: darkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }}>
                <span>{tablero.listas.length} listas</span>
                <span>
                  {tablero.listas.reduce(
                    (acc, lista) => acc + lista.tarjetas.length,
                    0
                  )}{" "}
                  tarjetas
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Lista de tarjetas filtradas */}
      {tarjetasFiltradas.length > 0 && (
        <div>
          <section className="flex items-center justify-between mb-4">
            <h2 
              className="text-2xl font-bold mb-4 px-4 py-2 rounded-lg" 
              style={{ 
                color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)',
                backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(8px)'
              }}
            >
              {searchTerm || estadoFilter
                ? "Resultados de búsqueda"
                : "Todas las Tarjetas"}
            </h2>
            <div className="flex items-center gap-3">
              {/* Botón de ordenamiento por fecha */}
              <button
                onClick={toggleSortOrder}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg transition"
                style={{
                  backgroundColor: sortOrder
                    ? (darkMode ? 'rgb(30, 58, 138)' : 'rgb(239, 246, 255)')
                    : (darkMode ? 'rgb(31, 41, 55)' : 'white'),
                  borderColor: sortOrder
                    ? 'rgb(59, 130, 246)'
                    : (darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'),
                  color: sortOrder
                    ? (darkMode ? 'rgb(147, 197, 253)' : 'rgb(29, 78, 216)')
                    : (darkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)')
                }}
                onMouseEnter={(e) => {
                  if (!sortOrder) {
                    e.target.style.backgroundColor = darkMode ? 'rgb(55, 65, 81)' : 'rgb(249, 250, 251)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!sortOrder) {
                    e.target.style.backgroundColor = darkMode ? 'rgb(31, 41, 55)' : 'white';
                  }
                }}
                title={
                  sortOrder === "asc"
                    ? "Ordenar por fecha: Más antiguos primero"
                    : sortOrder === "desc"
                    ? "Ordenar por fecha: Más recientes primero"
                    : "Ordenar por fecha"
                }
              >
                {sortOrder === "asc" ? (
                  <ArrowUp className="w-5 h-5" />
                ) : sortOrder === "desc" ? (
                  <ArrowDown className="w-5 h-5" />
                ) : (
                  <ArrowUpDown className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {sortOrder === "asc"
                    ? "Más antiguos"
                    : sortOrder === "desc"
                    ? "Más recientes"
                    : "Ordenar por fecha"}
                </span>
              </button>

              {/* Filtro de estado */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  className="w-50 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  style={{
                    borderColor: darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
                    backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'white',
                    color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
                  }}
                >
                  <option value="">Todos los estados</option>
                  <option value="Todo">Por Hacer</option>
                  <option value="InProgress">En Progreso</option>
                  <option value="Done">Completado</option>
                </select>
              </div>
            </div>
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tarjetasFiltradas.map((tarjeta) => (
              <TarjetaCard key={tarjeta.id} tarjeta={tarjeta} />
            ))}
          </div>
        </div>
      )}

      {tarjetasFiltradas.length === 0 && (searchTerm || estadoFilter) && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No se encontraron tarjetas con los filtros aplicados
          </p>
        </div>
      )}

      {/* Modal para crear tablero */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Tablero"
      >
        <TableroForm
          onSubmit={handleCreateTablero}
          onCancel={() => setIsModalOpen(false)}
          loading={creatingTablero}
        />
      </Modal>

      {/* Modal de confirmación para eliminar tablero */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTableroToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Tablero"
        message={`¿Estás seguro de que deseas eliminar el tablero "${tableroToDelete?.titulo}"? Esta acción eliminará todas las listas y tarjetas asociadas y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Tableros;
