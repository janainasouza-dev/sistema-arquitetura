

## 🥖 Padaria WeCoffe

> **Sistema de Gestão com Microsserviços**  
> Disciplina: Arquitetura de Software | 3º Período ADS

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/node.js-20.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-61dafb)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-15.x-336791)](https://www.postgresql.org/)

---

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

### 🎯 Objetivos Educacionais

- Aplicar conceitos de **Arquitetura de Software**
- Implementar **microsserviços** com Node.js e Express
- Utilizar **Docker** para containerização
- Integrar **React** com múltiplos backends
- Gerenciar **autenticação JWT** e comunicação entre serviços

---

## 🏗️ Arquitetura

### Visão Geral

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
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────┴────────┐
                    │   PostgreSQL    │
                    │   :5432         │
                    └─────────────────┘


### Vantagens dos Microsserviços

| Característica | Benefício |
|----------------|-----------|
| **Isolamento de falhas** | Um serviço cair não derruba os outros |
| **Escalabilidade independente** | Escala apenas o serviço necessário |
| **Deploys autônomos** | Atualiza sem parar todo o sistema |
| **Tecnologias flexíveis** | Cada serviço usa a melhor ferramenta |


## 🛠️ Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React 18, Axios, Recharts, React Router DOM |
| **Backend** | Node.js, Express, JWT, Bcrypt, Cors |
| **Banco de Dados** | PostgreSQL 15 |
| **Containerização** | Docker, Docker Compose |
| **Gerenciamento** | pgAdmin |
| **Versionamento** | Git, GitHub |


## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (versão 20.10+)
- [Git](https://git-scm.com/) (versão 2.30+)
- Portas disponíveis: `3000`, `3001`, `3002`, `3003`, `5050`, `5432`



## 🚀 Instalação e Execução

### 1. Clonar o repositório


git clone https://github.com/seu-usuario/padaria-wecoffe.git
cd padaria-wecoffe


### 2. Configurar variáveis de ambiente


# Criar arquivo .env do frontend
cat > frontend/.env << EOF
REACT_APP_API_PRODUTOS=http://localhost:3001/api
REACT_APP_API_PEDIDOS=http://localhost:3002/api
REACT_APP_API_FUNCIONARIOS=http://localhost:3003/api
EOF


### 3. Subir os contêineres

```bash
# Primeira execução (build + up)
docker compose up -d --build

# Execuções subsequentes
docker compose start
```

### 4. Acessar o sistema

| Serviço | URL | Credenciais |
|---------|-----|--------------|
| **Frontend** | http://localhost:3000 | admin@padaria.com / 1234 |
| **API Produtos** | http://localhost:3001/health | - |
| **API Pedidos** | http://localhost:3002/health | - |
| **API Funcionários** | http://localhost:3003/health | - |
| **pgAdmin** | http://localhost:5050 | admin@pgadmin.com / admin |

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
padaria-wecoffe/
│
├── docker-compose.yml              # Orquestração dos contêineres
├── frontend/
│   ├── Dockerfile
│   ├── .env
│   ├── package.json
│   └── src/
│       ├── App.js                  # Rotas + Sidebar
│       ├── services/
│       │   └── api.js              # Cliente HTTP para microsserviços
│       └── pages/
│           ├── Login.js
│           ├── Dashboard.js
│           ├── Produtos.js
│           ├── Pedidos.js
│           ├── Relatorios.js
│           └── Funcionarios.js
│
├── backend-produtos/               # Microsserviço de Produtos (:3001)
├── backend-pedidos/                # Microsserviço de Pedidos (:3002)
└── backend-funcionarios/           # Microsserviço de Funcionários (:3003)
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

-- Produtos e Categorias
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INTEGER DEFAULT 0,
    categoria_id INTEGER REFERENCES categorias(id)
);

-- Pedidos e Clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20)
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    status VARCHAR(30) DEFAULT 'pendente',
    total DECIMAL(10,2)
);

CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id),
    produto_id INTEGER REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unitario DECIMAL(10,2)
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

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Autenticação |
| GET | `/api/produtos` | Listar produtos |
| GET | `/api/produtos/:id` | Buscar produto |
| POST | `/api/produtos` | Criar produto |
| PUT | `/api/produtos/:id` | Atualizar produto |
| DELETE | `/api/produtos/:id` | Remover produto |

### Microsserviço de Pedidos (:3002)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pedidos` | Listar pedidos |
| POST | `/api/pedidos` | Criar pedido |
| PUT | `/api/pedidos/:id/status` | Atualizar status |

### Microsserviço de Funcionários (:3003)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/funcionarios` | Listar funcionários |
| POST | `/api/funcionarios` | Cadastrar funcionário |

---

## ✨ Funcionalidades

### Nível 1 — Banco de Dados ✅
- Conexão PostgreSQL via Docker
- Tabelas normalizadas
- Relacionamentos entre entidades

### Nível 2 — Backend ✅
- 3 microsserviços independentes
- CRUD completo para todas entidades
- Autenticação JWT
- CORS configurado

### Nível 3 — Frontend ✅
- Paginação na listagem de produtos
- Filtro de busca por nome/descrição
- Dashboard com gráficos (Recharts)
- Relatório de vendas por período
- Interface responsiva

---

## 🐳 Comandos Docker

### Gerenciamento

```bash
# Subir serviços (com rebuild)
docker compose up -d --build

# Iniciar serviços existentes
docker compose start

# Parar serviços (mantém dados)
docker compose stop

# Parar e remover tudo
docker compose down -v

# Ver status
docker compose ps

# Ver logs em tempo real
docker compose logs -f

# Logs de serviço específico
docker compose logs -f frontend
docker compose logs -f backend-produtos
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

# Acessar banco diretamente
docker compose exec postgres psql -U padaria_user -d padaria_db

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
| **Token inválido** | Limpar localStorage e relogar |
| **Porta em uso** | `sudo lsof -ti:3000 \| xargs kill -9` |
| **Banco não conecta** | `docker compose restart postgres` |
| **Frontend não compila** | `docker compose build --no-cache frontend` |

---

## ✅ Checklist de Entrega

- [x] Sistema rodando com Docker Compose
- [x] Frontend acessível em `localhost:3000`
- [x] Login funcionando com JWT
- [x] CRUD completo de produtos
- [x] CRUD completo de pedidos
- [x] Paginação na listagem
- [x] Filtro de busca
- [x] Dashboard com gráficos
- [x] Relatório de vendas por período
- [x] Documentação completa

---

## 📄 Licença

Este projeto foi desenvolvido para **fins educacionais** como parte da disciplina de Arquitetura de Software.

---

*Última atualização: Maio/2026*
```

---

## 📝 Principais melhorias aplicadas:

1. **Estrutura clara com emojis e badges** - Mais atrativo e profissional
2. **Índice navegável** - Facilita localização das seções
3. **Tabelas** - Para vantagens, tecnologias, endpoints e soluções de problemas
4. **Formatação consistente** - Códigos, comandos e blocos bem organizados
5. **Checklist visual** - Com emojis e caixas de seleção
6. **Seção de badges** - Mostra tecnologias e status do projeto
7. **Cabeçalho com destaque** - Nome do projeto em destaque
8. **Organização hierárquica** - De informações gerais para específicas

