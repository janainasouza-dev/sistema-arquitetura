import React, { useEffect, useState } from "react";
import { pedidosService, clientesService, produtosService } from "../services/api";

const STATUS_OPTIONS = ["pendente", "pago", "enviado", "entregue", "cancelado"];

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [detalhe, setDetalhe] = useState(null);
  const [detalheId, setDetalheId] = useState(null);
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
      
      setPedidos(rPed.data.pedidos || []);
      setClientes(rCli.data.dados || []);
      setProdutos(rProd.data.produtos || []);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const atualizarStatus = async (id, status) => {
    try {
      await pedidosService.atualizarStatus(id, status);
      exibirMensagem(`Status do pedido ${id} atualizado para ${status}`, "success");
      carregar();
    } catch (error) {
      console.error("Erro:", error);
      exibirMensagem("Erro ao atualizar status", "danger");
    }
  };

  const verDetalhes = async (id) => {
    try {
      const res = await pedidosService.buscarPorId(id);
      setDetalhe(res.data.pedido);
      setDetalheId(id);
    } catch (error) {
      console.error("Erro:", error);
      exibirMensagem("Erro ao carregar detalhes", "danger");
    }
  };

  const adicionarItem = () => {
    setNovoForm((prev) => ({
      ...prev,
      itens: [...prev.itens, { produto_id: "", quantidade: 1 }],
    }));
  };

  const atualizarItem = (index, campo, valor) => {
    const itens = [...novoForm.itens];
    itens[index][campo] = valor;
    setNovoForm((prev) => ({ ...prev, itens }));
  };

  const removerItem = (index) => {
    setNovoForm((prev) => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index),
    }));
  };

  const salvarPedido = async () => {
    if (!novoForm.cliente_id || novoForm.itens.length === 0) {
      exibirMensagem("Selecione o cliente e adicione pelo menos um item", "danger");
      return;
    }
    
    const dadosParaEnviar = {
      cliente_id: parseInt(novoForm.cliente_id),
      observacao: novoForm.observacao,
      itens: novoForm.itens.map(item => ({
        produto_id: parseInt(item.produto_id),
        quantidade: parseInt(item.quantidade)
      }))
    };
    
    try {
      await pedidosService.criar(dadosParaEnviar);
      exibirMensagem("Pedido criado com sucesso!", "success");
      setModal(false);
      setNovoForm({ cliente_id: "", observacao: "", itens: [] });
      carregar();
    } catch (error) {
      console.error("Erro:", error);
      exibirMensagem("Erro ao criar pedido", "danger");
    }
  };

  const exibirMensagem = (texto, tipo) => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 3000);
  };

  const pedidosFiltrados = filtrando ? pedidos.filter(p => p.status === filtrando) : pedidos;

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>⏳ Carregando pedidos...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
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
        <button onClick={() => setFiltrando("")} style={{ padding: "5px 10px", cursor: "pointer", background: filtrando === "" ? "#c8841a" : "#eee", border: "none", borderRadius: "5px" }}>Todos</button>
        {STATUS_OPTIONS.map((s) => (
          <button key={s} onClick={() => setFiltrando(s)} style={{ padding: "5px 10px", cursor: "pointer", background: filtrando === s ? "#c8841a" : "#eee", border: "none", borderRadius: "5px" }}>
            {s}
          </button>
        ))}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "10px", overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "#c8841a", color: "white" }}>
            <th style={{ padding: "12px" }}>ID</th>
            <th style={{ padding: "12px" }}>Cliente</th>
            <th style={{ padding: "12px" }}>Status</th>
            <th style={{ padding: "12px" }}>Total</th>
            <th style={{ padding: "12px" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px" }}>{p.id}</td>
              <td style={{ padding: "12px" }}>{p.cliente_nome || "-"}</td>
              <td style={{ padding: "12px" }}>
                <select 
                  value={p.status} 
                  onChange={(e) => atualizarStatus(p.id, e.target.value)}
                  style={{ padding: "5px 10px", borderRadius: "5px", border: "1px solid #ddd", cursor: "pointer" }}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td style={{ padding: "12px" }}>R$ {parseFloat(p.total || 0).toFixed(2)}</td>
              <td style={{ padding: "12px" }}>
                <button onClick={() => verDetalhes(p.id)} style={{ padding: "5px 10px", cursor: "pointer", borderRadius: "5px", border: "1px solid #ddd", background: "#fff" }}>Ver</button>
              </td>
            </tr>
          ))}
          {pedidosFiltrados.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "50px" }}>Nenhum pedido encontrado</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de detalhes */}
      {detalheId && detalhe && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => { setDetalheId(null); setDetalhe(null); }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "10px", width: "400px" }} onClick={(e) => e.stopPropagation()}>
            <h3>Detalhes do Pedido #{detalhe.id}</h3>
            <p><strong>Cliente:</strong> {detalhe.cliente_nome}</p>
            <p><strong>Status:</strong> {detalhe.status}</p>
            <p><strong>Total:</strong> R$ {parseFloat(detalhe.total || 0).toFixed(2)}</p>
            <p><strong>Observação:</strong> {detalhe.observacao || "-"}</p>
            <button onClick={() => { setDetalheId(null); setDetalhe(null); }} style={{ padding: "10px 20px", background: "#c8841a", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Fechar</button>
          </div>
        </div>
      )}

      {/* Modal de novo pedido */}
      {modal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setModal(false)}>
          <div style={{ background: "white", padding: "20px", borderRadius: "10px", width: "500px", maxHeight: "80vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <h3>Novo Pedido</h3>
            
            <select 
              value={novoForm.cliente_id} 
              onChange={(e) => setNovoForm({ ...novoForm, cliente_id: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
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
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
            />

            <h4>Itens</h4>
            {novoForm.itens.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                <select 
                  value={item.produto_id} 
                  onChange={(e) => atualizarItem(i, "produto_id", e.target.value)}
                  style={{ flex: 2, padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
                >
                  <option value="">Produto...</option>
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome} - R$ {parseFloat(p.preco).toFixed(2)}</option>
                  ))}
                </select>
                <input 
                  type="number" 
                  min="1" 
                  value={item.quantidade} 
                  onChange={(e) => atualizarItem(i, "quantidade", parseInt(e.target.value))}
                  style={{ width: "70px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
                />
                <button onClick={() => removerItem(i)} style={{ padding: "10px", cursor: "pointer", background: "#dc3545", color: "white", border: "none", borderRadius: "5px" }}>X</button>
              </div>
            ))}
            
            <button onClick={adicionarItem} style={{ padding: "10px 20px", marginBottom: "15px", cursor: "pointer", background: "#28a745", color: "white", border: "none", borderRadius: "5px" }}>
              + Adicionar Item
            </button>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
              <button onClick={() => setModal(false)} style={{ padding: "10px 20px", background: "#999", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Cancelar</button>
              <button onClick={salvarPedido} style={{ padding: "10px 20px", background: "#c8841a", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Criar Pedido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}