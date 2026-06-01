🥖 Padaria WeCoffe — Sistema de Gestão com Microsserviços
Disciplina: Arquitetura de Software | 3º Período ADS

📦 Como Rodar o Projeto (Passo a Passo)

Pré-requisitos

    Docker Desktop instalado: https://www.docker.com/products/docker-desktop

    Git instalado

    Portas 3000, 3001, 3002, 3003, 5050, 5433 disponíveis

1. Clonar o repositório
bash

git clone https://github.com/seu-usuario/sistema-arquitetura.git
cd sistema-arquitetura

2. Configurar variáveis de ambiente do frontend
bash

# Criar arquivo .env na pasta frontend
cat > frontend/.env << EOF
REACT_APP_API_PRODUTOS=http://localhost:3001/api
REACT_APP_API_PEDIDOS=http://localhost:3002/api
REACT_APP_API_FUNCIONARIOS=http://localhost:3003/api
EOF

3. Subir todos os contêineres
bash

# Primeira vez ou após alterações
docker compose up -d --build

# Apenas iniciar (após já ter subido antes)
docker compose start

# Parar o sistema (mantém dados)
docker compose stop

# Parar e remover tudo (limpa dados)
docker compose down -v

4. Acessar o Sistema

Serviço	URL	Credenciais
Frontend (React)	http://localhost:3000	admin@padaria.com / 1234
Backend Produtos	http://localhost:3001/health	-
Backend Pedidos	http://localhost:3002/health	-
Backend Funcionários	http://localhost:3003/health	-
pgAdmin (banco)	http://localhost:5050	admin@pgadmin.com / admin

5. Login no pgAdmin

    Email: admin@pgadmin.com

    Senha: admin

6. Conectar ao banco no pgAdmin

    Clique em "Add New Server"

    Na aba General: Name = Padaria WeCoffe

    Na aba Connection:

        Host: postgres

        Port: 5432

        Database: padaria_db

        Username: padaria_user

        Password: padaria123

    Clique em Save

## Arquitetura de Microsserviços

O que são Microsserviços?

Microsserviços é um estilo de arquitetura onde uma aplicação é dividida em serviços pequenos e independentes, cada um responsável por uma função específica.
Arquitetura do Projeto
text

                    ┌─────────────────┐
                    │    Frontend     │
                    │   React :3000   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ MS PRODUTOS   │    │ MS PEDIDOS    │    │MS FUNCIONARIOS│
│   :3001       │    │   :3002       │    │   :3003       │
│ /produtos     │    │ /pedidos      │    │/funcionarios  │
│ /categorias   │    │ /clientes     │    │               │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────┴────────┐
                    │   PostgreSQL    │
                    │   :5433/padaria_db│
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │    pgAdmin      │
                    │    :5050        │
                    └─────────────────┘

Vantagens dos Microsserviços

    ✅ Isolamento de falhas - Um serviço cair não derruba os outros

    ✅ Escalabilidade independente - Escala só o que precisa

    ✅ Equipes autônomas - Cada time cuida do seu serviço

    ✅ Tecnologias diferentes - Cada serviço pode usar a melhor ferramenta

    ✅ Deploys independentes - Atualiza sem parar todo o sistema

## Estrutura do Banco de Dados
sql

-- Tabela de usuários (autenticação)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    cargo VARCHAR(60) DEFAULT 'atendente',
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    estoque INTEGER DEFAULT 0,
    categoria_id INTEGER REFERENCES categorias(id),
    imagem_url TEXT,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP
);

-- Tabela de clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    endereco TEXT,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    status VARCHAR(30) DEFAULT 'pendente',
    total DECIMAL(10,2),
    observacao TEXT,
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP
);

-- Tabela de itens do pedido
CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id),
    produto_id INTEGER REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unitario DECIMAL(10,2),
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantidade * preco_unitario) STORED
);

## Estrutura do Projeto

text

sistema-arquitetura/
│
├── docker-compose.yml              # Orquestra todos os contêineres
├── frontend/
│   ├── Dockerfile
│   ├── .env                         # Variáveis de ambiente
│   ├── package.json
│   └── src/
│       ├── App.js                   # Rotas + Sidebar
│       ├── services/
│       │   └── api.js               # Comunicação com microsserviços
│       └── pages/
│           ├── Login.js             # Autenticação
│           ├── Dashboard.js         # Gráficos e estatísticas
│           ├── Produtos.js          # CRUD + Paginação + Busca
│           ├── Relatorios.js        # Relatório de vendas
│           └── ...
├── backend-produtos/                # Microsserviço de Produtos
├── backend-pedidos/                 # Microsserviço de Pedidos
└── backend-funcionarios/            # Microsserviço de Funcionários

## Funcionalidades Implementadas (Nível 3)

✅ Nível 1 — Banco de Dados

    Conexão com PostgreSQL via pgAdmin

    Tabelas: usuarios, produtos, categorias, clientes, pedidos, itens_pedido

    Tabela de funcionários

    Queries SQL para análise de dados

✅ Nível 2 — Backend

    CRUD completo para produtos, categorias, clientes, pedidos, funcionários

    Três microsserviços independentes (portas 3001, 3002, 3003)

    Autenticação JWT com middleware

    CORS configurado para comunicação entre serviços

✅ Nível 3 — Frontend

    Paginação na listagem de produtos

    Filtro de busca por nome/descrição

    Dashboard com gráficos (Recharts)

    Relatório de vendas por período

    Interface responsiva e moderna

## Exemplos de Queries SQL
sql

-- Produtos com estoque baixo
SELECT nome, estoque FROM produtos WHERE estoque < 20;

-- Total de vendas por mês
SELECT DATE_TRUNC('month', criado_em) as mes, SUM(total) as total
FROM pedidos WHERE status = 'entregue'
GROUP BY mes ORDER BY mes DESC;

-- Clientes que mais compraram
SELECT c.nome, COUNT(p.id) as total_pedidos, SUM(p.total) as total_gasto
FROM clientes c JOIN pedidos p ON c.id = p.cliente_id
GROUP BY c.id ORDER BY total_gasto DESC LIMIT 10;

-- Produtos mais vendidos
SELECT pr.nome, SUM(ip.quantidade) as quantidade_vendida
FROM itens_pedido ip
JOIN produtos pr ON ip.produto_id = pr.id
JOIN pedidos p ON ip.pedido_id = p.id
WHERE p.status = 'entregue'
GROUP BY pr.id ORDER BY quantidade_vendida DESC LIMIT 10;

## Comandos Docker Úteis
Gerenciamento
bash

# Subir todos os serviços
docker compose up -d --build

# Iniciar serviços já existentes
docker compose start

# Parar serviços (mantém dados)
docker compose stop

# Ver status
docker compose ps

# Ver logs em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f frontend
docker compose logs -f backend-produtos

Diagnóstico
bash

# Testar API diretamente
curl http://localhost:3001/health
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@padaria.com","senha":"1234"}'

# Acessar banco de dados
docker compose exec postgres psql -U padaria_user -d padaria_db

# Backup do banco
docker compose exec postgres pg_dump -U padaria_user padaria_db > backup.sql

## Autenticação JWT

O sistema utiliza JWT (JSON Web Token) para autenticação:

    Usuário envia email/senha para /api/auth/login

    Backend valida e retorna um token

    Frontend salva token no localStorage

    Token é enviado em todas as requisições (header Authorization: Bearer token)

    Backend valida token antes de processar a requisição

Estrutura do Token
json

{
  "id": 4,
  "nome": "Administrador",
  "email": "admin@padaria.com",
  "cargo": "admin",
  "iat": 1780109375,
  "exp": 1780138175
}

## Solução de Problemas Comuns

Problema	Solução
CORS error	Verificar app.use(cors()) no server.js
401 Unauthorized	Fazer login novamente para gerar novo token
Token inválido	Limpar localStorage e relogar
Porta em uso	sudo lsof -ti:3000 | xargs kill -9
Banco não conecta	docker compose restart postgres
Frontend não compila	docker compose build --no-cache frontend
Erro nas rotas	Verificar se controllers estão exportando as funções

## Credenciais do Sistema
Acesso	Usuário	Senha
Sistema	admin@padaria.com	1234
pgAdmin	admin@pgadmin.com	admin
PostgreSQL	padaria_user	padaria123

## Checklist de Entrega

    Sistema rodando localmente

    Frontend acessível em localhost:3000

    Login funcionando

    CRUD de produtos funcionando

    CRUD de pedidos funcionando

    Paginação na listagem de produtos

    Filtro de busca nos produtos

    Dashboard com gráficos

    Relatório de vendas por período

    Documentação completa no README

## Tecnologias Utilizadas
Camada	Tecnologias
Frontend	React, Axios, Recharts, React Router
Backend	Node.js, Express, JWT, Bcrypt
Banco de Dados	PostgreSQL
Containerização	Docker, Docker Compose
Gerenciamento	pgAdmin
Versionamento	Git, GitHub
## Desenvolvedor

    Nome: [Seu Nome]

    Disciplina: Arquitetura de Software

    Período: 3º Período ADS

Projeto desenvolvido para fins educacionais — Disciplina de Arquitetura de Software
*Última atualização: Maio/2026*
## Comandos para o GitHub
bash

# Adicionar documentação
git add README.md

# Commit
git commit -m "docs: atualização da documentação com Nível 3 completo"

# Enviar
git push origin main