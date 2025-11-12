import React from "react";
import { Link } from "wouter";
import { Calendar, User, AlertCircle } from "lucide-react";
import { useThemeStore } from "../store/themeStore";

const TarjetaCard = ({ tarjeta }) => {
  const { darkMode } = useThemeStore();

  const getPrioridadStyle = (prioridad) => {
    const styles = {
      Alta: {
        backgroundColor: darkMode ? 'rgb(127, 29, 29)' : 'rgb(254, 226, 226)',
        color: darkMode ? 'rgb(254, 202, 202)' : 'rgb(153, 27, 27)'
      },
      Media: {
        backgroundColor: darkMode ? 'rgb(113, 63, 18)' : 'rgb(254, 249, 195)',
        color: darkMode ? 'rgb(254, 240, 138)' : 'rgb(133, 77, 14)'
      },
      Baja: {
        backgroundColor: darkMode ? 'rgb(20, 83, 45)' : 'rgb(220, 252, 231)',
        color: darkMode ? 'rgb(134, 239, 172)' : 'rgb(22, 101, 52)'
      },
      default: {
        backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'rgb(243, 244, 246)',
        color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
      }
    };
    return styles[prioridad] || styles.default;
  };

  const getEstadoBgStyle = (estado) => {
    const styles = {
      Todo: { backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'rgb(243, 244, 246)' },
      InProgress: { backgroundColor: darkMode ? 'rgb(113, 63, 18)' : 'rgb(254, 249, 195)' },
      Done: { backgroundColor: darkMode ? 'rgb(20, 83, 45)' : 'rgb(220, 252, 231)' },
    };
    return styles[estado] || styles.Todo;
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

  const cardStyle = {
    backgroundColor: darkMode ? 'rgb(31, 41, 55)' : 'white',
    borderColor: darkMode ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)',
    color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
  };

  return (
    <Link href={`/tarjetas/${tarjeta.id}`}>
      <div className="block rounded-lg shadow hover:shadow-lg transition border overflow-hidden cursor-pointer" style={cardStyle}>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold flex-1" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)' }}>
              {tarjeta.titulo}
            </h3>
            <span
              className="text-xs px-2 py-1 rounded"
              style={getPrioridadStyle(tarjeta.prioridad)}
            >
              {tarjeta.prioridad}
            </span>
          </div>

          {tarjeta.descripcion && (
            <p className="text-sm mb-3 line-clamp-2" style={{ color: darkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)' }}>
              {tarjeta.descripcion}
            </p>
          )}

          <div className="flex flex-col space-y-2 text-xs" style={{ color: darkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }}>
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
                className="flex items-center space-x-1"
                style={{
                  color: isVencida 
                    ? (darkMode ? 'rgb(248, 113, 113)' : 'rgb(220, 38, 38)')
                    : (darkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)')
                }}
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
          className="px-4 py-2 border-t" 
          style={{
            ...getEstadoBgStyle(tarjeta.estado),
            borderColor: darkMode ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)'
          }}
        >
          <span className="text-xs font-medium" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)' }}>
            {getEstadoTexto(tarjeta.estado)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TarjetaCard;
