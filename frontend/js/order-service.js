const OrderService = {
  ORDERS_KEY: 'orders',
  LAST_ORDER_ID_KEY: 'lastOrderId',
  USER_KEY: 'userId',

  getCurrentUserId() {
    // A identidade agora vem da sessao do Api client (POST /users em ensureSession).
    // Mantem fallback ao localStorage caso o api.js ainda nao tenha carregado.
    if (typeof Api !== 'undefined') return Api.getUserId();
    return localStorage.getItem(this.USER_KEY);
  },

  // Garante uma sessao guest no backend (POST /users) e devolve o token.
  ensureSession() {
    return Api.ensureSession();
  },

  // Limpa a sessao atual (logout): remove token/userId salvos.
  logout() {
    if (typeof Api !== 'undefined') Api.clearSession();
  },

  _readAll() {
    return JSON.parse(localStorage.getItem(this.ORDERS_KEY)) || [];
  },

  _writeAll(list) {
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(list));
  },
  // Cria o pedido no backend (POST /orders). O servidor calcula subtotal,
  // descontos e finalAmount; recebe o payload ja montado pelo checkout.
  async createOrder(payload) {
    const order = await Api.post('/orders', payload, { auth: true });
    // Guarda o id para a pagina de confirmacao (US-37).
    localStorage.setItem(this.LAST_ORDER_ID_KEY, order.id);
    return order;
  },

  getOrders() {
    return this._readAll();
  },

  getOrdersByCustomer(customerId) {
    return this._readAll().filter(o => o.customerId === customerId);
  },

  getLastOrder() {
    const id = localStorage.getItem(this.LAST_ORDER_ID_KEY);
    if (!id) return null;
    return this._readAll().find(o => o.id === id) || null;
    }
};