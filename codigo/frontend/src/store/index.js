import { configureStore } from '@reduxjs/toolkit';
import authReducer      from './slices/authSlice';
import clientesReducer  from './slices/clientesSlice';
import creditosReducer  from './slices/creditosSlice';
import cobranzasReducer from './slices/cobranzasSlice';
import etiquetasReducer from './slices/etiquetasSlice';
import adminReducer     from './slices/adminSlice';

const store = configureStore({
  reducer: {
    auth:      authReducer,
    clientes:  clientesReducer,
    creditos:  creditosReducer,
    cobranzas: cobranzasReducer,
    etiquetas: etiquetasReducer,
    admin:     adminReducer,
  },
});

export default store;
