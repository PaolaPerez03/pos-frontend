import axios from "axios";

const API = "http://localhost:5000/api/vendedor/productos";

function authHeader() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };
}

// Obtener productos del vendedor
export function getProductsVendedor() {
  return axios.get(API, authHeader());
}

