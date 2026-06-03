import React, { useState, useEffect } from "react";
import { categoriasService } from "../services/api";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nome: "", descricao: "" });

  useEffect(() => { 
    carregarCategorias(); 
  }, []);

  const carregarCategorias = async () => {
    try {
      const res = await categoriasService.listar();
      console.log("API retornou:", res.data);
      setCategorias(res.data.categorias || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  const salvarCategoria = async () => {
    if (!form.nome) {
      alert("Nome da categoria é obrigatório");
      return;
    }
    try {
      await categoriasService.criar(form);
      setModal(false);
      setForm({ nome: "", descricao: "" });
      carregarCategorias();
      alert("Categoria criada com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar categoria");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Carregando categorias...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>🏷️ Categorias</h2>
        <button onClick={() => setModal(true)} style={{ padding: "10px 20px", background: "#c8841a", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          + Nova Categoria
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "10px", overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "#c8841a", color: "white" }}>
            <th style={{ padding: "12px" }}>ID</th>
            <th style={{ padding: "12px" }}>Nome</th>
            <th style={{ padding: "12px" }}>Descrição</th>
           </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px" }}>{cat.id}</td>
              <td style={{ padding: "12px" }}><strong>{cat.nome}</strong></td>
              <td style={{ padding: "12px" }}>{cat.descricao || "-"}</td>
            </tr>
          ))}
          {categorias.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "50px" }}>Nenhuma categoria encontrada</td>
            </tr>
          )}
        </tbody>
      </table>

      {modal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setModal(false)}>
          <div style={{ background: "white", padding: "20px", borderRadius: "10px", width: "400px" }} onClick={e => e.stopPropagation()}>
            <h3>Nova Categoria</h3>
            <input 
              type="text" 
              placeholder="Nome *" 
              value={form.nome} 
              onChange={e => setForm({ ...form, nome: e.target.value })} 
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd" }} 
            />
            <textarea 
              placeholder="Descrição" 
              value={form.descricao} 
              onChange={e => setForm({ ...form, descricao: e.target.value })} 
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd" }} 
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setModal(false)} style={{ padding: "10px 20px", background: "#999", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Cancelar</button>
              <button onClick={salvarCategoria} style={{ padding: "10px 20px", background: "#c8841a", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}