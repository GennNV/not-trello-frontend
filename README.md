# 🎯 Not-Trello - Frontend

Aplicación web tipo Trello desarrollada con React para gestión visual de proyectos, tableros y tareas con funcionalidad de drag & drop.

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Ejecución](#️-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Rutas](#️-rutas)
- [Autenticación](#-autenticación)
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Troubleshooting](#-troubleshooting)
- [Credenciales de Prueba](#-credenciales-de-prueba)

---

## 🛠️ Tecnologías

### Core

- **React 19.1** - Biblioteca UI con las últimas características
- **Vite 7.1** - Build tool ultra rápido y dev server
- **JavaScript (ES6+)** - Lenguaje principal

### Ruteo y Estado

- **Wouter 3.7** - Ruteo ligero basado en hooks
- **Zustand 5.0** - Estado global minimalista

### HTTP y Validación

- **Axios 1.12** - Cliente HTTP con interceptores
- **React Hook Form 7.65** - Manejo performante de formularios
- **Zod 4.1** - Validación de esquemas TypeScript-first
- **@hookform/resolvers 5.2** - Integración de Zod con React Hook Form

### UI y Estilos

- **Tailwind CSS 4.1** - Framework CSS utility-first
- **Lucide React 0.545** - Iconos modernos y ligeros
- **React Hot Toast 2.6** - Notificaciones toast elegantes
- **Recharts 3.2** - Gráficos y visualización de datos

### Drag & Drop

- **@hello-pangea/dnd 18.0** - Biblioteca de drag & drop (fork mantenido de react-beautiful-dnd)

---

## ✨ Características

### Funcionalidades Principales

- ✅ **Autenticación JWT** con persistencia en localStorage
- ✅ **Gestión de Tableros** - CRUD completo de tableros
- ✅ **Gestión de Listas** - Crear y eliminar listas dentro de tableros
- ✅ **Gestión de Tarjetas** - CRUD completo con validación
- ✅ **Drag & Drop** - Reorganizar listas y tarjetas arrastrando
- ✅ **Persistencia de orden** - El orden de listas se guarda automáticamente
- ✅ **Sistema de Roles** - Admin y Usuario con permisos diferenciados
- ✅ **Vista de Detalle** - Información completa de tarjetas
- ✅ **Panel de Administración** - Dashboard con estadísticas y gráficos
- ✅ **Protección de eliminación** - No permite eliminar tableros con listas ni listas con tarjetas
- ✅ **Navegación contextual** - Al editar/eliminar tarjetas desde un tablero, vuelve al mismo tablero
- ✅ **Interfaz responsive** - Mobile-first design con Tailwind CSS
- ✅ **Lazy Loading** - Carga diferida de componentes pesados
- ✅ **Notificaciones** - Feedback visual con react-hot-toast
- ✅ **Efectos visuales** - Hover effects y transiciones suaves
- ✅ **Validación de formularios** - Validación en tiempo real con Zod

### Características Técnicas

- 🔒 **Interceptores HTTP** - Manejo automático de autenticación y errores
- 🎨 **Componentes reutilizables** - Arquitectura modular y mantenible
- 📱 **PWA Ready** - Diseño responsive para móviles y tablets
- ⚡ **Hot Module Replacement** - Actualizaciones instantáneas en desarrollo
- 🧩 **Code Splitting** - Optimización de carga con lazy loading

---

## 📋 Requisitos

- [Node.js 18+](https://nodejs.org/)
- [npm 9+](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- **Backend API** ejecutándose en http://localhost:5000

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/not-trello-frontend.git
cd not-trello-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

O con yarn:

```bash
yarn install
```

### 3. Verificar instalación

```bash
node --version
# Debe mostrar: v18.x.x o superior

npm --version
# Debe mostrar: 9.x.x o superior
```

---

## ⚙️ Configuración

### 1. Variables de Entorno (Opcional)

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:5000/api
```

Si no se crea, usa por defecto: `http://localhost:5000/api`

### 2. Configurar URL del Backend

Editar `src/services/api.js` si necesitas cambiar la URL:

```javascript
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Cambiar aquí
});
```

---

## ▶️ Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

### Con puerto personalizado

```bash
npm run dev -- --port 3000
```

### Build para Producción

```bash
npm run build
```

Los archivos se generan en `/dist`

### Preview del Build

```bash
npm run preview
```

### Ejecutar Linter

```bash
npm run lint
```

---

## 📊 Estructura del Proyecto

```
src/
├── components/              # Componentes reutilizables
│   ├── ConfirmModal.jsx    # Modal de confirmación para acciones destructivas
│   ├── ListaForm.jsx       # Formulario para crear listas
│   ├── LoadingSpinner.jsx  # Indicador de carga animado
│   ├── Modal.jsx           # Modal genérico reutilizable
│   ├── Navbar.jsx          # Barra de navegación con autenticación
│   ├── ProtectedRoute.jsx  # HOC para protección de rutas
│   ├── TableroForm.jsx     # Formulario para crear/editar tableros
│   └── TarjetaCard.jsx     # Card de tarjeta para vista de lista
│
├── pages/                   # Páginas de la aplicación
│   ├── AdminPanel.jsx      # Panel de administración con gráficos (lazy)
│   ├── Home.jsx            # Landing page pública
│   ├── Login.jsx           # Login con validación Zod
│   ├── Register.jsx        # Registro de nuevos usuarios
│   ├── TableroDetalle.jsx  # Vista de tablero con drag & drop (lazy)
│   ├── Tableros.jsx        # Lista de tableros con CRUD
│   ├── TarjetaDetalle.jsx  # Vista detallada de tarjeta (lazy)
│   └── TarjetaForm.jsx     # Formulario crear/editar tarjetas
│
├── services/                # Servicios API
│   ├── api.js              # Instancia axios con interceptores
│   ├── adminService.js     # Servicios de administración
│   ├── authService.js      # Servicios de autenticación
│   ├── registerServices.js # Servicios de registro
│   ├── tablerosService.js  # Servicios de tableros y listas
│   └── tarjetasService.js  # Servicios de tarjetas
│
├── store/                   # Estado global (Zustand)
│   ├── authStore.js        # Estado de autenticación y usuario
│   └── tarjetasStore.js    # Estado de tarjetas
│
├── schemas/                 # Esquemas de validación (Zod)
│   ├── loginSchema.js      # Validación de login
│   ├── registerSchema.js   # Validación de registro
│   ├── tableroSchema.js    # Validación de tableros
│   └── tarjetaSchema.js    # Validación de tarjetas
│
├── assets/                  # Recursos estáticos
│   └── react.svg           # Logo de React
│
├── App.jsx                  # Componente raíz con rutas
├── App.css                  # Estilos del componente App
├── main.jsx                 # Entry point de la aplicación
└── index.css                # Estilos globales + Tailwind
```

---

## 🛣️ Rutas

### Rutas Públicas

```javascript
/                  # Home (landing page)
/login            # Login con formulario validado
/register         # Registro de nuevos usuarios
```

### Rutas Protegidas (requieren autenticación)

```javascript
/tableros                   # Lista de todos los tableros
/tableros/:id              # Detalle de tablero con listas y drag & drop
/tarjetas/:id              # Detalle de tarjeta individual
```

### Rutas de Administrador (solo rol Admin)

```javascript
/admin                      # Panel con estadísticas y gráficos
/admin/tarjetas/new        # Crear nueva tarjeta
/admin/tarjetas/:id/edit   # Editar tarjeta existente
```

### Lazy Loading

Los siguientes componentes se cargan bajo demanda para optimizar el rendimiento:

- `TarjetaDetalle` - Vista de detalle de tarjeta
- `TableroDetalle` - Vista de tablero con drag & drop
- `AdminPanel` - Panel de administración con gráficos

---

## 🔐 Autenticación

### Flujo de Login

1. Usuario ingresa credenciales en `/login`
2. Validación del formulario con `zod` (react-hook-form)
3. Request a `POST /api/auth/login`
4. Backend retorna `{ token, usuario }`
5. Guardar `token` y `user` en `authStore` (Zustand)
6. Persistir en `localStorage` para mantener sesión
7. Redirección automática a `/tableros`

### Interceptores de Axios

El cliente HTTP incluye interceptores automáticos:

**Request Interceptor:**

```javascript
// Agrega token JWT automáticamente a cada request
config.headers.Authorization = `Bearer ${token}`;
```

**Response Interceptor:**

```javascript
// Maneja errores 401 (no autorizado)
if (error.response?.status === 401) {
  logout();
  redirect("/login");
}
```

### Protección de Rutas

```jsx
// Ruta protegida (requiere estar autenticado)
<ProtectedRoute>
  <Tableros />
</ProtectedRoute>

// Ruta protegida solo para Admin
<ProtectedRoute adminOnly>
  <AdminPanel />
</ProtectedRoute>
```

---

## 🎯 Funcionalidades Principales

### Gestión de Tableros

- **Crear tableros** - Formulario modal con validación
- **Editar tableros** - Modificar título y descripción
- **Eliminar tableros** - Solo si no tienen listas (validación frontend)
- **Vista de lista** - Grid responsive con todas los tableros

### Gestión de Listas

- **Crear listas** - Botón en header del tablero
- **Eliminar listas** - Solo si no tienen tarjetas (validación frontend)
- **Drag & Drop de listas** - Reordenar arrastrando
- **Persistencia de orden** - Se guarda automáticamente en backend

### Gestión de Tarjetas

- **Crear tarjetas** - Formulario completo con validación
- **Editar tarjetas** - Modificar todos los campos
- **Eliminar tarjetas** - Con confirmación modal
- **Drag & Drop de tarjetas** - Mover entre listas
- **Filtrar por tablero** - Al crear desde un tablero, muestra solo sus listas
- **Navegación contextual** - Vuelve al tablero de origen después de editar

### Características de Tarjetas

- Título y descripción
- Prioridad (Baja, Media, Alta) con colores
- Fecha de vencimiento
- Asignación a usuarios
- Estados (Todo, In Progress, Done)
- Vista detallada con información completa

### Drag & Drop

Implementado con `@hello-pangea/dnd`:

- **Arrastrar listas** - Reordenar listas horizontalmente
- **Arrastrar tarjetas** - Mover tarjetas entre listas
- **Feedback visual** - Opacidad y sombras durante el arrastre
- **Persistencia automática** - Guarda cambios en backend

### Panel de Administración

Solo accesible para usuarios con rol Admin:

- Estadísticas generales del sistema
- Gráficos con Recharts
- Gestión de usuarios (si está implementado en backend)

---

## 🐛 Troubleshooting

### Error: "Cannot connect to API"

```bash
# Verificar que el backend esté corriendo
# URL por defecto: http://localhost:5000

# Verificar en src/services/api.js
baseURL: 'http://localhost:5000/api'
```

### Error: "Module not found"

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: CORS

```bash
# Verificar que el backend tenga CORS configurado
# Debe permitir origen: http://localhost:5173
```

### Problemas con Tailwind

```bash
# Verificar que tailwind.config.js tenga:
content: ["./index.html", "./src/**/*.{js,jsx}"]

# Verificar que index.css tenga:
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Puerto en uso

```bash
# Cambiar puerto manualmente
npm run dev -- --port 3000
```

### Drag & Drop no funciona

```bash
# Verificar que @hello-pangea/dnd esté instalado
npm list @hello-pangea/dnd

# Reinstalar si es necesario
npm install @hello-pangea/dnd
```

---

## 👤 Credenciales de Prueba

### Usuario Administrador

```
Email: admin@trello.com
Password: admin123
```

**Permisos:**

- Acceso completo al panel de admin (`/admin`)
- Crear, editar y eliminar tarjetas
- Crear y eliminar tableros
- Crear y eliminar listas
- Ver todas las funcionalidades

### Usuario Regular

```
Email: user@trello.com
Password: user123
```

**Permisos:**

- Ver tableros y sus listas
- Ver tarjetas
- Drag & drop de tarjetas y listas
- Sin acceso a funciones de administración
- No puede crear, editar ni eliminar

---

## 🎨 Estilos y Diseño

### Tailwind CSS

El proyecto utiliza Tailwind CSS 4.1 con:

- Utility-first approach
- Diseño mobile-first responsive
- Hover effects y transiciones
- Colores personalizados para prioridades
- Grid y Flexbox layouts

### Efectos Visuales

- **Hover en tarjetas**: Elevación con `hover:-translate-y-1` y sombra
- **Hover en botones**: Cambios de color y opacidad
- **Transiciones suaves**: `transition-all duration-200`
- **Feedback visual**: Indicadores de carga y toasts

---

## ✅ Checklist de Instalación

- [ ] Node.js 18+ instalado
- [ ] Backend API corriendo en http://localhost:5000
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` configurado (opcional)
- [ ] Proyecto ejecutándose (`npm run dev`)
- [ ] Aplicación accesible en http://localhost:5173
- [ ] Login funcionando con credenciales de prueba
- [ ] Tailwind CSS aplicándose correctamente
- [ ] Drag & Drop funcionando en tableros

---

## 📚 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (puerto 5173)
npm run build        # Build de producción
npm run preview      # Preview del build de producción
npm run lint         # Ejecutar ESLint
```

---

## 📄 Licencia

Este proyecto es parte de un trabajo académico para **Programación IV** en la **Tecnicatura Universitaria de Programación** de la **UTN FRSN** (Universidad Tecnológica Nacional - Facultad Regional San Nicolas).

---

**¡Aplicación lista para usar! 🎉**

Para cualquier problema, consultar la sección de [Troubleshooting](#-troubleshooting) o revisar los logs del navegador (F12 → Console).
