// Camada de serviços que faz a comunicação com os microsserviços do backend
import axios from 'axios';

// URLs dos microsserviços
const API_PRODUTOS     = process.env.REACT_APP_API_PRODUTOS     || 'http://localhost:3001/api';
const API_PEDIDOS      = process.env.REACT_APP_API_PEDIDOS      || 'http://localhost:3002/api';
const API_FUNCIONARIOS = process.env.REACT_APP_API_FUNCIONARIOS || 'http://localhost:3003/api';

// Função para adicionar interceptor de token
const addAuthInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('@App:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('@App:token');
        localStorage.removeItem('@App:user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
  
  return axiosInstance;
};

// Instâncias do axios para cada microsserviço (com interceptor)
const apiProdutos     = addAuthInterceptor(axios.create({ baseURL: API_PRODUTOS }));
const apiPedidos      = addAuthInterceptor(axios.create({ baseURL: API_PEDIDOS }));
const apiFuncionarios = addAuthInterceptor(axios.create({ baseURL: API_FUNCIONARIOS }));

// ==================== SERVIÇO DE AUTENTICAÇÃO ====================
export const authService = {
  login: async (email, senha) => {
    try {
      const response = await apiProdutos.post('/auth/login', { email, senha });
      const { token, usuario } = response.data;
      
      if (token) {
        localStorage.setItem('@App:token', token);
        localStorage.setItem('@App:user', JSON.stringify(usuario));
        
        apiProdutos.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        apiPedidos.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        apiFuncionarios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      return { token, user: usuario };
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('@App:token');
    localStorage.removeItem('@App:user');
    
    delete apiProdutos.defaults.headers.common['Authorization'];
    delete apiPedidos.defaults.headers.common['Authorization'];
    delete apiFuncionarios.defaults.headers.common['Authorization'];
  },
  
  getToken: () => localStorage.getItem('@App:token'),
  isAuthenticated: () => !!localStorage.getItem('@App:token'),
  getUser: () => {
    const user = localStorage.getItem('@App:user');
    return user ? JSON.parse(user) : null;
  }
};

// ==================== PRODUTOS ====================
export const produtosService = {
  listar: (params) => apiProdutos.get('/produtos', { params }),
  buscarPorId: (id) => apiProdutos.get(`/produtos/${id}`),
  criar: (dados) => apiProdutos.post('/produtos', dados),
  atualizar: (id, dados) => apiProdutos.put(`/produtos/${id}`, dados),
  deletar: (id) => apiProdutos.delete(`/produtos/${id}`),
};

// ==================== CATEGORIAS ====================
export const categoriasService = {
  listar: () => apiProdutos.get('/categorias'),
  criar: (dados) => apiProdutos.post('/categorias', dados),
};

// ==================== CLIENTES ====================
export const clientesService = {
  listar: () => apiPedidos.get('/clientes'),
  buscarPorId: (id) => apiPedidos.get(`/clientes/${id}`),
  criar: (dados) => apiPedidos.post('/clientes', dados),
  atualizar: (id, dados) => apiPedidos.put(`/clientes/${id}`, dados),
};

// ==================== PEDIDOS ====================
export const pedidosService = {
  listar: (params) => apiPedidos.get('/pedidos', { params }),
  buscarPorId: (id) => apiPedidos.get(`/pedidos/${id}`),
  criar: (dados) => apiPedidos.post('/pedidos', dados),
  atualizarStatus: (id, status) => apiPedidos.patch(`/pedidos/${id}/status`, { status }),
  relatorioVendas: (dataInicio, dataFim) => apiPedidos.get('/pedidos/relatorio', { params: { dataInicio, dataFim } })
};

// ==================== FUNCIONÁRIOS ====================
export const funcionariosService = {
  listar: (params) => apiFuncionarios.get('/funcionarios', { params }),
  buscarPorId: (id) => apiFuncionarios.get(`/funcionarios/${id}`),
  criar: (dados) => apiFuncionarios.post('/funcionarios', dados),
  atualizar: (id, dados) => apiFuncionarios.put(`/funcionarios/${id}`, dados),
  deletar: (id) => apiFuncionarios.delete(`/funcionarios/${id}`),
};

// Exportar as instâncias configuradas
export { apiProdutos, apiPedidos, apiFuncionarios };