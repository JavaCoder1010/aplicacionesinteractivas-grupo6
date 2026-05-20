import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEtiquetasDeCliente, fetchEtiquetas,
  assignEtiqueta, removeEtiqueta, clearEtiquetasCliente,
} from '../store/slices/etiquetasSlice';

export default function ClienteEtiquetas() {
  const { cuit } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { lista: todasLasEtiquetas, etiquetasCliente, loading, error } = useSelector(s => s.etiquetas);

  useEffect(() => {
    dispatch(fetchEtiquetas());
    dispatch(fetchEtiquetasDeCliente(cuit));
    return () => dispatch(clearEtiquetasCliente());
  }, [dispatch, cuit]);

  // IDs de etiquetas ya asignadas al cliente
  const asignadasIds = new Set(etiquetasCliente.map(a => a.etiqueta?.id ?? a.etiquetaId));

  // Etiquetas disponibles para asignar (las que todavía no tiene)
  const disponibles = todasLasEtiquetas.filter(e => !asignadasIds.has(e.id));

  const handleAsignar = async (etiquetaId) => {
    const result = await dispatch(assignEtiqueta({ cuit, etiquetaId }));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(fetchEtiquetasDeCliente(cuit));
    }
  };

  const handleQuitar = async (etiquetaId) => {
    if (!window.confirm('¿Quitar esta etiqueta del cliente?')) return;
    const result = await dispatch(removeEtiqueta({ cuit, etiquetaId }));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(fetchEtiquetasDeCliente(cuit));
    }
  };

  return (
    <div style={styles.page}>
      <button id="btn-volver" style={styles.back} onClick={() => navigate('/clientes')}>← Volver a Clientes</button>
      <h2 style={styles.title}>🏷️ Etiquetas del cliente</h2>
      <p style={styles.cuit}>CUIT: <strong>{cuit}</strong></p>

      {error && <div style={styles.error}>{error}</div>}

      {/* Etiquetas asignadas */}
      <div style={styles.card}>
        <h3>Etiquetas asignadas ({etiquetasCliente.length})</h3>
        {loading && <p style={styles.empty}>Cargando...</p>}
        {!loading && etiquetasCliente.length === 0 && (
          <p style={styles.empty}>Este cliente no tiene etiquetas asignadas.</p>
        )}
        {etiquetasCliente.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Etiqueta</th>
                <th style={styles.th}>Fecha asignación</th>
                <th style={styles.th}>Asignado por</th>
                <th style={styles.th}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {etiquetasCliente.map((a, idx) => {
                const etiqueta = a.etiqueta ?? a;
                const etiquetaId = etiqueta.id ?? a.etiquetaId;
                return (
                  <tr key={etiquetaId ?? idx} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: etiqueta.color ?? '#888' }}>
                        {etiqueta.nombre}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {a.fechaAsignacion ? new Date(a.fechaAsignacion).toLocaleString('es-AR') : '—'}
                    </td>
                    <td style={styles.td}>{a.asignadoPor ?? '—'}</td>
                    <td style={styles.td}>
                      <button
                        id={`quitar-etiqueta-${etiquetaId}`}
                        style={styles.btnDel}
                        onClick={() => handleQuitar(etiquetaId)}
                        disabled={loading}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Asignar nueva etiqueta */}
      <div style={styles.card}>
        <h3>Asignar etiqueta</h3>
        {disponibles.length === 0 ? (
          <p style={styles.empty}>
            {todasLasEtiquetas.length === 0
              ? 'No hay etiquetas creadas en el sistema.'
              : 'El cliente ya tiene todas las etiquetas disponibles.'}
          </p>
        ) : (
          <div style={styles.chipGrid}>
            {disponibles.map(e => (
              <button
                id={`asignar-etiqueta-${e.id}`}
                key={e.id}
                style={{ ...styles.chip, backgroundColor: e.color }}
                onClick={() => handleAsignar(e.id)}
                disabled={loading}
              >
                + {e.nombre}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page:     { padding: '32px', maxWidth: '800px', margin: '0 auto' },
  back:     { background: 'none', border: 'none', color: '#1e3a5f', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', marginBottom: '16px', padding: '0' },
  title:    { color: '#1e3a5f', marginBottom: '4px' },
  cuit:     { color: '#666', marginBottom: '24px' },
  card:     { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '24px' },
  error:    { background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem' },
  empty:    { color: '#999' },
  table:    { width: '100%', borderCollapse: 'collapse' },
  thead:    { textAlign: 'left', borderBottom: '2px solid #ddd' },
  th:       { padding: '10px 8px', fontWeight: '600', color: '#555' },
  tr:       { borderBottom: '1px solid #eee' },
  td:       { padding: '10px 8px', verticalAlign: 'middle' },
  badge:    { display: 'inline-block', padding: '4px 12px', borderRadius: '12px', color: 'white', fontSize: '0.85rem', fontWeight: '600' },
  btnDel:   { padding: '5px 12px', backgroundColor: '#c62828', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
  chipGrid: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  chip:     { padding: '8px 18px', borderRadius: '20px', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
};
