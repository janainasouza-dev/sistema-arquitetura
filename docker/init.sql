-- ============================================
-- BANCO DE DADOS - PADARIA DO ZÉ
-- Disciplina: Arquitetura de Software
-- 3º Período - ADS
-- ============================================

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL,
    estoque INTEGER NOT NULL DEFAULT 0,
    categoria_id INTEGER REFERENCES categorias(id),
    imagem_url VARCHAR(500),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    status VARCHAR(50) DEFAULT 'pendente',
    total NUMERIC(10,2) NOT NULL DEFAULT 0,
    observacao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) GENERATED ALWAYS AS (quantidade * preco_unitario) STORED
);

-- ============================================
-- ALUNOS: TABELAS ADICIONADAS
-- ============================================

-- Tabela de Funcionários (Nível 1 — atividade dos alunos)
CREATE TABLE IF NOT EXISTS funcionarios (
    id            SERIAL PRIMARY KEY,
    nome          VARCHAR(100)  NOT NULL,
    email         VARCHAR(100)  NOT NULL UNIQUE,
    telefone      VARCHAR(20),
    cargo         VARCHAR(60)   NOT NULL,
    turno         VARCHAR(10)   NOT NULL CHECK (turno IN ('manha', 'tarde', 'noite')),
    salario       NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    ativo         BOOLEAN       NOT NULL DEFAULT TRUE,
    criado_em     TIMESTAMP     NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Tabela de Fornecedores (Nível 1 — atividade dos alunos)
CREATE TABLE IF NOT EXISTS fornecedores (
    id        SERIAL PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    cnpj      VARCHAR(18)  NOT NULL UNIQUE,
    email     VARCHAR(100),
    telefone  VARCHAR(20),
    endereco  TEXT,
    ativo     BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Relacionamento: produtos podem ter um fornecedor principal
ALTER TABLE produtos
    ADD COLUMN IF NOT EXISTS fornecedor_id INTEGER REFERENCES fornecedores(id) ON DELETE SET NULL;

-- Tabela de Usuários (autenticação JWT — Nível 2)
CREATE TABLE IF NOT EXISTS usuarios (
    id         SERIAL PRIMARY KEY,
    nome       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    cargo      VARCHAR(60)  NOT NULL DEFAULT 'atendente',
    ativo      BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================

INSERT INTO categorias (nome, descricao) VALUES
    ('Pães', 'Pães artesanais e industriais'),
    ('Bolos', 'Bolos inteiros e fatias'),
    ('Salgados', 'Salgados assados e fritos'),
    ('Doces', 'Doces e sobremesas'),
    ('Bebidas', 'Bebidas quentes e frias');

INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id) VALUES
    ('Pão Francês', 'Pão francês crocante, unidade', 0.80, 200, 1),
    ('Pão de Forma Integral', 'Pão de forma integral 500g', 8.90, 30, 1),
    ('Pão de Queijo', 'Pão de queijo mineiro, unidade', 3.50, 100, 1),
    ('Bolo de Chocolate', 'Bolo de chocolate com cobertura, fatia', 7.00, 20, 2),
    ('Bolo de Cenoura', 'Bolo de cenoura com calda de chocolate, fatia', 6.50, 20, 2),
    ('Coxinha de Frango', 'Coxinha de frango cremosa, unidade', 5.00, 80, 3),
    ('Esfiha de Carne', 'Esfiha de carne temperada, unidade', 4.50, 60, 3),
    ('Pastel de Queijo', 'Pastel de queijo frito na hora, unidade', 4.00, 50, 3),
    ('Brigadeiro', 'Brigadeiro tradicional enrolado no granulado', 3.00, 100, 4),
    ('Quindim', 'Quindim de coco cremoso', 4.00, 30, 4),
    ('Café Expresso', 'Café expresso 50ml', 4.00, 999, 5),
    ('Suco de Laranja', 'Suco de laranja natural 300ml', 7.00, 50, 5);

INSERT INTO clientes (nome, email, telefone, endereco) VALUES
    ('João da Silva',   'joao@email.com',   '63 99999-1111', 'Rua das Flores, 123 - Araguaína/TO'),
    ('Maria Oliveira',  'maria@email.com',  '63 98888-2222', 'Av. Cônego João, 456 - Araguaína/TO'),
    ('Carlos Souza',    'carlos@email.com', '63 97777-3333', 'Rua Goiás, 789 - Araguaína/TO');

INSERT INTO pedidos (cliente_id, status, total, observacao) VALUES
    (1, 'entregue',   18.30, 'Entregar na portaria'),
    (2, 'em_preparo', 12.50, NULL),
    (3, 'pendente',   25.00, 'Sem cebola na esfiha');

INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
    (1, 1, 10, 0.80),
    (1, 3,  2, 3.50),
    (1, 9,  1, 3.00),
    (2, 6,  2, 5.00),
    (2, 11, 1, 4.00),
    (3, 7,  3, 4.50),
    (3, 4,  1, 7.00),
    (3, 12, 1, 7.00);

-- Funcionários iniciais
INSERT INTO funcionarios (nome, email, telefone, cargo, turno, salario) VALUES
    ('Ana Paula Silva',  'ana.silva@padaria.com',    '63 99101-1111', 'Padeira',   'manha', 2200.00),
    ('Carlos Souza',     'carlos.souza@padaria.com', '63 99202-2222', 'Atendente', 'tarde', 1600.00),
    ('Beatriz Lima',     'bia.lima@padaria.com',     '63 99303-3333', 'Caixa',     'manha', 1800.00),
    ('Roberto Ferreira', 'roberto.f@padaria.com',    '63 99404-4444', 'Gerente',   'manha', 3500.00),
    ('Fernanda Martins', 'fernanda.m@padaria.com',   '63 99505-5555', 'Padeira',   'noite', 2200.00);

-- Fornecedores iniciais
INSERT INTO fornecedores (nome, cnpj, email, telefone, endereco) VALUES
    ('Moinho Central Ltda',    '12.345.678/0001-90', 'contato@moinhocentral.com.br', '62 3201-1000', 'Av. Industrial, 100 — Goiânia/GO'),
    ('Distribuidora Doce Mel', '23.456.789/0001-01', 'vendas@docemel.com.br',        '63 3301-2000', 'Rua do Comércio, 55 — Palmas/TO'),
    ('Laticínios Bom Leite',   '34.567.890/0001-12', 'pedidos@bomleite.com.br',      '62 3401-3000', 'Rod. BR-153, km 10 — Anápolis/GO'),
    ('Embalagens Flex Pack',   '45.678.901/0001-23', 'flex@flexpack.com.br',          '61 3501-4000', 'SIA Trecho 3, Lote 25 — Brasília/DF'),
    ('Açucareira Norte S/A',   '56.789.012/0001-34', 'comercial@acucareiranorte.com', '63 3601-5000', 'Av. Tocantins, 300 — Araguaína/TO');

-- Usuário admin padrão (senha: 1234)
INSERT INTO usuarios (nome, email, senha_hash, cargo) VALUES
    (
        'Administrador',
        'admin@padaria.com',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
        'gerente'
    )
ON CONFLICT (email) DO NOTHING;