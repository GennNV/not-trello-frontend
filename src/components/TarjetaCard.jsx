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

  const isVencida =
    tarjeta.fechaVencimiento && new Date(tarjeta.fechaVencimiento) < new Date();

  return (
    <Link href={`/tarjetas/${tarjeta.id}`}>
      <a className="block bg-white rounded-lg shadow hover:shadow-lg transition p-4 border border-gray-200">
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

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {tarjeta.fechaVencimiento && (
              <div
                className={`flex items-center space-x-1 ${
                  isVencida ? "text-red-600" : ""
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(tarjeta.fechaVencimiento).toLocaleDateString()}
                </span>
                {isVencida && <AlertCircle className="w-3 h-3" />}
              </div>
            )}

            {tarjeta.nombreAsignado && (
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{tarjeta.nombreAsignado}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">{tarjeta.nombreLista}</span>
        </div>
      </a>
    </Link>
  );
};

export default TarjetaCard;
