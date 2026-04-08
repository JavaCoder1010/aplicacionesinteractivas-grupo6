# Sistema de Etiquetas para Clientes — Entrega 1

**Materia:** Aplicaciones Interactivas (3.4.082) — UADE  
**Módulo Implementado:** Sistema de Etiquetas para Clientes  

---

## 1. Descripción del Módulo

El módulo de "Sistema de Etiquetas" introduce la capacidad de categorizar y segmentar a los clientes del sistema de Créditos y Cobranzas de forma dinámica. A través de este módulo, los usuarios pueden crear etiquetas personalizadas (como "VIP", "Moroso", "Mayorista", con sus respectivos colores y descripciones) y asignarlas a los clientes existentes.

El sistema mantiene un registro histórico auditado de las asignaciones, guardando no solo qué etiqueta tiene cada cliente, sino también la fecha exacta en la que se aplicó y qué usuario del sistema realizó dicha asignación.

---

## 2. Modelo de Datos

Para soportar este módulo, la base de datos se adaptó a la siguiente estructura relacional (implementado con Spring Data JPA e Hibernate usando H2 en memoria):

### `Cliente` (Modificada)
La entidad base se actualizó para reflejar un modelo de negocio más realista.
*   **PK:** `cuit` (String, única, 13 caracteres)
*   **Campos nuevos:** `razonSocial`, `email`, `telefono`
*   **Relaciones:** `@OneToMany` hacia `Credito` y la nueva tabla `ClienteEtiqueta`.

### `Etiqueta` (Nueva)
Entidad principal del módulo que representa las categorías.
*   **PK:** `id` (Long, Autogenerado)
*   **Campos:** `nombre` (Unique, obligatorio), `descripcion` (opcional), `color` (Formato Hexadecimal obligatorio, ej: `#E63946`), `fechaCreacion` (Autogenerada vía `@PrePersist`).

### `ClienteEtiqueta` (Nueva - Tabla Asociativa Fuerte)
Modelo intermedio explícito que vincula Clientes y Etiquetas persistiendo auditoría.
*   **PK:** `id` (Long, Autogenerado)
*   **FK 1:** `cliente_cuit`
*   **FK 2:** `etiqueta_id`
*   **Auditoría:** `fechaAsignacion` (vía `@PrePersist`) y `usuario_id` (FK de quién asignó).
*   *Restricción:* `@UniqueConstraint` para impedir que a un cliente se le asigne la misma etiqueta dos veces.

---

## 3. Endpoints Implementados (API REST)

Todos los endpoints (salvo `/api/auth`) están protegidos mediante **JWT (JSON Web Tokens)**.

### Módulo de Etiquetas (`/api/etiquetas`)
| Método | Endpoint | Body Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/etiquetas` | `{nombre, descripcion, color}` | Crea una nueva etiqueta. |
| `GET` | `/api/etiquetas` | - | Lista todas las etiquetas. |
| `GET` | `/api/etiquetas/{id}` | - | Obtiene detalle de una etiqueta puntual. |
| `PUT` | `/api/etiquetas/{id}` | `{nombre, descripcion, color}` | Modifica una etiqueta existente. |
| `DELETE` | `/api/etiquetas/{id}` | - | Elimina una etiqueta *(falla si tiene clientes asignados)*. |
| `GET` | `/api/etiquetas/{id}/clientes`| - | **Consulta inversa:** lista todos los clientes que poseen esta etiqueta. |

### Módulo de Clientes (`/api/clientes`)
| Método | Endpoint | Body Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/clientes` | `{cuit, nombre, razonSocial, email, telefono}` | Da de alta un nuevo cliente. |
| `GET` | `/api/clientes` | - | Lista todos los clientes. Soporta query string `?etiqueta={nombre}` para filtrar. |
| `GET` | `/api/clientes/{cuit}` | - | Obtiene los datos del cliente por su CUIT. |
| `PUT` | `/api/clientes/{cuit}` | `{cuit, nombre, razonSocial, email, telefono}` | Actualiza datos del cliente. |
| `DELETE` | `/api/clientes/{cuit}` | - | Elimina un cliente *(falla si tiene etiquetas/créditos)*. |

### Gestión de Asignaciones (Sub-rutas de clientes)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/clientes/{cuit}/etiquetas/{etiquetaId}` | Asigna una etiqueta al cliente. Extre el nombre del "asignador" del token JWT. |
| `DELETE` | `/api/clientes/{cuit}/etiquetas/{etiquetaId}` | Remueve una etiqueta de un cliente. |
| `GET` | `/api/clientes/{cuit}/etiquetas` | Lista de etiquetas activas de un cliente puntual, detallando fecha y autor de la asignación. |
