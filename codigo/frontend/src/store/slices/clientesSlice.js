import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getClientes, getClientesByEtiqueta,
  crearCliente, actualizarCliente, eliminarCliente,
} from '../../api/clientes';

export const fetchClientes = createAsyncThunk('clientes/fetchAll', async (_, { rejectWithValue }) => {
  try { return await getClientes(); }
  catch (err) { return rejectWithValue(err.message); }
});

export const fetchClientesByEtiqueta = createAsyncThunk('clientes/fetchByEtiqueta', async (nombre, { rejectWithValue }) => {
  try { return await getClientesByEtiqueta(nombre); }
  catch (err) { return rejectWithValue(err.message); }
});

export const addCliente = createAsyncThunk('clientes/add', async (data, { rejectWithValue }) => {
  try { return await crearCliente(data); }
  catch (err) { return rejectWithValue(err.message); }
});

export const updateCliente = createAsyncThunk('clientes/update', async ({ cuit, data }, { rejectWithValue }) => {
  try { return await actualizarCliente(cuit, data); }
  catch (err) { return rejectWithValue(err.message); }
});

export const deleteCliente = createAsyncThunk('clientes/delete', async (cuit, { rejectWithValue }) => {
  try {
    await eliminarCliente(cuit);
    return cuit; // devuelve el cuit para eliminarlo del estado
  } catch (err) { return rejectWithValue(err.message); }
});

const clientesSlice = createSlice({
  name: 'clientes',
  initialState: { lista: [], loading: false, error: null },
  reducers: {
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending   = (state)          => { state.loading = true;  state.error = null; };
    const rejected  = (state, action)  => { state.loading = false; state.error = action.payload; };

    builder
      // fetch all
      .addCase(fetchClientes.pending,            pending)
      .addCase(fetchClientes.fulfilled,          (state, action) => { state.loading = false; state.lista = action.payload; })
      .addCase(fetchClientes.rejected,           rejected)
      // fetch by etiqueta
      .addCase(fetchClientesByEtiqueta.pending,   pending)
      .addCase(fetchClientesByEtiqueta.fulfilled, (state, action) => { state.loading = false; state.lista = action.payload; })
      .addCase(fetchClientesByEtiqueta.rejected,  rejected)
      // add
      .addCase(addCliente.pending,   pending)
      .addCase(addCliente.fulfilled, (state, action) => { state.loading = false; state.lista.push(action.payload); })
      .addCase(addCliente.rejected,  rejected)
      // update
      .addCase(updateCliente.pending,   pending)
      .addCase(updateCliente.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.lista.findIndex(c => c.cuit === action.payload.cuit);
        if (idx !== -1) state.lista[idx] = action.payload;
      })
      .addCase(updateCliente.rejected,  rejected)
      // delete
      .addCase(deleteCliente.pending,   pending)
      .addCase(deleteCliente.fulfilled, (state, action) => {
        state.loading = false;
        state.lista = state.lista.filter(c => c.cuit !== action.payload);
      })
      .addCase(deleteCliente.rejected,  rejected);
  },
});

export const { clearError } = clientesSlice.actions;
export default clientesSlice.reducer;
