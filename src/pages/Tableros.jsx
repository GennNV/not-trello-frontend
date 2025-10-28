import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { tablerosService } from "../services/tablerosService";
import { useTarjetasStore } from "../store/tarjetasStore";
import { useAuthStore } from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";
import TarjetaCard from "../components/TarjetaCard";
import Modal from "../components/Modal";
import TableroForm from "../components/TableroForm";
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const Tableros = () => {
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
      setIsModalOpen(false);
      await loadTableros();
    } catch (err) {
      setError(err);
    } finally {
      setCreatingTablero(false);
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
        <h1 className="text-3xl font-bold text-gray-800">Mis Tableros</h1>
        {user?.rol === "Admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Tablero
          </button>
        )}
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar tarjetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="mt-3 text-sm text-gray-600">
            Mostrando {tarjetasFiltradas.length} de {tarjetas.length} tarjetas
          </div>
        )}
      </div>

      {/* Grid de tableros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {tableros.map((tablero) => (
          <Link key={tablero.id} href={`/tableros/${tablero.id}`}>
            <a
              className="block bg-white rounded-lg shadow hover:shadow-xl transition p-6 border-l-4"
              style={{ borderLeftColor: tablero.color }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {tablero.titulo}
                  </h2>
                  <p className="text-sm text-gray-600">{tablero.descripcion}</p>
                </div>
                <div
                  className="w-12 h-12 rounded"
                  style={{ backgroundColor: tablero.color }}
                />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{tablero.listas.length} listas</span>
                <span>
                  {tablero.listas.reduce(
                    (acc, lista) => acc + lista.tarjetas.length,
                    0
                  )}{" "}
                  tarjetas
                </span>
              </div>
            </a>
          </Link>
        ))}
      </div>

      {/* Lista de tarjetas filtradas */}
      {tarjetasFiltradas.length > 0 && (
        <div>
          <section className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {searchTerm || estadoFilter
                ? "Resultados de búsqueda"
                : "Todas las Tarjetas"}
            </h2>
            <div className="flex items-center gap-3">
              {/* Botón de ordenamiento por fecha */}
              <button
                onClick={toggleSortOrder}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition ${
                  sortOrder
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
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
                  className="w-50 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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
          <p className="text-gray-500">
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
    </div>
  );
};

export default Tableros;
