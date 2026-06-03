const db = require("../config/database");

const listar = async (req, res) => {
  try {
    const resultado = await db.query("SELECT * FROM funcionarios ORDER BY id");
    res.json({ sucesso: true, funcionarios: resultado.rows });
  } catch (err) {
    console.error("Erro ao listar:", err);
    res.status(500).json({ sucesso: false, mensagem: "Erro interno" });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query("SELECT * FROM funcionarios WHERE id = $1", [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Não encontrado" });
    }
    res.json({ sucesso: true, funcionario: resultado.rows[0] });
  } catch (err) {
    console.error("Erro ao buscar:", err);
    res.status(500).json({ sucesso: false, mensagem: "Erro interno" });
  }
};

const criar = async (req, res) => {
  try {
    const { nome, email, cargo, turno, telefone, salario } = req.body;
    
    if (!nome || !email) {
      return res.status(400).json({ sucesso: false, mensagem: "Nome e email obrigatórios" });
    }
    
    const resultado = await db.query(
      "INSERT INTO funcionarios (nome, email, cargo, turno, telefone, salario, ativo, criado_em) VALUES ($1, $2, $3, $4, $5, $6, true, NOW()) RETURNING *",
      [nome, email, cargo || "atendente", turno || "manha", telefone || "", salario || 0]
    );
    
    res.status(201).json({ sucesso: true, funcionario: resultado.rows[0] });
  } catch (err) {
    console.error("Erro ao criar:", err);
    res.status(500).json({ sucesso: false, mensagem: "Erro interno" });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, cargo, turno, telefone, salario, ativo } = req.body;
    
    const resultado = await db.query(
      "UPDATE funcionarios SET nome=$1, email=$2, cargo=$3, turno=$4, telefone=$5, salario=$6, ativo=$7, atualizado_em=NOW() WHERE id=$8 RETURNING *",
      [nome, email, cargo, turno, telefone, salario, ativo, id]
    );
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Não encontrado" });
    }
    
    res.json({ sucesso: true, funcionario: resultado.rows[0] });
  } catch (err) {
    console.error("Erro ao atualizar:", err);
    res.status(500).json({ sucesso: false, mensagem: "Erro interno" });
  }
};

const deletar = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE funcionarios SET ativo = false WHERE id = $1", [id]);
    res.json({ sucesso: true, mensagem: "Funcionário desativado" });
  } catch (err) {
    console.error("Erro ao deletar:", err);
    res.status(500).json({ sucesso: false, mensagem: "Erro interno" });
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, deletar };