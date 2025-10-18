import api from "./api";

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al iniciar sesión";
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener usuario";
    }
  },
};
