<template>
  <div>
    <NavbarVendedor />

    <h1>Carrito</h1>

    <div v-for="p in carrito.items" :key="p.id" class="item">
      <p>{{ p.nombre }} - Cantidad: {{ p.cantidad }}</p>
      <p>Subtotal: ${{ p.precio * p.cantidad }}</p>
    </div>

    <h2>Total: ${{ carrito.total() }}</h2>
  </div>
</template>

<script>
import { carrito } from "../store/carrito.js";
import NavbarVendedor from "../components/NavbarVendedor.vue";

export default {
  components: { NavbarVendedor },
  setup() {
    return { carrito };
  }
};
</script>
