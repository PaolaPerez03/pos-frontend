<template>
  <div>
    <NavbarAdmin />
    <main class="container mt-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import NavbarAdmin from '../components/NavbarAdmin.vue'
</script>

<style scoped>
main {
  min-height: 80vh;
}
</style>
