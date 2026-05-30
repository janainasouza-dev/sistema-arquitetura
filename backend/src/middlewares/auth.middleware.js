const jwt = require('jsonwebtoken');
 
const JWT_SECRET = process.env.JWT_SECRET || 'padaria_secret_dev';
 
const autenticar = (req, res, next) => {
  try {
    // Espera o header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token não fornecido. Faça login para continuar.',
      });
    }
 
    const token = authHeader.split(' ')[1];
 
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET);
 
    // Injeta os dados do usuário na requisição
    req.usuario = decoded;
 
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ sucesso: false, mensagem: 'Sessão expirada. Faça login novamente.' });
    }
    return res.status(401).json({ sucesso: false, mensagem: 'Token inválido.' });
  }
};
 
module.exports = { autenticar };
 
