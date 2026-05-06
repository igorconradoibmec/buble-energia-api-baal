# BulbeShop - Mapeamento de Endpoints de API

> Documento de referencia para migração do frontend estático para uma arquitetura com backend/API REST.
> Gerado em: 08/03/2026

---

## Sumário

- [Visão Geral](#visão-geral)
- [1. Produtos](#1-produtos)
- [2. Carrinho](#2-carrinho)
- [3. Pedidos](#3-pedidos)
- [4. Cupons](#4-cupons)
- [5. Usuários](#5-usuários)
- [Situação Atual vs Proposta](#situação-atual-vs-proposta)
- [Estruturas de Dados](#estruturas-de-dados)
- [Prioridade de Implementação](#prioridade-de-implementação)

---

## Visão Geral

Atualmente o frontend da BulbeShop opera de forma 100% estática:
- **Produtos** são carregados de um arquivo `products.json`
- **Carrinho** é armazenado no `localStorage` do navegador
- **Pedidos** são salvos no `localStorage` + arquivo `orders.json`
- **Cupons** estão hardcoded no código JavaScript (`cupom.js`)
- **Usuários** são identificados por um ID aleatório gerado no navegador

Este documento mapeia **17 endpoints** necessários para substituir essas soluções por uma API REST real.

---

## 1. Produtos

### 1.1 Listar todos os produtos

| Campo       | Valor                          |
|-------------|--------------------------------|
| Método      | `GET`                          |
| Rota        | `/api/products`                |
| Query Params| `?category={nome}` (opcional)  |
| Autenticação| Não                            |

**Arquivos que utilizam:** `utils.js`, `index.js`, `product-list.js`, `search-results.js`, `black-friday.js`, `cart.js`

**Situação atual:** `fetch('products.json')` carrega todos os produtos de um arquivo estático. Toda filtragem é feita no client-side.

**Response esperado:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Echo Dot 5ª Geração",
      "description": "O Echo Dot com o melhor som já lançado...",
      "category": "Conforto e bem-estar no lar",
      "price": 398.99,
      "oldPrice": 459.00,
      "discount": 13,
      "rating": 5,
      "ratingCount": 439,
      "image": "images/produtos/echoDot.jpg"
    }
  ],
  "total": 25
}
```

---

### 1.2 Buscar produto por ID

| Campo       | Valor                          |
|-------------|--------------------------------|
| Método      | `GET`                          |
| Rota        | `/api/products/{id}`           |
| Parâmetros  | `id` - ID do produto (int)     |
| Autenticação| Não                            |

**Arquivos que utilizam:** `product-detail.js`

**Situação atual:** Carrega TODOS os produtos e depois faz `products.find(p => p.id === productId)`.

**Response esperado:**
```json
{
  "id": 1,
  "name": "Echo Dot 5ª Geração",
  "description": "O Echo Dot com o melhor som já lançado...",
  "category": "Conforto e bem-estar no lar",
  "price": 398.99,
  "oldPrice": 459.00,
  "discount": 13,
  "rating": 5,
  "ratingCount": 439,
  "image": "images/produtos/echoDot.jpg"
}
```

---

### 1.3 Buscar produtos por texto

| Campo       | Valor                                   |
|-------------|-----------------------------------------|
| Método      | `GET`                                   |
| Rota        | `/api/products/search`                  |
| Query Params| `?q={termo}` (obrigatório)              |
| Autenticação| Não                                     |

**Arquivos que utilizam:** `search-results.js`, `search-common.js`, `utils.js`

**Situação atual:** Busca client-side filtrando por `name`, `description` e `category` com `includes()`.

**Request exemplo:**
```
GET /api/products/search?q=echo+dot
```

**Response esperado:**
```json
{
  "query": "echo dot",
  "results": [
    {
      "id": 1,
      "name": "Echo Dot 5ª Geração",
      "description": "...",
      "category": "Conforto e bem-estar no lar",
      "price": 398.99,
      "oldPrice": 459.00,
      "discount": 13,
      "rating": 5,
      "ratingCount": 439,
      "image": "images/produtos/echoDot.jpg"
    }
  ],
  "total": 3
}
```

---

### 1.4 Filtrar produtos por categoria

| Campo       | Valor                                       |
|-------------|---------------------------------------------|
| Método      | `GET`                                       |
| Rota        | `/api/products`                             |
| Query Params| `?category={nome}` (obrigatório)            |
| Autenticação| Não                                         |

**Arquivos que utilizam:** `product-list.js`, `black-friday.js`

**Situação atual:** Carrega todos os produtos e filtra com `product.category === category`.

**Request exemplo:**
```
GET /api/products?category=Conforto+e+bem-estar+no+lar
```

**Response:** Mesmo formato do endpoint 1.1, filtrado pela categoria.

---

### 1.5 Produtos destaques (Home)

| Campo       | Valor                          |
|-------------|--------------------------------|
| Método      | `GET`                          |
| Rota        | `/api/products/featured`       |
| Autenticação| Não                            |

**Arquivos que utilizam:** `index.js`

**Situação atual:** Carrega todos os produtos, garante pelo menos 2 produtos Alexa (IDs 1-6) e preenche os 8 slots restantes com produtos aleatórios.

**Response esperado:**
```json
{
  "products": [
    { "id": 1, "name": "Echo Dot 5ª Geração", "..." : "..." },
    { "id": 3, "name": "Echo Show 5", "..." : "..." }
  ],
  "total": 8
}
```

---

### 1.6 Produtos Black Friday

| Campo       | Valor                                                           |
|-------------|-----------------------------------------------------------------|
| Método      | `GET`                                                           |
| Rota        | `/api/products/black-friday`                                    |
| Query Params| `?category={cat}&priceRange={range}&minRating={num}` (opcionais)|
| Autenticação| Não                                                             |

**Arquivos que utilizam:** `black-friday.js`

**Situação atual:** Filtra produtos com IDs específicos [1, 3, 4, 6] (Echo Dots). Filtros de categoria, faixa de preço e avaliação são aplicados no client-side.

**Filtros de preço suportados:** `all`, `0-50`, `50-100`, `100-300`, `300-999`

**Request exemplo:**
```
GET /api/products/black-friday?category=Conforto&priceRange=100-300&minRating=4
```

**Response esperado:**
```json
{
  "products": [ ... ],
  "filters": {
    "categories": ["Conforto e bem-estar no lar", "Economia de energia em casa"],
    "priceRanges": ["0-50", "50-100", "100-300", "300-999"]
  },
  "total": 4
}
```

---

### 1.7 Recomendações de produtos

| Campo       | Valor                                                   |
|-------------|---------------------------------------------------------|
| Método      | `GET`                                                   |
| Rota        | `/api/products/recommendations`                         |
| Query Params| `?cartItemIds={id1,id2,id3}` (obrigatório)              |
| Autenticação| Não                                                     |

**Arquivos que utilizam:** `cart.js`

**Situação atual:** Carrega todos os produtos, identifica as categorias dos itens no carrinho, filtra produtos das mesmas categorias (excluindo os que já estão no carrinho) e limita a 10 por categoria.

**Request exemplo:**
```
GET /api/products/recommendations?cartItemIds=1,3,5
```

**Response esperado:**
```json
{
  "recommendations": [
    { "id": 7, "name": "...", "category": "...", "..." : "..." }
  ],
  "total": 10
}
```

---

## 2. Carrinho

### 2.1 Obter carrinho do usuário

| Campo       | Valor                          |
|-------------|--------------------------------|
| Método      | `GET`                          |
| Rota        | `/api/cart`                    |
| Autenticação| Sim (userId via header/token)  |

**Arquivos que utilizam:** `cart.js`, `cart-utils.js`

**Situação atual:** `JSON.parse(localStorage.getItem('cart'))` — carrinho inteiro armazenado no navegador.

**Response esperado:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Echo Dot 5ª Geração",
      "price": 398.99,
      "oldPrice": 459.00,
      "image": "images/produtos/echoDot.jpg",
      "rating": 5,
      "ratingCount": 439,
      "quantity": 2
    }
  ],
  "itemCount": 2,
  "total": 797.98
}
```

---

### 2.2 Adicionar item ao carrinho

| Campo       | Valor                          |
|-------------|--------------------------------|
| Método      | `POST`                         |
| Rota        | `/api/cart/items`              |
| Autenticação| Sim                            |

**Arquivos que utilizam:** `cart-utils.js`

**Situação atual:** `addItem(product, quantity)` — se o produto já existe no carrinho, soma a quantidade (máx 99).

**Request body:**
```json
{
  "productId": 1,
  "quantity": 1
}
```

**Response esperado:**
```json
{
  "message": "Item adicionado ao carrinho",
  "cart": {
    "items": [ ... ],
    "itemCount": 3,
    "total": 1196.97
  }
}
```

---

### 2.3 Atualizar quantidade de item

| Campo       | Valor                              |
|-------------|------------------------------------|
| Método      | `PUT`                              |
| Rota        | `/api/cart/items/{itemId}`         |
| Parâmetros  | `itemId` - ID do produto (int)     |
| Autenticação| Sim                                |

**Arquivos que utilizam:** `cart.js`

**Situação atual:** `updateItemQuantity(itemId, quantity)` — quantidade permitida entre 1 e 99.

**Request body:**
```json
{
  "quantity": 3
}
```

**Response esperado:**
```json
{
  "message": "Quantidade atualizada",
  "cart": {
    "items": [ ... ],
    "itemCount": 3,
    "total": 1196.97
  }
}
```

---

### 2.4 Remover item do carrinho

| Campo       | Valor                              |
|-------------|------------------------------------|
| Método      | `DELETE`                           |
| Rota        | `/api/cart/items/{itemId}`         |
| Parâmetros  | `itemId` - ID do produto (int)     |
| Autenticação| Sim                                |

**Arquivos que utilizam:** `cart.js`

**Situação atual:** `removeItem(itemId)` — filtra o item do array no localStorage.

**Response esperado:**
```json
{
  "message": "Item removido do carrinho",
  "cart": {
    "items": [ ... ],
    "itemCount": 1,
    "total": 398.99
  }
}
```

---

### 2.5 Limpar carrinho

| Campo       | Valor                          |
|-------------|--------------------------------|
| Método      | `DELETE`                       |
| Rota        | `/api/cart`                    |
| Autenticação| Sim                            |

**Arquivos que utilizam:** `checkout.js`

**Situação atual:** `clearCart()` — `localStorage.setItem('cart', '[]')`.

**Response esperado:**
```json
{
  "message": "Carrinho limpo",
  "cart": {
    "items": [],
    "itemCount": 0,
    "total": 0
  }
}
```

---

## 3. Pedidos

### 3.1 Criar pedido

| Campo       | Valor                          |
|-------------|--------------------------------|
| Método      | `POST`                         |
| Rota        | `/api/orders`                  |
| Autenticação| Sim                            |

**Arquivos que utilizam:** `checkout.js`, `order-service.js`

**Situação atual:** Gera o pedido no client-side com ID aleatório (`ord-XXXXX`), código do pedido baseado nos itens + timestamp, e salva tudo no localStorage.

**Request body:**
```json
{
  "items": [
    { "id": 1, "name": "Echo Dot 5ª Geração", "quantity": 2, "price": 398.99 }
  ],
  "paymentMethod": "pix",
  "shipping": 15.00,
  "couponCode": "BULBE10",
  "customer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999"
  },
  "billingAddress": {
    "address": "Rua Exemplo, 123",
    "city": "São Paulo",
    "state": "SP",
    "zip": "01001000"
  },
  "deliveryAddress": {
    "address": "Rua Exemplo, 123",
    "city": "São Paulo",
    "state": "SP",
    "zip": "01001000"
  }
}
```

**Response esperado:**
```json
{
  "id": "ord-a1b2c3d4",
  "orderCode": "PD-20260308-143000-1x2",
  "customerId": "guest-abc123",
  "items": [
    { "id": 1, "name": "Echo Dot 5ª Geração", "quantity": 2, "price": 398.99 }
  ],
  "paymentMethod": "pix",
  "subtotal": 797.98,
  "shipping": 15.00,
  "couponDiscount": 0.10,
  "pixDiscount": 0.10,
  "total": 812.98,
  "finalAmount": 650.38,
  "createdAt": "2026-03-08T14:30:00.000Z"
}
```

**Observações:**
- Os métodos de pagamento aceitos são: `credit-card`, `pix`, `boleto`
- PIX tem desconto fixo de 10%
- O desconto do cupom deve ser validado no servidor
- O cálculo do valor final deve ser feito no servidor (segurança)

---

### 3.2 Listar pedidos do usuário

| Campo       | Valor                                       |
|-------------|---------------------------------------------|
| Método      | `GET`                                       |
| Rota        | `/api/customers/{customerId}/orders`        |
| Parâmetros  | `customerId` - ID do usuário (string)       |
| Autenticação| Sim                                         |

**Arquivos que utilizam:** `my-orders.js`, `order-service.js`

**Situação atual:** Carrega pedidos do localStorage + `orders.json` e filtra por `customerId`.

**Response esperado:**
```json
{
  "orders": [
    {
      "id": "ord-a1b2c3d4",
      "orderCode": "PD-20260308-143000-1x2",
      "items": [ ... ],
      "paymentMethod": "pix",
      "finalAmount": 650.38,
      "createdAt": "2026-03-08T14:30:00.000Z"
    }
  ],
  "total": 5
}
```

---

### 3.3 Buscar detalhes de um pedido

| Campo       | Valor                              |
|-------------|------------------------------------|
| Método      | `GET`                              |
| Rota        | `/api/orders/{orderId}`            |
| Parâmetros  | `orderId` - ID do pedido (string)  |
| Autenticação| Sim                                |

**Arquivos que utilizam:** `confirmation.js`

**Situação atual:** `OrderService.getLastOrder()` — lê o último pedido criado do localStorage usando a chave `lastOrderId`.

**Response esperado:**
```json
{
  "id": "ord-a1b2c3d4",
  "orderCode": "PD-20260308-143000-1x2",
  "customerId": "guest-abc123",
  "items": [
    { "id": 1, "name": "Echo Dot 5ª Geração", "quantity": 2, "price": 398.99 }
  ],
  "paymentMethod": "pix",
  "subtotal": 797.98,
  "shipping": 15.00,
  "total": 812.98,
  "finalAmount": 650.38,
  "createdAt": "2026-03-08T14:30:00.000Z"
}
```

---

## 4. Cupons

### 4.1 Validar cupom de desconto

| Campo       | Valor                          |
|-------------|--------------------------------|
| Método      | `POST`                         |
| Rota        | `/api/coupons/validate`        |
| Autenticação| Não                            |

**Arquivos que utilizam:** `cupom.js`

**Situação atual:** 10 cupons hardcoded no JavaScript:

| Código        | Desconto |
|---------------|----------|
| BULBE10       | 10%      |
| BULBE15       | 15%      |
| BULBE20       | 20%      |
| BLACKFRIDAY   | 20%      |
| WELCOME5      | 5%       |
| PROMO25       | 25%      |
| SUPERPROMO    | 40%      |
| SUPER30       | 30%      |
| CLIENTEVIP    | 12%      |
| MEGASALE      | 18%      |

**Request body:**
```json
{
  "code": "BULBE10"
}
```

**Response esperado (cupom válido):**
```json
{
  "valid": true,
  "code": "BULBE10",
  "discountPercentage": 0.10,
  "message": "Cupom aplicado com sucesso! Desconto de 10%"
}
```

**Response esperado (cupom inválido):**
```json
{
  "valid": false,
  "code": "INVALIDO",
  "message": "Cupom não encontrado"
}
```

---

## 5. Usuários

### 5.1 Criar ou obter sessão de usuário

| Campo       | Valor                          |
|-------------|--------------------------------|
| Método      | `POST`                         |
| Rota        | `/api/users`                   |
| Autenticação| Não (este endpoint cria a sessão)|

**Arquivos que utilizam:** `order-service.js`

**Situação atual:** Gera um ID aleatório `guest-XXXXXX` e armazena no localStorage com a chave `userId`.

**Request body (novo usuário guest):**
```json
{}
```

**Response esperado:**
```json
{
  "userId": "guest-a1b2c3",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "createdAt": "2026-03-08T14:30:00.000Z"
}
```

**Observação:** Este endpoint pode evoluir para um sistema de autenticação completo (login/registro) no futuro.

---

## Situação Atual vs Proposta

| Recurso         | Hoje (Frontend)                          | Proposta (API)                              |
|-----------------|------------------------------------------|---------------------------------------------|
| Produtos        | Arquivo `products.json` estático         | `GET /api/products` com filtros no servidor  |
| Busca           | `String.includes()` no client-side       | `GET /api/products/search` com busca otimizada|
| Carrinho        | `localStorage` do navegador              | `GET/POST/PUT/DELETE /api/cart`              |
| Pedidos         | `localStorage` + `orders.json`           | `POST /api/orders` + `GET` para consultas   |
| Cupons          | Hardcoded no JavaScript                  | `POST /api/coupons/validate` no servidor    |
| Usuário         | ID aleatório no `localStorage`           | `POST /api/users` com sessão/token          |
| Cálculos        | Desconto e total no client-side          | Validação e cálculo no servidor             |
| Recomendações   | Filtro por categoria no client-side      | `GET /api/products/recommendations`         |

---

## Estruturas de Dados

### Produto
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "category": "string",
  "price": 398.99,
  "oldPrice": 459.00,
  "discount": 13,
  "rating": 5,
  "ratingCount": 439,
  "image": "string (path)"
}
```

### Item do Carrinho
```json
{
  "id": 1,
  "name": "string",
  "price": 398.99,
  "oldPrice": 459.00,
  "image": "string (path)",
  "rating": 5,
  "ratingCount": 439,
  "quantity": 2
}
```

### Pedido
```json
{
  "id": "ord-XXXXXXXX",
  "orderCode": "PD-YYYYMMDD-HHMMSS-{items}",
  "customerId": "guest-XXXXXX",
  "items": [{ "id": 1, "name": "string", "quantity": 2, "price": 398.99 }],
  "paymentMethod": "pix | credit-card | boleto",
  "subtotal": 797.98,
  "shipping": 15.00,
  "total": 812.98,
  "finalAmount": 650.38,
  "createdAt": "ISO 8601"
}
```

### Cupom
```json
{
  "code": "BULBE10",
  "discountPercentage": 0.10
}
```

---

## Prioridade de Implementação

### Alta Prioridade (Core do e-commerce)
1. `GET /api/products` — Base de tudo, usado em quase todas as páginas
2. `GET /api/products/{id}` — Página de detalhe do produto
3. `POST /api/cart/items` — Funcionalidade essencial de adicionar ao carrinho
4. `GET /api/cart` — Visualizar o carrinho
5. `POST /api/orders` — Finalizar compra

### Média Prioridade (Experiência do usuário)
6. `PUT /api/cart/items/{itemId}` — Atualizar quantidade no carrinho
7. `DELETE /api/cart/items/{itemId}` — Remover do carrinho
8. `DELETE /api/cart` — Limpar carrinho
9. `GET /api/products/search?q=` — Busca de produtos
10. `GET /api/customers/{id}/orders` — Histórico de pedidos
11. `POST /api/coupons/validate` — Validação de cupons (segurança)

### Menor Prioridade (Melhorias)
12. `GET /api/products/featured` — Destaques da home
13. `GET /api/products/black-friday` — Produtos promocionais
14. `GET /api/products/recommendations` — Recomendações
15. `GET /api/orders/{orderId}` — Detalhe do pedido
16. `POST /api/users` — Sessão de usuário
17. `GET /api/products?category=` — Filtro por categoria

---

> **Nota:** Todos os endpoints que envolvem dados sensíveis (carrinho, pedidos, pagamento) devem ter autenticação implementada. Os cálculos de preço, desconto e frete devem ser validados no servidor para evitar manipulação pelo client-side.
