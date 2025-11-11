import api from "./api";

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("Response completa:", response.data);
      
      
      return {
        token: response.data.data.token,
        user: response.data.data.usuario
      };
    } catch (error) {
      throw error.response?.data?.message || "Error al iniciar sesión";
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get("/auth/me");
      
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al obtener usuario";
    }
  },
};