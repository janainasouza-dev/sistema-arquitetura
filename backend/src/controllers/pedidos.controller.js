const db = require("../config/database");

const listar = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT p.*, c.nome as cliente_nome 
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      ORDER BY p.id DESC
    `);
    res.json({ sucesso: true, pedidos: resultado.rows });
  } catch (err) {
    console.error("Erro ao listar:", err);
    res.status(500).json({ sucesso: false, mensagem: err.message });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pedidoResult = await db.query("SELECT * FROM pedidos WHERE id = $1", [id]);
    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Pedido não encontrado" });
    }
    const itensResult = await db.query(`
      SELECT ip.*, p.nome as produto_nome 
      FROM itens_pedido ip
      JOIN produtos p ON ip.produto_id = p.id
      WHERE ip.pedido_id = $1
    `, [id]);
    res.json({
      sucesso: true,
      pedido: pedidoResult.rows[0],
      itens: itensResult.rows
    });
  } catch (err) {
    console.error("Erro ao buscar:", err);
    res.status(500).json({ sucesso: false, mensagem: err.message });
  }
};

const criar = async (req, res) => {
  try {
    const { cliente_id, itens, observacao } = req.body;
    
    if (!cliente_id || !itens || itens.length === 0) {
      return res.status(400).json({ sucesso: false, mensagem: "Cliente e itens são obrigatórios" });
    }
    
    let total = 0;
    for (const item of itens) {
      const produtoResult = await db.query("SELECT preco FROM produtos WHERE id = $1", [item.produto_id]);
      if (produtoResult.rows.length === 0) {
        return res.status(404).json({ sucesso: false, mensagem: "Produto não encontrado" });
      }
      total += parseFloat(produtoResult.rows[0].preco) * item.quantidade;
    }
    
    const pedidoResult = await db.query(
      "INSERT INTO pedidos (cliente_id, status, total, observacao, criado_em, atualizado_em) VALUES ($1, 'pendente', $2, $3, NOW(), NOW()) RETURNING *",
      [cliente_id, total, observacao || ""]
    );
    
    const pedidoId = pedidoResult.rows[0].id;
    
    for (const item of itens) {
      const produtoResult = await db.query("SELECT preco FROM produtos WHERE id = $1", [item.produto_id]);
      const preco = parseFloat(produtoResult.rows[0].preco);
      await db.query(
        "INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)",
        [pedidoId, item.produto_id, item.quantidade, preco, preco * item.quantidade]
      );
    }
    
    res.status(201).json({ sucesso: true, pedido: pedidoResult.rows[0] });
  } catch (err) {
    console.error("Erro ao criar pedido:", err);
    res.status(500).json({ sucesso: false, mensagem: err.message });
  }
};

const atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const statusValidos = ["pendente", "pago", "enviado", "entregue", "cancelado"];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ sucesso: false, mensagem: "Status inválido" });
    }
    
    const resultado = await db.query(
      "UPDATE pedidos SET status = $1, atualizado_em = NOW() WHERE id = $2 RETURNING *",
      [status, id]
    );
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Pedido não encontrado" });
    }
    
    res.json({ sucesso: true, pedido: resultado.rows[0] });
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    res.status(500).json({ sucesso: false, mensagem: err.message });
  }
};

const relatorioVendas = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT 
        DATE(p.criado_em) as data,
        COUNT(*) as total_pedidos,
        SUM(p.total) as valor_total
      FROM pedidos p
      WHERE p.status = 'entregue'
      GROUP BY DATE(p.criado_em)
      ORDER BY data DESC
    `);
    
    res.json({
      sucesso: true,
      relatorio: resultado.rows,
      resumo: {
        total_vendas: resultado.rows.reduce((acc, r) => acc + parseFloat(r.valor_total), 0),
        total_pedidos: resultado.rows.reduce((acc, r) => acc + parseInt(r.total_pedidos), 0)
      }
    });
  } catch (err) {
    console.error("Erro no relatório:", err);
    res.status(500).json({ sucesso: false, mensagem: err.message });
  }
};

module.exports = { listar, buscarPorId, criar, atualizarStatus, relatorioVendas };
