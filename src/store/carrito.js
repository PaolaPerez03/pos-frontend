export const carrito = {
  items: [],

  agregar(producto) {
    const existente = this.items.find(item => item.id === producto.id);
    if (existente) {
      existente.cantidad++;
    } else {
      this.items.push({ ...producto, cantidad: 1 });
    }
  },

  remover(id) {
    this.items = this.items.filter(item => item.id !== id);
  },

  vaciar() {
    this.items = [];
  },

  total() {
    return this.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }
};

