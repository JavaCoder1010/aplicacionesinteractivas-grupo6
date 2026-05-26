import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreditosPorCliente, addCredito, clearCreditos,anularCreditoThunk } from '../store/slices/creditosSlice';



export default function Creditos() {
  const dispatch = useDispatch();
  const { lista, loading, error } = useSelector((state) => state.creditos);
  const user = useSelector((state) => state.auth.user);
  const puedeAnularCredito = Boolean(user?.puedeAnularCredito);

  const [cuit, setCuit] = useState('');
  const [buscado, setBuscado] = useState(false);

  const [form, setForm] = useState({
    cuitCliente: '',
    deudaOriginal: '',
    fecha: '',
    cantidadCuotas: ''
  });

  const importeCuotaCalculado = form.deudaOriginal && form.cantidadCuotas && Number(form.cantidadCuotas) > 0
    ? (Number(form.deudaOriginal) / Number(form.cantidadCuotas)).toFixed(2)
    : null;


  const handleAnularCredito = async (id) => {
  if (!window.confirm(`¿Anular el crédito #${id}?`)) return;

  await dispatch(anularCreditoThunk(id));
};

  const buscar = async (e) => {
    e.preventDefault();
    dispatch(clearCreditos());

    const result = await dispatch(fetchCreditosPorCliente(cuit));

    if (result.meta.requestStatus === 'fulfilled') {
      setBuscado(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      cuitCliente: form.cuitCliente,
      deudaOriginal: Number(form.deudaOriginal),
      fecha: form.fecha,
      cantidadCuotas: Number(form.cantidadCuotas),
    };

    console.log('Payload crédito:', payload);

    const result = await dispatch(addCredito(payload));

    if (result.meta.requestStatus === 'fulfilled') {
      setForm({
        cuitCliente: '',
        deudaOriginal: '',
        fecha: '',
        cantidadCuotas: ''
      });

      if (form.cuitCliente === cuit) {
        dispatch(fetchCreditosPorCliente(cuit));
      }
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Créditos</h2>

      <div style={styles.card}>
        <h3>Buscar créditos por cliente</h3>
        <form onSubmit={buscar} style={styles.row}>
          <input
            style={styles.input}
            placeholder="CUIT del cliente"
            value={cuit}
            onChange={e => setCuit(e.target.value)}
            required
          />
          <button style={styles.btn}>Buscar</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3>Nuevo crédito</h3>
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.grid}>
          <input
            style={styles.input}
            placeholder="CUIT cliente"
            value={form.cuitCliente}
            onChange={e => setForm({ ...form, cuitCliente: e.target.value })}
            required
          />

          <input
            style={styles.input}
            placeholder="Deuda original"
            value={form.deudaOriginal}
            onChange={e => setForm({ ...form, deudaOriginal: e.target.value })}
            type="number"
            required
          />

          <input
            style={styles.input}
            placeholder="Fecha"
            value={form.fecha}
            onChange={e => setForm({ ...form, fecha: e.target.value })}
            type="date"
            required
          />

          {importeCuotaCalculado && (
            <div style={styles.preview}>
              Importe por cuota: <strong>${importeCuotaCalculado}</strong>
            </div>
          )}

          <input
            style={styles.input}
            placeholder="Cant. cuotas"
            value={form.cantidadCuotas}
            onChange={e => setForm({ ...form, cantidadCuotas: e.target.value })}
            type="number"
            min="1"
            required
          />

          <button style={{ ...styles.btn, gridColumn: 'span 2' }} disabled={loading}>
            {loading ? 'Guardando...' : 'Crear crédito'}
          </button>
        </form>
      </div>

      {buscado && (
        <div style={styles.card}>
          <h3>Créditos del cliente ({lista.length})</h3>
          {loading && <p style={styles.empty}>Cargando...</p>}
          {!loading && lista.length === 0 && <p style={styles.empty}>Sin créditos.</p>}

          {lista.map(cr => (
            <div key={cr.id} style={styles.credito}>
              <strong>Crédito #{cr.id}</strong>
              <p>Cliente: {cr.nombreCliente}</p>
              <p>CUIT: {cr.cuitCliente}</p>
              <p>Deuda original: ${cr.deudaOriginal}</p>
              <p>Importe cuota: ${cr.importeCuota}</p>
              <p>Cantidad de cuotas: {cr.cantidadCuotas}</p>
              <p>Estado: {cr.anulado ? 'Anulado' : 'Activo'}</p>
              {puedeAnularCredito && (
              <button style={{...styles.btn,backgroundColor: cr.anulado ? '#999' : '#c62828'}}
              onClick={() => handleAnularCredito(cr.id)} disabled={loading || cr.anulado}
>             {cr.anulado ? 'Crédito anulado' : 'Anular crédito'}
              </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
const styles = {
  page: {
    padding: '32px',
    maxWidth: '900px',
    margin: '0 auto'
  },
  title: {
    color: '#1e3a5f',
    marginBottom: '24px'
  },
  card: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '24px'
  },
  row: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    flex: '1',
    minWidth: '120px'
  },
  btn: {
    padding: '10px 20px',
    backgroundColor: '#1e3a5f',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '12px',
    fontSize: '0.9rem'
  },
  empty: {
    color: '#999'
  },
  credito: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    backgroundColor: '#fafafa'
  },
  preview: {
    padding: '10px',
    backgroundColor: '#e8f5e9',
    borderRadius: '6px',
    color: '#2e7d32',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  }
};
