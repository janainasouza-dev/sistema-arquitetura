import React, { useState, useEffect } from "react";
import { funcionariosService } from "../services/api";

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", cargo: "", turno: "", telefone: "", salario: "" });

  useEffect(() => { 
    carregarFuncionarios(); 
  }, []);

  const carregarFuncionarios = async () => {
    try {
      const res = await funcionariosService.listar();
      console.log("Funcionários carregados:", res.data);
      setFuncionarios(res.data.funcionarios || []);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
    } finally {
      setLoading(false);
    }
  };

  const salvarFuncionario = async () => {
    if (!form.nome || !form.email) {
      alert("Nome e email são obrigatórios");
      return;
    }
    try {
      await funcionariosService.criar(form);
      setModal(false);
      setForm({ nome: "", email: "", cargo: "", turno: "", telefone: "", salario: "" });
      carregarFuncionarios();
      alert("Funcionário salvo com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar funcionário");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Carregando funcionários...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>👥 Funcionários</h2>
        <button onClick={() => setModal(true)} style={{ padding: "10px 20px", background: "#c8841a", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          + Novo Funcionário
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "10px", overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "#c8841a", color: "white" }}>
            <th style={{ padding: "12px" }}>ID</th>
            <th style={{ padding: "12px" }}>Nome</th>
            <th style={{ padding: "12px" }}>Email</th>
            <th style={{ padding: "12px" }}>Cargo</th>
            <th style={{ padding: "12px" }}>Turno</th>
            <th style={{ padding: "12px" }}>Telefone</th>
            <th style={{ padding: "12px" }}>Salário</th>
           </tr>
        </thead>
        <tbody>
          {funcionarios.map(func => (
            <tr key={func.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px" }}>{func.id}</td>
              <td style={{ padding: "12px" }}><strong>{func.nome}</strong></td>
              <td style={{ padding: "12px" }}>{func.email}</td>
              <td style={{ padding: "12px" }}>{func.cargo}</td>
              <td style={{ padding: "12px" }}>{func.turno || "-"}</td>
              <td style={{ padding: "12px" }}>{func.telefone || "-"}</td>
              <td style={{ padding: "12px" }}>R$ {parseFloat(func.salario || 0).toFixed(2)}</td>
            </tr>
          ))}
          {funcionarios.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "50px" }}>Nenhum funcionário encontrado</td>
            </tr>
          )}
        </tbody>
      </table>

      {modal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setModal(false)}>
          <div style={{ background: "white", padding: "20px", borderRadius: "10px", width: "450px" }} onClick={e => e.stopPropagation()}>
            <h3>Novo Funcionário</h3>
            <input type="text" placeholder="Nome *" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd" }} />
            <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd" }} />
            <input type="text" placeholder="Cargo" value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd" }} />
            
            <select value={form.turno} onChange={e => setForm({ ...form, turno: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd" }}>
              <option value="">Selecione o turno</option>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
            </select>
            
            <input type="text" placeholder="Telefone" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd" }} />
            <input type="number" step="0.01" placeholder="Salário" value={form.salario} onChange={e => setForm({ ...form, salario: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd" }} />
            
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
              <button onClick={() => setModal(false)} style={{ padding: "10px 20px", background: "#999", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Cancelar</button>
              <button onClick={salvarFuncionario} style={{ padding: "10px 20px", background: "#c8841a", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}