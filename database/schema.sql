-- ======================================================================
-- LUMINARY STORE — ENTERPRISE E-COMMERCE DATABASE SCHEMA & SEED DATA
-- Compatível com MySQL 8.0+, MariaDB, Aiven, PlanetScale, AWS RDS
-- ======================================================================

CREATE DATABASE IF NOT EXISTS `luminary_store`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `luminary_store`;

-- ----------------------------------------------------------------------
-- 1. TABELA DE CATEGORIAS
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `descricao` TEXT,
  `imagem` VARCHAR(500),
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- 2. TABELA DE PRODUTOS
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `categoria_id` INT,
  `categoria_slug` VARCHAR(100),
  `categoria_nome` VARCHAR(100),
  `nome` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `preco` DECIMAL(10,2) NOT NULL,
  `preco_antigo` DECIMAL(10,2) NULL,
  `estoque` INT DEFAULT 0,
  `imagem_principal` VARCHAR(500),
  `imagens_adicionais` JSON NULL,
  `descricao_curta` TEXT,
  `descricao_completa` LONGTEXT,
  `especificacoes` JSON NULL,
  `destaque` BOOLEAN DEFAULT FALSE,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_cat_slug` (`categoria_slug`),
  INDEX `idx_destaque` (`destaque`),
  FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- 3. TABELA DE USUÁRIOS
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `senha_hash` VARCHAR(255) NOT NULL,
  `telefone` VARCHAR(30) NULL,
  `role` ENUM('admin', 'user') DEFAULT 'user',
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- 4. TABELA DE PEDIDOS
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NULL,
  `cliente_nome` VARCHAR(150) NOT NULL,
  `cliente_email` VARCHAR(150) NOT NULL,
  `cliente_telefone` VARCHAR(30),
  `endereco_entrega` TEXT NOT NULL,
  `metodo_pagamento` VARCHAR(50) NOT NULL,
  `cupom_aplicado` VARCHAR(50) NULL,
  `subtotal` DECIMAL(10,2) DEFAULT 0.00,
  `desconto` DECIMAL(10,2) DEFAULT 0.00,
  `valor_frete` DECIMAL(10,2) DEFAULT 0.00,
  `total` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'Pendente',
  `data_pedido` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_cliente_email` (`cliente_email`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- 5. TABELA DE ITENS DO PEDIDO
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `itens_pedido` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pedido_id` INT NOT NULL,
  `produto_id` INT NULL,
  `quantidade` INT NOT NULL,
  `preco_unitario` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- 6. TABELA DE NEWSLETTER & LEADS VIP CLUB
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `newsletter_leads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `nome` VARCHAR(150) NULL,
  `origem` VARCHAR(100) DEFAULT 'home',
  `data_cadastro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- DADOS DE SEED INICIAIS (CATEGORIAS E PRODUTOS DE DESTAQUE)
-- ----------------------------------------------------------------------
INSERT IGNORE INTO `categorias` (`id`, `nome`, `slug`, `descricao`, `imagem`) VALUES
(1, 'Monitores Estúdio', 'monitores', 'Painéis 5K/8K de ultra definição com calibração 100% DCI-P3 para designers, coloristas e editores de vídeo de elite.', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600'),
(2, 'Áudio Profissional', 'audio', 'Fones estúdio open-back com planar magnéticos e microfones condensadores com cápsula de ouro e latência quase zero.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'),
(3, 'Ergonomia & Cadeiras', 'ergonomia', 'Cadeiras em malha autoadaptativa com estrutura de titânio e mesas com regulagem motriz de altura por gestos.', 'https://images.unsplash.com/photo-1580481077494-e3299ac2fef6?w=600'),
(4, 'Teclados Mecânicos', 'teclados', 'Switches magnéticos hall-effect com acionamento programável em 0.1mm, chassi em alumínio 6063 e keycaps PBT dubleshot.', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'),
(5, 'Setup & Docks', 'setup-docks', 'Docks Thunderbolt 4 multi-monitor, suportes articulados a gás e hubs com carregamento GaN ultra rápido de 240W.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600');

-- ----------------------------------------------------------------------
-- USUÁRIO ADMINISTRADOR PADRÃO
-- Senha de teste: 123456 (hash gerado por bcrypt)
-- ----------------------------------------------------------------------
INSERT IGNORE INTO `usuarios` (`id`, `nome`, `email`, `senha_hash`, `telefone`, `role`) VALUES
(1, 'Administrador Enterprise', 'admin@luminarystore.com.br', '$2b$10$cDewFF.iTpXYYSS.C9FSaus.g0nIjxt6zvIxXCm8DoCxT6jit1Dem', '(11) 99999-9999', 'admin');
