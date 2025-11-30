import axios from "axios";

const API = "http://localhost:5000/api/admin";

function authHeader() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
}

// 📅 Ventas por día
export function getVentasPorDia(fecha) {
  return axios.get(`${API}/ventas/dia/${fecha}`, authHeader());
}

// 📆 Ventas por mes
export function getVentasPorMes(anio, mes) {
  return axios.get(`${API}/ventas/mes/${anio}/${mes}`, authHeader());
}

// 🏆 Producto más vendido
export function getProductoMasVendido() {
  return axios.get(`${API}/producto-mas-vendido`, authHeader());
}