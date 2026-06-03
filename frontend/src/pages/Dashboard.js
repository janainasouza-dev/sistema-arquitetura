import React, { useState, useEffect } from "react";
import { produtosService, pedidosService, clientesService } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalPedidos: 0,
    totalClientes: 0,
    produtosEstoqueBaixo: 0,
    pedidosPendentes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    carregarDashboard(); 
  }, []);

  const carregarDashboard = async () => {
    try {
      const [prodRes, pedRes, cliRes] = await Promise.all([
        produtosService.listar(),
        pedidosService.listar(),
        clientesService.listar()
      ]);
      
      const produtos = prodRes.data.produtos || [];
      const pedidos = pedRes.data.pedidos || [];
      const clientes = cliRes.data.clientes || cliRes.data.dados || [];
      
      const produtosEstoqueBaixo = produtos.filter(p => p.estoque < 20).length;
      const pedidosPendentes = pedidos.filter(p => p.status === "pendente").length;
      
      setStats({
        totalProdutos: produtos.length,
        totalPedidos: pedidos.length,
        totalClientes: clientes.length,
        produtosEstoqueBaixo,
        pedidosPendentes
      });
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Carregando dashboard...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>📊 Dashboard</h1>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "20px" 
      }}>
        <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <h3 style={{ margin: 0 }}>📦 Produtos</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", margin: "10px 0" }}>{stats.totalProdutos}</p>
          {stats.produtosEstoqueBaixo > 0 && <small>⚠️ {stats.produtosEstoqueBaixo} com estoque baixo</small>}
        </div>
        
        <div style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <h3 style={{ margin: 0 }}>🛒 Pedidos</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", margin: "10px 0" }}>{stats.totalPedidos}</p>
          <small>{stats.pedidosPendentes} pendentes</small>
        </div>
        
        <div style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "white", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <h3 style={{ margin: 0 }}>👥 Clientes</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", margin: "10px 0" }}>{stats.totalClientes}</p>
        </div>
        
        <div style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", color: "white", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <h3 style={{ margin: 0 }}>💰 Total</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", margin: "10px 0" }}>R$ 0</p>
        </div>
      </div>
    </div>
  );
}