import api from "./api";

export const tarjetasService = {
  async getAll(search = "", estado = "") {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (estado) params.append("estado", estado);

      const response = await api.get(`/tarjetas?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener tarjetas";
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/tarjetas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener tarjeta";
    }
  },

  async create(data) {
    try {
      const response = await api.post("/tarjetas", data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al crear tarjeta";
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/tarjetas/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al actualizar tarjeta";
    }
  },

  async delete(id) {
    try {
      await api.delete(`/tarjetas/${id}`);
    } catch (error) {
      throw error.response?.data?.message || "Error al eliminar tarjeta";
    }
  },

  async mover(id, nuevaListaId, nuevoOrden) {
    try {
      await api.patch(`/tarjetas/${id}/mover`, { nuevaListaId, nuevoOrden });
    } catch (error) {
      throw error.response?.data?.message || "Error al mover tarjeta";
    }
  },
};
