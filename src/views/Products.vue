<template>
  <div>
    <NavbarAdmin /> <!-- ✅ tu navbar -->
    <!-- Contenedor principal -->
    <div class="container">
      <h1>Products</h1>

      <!-- TABLA DE PRODUCTOS -->
      <table>
        <thead>
          <tr>
            <th>Código</th><th>Nombre</th><th>Stock</th><th>Precio</th><th>Descripcion</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td>{{ p.codigo }}</td>
            <td>{{ p.nombre }}</td>
            <td>{{ p.stock }}</td>
            <td>${{ p.precio }}</td>
            <td>{{ p.descripcion }}</td>
            <td>
              <button @click="editProduct(p)">Editar</button>
              <button @click="removeProduct(p.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL DE EDICIÓN -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h2>Editar Producto</h2>
        <form @submit.prevent="updateProductModal">
          <input v-model="editForm.codigo" placeholder="Código" required />
          <input v-model="editForm.nombre" placeholder="Nombre del producto" required />
          <input v-model.number="editForm.precio" type="number" placeholder="Precio" required />
          <input v-model.number="editForm.stock" type="number" placeholder="Stock" required />
          <input v-model="editForm.descripcion" placeholder="Descripción" required />
          <button type="submit">Guardar Cambios</button>
          <button type="button" @click="showEditModal = false">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getProducts, addProduct, updateProduct, deleteProduct } from "../api/products";
import NavbarAdmin from "../components/NavbarAdmin.vue"; 

export default {
  components: {
    NavbarAdmin
  },
  data() {
    return {
      products: [],
      product: { code: "", name: "", price: 0, description: "" },
      showEditModal: false,
      editForm: { id: null, codigo: "", nombre: "", precio: 0, stock: 0, descripcion: "" },
      editing: false
    };
  },

  async created() {
    await this.loadProducts();
  },

  methods: {
    async loadProducts() {
      const { data } = await getProducts();
      // Asegúrate de que cada producto tenga 'id'
      this.products = data.map((p, index) => ({ id: index + 1, ...p }));
    },

    async saveProduct() {
      await addProduct(this.product);
      this.resetForm();
      await this.loadProducts();
    },

    editProduct(p) {
      this.editForm = { ...p };
      this.showEditModal = true;
    },

    async updateProductModal() {
      await updateProduct(this.editForm.id, this.editForm);
      this.showEditModal = false;
      await this.loadProducts();
    },

    async removeProduct(id) {
      await deleteProduct(id);
      await this.loadProducts();
    },

    resetForm() {
      this.product = { code: "", name: "", price: 0, description: "" };
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}

.form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input { padding: 8px; width: 100%; }

button { padding: 8px 12px; cursor: pointer; margin-right: 10px; }

table { width: 100%; border-collapse: collapse; }

td, th { border: 1px solid #ccc; padding: 10px; }

.modal {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 20px;
  width: 400px;
  border-radius: 10px;
  animation: fadeIn .3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
