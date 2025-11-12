import api from "./api";

export const tablerosService = {
  async getAll() {
    try {
      const response = await api.get("/tableros");

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener tableros";
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/tableros/${id}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener tablero";
    }
  },

  async create(data) {
    try {
      const response = await api.post("/tableros", data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al crear tablero";
    }
  },

  async createLista(tableroId, data) {
    try {
      const response = await api.post(`/tableros/${tableroId}/listas`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al crear lista";
    }
  },

  async delete(id) {
    try {
      await api.delete(`/tableros/${id}`);
      return true;
    } catch (error) {
      throw error.response?.data?.message || "Error al eliminar tablero";
    }
  },

  async reorderListas(tableroId, listaIds) {
    try {
      await api.patch(`/tableros/${tableroId}/listas/reorder`, {
        listaIds: listaIds,
      });
      return true;
    } catch (error) {
      throw error.response?.data?.message || "Error al reordenar listas";
    }
  },
};
