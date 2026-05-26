// src/services/api.js
// Camada de serviços que faz a comunicação com os microsserviços do backend
import axios from 'axios';

// URLs dos microsserviços
const API_PRODUTOS     = process.env.REACT_APP_API_PRODUTOS     || 'http://localhost:3001/api';
const API_PEDIDOS      = process.env.REACT_APP_API_PEDIDOS      || 'http://localhost:3002/api';
const API_FUNCIONARIOS = process.env.REACT_APP_API_FUNCIONARIOS || 'http://localhost:3003/api'; // ← NOVO

// Instâncias do axios para cada microsserviço
const apiProdutos     = axios.create({ baseURL: API_PRODUTOS });
const apiPedidos      = axios.create({ baseURL: API_PEDIDOS });
const apiFuncionarios = axios.create({ baseURL: API_FUNCIONARIOS }); // ← NOVO

// ==================== PRODUTOS ====================
export const produtosService = {
  listar:      (params)    => apiProdutos.get('/produtos', { params }),
  buscarPorId: (id)        => apiProdutos.get(`/produtos/${id}`),
  criar:       (dados)     => apiProdutos.post('/produtos', dados),
  atualizar:   (id, dados) => apiProdutos.put(`/produtos/${id}`, dados),
  deletar:     (id)        => apiProdutos.delete(`/produtos/${id}`),
};

// ==================== CATEGORIAS ====================
export const categoriasService = {
  listar: ()          => apiProdutos.get('/categorias'),
  criar:  (dados)     => apiProdutos.post('/categorias', dados),
};

// ==================== CLIENTES ====================
export const clientesService = {
  listar:      ()          => apiPedidos.get('/clientes'),
  buscarPorId: (id)        => apiPedidos.get(`/clientes/${id}`),
  criar:       (dados)     => apiPedidos.post('/clientes', dados),
  atualizar:   (id, dados) => apiPedidos.put(`/clientes/${id}`, dados),
};

// ==================== PEDIDOS ====================
export const pedidosService = {
  listar:          (params)         => apiPedidos.get('/pedidos', { params }),
  buscarPorId:     (id)             => apiPedidos.get(`/pedidos/${id}`),
  criar:           (dados)          => apiPedidos.post('/pedidos', dados),
  atualizarStatus: (id, status)     => apiPedidos.patch(`/pedidos/${id}/status`, { status }),
};

// ==================== FUNCIONÁRIOS ==================== ← NOVO
export const funcionariosService = {
  listar:      (params)    => apiFuncionarios.get('/funcionarios', { params }),
  buscarPorId: (id)        => apiFuncionarios.get(`/funcionarios/${id}`),
  criar:       (dados)     => apiFuncionarios.post('/funcionarios', dados),
  atualizar:   (id, dados) => apiFuncionarios.put(`/funcionarios/${id}`, dados),
  deletar:     (id)        => apiFuncionarios.delete(`/funcionarios/${id}`),
};