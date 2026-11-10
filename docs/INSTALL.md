# ⚙️ Guia de Instalação, Configuração e Deploy — Luminary Store

Este guia descreve os passos completos e padronizados para instalar, configurar, executar e realizar o deploy da plataforma **Luminary Store** em ambientes de desenvolvimento e produção.

---

## 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18.x ou superior)
- [npm](https://www.npmjs.com/) (ou yarn/pnpm)
- [MySQL Server](https://www.mysql.com/) (versão 8.0 ou MySQL MariaDB 10.x equivalente)
- Git

---

## 🛠️ 1. Configuração do Banco de Dados MySQL

1. Inicie o seu servidor MySQL (através de MySQL Workbench, XAMPP, Laragon, Docker ou terminal).
2. Acesse o seu cliente MySQL ou terminal e execute o script SQL incluído em nosso projeto:
   ```bash
   mysql -u root -p < backend/database/schema.sql
   ```
   *Nota: O script SQL cria o banco de dados `luminary_db` automaticamente se não existir, constrói todas as tabelas (`admins`, `clientes`, `produtos`, `categorias`, `pedidos`, `pedido_itens`, `newsletter`, `usuarios`) e popula dados iniciais (incluindo o administrador padrão).*

### 🔐 Credenciais Padrão do Administrador:
- **E-mail / Usuário:** `admin`
- **Senha:** `123456`

---

## 🚀 2. Configuração e Execução do Backend (API REST)

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie o arquivo de exemplo de ambiente `.env.example` para um novo arquivo `.env`:
   ```bash
   cp .env.example .env
   ```
4. Edite o arquivo `.env` com as suas credenciais locais do MySQL:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=sua_senha_do_mysql
   DB_NAME=luminary_db
   DB_PORT=3306
   JWT_SECRET=super_secret_luminary_enterprise_key_2026
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   ```
5. Inicie o servidor em modo de desenvolvimento (com auto-reload):
   ```bash
   npm run dev
   ```
   A API estará disponível em: `http://localhost:5000/api`

---

## 🖥️ 3. Configuração e Execução do Frontend (React + Vite)

1. Em um novo terminal, navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie ou verifique o arquivo `.env` no diretório raiz do frontend:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```
5. Abra no seu navegador o endereço fornecido no terminal (geralmente `http://localhost:5173`).

---

## 🌐 4. Instruções para Publicação (Deploy em Produção)

### 📦 Deploy do Frontend no Netlify
1. Conecte o repositório Git ao Netlify.
2. Nas configurações de build do Netlify, defina:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
3. Nas variáveis de ambiente (Environment Variables) do Netlify, adicione:
   - `VITE_API_URL`: A URL pública da sua API no provedor backend (ex: `https://api.luminarystore.com/api`).
4. Adicione um arquivo `public/_redirects` ou verifique se as rotas do React Router estão redirecionando para `index.html`:
   ```
   /* /index.html 200
   ```

### ⚙️ Deploy do Backend (Render / Railway / InfinityFree Node compatível)
1. Conecte a pasta `backend` ao seu provedor Node.js compatível.
2. Configure as variáveis de ambiente em seu host remoto idênticas ao `.env`, apontando `DB_HOST`, `DB_USER`, `DB_PASS` e `DB_NAME` para o banco MySQL hospedado em nuvem (como Railway MySQL, PlanetScale ou Aiven).
3. Defina o comando de start como:
   ```bash
   npm start
   ```
4. Verifique se o CORS aceita a URL gerada pelo Netlify para permitir requisições seguras da sua interface.

---
*Em caso de dúvidas na configuração de portas, permissões do MySQL ou certificados de segurança SSL, consulte os manuais da arquitetura no diretório `docs/`.*
