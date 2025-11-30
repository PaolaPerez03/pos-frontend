<template>
  <div class="container mt-4">

    <!-- NAVBAR -->
    <NavbarAdmin class="navbar-fijo"/>

    <!-- TÍTULO -->
    <div style="margin-top: 80px;">
      <h2 class="mb-3 text-center">📊 Reportes</h2>
    </div>

    <!-- BOTONES CENTRADOS -->
    <div class="d-flex gap-3 flex-wrap justify-content-center mb-4">
      <button class="btn btn-primary" @click="abrirModalDia">Ventas por día</button>
      <button class="btn btn-primary" @click="abrirModalMes">Ventas por mes</button>
    </div>

    <!-- PRODUCTO MÁS VENDIDO -->
    <div v-if="productoMasVendido" class="card p-3 mb-4 shadow-sm">
      <h4>🥇 Producto más vendido</h4>
      <p><strong>Producto:</strong> {{ productoMasVendido.nombre }}</p>
      <p><strong>Total vendido:</strong> {{ productoMasVendido.cantidad }}</p>
    </div>

    <!-- ----------------- MODAL VENTAS POR DIA ----------------- -->
    <div class="modal fade" id="modalDia" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Ventas por día</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <input type="date" v-model="fechaDia" class="form-control mb-3" />
            <button class="btn btn-success mb-3" @click="cargarVentasDia">Buscar</button>

            <div v-if="ventasDia">
              <h5>Total: ${{ totalDia }}</h5>

              <table class="table table-striped mt-3">
                <thead>
                  <tr>
                    <th>Folio</th>
                    <th>Hora</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="v in ventasDia.ventas" :key="v.id">
                    <td>{{ v.folio }}</td>
                    <td>{{ v.hora }}</td>
                    <td>${{ v.total }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- ----------------- MODAL VENTAS POR MES ----------------- -->
    <div class="modal fade" id="modalMes" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Ventas por mes</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">

            <div class="row g-2 mb-3">
              <div class="col">
                <input type="number" placeholder="Año" class="form-control" v-model="anio" />
              </div>
              <div class="col">
                <input type="number" placeholder="Mes (1-12)" class="form-control" v-model="mes" />
              </div>
            </div>

            <button class="btn btn-success mb-3" @click="cargarVentasMes">Buscar</button>

            <div v-if="ventasMes">
              <h5>Total del mes: ${{ ventasMes.total }}</h5>

              <table class="table table-striped mt-3">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="d in ventasMes.dias" :key="d.dia">
                    <td>{{ d.dia }}</td>
                    <td>${{ d.total }}</td>
                  </tr>
                </tbody>
              </table>

            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- ----------------- GRÁFICAS ----------------- -->

    <div class="mt-5">
      <h3 class="text-center">📈 Ventas por hora<span v-if="fechaDia"> del dia {{ fechaDia }}</span></h3>
      <canvas id="graficaDia" height="120"></canvas>
    </div>

    <div class="mt-5 mb-5">
      <h3 class="text-center">📉 Ventas del mes<span v-if="mesFormateado"> de {{ mesFormateado }}</span></h3>
      <canvas id="graficaMes" height="120"></canvas>
    </div>

  </div>
</template>

<script>
import NavbarAdmin from "../components/NavbarAdmin.vue";
import * as bootstrap from "bootstrap";
import Chart from "chart.js/auto";

import {
  getProductoMasVendido,
  getVentasPorDia,
  getVentasPorMes
} from "../api/reportes";

export default {
  components: { NavbarAdmin },

  data() {
    return {
      productoMasVendido: null,
      fechaDia: "",
      ventasDia: null,
      anio: "",
      mes: "",
      ventasMes: null,
      graficaDia: null,
      graficaMes: null
    };
  },

  computed: {
    mesFormateado() {
      if (!this.anio || !this.mes) return "";

      const fecha = new Date(this.anio, this.mes - 1); 
      return fecha.toLocaleDateString("es-MX", { month: "long", year: "numeric" });
    },

    totalDia() {
      if (!this.ventasDia) return 0;
      return this.ventasDia.ventas.reduce((acc, v) => acc + v.total, 0);
    }
  },

  mounted() {
    this.cargarProductoMasVendido();
  },

  methods: {
    abrirModalDia() {
      new bootstrap.Modal(document.getElementById("modalDia")).show();
    },

    abrirModalMes() {
      new bootstrap.Modal(document.getElementById("modalMes")).show();
    },

    async cargarProductoMasVendido() {
      const { data } = await getProductoMasVendido();
      this.productoMasVendido = data;
    },

    async cargarVentasDia() {
      if (!this.fechaDia) return;
      const { data } = await getVentasPorDia(this.fechaDia);
      this.ventasDia = data;

      this.dibujarGraficaDia();
    },

    async cargarVentasMes() {
      if (!this.anio || !this.mes) return;
      const { data } = await getVentasPorMes(this.anio, this.mes);
      this.ventasMes = data;

      this.dibujarGraficaMes();
    },

    // ------------------ GRAFICAS --------------------

    dibujarGraficaDia() {
      if (!this.ventasDia) return;

      // 1. Agrupar montos por hora
      const agrupado = {};

      this.ventasDia.ventas.forEach(v => {
        // Extrae la hora en formato "HH" desde "HH:MM"
        const hora = v.hora.split(":")[0];

        if (!agrupado[hora]) agrupado[hora] = 0;
        agrupado[hora] += v.total;
      });

      // 2. Crear etiquetas estilo "8:00 - 9:00"
      const etiquetas = Object.keys(agrupado).map(h => `${h}:00 - ${Number(h) + 1}:00`);

      // 3. Totales ordenados
      const montos = Object.keys(agrupado).map(h => agrupado[h]);

      // 4. Destruir gráfica previa si existe
      if (this.graficaDia) this.graficaDia.destroy();

      // 5. Dibujar gráfica agrupada
      this.graficaDia = new Chart(document.getElementById("graficaDia"), {
        type: "bar",
        data: {
          labels: etiquetas,
          datasets: [
            {
              label: "Ventas agrupadas por hora",
              data: montos
            }
          ]
        }
      });
    },

    dibujarGraficaMes() {
      console.log(this.ventasMes)

      if (!this.ventasMes) return;

      const etiquetas = this.ventasMes.dias.map(v => "Día " + v.dia);
      const montos = this.ventasMes.dias.map(v => v.total);

      if (this.graficaMes) this.graficaMes.destroy();

      this.graficaMes = new Chart(document.getElementById("graficaMes"), {
        type: "line",
        data: {
          labels: etiquetas,
          datasets: [
            {
              label: "Ventas del mes",
              data: montos
            }
          ]
        }
      });
    }
  }
};
</script>

<style>
.chart-container {
  width: 100%;
  height: 300px; 
}

.navbar-fijo {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2000;
}

.card {
  border-radius: 12px;
}

.modal {
  z-index: 3000 !important;
}

.modal-backdrop.show {
  z-index: 2990 !important;
}
</style>