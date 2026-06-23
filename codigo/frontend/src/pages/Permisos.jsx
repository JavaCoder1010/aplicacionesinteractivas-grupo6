import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsuarios, updatePermisos } from '../store/slices/adminSlice';

export default function Permisos() {
  const dispatch = useDispatch();
  const { usuarios, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsuarios());
  }, [dispatch]);

  const handlePermiso = async (id, permiso, valor) => {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;

    const nuevoPermisos = {
      puedeAnularCredito: permiso === 'puedeAnularCredito' ? !valor : usuario.puedeAnularCredito,
      puedeAnularCobranza: permiso === 'puedeAnularCobranza' ? !valor : usuario.puedeAnularCobranza,
    };

    await dispatch(updatePermisos({ id, permisos: nuevoPermisos }));
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>⚙️ Gestión de Permisos</h2>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.card}>
        <h3>Usuarios del sistema</h3>
        {loading && <p style={styles.loading}>Cargando usuarios...</p>}

        {!loading && usuarios.length === 0 && (
          <p style={styles.empty}>No hay usuarios para administrar.</p>
        )}

        {!loading && usuarios.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Usuario</th>
                <th style={styles.th}>Rol</th>
                <th style={styles.th}>Anular Crédito</th>
                <th style={styles.th}>Anular Cobranza</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} style={styles.row}>
                  <td style={styles.td}>#{usuario.id}</td>
                  <td style={styles.td}>{usuario.username}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: usuario.rol === 'ADMIN' ? '#1e3a5f' : '#4caf50',
                      }}
                    >
                      {usuario.rol}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <input
                      type="checkbox"
                      checked={usuario.puedeAnularCredito}
                      onChange={() =>
                        handlePermiso(usuario.id, 'puedeAnularCredito', usuario.puedeAnularCredito)
                      }
                      disabled={loading || usuario.rol === 'ADMIN'}
                      style={styles.checkbox}
                    />
                  </td>
                  <td style={styles.td}>
                    <input
                      type="checkbox"
                      checked={usuario.puedeAnularCobranza}
                      onChange={() =>
                        handlePermiso(usuario.id, 'puedeAnularCobranza', usuario.puedeAnularCobranza)
                      }
                      disabled={loading || usuario.rol === 'ADMIN'}
                      style={styles.checkbox}
                    />
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
  page: {
    padding: '32px',
    maxWidth: '1000px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  title: {
    color: '#1e3a5f',
    marginBottom: '24px',
    fontSize: '1.8rem',
  },
  card: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  loading: {
    color: '#999',
    textAlign: 'center',
    padding: '32px',
  },
  empty: {
    color: '#999',
    textAlign: 'center',
    padding: '32px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    backgroundColor: '#f5f5f5',
    borderBottom: '2px solid #ddd',
  },
  th: {
    padding: '14px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#1e3a5f',
    fontSize: '0.95rem',
  },
  row: {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '14px',
    color: '#333',
  },
  badge: {
    display: 'inline-block',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: '#1e3a5f',
  },
};
