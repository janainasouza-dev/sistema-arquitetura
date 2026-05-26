// backend/src/routes/funcionarios.routes.js

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/funcionarios.controller');

// GET    /api/funcionarios          → listar todos (aceita ?ativo=true&turno=manha&cargo=padeiro)
// GET    /api/funcionarios/:id      → buscar por ID
// POST   /api/funcionarios          → criar novo
// PUT    /api/funcionarios/:id      → atualizar
// DELETE /api/funcionarios/:id      → desativar (soft delete)

router.get('/',    controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/',   controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

module.exports = router;