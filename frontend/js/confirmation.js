(function initConfirmation() {
  const order = OrderService.getLastOrder();
  const container = document.querySelector('.confirmation-content');

  if (!order || !container) return;

  const info = document.createElement('div');
  info.className = 'order-info';
  info.style.marginTop = '16px';
  info.innerHTML = `
    <p><strong>Código do pedido:</strong> ${order.orderCode}</p>
    <p><strong>Valor final:</strong> R$ ${order.finalAmount.toFixed(2)}</p>
    <a class="btn btn-secondary" href="my-orders.html" style="margin-top:12px; display:inline-block;">
      Ver Meus Pedidos
    </a>
  `;
  container.appendChild(info);
})();
