<div align="center">

# ⚡ Bulbe Energia API

**Backend do sistema de monitoramento de energia renovável**  
Projeto desenvolvido para a disciplina de Projeto de Desenvolvimento Backend — IBMEC

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

---

## 👥 Equipe

| Nome Completo | Matrícula | GitHub |
|---|---|---|
| Igor Conrado Figueiredo Almeida | 202501008411 | [@igorconradoibmec](https://github.com/igorconradoibmec) |
| Marcelo Benvindo Guimarães Reis | 202501006361 | [@marceloxreis](https://github.com/marceloxreis) |
| Joshua Azze Distel | 202501007181 | [@joshazze](https://github.com/joshazze) |
| Felipe Cota | — | — |

---

## 📋 Sobre o Projeto

A Bulbe Energia API é o backend do sistema de monitoramento e comercialização de soluções de energia renovável. Esta API fornece os serviços necessários para o funcionamento do frontend desenvolvido no semestre anterior, incluindo gerenciamento de produtos, carrinho de compras, pedidos, cupons e sessões de usuário.

---

## 🏗️ Arquitetura

> *A ser preenchido na Sprint 2 após definição da arquitetura MVC.*

---

## 🔧 Tecnologias

> *A ser preenchido na Sprint 2.*

---

## ⚙️ Como Executar Localmente

> *A ser preenchido na Sprint 2.*

---

## 📡 Endpoints da API

> Consulte o arquivo completo em [`docs/requisitos.md`](./docs/requisitos.md).

| Verbo | Path | Descrição |
|-------|------|-----------|
| GET | /api/v1/produtos | Lista todos os produtos |
| GET | /api/v1/produtos/:id | Retorna produto por ID |
| POST | /api/v1/carrinho | Adiciona item ao carrinho |
| POST | /api/v1/pedidos | Cria novo pedido |
| POST | /api/v1/usuarios/sessao | Cria ou obtém sessão de usuário |

---

## 📚 Documentação OpenAPI

> Arquivo em [`docs/openapi.yaml`](./docs/openapi.yaml) — a ser preenchido progressivamente.

---

## 🗂️ Estrutura do Repositório
```
bulbe-energia-api-baal/
├── docs/
│   ├── requisitos.md
│   └── openapi.yaml
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── services/
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🔄 Sprints

| Sprint | Foco | Status |
|--------|------|--------|
| Kickoff | Apresentação dos trabalhos do semestre anterior | ✅ Concluída |
| Sprint 1 | Setup + Elicitação de Requisitos | 🔄 Em andamento |
| Sprint 2 | Modelagem + Arquitetura + CRUD básico | ⏳ Aguardando |
| Sprint 3 | Banco de Dados + ORM + Testes | ⏳ Aguardando |
| Sprint 4 | Autenticação + Documentação Final | ⏳ Aguardando |

---

## 📖 Referências

- SOMMERVILLE, I. *Software Engineering*. 10. ed. Pearson, 2015.
- FOWLER, M. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002.
- RICHARDSON, L.; RUBY, S. *RESTful Web Services*. O'Reilly, 2007.
- OpenAPI Initiative. *OpenAPI Specification v3.1.0*. Disponível em: https://spec.openapis.org/oas/v3.1.0

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.
