# 🥖 Padaria WeCoffe

> **Sistema de Gestão com Microsserviços**  
> Disciplina: Arquitetura de Software | 3º Período ADS

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/node.js-20.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-61dafb)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-15.x-336791)](https://www.postgresql.org/)

---

## 👩‍💻 Desenvolvedores

- **Nome:** Janaina Souza de Souza, Rodrigo Gomes Brito e Eduardo Felipe Matos Santos
- **Disciplina:** Arquitetura de Software
- **Período:** 3º Período ADS




## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Banco de Dados](#banco-de-dados)
- [API Endpoints](#api-endpoints)
- [Funcionalidades](#funcionalidades)
- [Comandos Úteis](#comandos-úteis)
- [Solução de Problemas](#solução-de-problemas)
- [Checklist de Entrega](#checklist-de-entrega)
- [Desenvolvedor](#desenvolvedor)

---

## 📖 Sobre o Projeto

A **Padaria WeCoffe** é um sistema completo de gestão para padarias, desenvolvido com arquitetura baseada em **microsserviços**. O sistema permite gerenciar produtos, pedidos, clientes e funcionários de forma independente e escalável.

### Objetivos Educacionais

- ✅ Aplicar conceitos de **Arquitetura de Software**
- ✅ Implementar **microsserviços** com Node.js e Express
- ✅ Utilizar **Docker** para containerização
- ✅ Integrar **React** com múltiplos backends
- ✅ Gerenciar **autenticação JWT** e comunicação entre serviços


## 🏗️ Arquitetura

### Visão Geral

| Componente | Porta | Funcionalidade |
|------------|-------|----------------|
| **Frontend (React)** | 3000 | Interface do usuário |
| **Microsserviço Produtos** | 3001 | CRUD produtos e categorias |
| **Microsserviço Pedidos** | 3002 | CRUD pedidos, clientes e relatórios |
| **Microsserviço Funcionários** | 3003 | CRUD funcionários |
| **PostgreSQL** | 5433 | Banco de dados relacional |
| **pgAdmin** | 5050 | Gerenciamento do banco |

### Vantagens dos Microsserviços

| Característica | Benefício |
|----------------|-----------|
| **Isolamento de falhas** | Um serviço cair não derruba os outros |
| **Escalabilidade independente** | Escala apenas o serviço necessário |
| **Deploys autônomos** | Atualiza sem parar todo o sistema |
| **Tecnologias flexíveis** | Cada serviço usa a melhor ferramenta |

---

## 💻 Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React 18, Axios, React Router DOM |
| **Backend** | Node.js, Express, JWT, Bcrypt, Cors |
| **Banco de Dados** | PostgreSQL 15 |
| **Containerização** | Docker, Docker Compose |
| **Gerenciamento** | pgAdmin |
| **Versionamento** | Git, GitHub |

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (versão 20.10+)
- [Git](https://git-scm.com/) (versão 2.30+)
- Portas disponíveis: `3000`, `3001`, `3002`, `3003`, `5050`, `5433`

---

## 🚀 Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/janainasouza-dev/sistema-arquitetura.git
cd sistema-arquitetura
```

### 2. Configurar variáveis de ambiente

```bash
# Criar arquivo .env dentro do frontend
cat > frontend/.env << 'EOF'
REACT_APP_API_PRODUTOS=http://localhost:3001/api
REACT_APP_API_PEDIDOS=http://localhost:3002/api
REACT_APP_API_FUNCIONARIOS=http://localhost:3003/api
EOF
```

### 3. Subir os contêineres

```bash
# Primeira execução (build + up)
docker compose up -d --build

# Execuções subsequentes
docker compose start

# Parar o sistema (mantém dados)
docker compose stop
```
---

### 4. Acessar o sistema

| Serviço | URL | Credenciais |
|---------|-----|--------------|
| **Frontend** | http://localhost:3000 | admin@padaria.com / 1234 |
| **API Produtos** | http://localhost:3001/health | - |
| **API Pedidos** | http://localhost:3002/health | - |
| **API Funcionários** | http://localhost:3003/health | - |
| **pgAdmin** | http://localhost:5050 | admin@pgadmin.com / admin |
| **PostgreSQL** | localhost:5433 | padaria_user / padaria123 |

### 5. Configurar conexão no pgAdmin

1. Clique em **"Add New Server"**
2. **General** → Name: `Padaria WeCoffe`
3. **Connection**:
   - Host: `postgres`
   - Port: `5432`
   - Database: `padaria_db`
   - Username: `padaria_user`
   - Password: `padaria123`
4. Clique em **Save**

---

## 📁 Estrutura do Projeto

```
sistema-arquitetura/
│
├── docker-compose.yml              # Orquestração dos contêineres
│
├── backend/                        # Código fonte dos microsserviços
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── server.js               # Servidor Express (multi-serviço)
│       ├── config/
│       │   └── database.js         # Conexão com PostgreSQL
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── produtos.controller.js
│       │   ├── pedidos.controller.js
│       │   ├── clientes.controller.js
│       │   └── funcionarios.controller.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── produtos.routes.js
│       │   ├── pedidos.routes.js
│       │   ├── clientes.routes.js
│       │   └── funcionarios.routes.js
│       └── middlewares/
│           └── auth.middleware.js  # Validação JWT
│
└── frontend/                       # Aplicação React
    ├── Dockerfile
    ├── .env                         # Variáveis de ambiente
    ├── package.json
    └── src/
        ├── App.js                   # Rotas + Sidebar
        ├── index.css                # Estilos globais
        ├── services/
        │   └── api.js               # Comunicação com microsserviços
        └── pages/
            ├── Login.js             # Autenticação
            ├── Dashboard.js         # Estatísticas
            ├── Produtos.js          # CRUD + Paginação + Busca
            ├── Categorias.js        # CRUD de categorias
            ├── Clientes.js          # CRUD de clientes
            ├── Pedidos.js           # CRUD + Status
            ├── Funcionarios.js      # CRUD + Turno/Salário
            └── Relatorios.js        # Relatório de vendas
```

---

## 🗄️ Banco de Dados

### Modelo Relacional

```sql
-- Usuários (autenticação)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    cargo VARCHAR(60) DEFAULT 'atendente',
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Categorias
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Produtos
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

-- Clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    endereco TEXT,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Funcionários (com turno e salário)
CREATE TABLE funcionarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255),
    cargo VARCHAR(60) DEFAULT 'atendente',
    turno VARCHAR(20),
    telefone VARCHAR(20),
    salario DECIMAL(10,2) DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP
);

-- Pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    status VARCHAR(30) DEFAULT 'pendente',
    total DECIMAL(10,2) DEFAULT 0,
    observacao TEXT,
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP
);

-- Itens do Pedido
CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id),
    produto_id INTEGER REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unitario DECIMAL(10,2),
    subtotal DECIMAL(10,2)
);
```

### 📊 Queries Úteis para Análise

```sql
-- Produtos com estoque baixo
SELECT nome, estoque FROM produtos WHERE estoque < 20;

-- Vendas por mês
SELECT DATE_TRUNC('month', criado_em) as mes, SUM(total) as total
FROM pedidos WHERE status = 'entregue'
GROUP BY mes ORDER BY mes DESC;

-- Top 10 clientes
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
```

---

## 🔌 API Endpoints

### Microsserviço de Produtos (:3001)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/auth/login` | Autenticação | ✅  |
| POST | `/api/auth/registrar` | Registrar usuário | ✅  |
| GET | `/api/auth/me` | Dados do usuário | ✅ |
| GET | `/api/produtos` | Listar produtos (com paginação/busca) | ✅ |
| GET | `/api/produtos/:id` | Buscar produto | ✅ |
| POST | `/api/produtos` | Criar produto | ✅ |
| PUT | `/api/produtos/:id` | Atualizar produto | ✅ |
| DELETE | `/api/produtos/:id` | Remover produto | ✅ |
| GET | `/api/categorias` | Listar categorias | ✅ |
| POST | `/api/categorias` | Criar categoria | ✅ |

### Microsserviço de Pedidos (:3002)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/pedidos` | Listar pedidos | ✅ |
| GET | `/api/pedidos/:id` | Buscar pedido | ✅ |
| POST | `/api/pedidos` | Criar pedido | ✅ |
| PATCH | `/api/pedidos/:id/status` | Atualizar status | ✅ |
| GET | `/api/pedidos/relatorio` | Relatório de vendas | ✅ |
| GET | `/api/clientes` | Listar clientes | ✅ |
| POST | `/api/clientes` | Criar cliente | ✅ |
| PUT | `/api/clientes/:id` | Atualizar cliente | ✅ |

### Microsserviço de Funcionários (:3003)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/funcionarios` | Listar funcionários | ✅ |
| GET | `/api/funcionarios/:id` | Buscar funcionário | ✅ |
| POST | `/api/funcionarios` | Criar funcionário | ✅ |
| PUT | `/api/funcionarios/:id` | Atualizar funcionário | ✅ |
| DELETE | `/api/funcionarios/:id` | Remover funcionário | ✅ |

---

## ✨ Funcionalidades

### Nível 1 — Banco de Dados ✅
- [x] Conexão PostgreSQL via Docker
- [x] Tabelas normalizadas
- [x] Relacionamentos entre entidades

### Nível 2 — Backend ✅
- [x] 3 microsserviços independentes
- [x] CRUD completo para todas entidades
- [x] Autenticação JWT
- [x] CORS configurado
- [x] Rotas de relatórios

### Nível 3 — Frontend ✅
- [x] Paginação na listagem de produtos
- [x] Filtro de busca por nome/descrição
- [x] Dashboard com estatísticas
- [x] Relatório de vendas por período
- [x] Interface responsiva
- [x] Alteração de status dos pedidos (pendente → pago → entregue)
- [x] CRUD completo de funcionários (com turno e salário)

---

## 🐳 Comandos Úteis

### Gerenciamento

```bash
# Subir serviços (com rebuild)
docker compose up -d --build

# Iniciar serviços existentes
docker compose start

# Parar serviços (mantém dados)
docker compose stop

# Parar e remover containers (mantém dados)
docker compose down

# Parar e remover TUDO (inclusive dados do banco)
docker compose down -v

# Ver status
docker compose ps

# Ver logs em tempo real
docker compose logs -f

# Logs de serviço específico
docker compose logs -f frontend
docker compose logs -f backend-pedidos
```

### Diagnóstico

```bash
# Testar health checks
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health

# Testar login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@padaria.com","senha":"1234"}'

# Testar relatório de vendas
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@padaria.com","senha":"1234"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl -X GET "http://localhost:3002/api/pedidos/relatorio?dataInicio=2026-01-01&dataFim=2026-12-31" \
  -H "Authorization: Bearer $TOKEN"

# Acessar banco diretamente
docker compose exec postgres psql -U padaria_user -d padaria_db

# Corrigir sequência de IDs de funcionários
docker compose exec postgres psql -U padaria_user -d padaria_db -c \
  "SELECT setval('funcionarios_id_seq', (SELECT COALESCE(MAX(id), 0) FROM funcionarios));"

# Backup do banco
docker compose exec postgres pg_dump -U padaria_user padaria_db > backup.sql
```

---

## 🔐 Autenticação JWT

O sistema utiliza **JSON Web Tokens** para autenticação:

### Fluxo de Autenticação

1. Usuário envia `email/senha` → `/api/auth/login`
2. Backend valida credenciais e retorna token
3. Frontend armazena token no `localStorage`
4. Token é enviado no header: `Authorization: Bearer <token>`
5. Backend valida token antes de processar requisições

### Estrutura do Token

```json
{
  "id": 4,
  "nome": "Administrador",
  "email": "admin@padaria.com",
  "cargo": "admin",
  "iat": 1780109375,
  "exp": 1780138175
}
```

---

## 🐛 Solução de Problemas

| Problema | Solução |
|----------|---------|
| **CORS error** | Verificar `app.use(cors())` no backend |
| **401 Unauthorized** | Fazer login novamente para gerar novo token |
| **Token inválido** | `localStorage.clear(); window.location.href = '/login'` |
| **Porta em uso** | `sudo lsof -ti:3000 \| xargs kill -9` |
| **Banco não conecta** | `docker compose restart postgres` |
| **Frontend não compila** | `docker compose build --no-cache frontend` |
| **Clientes não aparecem no Dashboard** | Verificar se API retorna `clientes` ou `dados` |
| **Categorias não listam** | Usar `res.data.categorias` em vez de `res.data.dados` |
| **Relatório não carrega** | Verificar se `relatorioVendas` está no controller |
| **Funcionários somem ao sair da aba** | Verificar `useEffect` e `carregarFuncionarios()` |
| **db.getClient is not a function** | Substituir por `db.query()` no controller |

---

## 📄 Licença

Este projeto foi desenvolvido para **fins educacionais** como parte da disciplina de Arquitetura de Software.

---

*Última atualização: Junho/2026*
``


