# 🥖 Padaria WeCoffe — Sistema de Gestão com Microsserviços
## Disciplina: Arquitetura de Software | 3º Período ADS

---

## 📦 Como Rodar o Projeto (Passo a Passo)

### Pré-requisitos

- Docker Desktop instalado: https://www.docker.com/products/docker-desktop
- Git instalado
- Portas 3000, 3001, 3002, 3003, 5050, 5433 disponíveis

### 1. Clonar o repositório

```bash
git clone [url-do-repositorio]
cd sistema-arquitetura

2. Configurar variáveis de ambiente do frontend
bash

3. Criar arquivo .env na pasta frontend

cat > frontend/.env << EOF
REACT_APP_API_PRODUTOS=http://localhost:3001/api
REACT_APP_API_PEDIDOS=http://localhost:3002/api
REACT_APP_API_FUNCIONARIOS=http://localhost:3003/api
EOF

4. Subir todos os contêineres
bash

# Primeira vez ou após alterações

docker compose up -d --build

# Apenas iniciar (após já ter subido antes)
docker compose start

# Parar o sistema (mantém dados)

docker compose stop

Aguarde todos os serviços subirem. Na primeira vez pode demorar alguns minutos.

5. Acessar o Sistema

Serviço	URL	Credenciais
Frontend (React)	http://localhost:3000	admin@padaria.com / 1234
Backend Produtos	http://localhost:3001/health	-
Backend Pedidos	http://localhost:3002/health	-
Backend Funcionários	http://localhost:3003/health	-
pgAdmin (banco)	http://localhost:5050	admin@pgadmin.com / admin

6. Login no pgAdmin

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

# Estrutura bando de dados 

📊 padaria_db (PostgreSQL)
│
├── 👤 usuarios
│   ├── id (PK)
│   ├── nome
│   ├── email (UNIQUE)
│   ├── senha_hash (bcrypt)
│   ├── cargo (admin/gerente/atendente)
│   ├── ativo (boolean)
│   └── criado_em
│
├── 🏷️ categorias
│   ├── id (PK)
│   ├── nome
│   ├── descricao
│   └── criado_em
│
├── 📦 produtos
│   ├── id (PK)
│   ├── nome
│   ├── descricao
│   ├── preco (decimal)
│   ├── estoque (integer)
│   ├── categoria_id (FK → categorias)
│   ├── imagem_url
│   ├── ativo (boolean)
│   ├── criado_em
│   └── atualizado_em
│
├── 👥 clientes
│   ├── id (PK)
│   ├── nome
│   ├── email (UNIQUE)
│   ├── telefone
│   ├── endereco
│   └── criado_em
│
├── 🛒 pedidos
│   ├── id (PK)
│   ├── cliente_id (FK → clientes)
│   ├── status (pendente/pago/enviado/entregue/cancelado)
│   ├── total (decimal)
│   ├── observacao
│   ├── criado_em
│   └── atualizado_em
│
└── 📋 itens_pedido
    ├── id (PK)
    ├── pedido_id (FK → pedidos)
    ├── produto_id (FK → produtos)
    ├── quantidade (integer)
    ├── preco_unitario (decimal)
    └── subtotal (decimal, gerado automaticamente)

# Estrutura do projeto 

sistema-arquitetura/
│
├── docker-compose.yml              # Orquestra todos os contêineres
├── .env                             # Variáveis de ambiente globais
│
├── frontend/                        # React SPA
│   ├── Dockerfile
│   ├── package.json
│   ├── .env                         # Variáveis do frontend
│   └── src/
│       ├── App.js                   # Rotas + Sidebar
│       ├── index.css                # Estilos globais
│       ├── services/
│       │   └── api.js               # Comunicação com microsserviços
│       └── pages/
│           ├── Login.js             # Autenticação
│           ├── Dashboard.js
│           ├── Produtos.js
│           ├── Categorias.js
│           ├── Clientes.js
│           ├── Pedidos.js
│           └── Funcionarios.js
│
├── backend-produtos/                # Microsserviço de Produtos
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── server.js                # Servidor Express
│       ├── config/
│       │   └── database.js
│       ├── controllers/
│       ├── routes/
│       ├── models/
│       └── middlewares/
│           └── auth.middleware.js  # Validação JWT
│
├── backend-pedidos/                 # Microsserviço de Pedidos
│   └── ... (estrutura similar)
│
└── backend-funcionarios/            # Microsserviço de Funcionários
    └── ... (estrutura similar)

# Arquitetura do projeto 

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

# Tecnologias utilizadas 

Docker	Containerização
PostgreSQL	Banco de dados relacional
pgAdmin	Interface gráfica do banco
Node.js + Express	Backend JavaScript
React	Frontend SPA
JWT	Autenticação
Axios	HTTP Client
CORS	Compartilhamento entre origens