# 🌟 Luminary Store — E-Commerce Tech (WIP)

<div align="center">

  [![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
  [![Netlify](https://img.shields.io/badge/Deploy-Netlify_Demo-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://storeluminary.netlify.app/)

  <p align="center">
    Projeto experimental de e-commerce moderno com visual inspirado em marcas como Apple, Vercel e Linear.
  </p>

  <p align="center">
    🚀 <strong><a href="https://storeluminary.netlify.app/" target="_blank">Acesse a prévia no Netlify</a></strong> 🚀
  </p>

</div>

---

> ⚠️ **Aviso de Projeto em Desenvolvimento (Work in Progress):**  
> Este projeto foi criado para fins de **estudo, testes de arquitetura e aprendizado prático**. A aplicação **ainda não está 100% finalizada**, podendo conter inconsistências visuais, comportamentos incompletos ou *bugs* em algumas páginas e fluxos. Novas melhorias estão sendo implementadas aos poucos.

---

## 📌 Sobre o Projeto

A **Luminary Store** é uma simulação de loja virtual com catálogo de tecnologia, design limpo, suporte a modo escuro/claro e navegação fluida. O objetivo central é explorar conceitos de Clean Code, integração frontend/backend e o uso de IA no fluxo de desenvolvimento.

---

## 🤖 Uso de Inteligência Artificial no Desenvolvimento

Este repositório também serviu como experimento prático de **engenharia de software acelerada por IA**, explorando a colaboração entre desenvolvedor e LLMs em diferentes estágios:

* **Desenvolvimento Inicial & Arquitetura:** Uso do **Gemini 3.1 Pro (via Antigravity)** para estruturação da base do projeto, scaffolding do backend (Node.js/Express), criação do schema inicial do banco de dados (MySQL) e componentes em React.
* **Refinamento & Ajustes:** Uso do **Gemini 3.8 Medium** para ajustes finos de layout, correções de responsividade, preparação para o deploy e documentação.

> O foco foi testar a produtividade, avaliar o código gerado, resolver problemas de estilização e entender como integrar modelos de linguagem no dia a dia de desenvolvimento.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React 18, Vite, React Router DOM, SCSS Modules, Lucide React, Framer Motion
* **Backend:** Node.js, Express, JWT, Bcrypt, Multer
* **Banco de Dados:** MySQL
* **Deploy:** Netlify (Frontend)

---

## 🚧 Status e Pontos em Aberto (Bugs Conhecidos / Em Ajuste)

Como o projeto está em desenvolvimento contínuo, alguns pontos ainda estão sendo ajustados:

* [ ] Ajustes finos de responsividade em alguns componentes móveis.
* [ ] Integração total com backend em produção (a prévia do Netlify roda com simulação estática / mock).
* [ ] Finalização e testes completos de todos os endpoints e regras do painel admin.
* [ ] Polimento de mensagens de validação e feedback visual nos formulários.

---

## 💻 Como Rodar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/JonathanMz4/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Acesse em: `http://localhost:5173`

### 3. Backend (Opcional caso queira testar a API com MySQL)
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Acesse em: `http://localhost:5000`

---

## 👨‍💻 Autor

Desenvolvido por **Jonathan Menezes** para fins de aprendizado e experimentação técnica.

* **Demo Online:** [storeluminary.netlify.app](https://storeluminary.netlify.app/)
* **GitHub:** [@JonathanMz4](https://github.com/JonathanMz4)
* **LinkedIn:** [Jonathan Menezes](https://www.linkedin.com/in/jonathan-menezes-ti/)
