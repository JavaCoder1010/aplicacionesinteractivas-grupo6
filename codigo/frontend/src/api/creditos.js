import { api } from './apiClient';

export const getCreditosPorCliente = (cuit) => api.get(`/creditos/cliente/${cuit}`);
export const getCredito = (id) => api.get(`/creditos/${id}`);
export const crearCredito = (data) => api.post('/creditos', data);
export const anularCredito = (id) => api.put(`/creditos/${id}/anular`);