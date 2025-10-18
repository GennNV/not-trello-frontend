import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useRoute } from "wouter";
import { tarjetasService } from "../services/tarjetasService";
import { tablerosService } from "../services/tablerosService";
import { tarjetaSchema } from "../schemas/tarjetaSchema";
import { Save, X } from "lucide-react";

const TarjetaForm = () => {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/tarjetas/:id/edit");
  const [loading, setLoading] = useState(false);
  const [listas, setListas] = useState([]);
  const [error, setError] = useState("");
  const isEdit = !!params?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(tarjetaSchema),
  });

  useEffect(() => {
    loadListas();
    if (isEdit) {
      loadTarjeta(params.id);
    }
  }, []);

  const loadListas = async () => {
    try {
      const tableros = await tablerosService.getAll();
      const allListas = tableros.flatMap((t) =>
        t.listas.map((l) => ({ id: l.id, titulo: `${t.titulo} - ${l.titulo}` }))
      );
      setListas(allListas);
    } catch (err) {
      console.error("Error al cargar listas:", err);
    }
  };

  const loadTarjeta = async (id) => {
    try {
      const tarjeta = await tarjetasService.getById(id);
      setValue("titulo", tarjeta.titulo);
      setValue("descripcion", tarjeta.descripcion);
      setValue("prioridad", tarjeta.prioridad);
      setValue("listaId", tarjeta.listaId);
      if (tarjeta.fechaVencimiento) {
        setValue("fechaVencimiento", tarjeta.fechaVencimiento.split("T")[0]);
      }
      if (tarjeta.asignadoAId) {
        setValue("asignadoAId", tarjeta.asignadoAId);
      }
    } catch (err) {
      setError(err);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        titulo: data.titulo,
        descripcion: data.descripcion || "",
        prioridad: data.prioridad,
        listaId: parseInt(data.listaId),
        fechaVencimiento: data.fechaVencimiento || null,
        asignadoAId: data.asignadoAId ? parseInt(data.asignadoAId) : null,
      };

      if (isEdit) {
        await tarjetasService.update(params.id, payload);
      } else {
        await tarjetasService.create(payload);
      }

      setLocation("/tableros");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEdit ? "Editar Tarjeta" : "Nueva Tarjeta"}
        </h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              {...register("titulo")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.titulo ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Título de la tarjeta"
            />
            {errors.titulo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.titulo.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              {...register("descripcion")}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.descripcion ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Descripción detallada de la tarjeta"
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">
                {errors.descripcion.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad *
              </label>
              <select
                {...register("prioridad")}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.prioridad ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
              {errors.prioridad && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.prioridad.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lista *
              </label>
              <select
                {...register("listaId", { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.listaId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar lista</option>
                {listas.map((lista) => (
                  <option key={lista.id} value={lista.id}>
                    {lista.titulo}
                  </option>
                ))}
              </select>
              {errors.listaId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.listaId.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Vencimiento
            </label>
            <input
              type="date"
              {...register("fechaVencimiento")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading
                ? "Guardando..."
                : isEdit
                ? "Actualizar"
                : "Crear Tarjeta"}
            </button>

            <button
              type="button"
              onClick={() => setLocation("/tableros")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center"
            >
              <X className="w-5 h-5 mr-2" />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TarjetaForm;
