import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useRoute } from "wouter";
import toast from "react-hot-toast";
import { tarjetasService } from "../services/tarjetasService";
import { tablerosService } from "../services/tablerosService";
import { tarjetaSchema } from "../schemas/tarjetaSchema";
import { Save, X } from "lucide-react";

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
      console.error("Error al cargar tableros:", err);
    }
  };

  const filterListasByTablero = (tableroId) => {
    const tablero = tableros.find(
      (t) => t.id.toString() === tableroId.toString()
    );
    if (tablero) {
      const listasDelTablero = tablero.listas.map((l) => ({
        id: l.id,
        titulo: l.titulo,
      }));
      setListas(listasDelTablero);
    }
  };

  const handleTableroChange = (e) => {
    const tableroId = e.target.value;
    setSelectedTableroId(tableroId);

    if (tableroId) {
      filterListasByTablero(tableroId);
      // Limpiar la lista seleccionada cuando cambias de tablero
      setValue("listaId", "");
    } else {
      setListas([]);
      setValue("listaId", "");
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

      setLocation("/tableros");
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

          {/* Selector de Tablero - Solo si NO viene desde un tablero específico */}
          {!comesFromTablero && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tablero *
              </label>
              <select
                value={selectedTableroId}
                onChange={handleTableroChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isEdit}
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
              className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center cursor-pointer"
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
