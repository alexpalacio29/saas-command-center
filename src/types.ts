export type UserRole = 'Owner' | 'Admin' | 'Member' | 'Viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  createdAt: string;
}

export type ProductStage =
  | 'Idea & Validación'
  | 'Construcción / MVP'
  | 'Beta & Primeros Usuarios'
  | 'Lanzamiento'
  | 'Crecimiento & Rentabilidad'
  | 'Pausado'
  | 'IDEA'
  | 'VALIDACIÓN'
  | 'DEFINICIÓN'
  | 'MVP'
  | 'DESARROLLO'
  | 'PRUEBA INTERNA'
  | 'BETA'
  | 'LANZAMIENTO'
  | 'PRIMEROS CLIENTES'
  | 'VALIDACIÓN COMERCIAL'
  | 'MONETIZACIÓN'
  | 'CRECIMIENTO'
  | 'ESCALAMIENTO'
  | 'PAUSADO'
  | 'ARCHIVADO';

export type ProductStatus = 'saludable' | 'atencion' | 'critico' | 'pausado' | 'archivado';

export type BottleneckCategory =
  | 'Desarrollo'
  | 'Bugs'
  | 'UX'
  | 'Marketing'
  | 'Captación'
  | 'Ventas'
  | 'Retención'
  | 'Monetización'
  | 'Soporte'
  | 'Financiamiento';

export type BottleneckSeverity = 'critico' | 'alto' | 'moderado';

export interface BottleneckInfo {
  category: BottleneckCategory;
  description: string;
  recommendedAction: string;
  severity: BottleneckSeverity;
  identifiedAt: string;
}

export interface StageChecklistItem {
  id: string;
  stage: ProductStage;
  label: string;
  completed: boolean;
  requiredForNextStage?: boolean;
  notes?: string;
  updatedAt?: string;
}

export interface StageHistoryEntry {
  id: string;
  previousStage: ProductStage;
  newStage: ProductStage;
  changedAt: string;
  changedBy: string;
  comment?: string;
}

export interface ProductHealthIndicators {
  producto: number;   // 0 - 100 (% desarrollo / madurez funcional)
  tecnologia: number; // 0 - 100 (% estabilidad técnica / arquitectura)
  marketing: number;  // 0 - 100 (% tracción de marca / visibilidad)
  ventas: number;     // 0 - 100 (% efectividad de ventas)
  clientes: number;   // 0 - 100 (% satisfacción / retención)
  finanzas: number;   // 0 - 100 (% sostenibilidad / margen)
  notes?: string;
  lastUpdated: string;
}

// 21. Métricas financieras detalladas (Distinguiendo Revenue de Recurring Revenue)
export interface FinancialMetrics {
  mrr: number;                   // Monthly Recurring Revenue
  arr: number;                   // Annual Recurring Revenue
  nonRecurringMonthly: number;   // Ingresos no recurrentes mensuales (setups, consultoría, comisiones)
  monthlyCosts: number;          // Costos mensuales (infraestructura, software, personal)
  monthlyRevenue: number;        // Total = MRR + nonRecurringMonthly
  annualRevenue: number;         // (monthlyRevenue * 12)
  estimatedProfitMonthly: number;// monthlyRevenue - monthlyCosts
  lastUpdated: string;
}

export interface SaaSProduct {
  id: string;
  organizationId: string;
  name: string;
  logoUrl?: string;
  shortDescription: string;
  description: string;
  category: string;
  status: ProductStatus;
  currentStage: ProductStage;
  priority: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  nextAction: string;
  
  // URLs & Resources
  websiteUrl?: string;
  productionUrl?: string;
  stagingUrl?: string;
  repoUrl?: string;
  documentationUrl?: string;

  // Business & Financials
  businessModel: string;
  priceDetail: string;
  mrr: number;
  arr: number;
  activeClientsCount: number;
  activeUsersCount: number;
  currency: string;
  financials: FinancialMetrics;

  // Dates & Team
  createdAt: string;
  launchDate?: string;
  owner: string;
  lastActivityDate: string;

  // Sub-systems
  health: ProductHealthIndicators;
  bottleneck: BottleneckInfo;
  stageChecklists: StageChecklistItem[];
  stageHistory: StageHistoryEntry[];

  // Público Objetivo & Prospección B2B
  targetAudience?: string;
  targetSearchKeywords?: string;
  idealCustomerProfile?: string;

  // Módulos y Definición del SaaS
  activeModules?: string[];
  futureModules?: string[];
  pricingPlans?: SaaSPricingPlan[];

  // Infraestructura, Despliegue, Accesos & Disaster Recovery
  infrastructureVault?: SaaSInfrastructureVault;
}

export interface SaaSCredential {
  id: string;
  service: string;       // ej: 'Vercel', 'Railway', 'Supabase', 'Cloudflare', 'Resend'
  emailOrUser: string;   // Correo o usuario de acceso
  passwordOrKey: string; // Contraseña, API Key o Token maestro
  dashboardUrl?: string; // Enlace directo al panel de control
  notes?: string;        // Notas adicionales (ej: 'Autenticación con cuenta de Google')
}

export interface SaaSInfrastructureVault {
  // Despliegue Frontend & Backend
  frontendHost?: string;        // ej: 'Vercel', 'Netlify', 'Cloudflare Pages'
  frontendDashboardUrl?: string;// URL al panel del proyecto frontend
  backendHost?: string;         // ej: 'Railway', 'Render', 'Fly.io', 'DigitalOcean'
  backendDashboardUrl?: string; // URL al panel del backend/workers

  // Cuentas y Correos
  associatedEmail?: string;     // Correo principal asociado al proyecto
  emailServiceProvider?: string;// ej: 'Resend', 'Google Workspace', 'SendGrid'
  transactionalSenderEmail?: string; // ej: 'notificaciones@gestify.rd'

  // Dominio y DNS
  domainRegistrar?: string;     // ej: 'Cloudflare', 'Namecheap', 'GoDaddy'
  domainDashboardUrl?: string;  // Enlace al panel DNS

  // Base de Datos
  databaseProvider?: string;    // ej: 'Supabase', 'PostgreSQL Railway', 'Neon'
  databaseHostOrUri?: string;   // Host o cadena de conexión protegida
  databaseDashboardUrl?: string;// URL al dashboard de Supabase / BD

  // Backups & Almacenamiento en Nube
  backupCloudFolderUrl?: string;// Link a Google Drive / Dropbox de la carpeta del proyecto
  lastBackupDate?: string;      // ej: '2026-09-25'
  backupFrequency?: string;     // ej: 'Semanal', 'Diario', 'Quincenal'
  backupTypeNotes?: string;     // ej: 'Dump SQL + zip del repositorio en Google Drive'
  fileStorageProvider?: string; // ej: 'Supabase Storage', 'AWS S3', 'Cloudflare R2'

  // Variables de Entorno / Secretos Maestros (.env)
  envBackupText?: string;       // Copia de seguridad del archivo .env para levantar en caso de pérdida

  // Lista de Credenciales y Contraseñas
  credentials?: SaaSCredential[];

  // Notas de Recuperación / Pasos para levantar de cero
  disasterRecoveryNotes?: string;
}

export interface SaaSPricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description?: string;
  features: string[];
  isPopular?: boolean;
}

export type TaskPriority = 'Baja' | 'Media' | 'Alta' | 'Crítica';
export type TaskStatus = 'Pendiente' | 'En progreso' | 'Bloqueada' | 'Completada';

export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  organizationId: string;
  title: string;
  description?: string;
  productId: string;
  milestoneId?: string;
  responsible: string;
  priority: TaskPriority;
  priorityScore?: number; // 1 a 10
  status: TaskStatus;
  startDate?: string;
  dueDate?: string;
  tags: string[];
  checklist: TaskChecklistItem[];
  comments: TaskComment[];
  isWeeklyGoal?: boolean;
  createdAt: string;
  completedAt?: string;
}

export type RoadmapType = 'Objetivo' | 'Milestone' | 'Funcionalidad';
export type RoadmapStatus = 'Pendiente' | 'En progreso' | 'Bloqueado' | 'Completado' | 'Cancelado';

export interface RoadmapItem {
  id: string;
  organizationId: string;
  productId: string;
  title: string;
  description: string;
  type: RoadmapType;
  status: RoadmapStatus;
  priority: TaskPriority;
  targetDate: string;
  startDate?: string;
  responsible: string;
  dependencies?: string[];
  progressPercent: number; // 0 - 100
}

export type LeadStatus =
  | 'LEAD'
  | 'CONTACTADO'
  | 'INTERESADO'
  | 'DEMO'
  | 'PRUEBA'
  | 'NEGOCIACIÓN'
  | 'CLIENTE'
  | 'PERDIDO';

export interface BusinessProcessStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface Lead {
  id: string;
  organizationId: string;
  name: string;
  institutionOrCompany: string;
  email: string;
  phone: string;
  whatsapp: string;
  city?: string;
  productId: string;
  origin: string;
  status: LeadStatus;
  responsible: string;
  contactDate: string;
  nextFollowUpDate: string;
  contactedAt?: string;
  followUpDate?: string;
  estimatedValue: number;
  notes: string;
  lostReason?: string;
  createdAt: string;
  inSalesPipeline?: boolean;
  processSteps?: BusinessProcessStep[];
}

export interface ViewedCenter {
  id: string;
  productId: string;
  name: string;
  city: string;
  sector?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  contactName?: string;
  potentialUsers?: number;
  notes?: string;
  seenAt: string;
  status: 'visto' | 'convertido_a_lead';
  convertedLeadId?: string;
}

export type CRMActivityType = 'Llamada' | 'WhatsApp' | 'Email' | 'Reunión' | 'Demo' | 'Seguimiento' | 'Nota';

export interface CRMActivity {
  id: string;
  organizationId: string;
  leadId?: string;
  customerId?: string;
  productId: string;
  type: CRMActivityType;
  userName: string;
  contactName: string;
  description: string;
  resultOutcome?: string;
  date: string;
}

export type CustomerStatus = 'Trial' | 'Activo' | 'Suspendido' | 'Cancelado';

export interface Customer {
  id: string;
  organizationId: string;
  name: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  whatsapp?: string;
  usersCount?: number;
  city?: string;
  productIds: string[];
  plan: string;
  startDate: string;
  contractStartDate?: string;
  billingDay?: number;
  renewalDate?: string;
  status: CustomerStatus;
  mrr: number;
  notes: string;
  processSteps?: BusinessProcessStep[];
}

export type SubscriptionBillingCycle = 'mensual' | 'anual' | 'único';
export type SubscriptionStatus = 'Activa' | 'Trial' | 'Vencida' | 'Cancelada';

export interface Subscription {
  id: string;
  organizationId: string;
  customerId: string;
  productId: string;
  planName: string;
  price: number;
  frequency: SubscriptionBillingCycle;
  startDate: string;
  renewalDate: string;
  status: SubscriptionStatus;
}

// 22 & 23. Idea Vault & Validación exhaustiva
export type IdeaVaultStatus =
  | 'IDEA'
  | 'INVESTIGACIÓN'
  | 'VALIDACIÓN'
  | 'APROBADA'
  | 'MVP'
  | 'DESCARTADA'
  | 'PAUSADA';

export interface IdeaValidationDetails {
  hipotesis: string;
  problema: string;
  segmento: string;
  entrevistas: string;
  evidencias: string;
  competencia: string;
  riesgos: string;
  oportunidades: string;
  conclusionUsuario: string;
}

export interface IdeaItem {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  problem: string;
  targetAudience: string;
  solution: string;
  competition: string;
  businessModel: string;
  category: string;
  notes: string;
  date: string;
  status: IdeaVaultStatus;
  validation: IdeaValidationDetails;
  convertedProductId?: string;
  createdAt: string;
}

// 24. Knowledge / Documentación por SaaS
export type KnowledgeCategory =
  | 'Documentación técnica'
  | 'Documentación comercial'
  | 'Decisiones de arquitectura'
  | 'Procesos operativos'
  | 'Enlaces clave'
  | 'Notas generales';

export interface KnowledgeDoc {
  id: string;
  organizationId: string;
  productId: string;
  title: string;
  category: KnowledgeCategory;
  content: string;
  links: { title: string; url: string }[];
  author: string;
  createdAt: string;
  updatedAt: string;
}

// 25. Changelog por producto
export type ChangelogCategory = 'Feature' | 'Fix' | 'Improvement' | 'Security' | 'Breaking Change';

export interface ChangelogEntry {
  id: string;
  organizationId: string;
  productId: string;
  version: string;
  date: string;
  change: string;
  category: ChangelogCategory;
  author: string;
}

// 29. Bug Tracker
export type BugSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type BugStatus = 'Abierto' | 'En investigación' | 'Resuelto' | 'Cerrado';

export interface BugItem {
  id: string;
  organizationId: string;
  productId: string;
  title: string;
  description: string;
  severity: BugSeverity;
  priority: TaskPriority;
  status: BugStatus;
  responsible: string;
  date: string;
  version?: string;
  solution?: string;
}

// 30. Competidores
export interface CompetitorItem {
  id: string;
  organizationId: string;
  productId: string;
  name: string;
  url: string;
  description: string;
  pricing: string;
  features: string;
  notes: string;
  analyzedAt: string;
}

// 27. Alertas Internas
export type InternalAlertType =
  | 'tarea_vencida'
  | 'lead_sin_seguimiento'
  | 'milestone_retrasado'
  | 'producto_sin_actividad'
  | 'cliente_renovacion';

export interface InternalAlert {
  id: string;
  organizationId: string;
  type: InternalAlertType;
  title: string;
  message: string;
  severity: 'critico' | 'atencion' | 'info';
  productId?: string;
  entityId?: string;
  actionRoute?: string;
  createdAt: string;
  dismissed: boolean;
}

// 43. Activity Logs / Auditoría
export interface AuditActivityLog {
  id: string;
  organizationId: string;
  user: string;
  entity: 'product' | 'stage' | 'task' | 'lead' | 'customer' | 'milestone' | 'bug' | 'doc' | 'idea' | 'auth';
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'stage_change' | 'status_change' | 'login' | 'version_published';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface WeeklyFocus {
  weekIdentifier: string;
  primaryGoalTitle: string;
  primaryGoalDescription: string;
  targetProductId?: string;
  isCompleted: boolean;
  completedAt?: string;
  reflectionNotes?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastTestedAt?: string;
}

// 45. Feedback & Mejoras unificadas
export type FeedbackType = 'Opinion' | 'Mejora' | 'Bug';
export type FeedbackStatus = 'Pendiente' | 'En curso' | 'Listo';
export type FeedbackPriority = 'Baja' | 'Media' | 'Alta';

export interface SaaSFeedback {
  id: string;
  organizationId: string;
  productId: string;
  type: FeedbackType;
  title: string;
  description: string;
  source?: string; // Nombre del cliente o usuario
  status: FeedbackStatus;
  priority: FeedbackPriority;
  createdAt: string;
  updatedAt?: string;
}

