-- ====================================================================
-- LUMINARY STORE — ENTERPRISE E-COMMERCE DATABASE SCHEMA
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `luminary_db`
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `luminary_db`;

-- --------------------------------------------------------------------
-- 1. TABELA DE USUÁRIOS (SISTEMA GERAL DE CONTAS / CREDENCIAIS)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `senha` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('ativo', 'inativo', 'bloqueado') NOT NULL DEFAULT 'ativo',
  `ultimo_login` DATETIME DEFAULT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_usuarios_email` (`email`),
  INDEX `idx_usuarios_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. TABELA DE ADMINS (GESTORES E SUPERVISORES DO PAINEL)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT UNSIGNED DEFAULT NULL,
  `usuario` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `senha` VARCHAR(255) NOT NULL,
  `nome_completo` VARCHAR(150) NOT NULL,
  `cargo` VARCHAR(100) DEFAULT 'Administrador Geral',
  `nivel_acesso` ENUM('super_admin', 'gerente', 'atendimento') NOT NULL DEFAULT 'super_admin',
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_admin_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  INDEX `idx_admins_usuario` (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. TABELA DE CLIENTES (DADOS PESSOAIS E FISICAIS DOS COMPRADORES)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT UNSIGNED DEFAULT NULL,
  `nome` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `telefone` VARCHAR(30) DEFAULT NULL,
  `cpf` VARCHAR(20) DEFAULT NULL,
  `data_nascimento` DATE DEFAULT NULL,
  `cep` VARCHAR(15) DEFAULT NULL,
  `logradouro` VARCHAR(200) DEFAULT NULL,
  `numero` VARCHAR(20) DEFAULT NULL,
  `complemento` VARCHAR(100) DEFAULT NULL,
  `bairro` VARCHAR(100) DEFAULT NULL,
  `cidade` VARCHAR(100) DEFAULT NULL,
  `estado` VARCHAR(5) DEFAULT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cliente_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  INDEX `idx_clientes_email` (`email`),
  INDEX `idx_clientes_nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. TABELA DE CATEGORIAS (CATÁLOGO DA LOJA)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `descricao` TEXT DEFAULT NULL,
  `icone` VARCHAR(100) DEFAULT 'box',
  `imagem` VARCHAR(255) DEFAULT NULL,
  `destaque` BOOLEAN DEFAULT FALSE,
  `ordem` INT DEFAULT 0,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_categorias_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. TABELA DE PRODUTOS (ITENS À VENDA COM ESTOQUE E PREÇO)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `categoria_id` INT UNSIGNED NOT NULL,
  `nome` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `descricao_curta` VARCHAR(500) DEFAULT NULL,
  `descricao_detalhada` LONGTEXT DEFAULT NULL,
  `preco` DECIMAL(10, 2) NOT NULL,
  `preco_antigo` DECIMAL(10, 2) DEFAULT NULL,
  `estoque` INT NOT NULL DEFAULT 0,
  `sku` VARCHAR(100) UNIQUE DEFAULT NULL,
  `imagem_principal` VARCHAR(500) DEFAULT NULL,
  `imagens_adicionais` JSON DEFAULT NULL,
  `especificacoes` JSON DEFAULT NULL,
  `destaque` BOOLEAN DEFAULT FALSE,
  `lancamento` BOOLEAN DEFAULT FALSE,
  `vendas` INT UNSIGNED DEFAULT 0,
  `avaliacao_media` DECIMAL(3, 2) DEFAULT 5.00,
  `numero_avaliacoes` INT UNSIGNED DEFAULT 1,
  `ativo` BOOLEAN DEFAULT TRUE,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_produto_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE RESTRICT,
  INDEX `idx_produtos_categoria` (`categoria_id`),
  INDEX `idx_produtos_slug` (`slug`),
  INDEX `idx_produtos_preco` (`preco`),
  INDEX `idx_produtos_destaque` (`destaque`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. TABELA DE PEDIDOS (HISTÓRICO E GESTÃO LOGÍSTICA DE VENDAS)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `codigo_pedido` VARCHAR(30) NOT NULL UNIQUE,
  `cliente_id` INT UNSIGNED NOT NULL,
  `status` ENUM('Pendente', 'Em Processamento', 'Enviado', 'Entregue', 'Cancelado') NOT NULL DEFAULT 'Pendente',
  `metodo_pagamento` VARCHAR(50) NOT NULL DEFAULT 'pix',
  `status_pagamento` ENUM('Aguardando', 'Aprovado', 'Recusado', 'Estornado') NOT NULL DEFAULT 'Aguardando',
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `frete` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `desconto` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(10, 2) NOT NULL,
  `endereco_entrega` JSON NOT NULL,
  `observacoes` TEXT DEFAULT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pedido_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  INDEX `idx_pedidos_cliente` (`cliente_id`),
  INDEX `idx_pedidos_codigo` (`codigo_pedido`),
  INDEX `idx_pedidos_status` (`status`),
  INDEX `idx_pedidos_criado_em` (`criado_em`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. TABELA DE ITENS DE PEDIDOS (RELAÇÃO PRODUTO x PEDIDO)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedido_itens` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `pedido_id` INT UNSIGNED NOT NULL,
  `produto_id` INT UNSIGNED NOT NULL,
  `nome_produto` VARCHAR(200) NOT NULL,
  `preco_unitario` DECIMAL(10, 2) NOT NULL,
  `quantidade` INT UNSIGNED NOT NULL,
  `subtotal` DECIMAL(10, 2) NOT NULL,
  CONSTRAINT `fk_item_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_item_produto` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`) ON DELETE RESTRICT,
  INDEX `idx_pedido_itens_pedido` (`pedido_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 8. TABELA DE NEWSLETTER & CAPTAÇÃO DE LEADS (VIP E FOOTER)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `newsletter` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `telefone` VARCHAR(30) DEFAULT NULL,
  `origem` VARCHAR(50) DEFAULT 'footer',
  `ativo` BOOLEAN DEFAULT TRUE,
  `cadastrado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_newsletter_email` (`email`),
  INDEX `idx_newsletter_origem` (`origem`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- DADOS DE SEED INICIAIS (CATÁLOGO DE PRODUTOS PREMIUM E CONTAS VIP)
-- ====================================================================

-- Inserindo Categorias Corporativas
INSERT IGNORE INTO `categorias` (`id`, `nome`, `slug`, `descricao`, `icone`, `destaque`, `ordem`) VALUES
(1, 'Áudio Premium', 'audio-premium', 'Fones de ouvido com cancelamento de ruído e acústica de grau estúdio.', 'headphones', 1, 1),
(2, 'Monitores & Displays', 'monitores', 'Telas 4K e 5K Ultra-HD com calibração de cor de precisão milimétrica.', 'monitor', 1, 2),
(3, 'Periféricos Pro', 'perifericos', 'Teclados mecânicos customizados e mouses ergonômicos para alta performance.', 'cpu', 1, 3),
(4, 'Smart devices', 'smart-devices', 'Relógios inteligentes e estações de carregamento wi-fi minimalistas.', 'watch', 1, 4),
(5, 'Acessórios Tech', 'acessorios', 'Cabos trançados de titânio, suportes de alumínio aeronáutico e capas.', 'shield', 0, 5);

-- Inserindo Produtos Premium (Inspirados no Apple/Stripe aesthetic)
INSERT IGNORE INTO `produtos` (`id`, `categoria_id`, `nome`, `slug`, `descricao_curta`, `descricao_detalhada`, `preco`, `preco_antigo`, `estoque`, `sku`, `imagem_principal`, `imagens_adicionais`, `especificacoes`, `destaque`, `lancamento`, `vendas`, `avaliacao_media`) VALUES
(1, 1, 'Luminary Acoustic Studio Pro', 'luminary-acoustic-studio-pro', 'Fone over-ear sem fio com Áudio Espacial Tridimensional, cancelamento ativo de ruído adaptativo e acabamento em alumínio escovado.', 'O Luminary Acoustic Studio Pro redefine a fidelidade sonora corporativa e pessoal. Projetado em laboratórios acústicos na Suíça, utiliza drivers de berílio customizados para entregar graves cristalinos e agudos sem distorção. A bateria de longa duração garante 45 horas ininterruptas de imersão total com ANC ligado. Conforto ergonômico em almofadas de couro de carneiro.', 2499.00, 2899.00, 25, 'LUM-AUD-PRO-001', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop"]', '{"Conectividade": "Bluetooth 5.3 + USB-C Lossless", "Autonomia": "45 horas com ANC", "Peso": "290g", "Garantia": "2 anos corporativa"}', 1, 1, 142, 4.9),
(2, 2, 'Luminary Retina Display 5K 27"', 'luminary-retina-display-5k', 'Monitor profissional com painel Nano-IPS, brilho de 600 nits, cobertura 99% DCI-P3 e hub Thunderbolt 4 integrado de 100W.', 'Uma obra-prima visual para engenheiros, designers e profissionais que exigem precisão absoluta. O Luminary Retina Display possui calibração individual de fábrica (Delta E < 1), revestimento antirreflexo molecular e estrutura única em alumínio usinado. Conecte seu laptop via um único cabo Thunderbolt para carregar com 100W e transmitir vídeo 5K a 60Hz.', 6899.00, 7499.00, 12, 'LUM-DISP-5K-002', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop"]', '{"Resolução": "5120 x 2880 (5K)", "Portas": "2x Thunderbolt 4, 3x USB-C 10Gbps", "Painel": "Nano-IPS 10-bit", "Ajustes": "Altura, inclinação e rotação 90°"}', 1, 0, 84, 5.0),
(3, 3, 'Luminary Apex Mechanical Keyboard', 'luminary-apex-mechanical-keyboard', 'Teclado mecânico low-profile wireless com corpo em alumínio maciço, switches silenciados e retroiluminação RGB sutil.', 'A digitação silenciosa e ágil que o ambiente de trabalho moderno pede. Com formato 75% ultracompacto, keycaps em PBT de dupla injeção resistentes ao desgaste e switches lineares calibrados para menor fadiga nos dedos. Autonomia sem fio de até 6 meses sem iluminação ou 40 horas com brilho máximo.', 1299.00, 1499.00, 40, 'LUM-KEY-APEX-003', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1000&auto=format&fit=crop"]', '{"Switches": "Luminary Linear Silent", "Estrutura": "Alumínio Anodizado Cinza Espacial", "Conexão": "2.4GHz Dongle + Bluetooth 5.0 + Cabo", "Bateria": "4000 mAh"}', 1, 1, 320, 4.8),
(4, 4, 'Luminary Chronos Ultra Smartwatch', 'luminary-chronos-ultra-smartwatch', 'Smartwatch de titânio aeroespacial com tela AMOLED safira de 1.9", sensores biométricos clínicos e 10 dias de bateria.', 'Construído para suportar desde reuniões executivas até expedições externas extremas. Moldado com bloco sólido de titânio grau 5 e vidro de cristal de safira inquebrável. Mede oxigenação do sangue, eletrocardiograma (ECG), nível de stress em tempo real e qualidade do sono profundo com algoritmos neurais proprietários.', 3499.00, 3999.00, 18, 'LUM-WAT-CHRO-004', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000&auto=format&fit=crop"]', '{"Caixa": "49mm Titânio Grau 5", "Vidro": "Cristal de Safira", "Resistência": "10 ATM (100 metros)", "Autonomia": "Até 10 dias de uso normal"}', 1, 0, 95, 4.9),
(5, 3, 'Luminary ErgoMaster Wireless Mouse', 'luminary-ergomaster-wireless-mouse', 'Mouse ergonômico vertical com sensor óptico de 8000 DPI, rolagem magnética hiperveloz e clique silencioso de precisão.', 'Desenvolvido em parceria com ergonomistas e fisioterapeutas para eliminar tensões no pulso e antebraço. A inclinação natural de 57 graus coloca a mão na posição de aperto de mão sem esforço. Roda de rolagem magnética inteligente alterna entre modo passo a passo e voo livre para navegar por 10.000 linhas de código por segundo.', 649.00, 799.00, 60, 'LUM-MOU-ERGO-005', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop"]', '{"DPI": "800 a 8000 DPI ajustáveis", "Botões": "7 programáveis", "Conexão": "Bluetooth e Receptor LogiBolt", "Peso": "135g"}', 0, 0, 410, 4.7),
(6, 4, 'Luminary MagDock 3-in-1 Station', 'luminary-magdock-3in1-station', 'Estação de carregamento magnética em alumínio maciço com carregamento rápido simultâneo para smartphone, smartwatch e fones.', 'O minimalismo definitivo para a sua mesa de trabalho ou cabeceira. Elimine cabos com esta estação escultural em alumínio anodizado prata e base em silicone antiderrapante. Alinhamento magnético forte (estilo MagSafe) e proteção térmica avançada contra sobrecarga e aquecimento.', 799.00, 899.00, 35, 'LUM-DOC-MAG-006', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop"]', '{"Saída Total": "30W Fast Wireless", "Material": "Alumínio Anodizado e Couro Vegano", "Compatibilidade": "Universal Qi / MagSafe", "Cabo Incluso": "USB-C para USB-C trançado 2m"}', 0, 1, 180, 4.9),
(7, 1, 'Luminary AirPods Pro Pods', 'luminary-airpods-pro-pods', 'Fones in-ear com áudio de alta resolução, cancelamento ativo de ruído superior e estojo de carregamento com áudio localizador.', 'A menor e mais potente solução de áudio portátil já criada pela Vendas Luminary. Com drivers customizados e processador neural Dual-Core, identifica e anula o ruído do escritório em milissegundos. Resposta a gestos de toque de precisão para chamadas de áudio imaculadas com 3 microfones direcionais em cada fone.', 1599.00, 1899.00, 50, 'LUM-AUD-EAR-007', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000&auto=format&fit=crop"]', '{"Autonomia": "8h contínuas (36h com estojo)", "Proteção": "IPX5 Resistente à água e suor", "Transmissão": "Codec LHDC 5.0 Hi-Res", "Estojo": "Carregamento Qi sem fio"}', 0, 0, 520, 4.8),
(8, 5, 'Luminary Aluminum Laptop Stand Pro', 'luminary-aluminum-laptop-stand', 'Suporte ergonômico elevado e ajustável em 360° para laptops e macbooks de 13 a 17 polegadas em alumínio usinado.', 'Projetado na mesma liga de alumínio usada na indústria aeroespacial, este suporte melhora drasticamente a circulação de ar do notebook enquanto posiciona sua tela na altura ideal dos olhos. Dobradiças de precisão suportam até 10kg sem flexionar. Dobrável para transporte em mochila executiva.', 499.00, 599.00, 70, 'LUM-ACC-STA-008', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000&auto=format&fit=crop"]', '{"Capacidade": "Laptops de 11 a 17.3 polegadas", "Ajuste de Altura": "4cm até 28cm", "Material": "Alumínio Liga 6061 com pads de silicone", "Peso do Produto": "850g"}', 0, 0, 290, 5.0);

-- Inserindo Leads de Exemplo para Teste do Painel
INSERT IGNORE INTO `newsletter` (`id`, `nome`, `email`, `telefone`, `origem`) VALUES
(1, 'Carlos Eduardo Santos', 'carlos.santos@exemplo.com', '(11) 98765-4321', 'landing_page_vip'),
(2, 'Fernanda Lima Souza', 'fernanda.lima@exemplo.com', '(21) 99887-7665', 'landing_page_vip'),
(3, 'Roberto Mendes', 'roberto.mendes@techcorp.io', '(31) 97766-5544', 'footer'),
(4, 'Juliana Alves', 'juliana.alves@designlab.br', '(41) 96655-4433', 'landing_page_vip');

-- Inserindo Contas de Teste no Sistema (Cliente e Admin)
-- Nota: A senha de todos é 'Admin@123' / '123456' hash no padrão bcryp $2b$10$...
-- O backend irá criar automaticamente as senhas via bcrypt se não existirem no boot.
INSERT IGNORE INTO `usuarios` (`id`, `nome`, `email`, `senha`, `role`) VALUES
(1, 'Administrador Luminary', 'admin', '$2b$10$EPD/p7p58oI3x3T/L3oRz.wF5nE0R9oX3/BqL.e0X.e0X.e0X.e0X', 'admin'),
(2, 'Jonathan Menezes VIP', 'jonathan@luminary.com', '$2b$10$EPD/p7p58oI3x3T/L3oRz.wF5nE0R9oX3/BqL.e0X.e0X.e0X.e0X', 'cliente'),
(3, 'Mariana Vasconcelos', 'mariana.v@exemplo.com', '$2b$10$EPD/p7p58oI3x3T/L3oRz.wF5nE0R9oX3/BqL.e0X.e0X.e0X.e0X', 'cliente');

INSERT IGNORE INTO `admins` (`id`, `usuario_id`, `usuario`, `email`, `senha`, `nome_completo`, `cargo`, `nivel_acesso`) VALUES
(1, 1, 'admin', 'admin@luminarystore.com', '$2b$10$EPD/p7p58oI3x3T/L3oRz.wF5nE0R9oX3/BqL.e0X.e0X.e0X.e0X', 'Administrador Luminary', 'Diretor Geral de Operações', 'super_admin');

INSERT IGNORE INTO `clientes` (`id`, `usuario_id`, `nome`, `email`, `telefone`, `cpf`, `data_nascimento`, `cep`, `logradouro`, `numero`, `bairro`, `cidade`, `estado`) VALUES
(1, 2, 'Jonathan Menezes VIP', 'jonathan@luminary.com', '(11) 99999-8888', '123.456.789-00', '1990-05-15', '01001-000', 'Praça da Sé', '100', 'Sé', 'São Paulo', 'SP'),
(2, 3, 'Mariana Vasconcelos', 'mariana.v@exemplo.com', '(21) 98888-9999', '987.654.321-11', '1993-11-20', '20040-002', 'Avenida Rio Branco', '450', 'Centro', 'Rio de Janeiro', 'RJ');

-- Inserindo Pedidos Simulados no Histórico para Popular Gráficos do Dashboard
INSERT IGNORE INTO `pedidos` (`id`, `codigo_pedido`, `cliente_id`, `status`, `metodo_pagamento`, `status_pagamento`, `subtotal`, `frete`, `desconto`, `total`, `endereco_entrega`, `observacoes`) VALUES
(1, 'LUM-2026-9081', 1, 'Entregue', 'pix', 'Aprovado', 2499.00, 0.00, 249.90, 2249.10, '{"cep": "01001-000", "logradouro": "Praça da Sé", "numero": "100", "cidade": "São Paulo", "estado": "SP"}', 'Pedido entregue no escritório principal.'),
(2, 'LUM-2026-9082', 2, 'Enviado', 'cartao', 'Aprovado', 1299.00, 15.00, 0.00, 1314.00, '{"cep": "20040-002", "logradouro": "Avenida Rio Branco", "numero": "450", "cidade": "Rio de Janeiro", "estado": "RJ"}', 'Envio prioritário via Sedex.'),
(3, 'LUM-2026-9083', 1, 'Em Processamento', 'pix', 'Aprovado', 6899.00, 0.00, 0.00, 6899.00, '{"cep": "01001-000", "logradouro": "Praça da Sé", "numero": "100", "cidade": "São Paulo", "estado": "SP"}', 'Aguardando teste de calibração do monitor na expedição.');

INSERT IGNORE INTO `pedido_itens` (`id`, `pedido_id`, `produto_id`, `nome_produto`, `preco_unitario`, `quantidade`, `subtotal`) VALUES
(1, 1, 1, 'Luminary Acoustic Studio Pro', 2499.00, 1, 2499.00),
(2, 2, 3, 'Luminary Apex Mechanical Keyboard', 1299.00, 1, 1299.00),
(3, 3, 2, 'Luminary Retina Display 5K 27"', 6899.00, 1, 6899.00);

-- FIM DO SCRIPT
