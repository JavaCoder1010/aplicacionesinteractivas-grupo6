import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { listarUsuarios, modificarPermisos } from '../../api/admin';

export const fetchUsuarios = createAsyncThunk(
  'admin/fetchUsuarios',
  async (_, { rejectWithValue }) => {
    try {
      return await listarUsuarios();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updatePermisos = createAsyncThunk(
  'admin/updatePermisos',
  async ({ id, permisos }, { rejectWithValue }) => {
    try {
      return await modificarPermisos(id, permisos);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    usuarios: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.loading = false;
        state.usuarios = action.payload;
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePermisos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePermisos.fulfilled, (state, action) => {
        state.loading = false;
        const usuarioActualizado = action.payload;
        const index = state.usuarios.findIndex(u => u.id === usuarioActualizado.id);
        if (index !== -1) {
          state.usuarios[index] = usuarioActualizado;
        }
      })
      .addCase(updatePermisos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
