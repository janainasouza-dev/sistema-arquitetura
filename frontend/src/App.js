import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './index.css';
import Dashboard    from './pages/Dashboard';
import Produtos     from './pages/Produtos';
import Categorias   from './pages/Categorias';
import Clientes     from './pages/Clientes';
import Pedidos      from './pages/Pedidos';
import Funcionarios from './pages/Funcionarios';
import Relatorios   from './pages/Relatorios';
import Login        from './pages/Login';

function Sidebar({ usuario, onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1><i className="ti ti-bread"></i> Padaria WeCoffe</h1>
        <p>Sistema de Gestão</p>
      </div>
      <nav>
        <NavLink to="/" end>
          <i className="ti ti-layout-dashboard"></i> Dashboard
        </NavLink>
        <NavLink to="/produtos">
          <i className="ti ti-shopping-bag"></i> Produtos
        </NavLink>
        <NavLink to="/categorias">
          <i className="ti ti-tag"></i> Categorias
        </NavLink>
        <NavLink to="/clientes">
          <i className="ti ti-users"></i> Clientes
        </NavLink>
        <NavLink to="/pedidos">
          <i className="ti ti-shopping-cart"></i> Pedidos
        </NavLink>
        <NavLink to="/funcionarios">
          <i className="ti ti-id-badge-2"></i> Funcionários
        </NavLink>
        <NavLink to="/relatorios">
          <i className="ti ti-chart-bar"></i> Relatórios
        </NavLink>
      </nav>

      <div style={{
        marginTop: 'auto',
        padding: '16px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-user-circle"></i> {usuario?.nome || usuario?.email}
        </div>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '8px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '6px',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <i className="ti ti-logout"></i> Sair
        </button>
      </div>
    </div>
  );
}

function App() {
  const [usuario, setUsuario] = useState(null);

  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar usuario={usuario} onLogout={() => setUsuario(null)} />
        <main className="main-content">
          <Routes>
            <Route path="/"             element={<Dashboard />} />
            <Route path="/produtos"     element={<Produtos />} />
            <Route path="/categorias"   element={<Categorias />} />
            <Route path="/clientes"     element={<Clientes />} />
            <Route path="/pedidos"      element={<Pedidos />} />
            <Route path="/funcionarios" element={<Funcionarios />} />
            <Route path="/relatorios"   element={<Relatorios />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;