(async function initMyOrders() {
  const container = document.querySelector('.orders-list');
  if (!container) return;

  try {
    // Identidade da sessao (US-27): garante token e pega o customerId.
    await Api.ensureSession();
    const customerId = Api.getUserId();

    const data = await Api.get('/customers/' + customerId + '/orders', { auth: true });
    const myOrders = Array.isArray(data.orders) ? data.orders : [];

    renderOrders(myOrders, container);
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
    container.innerHTML = error.status === 401
      ? `<p style="padding:24px; text-align:center; color:#536679;">Faça login para ver seus pedidos.</p>`
      : `<p style="padding:24px; text-align:center; color:#536679;">Não foi possível carregar seus pedidos.</p>`;
  }

  function renderOrders(list, containerEl) {
    containerEl.innerHTML = '';
    if (!list.length) {
      containerEl.innerHTML = `
        <p style="padding:24px; text-align:center; color:#536679;">
          Você ainda não tem pedidos.
        </p>`;
      return;
    }

    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    list.forEach(order => {
      const el = document.createElement('article');
      el.className = 'order-card';
      el.style.border = '1px solid #e6e9ef';
      el.style.borderRadius = '12px';
      el.style.padding = '16px';
      el.style.marginBottom = '12px';
      el.style.background = '#fff';

      const itemsHtml = (order.items || []).map(it => `
        <li>${it.name ? it.name : 'Produto #' + it.id} <strong>x${it.quantity}</strong>
            (R$ ${(Number(it.price) * Number(it.quantity)).toFixed(2)})</li>
      `).join('');

      el.innerHTML = `
        <h3 style="margin-bottom:6px;">${order.orderCode}</h3>
        <p style="margin:4px 0;">Data: ${formatDate(order.createdAt)}</p>
        <ul style="margin:8px 0 4px 18px;">${itemsHtml}</ul>
        <p style="margin:4px 0;">Subtotal: R$ ${nf(order.subtotal)}</p>
        <p style="margin:4px 0;">Frete: R$ ${nf(order.shipping)}</p>
        <p style="margin:4px 0;"><strong>Total: R$ ${nf(order.finalAmount ?? order.total)}</strong></p>
        <p style="margin:6px 0; font-size: 12px; color:#6b7686;">
          Pagamento: ${(order.paymentMethod || '').toString().toUpperCase()}
        </p>
      `;
      containerEl.appendChild(el);
    });
  }

  function nf(v) {
    const n = Number(v || 0);
    return n.toFixed(2);
  }
  function formatDate(iso) {
    const d = iso ? new Date(iso) : new Date();
    return d.toLocaleString();
  }
})();