import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsuarios, actualizarPermisos } from '../../api/admin';

export const fetchUsuarios = createAsyncThunk(
  'permisos/fetchUsuarios',
  async (_, { rejectWithValue }) => {
    try {
      return await getUsuarios();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updatePermisos = createAsyncThunk(
  'permisos/updatePermisos',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await actualizarPermisos(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const permisosSlice = createSlice({
  name: 'permisos',
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
        state.error = null;
      })
      .addCase(updatePermisos.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.usuarios.findIndex((u) => u.id === updated.id);
        if (index !== -1) {
          state.usuarios[index] = updated;
        }
      })
      .addCase(updatePermisos.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = permisosSlice.actions;
export default permisosSlice.reducer;
