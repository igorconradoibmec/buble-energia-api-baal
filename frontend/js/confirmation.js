(async function initConfirmation() {
  const container = document.querySelector('.confirmation-content');
  if (!container) return;

  function renderMessage(text) {
    const info = document.createElement('div');
    info.className = 'order-info';
    info.style.marginTop = '16px';
    info.innerHTML = `
      <p>${text}</p>
      <a class="btn btn-secondary" href="my-orders.html" style="margin-top:12px; display:inline-block;">
        Ver Meus Pedidos
      </a>
    `;
    container.appendChild(info);
  }

  // Id gravado pelo checkout (US-35) ao criar o pedido.
  const orderId = localStorage.getItem('lastOrderId');
  if (!orderId) {
    renderMessage('Não encontramos um pedido recente.');
    return;
  }

  try {
    const order = await Api.get('/orders/' + orderId, { auth: true });

    const info = document.createElement('div');
    info.className = 'order-info';
    info.style.marginTop = '16px';
    info.innerHTML = `
      <p><strong>Código do pedido:</strong> ${order.orderCode}</p>
      <p><strong>Valor final:</strong> R$ ${Number(order.finalAmount).toFixed(2)}</p>
      <a class="btn btn-secondary" href="my-orders.html" style="margin-top:12px; display:inline-block;">
        Ver Meus Pedidos
      </a>
    `;
    container.appendChild(info);
  } catch (error) {
    console.error('Erro ao carregar a confirmacao:', error);
    renderMessage(error.status === 404
      ? 'Pedido não encontrado.'
      : 'Não foi possível carregar a confirmação do pedido.');
  }
})();
