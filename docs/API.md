# 📡 Documentação Completa da API REST — Luminary Store

A API RESTful do **Luminary Store** opera sob a arquitetura de requisições sem estado (stateless), utilizando autenticação via **JSON Web Tokens (JWT)** no cabeçalho de autorização (`Authorization: Bearer <TOKEN>`) e respondendo em formato padronizado `application/json`.

---

## 🔒 Autenticação & Autorização

### `POST /api/auth/login`
Autentica um cliente no sistema.
- **Corpo da requisição:**
  ```json
  {
    "email": "cliente@exemplo.com",
    "senha": "senha_segura_aqui"
  }
  ```
- **Resposta (200 OK):**
  ```json
  {
    "sucesso": true,
    "token": "eyJhbGciOiJIUzI1Ni...",
    "usuario": { "id": 1, "nome": "Cliente VIP", "email": "cliente@exemplo.com", "role": "cliente" }
  }
  ```

### `POST /api/auth/register`
Cadastra um novo cliente com criptografia Bcrypt.
- **Corpo da requisição:**
  ```json
  {
    "nome": "João da Silva",
    "email": "joao@exemplo.com",
    "telefone": "(11) 99999-9999",
    "senha": "minhasenha123"
  }
  ```

### `POST /api/auth/admin-login`
Autentica exclusivamente usuários com permissão de administrador (`admin` / `123456`).

---

## 📦 Produtos

### `GET /api/products`
Retorna lista paginada de produtos com opções de busca e filtro.
- **Parâmetros Query Opcionais:**
  - `q`: Busca textual (nome ou descrição)
  - `categoria`: Slug ou ID da categoria
  - `minPrice`: Preço mínimo
  - `maxPrice`: Preço máximo
  - `sort`: Ordenação (`preco_asc`, `preco_desc`, `relevancia`, `novos`)
  - `page`: Número da página (padrão: 1)
  - `limit`: Itens por página (padrão: 12)

### `GET /api/products/:id`
Retorna todos os detalhes, imagens, estoque e especificações de um produto específico.

### `POST /api/products` *(Requer Auth Admin)*
Cadastra um novo produto na loja (aceita form-data com imagens processadas pelo Multer).

### `PUT /api/products/:id` *(Requer Auth Admin)*
Atualiza os dados de um produto existente.

### `DELETE /api/products/:id` *(Requer Auth Admin)*
Exclui logicamente ou fisicamente um produto.

---

## 🏷️ Categorias

### `GET /api/categories`
Retorna a lista de categorias disponíveis no catálogo com contagem de itens.

### `POST /api/categories` *(Requer Auth Admin)*
Cria uma nova categoria (nome, slug, descrição, ícone/imagem).

---

## 🛒 Pedidos & Checkout

### `POST /api/orders`
Registra um novo pedido a partir do checkout de um cliente.
- **Corpo da requisição:**
  ```json
  {
    "cliente_id": 1,
    "itens": [
      { "produto_id": 10, "quantidade": 2, "preco_unitario": 299.90 }
    ],
    "endereco_entrega": {
      "cep": "01001-000",
      "logradouro": "Praça da Sé",
      "numero": "100",
      "cidade": "São Paulo",
      "estado": "SP"
    },
    "metodo_pagamento": "pix",
    "subtotal": 599.80,
    "frete": 15.00,
    "desconto": 0.00,
    "total": 614.80
  }
  ```

### `GET /api/orders/me` *(Requer Auth Cliente)*
Lista o histórico completo de pedidos do cliente autenticado.

### `GET /api/orders` *(Requer Auth Admin)*
Retorna todos os pedidos da loja, com filtros por status e data para a gestão administrativa.

### `PUT /api/orders/:id/status` *(Requer Auth Admin)*
Altera o status logístico do pedido (`Pendente`, `Em Processamento`, `Enviado`, `Entregue`, `Cancelado`).

---

## 🎯 Captação de Leads & Newsletter

### `POST /api/newsletter`
Captura dados de visitantes na Landing Page VIP ou Rodapé.
- **Corpo da requisição:**
  ```json
  {
    "nome": "Maria Souza",
    "email": "maria@exemplo.com",
    "telefone": "(21) 98888-7777",
    "origem": "landing_page_vip"
  }
  ```

### `GET /api/newsletter` *(Requer Auth Admin)*
Lista todos os leads capturados na base de dados para exportação de marketing.

---

## 📊 Dashboard Estatístico (Painel Admin)

### `GET /api/dashboard/stats` *(Requer Auth Admin)*
Fornece métricas agregadas do sistema em tempo real:
- Faturamento total do mês e histórico comparativo.
- Contagem total de clientes, produtos ativos e pedidos em andamento.
- Dados formatados para plotagem com Chart.js (vendas diárias/mensais e divisão de categorias).

---

## 👥 Clientes (CRUD Admin)

### `GET /api/clients` *(Requer Auth Admin)*
Lista todos os clientes cadastrados com busca por nome/email e paginação.

### `DELETE /api/clients/:id` *(Requer Auth Admin)*
Remove ou inativa a conta de um cliente pela administração.
