import axios from "axios";

const API = "http://localhost:5000/api/admin/vendedores";

function authHeader() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };
}

// Obtener todos los usuarios
export function getUsers() {
  return axios.get(API, authHeader());
}

// Crear usuario nuevo
export function addUser(user) {
  return axios.post(API, user, authHeader());
}

// Actualizar usuario
export function updateUser(id, user) {
  return axios.put(`${API}/${id}`, user, authHeader());
}

// Eliminar usuario
export function deleteUser(id) {
  return axios.delete(`${API}/${id}`, authHeader());
}
