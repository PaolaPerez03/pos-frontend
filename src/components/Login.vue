<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Ingresar</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { login } from "../api/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      this.error = null;
      if (!this.email.includes("@")) {
        this.error = "Ingresa un email válido";
        return;
      }
      if (this.password.length < 6) {
        this.error = "La contraseña debe tener al menos 6 caracteres";
        return;
      }

      // Activar loader
      this.loading = true;
      console.log("Intentando iniciar sesión con", this.email, this.password);
      try {
        console.log("Llamando a la función login");
        const data = await login(this.email, this.password);
        localStorage.setItem("token", data.token); // Guardar token
        this.$router.push("/products"); // Redirigir al home
        console.log("Inicio de sesión exitoso");
      } catch (err) {
        this.error = err.message || "Error al iniciar sesión";
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 8px;
  font-size: 1em;
}

button {
  padding: 10px;
  cursor: pointer;
}

.error {
  color: red;
}
</style>
