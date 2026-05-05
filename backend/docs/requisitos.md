# Levantamento de Requisitos — Bulbe Energia API

**Versão:** 1.0
**Data:** 14/03/2026
**Grupo:** Baal
**Integrantes:**

| Nome Completo | Matrícula | GitHub |
|---|---|---|
| Igor Conrado Figueiredo Almeida | 202501008411 | [@igorconradoibmec](https://github.com/igorconradoibmec) |
| Marcelo Benvindo Guimarães Reis | 202501006361 | [@marceloxreis](https://github.com/marceloxreis) |
| Joshua Azze Distel | 202501007181 | [@joshazze](https://github.com/joshazze) |
| Felipe de Miranda Cota Callado | 202301170711 | [@felipecota04](https://github.com/felipecota04) |

---

## Requisitos Funcionais

| ID    | Descrição                                                                 | US Vinculada | Prioridade |
|-------|---------------------------------------------------------------------------|--------------|------------|
| RF-01 | Listar todos os produtos, com suporte a filtro por categoria              | US-01        | MUST       |
| RF-02 | Buscar produto por ID                                                     | US-02        | MUST       |
| RF-03 | Buscar produtos por texto (nome, descrição e categoria)                   | US-03        | MUST       |
| RF-04 | Filtrar produtos por categoria                                            | US-04        | MUST       |
| RF-05 | Retornar produtos em destaque para a página inicial                       | US-05        | SHOULD     |
| RF-06 | Retornar produtos da campanha Black Friday com filtros                    | US-06        | SHOULD     |
| RF-07 | Retornar recomendações de produtos com base nos itens do carrinho         | US-07        | COULD      |
| RF-08 | Obter carrinho do usuário autenticado                                     | US-08        | MUST       |
| RF-09 | Adicionar item ao carrinho do usuário                                     | US-09        | MUST       |
| RF-10 | Atualizar quantidade de item no carrinho (mín. 1, máx. 99)               | US-10        | MUST       |
| RF-11 | Remover item específico do carrinho                                       | US-11        | MUST       |
| RF-12 | Limpar todos os itens do carrinho                                         | US-12        | MUST       |
| RF-13 | Criar pedido com cálculo de desconto e frete no servidor                  | US-13        | MUST       |
| RF-14 | Listar pedidos de um usuário por customerId                               | US-14        | SHOULD     |
| RF-15 | Buscar detalhes de um pedido por ID                                       | US-15        | SHOULD     |
| RF-16 | Validar cupom de desconto e retornar percentual                           | US-16        | MUST       |
| RF-17 | Criar ou obter sessão de usuário guest                                    | US-17        | MUST       |

---

## Mapa de Endpoints

| Verbo  | Path                                | RF    | Autenticação | Status esperado |
|--------|-------------------------------------|-------|--------------|-----------------|
| GET    | /api/v1/products                    | RF-01 | Não          | 200             |
| GET    | /api/v1/products/:id                | RF-02 | Não          | 200, 404        |
| GET    | /api/v1/products/search?q=          | RF-03 | Não          | 200             |
| GET    | /api/v1/products?category=          | RF-04 | Não          | 200             |
| GET    | /api/v1/products/featured           | RF-05 | Não          | 200             |
| GET    | /api/v1/products/black-friday       | RF-06 | Não          | 200             |
| GET    | /api/v1/products/recommendations    | RF-07 | Não          | 200             |
| GET    | /api/v1/cart                        | RF-08 | Sim (JWT)    | 200, 401        |
| POST   | /api/v1/cart/items                  | RF-09 | Sim (JWT)    | 201, 400, 401   |
| PUT    | /api/v1/cart/items/:itemId          | RF-10 | Sim (JWT)    | 200, 400, 401   |
| DELETE | /api/v1/cart/items/:itemId          | RF-11 | Sim (JWT)    | 200, 401, 404   |
| DELETE | /api/v1/cart                        | RF-12 | Sim (JWT)    | 200, 401        |
| POST   | /api/v1/orders                      | RF-13 | Sim (JWT)    | 201, 400, 401   |
| GET    | /api/v1/customers/:customerId/orders| RF-14 | Sim (JWT)    | 200, 401, 404   |
| GET    | /api/v1/orders/:orderId             | RF-15 | Sim (JWT)    | 200, 401, 404   |
| POST   | /api/v1/coupons/validate            | RF-16 | Não          | 200             |
| POST   | /api/v1/users                       | RF-17 | Não          | 201             |

---

## Requisitos Não-Funcionais

| ID     | Categoria        | Descrição                                                          |
|--------|------------------|--------------------------------------------------------------------|
| RNF-01 | Desempenho       | Endpoints de leitura respondem em ≤ 300ms (p95)                   |
| RNF-02 | Segurança        | Todas as rotas de carrinho, pedidos e usuário exigem token JWT     |
| RNF-03 | Segurança        | Cálculos de preço, desconto e frete são validados no servidor      |
| RNF-04 | Segurança        | Cupons são validados no servidor, nunca expostos no client-side    |
| RNF-05 | Manutenibilidade | Código segue ESLint + padrão arquitetural MVC                      |
| RNF-06 | Manutenibilidade | Endpoints documentados no arquivo docs/openapi.yaml                |
| RNF-07 | Escalabilidade   | API stateless, preparada para migração futura para banco de dados  |
