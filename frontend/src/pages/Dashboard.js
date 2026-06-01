import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { produtosService, pedidosService, clientesService } from '../services/api';

const COLORS = ['#c8841a', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalPedidos: 0,
    totalClientes: 0,
    produtosEstoqueBaixo: 0,
    pedidosPorStatus: [],
    vendasPorMes: []
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      const produtosRes = await produtosService.listar({ limit: 1000 });
      const produtos = produtosRes.data.produtos || [];
      
      const pedidosRes = await pedidosService.listar();
      const pedidos = pedidosRes.data.pedidos || [];
      
      const clientesRes = await clientesService.listar();
      const clientes = clientesRes.data.clientes || [];

      const produtosEstoqueBaixo = produtos.filter(p => p.estoque < 20).length;

      const statusMap = {};
      pedidos.forEach(p => {
        statusMap[p.status] = (statusMap[p.status] || 0) + 1;
      });
      const pedidosPorStatus = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const vendasPorMes = meses.map((mes, index) => {
        const total = pedidos
          .filter(p => p.status === 'entregue' && new Date(p.criado_em).getMonth() === index)
          .reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);
        return { mes, vendas: total };
      });

      setStats({
        totalProdutos: produtos.length,
        totalPedidos: pedidos.length,
        totalClientes: clientes.length,
        produtosEstoqueBaixo,
        pedidosPorStatus,
        vendasPorMes
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando dashboard...</div>;
  }

  return (
    <div>
      <h1>📊 Dashboard</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3>📦 Produtos</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{stats.totalProdutos}</p>
          {stats.produtosEstoqueBaixo > 0 && (
            <small style={{ color: '#c8841a' }}>⚠️ {stats.produtosEstoqueBaixo} com estoque baixo</small>
          )}
        </div>
        
        <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3>🛒 Pedidos</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{stats.totalPedidos}</p>
        </div>
        
        <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h3>👥 Clientes</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{stats.totalClientes}</p>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>📈 Vendas por Mês</h3>
        <BarChart width={800} height={300} data={stats.vendasPorMes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="vendas" fill="#c8841a" name="Vendas (R$)" />
        </BarChart>
      </div>

      {stats.pedidosPorStatus.length > 0 && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>🥧 Pedidos por Status</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={stats.pedidosPorStatus}
              cx={200}
              cy={150}
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {stats.pedidosPorStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      )}
    </div>
  );
}