# 🌟 Luminary Store — Enterprise E-Commerce Platform

![Luminary Store Banner](https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop)

> **Vencendo os limites do e-commerce moderno.** Uma plataforma corporativa premium de alto desempenho inspirada nos designs minimalistas e elegantes da Apple, Vercel, Linear, Shopify e Stripe.

---

## ⚡ Visão Geral do Projeto

O **Luminary Store** é uma plataforma e-commerce Full Stack completa, desenvolvida seguindo rigorosamente os padrões de arquitetura de software empresarial, clean code e design escalável. O sistema oferece a jornada completa de compra do usuário (B2C), desde uma vitrine altamente atrativa com busca instantânea e simulação de frete/pagamento, até uma landing page VIP de captação de leads e um Painel Administrativo avançado com gráficos interativos em tempo real.

---

## 🏗️ Arquitetura e Stack Tecnológica

### 💻 Frontend
- **Framework Core:** React 18 com Vite + React Router DOM v6
- **Gerenciamento de Estado:** Context API (`AuthContext`, `CartContext`, `WishlistContext`, `ThemeContext`)
- **Estilização & Design System:** SCSS / CSS Modules, Variáveis CSS para Dark/Light Mode, Glassmorphism e Design Tokens
- **Animações & Ícones:** Framer Motion e Lucide React Icons
- **Formulários & Validações:** React Hook Form
- **Gráficos (Analytics):** Chart.js & React-Chartjs-2
- **Integração HTTP:** Axios com interceptores para JWT Auth Token

### ⚙️ Backend & API REST
- **Runtime & Framework:** Node.js + Express.js
- **Banco de Dados:** MySQL (via `mysql2/promise` com Pool de Conexões)
- **Autenticação & Segurança:** JWT (JSON Web Tokens), Bcrypt (Hash de senhas), Helmet, CORS, Express Rate Limit, Sanitização de Inputs
- **Upload de Arquivos:** Multer (armazenamento local otimizado para imagens de produtos e banners)
- **Variáveis de Ambiente:** Dotenv

---

## 💎 Principais Funcionalidades

### 🛍️ Jornada do Cliente (Loja Virtual)
- **Landing Page & Hero Dynamic:** Banner de alta impacto visual com estatísticas e call-to-actions claros.
- **Catálogo & Loja Interativa:** Filtros por categoria, ordenação por preço/relevância, slider de faixa de preço, busca instantânea e paginação.
- **Página de Produto (PDP):** Galeria interativa com zoom, seletor de quantidades, cálculo de frete por CEP, especificações técnicas e carrossel de produtos relacionados.
- **Carrinho Inteligente:** Alteração de quantidade em tempo real, cupom de desconto fictício (`LUMINARY10`), subtotal, frete e total.
- **Checkout Corporativo:** Formulário de endereço multi-etapas, simulação de métodos de pagamento (Pix, Cartão de Crédito com parcelamento e Boleto), animação de confete ao finalizar.
- **Captação VIP de Leads:** Landing Page exclusiva com validação instantânea para cadastro em clube de benefícios e lançamentos.
- **Funcionalidades Extras:** Lista de Desejos (Favoritos), Botão flutuante de WhatsApp, Dark Mode com transição suave, Banner de Cookies (GDPR/LGPD), Perguntas Frequentes (FAQ), Políticas de Privacidade e Termos de Uso.

### 🛡️ Painel Administrativo (Admin Dashboard)
- **Acesso Exclusivo:** Protegido por autenticação corporativa e verificação de privilégios (`role: 'admin'`).
- **Credenciais de Acesso Padrão:**
  - **Usuário:** `admin`
  - **Senha:** `123456`
- **Dashboard Estatístico:** Cartões com KPIs totais (Vendas, Clientes, Produtos, Pedidos), gráficos de receita mensal, distribuição de status de pedidos e categorias mais vendidas.
- **CRUD Completo de Produtos:** Cadastro, edição, exclusão, controle de estoque, preço e upload de múltiplas imagens via Multer.
- **CRUD de Clientes & Leads:** Gestão completa de clientes registrados e visualização dos leads capturados pela página VIP.
- **Gestão de Pedidos:** Acompanhamento de pedidos em tempo real, visualização de itens e atualização de status logístico (`Pendente`, `Em Processamento`, `Enviado`, `Entregue`, `Cancelado`).

---

## 📐 Responsividade Total

A interface foi projetada para perfeita fluidez em **todas as resoluções**:
- Mobile Pequeno: `320px`, `375px`, `425px`
- Tablets & Foldables: `768px`, `1024px`
- Laptops & Desktops: `1280px`, `1366px`, `1440px`, `1600px`, `1920px`

---

## 📂 Estrutura Organizacional

```bash
project/
├── backend/            # API REST com Node.js, Express e MySQL
├── docs/               # Documentação completa do sistema
└── frontend/           # Aplicação Client-Side com React 18 e Vite
```

Consulte os guias detalhados na pasta `docs/`:
- [Guia de Instalação e Deploy](./INSTALL.md)
- [Documentação da API REST](./API.md)

---
*Desenvolvido por Engenharia Sênior Full Stack para padrão de excelência corporativa.*
