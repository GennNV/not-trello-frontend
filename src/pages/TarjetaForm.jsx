import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useRoute } from "wouter";
import toast from "react-hot-toast";
import { tarjetasService } from "../services/tarjetasService";
import { tablerosService } from "../services/tablerosService";
import { tarjetaSchema } from "../schemas/tarjetaSchema";
import { Save, X } from "lucide-react";
import { useThemeStore } from "../store/themeStore";

const TarjetaForm = () => {
  const [, setLocation] = useLocation(); // Solo usamos setLocation para redirigir
  const [, params] = useRoute("/admin/tarjetas/:id/edit");
  const [loading, setLoading] = useState(false);
  const [listas, setListas] = useState([]);
  const [tableros, setTableros] = useState([]);
  const [selectedTableroId, setSelectedTableroId] = useState("");
  const [error, setError] = useState("");
  const [comesFromTablero, setComesFromTablero] = useState(false);
  const isEdit = !!params?.id;
  const { darkMode } = useThemeStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(tarjetaSchema),
  });

  useEffect(() => {
    // Uso window.location.search para obtener los query parameters porque wouter me lo rompia!!!!
    const urlParams = new URLSearchParams(window.location.search);
    const tableroId = urlParams.get("tableroId");

    console.log("🔍 URL completa:", window.location.href);
    console.log("🔍 Query string:", window.location.search);
    console.log("🔍 tableroId del query string:", tableroId);

    if (tableroId) {
      console.log("✅ Viene desde un tablero, ID:", tableroId);
      setSelectedTableroId(tableroId);
      setComesFromTablero(true); // Indica que viene desde un tablero específico
    } else {
      console.log("❌ No viene desde un tablero específico");
    }

    loadTableros();

    if (isEdit) {
      loadTarjeta(params.id);
    }
  }, []);

  useEffect(() => {
    if (selectedTableroId && tableros.length > 0) {
      filterListasByTablero(selectedTableroId);
    }
  }, [selectedTableroId, tableros]);

  const loadTableros = async () => {
    try {
      const data = await tablerosService.getAll();
      setTableros(data);

      // Si ya hay un tablero seleccionado, filtrar sus listas usando los datos recién cargados
      if (selectedTableroId) {
        const tablero = data.find(
          (t) => t.id.toString() === selectedTableroId.toString()
        );
        if (tablero) {
          const listasDelTablero = tablero.listas.map((l) => ({
            id: l.id,
            titulo: l.titulo,
          }));
          setListas(listasDelTablero);
        }
      }
    } catch (err) {
      // Error silencioso
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

      // Encontrar el tablero que contiene esta lista para preseleccionarlo
      if (tarjeta.tableroId) {
        setSelectedTableroId(tarjeta.tableroId.toString());
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
        toast.success("Tarjeta actualizada correctamente");
      } else {
        await tarjetasService.create(payload);
        toast.success("Tarjeta creada correctamente");
      }

      // Volver al tablero específico si venimos de uno, sino a la lista de tableros
      setLocation(
        selectedTableroId ? `/tableros/${selectedTableroId}` : "/tableros"
      );
    } catch (err) {
      toast.error(
        isEdit ? "Error al actualizar la tarjeta" : "Error al crear la tarjeta"
      );
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto rounded-lg shadow-lg p-8" style={{ backgroundColor: darkMode ? 'rgb(31, 41, 55)' : 'white' }}>
        <h1 className="text-3xl font-bold mb-6" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)' }}>
          {isEdit ? "Editar Tarjeta" : "Nueva Tarjeta"}
        </h1>

        {error && (
          <div className="mb-4 border px-4 py-3 rounded" style={{ 
            backgroundColor: darkMode ? 'rgb(127, 29, 29)' : 'rgb(254, 242, 242)',
            borderColor: darkMode ? 'rgb(185, 28, 28)' : 'rgb(254, 202, 202)',
            color: darkMode ? 'rgb(252, 165, 165)' : 'rgb(185, 28, 28)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)' }}>
              Título *
            </label>
            <input
              type="text"
              {...register("titulo")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.titulo ? "border-red-500" : ""
              }`}
              style={{
                backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'white',
                borderColor: errors.titulo ? 'rgb(239, 68, 68)' : (darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'),
                color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
              }}
              placeholder="Título de la tarjeta"
            />
            {errors.titulo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.titulo.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)' }}>
              Descripción
            </label>
            <textarea
              {...register("descripcion")}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.descripcion ? "border-red-500" : ""
              }`}
              style={{
                backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'white',
                borderColor: errors.descripcion ? 'rgb(239, 68, 68)' : (darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'),
                color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
              }}
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
              <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)' }}>
                Prioridad *
              </label>
              <select
                {...register("prioridad")}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.prioridad ? "border-red-500" : ""
                }`}
                style={{
                  backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'white',
                  borderColor: errors.prioridad ? 'rgb(239, 68, 68)' : (darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'),
                  color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
                }}
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
              <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)' }}>
                Lista *
              </label>
              <select
                {...register("listaId", { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.listaId ? "border-red-500" : ""
                }`}
                style={{
                  backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'white',
                  borderColor: errors.listaId ? 'rgb(239, 68, 68)' : (darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)'),
                  color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
                }}
              >
                <option value="">Seleccionar tablero</option>
                {tableros.map((tablero) => (
                  <option key={tablero.id} value={tablero.id}>
                    {tablero.titulo}
                  </option>
                ))}
              </select>
              {!selectedTableroId && !isEdit && (
                <p className="mt-1 text-sm text-gray-500">
                  Primero selecciona un tablero
                </p>
              )}
            </div>
          )}

          {/* Si viene desde un tablero, mostrar info del tablero */}
          {comesFromTablero && selectedTableroId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Tablero:</span>{" "}
                {tableros.find((t) => t.id.toString() === selectedTableroId)
                  ?.titulo || "Cargando..."}
              </p>
            </div>
          )}

          {/* Selector de Lista */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lista *
            </label>
            <select
              {...register("listaId", { valueAsNumber: true })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.listaId ? "border-red-500" : "border-gray-300"
              }`}
              disabled={!selectedTableroId || listas.length === 0}
            >
              <option value="">
                {selectedTableroId
                  ? listas.length === 0
                    ? "No hay listas en este tablero"
                    : "Seleccionar lista"
                  : "Primero selecciona un tablero"}
              </option>
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
            <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)' }}>
              Fecha de Vencimiento
            </label>
            <input
              type="date"
              {...register("fechaVencimiento")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'white',
                borderColor: darkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
                color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
              }}
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'rgb(37, 99, 235)', color: 'white' }}
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
              className="px-6 py-3 rounded-lg font-semibold transition flex items-center"
              style={{
                backgroundColor: darkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)'
              }}
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
