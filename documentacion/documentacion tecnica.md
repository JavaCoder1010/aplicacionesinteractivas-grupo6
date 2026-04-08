# Documentación Técnica — TPO Aplicaciones Interactivas 2026
**Módulo:** Sistema de Etiquetas para Clientes  
**Materia:** Aplicaciones Interactivas (3.4.082) — UADE  
**Cuatrimestre:** 2026 — Primer cuatrimestre  

---

## 1. Stack Tecnológico

### Backend

| Tecnología | Versión | Rol en el proyecto |
|---|---|---|
| Java | 21 | Lenguaje principal del backend |
| Spring Boot | 3.4.3 | Framework base (autoconfiguración, servidor embebido) |
| Spring Web | (incluido en Boot) | Exposición de endpoints REST (`@RestController`) |
| Spring Data JPA | (incluido en Boot) | Abstracción de persistencia sobre Hibernate (`JpaRepository`) |
| Hibernate | (incluido en Boot) | ORM — mapea clases Java a tablas SQL |
| Spring Security | (incluido en Boot) | Cadena de filtros de seguridad, integración con JWT |
| Spring Validation | (incluido en Boot) | Validaciones declarativas con `@NotBlank`, `@NotNull`, etc. |
| H2 | (incluido en Boot) | Base de datos en memoria para desarrollo. Se recrea al reiniciar |
| jjwt | 0.12.6 | Generación y validación de tokens JWT (HMAC-SHA384) |
| Lombok | (incluido en Boot) | Reducción de boilerplate: `@Data`, `@Builder`, `@RequiredArgsConstructor` |
| Maven | 3.x | Gestión de dependencias y build |

### Frontend

| Tecnología | Versión | Rol en el proyecto |
|---|---|---|
| React | 18 | Librería de UI basada en componentes |
| Vite | 7 | Bundler y servidor de desarrollo ultrarrápido |
| React Router | v7 | Enrutamiento del lado del cliente (SPA) |
| Redux Toolkit | latest | Estado global: `createSlice`, `createAsyncThunk` |
| React Redux | latest | Conexión de Redux con los componentes React |
| Fetch API | nativa | Llamadas HTTP al backend (sin librerías externas como axios) |

---

## 2. Arquitectura del proyecto

```
aplicacionesinteractivas_202601/
├── backend/                   → Proyecto Spring Boot (Maven)
│   └── src/main/java/com/uade/tpejemplo/
│       ├── config/            → SecurityConfig (filtros, JWT, sesión stateless)
│       ├── controller/        → Controladores REST (@RestController)
│       ├── dto/
│       │   ├── request/       → Objetos de entrada validados con @Valid
│       │   └── response/      → Objetos de salida (no exponen la entidad directamente)
│       ├── exception/         → BusinessException, ResourceNotFoundException, GlobalExceptionHandler
│       ├── model/             → Entidades JPA (@Entity)
│       ├── repository/        → Interfaces JpaRepository
│       ├── security/          → JwtUtil, JwtAuthFilter, UserDetailsServiceImpl
│       └── service/
│           ├── XxxService     → Interfaz del servicio
│           └── impl/
│               └── XxxServiceImpl → Implementación
└── frontend/                  → Proyecto React + Vite
    └── src/
        ├── api/               → Funciones fetch agrupadas por entidad
        ├── components/        → Navbar, PrivateRoute
        ├── pages/             → Una página por ruta
        ├── store/
        │   ├── index.js       → configureStore (combina todos los slices)
        │   └── slices/        → Un slice por dominio
        └── App.jsx            → Definición de rutas (BrowserRouter + Routes)
```

---

## 3. Modelo de datos definitivo

### `Cliente` *(modificada respecto al base)*
> La PK cambia de `dni` a `cuit`. Se mantiene `nombre` y se agregan `razonSocial`, `email`, `telefono`.

| Campo | Tipo Java | Columna DB | Restricciones |
|---|---|---|---|
| `cuit` | `String` | `cuit` PK | NOT NULL, max 13 |
| `nombre` | `String` | `nombre` | NOT NULL |
| `razonSocial` | `String` | `razon_social` | NOT NULL, max 200 |
| `email` | `String` | `email` | NOT NULL, UNIQUE, max 100 |
| `telefono` | `String` | `telefono` | NOT NULL, max 20 |
| `creditos` | `List<Credito>` | — | OneToMany lazy, mappedBy="cliente" |
| `clienteEtiquetas` | `List<ClienteEtiqueta>` | — | OneToMany lazy, mappedBy="cliente" |

### `Etiqueta` *(nueva)*

| Campo | Tipo Java | Columna DB | Restricciones |
|---|---|---|---|
| `id` | `Long` | `id` PK | Auto-generado (IDENTITY) |
| `nombre` | `String` | `nombre` | NOT NULL, UNIQUE, max 50 |
| `descripcion` | `String` | `descripcion` | Nullable, max 255 |
| `color` | `String` | `color` | NOT NULL, max 7 (ej: "#E63946") |
| `fechaCreacion` | `LocalDateTime` | `fecha_creacion` | NOT NULL, se asigna en `@PrePersist` |

### `ClienteEtiqueta` *(nueva — tabla asociativa con atributos propios)*
> Se usa entidad intermedia explícita (no `@ManyToMany` directo) porque la relación tiene datos propios.

| Campo | Tipo Java | Columna DB | Restricciones |
|---|---|---|---|
| `id` | `Long` | `id` PK | Auto-generado (IDENTITY) |
| `cliente` | `Cliente` | `cliente_cuit` FK | NOT NULL |
| `etiqueta` | `Etiqueta` | `etiqueta_id` FK | NOT NULL |
| `fechaAsignacion` | `LocalDateTime` | `fecha_asignacion` | NOT NULL, se asigna en `@PrePersist` |
| `asignadoPor` | `Usuario` | `usuario_id` FK | NOT NULL |

> **Unicidad:** `@UniqueConstraint(columnNames = {"cliente_cuit", "etiqueta_id"})` — un cliente no puede tener la misma etiqueta dos veces.

### Diagrama de relaciones
```
Cliente (1) ────< ClienteEtiqueta >──── (N) Etiqueta
                       │
                       └──── (N) Usuario (asignadoPor)

Cliente (1) ────< Credito (N)
Credito (1) ────< Cuota (N)
Cuota (1)   ────< Cobranza (N)
```

### Modificaciones para Entrega 3
```java
// Usuario.java — agregar
private boolean puedeAnularCredito = false;
private boolean puedeAnularCobranza = false;

// Credito.java — agregar
private boolean anulado = false;

// Cobranza.java — agregar
private LocalDate fechaCobranza = LocalDate.now();
private boolean anulada = false;
```

---

## 4. Endpoints REST

### Autenticación (público — sin JWT)

| Método | Endpoint | Body | Respuesta |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{ username, password }` | `{ token, username, rol }` |
| `POST` | `/api/auth/login` | `{ username, password }` | `{ token, username, rol }` |

### Clientes (requiere JWT)

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/clientes` | Crear cliente |
| `GET` | `/api/clientes` | Listar todos (con `?etiqueta={nombre}` opcional) |
| `GET` | `/api/clientes/{cuit}` | Buscar por CUIT |
| `PUT` | `/api/clientes/{cuit}` | Modificar cliente |
| `DELETE` | `/api/clientes/{cuit}` | Eliminar (si no tiene etiquetas) |

### Etiquetas (requiere JWT — cualquier rol)

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/etiquetas` | Crear etiqueta |
| `GET` | `/api/etiquetas` | Listar todas |
| `GET` | `/api/etiquetas/{id}` | Buscar por ID |
| `PUT` | `/api/etiquetas/{id}` | Modificar etiqueta |
| `DELETE` | `/api/etiquetas/{id}` | Eliminar (si no tiene clientes asignados) |

### Asignación cliente ↔ etiqueta (requiere JWT)

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/clientes/{cuit}/etiquetas/{etiquetaId}` | Asignar etiqueta a cliente |
| `DELETE` | `/api/clientes/{cuit}/etiquetas/{etiquetaId}` | Quitar etiqueta de cliente |
| `GET` | `/api/clientes/{cuit}/etiquetas` | Ver etiquetas de un cliente |
| `GET` | `/api/etiquetas/{id}/clientes` | Ver clientes con una etiqueta |

### Gestor de permisos — Entrega 3 (solo ADMIN)

| Método | Endpoint | Body | Descripción |
|---|---|---|---|
| `GET` | `/api/admin/usuarios` | — | Listar usuarios con permisos |
| `PUT` | `/api/admin/usuarios/{id}/permisos` | `PermisosRequest` | Actualizar permisos de usuario |

### Anulaciones — Entrega 3

| Método | Endpoint | Requiere |
|---|---|---|
| `DELETE` | `/api/creditos/{id}` | JWT + `puedeAnularCredito = true` |
| `DELETE` | `/api/cobranzas/{id}` | JWT + `puedeAnularCobranza = true` |

---

## 5. DTOs — campos y validaciones

### Request
```java
// ClienteRequest.java
@NotBlank(message = "El CUIT es obligatorio")
String cuit;

@NotBlank(message = "El nombre es obligatorio")
String nombre;

@NotBlank(message = "La razón social es obligatoria")
String razonSocial;

@NotBlank @Email(message = "Email inválido")
String email;

@NotBlank(message = "El teléfono es obligatorio")
String telefono;

// EtiquetaRequest.java
@NotBlank @Size(max = 50)
String nombre;

String descripcion; // nullable

@NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Color hex inválido")
String color;

// PermisosRequest.java (Entrega 3)
boolean puedeAnularCredito;
boolean puedeAnularCobranza;
```

### Response
```java
// ClienteResponse.java
String cuit, nombre, razonSocial, email, telefono;

// EtiquetaResponse.java
Long id;
String nombre, descripcion, color;
LocalDateTime fechaCreacion;

// ClienteEtiquetaResponse.java
EtiquetaResponse etiqueta;
LocalDateTime fechaAsignacion;
String asignadoPor; // username del usuario que asignó

// AuthResponse.java
String token, username, rol;
// Entrega 3 agrega:
boolean puedeAnularCredito, puedeAnularCobranza;

// UsuarioResponse.java (Entrega 3)
Long id;
String username, rol;
boolean puedeAnularCredito, puedeAnularCobranza;
```

---

## 6. Seguridad JWT

**Flujo completo:**
```
1. POST /api/auth/login  →  { token, username, rol }
2. Frontend guarda en localStorage: token + authUser
3. Cada request enviá: Authorization: Bearer <token>
4. JwtAuthFilter intercepta → valida → extrae username
5. Carga UserDetails desde DB → setea SecurityContext
6. Spring Security evalúa la ruta → permite o rechaza
```

**SecurityConfig actual:** solo requiere que el token sea válido (`anyRequest().authenticated()`). No distingue roles en rutas (solo usa `@PreAuthorize` para Entrega 3).

**Para Entrega 3 agregar en SecurityConfig:**
```java
@EnableMethodSecurity
public class SecurityConfig { ... }
```
Y proteger endpoints admin:
```java
@PreAuthorize("hasRole('ADMIN')")
```

---

## 7. Manejo de errores

**Formato uniforme de respuesta de error:**
```json
{
  "status": 400,
  "error": "Error de negocio",
  "mensajes": ["Ya existe una etiqueta con nombre: VIP"],
  "timestamp": "2026-04-07T21:00:00"
}
```

| Excepción | Código HTTP | Cuándo lanzarla |
|---|---|---|
| `ResourceNotFoundException` | 404 | Entidad no encontrada por ID/CUIT |
| `BusinessException` | 400 | Regla de negocio violada |
| `MethodArgumentNotValidException` | 400 | Falla de `@Valid` (manejada automáticamente) |
| `Exception` genérica | 500 | Error inesperado |

**Reglas de negocio:**

| Regla | Mensaje de error |
|---|---|
| CUIT duplicado | "Ya existe un cliente con CUIT: {cuit}" |
| Nombre de etiqueta duplicado | "Ya existe una etiqueta con nombre: {nombre}" |
| Asignación duplicada | "El cliente {cuit} ya tiene asignada la etiqueta '{nombre}'" |
| Eliminar etiqueta con clientes | "No se puede eliminar la etiqueta '{nombre}' porque tiene clientes asignados" |
| Eliminar cliente con etiquetas | "No se puede eliminar el cliente {cuit} porque tiene etiquetas asignadas" |
| Anular crédito con cobranzas *(E3)* | "No se puede anular el crédito {id} porque tiene cobranzas registradas" |
| Anular cobranza de otro día *(E3)* | "Solo se pueden anular cobranzas del día de hoy" |

---

## 8. Patrones de código — Backend

### Patrón Service / ServiceImpl
```java
// EtiquetaService.java — interfaz
public interface EtiquetaService {
    EtiquetaResponse crear(EtiquetaRequest request);
    List<EtiquetaResponse> listarTodas();
    EtiquetaResponse buscarPorId(Long id);
    EtiquetaResponse modificar(Long id, EtiquetaRequest request);
    void eliminar(Long id);
    void asignarACliente(String cuit, Long etiquetaId, String usernameAsignador);
    void quitarDeCliente(String cuit, Long etiquetaId);
    List<ClienteEtiquetaResponse> obtenerEtiquetasDeCliente(String cuit);
    List<ClienteResponse> obtenerClientesPorEtiqueta(Long etiquetaId);
}
```

### Anotaciones Lombok usadas
```java
@Data               // getters + setters + equals + hashCode + toString
@NoArgsConstructor  // constructor vacío (obligatorio en entidades JPA)
@AllArgsConstructor // constructor con todos los campos
@Builder            // patrón builder (se usa en Usuario)
@RequiredArgsConstructor // inyección por constructor en Services y Controllers
```

### @PrePersist para campos automáticos
```java
@PrePersist
public void prePersist() {
    this.fechaCreacion = LocalDateTime.now();
}
```

### Inyección por constructor (nunca @Autowired en campo)
```java
@Service
@RequiredArgsConstructor
public class EtiquetaServiceImpl implements EtiquetaService {
    private final EtiquetaRepository etiquetaRepository;
    private final ClienteRepository clienteRepository;
    private final ClienteEtiquetaRepository clienteEtiquetaRepository;
    private final UsuarioRepository usuarioRepository;
}
```

---

## 9. Patrones de código — Frontend

### Estructura de un slice (todos los slices siguen este patrón)
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { etiquetasApi } from '../../api/etiquetas';

export const fetchEtiquetas = createAsyncThunk(
  'etiquetas/fetchAll',
  async (_, { rejectWithValue }) => {
    try { return await etiquetasApi.getAll(); }
    catch (err) { return rejectWithValue(err.message); }
  }
);

const etiquetasSlice = createSlice({
  name: 'etiquetas',
  initialState: { lista: [], loading: false, error: null },
  reducers: {
    clearEtiquetas(state) { state.lista = []; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEtiquetas.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchEtiquetas.fulfilled, (s, a) => { s.loading = false; s.lista = a.payload; })
      .addCase(fetchEtiquetas.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
  }
});

export const { clearEtiquetas } = etiquetasSlice.actions;
export default etiquetasSlice.reducer;
```

### API functions (usan el apiClient.js que inyecta el token JWT)
```javascript
// api/etiquetas.js
import { api } from './apiClient';

export const etiquetasApi = {
  getAll:            ()            => api.get('/etiquetas'),
  getById:           (id)          => api.get(`/etiquetas/${id}`),
  create:            (body)        => api.post('/etiquetas', body),
  update:            (id, body)    => api.put(`/etiquetas/${id}`, body),
  delete:            (id)          => api.delete(`/etiquetas/${id}`),
  getByCliente:      (cuit)        => api.get(`/clientes/${cuit}/etiquetas`),
  getClientesByTag:  (id)          => api.get(`/etiquetas/${id}/clientes`),
  asignar:           (cuit, eid)   => api.post(`/clientes/${cuit}/etiquetas/${eid}`),
  quitar:            (cuit, eid)   => api.delete(`/clientes/${cuit}/etiquetas/${eid}`),
};
```

### Renderizado condicional de estados en páginas
```jsx
export default function Etiquetas() {
  const { lista, loading, error } = useSelector(s => s.etiquetas);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(fetchEtiquetas()); }, [dispatch]);

  if (loading) return <p>Cargando...</p>;
  if (error)   return <p>Error: {error}</p>;

  return ( /* tabla de etiquetas */ );
}
```

---

## 10. Convenciones de nomenclatura

### Backend (Java)
| Elemento | Convención | Ejemplo |
|---|---|---|
| Clases | PascalCase | `EtiquetaServiceImpl` |
| Métodos / campos Java | camelCase | `fechaCreacion`, `buscarPorCuit` |
| Columnas DB | snake_case | `fecha_creacion`, `cliente_cuit` |
| Tablas DB | plural snake_case | `clientes`, `etiquetas`, `cliente_etiqueta` |
| Paquetes | minúsculas | `com.uade.tpejemplo.service.impl` |

### Frontend (JavaScript)
| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes / páginas | PascalCase + `.jsx` | `Etiquetas.jsx` |
| Funciones / variables | camelCase | `fetchEtiquetas`, `etiquetaId` |
| Slices | camelCase + Slice | `etiquetasSlice.js` |
| API files | camelCase | `etiquetas.js` |
| Thunks | verbo + objeto | `fetchEtiquetas`, `addEtiqueta`, `deleteEtiqueta` |

---

## 11. Archivos por entrega

### Entrega 1 — Backend (14 de abril)

| Archivo | Acción | Cambio principal |
|---|---|---|
| `model/Cliente.java` | MODIFICAR | `dni`→`cuit`, + `razonSocial`, `email`, `telefono` |
| `model/Credito.java` | MODIFICAR | FK column `dni_cliente` → `cuit_cliente` |
| `model/Etiqueta.java` | CREAR | Nueva entidad |
| `model/ClienteEtiqueta.java` | CREAR | Nueva entidad asociativa |
| `repository/ClienteRepository.java` | MODIFICAR | `findByDni`→`findByCuit` |
| `repository/EtiquetaRepository.java` | CREAR | `findByNombre`, `existsByNombre` |
| `repository/ClienteEtiquetaRepository.java` | CREAR | `findByClienteAndEtiqueta`, `findByCliente`, `existsByClienteAndEtiqueta` |
| `dto/request/ClienteRequest.java` | MODIFICAR | Nuevos campos |
| `dto/request/EtiquetaRequest.java` | CREAR | `nombre`, `descripcion`, `color` |
| `dto/response/ClienteResponse.java` | MODIFICAR | Nuevos campos |
| `dto/response/EtiquetaResponse.java` | CREAR | — |
| `dto/response/ClienteEtiquetaResponse.java` | CREAR | — |
| `service/ClienteService.java` | MODIFICAR | Métodos `modificar`, `eliminar`, `filtrarPorEtiqueta` |
| `service/impl/ClienteServiceImpl.java` | MODIFICAR | Implementación de nuevos métodos |
| `service/EtiquetaService.java` | CREAR | Interfaz |
| `service/impl/EtiquetaServiceImpl.java` | CREAR | Implementación |
| `controller/ClienteController.java` | MODIFICAR | `{dni}`→`{cuit}`, + `PUT`, `DELETE`, filtro |
| `controller/EtiquetaController.java` | CREAR | CRUD + asignación |

### Entrega 2 — Frontend (26 de mayo)

| Archivo | Acción | Cambio principal |
|---|---|---|
| `api/clientes.js` | MODIFICAR | Adaptar a `cuit`, nuevos campos |
| `api/etiquetas.js` | CREAR | Funciones para todos los endpoints |
| `store/slices/clientesSlice.js` | MODIFICAR | Nuevos thunks |
| `store/slices/etiquetasSlice.js` | CREAR | CRUD + asignación |
| `store/index.js` | MODIFICAR | Agregar `etiquetasReducer` |
| `pages/Clientes.jsx` | MODIFICAR | Nuevos campos, filtro por etiqueta |
| `pages/Etiquetas.jsx` | CREAR | CRUD de etiquetas |
| `pages/ClienteEtiquetas.jsx` | CREAR | Gestión de etiquetas de un cliente |
| `components/Navbar.jsx` | MODIFICAR | + link a `/etiquetas` |
| `App.jsx` | MODIFICAR | + rutas `/etiquetas`, `/clientes/:cuit/etiquetas` |

### Entrega 3 — Estado global + permisos (23 de junio)

| Archivo | Acción | Cambio principal |
|---|---|---|
| `model/Usuario.java` | MODIFICAR | + `puedeAnularCredito`, `puedeAnularCobranza` |
| `model/Credito.java` | MODIFICAR | + `anulado` |
| `model/Cobranza.java` | MODIFICAR | + `fechaCobranza`, `anulada` |
| `config/SecurityConfig.java` | MODIFICAR | + `@EnableMethodSecurity` |
| `controller/AdminController.java` | CREAR | GET + PUT permisos |
| `controller/CreditoController.java` | MODIFICAR | + `DELETE /{id}` |
| `controller/CobranzaController.java` | MODIFICAR | + `DELETE /{id}` |
| `dto/request/PermisosRequest.java` | CREAR | — |
| `dto/response/UsuarioResponse.java` | CREAR | — |
| `dto/response/AuthResponse.java` | MODIFICAR | + permisos |
| `store/slices/permisosSlice.js` | CREAR | — |
| `store/slices/authSlice.js` | MODIFICAR | `user` incluye permisos |
| `pages/GestorPermisos.jsx` | CREAR | Solo ADMIN |
| `pages/Creditos.jsx` | MODIFICAR | Botón Anular condicional |
| `pages/Cobranzas.jsx` | MODIFICAR | Botón Anular condicional |
| `components/Navbar.jsx` | MODIFICAR | Link `/admin/permisos` solo para ADMIN |
| `components/PrivateRoute.jsx` | MODIFICAR | Soporte para `rolRequerido` |

---

## 12. Cómo correr el proyecto

### Backend
```bash
cd backend
mvn spring-boot:run
# Disponible en:  http://localhost:8080
# H2 Console:     http://localhost:8080/h2-console
#   JDBC URL:     jdbc:h2:mem:tpdb
#   User: sa / Password: (vacío)
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Disponible en:  http://localhost:5173
# Proxy Vite:     /api/* → localhost:8080 (sin CORS en desarrollo)
```

> ⚠️ La base de datos H2 es **en memoria** (`create-drop`). Se pierde al reiniciar el backend. Esto es esperado en desarrollo.
