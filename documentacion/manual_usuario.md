# Manual de Usuario — Sistema de Etiquetas para Clientes
**Materia:** Aplicaciones Interactivas (3.4.082) — UADE  
**Entrega:** 1  
**Sistema Operativo:** Windows 10 / 11  

---

## Índice

1. [Requisitos previos](#1-requisitos-previos)
2. [Cómo levantar el Backend](#2-cómo-levantar-el-backend)
3. [Cómo levantar el Frontend](#3-cómo-levantar-el-frontend)
4. [Cómo usar la aplicación](#4-cómo-usar-la-aplicación)
5. [Verificación técnica con la API (Postman)](#5-verificación-técnica-con-la-api-postman)
6. [Consultar la base de datos H2](#6-consultar-la-base-de-datos-h2)
7. [Errores frecuentes](#7-errores-frecuentes)

---

## 1. Requisitos previos

Antes de comenzar, instalar las siguientes herramientas. Para verificar si ya están instaladas, abrir **cmd** o **PowerShell** y ejecutar los comandos indicados.

| Herramienta | Versión mínima | Cómo verificar en cmd |
|---|---|---|
| **Maven** | 3.9+ | `mvn -version` |
| **Node.js** | 18 | `node -v` |
| **npm** | 9 | `npm -v` |

### ¿Cómo saber si Maven está instalado?

Abrir **cmd** y ejecutar:
```cmd
mvn -version
```
Debe mostrar información sobre la versión de Apache Maven (ej: `Apache Maven 3.9.x`).
Si dice `'mvn' no se reconoce como un comando`, hay que instalarlo siguiendo estos pasos:

1. Entrar a 👉 [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi) y descargar el archivo terminando en **`-bin.zip`** (ej: `apache-maven-3.9.9-bin.zip`).
2. Descomprimir la carpeta descargada en la unidad `C:\` (por ejemplo, que quede en `C:\apache-maven-3.9.9`).
3. Apretar la tecla Windows, escribir **"Variables de entorno"** y abrir "Editar las variables de entorno del sistema".
4. Hacer clic en **"Variables de entorno..."** (abajo de todo).
5. En la sección "Variables del sistema" (la lista de abajo), buscar la variable **"Path"**, seleccionarla y hacer clic en **"Editar..."**.
6. Hacer clic en **"Nuevo"** y escribir la ruta hacia la carpeta `bin` de Maven. Debe ser algo como: `C:\apache-maven-3.9.9\bin`
7. Aceptar en todas las ventanas. **Importante:** Hay que cerrar cualquier ventana de `cmd` que esté abierta y abrir una nueva para que reconozca a Maven.

### ¿Cómo saber si Java está bien instalado?

Abrir **cmd** (Win + R → escribir `cmd` → Enter) y ejecutar:
```cmd
java -version
```
Debe mostrar algo como:
```
openjdk version "21.0.10" 2024-01-16 LTS
```
Si dice `'java' no se reconoce como un comando`, hay que instalar el JDK 21 desde:  
👉 https://adoptium.net (descargar **Temurin 21 LTS**, installer para Windows x64)

### ¿Cómo saber si Node.js está instalado?

```cmd
node -v
```
Debe mostrar: `v18.x.x` o superior. Si no está instalado, descargarlo desde:  
👉 https://nodejs.org (descargar la versión **LTS**)

---

> **Nota sobre la base de datos:** El proyecto usa **H2**, una base de datos que corre en la memoria RAM junto al backend. **No hace falta instalar MySQL, PostgreSQL ni ningún otro motor.** Los datos se pierden al cerrar el backend, lo cual es normal.

---

## 2. Cómo levantar el Backend

### Paso 1 — Abrir una ventana de cmd en la carpeta del backend

**Opción A (más fácil):**
1. Abrir el Explorador de Windows.
2. Navegar hasta la carpeta `codigo\backend`.
3. Hacer clic en la barra de direcciones → escribir `cmd` → presionar **Enter**.

**Opción B (desde cmd):**
```cmd
cd "C:\ruta\donde\clonaron\el\proyecto\codigo\backend"
```

### Paso 2 — Ejecutar el backend

En la ventana de cmd que se abrió dentro de `codigo\backend`, escribir:

```cmd
mvn spring-boot:run
```

La primera vez que se ejecuta, Maven descargará las dependencias del proyecto (puede tardar varios minutos dependiendo de la conexión a internet). Las veces siguientes será casi instantáneo.

### Paso 3 — Verificar que levantó correctamente

Cuando el backend está listo, la consola muestra algo similar a:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
...
Started TpEjemploApplication in 4.321 seconds (JVM running for 5.012)
```

✅ El backend está disponible en: **`http://localhost:8080`**

> **⚠️ Error de memoria (OOM):** Si la ventana se cierra sola con un error, seguir los pasos en la [sección de errores frecuentes](#7-errores-frecuentes).

> **⚠️ No cerrar esta ventana de cmd.** Si se cierra, el backend deja de funcionar.

---

## 3. Cómo levantar el Frontend

El frontend necesita que **el backend esté corriendo** (sección anterior). Abrir una **segunda ventana de cmd**.

### Paso 1 — Abrir una nueva ventana de cmd en la carpeta del frontend

**Opción A (más fácil):**
1. En el Explorador de Windows, navegar hasta `codigo\frontend`.
2. Hacer clic en la barra de direcciones → escribir `cmd` → **Enter**.

**Opción B:**
```cmd
cd "C:\ruta\donde\clonaron\el\proyecto\codigo\frontend"
```

### Paso 2 — Instalar las dependencias (solo la primera vez)

```cmd
npm install
```

Este comando descarga todas las librerías de React que necesita el proyecto. Puede tardar 1-2 minutos. Solo hay que hacerlo **una vez**.

### Paso 3 — Iniciar el servidor de desarrollo

```cmd
npm run dev
```

La consola muestra algo como:

```
  VITE v6.x.x  ready in 350 ms

  ➜  Local:   http://localhost:5173/
```

✅ La aplicación está disponible en: **`http://localhost:5173`**

Abrir esa dirección en el navegador (Chrome, Edge, Firefox).

> **Nota:** El frontend redirige automáticamente todas las llamadas al backend. No hace falta configurar nada adicional.

> **⚠️ No cerrar esta segunda ventana de cmd** mientras se usa la aplicación.

---

## 4. Cómo usar la aplicación

Con ambas ventanas de cmd abiertas y corriendo, abrir **`http://localhost:5173`** en el navegador.

### 4.1 Registrarse (primera vez)

1. En la pantalla inicial, hacer clic en **Registrarse** (o ir a `/register`).
2. Completar un nombre de usuario y contraseña.
3. Hacer clic en **Registrar**.
4. Si el registro fue exitoso, el sistema inicia sesión automáticamente y redirige al panel principal.

### 4.2 Iniciar sesión

1. En la pantalla de **Login**, ingresar el usuario y contraseña registrados.
2. Hacer clic en **Iniciar sesión**.
3. El token de autenticación se guarda en el navegador automáticamente.

### 4.3 Gestionar Clientes

Desde el menú **Clientes**:

| Acción | Descripción |
|---|---|
| **Crear cliente** | Ingresar CUIT (ej: `20-12345678-5`), nombre, razón social, email y teléfono |
| **Ver listado** | Lista todos los clientes cargados en el sistema |
| **Filtrar por etiqueta** | Usar el campo de búsqueda con el nombre de una etiqueta |
| **Editar** | Modificar los datos de un cliente existente |
| **Eliminar** | Eliminar un cliente *(solo si no tiene créditos ni etiquetas asignadas)* |

### 4.4 Gestionar Etiquetas

Desde el menú **Etiquetas**:

| Acción | Descripción |
|---|---|
| **Crear etiqueta** | Nombre (ej: `VIP`), descripción opcional y color en formato hexadecimal (ej: `#E63946`) |
| **Ver listado** | Ver todas las etiquetas disponibles |
| **Editar** | Modificar nombre, descripción o color |
| **Eliminar** | Eliminar una etiqueta *(solo si ningún cliente la tiene asignada)* |

### 4.5 Asignar etiquetas a clientes

Desde el detalle de un **Cliente**:
1. Hacer clic en "Asignar etiqueta".
2. Seleccionar la etiqueta deseada del listado.
3. El sistema registra automáticamente la fecha y el usuario que realizó la asignación.

Para quitar una etiqueta, hacer clic en el ícono de eliminar junto a la etiqueta asignada.

### 4.6 Gestionar Créditos y Cobranzas

Desde el menú **Créditos**:
- Registrar un nuevo crédito para un cliente indicando: deuda original, fecha, importe de cuota y cantidad de cuotas.
- El sistema genera automáticamente las cuotas individuales.

Desde el menú **Cobranzas**:
- Registrar el pago de una cuota específica de un crédito.

---

## 5. Verificación técnica con la API (Postman)

Para probar o verificar los endpoints directamente (sin usar el frontend), se recomienda usar **Postman**.

### Instalar Postman

Descargar desde: 👉 https://www.postman.com/downloads/  
Instalar normalmente (siguiente, siguiente, finalizar).

---

### Paso 0 — Configuración del header de Authorization en Postman

Después de hacer login (paso 5.2), copiar el valor del campo `token`.  
En cada request posterior, ir a la pestaña **Authorization** → tipo **Bearer Token** → pegar el token.

---

### 5.1 Registrar un usuario

- **Método:** `POST`
- **URL:** `http://localhost:8080/api/auth/register`
- **Pestaña Body** → seleccionar `raw` → tipo `JSON`:

```json
{
  "username": "admin",
  "password": "password123"
}
```

**Respuesta esperada (código 201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "rol": "USER"
}
```

### 5.2 Iniciar sesión

- **Método:** `POST`
- **URL:** `http://localhost:8080/api/auth/login`
- **Body → raw → JSON:**

```json
{
  "username": "admin",
  "password": "password123"
}
```

Copiar el valor de `"token"` de la respuesta. Se usa en todos los endpoints siguientes.

---

### 5.3 Crear un cliente

- **Método:** `POST`
- **URL:** `http://localhost:8080/api/clientes`
- **Authorization:** Bearer Token → pegar el token
- **Body → raw → JSON:**

```json
{
  "cuit": "20-12345678-5",
  "nombre": "Juan Perez",
  "razonSocial": "Perez y Asociados SRL",
  "email": "juan@empresa.com",
  "telefono": "11-4444-5555"
}
```

**Respuesta esperada (código 201):**
```json
{
  "cuit": "20-12345678-5",
  "nombre": "Juan Perez",
  "razonSocial": "Perez y Asociados SRL",
  "email": "juan@empresa.com",
  "telefono": "11-4444-5555"
}
```

### 5.4 Listar todos los clientes

- **Método:** `GET`
- **URL:** `http://localhost:8080/api/clientes`
- **Authorization:** Bearer Token

### 5.5 Crear una etiqueta

- **Método:** `POST`
- **URL:** `http://localhost:8080/api/etiquetas`
- **Authorization:** Bearer Token
- **Body → raw → JSON:**

```json
{
  "nombre": "VIP",
  "descripcion": "Clientes con alto volumen de compras",
  "color": "#E63946"
}
```

### 5.6 Asignar etiqueta a un cliente

- **Método:** `POST`
- **URL:** `http://localhost:8080/api/clientes/20-12345678-5/etiquetas/1`
- **Authorization:** Bearer Token
- *(No requiere body. El número `1` al final es el ID de la etiqueta.)*

### 5.7 Ver etiquetas de un cliente

- **Método:** `GET`
- **URL:** `http://localhost:8080/api/clientes/20-12345678-5/etiquetas`
- **Authorization:** Bearer Token

**Respuesta esperada:**
```json
[
  {
    "etiquetaNombre": "VIP",
    "etiquetaColor": "#E63946",
    "fechaAsignacion": "2026-04-08T10:00:00",
    "asignadoPor": "admin"
  }
]
```

### 5.8 Filtrar clientes por etiqueta

- **Método:** `GET`
- **URL:** `http://localhost:8080/api/clientes?etiqueta=VIP`
- **Authorization:** Bearer Token

### 5.9 Crear un crédito

- **Método:** `POST`
- **URL:** `http://localhost:8080/api/creditos`
- **Authorization:** Bearer Token
- **Body → raw → JSON:**

```json
{
  "cuitCliente": "20-12345678-5",
  "deudaOriginal": 50000.00,
  "fecha": "2026-04-08",
  "importeCuota": 10000.00,
  "cantidadCuotas": 5
}
```

---

## 6. Consultar la base de datos H2

La base de datos tiene una consola web accesible desde el navegador. Útil para ver los datos directamente sin necesidad de Postman.

1. Con el backend corriendo, abrir en el navegador: **`http://localhost:8080/h2-console`**
2. Completar los campos exactamente así:

   | Campo | Valor |
   |---|---|
   | **JDBC URL** | `jdbc:h2:mem:tpdb` |
   | **User Name** | `sa` |
   | **Password** | *(dejar vacío)* |

3. Hacer clic en **Connect**.
4. En el panel izquierdo aparecen todas las tablas: `CLIENTES`, `ETIQUETAS`, `CLIENTE_ETIQUETA`, `CREDITOS`, `CUOTAS`, `COBRANZAS`, `USUARIOS`.

**Consultas SQL de ejemplo para verificar datos:**

```sql
-- Ver todos los clientes
SELECT * FROM CLIENTES;

-- Ver todas las etiquetas
SELECT * FROM ETIQUETAS;

-- Ver asignaciones con detalle (quién asignó qué etiqueta a qué cliente)
SELECT ce.FECHA_ASIGNACION, c.NOMBRE as cliente, e.NOMBRE as etiqueta, u.USERNAME as asignado_por
FROM CLIENTE_ETIQUETA ce
JOIN CLIENTES c ON ce.CLIENTE_CUIT = c.CUIT
JOIN ETIQUETAS e ON ce.ETIQUETA_ID = e.ID
JOIN USUARIOS u ON ce.USUARIO_ID = u.ID;

-- Ver créditos con sus cuotas
SELECT cr.ID, cr.DEUDA_ORIGINAL, cu.NUMERO_CUOTA, cu.IMPORTE
FROM CREDITOS cr
JOIN CUOTAS cu ON cu.ID_CREDITO = cr.ID;
```

> **⚠️ Importante:** Al cerrar el backend (cerrar la ventana de cmd), **todos los datos se borran**. La próxima vez que se levante el backend hay que volver a cargar los datos.

---

## 7. Errores frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| La ventana de cmd del backend se cierra sola con texto en rojo | Error de memoria (OOM) | Ver solución abajo ↓ |
| `'mvn' no se reconoce como un comando` | Maven no está instalado o no se agregó a la variable PATH | Descargar de maven.apache.org y agregar la carpeta `bin` a las variables de entorno |
| `'npm' no se reconoce como un comando` | Node.js no está instalado o no está en el PATH | Reinstalar Node.js desde nodejs.org y reiniciar cmd |
| `java -version` no funciona | Java no instalado o no en el PATH | Instalar JDK 21 desde adoptium.net. Puede requerir reiniciar Windows |
| Error `401 Unauthorized` en Postman | Token no incluido o expirado | Hacer login nuevamente y pegar el nuevo token en Authorization |
| Error `400` con lista de campos en Postman | El body no pasó las validaciones | Leer los mensajes de error en el JSON de respuesta y corregir los campos |
| Error `404 Not Found` | El cliente o etiqueta no existe | Verificar el CUIT o ID en el request |
| Error `400 "ya existe"` | CUIT ya registrado o etiqueta ya asignada al cliente | Usar un CUIT diferente o quitar la etiqueta antes de reasignarla |
| El navegador muestra "No se puede acceder" en `localhost:5173` | El frontend no está corriendo | Abrir la segunda ventana de cmd en `codigo\frontend` y ejecutar `npm run dev` |
| El frontend carga pero las llamadas fallan | El backend no está corriendo | Verificar que la primera ventana de cmd con `mvn spring-boot:run` siga abierta |

### Solución al error de memoria (OOM) en IntelliJ IDEA

Si se usa IntelliJ IDEA para correr el proyecto:

1. Ir al menú **Run** → **Edit Configurations...**
2. Seleccionar la configuración de `TpEjemploApplication`.
3. En el campo **VM Options** (o "Modify options" → "Add VM options"), escribir:
   ```
   -Xmx512m -Xms256m
   ```
4. Hacer clic en **OK** y volver a ejecutar.

Si se usa cmd, ejecutar en su lugar:
```cmd
set MAVEN_OPTS=-Xmx512m -Xms256m
mvn spring-boot:run
```
