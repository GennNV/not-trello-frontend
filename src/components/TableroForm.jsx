import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tableroSchema } from "../schemas/tableroSchema";
import { useThemeStore } from "../store/themeStore";

const COLORES_PREDEFINIDOS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange
];

const TableroForm = ({ onSubmit, onCancel, loading }) => {
  const { darkMode } = useThemeStore();
  const [colorSeleccionado, setColorSeleccionado] = useState("#3B82F6");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(tableroSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      color: "#3B82F6",
    },
  });

  const handleColorChange = (color) => {
    setColorSeleccionado(color);
    setValue("color", color);
  };

  const onSubmitForm = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      {/* Título */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)' }}>
          Título *
        </label>
        <input
          type="text"
          {...register("titulo")}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Proyecto Frontend"
          style={{
            borderColor: darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
            backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'white',
            color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
          }}
        />
        {errors.titulo && (
          <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)' }}>
          Descripción
        </label>
        <textarea
          {...register("descripcion")}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe brevemente el tablero..."
          style={{
            borderColor: darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
            backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'white',
            color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
          }}
        />
        {errors.descripcion && (
          <p className="text-red-500 text-sm mt-1">
            {errors.descripcion.message}
          </p>
        )}
      </div>

      {/* Selector de color */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)' }}>
          Color del tablero
        </label>
        <div className="flex gap-2 flex-wrap">
          {COLORES_PREDEFINIDOS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorChange(color)}
              className={`w-10 h-10 rounded-lg transition-all ${
                colorSeleccionado === color
                  ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <input type="hidden" {...register("color")} />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border rounded-lg transition"
          disabled={loading}
          style={{
            borderColor: darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
            color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)',
            backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'white'
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Tablero"}
        </button>
      </div>
    </form>
  );
};

export default TableroForm;
