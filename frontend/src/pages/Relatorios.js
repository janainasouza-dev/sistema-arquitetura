import React, { useState } from 'react';
import { pedidosService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Relatorios() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [relatorio, setRelatorio] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const gerarRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      alert('Selecione o período');
      return;
    }
    
    setCarregando(true);
    try {
      const response = await pedidosService.relatorioVendas(dataInicio, dataFim);
      console.log("API retornou:", response.data);
      setRelatorio(response.data);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar relatório');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <h1>📈 Relatório de Vendas</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div>
          <label>Data Início</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            style={{ display: 'block', padding: '8px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>
        <div>
          <label>Data Fim</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            style={{ display: 'block', padding: '8px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>
        <button 
          onClick={gerarRelatorio}
          disabled={carregando}
          style={{
            padding: '10px 20px',
            background: '#c8841a',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {carregando ? 'Gerando...' : 'Gerar Relatório'}
        </button>
      </div>

      {relatorio && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
              <h3>💰 Total Vendas</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold' }}>
                R$ {relatorio.resumo?.total_vendas?.toFixed(2) || 0}
              </p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
              <h3>📦 Total Pedidos</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold' }}>
                {relatorio.resumo?.total_pedidos || 0}
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>📊 Vendas Diárias</h3>
            <BarChart width={800} height={300} data={relatorio.relatorio || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')} />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${parseFloat(value).toFixed(2)}`} labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')} />
              <Legend />
              <Bar dataKey="valor_total" fill="#c8841a" name="Valor (R$)" />
            </BarChart>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>📋 Detalhamento por Dia</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Data</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Pedidos</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {relatorio.relatorio?.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{item.total_pedidos}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>R$ {parseFloat(item.valor_total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
                  <td style={{ padding: '12px' }}>Total</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>{relatorio.resumo?.total_pedidos || 0}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>R$ {relatorio.resumo?.total_vendas?.toFixed(2) || 0}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}