import { api } from './apiClient';

export const listarUsuarios = () => api.get('/admin/usuarios');
export const modificarPermisos = (id, permisos) => api.put(`/admin/usuarios/${id}/permisos`, permisos);
