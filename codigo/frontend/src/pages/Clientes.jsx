import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchClientes, fetchClientesByEtiqueta,
  addCliente, updateCliente, deleteCliente, clearError,
} from '../store/slices/clientesSlice';

const EMPTY_FORM = { cuit: '', nombre: '', razonSocial: '', email: '', telefono: '' };

export default function Clientes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lista, loading, error } = useSelector((state) => state.clientes);

  const [form, setForm]           = useState(EMPTY_FORM);
  const [filtroEtiqueta, setFiltro] = useState('');
  // Edición inline: { cuit, nombre, razonSocial, email, telefono }
  const [editRow, setEditRow]     = useState(null);

  useEffect(() => { dispatch(fetchClientes()); }, [dispatch]);

  // --- Crear cliente ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(addCliente(form));
    if (result.meta.requestStatus === 'fulfilled') setForm(EMPTY_FORM);
  };

  // --- Filtro por etiqueta ---
  const handleFiltrar = (e) => {
    e.preventDefault();
    if (filtroEtiqueta.trim()) {
      dispatch(fetchClientesByEtiqueta(filtroEtiqueta.trim()));
    } else {
      dispatch(fetchClientes());
    }
  };

  const handleLimpiarFiltro = () => {
    setFiltro('');
    dispatch(fetchClientes());
  };

  // --- Edición inline ---
  const startEdit = (cliente) => {
    setEditRow({ ...cliente });
    dispatch(clearError());
  };

  const handleEditChange = (field, value) => {
    setEditRow(prev => ({ ...prev, [field]: value }));
  };

  const saveEdit = async (cuit) => {
    const result = await dispatch(updateCliente({ cuit, data: editRow }));
    if (result.meta.requestStatus === 'fulfilled') setEditRow(null);
  };

  const cancelEdit = () => setEditRow(null);

  // --- Eliminar ---
  const handleDelete = async (cuit) => {
    if (!window.confirm(`¿Eliminar el cliente ${cuit}? Solo es posible si no tiene etiquetas ni créditos.`)) return;
    dispatch(deleteCliente(cuit));
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Clientes</h2>

      {/* Formulario nuevo cliente */}
      <div style={styles.card}>
        <h3>Nuevo cliente</h3>
        {error && <div style={styles.error}>{error}</div>}
        <form id="form-nuevo-cliente" onSubmit={handleSubmit} style={styles.form}>
          <input id="nuevo-cuit"        style={styles.input} placeholder="CUIT (Ej: 20-12345678-5)" value={form.cuit}        onChange={e => setForm({...form, cuit: e.target.value})}        required />
          <input id="nuevo-nombre"      style={styles.input} placeholder="Nombre completo"           value={form.nombre}      onChange={e => setForm({...form, nombre: e.target.value})}      required />
          <input id="nuevo-razonSocial" style={styles.input} placeholder="Razón Social"              value={form.razonSocial} onChange={e => setForm({...form, razonSocial: e.target.value})} required />
          <input id="nuevo-email"       style={styles.input} type="email" placeholder="Email"        value={form.email}       onChange={e => setForm({...form, email: e.target.value})}       required />
          <input id="nuevo-telefono"    style={styles.input} placeholder="Teléfono"                  value={form.telefono}    onChange={e => setForm({...form, telefono: e.target.value})}    required />
          <button id="btn-agregar-cliente" style={styles.btn} disabled={loading}>
            {loading ? 'Guardando...' : 'Agregar'}
          </button>
        </form>
      </div>

      {/* Filtro por etiqueta */}
      <div style={styles.filterBar}>
        <form onSubmit={handleFiltrar} style={styles.filterForm}>
          <input
            id="filtro-etiqueta"
            style={styles.filterInput}
            placeholder="Filtrar por etiqueta (ej: VIP)"
            value={filtroEtiqueta}
            onChange={e => setFiltro(e.target.value)}
          />
          <button id="btn-filtrar" style={styles.btnFilter} type="submit">Filtrar</button>
          {filtroEtiqueta && (
            <button id="btn-limpiar-filtro" type="button" style={styles.btnSecondary} onClick={handleLimpiarFiltro}>
              Limpiar
            </button>
          )}
        </form>
      </div>

      {/* Tabla de clientes */}
      <div style={styles.card}>
        <h3>Lista de clientes ({lista.length})</h3>
        {loading && <p style={styles.empty}>Cargando...</p>}
        {!loading && lista.length === 0 && <p style={styles.empty}>No hay clientes registrados.</p>}
        {lista.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>CUIT</th>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Razón Social</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Teléfono</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lista.map(c => {
                  const isEditing = editRow?.cuit === c.cuit;
                  return (
                    <tr key={c.cuit} style={isEditing ? styles.trEditing : styles.tr}>
                      {/* CUIT — nunca editable (es la PK) */}
                      <td style={styles.td}>{c.cuit}</td>

                      {/* Campos editables inline */}
                      {isEditing ? (
                        <>
                          <td style={styles.td}><input style={styles.inlineInput} value={editRow.nombre}      onChange={e => handleEditChange('nombre',      e.target.value)} /></td>
                          <td style={styles.td}><input style={styles.inlineInput} value={editRow.razonSocial} onChange={e => handleEditChange('razonSocial', e.target.value)} /></td>
                          <td style={styles.td}><input style={styles.inlineInput} type="email" value={editRow.email} onChange={e => handleEditChange('email', e.target.value)} /></td>
                          <td style={styles.td}><input style={styles.inlineInput} value={editRow.telefono}    onChange={e => handleEditChange('telefono',    e.target.value)} /></td>
                          <td style={styles.td}>
                            <button id={`save-cliente-${c.cuit}`}   style={styles.btnSave}   onClick={() => saveEdit(c.cuit)} disabled={loading}>Guardar</button>
                            <button id={`cancel-cliente-${c.cuit}`} style={styles.btnCancel} onClick={cancelEdit}>Cancelar</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={styles.td}>{c.nombre}</td>
                          <td style={styles.td}>{c.razonSocial}</td>
                          <td style={styles.td}>{c.email}</td>
                          <td style={styles.td}>{c.telefono}</td>
                          <td style={styles.td}>
                            <button id={`edit-cliente-${c.cuit}`}       style={styles.btnEdit} onClick={() => startEdit(c)}>Editar</button>
                            <button id={`etiquetas-cliente-${c.cuit}`}  style={styles.btnTag}  onClick={() => navigate(`/clientes/${c.cuit}/etiquetas`)}>Etiquetas</button>
                            <button id={`del-cliente-${c.cuit}`}        style={styles.btnDel}  onClick={() => handleDelete(c.cuit)}>Eliminar</button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page:        { padding: '32px', maxWidth: '1100px', margin: '0 auto' },
  title:       { color: '#1e3a5f', marginBottom: '24px' },
  card:        { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '24px' },
  form:        { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' },
  input:       { padding: '10px', border: '1px solid #ccc', borderRadius: '6px', flex: '1', minWidth: '140px' },
  inlineInput: { padding: '6px 8px', border: '1px solid #90caf9', borderRadius: '4px', width: '100%', boxSizing: 'border-box' },
  btn:         { padding: '10px 20px', backgroundColor: '#1e3a5f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  btnSecondary:{ padding: '8px 14px', backgroundColor: '#757575', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnFilter:   { padding: '8px 16px', backgroundColor: '#1565c0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  btnEdit:     { padding: '5px 10px', backgroundColor: '#1565c0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '4px', fontSize: '0.82rem' },
  btnTag:      { padding: '5px 10px', backgroundColor: '#6a1b9a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '4px', fontSize: '0.82rem' },
  btnDel:      { padding: '5px 10px', backgroundColor: '#c62828', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.82rem' },
  btnSave:     { padding: '5px 12px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '4px', fontSize: '0.82rem' },
  btnCancel:   { padding: '5px 10px', backgroundColor: '#757575', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.82rem' },
  filterBar:   { marginBottom: '16px' },
  filterForm:  { display: 'flex', gap: '10px', alignItems: 'center' },
  filterInput: { padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', minWidth: '220px' },
  error:       { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '12px', fontSize: '0.9rem' },
  empty:       { color: '#999' },
  table:       { width: '100%', borderCollapse: 'collapse' },
  thead:       { textAlign: 'left', borderBottom: '2px solid #ddd' },
  th:          { padding: '10px 8px', fontWeight: '600', color: '#555', whiteSpace: 'nowrap' },
  tr:          { borderBottom: '1px solid #eee' },
  trEditing:   { borderBottom: '1px solid #90caf9', backgroundColor: '#e3f2fd' },
  td:          { padding: '8px', verticalAlign: 'middle' },
};
