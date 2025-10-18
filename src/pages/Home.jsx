import React from "react";
import { Link } from "wouter";
import { CheckSquare, Users, BarChart3, Shield } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-4">TrelloClone</h1>
          <p className="text-xl mb-8">
            Gestiona tus proyectos de forma eficiente y colaborativa
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Comenzar Ahora
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <CheckSquare className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Organización
            </h3>
            <p className="text-gray-600">
              Organiza tus tareas en tableros visuales e intuitivos
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Users className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Colaboración
            </h3>
            <p className="text-gray-600">
              Trabaja en equipo y asigna tareas a diferentes miembros
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <BarChart3 className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Estadísticas
            </h3>
            <p className="text-gray-600">
              Visualiza el progreso de tus proyectos con métricas claras
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Shield className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Seguridad</h3>
            <p className="text-gray-600">
              Autenticación segura con roles y permisos diferenciados
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Características Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <ul className="space-y-2">
              <li>✅ Sistema de autenticación con JWT</li>
              <li>✅ Gestión de tableros y listas</li>
              <li>✅ Creación y edición de tarjetas</li>
              <li>✅ Asignación de tareas a usuarios</li>
            </ul>
            <ul className="space-y-2">
              <li>✅ Prioridades y fechas de vencimiento</li>
              <li>✅ Búsqueda y filtrado avanzado</li>
              <li>✅ Panel de administración con gráficos</li>
              <li>✅ Interfaz responsive y moderna</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
