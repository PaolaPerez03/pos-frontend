<template>
  <nav class="navbar navbar-dark bg-dark px-3 d-flex justify-content-between">
    <h4 class="text-white">Panel Vendedor</h4>

    <button class="btn btn-outline-danger d-flex align-items-center"
            @click="logout"
            title="Cerrar sesión">
      <i class="bi bi-power fs-4"></i>
    </button>
  </nav>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      this.$router.push("/");
    }
  }
};
</script>
