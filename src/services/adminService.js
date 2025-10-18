import api from "./api";

export const adminService = {
  async getEstadisticas() {
    try {
      const response = await api.get("/admin/estadisticas");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener estadísticas";
    }
  },
};
