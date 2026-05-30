
const db = require('../config/database');

// ── Listar todos os funcionários ──────────────────
const listar = async (req, res) => {
  try {
    const { ativo, turno, cargo } = req.query;

    let query = 'SELECT * FROM funcionarios WHERE 1=1';
    const params = [];

    if (ativo !== undefined) {
      params.push(ativo === 'true');
      query += ` AND ativo = $${params.length}`;
    }

    if (turno) {
      params.push(turno);
      query += ` AND turno = $${params.length}`;
    }

    if (cargo) {
      params.push(`%${cargo}%`);
      query += ` AND cargo ILIKE $${params.length}`;
    }

    query += ' ORDER BY nome ASC';

    const resultado = await db.query(query, params);

    res.json({
      sucesso: true,
      total: resultado.rows.length,
      dados: resultado.rows,
    });
  } catch (err) {
    console.error('Erro ao listar funcionários:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
  }
};

// ── Buscar funcionário por ID ─────────────────────
const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query(
      'SELECT * FROM funcionarios WHERE id = $1',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Funcionário não encontrado.' });
    }

    res.json({ sucesso: true, dados: resultado.rows[0] });
  } catch (err) {
    console.error('Erro ao buscar funcionário:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
  }
};

// ── Criar funcionário ─────────────────────────────
const criar = async (req, res) => {
  try {
    const { nome, email, telefone, cargo, turno, salario } = req.body;

    // Validações
    if (!nome || !email || !cargo || !turno) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Campos obrigatórios: nome, email, cargo, turno.',
      });
    }

    const turnosValidos = ['manha', 'tarde', 'noite'];
    if (!turnosValidos.includes(turno)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Turno inválido. Use: manha, tarde ou noite.',
      });
    }

    // Verificar email duplicado
    const emailExiste = await db.query(
      'SELECT id FROM funcionarios WHERE email = $1',
      [email]
    );
    if (emailExiste.rows.length > 0) {
      return res.status(400).json({ sucesso: false, mensagem: 'Email já cadastrado.' });
    }

    const resultado = await db.query(
      `INSERT INTO funcionarios (nome, email, telefone, cargo, turno, salario)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nome, email, telefone || null, cargo, turno, salario || 0]
    );

    res.status(201).json({ sucesso: true, dados: resultado.rows[0] });
  } catch (err) {
    console.error('Erro ao criar funcionário:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
  }
};

// ── Atualizar funcionário ─────────────────────────
const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, cargo, turno, salario, ativo } = req.body;

    // Verificar se existe
    const existe = await db.query('SELECT id FROM funcionarios WHERE id = $1', [id]);
    if (existe.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Funcionário não encontrado.' });
    }

    // Verificar email duplicado (ignorando o próprio)
    if (email) {
      const emailExiste = await db.query(
        'SELECT id FROM funcionarios WHERE email = $1 AND id != $2',
        [email, id]
      );
      if (emailExiste.rows.length > 0) {
        return res.status(400).json({ sucesso: false, mensagem: 'Email já está em uso.' });
      }
    }

    const resultado = await db.query(
      `UPDATE funcionarios
       SET nome          = COALESCE($1, nome),
           email         = COALESCE($2, email),
           telefone      = COALESCE($3, telefone),
           cargo         = COALESCE($4, cargo),
           turno         = COALESCE($5, turno),
           salario       = COALESCE($6, salario),
           ativo         = COALESCE($7, ativo),
           atualizado_em = NOW()
       WHERE id = $8
       RETURNING *`,
      [nome, email, telefone, cargo, turno, salario, ativo, id]
    );

    res.json({ sucesso: true, dados: resultado.rows[0] });
  } catch (err) {
    console.error('Erro ao atualizar funcionário:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
  }
};

// ── Deletar / Desativar funcionário ──────────────
const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const existe = await db.query('SELECT id FROM funcionarios WHERE id = $1', [id]);
    if (existe.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Funcionário não encontrado.' });
    }

    // Soft delete — apenas desativa
    await db.query(
      'UPDATE funcionarios SET ativo = FALSE, atualizado_em = NOW() WHERE id = $1',
      [id]
    );

    res.json({ sucesso: true, mensagem: 'Funcionário desativado com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar funcionário:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, deletar };