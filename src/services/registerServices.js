const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const registerService = {
  register: async (email, username, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data.message || "Error al registrarse";
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }
      throw "Error de conexión con el servidor";
    }
  },
  checkEmailExists: async (email) => {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/check-email?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error verificando email:", error);
      return false;
    }
  },

  checkUsernameExists: async (username) => {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/check-username?username=${encodeURIComponent(
          username
        )}`
      );
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error verificando username:", error);
      return false;
    }
  },
};