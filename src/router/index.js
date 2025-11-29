import { createRouter, createWebHistory } from 'vue-router'
import Login from "../components/Login.vue";
import Products from "../views/Products.vue"; // ADMIN
import Vendedores from "../views/Vendedores.vue"; // ADMIN
import ProductsVendedor from "../views/ProductsVendedor.vue"; // NUEVA VISTA

const routes = [
  {
    path: "/",
    component: Login
  },

  // RUTA ADMIN
  {
    path: "/products",
    component: Products,
    meta: { requiresAuth: true, role: "admin" }
  },

  // RUTA ADMIN
  {
    path: "/vendedores",
    component: Vendedores,
    meta: { requiresAuth: true, role: "admin" }
  },

  // RUTA VENDEDOR
  {
    path: "/vendedor/productos",
    component: ProductsVendedor,
    meta: { requiresAuth: true, role: "vendedor" }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

// PROTECCIÓN DE RUTAS
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {

    // Si no hay token → login
    if (!token) return next('/');

    // Si el rol no coincide → login
    if (to.meta.role && to.meta.role !== userRole) {
      return next('/');
    }
  }

  next();
});

export default router;

