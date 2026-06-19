import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsuarios, updatePermisos } from '../store/slices/permisosSlice';

export default function GestorPermisos() {
  const dispatch = useDispatch();
  const { usuarios, loading, error } = useSelector((state) => state.permisos);

  useEffect(() => {
    dispatch(fetchUsuarios());
  }, [dispatch]);

  const handleToggle = (usuario, campo) => {
    const data = {
      puedeAnularCredito: usuario.puedeAnularCredito,
      puedeAnularCobranza: usuario.puedeAnularCobranza,
      [campo]: !usuario[campo],
    };
    dispatch(updatePermisos({ id: usuario.id, data }));
  };

  const usuariosUser = usuarios.filter((u) => u.rol === 'USER');

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Gestor de Permisos</h2>
      <p style={styles.subtitle}>Asigná permisos de anulación a los usuarios del sistema.</p>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.card}>
        {loading && <p style={styles.empty}>Cargando usuarios...</p>}

        {!loading && usuariosUser.length === 0 && (
          <p style={styles.empty}>No hay usuarios registrados con rol USER.</p>
        )}

        {!loading && usuariosUser.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Usuario</th>
                <th style={styles.th}>Rol</th>
                <th style={styles.thCenter}>Anular Crédito</th>
                <th style={styles.thCenter}>Anular Cobranza</th>
              </tr>
            </thead>
            <tbody>
              {usuariosUser.map((u) => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>{u.id}</td>
                  <td style={styles.td}>{u.username}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{u.rol}</span>
                  </td>
                  <td style={styles.tdCenter}>
                    <input
                      type="checkbox"
                      checked={u.puedeAnularCredito}
                      onChange={() => handleToggle(u, 'puedeAnularCredito')}
                      style={styles.checkbox}
                    />
                  </td>
                  <td style={styles.tdCenter}>
                    <input
                      type="checkbox"
                      checked={u.puedeAnularCobranza}
                      onChange={() => handleToggle(u, 'puedeAnularCobranza')}
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
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    color: '#1e3a5f',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#666',
    fontSize: '0.95rem',
    marginBottom: '24px',
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
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '0.9rem',
  },
  empty: {
    color: '#999',
    textAlign: 'center',
    padding: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: '2px solid #e0e0e0',
    color: '#1e3a5f',
    fontSize: '0.9rem',
  },
  thCenter: {
    textAlign: 'center',
    padding: '12px 16px',
    borderBottom: '2px solid #e0e0e0',
    color: '#1e3a5f',
    fontSize: '0.9rem',
  },
  tr: {
    borderBottom: '1px solid #f0f0f0',
  },
  td: {
    padding: '12px 16px',
    fontSize: '0.95rem',
  },
  tdCenter: {
    padding: '12px 16px',
    textAlign: 'center',
  },
  badge: {
    background: '#e3f2fd',
    color: '#1565c0',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
};
