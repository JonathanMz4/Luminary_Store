# 🌟 Luminary Store — Enterprise E-Commerce Platform

<div align="center">

  [![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
  [![SCSS Modules](https://img.shields.io/badge/SCSS-Modules-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
  [![JWT](https://img.shields.io/badge/Auth-JWT_&_Bcrypt-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
  [![Netlify](https://img.shields.io/badge/Deploy-Netlify_Ready-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

  <p align="center">
    <strong>Plataforma e-commerce Full Stack corporativa inspirada nos mais altos padrões de design e engenharia da Apple, Stripe, Linear e Vercel.</strong>
  </p>

  <p align="center">
    <a href="#-visão-geral">Visão Geral</a> •
    <a href="#-engenharia-acelerada-por-ia-aiase">Engenharia com IA</a> •
    <a href="#-arquitetura-do-projeto">Arquitetura</a> •
    <a href="#-funcionalidades">Funcionalidades</a> •
    <a href="#-stack-tecnológica">Tecnologias</a> •
    <a href="#-como-executar-o-projeto">Como Executar</a> •
    <a href="#-credenciais-de-teste">Credenciais</a> •
    <a href="#-autor">Autor</a>
  </p>

</div>

---

## 📌 Visão Geral

O **Luminary Store** é uma plataforma e-commerce *enterprise-grade* de alta fidelidade desenvolvida para simular a operação real de uma empresa de tecnologia focada em hardware de estúdio, ergonomia e equipamentos de ponta.

O projeto foi concebido seguindo princípios de **Clean Code**, arquitetura desacoplada, segurança defensiva (Zero-Trust/OWASP), design system minimalista com suporte nativo a **Dark & Light Mode**, responsividade fluida (de 320px a 4K) e uma esteira completa de compra (da navegação com busca instantânea ao checkout e painel administrativo).

---

## 🤖 Engenharia Acelerada por IA (AI-Assisted Software Engineering)

Este projeto foi desenvolvido como um **laboratório prático e benchmark de desenvolvimento ágil assistido por Inteligência Artificial generativa**, demonstrando como ferramentas modernas de IA podem ser orquestradas por um desenvolvedor para elevar a velocidade de entrega sem abrir mão de rigor arquitetural, segurança e qualidade de código.

### 🔬 Metodologia e Modelos Utilizados:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FLUXO DE ENGENHARIA ASSISTIDA POR IA                   │
├───────────────────────────────────────┬─────────────────────────────────────┤
│ 🚀 FASE 1: ARQUITETURA & SCAFFOLDING  │ 🎯 FASE 2: POLIMENTO & PRODUÇÃO     │
│ Modelo: Gemini 3.1 Pro (Antigravity)  │ Modelo: Gemini 3.8 Medium           │
│                                       │                                     │
│ • Modelagem relacional DDL (MySQL)    │ • Refinamento de responsividade     │
│ • Arquitetura RESTful Express & Node  │ • Calibração de microespaçamentos   │
│ • Camada de Segurança (JWT, Bcrypt,   │ • Arquitetura Standalone Mock para  │
│   Rate Limiting, CORS, Helmet)        │   deploy estático instantâneo       │
│ • Design Tokens & SCSS Modular        │ • Testes de build de produção       │
│ • Criação dos 14 componentes base     │ • Documentação técnica para Git     │
└───────────────────────────────────────┴─────────────────────────────────────┘
```

> **Nota para Recrutadores e Avaliadores Técnicos:**  
> O uso do **Gemini 3.1 Pro no Antigravity** e do **Gemini 3.8 Medium** reflete uma abordagem intencional de **Pair Programming com IA**. Cada trecho gerado passou por auditoria manual, refatoração e validação de padrões de projeto (SOLID, Separation of Concerns e DRY), evidenciando competências em:
> - **Prompt Engineering & Architectural Steering:** Direcionamento preciso de requisitos técnicos e regras de negócio complexas.
> - **Auditoria de Segurança:** Garantia de que parâmetros SQL sejam parametrizados (`mysql2/promise`), senhas hasheadas com `bcrypt` (salt factor 10) e tokens assinados via `jsonwebtoken`.
> - **Domínio Full Stack:** Capacidade de orquestrar ponta a ponta desde o banco de dados até micro-animações no frontend.

---

## 🏗️ Arquitetura do Projeto

O repositório é organizado de forma modular e escalável em estrutura monorepo desacoplada:

```text
ProjetoWeb/
├── frontend/                     # Aplicação SPA (React 18 + Vite)
│   ├── public/                   # Ativos estáticos e regras de roteamento Netlify (_redirects)
│   ├── src/
│   │   ├── assets/               # Imagens, logotipos e ilustrações conceituais
│   │   ├── components/           # Componentes atômicos reutilizáveis (Navbar, Footer, Modal, etc.)
│   │   ├── context/              # Gestão de estado global desacoplada (Auth, Cart, Wishlist, Theme)
│   │   ├── pages/                # 14 Páginas Web (Home, Loja, Produto, Carrinho, Checkout, Admin, etc.)
│   │   ├── services/             # Cliente HTTP Axios + Adapter Mock para modo Standalone
│   │   ├── styles/               # Design Tokens, Mixins responsivos, Variáveis e Estilos Globais
│   │   └── utils/                # Formatadores de moeda (BRL), CEP, telefone e sanitização
│   ├── netlify.toml              # Especificação de build e cabeçalhos de segurança Netlify
│   └── vite.config.js            # Configurações de compilação rápida do Vite
│
├── backend/                      # Servidor HTTP & API RESTful (Node.js + Express)
│   ├── config/                   # Pool de conexões MySQL resiliente
│   ├── controllers/              # Regras de negócio e orquestração de requisições
│   ├── middlewares/              # Autenticação JWT, Proteção Admin, Rate Limit e Multer Uploads
│   ├── models/                   # Camada de persistência (Data Access Objects)
│   ├── routes/                   # Definição e versionamento das rotas REST
│   ├── uploads/                  # Armazenamento local para uploads de imagens
│   ├── app.js                    # Configuração dos middlewares do Express
│   └── server.js                 # Inicializador do servidor HTTP
│
├── database/                     # Scripts de Banco de Dados
│   └── schema.sql                # DDL completo das tabelas e dados seed iniciais
│
├── docs/                         # Documentação Técnica Adicional
│   ├── API.md                    # Dicionário de endpoints da API REST
│   └── INSTALL.md                # Guia detalhado de deploy e configuração de banco
│
├── .gitignore                    # Regras estritas de exclusão de artefatos temporários e senhas
└── README.md                     # Documentação executiva principal
```

---

## ✨ Funcionalidades Principais

### 🎨 Frontend & Design System
- **Estética Minimalista & Glassmorphism:** Efeitos de desfoque de fundo (`backdrop-filter`), bordas sutis e tipografia moderna (*Outfit* e *Inter*).
- **Modo Escuro / Claro Dinâmico:** Alternância de tema com persistência local e tokens CSS customizados.
- **Responsividade 100%:** Otimizado para telas de smartphones compactos (320px), tablets, notebooks e monitores ultrawide.
- **Menu Mobile Inteligente:** Navegação simplificada com hambúrguer animado e atalhos rápidos.
- **Micro-animações Elegantes:** Transições fluidas com `framer-motion` e ícones minimalistas com `lucide-react`.

### 🛍️ Experiência de Compra (E-Commerce B2C / B2B)
- **Vitrine & Home:** Banners de destaque, categorias e apresentação de diferenciais institucionais.
- **Catálogo com Busca Instantânea:** Autocomplete em tempo real, filtros por categoria, ordenação por preço/relevância e paginação.
- **Página de Produto (PDP):** Galeria de imagens, especificações técnicas detalhadas e cálculo dinâmico de frete por CEP.
- **Carrinho e Descontos:** Atualização de quantidades em tempo real e aplicação de cupons promocionais (`VIP20`, `LUMINARY10`).
- **Checkout Corporativo:** Validação de formulário multi-etapas, preenchimento automático de endereço por CEP e simulação de pagamentos (PIX, Cartão de Crédito e Boleto).
- **Lista de Desejos (Wishlist):** Adição e remoção rápida com persistência local.

### 🛡️ Painel Administrativo Enterprise (`/admin`)
- **Autenticação RBAC:** Rota administrativa com proteção por nível de acesso (*role: admin*).
- **Analytics com Chart.js:** Gráficos de receita mensal e distribuição de vendas por categoria.
- **Métricas em Tempo Real:** Total de faturamento, pedidos emitidos, clientes cadastrados e ticket médio.
- **CRUD Completo:** Gestão de catálogo (criação, edição e exclusão de produtos) e atualização de status logístico de pedidos.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Finalidade Técnica |
| :--- | :--- | :--- |
| **Frontend Core** | React 18 & Vite 5 | SPA com carregamento veloz e Hot Module Replacement (HMR) |
| **Roteamento** | React Router DOM v6 | Gestão de rotas dinâmicas, navegação sem recarregamento e rotas protegidas |
| **Estilização** | SCSS Modules | Escopo local de classes CSS, evitando conflitos globais de estilo |
| **Gerenciamento de Estado**| Context API | Gerenciamento desacoplado de Autenticação, Carrinho, Wishlist e Tema |
| **Formulários** | React Hook Form | Validação performática sem re-renderizações desnecessárias |
| **Animações & Gráficos** | Framer Motion & Chart.js | Microinterações premium e visualização de dados analíticos |
| **Backend Core** | Node.js & Express.js | API RESTful escalável, modular e assíncrona |
| **Persistência** | MySQL 8.0+ / In-Memory Fallback | Modelagem relacional estrita com suporte a execução sem dependências |
| **Segurança** | JWT, Bcrypt, Helmet, CORS | Autenticação stateless, hash seguro de senhas e mitigação de vulnerabilidades |
| **Uploads** | Multer | Gerenciamento de upload e armazenamento de mídia |
| **Deploy** | Netlify (Frontend) & Nuvem Node | Arquitetura pronta para deploy desacoplado contínuo |

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18+ instalado.
- Gerenciador de pacotes `npm` ou `yarn`.
- (Opcional) Instância do MySQL rodando localmente na porta `3306`.

---

### Opção A: Execução Imediata (Modo Standalone — Ideal para Apresentações Rápidas)
O projeto conta com um **Adapter de Mock Inteligente** integrado ao cliente Axios. Caso o backend não esteja ativo, o frontend continua navegável e totalmente funcional para demonstrações visuais.

1. **Acesse o frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Abra seu navegador em `http://localhost:5173`.

---

### Opção B: Execução Full Stack Completa (Frontend + Backend + Banco de Dados)

1. **Configurar o Banco de Dados:**
   - Execute o script SQL em `database/schema.sql` no seu MySQL (Workbench, phpMyAdmin, DBeaver ou terminal):
     ```bash
     mysql -u root -p < database/schema.sql
     ```

2. **Iniciar o Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Ajuste as credenciais do banco no arquivo .env se necessário
   npm run dev
   ```
   *O servidor Express iniciará em `http://localhost:5000`.*

3. **Iniciar o Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Acesse `http://localhost:5173` para interagir com a aplicação conectada à API.*

---

## 🔑 Credenciais de Teste

Para agilizar a avaliação do projeto por recrutadores e revisores técnicos:

### 🛡️ Painel Administrativo (`/admin-login` ou `/admin`)
- **Usuário:** `admin`
- **Senha:** `123456`

### 🎟️ Cupons de Desconto no Carrinho
- `VIP20` — 20% de desconto corporativo.
- `LUMINARY10` — 10% de desconto em todo o catálogo.

### 📬 CEPs para Simulação de Logística
- `01001-000` (São Paulo - SP)
- `20040-002` (Rio de Janeiro - RJ)

---

## ☁️ Instruções de Deploy

### 🌐 Frontend no Netlify
1. Conecte o repositório ao Netlify.
2. Defina as seguintes configurações de build:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
3. O arquivo `_redirects` já presente em `frontend/public/` garante suporte automático a rotas SPA (evitando erros 404).

### ⚙️ Backend no Render / Railway
1. Aponte o serviço para o diretório `backend/`.
2. Configure as variáveis de ambiente baseadas no `.env.example`.
3. Comando de início: `node server.js`.

---

## 👨‍💻 Autor

Desenvolvido por **Jonathan Menezes**.

- **GitHub:** [@JonathanMenezes](https://github.com/JonathanMenezes)
- **LinkedIn:** [Jonathan Menezes](https://www.linkedin.com/in/jonathan-menezes/)

---

<div align="center">
  <sub>Projeto desenvolvido com foco em excelência técnica, clean code e exploração de fluxos modernos de engenharia assistida por IA.</sub>
</div>
