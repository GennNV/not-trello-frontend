import React from "react";
import { Link } from "wouter";
import { Calendar, User, AlertCircle } from "lucide-react";

const TarjetaCard = ({ tarjeta }) => {
  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case "Alta":
        return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300";
      case "Media":
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300";
      case "Baja":
        return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getEstadoBgColor = (estado) => {
    switch (estado) {
      case "Todo":
        return "bg-gray-100 dark:bg-gray-700";
      case "InProgress":
        return "bg-yellow-100 dark:bg-yellow-900/40";
      case "Done":
        return "bg-green-100 dark:bg-green-900/40";
      default:
        return "bg-gray-100 dark:bg-gray-700";
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case "Todo":
        return "Por Hacer";
      case "InProgress":
        return "En Progreso";
      case "Done":
        return "Completado";
      default:
        return estado;
    }
  };

  const isVencida =
    tarjeta.fechaVencimiento && new Date(tarjeta.fechaVencimiento) < new Date();

  return (
    <Link href={`/tarjetas/${tarjeta.id}`}>
      <div className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer">
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex-1">
              {tarjeta.titulo}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded ${getPrioridadColor(
                tarjeta.prioridad
              )}`}
            >
              {tarjeta.prioridad}
            </span>
          </div>

          {tarjeta.descripcion && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {tarjeta.descripcion}
            </p>
          )}

          <div className="flex flex-col space-y-2 text-xs text-gray-500 dark:text-gray-400">
            {/* Fecha de creación */}
            {tarjeta.fechaCreacion && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span className="font-medium">Creación:</span>
                <span>
                  {new Date(tarjeta.fechaCreacion).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Fecha de vencimiento */}
            {tarjeta.fechaVencimiento && (
              <div
                className={`flex items-center space-x-1 ${
                  isVencida ? "text-red-600" : ""
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span className="font-medium">Vencimiento:</span>
                <span>
                  {new Date(tarjeta.fechaVencimiento).toLocaleDateString()}
                </span>
                {isVencida && <AlertCircle className="w-3 h-3" />}
              </div>
            )}

            {/* Usuario asignado */}
            {tarjeta.nombreAsignado && (
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{tarjeta.nombreAsignado}</span>
              </div>
            )}
          </div>
        </div>

        <div
          className={`px-4 py-2 border-t border-gray-200 dark:border-gray-700 ${getEstadoBgColor(
            tarjeta.estado
          )}`}
        >
          <span className="text-xs text-gray-700 dark:text-gray-200 font-medium">
            {getEstadoTexto(tarjeta.estado)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TarjetaCard;
