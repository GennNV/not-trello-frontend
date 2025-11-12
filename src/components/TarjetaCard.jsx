import React from "react";
import { Link } from "wouter";
import { Calendar, User, AlertCircle } from "lucide-react";

const TarjetaCard = ({ tarjeta }) => {
  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case "Alta":
        return "bg-red-100 text-red-800";
      case "Media":
        return "bg-yellow-100 text-yellow-800";
      case "Baja":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoBgColor = (estado) => {
    switch (estado) {
      case "Todo":
        return "bg-gray-100";
      case "InProgress":
        return "bg-yellow-100";
      case "Done":
        return "bg-green-100";
      default:
        return "bg-gray-100";
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
      <a className="block bg-white rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-gray-200 overflow-hidden cursor-pointer">
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-800 flex-1">
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
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {tarjeta.descripcion}
            </p>
          )}

          <div className="flex flex-col space-y-2 text-xs text-gray-500">
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
          className={`px-4 py-2 border-t border-gray-200 ${getEstadoBgColor(
            tarjeta.estado
          )}`}
        >
          <span className="text-xs text-gray-700 font-medium">
            {getEstadoTexto(tarjeta.estado)}
          </span>
        </div>
      </a>
    </Link>
  );
};

export default TarjetaCard;
