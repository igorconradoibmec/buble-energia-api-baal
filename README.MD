# Backlog Completo do Projeto E-commerce

## Equipe do Projeto

- **Product Owners (POs):** Tamara Simões, Daniel Gamarano
- **Scrum Master:** Igor Conrado
- **Desenvolvedores:** Joshua Azze, Tiago Lage, Augusto Gama, Marcelo Reis, Felipe Cota

---

## Links Importantes

- **Wireframes no Figma:** [Simulação esqueleto botões](https://www.figma.com/board/1oMvNRvl3fBAHC6mUISX4b/Simula%C3%A7%C3%A3o-esqueleto-bot%C3%B5es?node-id=0-1&p=f&t=DottqyjA4NUShpjo-0)
- **Figma:** [Protótipos de alta fidelidade](https://www.figma.com/design/kJGDPHBRBg0gTtf6l3i2Am/BulbeShop---Grupo-3?node-id=43-1258&t=qjePoHydz2E7xvIi-0)
- **Jira:** [Backlog | Scrum](https://bulbe-grupo3.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog?atlOrigin=eyJpIjoiYTY3MmJkZTQ5NjA3NDYxN2EyNDdmN2Q5YWM3M2EwOGMiLCJwIjoiaiJ9)

---

## Legenda de Classificação

### Níveis de Necessidade:
- **Necessário**: Itens fundamentais para o funcionamento básico do e-commerce
- **Desejável**: Funcionalidades que melhoram a experiência mas não são críticas

### Níveis de Complexidade (Escala Fibonacci 1-3-5-8-13):
- **1**: Tarefas muito simples (criar repo, estrutura de pastas)
- **3**: Tarefas simples (páginas estáticas básicas, configurações)
- **5**: Tarefas de complexidade média (páginas com mais elementos, scripts básicos)
- **8**: Tarefas complexas (protótipos completos, JavaScript avançado, validações)
- **13**: Tarefas muito complexas (CSS responsivo completo, testes E2E)

---

## Sprint 1: Estruturação e Navegação (Redesign e Documentação)

**Objetivo:** Construir a fundação do projeto, incluindo a documentação, protótipos de baixa fidelidade, estrutura de arquivos, e o fluxo de navegação com páginas HTML estáticas.

### Épico 1: Repositório e Documentação

- **Tarefa 1.1:** Criar o repositório no GitHub
  - **Necessidade:** Necessário
  - **Complexidade:** 1

- **Tarefa 1.2:** Definir e criar a estrutura de pastas do projeto (/assets, /css, /js, /pages)
  - **Necessidade:** Necessário
  - **Complexidade:** 1

- **Tarefa 1.3:** Escrever o README.md com descrição, integrantes e link para o Figma
  - **Necessidade:** Necessário
  - **Complexidade:** 3

- **Tarefa 1.4:** Criar o documento de Requisitos Funcionais
  - **Necessidade:** Necessário
  - **Complexidade:** 5

### Épico 2: Páginas Estáticas e Protótipo de Baixa Fidelidade

- **Tarefa 2.1:** Criar o protótipo de baixa fidelidade no Figma para todas as telas
  - **Necessidade:** Necessário
  - **Complexidade:** 8

- **Tarefa 2.2:** Criar a página login.html com formulário estático
  - **Necessidade:** Necessário
  - **Complexidade:** 3

- **Tarefa 2.3:** Criar a página index.html (Home) com uma grade de produtos mockados
  - **Necessidade:** Necessário
  - **Complexidade:** 5

- **Tarefa 2.4:** Criar a página catalogo com imagens e dados mockados
  - **Necessidade:** Necessário
  - **Complexidade:** 5
  - **Responsável:** Igor Conrado

- **Tarefa 2.5:** Criar a página produto (Detalhes do Produto) com dados mockados
  - **Necessidade:** Necessário
  - **Complexidade:** 5
  - **Responsável:** Tiago Lage

- **Tarefa 2.6:** Criar a página do carrinho (carrinho) estática
  - **Necessidade:** Necessário
  - **Complexidade:** 3
  - **Responsável:** Felipe Cota

- **Tarefa 2.7:** Criar as páginas do fluxo de checkout: checkout-endereco, checkout-pagamento.html e confirmacao.html
  - **Necessidade:** Necessário
  - **Complexidade:** 8
  - **Responsável:** Marcelo Reis

- **Tarefa 2.8:** Implementar a navegação estática (sem JS) entre todas as páginas usando links `<a>`
  - **Necessidade:** Necessário
  - **Complexidade:** 3
  - **Responsável:** Tiago Lage

---

## Sprint 2: Redesign / Desenvolvimento

**Objetivo:** Evoluir o design para alta fidelidade, implementar o visual completo com HTML e CSS, e iniciar o desenvolvimento dos scripts para funcionalidades dinâmicas.

### Épico 3: Design de Alta Fidelidade e Implementação Visual

- **Tarefa 3.1:** Evoluir os protótipos do Figma de baixa para alta fidelidade
  - **Necessidade:** Necessário
  - **Complexidade:** 8
  - **Responsável:** Augusto Gama

- **Tarefa 3.2:** Refinar todo o CSS para corresponder ao design de alta fidelidade, garantindo a responsividade
  - **Necessidade:** Necessário
  - **Complexidade:** 13
  - **Responsável:** Tiago Lage

- **Tarefa 3.3:** Criar estilos globais e variáveis CSS (:root) para cores, fontes e espaçamentos
  - **Necessidade:** Necessário
  - **Complexidade:** 5
  - **Responsável:** Augusto Gama

### Épico 4: Carregamento Dinâmico de Conteúdo

- **Tarefa 4.1:** Criar o arquivo products.json com a estrutura de dados dos produtos
  - **Necessidade:** Necessário
  - **Complexidade:** 3
  - **Responsável:** Felipe Cota

- **Tarefa 4.2:** Desenvolver o script JS para buscar (fetch) os dados do products.json e renderizar os produtos na Home
  - **Necessidade:** Necessário
  - **Complexidade:** 8
  - **Responsável:** Felipe Cota

- **Tarefa 4.3:** Fazer a página produto.html carregar e exibir os dados do item selecionado
  - **Necessidade:** Necessário
  - **Complexidade:** 5
  - **Responsável:** Marcelo Reis

### Épico 5: Desenvolvimento de Scripts (Interatividade Inicial)

- **Tarefa 5.1:** Implementar a funcionalidade de busca por nome na Home page
  - **Necessidade:** Desejável
  - **Complexidade:** 5
  - **Responsável:** Igor Conrado

- **Tarefa 5.2:** Implementar a lógica de adicionar/remover itens do carrinho usando localStorage
  - **Necessidade:** Necessário
  - **Complexidade:** 8
  - **Responsável:** Felipe Cota

- **Tarefa 5.3:** Fazer a página carrinho.html exibir os produtos que estão no localStorage
  - **Necessidade:** Necessário
  - **Complexidade:** 5
  - **Responsável:** Felipe Cota

- **Tarefa 5.4:** Implementar a lógica de favoritar/desfavoritar itens, salvando no localStorage
  - **Necessidade:** Desejável
  - **Complexidade:** 5
  - **Responsável:** Joshua Azze

---

## Sprint 3: Desenvolvimento

**Objetivo:** Focar no desenvolvimento pesado da lógica de negócio, implementar o checkout funcional e integrar bibliotecas externas para melhorar a experiência do usuário.

### Épico 6: Lógica do Checkout Funcional

- **Tarefa 6.1:** Carregar dinamicamente os itens do carrinho na página de checkout
  - **Necessidade:** Necessário
  - **Complexidade:** 5
  - **Responsável:** Marcelo Reis

- **Tarefa 6.2:** Implementar a função que calcula o subtotal e o total do pedido
  - **Necessidade:** Necessário
  - **Complexidade:** 3
  - **Responsável:** Igor Conrado

- **Tarefa 6.3:** Implementar a lógica de cálculo de frete e desconto condicional para pagamento com Pix
  - **Necessidade:** Desejável
  - **Complexidade:** 8
  - **Responsável:** Felipe Cota

- **Tarefa 6.4:** Implementar a validação dos formulários de endereço e pagamento
  - **Necessidade:** Necessário
  - **Complexidade:** 8
  - **Responsável:** Tiago Lage

### Épico 7: Geração de Pedido (Simulado)

- **Tarefa 7.1:** Criar uma função que gera um código de pedido aleatório após a compra
  - **Necessidade:** Necessário
  - **Complexidade:** 3
  - **Responsável:** Joshua Azze

- **Tarefa 7.2:** Exibir o código do pedido na página de confirmação
  - **Necessidade:** Necessário
  - **Complexidade:** 3
  - **Responsável:** Augusto Gama

- **Tarefa 7.3:** Limpar o carrinho do localStorage após a finalização da compra
  - **Necessidade:** Necessário
  - **Complexidade:** 3
  - **Responsável:** Igor Conrado

### Épico 8: Integração de Bibliotecas JS

- **Tarefa 8.1:** Pesquisar e escolher uma biblioteca para máscaras de input (ex: para CEP, CPF, cartão de crédito)
  - **Necessidade:** Desejável
  - **Complexidade:** 3
  - **Responsável:** Augusto Gama

- **Tarefa 8.2:** Integrar a biblioteca escolhida e aplicá-la nos formulários do checkout
  - **Necessidade:** Desejável
  - **Complexidade:** 5
  - **Responsável:** Tiago Lage

- **Tarefa 8.3:** Realizar ajustes pontuais de design necessários após a integração
  - **Necessidade:** Desejável
  - **Complexidade:** 3
  - **Responsável:** Augusto Gama

---

## Sprint 4: Desenvolvimento e Entrega

**Objetivo:** Garantir a qualidade do código com testes, publicar o projeto para acesso público e preparar todos os artefatos para a apresentação final.

### Épico 9: Testes e Qualidade

- **Tarefa 9.1:** Configurar o ambiente de testes com Jest para testes unitários
  - **Necessidade:** Desejável
  - **Complexidade:** 5
  - **Responsável:** Marcelo Reis

- **Tarefa 9.2:** Escrever testes unitários para funções críticas (ex: cálculo de total, aplicação de desconto)
  - **Necessidade:** Desejável
  - **Complexidade:** 8
  - **Responsável:** Igor Conrado

- **Tarefa 9.3:** Configurar o ambiente de testes com Cypress para testes end-to-end (E2E)
  - **Necessidade:** Desejável
  - **Complexidade:** 8
  - **Responsável:** Joshua Azze

- **Tarefa 9.4:** Escrever um teste E2E que simule a jornada principal do usuário (da Home à confirmação do pedido)
  - **Necessidade:** Desejável
  - **Complexidade:** 13
  - **Responsável:** Joshua Azze

### Épico 10: Publicação (Deploy)

- **Tarefa 10.1:** Configurar o repositório para fazer o deploy via GitHub Pages
  - **Necessidade:** Necessário
  - **Complexidade:** 3
  - **Responsável:** Tiago Lage

- **Tarefa 10.2:** Publicar a versão final do site e garantir que esteja acessível publicamente
  - **Necessidade:** Necessário
  - **Complexidade:** 3
  - **Responsável:** Marcelo Reis

- **Tarefa 10.3:** Atualizar o README.md com o link para o projeto publicado
  - **Necessidade:** Necessário
  - **Complexidade:** 1
  - **Responsável:** Tiago Lage

### Épico 11: Elaboração da Apresentação Final

- **Tarefa 11.1:** Criar a estrutura e o conteúdo dos slides para a apresentação
  - **Necessidade:** Necessário
  - **Complexidade:** 5
  - **Responsável:** Igor Conrado

- **Tarefa 11.2:** Gravar um vídeo ou GIFs demonstrando as principais funcionalidades
  - **Necessidade:** Desejável
  - **Complexidade:** 5
  - **Responsável:** Joshua Azze

- **Tarefa 11.3:** Ensaiar a apresentação final
  - **Necessidade:** Necessário
  - **Complexidade:** 3
  - **Responsável:** Augusto Gama

---

## Requisitos Funcionais

### Tarefa 2.2 - Página de Login
- Campo e-mail/usuário
- Campo senha
- Botão Entrar
- Link de criar conta
- Link esqueci minha senha
- Mensagem/área para status/erro de login

### Tarefa 2.3 - Página Home (index.html)
- Barra de busca ("Busque por produtos ou locais") com ícone de pesquisa
- Chips de filtro rápido: Hora/Hoje, Top, Próx(idade/local), Origem, Pagamento (ex.: "Pix"), Indique (referral)
- Grade de categorias (ex.: Serviços, Artesanais, Roupas, Bebidas) – cada card é clicável e leva ao catálogo filtrado
- Carrossel/Banner promocional
- Seções editoriais: Destaques / Elementos em destaque (listas horizontais com setas para rolar)
- Navegação global no topo e ícones buscar, favoritos, carrinho, perfil/conta
- Rodapé com atalhos (ícones) para áreas principais
- Página "Sobre/Institucional": bloco de texto institucional, botões de ação, mantém busca e navegação

### Tarefa 2.4 - Página Catálogo (catalogo.html)
- Barra de filtros: Marca/Tipo/Origem/Preço (abrir painéis de filtro/ordenação)
- Grade de cards de produto com imagem, nome, preço
- Paginação/carregamento incremental (indicadores no rodapé da lista)
- Ordenação (implícita na barra de filtros; ex.: por preço)

### Tarefa 2.5 - Página Detalhes do Produto (produto.html)
- Galeria de imagens (com indicadores/miniaturas em algumas versões)
- Título do produto
- Avaliação: estrelas + contagem de reviews
- Especificações/descrição curta
- Preço atual, preço anterior (tachado) e selo de desconto (%)
- Condições de pagamento (ex.: "no pix")
- Seletor de quantidade (– / +)
- Botões de ação: Adicionar ao carrinho e Comprar agora
- Ações secundárias (variações): favoritar/compartilhar
- Cálculo de frete/entrega (campo/área indicada em algumas versões)
- Opções/variantes (ex.: capacidade/cor – aparecem como blocos/miniaturas em versões com mini-cards abaixo da foto)

### Tarefa 2.6 - Página Carrinho (carrinho.html)
- Lista de itens com miniatura, nome e preço
- Controles por item (implícitos): remover/alterar quantidade
- Subtotal do carrinho
- Botão Concluir compra
- Cabeçalho com voltar, buscar, perfil/conta

### Tarefa 2.7 - Páginas de Checkout
- Título Pagamento e Subtotal destacado
- Seleção de endereço/retirada/entrega (ícones/etapas visuais)
- Seleção de método de pagamento (ex.: PIX com QR Code)
- Exibição do QR Code
- Botão Copiar código (PIX/QR)
- Acesso de navegação no topo (voltar, buscar, carrinho, perfil)

### Tarefa 2.8 - Navegação Global
- Voltar (seta)
- Menu hambúrguer (acesso a seções institucionais e categorias)
- Buscar (ícone de lupa)
- Favoritos (coração)
- Carrinho (ícone e acesso direto)
- Perfil/Conta (ícone de usuário)
