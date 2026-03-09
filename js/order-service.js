const OrderService = {
  ORDERS_KEY: 'orders',
  LAST_ORDER_ID_KEY: 'lastOrderId',
  USER_KEY: 'userId',

  getCurrentUserId() {
    let id = localStorage.getItem(this.USER_KEY);
    if (!id) {
      // Gera um identificador
      id = 'guest-' + Math.random().toString(36).slice(2, 8);
      localStorage.setItem(this.USER_KEY, id);
    }
    return id;
  },

  _readAll() {
    return JSON.parse(localStorage.getItem(this.ORDERS_KEY)) || [];
  },

  _writeAll(list) {
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(list));
  },
  generateOrderCodeFromItems(items) {
    // PD-AAAAmmdd-HHMMSS-1x2-5x1(padrao a ser gerado)
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const stamp = [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate())
    ].join('') + '-' + [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join('');
    const parts = items.map(it => `${it.id}x${it.quantity}`).join('-');
    return `PD-${stamp}-${parts}`;
  },

  createOrder({ paymentMethod, shipping = 15, pixDiscount = 0.10 }) {
    const items = CartService.getCart(); // depende de cart-utils.js
    if (!items.length) return null; 

    // Totais básicos
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const total = subtotal + shipping;
    const finalAmount = paymentMethod === 'pix' ? total * (1 - pixDiscount) : total;

    const customerId = this.getCurrentUserId();
    const orderCode = this.generateOrderCodeFromItems(items);

    const order = {
      id: 'ord-' + Math.random().toString(36).slice(2, 10),
      orderCode,
      customerId,
      items: items.map(({ id, name, quantity, price }) => ({ id, name, quantity, price })),
      paymentMethod,
      subtotal: Number(subtotal.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      total: Number(total.toFixed(2)),
      finalAmount: Number(finalAmount.toFixed(2)),
      createdAt: new Date().toISOString()
    };

    const all = this._readAll();
    all.unshift(order); // mais recente primeiro
    this._writeAll(all); 
    
        // Guarda o último pedido para página de confirmação
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