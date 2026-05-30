
const db     = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

const JWT_SECRET  = process.env.JWT_SECRET  || 'padaria_secret_dev';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

// ── Login ─────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Email e senha são obrigatórios.',
      });
    }

    // Busca usuário pelo email
    const resultado = await db.query(
      'SELECT * FROM usuarios WHERE email = $1 AND ativo = TRUE',
      [email.toLowerCase().trim()]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Email ou senha inválidos.',
      });
    }

    const usuario = resultado.rows[0];

    // Compara a senha com o hash salvo no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Email ou senha inválidos.',
      });
    }

    // Gera o token JWT
    const token = jwt.sign(
      {
        id:    usuario.id,
        nome:  usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    // Não retorna a senha_hash na resposta
    const { senha_hash, ...usuarioSemSenha } = usuario;

    res.json({
      sucesso: true,
      token,
      usuario: usuarioSemSenha,
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
  }
};

// ── Verificar token (rota /me) ────────────────────────
const me = async (req, res) => {
  try {
    // req.usuario vem do middleware de autenticação
    const resultado = await db.query(
      'SELECT id, nome, email, cargo FROM usuarios WHERE id = $1 AND ativo = TRUE',
      [req.usuario.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' });
    }

    res.json({ sucesso: true, usuario: resultado.rows[0] });
  } catch (err) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
  }
};

// ── Criar usuário (usado para cadastro inicial) ───────
const registrar = async (req, res) => {
  try {
    const { nome, email, senha, cargo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome, email e senha são obrigatórios.',
      });
    }

    // Verifica email duplicado
    const existe = await db.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email.toLowerCase().trim()]
    );
    if (existe.rows.length > 0) {
      return res.status(400).json({ sucesso: false, mensagem: 'Email já cadastrado.' });
    }

    // Gera o hash da senha (salt 10 = bom equilíbrio segurança/performance)
    const senha_hash = await bcrypt.hash(senha, 10);

    const resultado = await db.query(
      `INSERT INTO usuarios (nome, email, senha_hash, cargo)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, cargo, criado_em`,
      [nome, email.toLowerCase().trim(), senha_hash, cargo || 'atendente']
    );

    res.status(201).json({ sucesso: true, usuario: resultado.rows[0] });
  } catch (err) {
    console.error('Erro ao registrar:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
  }
};

module.exports = { login, me, registrar };