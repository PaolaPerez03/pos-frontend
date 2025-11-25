<template>
  <div>
    <NavbarAdmin />

    <div class="container mt-4">
      <h2 class="mb-4">Usuarios</h2>

      <!-- Botón agregar -->
      <button class="btn btn-success mb-3" @click="openCreateModal">
        <i class="bi bi-plus-circle"></i> Agregar Usuario
      </button>

      <!-- TABLA -->
      <table class="table table-striped table-bordered text-center">
        <thead class="table-dark">
          <tr>
            <th>Email</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.email }}</td>
            <td>{{ u.name }}</td>
            <td>{{ u.role }}</td>

            <td>
              <button class="btn btn-warning btn-sm me-2" @click="openEditModal(u)">
                <i class="bi bi-pencil-square"></i>
              </button>

              <button class="btn btn-danger btn-sm" @click="openDeleteModal(u)">
                <i class="bi bi-trash3-fill"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL CREATE -->
    <div class="modal fade" id="createModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Agregar Usuario</h5>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <label class="form-label">Email</label>
            <input type="email" class="form-control mb-3" v-model="createForm.email">

            <label class="form-label">Nombre</label>
            <input type="text" class="form-control mb-3" v-model="createForm.name">

            <label class="form-label">Rol</label>
            <select class="form-control mb-3" v-model="createForm.role">
              <option value="admin">Admin</option>
              <option value="vendedor">Vendedor</option>
            </select>

            <label class="form-label">Contraseña</label>
            <input type="password" class="form-control mb-3" v-model="createForm.password">
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-success" @click="createUser">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL EDIT -->
    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Editar Usuario</h5>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <label class="form-label">Email</label>
            <input type="email" class="form-control mb-3" v-model="editForm.email">

            <label class="form-label">Nombre</label>
            <input type="text" class="form-control mb-3" v-model="editForm.name">

            <label class="form-label">Rol</label>
            <select class="form-control mb-3" v-model="editForm.role">
              <option value="admin">admin</option>
              <option value="vendedor">vendedor</option>
            </select>
            <label class="form-label">Contraseña</label>
            <input type="password" class="form-control mb-3" v-model="editForm.password">
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-primary" @click="updateUserModal">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DELETE -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">Confirmar Eliminación</h5>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            ¿Seguro que deseas eliminar a <strong>{{ userToDelete?.name }}</strong>?
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-danger" @click="confirmDelete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import NavbarAdmin from "../components/NavbarAdmin.vue";
import { Modal } from "bootstrap";

// APIs (debes crearlas igual que products)
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser
} from "../api/users";

export default {
  components: { NavbarAdmin },

  data() {
    return {
      users: [],

      createForm: { email: "", name: "", role: "", password: "" },
      editForm: { id: null, email: "", name: "", role: "" },

      userToDelete: null,

      createModal: null,
      editModal: null,
      deleteModal: null
    };
  },

  async mounted() {
    await this.loadUsers();

    this.createModal = new Modal(document.getElementById("createModal"));
    this.editModal = new Modal(document.getElementById("editModal"));
    this.deleteModal = new Modal(document.getElementById("deleteModal"));
  },

  methods: {
    async loadUsers() {
      const { data } = await getUsers();
      this.users = data;
    },

    openCreateModal() {
      this.createForm = { email: "", name: "", role: "", password: "" };
      this.createModal.show();
    },

    async createUser() {
      console.log("📤 Enviando datos a createUser:", this.createForm);
      await addUser(this.createForm);
      this.createModal.hide();
      await this.loadUsers();
    },

    openEditModal(user) {
      this.editForm = { ...user };
      this.editModal.show();
    },

    async updateUserModal() {
      await updateUser(this.editForm.id, this.editForm);
      this.editModal.hide();
      await this.loadUsers();
    },

    openDeleteModal(user) {
      this.userToDelete = user;
      this.deleteModal.show();
    },

    async confirmDelete() {
      await deleteUser(this.userToDelete.id);
      this.deleteModal.hide();
      await this.loadUsers();
    }
  }
};
</script>

<style>
.modal-header {
  border-bottom: none;
}
.modal-footer {
  border-top: none;
}
</style>
