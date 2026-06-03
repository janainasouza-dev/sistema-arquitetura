import React, { useState } from 'react';
import { authService } from '../services/api';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleSubmit = async () => {
    setErro(null);
    
    if (!form.email || !form.senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('📧 Tentando login com:', form.email);
      
      // Chamada REAL para sua API usando o authService
      const { user } = await authService.login(form.email, form.senha);
      
      console.log('✅ Login bem-sucedido! Usuário:', user);
      console.log('🔑 Token salvo:', localStorage.getItem('@App:token'));
      
      // Chama o callback onLogin passando os dados do usuário
      // O App.js vai gerenciar o redirecionamento automaticamente
      if (onLogin) {
        onLogin(user);
      }
      
    } catch (error) {
      console.error('❌ Erro detalhado no login:', error);
      console.error('Response:', error.response);
      console.error('Request:', error.request);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setErro('Email ou senha inválidos.');
            break;
          case 404:
            setErro('Serviço de autenticação não encontrado. Contate o suporte.');
            break;
          default:
            setErro(error.response.data?.message || error.response.data?.mensagem || 'Erro ao fazer login. Tente novamente.');
        }
      } else if (error.request) {
        setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        setErro('Erro ao tentar fazer login: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Lato', sans-serif;
          background-color: #1a0f07;
          overflow: hidden;
          position: relative;
        }

        /* Painel esquerdo — visual */
        .login-visual {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 56px 48px;
          position: relative;
          background:
            linear-gradient(160deg, rgba(26,15,7,0.55) 0%, rgba(26,15,7,0.75) 100%),
            url('https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=80') center/cover no-repeat;
          overflow: hidden;
        }

        .login-visual::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
          pointer-events: none;
        }

        .visual-tag {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #f0b429;
          border: 1px solid #f0b429;
          padding: 4px 12px;
          border-radius: 2px;
          margin-bottom: 20px;
        }

        .visual-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 4vw, 3.5rem);
          font-weight: 700;
          color: #fdf0e0;
          line-height: 1.15;
          margin-bottom: 16px;
        }

        .visual-title em {
          font-style: italic;
          color: #f0b429;
        }

        .visual-desc {
          font-size: 0.95rem;
          font-weight: 300;
          color: rgba(253,240,224,0.7);
          line-height: 1.7;
          max-width: 340px;
          margin-bottom: 40px;
        }

        .visual-dots {
          display: flex;
          gap: 8px;
        }

        .visual-dots span {
          width: 28px;
          height: 3px;
          border-radius: 2px;
          background: rgba(253,240,224,0.3);
        }

        .visual-dots span:first-child {
          background: #f0b429;
          width: 44px;
        }

        /* Painel direito — formulário */
        .login-panel {
          width: 420px;
          min-width: 380px;
          background: #fdf6ed;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 48px;
          position: relative;
          box-shadow: -20px 0 60px rgba(0,0,0,0.4);
        }

        .login-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #c8841a, #f0b429, #e8723a);
        }

        .login-logo {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #3d1f0a;
          margin-bottom: 4px;
          line-height: 1;
        }

        .login-logo span {
          color: #c8841a;
        }

        .login-sub {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #b0856a;
          margin-bottom: 44px;
        }

        .login-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7a5c4a;
          margin-bottom: 8px;
          display: block;
        }

        .login-field {
          position: relative;
          margin-bottom: 20px;
        }

        .login-input {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid #e8d5c0;
          border-radius: 6px;
          background: #fff;
          font-family: 'Lato', sans-serif;
          font-size: 0.95rem;
          color: #3d1f0a;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }

        .login-input:focus {
          border-color: #c8841a;
          box-shadow: 0 0 0 3px rgba(200,132,26,0.12);
        }

        .login-input::placeholder {
          color: #c4a898;
        }

        .toggle-senha {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: #b0856a;
          padding: 0;
          line-height: 1;
        }

        .login-erro {
          background: #fff0f0;
          border: 1px solid #f5c6c6;
          border-radius: 6px;
          color: #c0392b;
          font-size: 0.85rem;
          padding: 10px 14px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .login-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #c8841a, #e8a030);
          color: #fff;
          border: none;
          border-radius: 6px;
          font-family: 'Lato', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
        }

        .login-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .login-hint {
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid #e8d5c0;
          font-size: 0.78rem;
          color: #b0856a;
          line-height: 1.6;
        }

        .login-hint strong {
          color: #7a5c4a;
        }

        /* Spinner */
        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Responsivo */
        @media (max-width: 768px) {
          .login-visual { display: none; }
          .login-panel {
            width: 100%;
            min-width: unset;
            padding: 48px 32px;
          }
        }
      `}</style>

      <div className="login-root">
        {/* Painel visual esquerdo */}
        <div className="login-visual">
          <span className="visual-tag">Padaria Artesanal</span>
          <h1 className="visual-title">
            Feito com<br />
            <em>amor</em> e<br />
            farinha.
          </h1>
          <p className="visual-desc">
            Gerencie produtos, pedidos e clientes da sua padaria em um só lugar.
          </p>
          <div className="visual-dots">
            <span /><span /><span />
          </div>
        </div>

        {/* Painel de formulário */}
        <div className="login-panel">
          <div className="login-logo">🥖 Padaria<span>WeCoffe</span></div>
          <p className="login-sub">Sistema de Gestão</p>

          {erro && (
            <div className="login-erro">
              ⚠️ {erro}
            </div>
          )}

          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              className="login-input"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div className="login-field">
            <label className="login-label">Senha</label>
            <input
              className="login-input"
              type={mostrarSenha ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.senha}
              onChange={e => setForm({ ...form, senha: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <button
              className="toggle-senha"
              onClick={() => setMostrarSenha(v => !v)}
              tabIndex={-1}
              type="button"
            >
              {mostrarSenha ? '🙈' : '👁️'}
            </button>
          </div>

          <button
            className="login-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" />Entrando...</>
            ) : (
              'Entrar no sistema'
            )}
          </button>

          
        </div>
      </div>
    </>
  );
}