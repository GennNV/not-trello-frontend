import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listaSchema } from "../schemas/tableroSchema";

const ListaForm = ({ onSubmit, onCancel, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(listaSchema),
    defaultValues: {
      titulo: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título de la lista *
        </label>
        <input
          type="text"
          {...register("titulo")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Por Hacer, En Progreso, Completado..."
          autoFocus
        />
        {errors.titulo && (
          <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Lista"}
        </button>
      </div>
    </form>
  );
};

export default ListaForm;
