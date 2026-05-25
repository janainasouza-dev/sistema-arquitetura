// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Categorias from './pages/Categorias';
import Clientes from './pages/Clientes';
import Pedidos from './pages/Pedidos';
import Login from './pages/Login';

function Sidebar({ usuario, onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>🥖 Padaria WeCoffe</h1>
        <p>Sistema de Gestão</p>
      </div>
      <nav>
        <NavLink to="/" end>
          <span className="nav-icon">📊</span> Dashboard
        </NavLink>
        <NavLink to="/produtos">
          <span className="nav-icon">🍞</span> Produtos
        </NavLink>
        <NavLink to="/categorias">
          <span className="nav-icon">🏷️</span> Categorias
        </NavLink>
        <NavLink to="/clientes">
          <span className="nav-icon">👥</span> Clientes
        </NavLink>
        <NavLink to="/pedidos">
          <span className="nav-icon">🛒</span> Pedidos
        </NavLink>
      </nav>

      {/* Rodapé da sidebar com usuário logado e botão de sair */}
      <div style={{
        marginTop: 'auto',
        padding: '16px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: 8 }}>
          👤 {usuario?.nome || usuario?.email}
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
          }}
        >
          🚪 Sair
        </button>
      </div>
    </div>
  );
}

function App() {
  const [usuario, setUsuario] = useState(null);

  // Se não há usuário logado, mostra só a tela de Login
  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  // Se está logado, mostra o app completo
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar usuario={usuario} onLogout={() => setUsuario(null)} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/pedidos" element={<Pedidos />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;