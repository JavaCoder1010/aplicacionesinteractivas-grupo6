import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getEtiquetas, crearEtiqueta, actualizarEtiqueta, eliminarEtiqueta,
  getEtiquetasDeCliente, asignarEtiqueta, quitarEtiqueta,
} from '../../api/etiquetas';

export const fetchEtiquetas = createAsyncThunk('etiquetas/fetchAll', async (_, { rejectWithValue }) => {
  try { return await getEtiquetas(); }
  catch (err) { return rejectWithValue(err.message); }
});

export const addEtiqueta = createAsyncThunk('etiquetas/add', async (data, { rejectWithValue }) => {
  try { return await crearEtiqueta(data); }
  catch (err) { return rejectWithValue(err.message); }
});

export const updateEtiqueta = createAsyncThunk('etiquetas/update', async ({ id, data }, { rejectWithValue }) => {
  try { return await actualizarEtiqueta(id, data); }
  catch (err) { return rejectWithValue(err.message); }
});

export const deleteEtiqueta = createAsyncThunk('etiquetas/delete', async (id, { rejectWithValue }) => {
  try { await eliminarEtiqueta(id); return id; }
  catch (err) { return rejectWithValue(err.message); }
});

export const fetchEtiquetasDeCliente = createAsyncThunk('etiquetas/fetchDeCliente', async (cuit, { rejectWithValue }) => {
  try { return await getEtiquetasDeCliente(cuit); }
  catch (err) { return rejectWithValue(err.message); }
});

export const assignEtiqueta = createAsyncThunk('etiquetas/assign', async ({ cuit, etiquetaId }, { rejectWithValue }) => {
  try { await asignarEtiqueta(cuit, etiquetaId); return { cuit, etiquetaId }; }
  catch (err) { return rejectWithValue(err.message); }
});

export const removeEtiqueta = createAsyncThunk('etiquetas/remove', async ({ cuit, etiquetaId }, { rejectWithValue }) => {
  try { await quitarEtiqueta(cuit, etiquetaId); return { cuit, etiquetaId }; }
  catch (err) { return rejectWithValue(err.message); }
});

const etiquetasSlice = createSlice({
  name: 'etiquetas',
  initialState: {
    lista:            [],   // todas las etiquetas del sistema
    etiquetasCliente: [],   // etiquetas del cliente seleccionado
    loading:          false,
    error:            null,
  },
  reducers: {
    clearError(state)            { state.error = null; },
    clearEtiquetasCliente(state) { state.etiquetasCliente = []; },
  },
  extraReducers: (builder) => {
    const pending  = (state)         => { state.loading = true;  state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      // fetch all
      .addCase(fetchEtiquetas.pending,   pending)
      .addCase(fetchEtiquetas.fulfilled, (state, action) => { state.loading = false; state.lista = action.payload; })
      .addCase(fetchEtiquetas.rejected,  rejected)
      // add
      .addCase(addEtiqueta.pending,   pending)
      .addCase(addEtiqueta.fulfilled, (state, action) => { state.loading = false; state.lista.push(action.payload); })
      .addCase(addEtiqueta.rejected,  rejected)
      // update
      .addCase(updateEtiqueta.pending,   pending)
      .addCase(updateEtiqueta.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.lista.findIndex(e => e.id === action.payload.id);
        if (idx !== -1) state.lista[idx] = action.payload;
      })
      .addCase(updateEtiqueta.rejected, rejected)
      // delete
      .addCase(deleteEtiqueta.pending,   pending)
      .addCase(deleteEtiqueta.fulfilled, (state, action) => {
        state.loading = false;
        state.lista = state.lista.filter(e => e.id !== action.payload);
      })
      .addCase(deleteEtiqueta.rejected,  rejected)
      // etiquetas de un cliente
      .addCase(fetchEtiquetasDeCliente.pending,   pending)
      .addCase(fetchEtiquetasDeCliente.fulfilled, (state, action) => { state.loading = false; state.etiquetasCliente = action.payload; })
      .addCase(fetchEtiquetasDeCliente.rejected,  rejected)
      // asignar (recarga se hace desde el componente)
      .addCase(assignEtiqueta.pending,   pending)
      .addCase(assignEtiqueta.fulfilled, (state) => { state.loading = false; })
      .addCase(assignEtiqueta.rejected,  rejected)
      // quitar (recarga se hace desde el componente)
      .addCase(removeEtiqueta.pending,   pending)
      .addCase(removeEtiqueta.fulfilled, (state) => { state.loading = false; })
      .addCase(removeEtiqueta.rejected,  rejected);
  },
});

export const { clearError, clearEtiquetasCliente } = etiquetasSlice.actions;
export default etiquetasSlice.reducer;
