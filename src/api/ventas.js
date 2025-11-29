import axios from "axios";

const API = "http://localhost:5000/api/ventas";

function authHeader() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };
}

// 🟢 Función para crear una venta
export function postVenta(venta) {
  return axios.post(`${API}`, venta, authHeader());
}

// 🟢 Función para crear un detalle de venta
export function postDetalleVenta(detalle) {
  return axios.post(`${API}/detalle`, detalle, authHeader());
}

// 🟢 Opcional: obtener todas las ventas
export function getVentas() {
  return axios.get(API, authHeader());
}

// 🟢 Opcional: obtener detalles de una venta
export function getDetallesVenta(venta_id) {
  return axios.get(`${API}/detalles/${venta_id}`, authHeader());
}

// 🟢 Función para actualizar una venta
export function updateVenta(id, data) {
  return axios.put(`${API}/${id}`, data, authHeader());
}


// 🟢 Función para descontar inventario
export function descontarStock(producto_id, cantidad) {
  return axios.put(`${API}/descontar-stock/${producto_id}`, { cantidad }, authHeader());
}

// 🟢 Crear corte de caja
export function postCorte(data) {
  return axios.post(`${API}/corte`, data, authHeader());
}

// 🟢 Obtener arqueo de caja
export function getArqueo(vendedor_id) {
  return axios.get(`${API}/arqueo?vendedor_id=${vendedor_id}`, authHeader());
}
