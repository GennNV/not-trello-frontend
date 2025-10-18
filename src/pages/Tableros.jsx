import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { tablerosService } from "../services/tablerosService";
import { useTarjetasStore } from "../store/tarjetasStore";
import LoadingSpinner from "../components/LoadingSpinner";
import TarjetaCard from "../components/TarjetaCard";
import { Search, Plus, Filter } from "lucide-react";

const Tableros = () => {
  const [tableros, setTableros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados locales para búsqueda y filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  const { tarjetas, setTarjetas } = useTarjetasStore();

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

  // Filtrado de tarjetas basado en búsqueda y estado
  const tarjetasFiltradas = tarjetas.filter((tarjeta) => {
    const matchSearch =
      searchTerm === "" ||
      tarjeta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarjeta.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchEstado = estadoFilter === "" || tarjeta.estado === estadoFilter;

    return matchSearch && matchEstado;
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
            <div className="relative">
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
            </div>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {searchTerm || estadoFilter
              ? "Resultados de búsqueda"
              : "Todas las Tarjetas"}
          </h2>
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
    </div>
  );
};

export default Tableros;
