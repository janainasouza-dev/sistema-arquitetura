import React, { useEffect, useState } from 'react';

// Simulação de serviço — substitua pelo seu funcionariosService real
const funcionariosService = {
  listar: async () => ({
    data: {
      dados: [
        { id: 1, nome: 'Ana Paula Silva', cargo: 'Padeira', email: 'ana@padaria.com', telefone: '63 99101-1111', turno: 'manha', ativo: true, criado_em: '2024-01-10' },
        { id: 2, nome: 'Carlos Souza',    cargo: 'Atendente', email: 'carlos@padaria.com', telefone: '63 99202-2222', turno: 'tarde', ativo: true, criado_em: '2024-02-15' },
        { id: 3, nome: 'Beatriz Lima',   cargo: 'Caixa',    email: 'bia@padaria.com',    telefone: '63 99303-3333', turno: 'manha', ativo: false, criado_em: '2024-03-20' },
      ]
    }
  }),
  criar:    async (dados) => ({ data: { dados } }),
  atualizar: async (id, dados) => ({ data: { dados } }),
  deletar:  async (id) => ({ data: {} }),
};

const CARGOS  = ['Padeiro', 'Padeira', 'Atendente', 'Caixa', 'Gerente', 'Auxiliar de Limpeza', 'Entregador'];
const TURNOS  = [{ value: 'manha', label: 'Manhã' }, { value: 'tarde', label: 'Tarde' }, { value: 'noite', label: 'Noite' }];
const FORM_VAZIO = { nome: '', cargo: '', email: '', telefone: '', turno: 'manha', ativo: true };

const TURNO_BADGE = {
  manha: { label: 'Manhã',  bg: 'rgba(255,243,210,0.9)', color: '#8a5c10' },
  tarde: { label: 'Tarde',  bg: 'rgba(220,238,255,0.9)', color: '#0c3a6e' },
  noite: { label: 'Noite',  bg: 'rgba(232,224,255,0.9)', color: '#3a1a6e' },
};

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [modal, setModal]               = useState(false);       // novo/editar
  const [visualizando, setVisualizando] = useState(null);        // detalhe
  const [form, setForm]                 = useState(FORM_VAZIO);
  const [editandoId, setEditandoId]     = useState(null);
  const [mensagem, setMensagem]         = useState(null);
  const [busca, setBusca]               = useState('');
  const [filtroTurno, setFiltroTurno]   = useState('');

  const carregar = async () => {
    try {
      const res = await funcionariosService.listar();
      setFuncionarios(res.data.dados || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const abrirModal = (func = null) => {
    if (func) {
      setForm({ nome: func.nome, cargo: func.cargo, email: func.email, telefone: func.telefone || '', turno: func.turno, ativo: func.ativo });
      setEditandoId(func.id);
    } else {
      setForm(FORM_VAZIO);
      setEditandoId(null);
    }
    setModal(true);
  };

  const fecharModal = () => { setModal(false); setForm(FORM_VAZIO); setEditandoId(null); };

  const salvar = async () => {
    if (!form.nome || !form.cargo || !form.email) {
      exibirMensagem('Preencha nome, cargo e email.', 'danger');
      return;
    }
    try {
      if (editandoId) {
        await funcionariosService.atualizar(editandoId, form);
        setFuncionarios(prev => prev.map(f => f.id === editandoId ? { ...f, ...form } : f));
      } else {
        const novoId = Date.now();
        setFuncionarios(prev => [...prev, { id: novoId, ...form, criado_em: new Date().toISOString() }]);
      }
      exibirMensagem(editandoId ? 'Funcionário atualizado!' : 'Funcionário cadastrado!', 'success');
      fecharModal();
    } catch {
      exibirMensagem('Erro ao salvar.', 'danger');
    }
  };

  const toggleAtivo = async (func) => {
    try {
      await funcionariosService.atualizar(func.id, { ...func, ativo: !func.ativo });
      setFuncionarios(prev => prev.map(f => f.id === func.id ? { ...f, ativo: !f.ativo } : f));
      exibirMensagem(`Funcionário ${!func.ativo ? 'ativado' : 'desativado'}.`, 'success');
    } catch {
      exibirMensagem('Erro ao alterar status.', 'danger');
    }
  };

  const exibirMensagem = (texto, tipo) => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 3000);
  };

  const lista = funcionarios
    .filter(f => f.nome.toLowerCase().includes(busca.toLowerCase()) || f.cargo.toLowerCase().includes(busca.toLowerCase()))
    .filter(f => filtroTurno ? f.turno === filtroTurno : true);

  const ativos   = funcionarios.filter(f => f.ativo).length;
  const inativos = funcionarios.filter(f => !f.ativo).length;

  if (loading) return (
    <div className="loading">
      <i className="ti ti-loader" style={{ marginRight: 8, fontSize: '1.2rem' }}></i>
      Carregando funcionários...
    </div>
  );

  return (
    <div>
      {/* Cabeçalho */}
      <div className="page-header">
        <div>
          <h2><i className="ti ti-id-badge-2" style={{ marginRight: 8, opacity: 0.8 }}></i>Funcionários</h2>
          <p>{funcionarios.length} funcionários · {ativos} ativos · {inativos} inativos</p>
        </div>
        <button className="btn btn-primary" onClick={() => abrirModal()}>
          <i className="ti ti-plus"></i> Novo Funcionário
        </button>
      </div>

      {mensagem && (
        <div className={`alert alert-${mensagem.tipo}`}>
          <i className={`ti ${mensagem.tipo === 'success' ? 'ti-circle-check' : 'ti-alert-circle'}`}></i>
          {mensagem.texto}
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#a08060', fontSize: '1rem' }}></i>
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome ou cargo..."
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #e0cdb8', borderRadius: 8, fontFamily: 'Nunito, sans-serif', fontSize: '0.875rem', background: 'rgba(253,250,246,0.85)', color: '#3d2b1a' }}
          />
        </div>
        <button className={`btn btn-sm ${filtroTurno === '' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFiltroTurno('')}>Todos</button>
        {TURNOS.map(t => (
          <button key={t.value} className={`btn btn-sm ${filtroTurno === t.value ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFiltroTurno(t.value)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Turno</th>
                <th>Contato</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-icon"><i className="ti ti-users-group"></i></div>
                      <p>Nenhum funcionário encontrado</p>
                    </div>
                  </td>
                </tr>
              ) : lista.map(f => {
                const turno = TURNO_BADGE[f.turno] || {};
                return (
                  <tr key={f.id}>
                    <td style={{ color: '#a08060', fontSize: '0.8rem' }}>{f.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(160,96,42,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className="ti ti-user" style={{ color: '#a0602a', fontSize: '1rem' }}></i>
                        </div>
                        <strong style={{ color: '#3d2b1a' }}>{f.nome}</strong>
                      </div>
                    </td>
                    <td>{f.cargo}</td>
                    <td>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: turno.bg, color: turno.color }}>
                        {turno.label}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>{f.email}</div>
                      <div style={{ fontSize: '0.75rem', color: '#a08060' }}>{f.telefone || '-'}</div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: f.ativo ? 'rgba(232,244,236,0.9)' : 'rgba(253,236,234,0.9)', color: f.ativo ? '#2d6e3e' : '#8a2020' }}>
                        {f.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setVisualizando(f)} title="Ver detalhes">
                          <i className="ti ti-eye"></i>
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => abrirModal(f)} title="Editar">
                          <i className="ti ti-pencil"></i>
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => toggleAtivo(f)} title={f.ativo ? 'Desativar' : 'Ativar'}>
                          <i className={`ti ${f.ativo ? 'ti-user-minus' : 'ti-user-plus'}`}></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Visualizar funcionário */}
      {visualizando && (
        <div className="modal-overlay" onClick={() => setVisualizando(null)}>
          <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(160,96,42,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <i className="ti ti-user" style={{ fontSize: '2rem', color: '#a0602a' }}></i>
              </div>
              <h3 style={{ marginBottom: 4 }}>{visualizando.nome}</h3>
              <p style={{ color: '#a08060', fontSize: '0.875rem' }}>{visualizando.cargo}</p>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              {[
                { icon: 'ti-mail',        label: 'Email',    value: visualizando.email },
                { icon: 'ti-phone',       label: 'Telefone', value: visualizando.telefone || '—' },
                { icon: 'ti-clock',       label: 'Turno',    value: TURNO_BADGE[visualizando.turno]?.label },
                { icon: 'ti-circle-check',label: 'Status',   value: visualizando.ativo ? 'Ativo' : 'Inativo' },
                { icon: 'ti-calendar',    label: 'Cadastrado', value: new Date(visualizando.criado_em).toLocaleDateString('pt-BR') },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(245,237,224,0.5)', borderRadius: 8, border: '1px solid rgba(224,205,184,0.5)' }}>
                  <i className={`ti ${row.icon}`} style={{ color: '#a0602a', fontSize: '1.05rem', width: 20, textAlign: 'center' }}></i>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#a08060', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{row.label}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3d2b1a' }}>{row.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setVisualizando(null)}>Fechar</button>
              <button className="btn btn-primary" onClick={() => { setVisualizando(null); abrirModal(visualizando); }}>
                <i className="ti ti-pencil"></i> Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo / Editar funcionário */}
      {modal && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3><i className="ti ti-id-badge-2" style={{ marginRight: 8, opacity: 0.7 }}></i>{editandoId ? 'Editar Funcionário' : 'Novo Funcionário'}</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Nome *</label>
                <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Nome completo" />
              </div>
              <div className="form-group">
                <label>Cargo *</label>
                <select value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })}>
                  <option value="">Selecione...</option>
                  {CARGOS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@padaria.com" />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} placeholder="63 99999-0000" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Turno</label>
                <select value={form.turno} onChange={e => setForm({ ...form, turno: e.target.value })}>
                  {TURNOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.ativo ? 'true' : 'false'} onChange={e => setForm({ ...form, ativo: e.target.value === 'true' })}>
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={fecharModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={salvar}>
                <i className="ti ti-device-floppy"></i> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}