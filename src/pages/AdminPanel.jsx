import React, { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, Layout, CheckSquare, TrendingUp } from "lucide-react";

const AdminPanel = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEstadisticas();
  }, []);

  const loadEstadisticas = async () => {
    try {
      setLoading(true);
      const data = await adminService.getEstadisticas();
      setEstadisticas(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Cargando estadísticas..." />;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>
    );
  if (!estadisticas) return null;

  const COLORS = {
    Todo: "#3B82F6",
    InProgress: "#F59E0B",
    Done: "#10B981",
    Baja: "#10B981",
    Media: "#F59E0B",
    Alta: "#EF4444",
  };

  const estadoData = estadisticas.tarjetasPorEstado.map((item) => ({
    ...item,
    nombre:
      item.estado === "Todo"
        ? "Por Hacer"
        : item.estado === "InProgress"
        ? "En Progreso"
        : "Completado",
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Panel de Administración
      </h1>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Usuarios</p>
              <p className="text-3xl font-bold text-gray-800">
                {estadisticas.totalUsuarios}
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Tableros</p>
              <p className="text-3xl font-bold text-gray-800">
                {estadisticas.totalTableros}
              </p>
            </div>
            <Layout className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Tarjetas</p>
              <p className="text-3xl font-bold text-gray-800">
                {estadisticas.totalTarjetas}
              </p>
            </div>
            <CheckSquare className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Tarjetas por Estado
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={estadoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Tarjetas por Prioridad
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={estadisticas.tarjetasPorPrioridad}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ prioridad, cantidad }) => `${prioridad}: ${cantidad}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {estadisticas.tarjetasPorPrioridad.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.prioridad]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
