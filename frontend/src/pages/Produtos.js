import React, { useState, useEffect } from 'react';
import { produtosService, categoriasService } from '../services/api';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
    categoria_id: ''
  });

  useEffect(() => {
    carregarCategorias();
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [pagina, busca]);

  const carregarCategorias = async () => {
    try {
      const res = await categoriasService.listar();
      setCategorias(res.data.categorias || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const carregarProdutos = async () => {
    setCarregando(true);
    try {
      const res = await produtosService.listar({ page: pagina, limit: 10, busca });
      if (res.data.sucesso) {
        setProdutos(res.data.produtos);
        setTotalPaginas(res.data.paginacao.total_paginas);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await produtosService.atualizar(editando, form);
      } else {
        await produtosService.criar(form);
      }
      setMostrarForm(false);
      setEditando(null);
      setForm({ nome: '', descricao: '', preco: '', estoque: '', categoria_id: '' });
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar produto');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await produtosService.deletar(id);
        carregarProdutos();
      } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Erro ao excluir produto');
      }
    }
  };

  const handleEdit = (produto) => {
    setEditando(produto.id);
    setForm({
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco,
      estoque: produto.estoque,
      categoria_id: produto.categoria_id || ''
    });
    setMostrarForm(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>📦 Produtos</h1>
        <button onClick={() => { setMostrarForm(true); setEditando(null); setForm({ nome: '', descricao: '', preco: '', estoque: '', categoria_id: '' }); }} style={{ padding: '10px 20px', background: '#c8841a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          + Novo Produto
        </button>
      </div>

      {/* Busca */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Buscar produtos por nome ou descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <form onSubmit={handleSubmit} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3>{editando ? 'Editar Produto' : 'Novo Produto'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <input type="text" placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required style={{ padding: '8px' }} />
            <input type="text" placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} style={{ padding: '8px' }} />
            <input type="number" step="0.01" placeholder="Preço" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required style={{ padding: '8px' }} />
            <input type="number" placeholder="Estoque" value={form.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} style={{ padding: '8px' }} />
            <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })} style={{ padding: '8px' }}>
              <option value="">Selecione a categoria</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ padding: '8px 16px', background: '#c8841a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Salvar</button>
            <button type="button" onClick={() => { setMostrarForm(false); setEditando(null); }} style={{ padding: '8px 16px', background: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancelar</button>
          </div>
        </form>
      )}

      {/* Tabela */}
      {carregando ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Carregando...</div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#c8841a', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nome</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Categoria</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Preço</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Estoque</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(produto => (
                <tr key={produto.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{produto.id}</td>
                  <td style={{ padding: '12px' }}>{produto.nome}</td>
                  <td style={{ padding: '12px' }}>{produto.categoria_nome || '-'}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>R$ {parseFloat(produto.preco).toFixed(2)}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{produto.estoque}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button onClick={() => handleEdit(produto)} style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}>✏️</button>
                    <button onClick={() => handleDelete(produto.id)} style={{ padding: '5px 10px', cursor: 'pointer' }}>🗑️</button>
                  </td>
                 </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => setPagina(p => Math.max(1, p-1))} disabled={pagina === 1} style={{ padding: '8px 16px', cursor: 'pointer' }}>Anterior</button>
            <span style={{ padding: '8px 16px' }}>Página {pagina} de {totalPaginas}</span>
            <button onClick={() => setPagina(p => Math.min(totalPaginas, p+1))} disabled={pagina === totalPaginas} style={{ padding: '8px 16px', cursor: 'pointer' }}>Próxima</button>
          </div>
        </>
      )}
    </div>
  );
}