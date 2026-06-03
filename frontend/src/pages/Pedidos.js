import React, { useEffect, useState } from "react";
import { pedidosService, clientesService, produtosService } from "../services/api";

const STATUS_OPTIONS = ["pendente", "pago", "entregue", "cancelado"];

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [detalheId, setDetalheId] = useState(null);
  const [detalhe, setDetalhe] = useState(null);
  const [mensagem, setMensagem] = useState(null);
  const [filtrando, setFiltrando] = useState("");
  const [novoForm, setNovoForm] = useState({ cliente_id: "", observacao: "", itens: [] });

  const carregar = async () => {
    try {
      const [rPed, rCli, rProd] = await Promise.all([
        pedidosService.listar(),
        clientesService.listar(),
        produtosService.listar(),
      ]);
      
      console.log("=== DEBUG PEDIDOS ===");
      console.log("Clientes recebidos:", rCli.data);
      console.log("Produtos recebidos:", rProd.data);
      
      setPedidos(rPed.data.pedidos || []);
      setClientes(rCli.data.clientes || []);
      setProdutos(rProd.data.produtos || []);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const adicionarItem = () => {
    setNovoForm((prev) => ({
      ...prev,
      itens: [...prev.itens, { produto_id: "", quantidade: 1, preco_unitario: 0 }],
    }));
  };

  const atualizarItem = (index, campo, valor) => {
    const itens = [...novoForm.itens];
    itens[index][campo] = valor;
    if (campo === "produto_id") {
      const prod = produtos.find((p) => p.id === Number(valor));
      if (prod) itens[index].preco_unitario = parseFloat(prod.preco);
    }
    setNovoForm((prev) => ({ ...prev, itens }));
  };

  const removerItem = (index) => {
    setNovoForm((prev) => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index),
    }));
  };

  const totalNovoPedido = novoForm.itens.reduce((acc, item) => acc + item.quantidade * item.preco_unitario, 0);

  const salvarPedido = async () => {
    if (!novoForm.cliente_id || novoForm.itens.length === 0) {
      alert("Selecione o cliente e adicione pelo menos um item");
      return;
    }
    try {
      await pedidosService.criar(novoForm);
      alert("Pedido criado com sucesso!");
      setModal(false);
      setNovoForm({ cliente_id: "", observacao: "", itens: [] });
      carregar();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar pedido");
    }
  };

  const exibirMensagem = (texto, tipo) => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 3000);
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>⏳ Carregando...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>🛒 Pedidos</h2>
        <button onClick={() => setModal(true)} style={{ padding: "10px 20px", background: "#c8841a", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          + Novo Pedido
        </button>
      </div>

      {mensagem && (
        <div style={{ padding: "10px", marginBottom: "20px", borderRadius: "5px", background: mensagem.tipo === "success" ? "#d4edda" : "#f8d7da", color: mensagem.tipo === "success" ? "#155724" : "#721c24" }}>
          {mensagem.texto}
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        <button onClick={() => setFiltrando("")} style={{ padding: "5px 10px", cursor: "pointer", background: filtrando === "" ? "#c8841a" : "#eee" }}>Todos</button>
        {STATUS_OPTIONS.map((s) => (
          <button key={s} onClick={() => setFiltrando(s)} style={{ padding: "5px 10px", cursor: "pointer", background: filtrando === s ? "#c8841a" : "#eee" }}>
            {s}
          </button>
        ))}
      </div>

      {pedidos.map((p) => (
        <div key={p.id} style={{ background: "#fff", padding: "15px", marginBottom: "10px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <strong>Pedido #{p.id}</strong> — {p.cliente_nome || "Cliente não encontrado"}
          <span style={{ marginLeft: "10px", padding: "2px 8px", borderRadius: "20px", fontSize: "12px", background: p.status === "entregue" ? "#28a745" : "#ffc107", color: "white" }}>{p.status}</span>
          <div>Total: R$ {Number(p.total).toFixed(2)}</div>
        </div>
      ))}

      {modal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setModal(false)}>
          <div style={{ background: "white", padding: "30px", borderRadius: "10px", width: "500px" }} onClick={(e) => e.stopPropagation()}>
            <h3>Novo Pedido</h3>
            
            <select 
              value={novoForm.cliente_id} 
              onChange={(e) => setNovoForm({ ...novoForm, cliente_id: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            >
              <option value="">Selecione o cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>

            <textarea 
              placeholder="Observação" 
              value={novoForm.observacao} 
              onChange={(e) => setNovoForm({ ...novoForm, observacao: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            />

            <h4>Itens</h4>
            {novoForm.itens.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <select 
                  value={item.produto_id} 
                  onChange={(e) => atualizarItem(i, "produto_id", e.target.value)}
                  style={{ flex: 2, padding: "10px" }}
                >
                  <option value="">Produto...</option>
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome} - R$ {p.preco}</option>
                  ))}
                </select>
                <input type="number" min={1} value={item.quantidade} onChange={(e) => atualizarItem(i, "quantidade", Number(e.target.value))} style={{ width: "70px", padding: "10px" }} />
                <button onClick={() => removerItem(i)} style={{ padding: "10px", background: "#dc3545", color: "white", border: "none", borderRadius: "5px" }}>X</button>
              </div>
            ))}
            
            <button onClick={adicionarItem} style={{ padding: "10px 20px", marginBottom: "15px", background: "#28a745", color: "white", border: "none", borderRadius: "5px" }}>+ Adicionar Item</button>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setModal(false)} style={{ padding: "10px 20px", background: "#999", color: "white", border: "none", borderRadius: "5px" }}>Cancelar</button>
              <button onClick={salvarPedido} style={{ padding: "10px 20px", background: "#c8841a", color: "white", border: "none", borderRadius: "5px" }}>Criar Pedido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
