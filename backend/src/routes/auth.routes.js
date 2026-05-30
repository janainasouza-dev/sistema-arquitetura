const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/auth.controller');
const { autenticar } = require('../middlewares/auth.middleware');
 
// POST /api/auth/login      → faz login, retorna token JWT
// GET  /api/auth/me         → retorna dados do usuário logado (rota protegida)
// POST /api/auth/registrar  → cria novo usuário (pode proteger depois)
 
router.post('/login',     controller.login);
router.get('/me',         autenticar, controller.me);
router.post('/registrar', controller.registrar);
 
module.exports = router;
 
