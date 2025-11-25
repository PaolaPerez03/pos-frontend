<template>
  <div>
    <NavbarAdmin />

    <div class="container mt-4">
      <h2 class="mb-4">Productos</h2>

      <!-- Botón agregar -->
      <button class="btn btn-success mb-3" @click="openCreateModal">
        <i class="bi bi-plus-circle"></i> Agregar Producto
      </button>

      <!-- TABLA -->
      <table class="table table-striped table-bordered text-center">
        <thead class="table-dark">
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td>{{ p.codigo }}</td>
            <td>{{ p.nombre }}</td>
            <td>{{ p.stock }}</td>
            <td>${{ p.precio }}</td>
            <td>{{ p.descripcion }}</td>

            <td class="d-flex justify-content-center gap-2">

              <!-- Editar -->
              <button class="btn btn-warning btn-sm" @click="openEditModal(p)">
                <i class="bi bi-pencil-square"></i>
              </button>

              <!-- Eliminar -->
              <button class="btn btn-danger btn-sm" @click="openDeleteModal(p)">
                <i class="bi bi-trash3-fill"></i>
              </button>

              <!-- NUEVO: Agregar Existencias -->
              <button class="btn btn-primary btn-sm" @click="openStockModal(p)">
                <i class="bi bi-plus-circle"></i>
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
            <h5 class="modal-title">Agregar Producto</h5>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <label class="form-label">Código</label>
            <input type="text" class="form-control mb-3" v-model="createForm.codigo" />

            <label class="form-label">Nombre</label>
            <input type="text" class="form-control mb-3" v-model="createForm.nombre" />

            <label class="form-label">Precio</label>
            <input type="number" class="form-control mb-3" v-model.number="createForm.precio" />

            <label class="form-label">Stock</label>
            <input type="number" class="form-control mb-3" v-model.number="createForm.stock" />

            <label class="form-label">Descripción</label>
            <input type="text" class="form-control mb-3" v-model="createForm.descripcion" />
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-success" @click="createProduct">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL EDIT -->
    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Editar Producto</h5>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <label class="form-label">Código</label>
            <input type="text" class="form-control mb-3" v-model="editForm.codigo" />

            <label class="form-label">Nombre</label>
            <input type="text" class="form-control mb-3" v-model="editForm.nombre" />

            <label class="form-label">Precio</label>
            <input type="number" class="form-control mb-3" v-model.number="editForm.precio" />

            <label class="form-label">Stock</label>
            <input type="number" class="form-control mb-3" v-model.number="editForm.stock" />

            <label class="form-label">Descripción</label>
            <input type="text" class="form-control mb-3" v-model="editForm.descripcion" />
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-primary" @click="updateProductModal">Guardar</button>
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
            ¿Seguro que deseas eliminar <strong>{{ productToDelete?.nombre }}</strong>?
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-danger" @click="confirmDelete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- NUEVO MODAL AGREGAR STOCK -->
    <div class="modal fade" id="stockModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">Agregar Existencias</h5>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <p>Producto: <strong>{{ stockForm.nombre }}</strong></p>

            <label class="form-label">Cantidad a agregar</label>
            <input
              type="number"
              class="form-control"
              v-model.number="stockForm.cantidad"
              min="1"
            />
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-info" @click="updateStock">Agregar</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { getProducts, addProduct, updateProduct, deleteProduct } from "../api/products";
import NavbarAdmin from "../components/NavbarAdmin.vue";
import { Modal } from "bootstrap";

export default {
  components: { NavbarAdmin },

  data() {
    return {
      products: [],

      createForm: { codigo: "", nombre: "", precio: 0, stock: 0, descripcion: "" },
      editForm: { id: null, codigo: "", nombre: "", precio: 0, stock: 0, descripcion: "" },

      productToDelete: null,

      // NUEVO
      stockForm: { id: null, nombre: "", cantidad: 0 },

      createModal: null,
      editModal: null,
      deleteModal: null,
      stockModal: null
    };
  },

  async mounted() {
    await this.loadProducts();

    this.createModal = new Modal(document.getElementById("createModal"));
    this.editModal = new Modal(document.getElementById("editModal"));
    this.deleteModal = new Modal(document.getElementById("deleteModal"));
    this.stockModal = new Modal(document.getElementById("stockModal"));
  },

  methods: {
    async loadProducts() {
      const { data } = await getProducts();
      this.products = data;
    },

    openCreateModal() {
      this.createForm = { codigo: "", nombre: "", precio: 0, stock: 0, descripcion: "" };
      this.createModal.show();
    },

    async createProduct() {
      await addProduct(this.createForm);
      this.createModal.hide();
      await this.loadProducts();
    },

    openEditModal(product) {
      this.editForm = { ...product };
      this.editModal.show();
    },

    async updateProductModal() {
      await updateProduct(this.editForm.id, this.editForm);
      this.editModal.hide();
      await this.loadProducts();
    },

    openDeleteModal(product) {
      this.productToDelete = product;
      this.deleteModal.show();
    },

    async confirmDelete() {
      await deleteProduct(this.productToDelete.id);
      this.deleteModal.hide();
      await this.loadProducts();
    },

    // NUEVO: abrir modal de existencias
    openStockModal(product) {
      this.stockForm = { id: product.id, nombre: product.nombre, cantidad: 0 };
      this.stockModal.show();
    },

    // NUEVO: sumar existencias
    async updateStock() {
      if (this.stockForm.cantidad <= 0) {
        alert("La cantidad debe ser mayor a 0");
        return;
      }

      const product = this.products.find(p => p.id === this.stockForm.id);

      const updatedData = {
        ...product,
        stock: product.stock + this.stockForm.cantidad
      };

      await updateProduct(product.id, updatedData);

      this.stockModal.hide();
      await this.loadProducts();
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
