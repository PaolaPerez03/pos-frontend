import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Cambia esto a tu endpoint real

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // Devuelve token y datos del usuario
  } catch (error) {
    throw error.response?.data || { message: "Error al iniciar sesión" };
  }
};
