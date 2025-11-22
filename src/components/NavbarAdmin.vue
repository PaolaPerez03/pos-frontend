<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-4">
    <div class="container-fluid">
      <!-- Parte izquierda: Cerrar sesión -->
      <div class="d-flex align-items-center">
        <button class="btn btn-danger" @click="logout">Cerrar Sesión</button>
      </div>

      <!-- Botón responsive -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Parte derecha: enlaces admin -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/products" class="nav-link">Products</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/vendedores" class="nav-link">Vendedores</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/ventas" class="nav-link">Ventas</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/reportes" class="nav-link">Reportes</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<style scoped>
.navbar-nav .nav-link {
  font-weight: bold;
  color: #2c3e50;
}

.navbar-nav .nav-link.router-link-exact-active {
  color: #42b983;
}
</style>
