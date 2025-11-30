<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-4 navbar-fijo">
    <div class="container-fluid">

      <!-- LINKS -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/products" class="nav-link">Productos</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/vendedores" class="nav-link">Vendedores</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/reportes" class="nav-link">Reportes</router-link>
          </li>
        </ul>
      </div>

      <!-- NOMBRE DEL USUARIO -->
      <span class="me-3 fw-bold text-primary">
        {{ userName }}
      </span>

      <!-- BOTÓN LOGOUT -->
      <button class="btn btn-outline-danger d-flex align-items-center"
              @click="logout"
              title="Cerrar sesión">
        <i class="bi bi-power fs-4"></i>
      </button>

      <!-- Responsive -->
      <button
        class="navbar-toggler ms-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const userName = ref("Usuario")

onMounted(() => {
  const savedName = localStorage.getItem("name")
  if (savedName) userName.value = savedName
})

function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("name")
  localStorage.removeItem("role")
  router.push("/")
}
</script>

<style scoped>
.navbar-fijo {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2000;
}
</style>
