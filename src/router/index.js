import { createRouter, createWebHistory } from 'vue-router'
import Login from "../components/Login.vue";
import Products from "../views/Products.vue";
import AdminLayout from "../layout/AdminLayout.vue";
//import Vendedores from "../views/Vendedores.vue";
//import Ventas from "../views/Ventas.vue";
//import Reportes from "../views/Reportes.vue";

const routes = [
  { path: "/", component: Login },
  {
    path: "/products", component: Products}
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Proteger rutas según rol
router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole')
  if (to.meta.requiresAuth && to.meta.role !== userRole) {
    return next('/') // redirigir a login si no tiene permiso
  }
  next()
})

export default router


