require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const SERVICE_NAME = process.env.SERVICE_NAME || 'produtos';

// ============================================
// MIDDLEWARES GLOBAIS
// ============================================
// CORS configurado para aceitar qualquer origem (modo desenvolvimento)
app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const agora = new Date().toISOString();
  console.log(`[${agora}] [${SERVICE_NAME.toUpperCase()}] ${req.method} ${req.url}`);
  next();
});

// ============================================
// ROTAS DO MICROSSERVIÇO
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    servico: SERVICE_NAME,
    porta: PORT,
    timestamp: new Date().toISOString(),
  });
});

// ── Auth (disponível em todos os serviços) ────────────
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// ── Rotas protegidas por microsserviço ────────────────
const { autenticar } = require('./middlewares/auth.middleware');

if (SERVICE_NAME === 'produtos') {
  const produtosRoutes = require('./routes/produtos.routes');
  const categoriasRoutes = require('./routes/categorias.routes');
  app.use('/api/produtos', autenticar, produtosRoutes);
  app.use('/api/categorias', autenticar, categoriasRoutes);
}

if (SERVICE_NAME === 'pedidos') {
  const pedidosRoutes = require('./routes/pedidos.routes');
  const clientesRoutes = require('./routes/clientes.routes');
  app.use('/api/pedidos', autenticar, pedidosRoutes);
  app.use('/api/clientes', autenticar, clientesRoutes);
}

if (SERVICE_NAME === 'funcionarios') {
  const funcionariosRoutes = require('./routes/funcionarios.routes');
  app.use('/api/funcionarios', autenticar, funcionariosRoutes);
}

// ============================================
// MIDDLEWARE DE ERRO GLOBAL
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err.message);
  res.status(500).json({ erro: 'Erro interno do servidor', mensagem: err.message });
});

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// ============================================
// INICIALIZA O SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`🥖 Padaria do Zé - Microsserviço ATIVO`);
  console.log(`📦 Serviço: ${SERVICE_NAME.toUpperCase()}`);
  console.log(`🚀 Porta: ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('========================================');
});

module.exports = app;