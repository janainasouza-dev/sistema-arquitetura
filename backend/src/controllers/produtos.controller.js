const db = require('../config/database');

// Listar produtos com paginação e busca
const listar = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const busca = req.query.busca || '';
    
    let query = `
      SELECT p.*, c.nome as categoria_nome 
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.ativo = true
    `;
    let params = [];
    let paramIndex = 1;
    
    if (busca) {
      query += ` AND (p.nome ILIKE $${paramIndex} OR p.descricao ILIKE $${paramIndex})`;
      params.push(`%${busca}%`);
      paramIndex++;
    }
    
    query += ` ORDER BY p.id LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const resultado = await db.query(query, params);
    
    // Query de total com filtro
    let totalQuery = 'SELECT COUNT(*) as total FROM produtos WHERE ativo = true';
    let totalParams = [];
    
    if (busca) {
      totalQuery += ` AND (nome ILIKE $1 OR descricao ILIKE $1)`;
      totalParams.push(`%${busca}%`);
    }
    
    const totalResult = await db.query(totalQuery, totalParams);
    const total = parseInt(totalResult.rows[0].total);
    
    res.json({
      sucesso: true,
      produtos: resultado.rows,
      paginacao: {
        pagina_atual: page,
        total_paginas: Math.ceil(total / limit),
        total_registros: total,
        por_pagina: limit
      }
    });
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno.' });
  }
};

// Buscar produto por ID
const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query(
      'SELECT * FROM produtos WHERE id = $1 AND ativo = true',
      [id]
    );
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado.' });
    }
    
    res.json({ sucesso: true, produto: resultado.rows[0] });
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno.' });
  }
};

// Criar produto
const criar = async (req, res) => {
  try {
    const { nome, descricao, preco, estoque, categoria_id, imagem_url } = req.body;
    
    if (!nome || !preco) {
      return res.status(400).json({ sucesso: false, mensagem: 'Nome e preço são obrigatórios.' });
    }
    
    const resultado = await db.query(
      `INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id, imagem_url, ativo, criado_em, atualizado_em)
       VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
       RETURNING *`,
      [nome, descricao, preco, estoque || 0, categoria_id || null, imagem_url || null]
    );
    
    res.status(201).json({ sucesso: true, produto: resultado.rows[0] });
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno.' });
  }
};

// Atualizar produto
const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, estoque, categoria_id, imagem_url, ativo } = req.body;
    
    const resultado = await db.query(
      `UPDATE produtos 
       SET nome = $1, descricao = $2, preco = $3, estoque = $4, 
           categoria_id = $5, imagem_url = $6, ativo = $7, atualizado_em = NOW()
       WHERE id = $8 AND ativo = true
       RETURNING *`,
      [nome, descricao, preco, estoque, categoria_id, imagem_url, ativo, id]
    );
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado.' });
    }
    
    res.json({ sucesso: true, produto: resultado.rows[0] });
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno.' });
  }
};

// Deletar produto (soft delete)
const deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query(
      'UPDATE produtos SET ativo = false WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado.' });
    }
    
    res.json({ sucesso: true, mensagem: 'Produto removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno.' });
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, deletar };