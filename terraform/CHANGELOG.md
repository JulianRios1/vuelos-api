# Changelog

## [v1.0.0] - 2025-01-07

### 🚀 **First Release**
Este es el primer lanzamiento oficial del proyecto **Vuelos API**. Incluye las funcionalidades básicas para gestionar itinerarios de vuelos y proporcionar un entorno de desarrollo sólido para futuros incrementos.

### **Nuevas Funcionalidades**
- **Configuraciones iniciales:**
  - Configuración de autenticación en `src/config/auth.js`.
  - Configuración del archivo `serverless.yml` para el despliegue en AWS.

- **Gestión de itinerarios:**
  - Endpoint para **crear itinerarios** (`src/functions/itinerario/create.js`).
  - Endpoint para **obtener detalles de un itinerario** (`src/functions/itinerario/get.js`).
  - Endpoint para **listar itinerarios** (`src/functions/itinerario/list.js`).

- **Middleware:**
  - Middleware de autenticación (`src/middlewares/auth.js`).
  - Middleware de validación (`src/middlewares/validator.js`).

- **Esquema de datos:**
  - Esquema JSON para itinerarios (`src/schemas/itinerario.js`).
  - Definiciones de tipos en TypeScript (`src/types/itinerario.d.ts`).

- **Swagger:**
  - Handler para documentación de la API con Swagger (`src/functions/swagger/handler.js`).

### **Mejoras en la arquitectura**
- Organización de carpetas en el proyecto (`src/`, `tests/`, etc.).
- Configuración inicial para pruebas (`tests/`).

### **Documentación**
- Documentación básica incluida en `README.md` para instalar y desplegar el proyecto.

