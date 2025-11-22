<template>
  <!-- eslint-disable vue/no-multiple-template-root -->

  <!-- Rutas de la app -->
  <router-view></router-view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Computed para saber si hay usuario logueado
const isLogged = computed(() => !!localStorage.getItem('userToken'))

// Función para cerrar sesión
function logout() {
  localStorage.removeItem('userToken')
  localStorage.removeItem('userRole')
  router.push('/login')
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 10px 0;

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
