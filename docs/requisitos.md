# Levantamento de Requisitos — Bulbe Energia API

**Versao:** 1.0
**Data:** 12/03/2026
**Grupo:** Baal
**Integrantes:**

- Igor Conrado Figueiredo Almeida — 202501008411
- Joshua Azze Distel — 202501007181
- Marcelo Benvindo Guimarães Reis — 202501006361
- Felipe de Miranda Cota Callado — 202301170711

---

## Requisitos Funcionais

| ID    | Descricao                                                                 | US Vinculada | Prioridade |
|-------|---------------------------------------------------------------------------|--------------|------------|
| RF-01 | Listar todos os produtos cadastrados, com filtro opcional por categoria   | US-01        | MUST       |
| RF-02 | Buscar um produto especifico pelo seu ID                                  | US-02        | MUST       |
| RF-03 | Buscar produtos por termo de texto (nome, descricao, categoria)           | US-03        | MUST       |
| RF-04 | Filtrar produtos por categoria                                            | US-04        | SHOULD     |
| RF-05 | Listar produtos em destaque para a pagina inicial                         | US-05        | SHOULD     |
| RF-06 | Listar produtos promocionais (Black Friday) com filtros                   | US-06        | COULD      |
| RF-07 | Obter recomendacoes de produtos baseadas nos itens do carrinho            | US-07        | COULD      |
| RF-08 | Obter o carrinho de compras do usuario                                    | US-08        | MUST       |
| RF-09 | Adicionar um item ao carrinho de compras                                  | US-09        | MUST       |
| RF-10 | Atualizar a quantidade de um item no carrinho                             | US-10        | MUST       |
| RF-11 | Remover um item do carrinho de compras                                    | US-11        | MUST       |
| RF-12 | Limpar todos os itens do carrinho                                         | US-12        | SHOULD     |
| RF-13 | Criar um pedido (finalizar compra) com calculo de frete e descontos       | US-13        | MUST       |
| RF-14 | Listar todos os pedidos de um usuario                                     | US-14        | SHOULD     |
| RF-15 | Buscar os detalhes de um pedido especifico                                | US-15        | SHOULD     |
| RF-16 | Validar um cupom de desconto e retornar o percentual                      | US-16        | SHOULD     |
| RF-17 | Criar ou obter sessao de usuario (guest ou autenticado)                   | US-17        | MUST       |

---

## Mapa de Endpoints

| Verbo  | Path                                | RF    | Status esperado |
|--------|-------------------------------------|-------|-----------------|
| GET    | /api/products                       | RF-01 | 200             |
| GET    | /api/products/{id}                  | RF-02 | 200, 404        |
| GET    | /api/products/search?q={termo}      | RF-03 | 200             |
| GET    | /api/products?category={nome}       | RF-04 | 200             |
| GET    | /api/products/featured              | RF-05 | 200             |
| GET    | /api/products/black-friday          | RF-06 | 200             |
| GET    | /api/products/recommendations       | RF-07 | 200             |
| GET    | /api/cart                           | RF-08 | 200             |
| POST   | /api/cart/items                     | RF-09 | 201, 422        |
| PUT    | /api/cart/items/{itemId}            | RF-10 | 200, 404        |
| DELETE | /api/cart/items/{itemId}            | RF-11 | 200, 404        |
| DELETE | /api/cart                           | RF-12 | 200             |
| POST   | /api/orders                        | RF-13 | 201, 422        |
| GET    | /api/customers/{customerId}/orders  | RF-14 | 200             |
| GET    | /api/orders/{orderId}              | RF-15 | 200, 404        |
| POST   | /api/coupons/validate              | RF-16 | 200             |
| POST   | /api/users                         | RF-17 | 201             |

---

## Requisitos Nao-Funcionais

| ID     | Categoria        | Descricao                                                              |
|--------|------------------|------------------------------------------------------------------------|
| RNF-01 | Desempenho       | Endpoints de leitura respondem em <= 300ms (p95)                       |
| RNF-02 | Seguranca        | Todas as rotas (exceto login e listagem de produtos) exigem token JWT  |
| RNF-03 | Manutenibilidade | Codigo segue ESLint + padrao arquitetural MVC                          |
| RNF-04 | Seguranca        | Calculos de preco, desconto e frete sao validados no servidor          |
| RNF-05 | Seguranca        | Dados sensiveis (senhas, tokens) nao sao expostos nas respostas        |
| RNF-06 | Disponibilidade  | A API deve retornar mensagens de erro claras com codigos HTTP corretos |
| RNF-07 | Portabilidade    | A aplicacao deve rodar com Node.js 18+ sem dependencias de SO          |
| RNF-08 | Seguranca        | Validacao de cupons deve ser feita exclusivamente no servidor           |
