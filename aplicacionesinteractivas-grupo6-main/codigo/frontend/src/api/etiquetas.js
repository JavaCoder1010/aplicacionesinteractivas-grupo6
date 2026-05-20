import { api } from './apiClient';

// CRUD de etiquetas
export const getEtiquetas       = ()           => api.get('/etiquetas');
export const getEtiqueta        = (id)         => api.get(`/etiquetas/${id}`);
export const crearEtiqueta      = (data)       => api.post('/etiquetas', data);
export const actualizarEtiqueta = (id, data)   => api.put(`/etiquetas/${id}`, data);
export const eliminarEtiqueta   = (id)         => api.delete(`/etiquetas/${id}`);

// Asignación cliente ↔ etiqueta
export const getEtiquetasDeCliente  = (cuit)           => api.get(`/clientes/${cuit}/etiquetas`);
export const getClientesPorEtiqueta = (id)             => api.get(`/etiquetas/${id}/clientes`);
export const asignarEtiqueta        = (cuit, etiquetaId) => api.post(`/clientes/${cuit}/etiquetas/${etiquetaId}`);
export const quitarEtiqueta         = (cuit, etiquetaId) => api.delete(`/clientes/${cuit}/etiquetas/${etiquetaId}`);
