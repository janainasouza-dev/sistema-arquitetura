const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/auth.controller');
const { autenticar } = require('../middlewares/auth.middleware');
 
 
router.post('/login',     controller.login);
router.get('/me',         autenticar, controller.me);
router.post('/registrar', controller.registrar);
 
module.exports = router;
 
