import { api } from './apiClient';

export const getClientes          = ()             => api.get('/clientes');
export const getClientesByEtiqueta = (nombre)      => api.get(`/clientes?etiqueta=${encodeURIComponent(nombre)}`);
export const getCliente           = (cuit)         => api.get(`/clientes/${cuit}`);
export const crearCliente         = (data)         => api.post('/clientes', data);
export const actualizarCliente    = (cuit, data)   => api.put(`/clientes/${cuit}`, data);
export const eliminarCliente      = (cuit)         => api.delete(`/clientes/${cuit}`);
