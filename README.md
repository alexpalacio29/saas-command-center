# SaaS Command Center (Centro de Control Ejecutivo Multi-SaaS)

Centro de comando ejecutivo para fundadores técnicos y operadores de software que gestionan múltiples productos SaaS en paralelo. Permite supervisar en un único panel centralizado el ciclo de vida de cada producto (desde la idea inicial hasta la escala), métricas financieras rigurosas (MRR vs Ingresos Totales), cuellos de botella operativos, roadmaps, embudo comercial CRM, tareas de alta prioridad, bugs, changelogs y auditoría cronológica.

---

## 🚀 Stack Tecnológico

- **Frontend Core**: React 18+ (Functional Components, Hooks, Context API)
- **Lenguaje**: TypeScript en modo estricto (`strict: true`)
- **Estilos**: Tailwind CSS con paleta oscura ejecutiva (`slate-950`, acentos índigo y esmeralda)
- **Iconografía**: `lucide-react`
- **Visualización de Datos / Gráficos**: `recharts` (Gráficos interactivos de embudo y comparativas financieras)
- **Persistencia**: Arquitectura híbrida *Offline-First* con almacenamiento reactivo local y sincronización con **Supabase (PostgreSQL 15+)**
- **Autenticación & RLS**: Supabase Auth con Row Level Security y control de acceso basado en roles (RBAC)
- **Bundler & Tooling**: Vite + TSX

---

## 📦 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <URL_REPOSITORIO>
   cd saas-command-center
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

---

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```bash
# Variables del Entorno de Ejecución
APP_URL="https://tu-app-url.run.app"
GEMINI_API_KEY="tu-api-key"

# Integración con Supabase (Opcional - Si no se configuran, opera en modo local reactivo)
VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"
VITE_SUPABASE_ANON_KEY="tu-anon-key-de-supabase"
```

---

## 🗄️ Configuración de Supabase & Migraciones

La base de datos relacional PostgreSQL está organizada en migraciones versionadas dentro del directorio `/supabase/migrations`:

1. `20260926000001_initial_schema.sql`:
   - Tablas base: `organizations`, `organization_members`, `profiles`, `products`, `financial_records`, `product_stage_history`, `stage_checklists`, `product_health`.
2. `20260926000002_operations_and_crm.sql`:
   - Operaciones: `tasks`, `subtasks`, `roadmap_items`, `leads`, `crm_activities`, `customers`, `subscriptions`.
3. `20260926000003_ideas_bugs_changelogs.sql`:
   - Inteligencia y calidad: `ideas` (banco de ideas y cuaderno de validación), `bugs`, `changelogs`, `knowledge_docs`, `competitors`, `audit_activity_logs`.
4. `20260926000004_rls_policies.sql`:
   - Seguridad por fila (RLS): Aislamiento estricto multi-tenant vía `is_org_member(org_id)` y `get_org_role(org_id)`.

### Aplicación de Migraciones en Supabase:
Puedes aplicar las migraciones directamente con el CLI de Supabase o desde el SQL Editor del dashboard:
```bash
supabase db push
# O aplicar el seed inicial:
supabase db reset
```

---

## 🌱 Seed de Datos Iniciales

El archivo `/supabase/seed.sql` contiene la configuración inicial del portafolio con 5 productos SaaS representativos:

1. **EduGest** (Etapa: *LANZAMIENTO*, MRR: $1,640, 5 Clientes)
2. **GestiFy RD** (Etapa: *CRECIMIENTO*, MRR: $1,890, 18 Clientes)
3. **Biblos Games** (Etapa: *BETA*, MRR: $420, 3 Clientes)
4. **MyTurn** (Etapa: *PRUEBA INTERNA*, MRR: $250, 2 Clientes)
5. **Igleconet** (Etapa: *MVP*, MRR: $380, 4 Clientes)

También es posible reiniciar o restaurar estos datos en cualquier momento desde **Configuración > Respaldos & Integraciones**.

---

## 💻 Desarrollo Local

Para iniciar el servidor de desarrollo local en el puerto 3000:

```bash
npm run dev
```

Para verificar tipado y consistencia de código:
```bash
npm run lint
```

Para compilar para producción:
```bash
npm run build
```

---

## 🏗️ Arquitectura del Sistema

```
/
├── src/
│   ├── components/
│   │   ├── activity/        # Feed global de actividad (9 tipos de eventos cronológicos)
│   │   ├── bugs/            # Bug Tracker (severidad, estado, versión y resolución)
│   │   ├── common/          # Componentes reutilizables (Modales, Badges, StatCards)
│   │   ├── customers/       # CRM de Clientes & Suscripciones recurrentes
│   │   ├── dashboard/       # Tablero principal de métricas ejecutivas y alertas
│   │   ├── ideas/           # Idea Vault & Cuaderno de validación cualitativa
│   │   ├── layout/          # Header, Sidebar y MobileNav responsivo
│   │   ├── metrics/         # Panel financiero riguroso (MRR vs Total Revenue vs Costos)
│   │   ├── pipeline/        # Pipeline comercial CRM (Leads, demos, valor estimado)
│   │   ├── products/        # Módulo de Productos (CRUD, 15 etapas, salud, modal 360°)
│   │   ├── roadmaps/        # Roadmap por fases y hitos
│   │   ├── settings/        # Configuración modular (Perfil, preferencias, DDL, Supabase)
│   │   ├── tasks/           # Tablero de tareas operativas y filtros
│   │   ├── thisweek/        # Planificador semanal de alto impacto
│   │   └── today/           # Enfoque diario "Mi Día"
│   ├── context/
│   │   └── AppContext.tsx   # Estado global reactivo con soporte Offline/Supabase
│   ├── data/
│   │   └── defaultData.ts   # Plantillas de 15 etapas, checklists y datos semilla
│   └── types.ts             # Definición canónica de tipos TypeScript
├── supabase/
│   ├── migrations/          # Migraciones SQL organizadas cronológicamente
│   └── seed.sql             # Datos semilla SQL para PostgreSQL
└── package.json
```

---

## 🔒 Seguridad & Multi-Tenancy

1. **Aislamiento Multi-Tenant**: Toda consulta y mutación está vinculada a `organization_id`.
2. **Row Level Security (RLS)**: Las políticas en PostgreSQL impiden que usuarios de una organización accedan a los datos de otra.
3. **Control de Acceso (RBAC)**:
   - `Owner`: Control total de la organización, finanzas, productos y miembros.
   - `Admin`: Gestión de productos, configuración técnica y operaciones comerciales.
   - `Member`: Creación y actualización de tareas, leads, bugs y notas de actividad.
   - `Viewer`: Consulta y lectura de métricas y estados del portafolio.
4. **Protección de Secretos**: Ninguna clave privada o contraseña se almacena en la sección de Knowledge ni en el frontend.

---

## 📋 Reglas de Desarrollo (Sección 51)

Antes de crear una nueva funcionalidad:
1. **Analiza la arquitectura existente**: Consulta siempre `AppContext.tsx` y `types.ts` antes de modificar estructuras.
2. **Reutiliza componentes**: Usa los componentes modales y de presentación en `src/components/common`.
3. **Reutiliza tipos**: No inventes tipos paralelos; extiende los tipos oficiales en `src/types.ts`.
4. **Reutiliza servicios**: Centraliza las operaciones en los métodos provistos por `AppContext`.
5. **No dupliques lógica**: Evita replicar cálculos de MRR, porcentajes de avance o filtrado.
6. **Mantén TypeScript estricto**: No uses `any`; tipa todas las propiedades y callbacks.
7. **Valida formularios**: Todo campo requerido debe contar con validación previa al envío.
8. **Maneja errores**: Usa bloques de captura y notificaciones visuales legibles.
9. **Implementa loading states**: Muestra indicadores de carga durante operaciones asíncronas.
10. **Implementa empty states**: Ofrece mensajes explicativos cuando no existan datos en tablas o listas.
11. **Comprueba permisos**: Valida el rol activo antes de permitir acciones destructivas.
12. **Comprueba RLS**: Asegura que cada nueva tabla posea su respectiva política en `supabase/migrations`.
13. **Comprueba mobile**: Diseña y verifica todas las vistas para pantallas móviles con `MobileNav`.

---

## ✅ Criterios de Finalización (Sección 54)

No se considera una fase o funcionalidad terminada solo porque compile. Se debe verificar:
- [x] Probar CRUD completo de entidades (crear, editar, consultar y eliminar).
- [x] Probar Auth y cambio reactivo de roles (Owner, Admin, Member, Viewer).
- [x] Probar políticas RLS y aislamiento por `organization_id`.
- [x] Probar validación y feedback de formularios.
- [x] Probar filtros reactivos por producto, etapa y categoría.
- [x] Probar diseño responsivo en resoluciones desktop y mobile.
- [x] Probar navegación fluida entre todos los módulos.
- [x] Probar manejo de errores y estados vacíos (*Empty States*).
- [x] Comprobar persistencia local y sincronización con Supabase.
- [x] Comprobar consistencia relacional (productos con tareas, leads, finanzas, bugs).
- [x] Comprobar exactitud en cálculos financieros (MRR, ARR, márgenes de utilidad).
- [x] Comprobar ausencia de datos hardcodeados en componentes.
