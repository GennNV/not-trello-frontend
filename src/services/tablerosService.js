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
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener tablero";
    }
  },
};
