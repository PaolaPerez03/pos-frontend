<template>
  <div class="layout-container">

    <!-- NAVBAR FIJO -->
    <NavbarVendedor class="navbar-fijo" />

    <!-- CONTENIDO GENERAL -->
    <div class="content">

      <!-- 🟦 PANEL IZQUIERDO FIJO -->
      <div class="left-panel">
        <div class="search-wrapper">

          <!-- 🔍 BUSCADOR + AGREGAR -->
          <div class="search-section">

            <!-- Buscador -->
            <div class="search-box position-relative">
              <input
                type="text"
                class="form-control"
                placeholder="Buscar producto..."
                v-model="busqueda"
                @focus="mostrarLista = true"
                @keydown.tab.prevent="autocompletar"
                @keydown.enter.prevent="agregarSeleccionado"
              />

              <!-- Lista de sugerencias -->
              <ul
                v-if="mostrarLista && productosFiltrados.length > 0"
                class="list-group search-list"
              >
                <li
                  v-for="p in productosFiltrados"
                  :key="p.id"
                  class="list-group-item list-group-item-action"
                  @click="seleccionarProducto(p)"
                >
                  {{ p.codigo }} - {{ p.nombre }}
                </li>
              </ul>
            </div>

            <!-- Botón agregar -->
            <button
              class="btn btn-primary px-4"
              @click="agregarSeleccionado"
              :disabled="!productoSeleccionado"
            >
              Agregar
            </button>
          </div>

          <!-- 🔵 BOTON DE CORTE -->
          <div class="acciones-caja mt-3 d-flex justify-content-center gap-3">
            <button class="btn btn-info" @click="abrirCorte">Corte</button>
          </div>

        </div>
      </div>

      <!-- 🟥 PANEL DERECHO (CARRITO) -->
      <div class="cart-panel">

        <!-- ENCABEZADO FIJO -->
        <div class="cart-header">
          <h4 class="fw-bold mb-0">🛒 Tu Carrito</h4>
        </div>

        <!-- LISTA CON SCROLL -->
        <div class="cart-list">
          <div v-if="carrito.items.length === 0" class="text-muted text-center py-3">
            El carrito está vacío
          </div>

          <ul v-else class="list-unstyled">
            <li
              v-for="(item, i) in carrito.items"
              :key="i"
              class="cart-item"
            >
              <div>
                <strong>{{ item.nombre }}</strong>
                <div class="text-muted small">
                  ${{ item.precio }} c/u &middot;
                  Subtotal: ${{ item.precio * item.cantidad }}
                </div>
              </div>

              <div class="d-flex align-items-center gap-2">
                <span class="badge bg-primary rounded-pill">
                  x{{ item.cantidad }}
                </span>

                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="removerProducto(item.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </li>
          </ul>
        </div>

        <!-- PIE FIJO -->
        <div class="cart-footer">
          <div class="d-flex justify-content-between fw-bold mb-2">
            <span>Total:</span>
            <span>${{ carrito.total() }}</span>
          </div>

          <div class="d-flex justify-content-between mt-3">
            <button
              class="btn btn-outline-secondary btn-sm"
              @click="vaciarCarrito"
              :disabled="carrito.items.length === 0"
            >
              Vaciar
            </button>

            <button
              class="btn btn-success btn-sm"
              @click="abrirModalVenta"
              :disabled="carrito.items.length === 0"
            >
              Confirmar venta
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔴 MODAL CORTE -->
    <div v-if="mostrarModalCorte" class="modal-backdrop">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">

          <h5 class="modal-title mb-3">Corte de Caja</h5>

          <div><strong>Total ventas:</strong> ${{ corte.totalVentas }}</div>
          <div><strong>Total artículos:</strong> {{ corte.totalArticulos }}</div>
          <div><strong>Ventas en efectivo:</strong> ${{ corte.totalEfectivo }}</div>
          <div><strong>Ventas con tarjeta:</strong> ${{ corte.totalTarjeta }}</div>
          <div><strong>Número de ventas:</strong> {{ corte.numVentas }}</div>
          <div><strong>Desde:</strong> {{ corte.fechaInicio }}</div>
          <div><strong>Hasta:</strong> {{ corte.fechaFin }}</div>

          <div class="d-flex justify-content-end mt-3 gap-2">
            <button class="btn btn-primary" @click="crearCorte">Aceptar</button>
            <button class="btn btn-secondary" @click="cerrarCorte">Cerrar</button>
          </div>

        </div>
      </div>
    </div>

    <!-- MODAL CONFIRMACIÓN DE VENTA -->
    <div v-if="mostrarModalVenta" class="modal-backdrop">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">

          <h5 class="modal-title mb-3">Confirmar Venta</h5>

          <div class="mb-2">
            <strong>Total a pagar:</strong>
            ${{ carrito.total() }}
          </div>

          <div class="mb-2">
            <label>Método de pago:</label>
            <select v-model="metodoPago" class="form-select">
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          <div v-if="metodoPago === 'efectivo'" class="mb-2">
            <label>Recibo:</label>
            <input type="number" v-model.number="recibo" class="form-control" />
            <small>Cambio: ${{ calcularCambio() }}</small>
          </div>

          <div class="d-flex justify-content-end mt-3 gap-2">
            <button class="btn btn-secondary" @click="cerrarModalVenta">
              Cancelar
            </button>
            <button class="btn btn-primary" @click="aceptarVenta">
              Aceptar
            </button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import NavbarVendedor from "../components/NavbarVendedor.vue";
import { getProductsVendedor } from "../api/productsVendedor.js";
import { carrito } from "../store/carrito.js";
import { postVenta, postDetalleVenta, descontarStock, postCorte, getArqueo } from "../api/ventas.js";

export default {
  components: { NavbarVendedor },

  data() {
    return {
      productos: [],
      busqueda: "",
      mostrarLista: false,
      productoSeleccionado: null,
      mostrarModalVenta: false,
      metodoPago: "efectivo",
      recibo: 0,

      mostrarModalCorte: false,

      corte: {
        totalVentas: 0,
        totalArticulos: 0,
        totalEfectivo: 0,
        totalTarjeta: 0,
        numVentas: 0,
        fechaInicio: "",
        fechaFin: ""
      }
    };
  },

  computed: {
    carrito() {
      return carrito;
    },

    productosFiltrados() {
      return this.productos.filter((p) =>
        (p.codigo + " " + p.nombre)
          .toLowerCase()
          .includes(this.busqueda.toLowerCase())
      );
    },
  },

  async mounted() {
    await this.cargarProductos();
  },

  methods: {
    // 🟢 SOLO ABRIR MODAL
    async abrirCorte() {
      try {
        const vendedor_id = localStorage.getItem("userId");
        const vendedor_nombre = localStorage.getItem("name");

        if (!vendedor_id || !vendedor_nombre) {
          alert("Faltan datos del vendedor en localStorage");
          return;
        }

        // 🔵 Traer datos del corte
        const res = await getArqueo(vendedor_id, vendedor_nombre);
        const data = res.data;

        this.corte = {
          totalVentas: data.total_ventas,
          totalArticulos: data.total_articulos,
          totalEfectivo: data.total_efectivo,
          totalTarjeta: data.total_tarjeta,
          numVentas: data.num_ventas,
          fechaInicio: data.fecha_inicio,
          fechaFin: data.fecha_fin
        };

        // 🔵 Mostrar modal
        this.mostrarModalCorte = true;

      } catch (error) {
        console.error(error.response?.data || error);
        alert("Error al obtener el corte");
      }
    },

    // 🟢 LLAMADA AL BACKEND SOLO AL DAR "ACEPTAR"
    async crearCorte() {
      try {
        const vendedor_id = localStorage.getItem("userId");
        const vendedor_nombre = localStorage.getItem("name");

        if (!vendedor_id || !vendedor_nombre) {
          alert("Faltan datos del vendedor en localStorage");
          return;
        }

        const res = await postCorte({ vendedor_id, vendedor_nombre });
        const data = res.data;

        this.corte = {
          totalVentas: data.total_ventas,
          totalArticulos: data.total_articulos,
          totalEfectivo: data.total_efectivo,
          totalTarjeta: data.total_tarjeta,
          numVentas: data.num_ventas,
          fechaInicio: data.fecha_inicio,
          fechaFin: data.fecha_fin
        };

        alert("Corte generado correctamente");
        this.mostrarModalCorte = false;

      } catch (error) {
        console.error(error.response?.data || error);
        alert("Error al generar el corte");
      }
    },

    cerrarCorte() {
      this.mostrarModalCorte = false;
    },

    async cargarProductos() {
      const { data } = await getProductsVendedor();
      this.productos = data;
    },

    seleccionarProducto(p) {
      this.productoSeleccionado = p;
      this.busqueda = `${p.codigo} - ${p.nombre}`;
      this.mostrarLista = false;
    },

    autocompletar() {
      if (this.productosFiltrados.length > 0) {
        const p = this.productosFiltrados[0];
        this.productoSeleccionado = p;
        this.busqueda = `${p.codigo} - ${p.nombre}`;
        this.mostrarLista = false;
      }
    },

    agregarSeleccionado() {
      if (!this.productoSeleccionado) return;

      carrito.agregar(this.productoSeleccionado);
      this.busqueda = "";
      this.productoSeleccionado = null;
    },

    removerProducto(id) {
      carrito.remover(id);
    },

    vaciarCarrito() {
      carrito.vaciar();
    },

    abrirModalVenta() {
      if (this.carrito.items.length === 0) return;

      this.metodoPago = "efectivo";
      this.recibo = this.carrito.total();
      this.mostrarModalVenta = true;
    },

    cerrarModalVenta() {
      this.mostrarModalVenta = false;
    },

    calcularCambio() {
      if (this.metodoPago === "efectivo") {
        return this.recibo - this.carrito.total();
      }
      return 0;
    },

    async aceptarVenta() {
      try {
        const venta = {
          total: this.carrito.total(),
          metodo_pago: this.metodoPago,
          vendedor_id: localStorage.getItem("userId"),
          vendedor_nombre: localStorage.getItem("name"),
          recibe:
            this.metodoPago === "efectivo"
              ? this.recibo
              : this.carrito.total(),
          cambio:
            this.metodoPago === "efectivo" ? this.calcularCambio() : 0,
          num_articulos: this.carrito.items.reduce(
            (acc, item) => acc + item.cantidad,
            0
          ),
          fecha: new Date().toISOString(),
          status: "completada",
        };

        const { data: ventaCreada } = await postVenta(venta);

        for (const item of this.carrito.items) {
          const detalle = {
            venta_id: ventaCreada.id,
            producto_id: item.id,
            nombre_producto: item.nombre,
            categoria: item.categoria,
            cantidad: item.cantidad,
            precio_unitario: item.precio,
            subtotal: item.precio * item.cantidad,
          };

          await postDetalleVenta(detalle);
          await descontarStock(item.id, item.cantidad);
        }

        alert("Venta registrada y stock actualizado");
        carrito.vaciar();
        this.cerrarModalVenta();
      } catch (error) {
        console.error(error);
        alert("Error al registrar la venta");
      }
    },
  },
};
</script>

<style scoped>
/* ------- NAVBAR FIJO -------- */
.navbar-fijo {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2000;
}

/* ------- CONTENEDOR PRINCIPAL -------- */
.content {
  display: flex;
  height: calc(100vh - 56px);
  margin-top: 56px;
}

/* ------- COLUMNA IZQUIERDA FIJA -------- */
.left-panel {
  width: 67%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 56px;
  height: calc(100vh - 56px);
}

.search-wrapper {
  width: 70%;
}

.search-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.search-box {
  flex: 1;
}

.search-list {
  position: absolute;
  top: 40px;
  width: 100%;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

/* ------- PANEL DERECHO CARRITO -------- */
.cart-panel {
  width: 33%;
  display: flex;
  flex-direction: column;
  border-left: 2px solid #ddd;
  background: white;
}

/* ENCABEZADO FIJO */
.cart-header {
  padding: 15px;
  border-bottom: 1px solid #ccc;
  background: white;
  position: sticky;
  top: 56px;
  z-index: 1000;
}

/* LISTA CON SCROLL */
.cart-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

/* PIE FIJO */
.cart-footer {
  padding: 15px;
  border-top: 1px solid #ccc;
  background: white;
  position: sticky;
  bottom: 0;
  z-index: 1000;
}

.cart-item {
  background: #f5f6fa;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* MODAL */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.modal-dialog {
  background: white;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}
</style>
