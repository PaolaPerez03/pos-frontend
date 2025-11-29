<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2 class="title">Iniciar Sesión</h2>

      <form @submit.prevent="handleLogin" class="form">
        <!-- EMAIL -->
        <div class="input-group">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Ingresa tu email"
            required
          />
        </div>

        <!-- PASSWORD + SHOW -->
        <div class="input-group">
          <label>Contraseña</label>

          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Ingresa tu contraseña"
              required
            />

            <button
              type="button"
              class="show-btn"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? "🙈" : "👁️" }}
            </button>
          </div>
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? "Ingresando..." : "Ingresar" }}
        </button>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { login } from "../api/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
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

      this.loading = true;

      try {
        const data = await login(this.email, this.password);
        console.log("Datos de login:", data);
        // GUARDAR TOKEN Y DATOS DEL USUARIO
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userId", data.user.uid); 

        // REDIRECCIONAR POR ROL
        if (data.user.role === "admin") {
          this.$router.push("/products");
        } else if (data.user.role === "vendedor") {
          this.$router.push("/vendedor/productos");
        } else {
          this.error = "Rol desconocido";
        }
      } catch (err) {
        this.error = err.message || "Error al iniciar sesión";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Fondo general */
.login-wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6f9;
  padding: 20px;
}

/* Tarjeta */
.login-card {
  background: white;
  padding: 35px;
  width: 100%;
  max-width: 420px;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.title {
  margin-bottom: 20px;
  font-weight: bold;
  color: #333;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Inputs */
.input-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: #444;
}

/* Password con botón */
.password-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.password-wrapper input {
  width: 100%;
  padding-right: 40px;
}

.show-btn {
  position: absolute;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
}

/* Inputs generales */
input {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: 0.2s;
}

input:focus {
  border-color: #4b8df8;
  box-shadow: 0 0 5px rgba(75, 141, 248, 0.4);
}

/* Botón login */
.login-btn {
  background: #4b8df8;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 5px;
  transition: 0.2s;
}

.login-btn:hover {
  background: #3a77d9;
}

.login-btn:disabled {
  background: #8bb7ff;
  cursor: not-allowed;
}

/* Error */
.error {
  color: red;
  margin-top: 10px;
  font-size: 0.9rem;
}
</style>
