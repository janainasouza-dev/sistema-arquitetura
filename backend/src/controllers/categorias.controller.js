const db = require('../config/database');

const listar = async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM categorias ORDER BY nome');
    res.json({ sucesso: true, categorias: resultado.rows });
  } catch (err) {
    console.error('Erro ao listar categorias:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno.' });
  }
};

const criar = async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    
    if (!nome) {
      return res.status(400).json({ sucesso: false, mensagem: 'Nome é obrigatório.' });
    }
    
    const resultado = await db.query(
      'INSERT INTO categorias (nome, descricao, criado_em) VALUES ($1, $2, NOW()) RETURNING *',
      [nome, descricao || '']
    );
    
    res.status(201).json({ sucesso: true, categoria: resultado.rows[0] });
  } catch (err) {
    console.error('Erro ao criar categoria:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno.' });
  }
};