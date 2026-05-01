import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEtiquetas, addEtiqueta, updateEtiqueta, deleteEtiqueta,
} from '../store/slices/etiquetasSlice';

const EMPTY_FORM = { nombre: '', descripcion: '', color: '#4a90d9' };

export default function Etiquetas() {
  const dispatch = useDispatch();
  const { lista, loading, error } = useSelector((state) => state.etiquetas);

  const [form, setForm]         = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null); // null = crear, number = editar

  useEffect(() => { dispatch(fetchEtiquetas()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (editingId !== null) {
      result = await dispatch(updateEtiqueta({ id: editingId, data: form }));
    } else {
      result = await dispatch(addEtiqueta(form));
    }
    if (result.meta.requestStatus === 'fulfilled') {
      setForm(EMPTY_FORM);
      setEditingId(null);
    }
  };

  const handleEdit = (etiqueta) => {
    setEditingId(etiqueta.id);
    setForm({ nombre: etiqueta.nombre, descripcion: etiqueta.descripcion ?? '', color: etiqueta.color });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta etiqueta? Solo es posible si no tiene clientes asignados.')) return;
    dispatch(deleteEtiqueta(id));
  };

  const handleCancel = () => { setForm(EMPTY_FORM); setEditingId(null); };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🏷️ Etiquetas</h2>

      {/* Formulario crear / editar */}
      <div style={styles.card}>
        <h3>{editingId !== null ? 'Editar etiqueta' : 'Nueva etiqueta'}</h3>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            id="etiqueta-nombre"
            style={styles.input}
            placeholder="Nombre (ej: VIP)"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <input
            id="etiqueta-descripcion"
            style={styles.input}
            placeholder="Descripción (opcional)"
            value={form.descripcion}
            onChange={e => setForm({ ...form, descripcion: e.target.value })}
          />
          <div style={styles.colorGroup}>
            <label style={styles.colorLabel}>Color:</label>
            <input
              id="etiqueta-color"
              type="color"
              style={styles.colorInput}
              value={form.color}
              onChange={e => setForm({ ...form, color: e.target.value })}
            />
            <span style={styles.colorHex}>{form.color}</span>
          </div>
          <button id="etiqueta-submit" style={styles.btn} disabled={loading}>
            {loading ? 'Guardando...' : editingId !== null ? 'Guardar cambios' : 'Agregar'}
          </button>
          {editingId !== null && (
            <button type="button" style={styles.btnSecondary} onClick={handleCancel}>Cancelar</button>
          )}
        </form>
      </div>

      {/* Tabla de etiquetas */}
      <div style={styles.card}>
        <h3>Etiquetas registradas ({lista.length})</h3>
        {loading && <p style={styles.empty}>Cargando...</p>}
        {!loading && lista.length === 0 && <p style={styles.empty}>No hay etiquetas registradas.</p>}
        {lista.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Color</th>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Creada</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(e => (
                <tr key={e.id} style={styles.tr}>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, backgroundColor: e.color }}>{e.nombre}</span>
                  </td>
                  <td style={styles.td}>{e.nombre}</td>
                  <td style={styles.td}>{e.descripcion ?? '—'}</td>
                  <td style={styles.td}>{e.fechaCreacion ? new Date(e.fechaCreacion).toLocaleDateString('es-AR') : '—'}</td>
                  <td style={styles.td}>
                    <button id={`edit-etiqueta-${e.id}`} style={styles.btnEdit} onClick={() => handleEdit(e)}>Editar</button>
                    <button id={`del-etiqueta-${e.id}`}  style={styles.btnDel}  onClick={() => handleDelete(e.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  page:         { padding: '32px', maxWidth: '900px', margin: '0 auto' },
  title:        { color: '#1e3a5f', marginBottom: '24px' },
  card:         { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '24px' },
  form:         { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' },
  input:        { padding: '10px', border: '1px solid #ccc', borderRadius: '6px', flex: '1', minWidth: '140px' },
  colorGroup:   { display: 'flex', alignItems: 'center', gap: '8px' },
  colorLabel:   { fontWeight: '500', color: '#555' },
  colorInput:   { width: '48px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '2px' },
  colorHex:     { fontSize: '0.85rem', color: '#777', fontFamily: 'monospace' },
  btn:          { padding: '10px 20px', backgroundColor: '#1e3a5f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  btnSecondary: { padding: '10px 16px', backgroundColor: '#757575', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnEdit:      { padding: '5px 10px', backgroundColor: '#1565c0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontSize: '0.85rem' },
  btnDel:       { padding: '5px 10px', backgroundColor: '#c62828', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
  error:        { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '12px', fontSize: '0.9rem' },
  empty:        { color: '#999' },
  table:        { width: '100%', borderCollapse: 'collapse' },
  thead:        { textAlign: 'left', borderBottom: '2px solid #ddd' },
  th:           { padding: '10px 8px', fontWeight: '600', color: '#555' },
  tr:           { borderBottom: '1px solid #eee' },
  td:           { padding: '10px 8px', verticalAlign: 'middle' },
  badge:        { display: 'inline-block', padding: '3px 10px', borderRadius: '12px', color: 'white', fontSize: '0.8rem', fontWeight: '600' },
};
