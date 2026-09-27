import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  SaaSProduct,
  ProductStage,
  BottleneckInfo,
  ProductHealthIndicators,
  FinancialMetrics,
  Task,
  TaskStatus,
  RoadmapItem,
  Lead,
  LeadStatus,
  CRMActivity,
  Customer,
  Subscription,
  IdeaItem,
  IdeaVaultStatus,
  WeeklyFocus,
  SupabaseConfig,
  BugItem,
  ChangelogEntry,
  KnowledgeDoc,
  CompetitorItem,
  InternalAlert,
  AuditActivityLog,
  Organization,
  UserProfile,
  UserRole,
  SaaSFeedback,
  StageChecklistItem,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_TASKS,
  INITIAL_LEADS,
  INITIAL_ACTIVITIES,
  INITIAL_CUSTOMERS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_ROADMAP,
  INITIAL_IDEAS_VAULT,
  INITIAL_WEEKLY_FOCUS,
  INITIAL_BUGS,
  INITIAL_CHANGELOG,
  INITIAL_KNOWLEDGE,
  INITIAL_COMPETITORS,
  INITIAL_ALERTS,
  INITIAL_AUDIT_LOGS,
  DEFAULT_ORGANIZATION,
  INITIAL_USER,
  DEFAULT_STAGE_CHECKLIST_TEMPLATES,
  INITIAL_FEEDBACKS,
  createDefaultCustomerOnboardingSteps,
  createDefaultLeadSalesSteps,
} from '../data/defaultData';

export type ActiveNavTab =
  | 'dashboard'
  | 'project-detail'
  | 'portfolio'
  | 'finances'
  | 'customers'
  | 'feedback'
  | 'settings'
  | 'today'
  | 'thisweek'
  | 'products'
  | 'pipeline'
  | 'tasks'
  | 'roadmaps'
  | 'ideas'
  | 'bugs'
  | 'metrics'
  | 'activity'
  | 'ai';

interface AppContextType {
  // Navigation & UI state
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  selectedProductId: string | null;
  openProductDetail: (id: string, initialSubTab?: string) => void;
  closeProductDetail: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCmdKOpen: boolean;
  setIsCmdKOpen: (open: boolean) => void;

  // Organization & User
  currentOrganization: Organization;
  setOrganizationName: (name: string) => void;
  currentUser: UserProfile;
  setUserRole: (role: UserRole) => void;

  // Products
  products: SaaSProduct[];
  addProduct: (product: Partial<SaaSProduct>) => SaaSProduct;
  updateProduct: (id: string, updates: Partial<SaaSProduct>) => void;
  deleteProduct: (id: string) => void;
  changeProductStage: (id: string, newStage: ProductStage, comment?: string) => void;
  toggleChecklistItem: (productId: string, checklistId: string, itemLabel?: string, stage?: ProductStage) => void;
  updateChecklistItemNote: (productId: string, checklistId: string, notes: string, itemLabel?: string, stage?: ProductStage) => void;
  updateProductBottleneck: (productId: string, bottleneck: BottleneckInfo) => void;
  updateProductHealth: (productId: string, health: Partial<ProductHealthIndicators>) => void;
  updateProductFinancials: (productId: string, financials: Partial<FinancialMetrics>) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'organizationId'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  toggleTaskSubitem: (taskId: string, subitemId: string) => void;

  // CRM Leads
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'organizationId'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  deleteLead: (id: string) => void;

  // CRM Activities
  activities: CRMActivity[];
  addActivity: (activity: Omit<CRMActivity, 'id' | 'organizationId'>) => void;

  // Customers & Subscriptions
  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id' | 'organizationId'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  subscriptions: Subscription[];
  addSubscription: (sub: Omit<Subscription, 'id' | 'organizationId'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;

  // Roadmaps
  roadmapItems: RoadmapItem[];
  addRoadmapItem: (item: Omit<RoadmapItem, 'id' | 'organizationId'>) => void;
  updateRoadmapItem: (id: string, updates: Partial<RoadmapItem>) => void;
  deleteRoadmapItem: (id: string) => void;

  // Idea Vault
  ideas: IdeaItem[];
  addIdea: (idea: Omit<IdeaItem, 'id' | 'createdAt' | 'organizationId'>) => void;
  updateIdea: (id: string, updates: Partial<IdeaItem>) => void;
  deleteIdea: (id: string) => void;
  promoteIdeaToProduct: (ideaId: string) => SaaSProduct;

  // Bugs
  bugs: BugItem[];
  addBug: (bug: Omit<BugItem, 'id' | 'organizationId'>) => void;
  updateBug: (id: string, updates: Partial<BugItem>) => void;
  deleteBug: (id: string) => void;

  // Changelogs
  changelogs: ChangelogEntry[];
  addChangelog: (entry: Omit<ChangelogEntry, 'id' | 'organizationId'>) => void;
  deleteChangelog: (id: string) => void;

  // Knowledge Docs
  knowledgeDocs: KnowledgeDoc[];
  addKnowledgeDoc: (doc: Omit<KnowledgeDoc, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>) => void;
  updateKnowledgeDoc: (id: string, updates: Partial<KnowledgeDoc>) => void;
  deleteKnowledgeDoc: (id: string) => void;

  // Competitors
  competitors: CompetitorItem[];
  addCompetitor: (comp: Omit<CompetitorItem, 'id' | 'organizationId'>) => void;
  updateCompetitor: (id: string, updates: Partial<CompetitorItem>) => void;
  deleteCompetitor: (id: string) => void;

  // Internal Alerts
  alerts: InternalAlert[];
  dismissAlert: (id: string) => void;

  // Audit Logs
  auditLogs: AuditActivityLog[];
  logAuditEvent: (
    entity: AuditActivityLog['entity'],
    entityId: string,
    action: AuditActivityLog['action'],
    description: string,
    metadata?: Record<string, any>
  ) => void;

  // Weekly Focus
  weeklyFocus: WeeklyFocus;
  updateWeeklyFocus: (focus: Partial<WeeklyFocus>) => void;
  toggleWeeklyFocusComplete: () => void;

  // Supabase & Persistence
  supabaseConfig: SupabaseConfig;
  updateSupabaseConfig: (config: Partial<SupabaseConfig>) => void;
  testSupabaseConnection: () => Promise<boolean>;
  resetToDefaults: () => void;
  exportBackupJSON: () => string;
  importBackupJSON: (jsonStr: string) => boolean;

  // Feedback & Mejoras unificadas
  feedbacks: SaaSFeedback[];
  addFeedback: (fb: Omit<SaaSFeedback, 'id' | 'organizationId' | 'createdAt'>) => void;
  updateFeedback: (id: string, updates: Partial<SaaSFeedback>) => void;
  deleteFeedback: (id: string) => void;

  // Acciones Rápidas Simplificadas
  importLeadsBatch: (leadsText: string, targetProductId: string) => number;
  convertLeadToCustomer: (
    leadId: string,
    planName: string,
    monthlyPrice: number,
    usersCount?: number,
    contractStartDate?: string,
    billingDay?: number
  ) => void;
  updateProductFinancialsQuick: (productId: string, mrr: number, monthlyCosts: number) => void;
  changeProductStageQuick: (productId: string, newStage: ProductStage) => void;
  selectProject: (id: string) => void;
  addTaskWithPriority: (title: string, productId: string, priorityScore: number, description?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'saas_command_center_state_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);

  // Keyboard shortcut listener for CMD+K / CTRL+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdKOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCmdKOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Organization & User State
  const [currentOrganization, setCurrentOrganization] = useState<Organization>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_org`);
      return stored ? JSON.parse(stored) : DEFAULT_ORGANIZATION;
    } catch {
      return DEFAULT_ORGANIZATION;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_user`);
      return stored ? JSON.parse(stored) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Core Data States
  const [products, setProducts] = useState<SaaSProduct[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_products`);
      if (stored) {
        const parsed: SaaSProduct[] = JSON.parse(stored);
        return parsed.map((p) => {
          const init = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
          if (init) {
            const isOldGestify = p.id === 'prod-gestify' && (!p.targetAudience || p.category?.includes('Finanzas'));
            return {
              ...init,
              ...p,
              description: isOldGestify ? init.description : p.description,
              shortDescription: isOldGestify ? init.shortDescription : p.shortDescription,
              category: isOldGestify ? init.category : p.category,
              targetAudience: p.targetAudience || init.targetAudience,
              targetSearchKeywords: p.targetSearchKeywords || init.targetSearchKeywords,
              idealCustomerProfile: p.idealCustomerProfile || init.idealCustomerProfile,
              activeModules: p.activeModules && p.activeModules.length > 0 ? p.activeModules : init.activeModules,
              futureModules: p.futureModules && p.futureModules.length > 0 ? p.futureModules : init.futureModules,
              pricingPlans: p.pricingPlans && p.pricingPlans.length > 0 ? p.pricingPlans : init.pricingPlans,
              infrastructureVault: p.infrastructureVault || init.infrastructureVault,
            };
          }
          return p;
        });
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_tasks`);
      return stored ? JSON.parse(stored) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_leads`);
      if (!stored) return INITIAL_LEADS;
      const parsed: Lead[] = JSON.parse(stored);
      return parsed.map((l) => ({
        ...l,
        processSteps: l.processSteps && l.processSteps.length > 0 ? l.processSteps : createDefaultLeadSalesSteps(),
      }));
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [activities, setActivities] = useState<CRMActivity[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_activities`);
      return stored ? JSON.parse(stored) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_customers`);
      if (!stored) return INITIAL_CUSTOMERS;
      const parsed: Customer[] = JSON.parse(stored);
      return parsed.map((c) => ({
        ...c,
        processSteps: c.processSteps && c.processSteps.length > 0 ? c.processSteps : createDefaultCustomerOnboardingSteps(),
      }));
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_subscriptions`);
      return stored ? JSON.parse(stored) : INITIAL_SUBSCRIPTIONS;
    } catch {
      return INITIAL_SUBSCRIPTIONS;
    }
  });

  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_roadmap`);
      return stored ? JSON.parse(stored) : INITIAL_ROADMAP;
    } catch {
      return INITIAL_ROADMAP;
    }
  });

  const [ideas, setIdeas] = useState<IdeaItem[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_ideas`);
      return stored ? JSON.parse(stored) : INITIAL_IDEAS_VAULT;
    } catch {
      return INITIAL_IDEAS_VAULT;
    }
  });

  const [bugs, setBugs] = useState<BugItem[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_bugs`);
      return stored ? JSON.parse(stored) : INITIAL_BUGS;
    } catch {
      return INITIAL_BUGS;
    }
  });

  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_changelogs`);
      return stored ? JSON.parse(stored) : INITIAL_CHANGELOG;
    } catch {
      return INITIAL_CHANGELOG;
    }
  });

  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDoc[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_knowledge`);
      return stored ? JSON.parse(stored) : INITIAL_KNOWLEDGE;
    } catch {
      return INITIAL_KNOWLEDGE;
    }
  });

  const [competitors, setCompetitors] = useState<CompetitorItem[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_competitors`);
      return stored ? JSON.parse(stored) : INITIAL_COMPETITORS;
    } catch {
      return INITIAL_COMPETITORS;
    }
  });

  const [alerts, setAlerts] = useState<InternalAlert[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_alerts`);
      return stored ? JSON.parse(stored) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditActivityLog[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_audit`);
      return stored ? JSON.parse(stored) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [weeklyFocus, setWeeklyFocus] = useState<WeeklyFocus>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_weeklyFocus`);
      return stored ? JSON.parse(stored) : INITIAL_WEEKLY_FOCUS;
    } catch {
      return INITIAL_WEEKLY_FOCUS;
    }
  });

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_supabase`);
      return stored ? JSON.parse(stored) : { url: '', anonKey: '', isConnected: false };
    } catch {
      return { url: '', anonKey: '', isConnected: false };
    }
  });

  const [feedbacks, setFeedbacks] = useState<SaaSFeedback[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_feedbacks`);
      return stored ? JSON.parse(stored) : INITIAL_FEEDBACKS;
    } catch {
      return INITIAL_FEEDBACKS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_org`, JSON.stringify(currentOrganization));
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${STORAGE_KEY}_leads`, JSON.stringify(leads));
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
      localStorage.setItem(`${STORAGE_KEY}_customers`, JSON.stringify(customers));
      localStorage.setItem(`${STORAGE_KEY}_subscriptions`, JSON.stringify(subscriptions));
      localStorage.setItem(`${STORAGE_KEY}_roadmap`, JSON.stringify(roadmapItems));
      localStorage.setItem(`${STORAGE_KEY}_ideas`, JSON.stringify(ideas));
      localStorage.setItem(`${STORAGE_KEY}_bugs`, JSON.stringify(bugs));
      localStorage.setItem(`${STORAGE_KEY}_changelogs`, JSON.stringify(changelogs));
      localStorage.setItem(`${STORAGE_KEY}_knowledge`, JSON.stringify(knowledgeDocs));
      localStorage.setItem(`${STORAGE_KEY}_competitors`, JSON.stringify(competitors));
      localStorage.setItem(`${STORAGE_KEY}_alerts`, JSON.stringify(alerts));
      localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY}_weeklyFocus`, JSON.stringify(weeklyFocus));
      localStorage.setItem(`${STORAGE_KEY}_supabase`, JSON.stringify(supabaseConfig));
      localStorage.setItem(`${STORAGE_KEY}_feedbacks`, JSON.stringify(feedbacks));
    } catch (e) {
      console.error('Failed to sync to localStorage', e);
    }
  }, [
    currentOrganization,
    currentUser,
    products,
    tasks,
    leads,
    activities,
    customers,
    subscriptions,
    roadmapItems,
    ideas,
    bugs,
    changelogs,
    knowledgeDocs,
    competitors,
    alerts,
    auditLogs,
    weeklyFocus,
    supabaseConfig,
    feedbacks,
  ]);

  // Auditor helper
  const logAuditEvent = (
    entity: AuditActivityLog['entity'],
    entityId: string,
    action: AuditActivityLog['action'],
    description: string,
    metadata?: Record<string, any>
  ) => {
    const newLog: AuditActivityLog = {
      id: `log-${Date.now()}`,
      organizationId: currentOrganization.id,
      user: currentUser.name,
      entity,
      entityId,
      action,
      description,
      timestamp: new Date().toISOString(),
      metadata,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const setOrganizationName = (name: string) => {
    setCurrentOrganization((prev) => ({ ...prev, name }));
    logAuditEvent('auth', currentOrganization.id, 'update', `Organización renombrada a "${name}"`);
  };

  const setUserRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
    logAuditEvent('auth', currentUser.id, 'update', `Rol de usuario cambiado a ${role}`);
  };

  // Product Actions
  const addProduct = (prodData: Partial<SaaSProduct>): SaaSProduct => {
    const stage: ProductStage = prodData.currentStage || 'IDEA';
    const templates = DEFAULT_STAGE_CHECKLIST_TEMPLATES[stage] || [];
    const initialChecklists = templates.map((label, i) => ({
      id: `chk-${Date.now()}-${i}`,
      stage,
      label,
      completed: false,
      requiredForNextStage: true,
    }));

    const baseMrr = prodData.mrr || 0;
    const baseCosts = Math.round(baseMrr * 0.2);
    const nonRec = 100;

    const newProduct: SaaSProduct = {
      id: `prod-${Date.now()}`,
      organizationId: currentOrganization.id,
      name: prodData.name || 'Nuevo SaaS',
      shortDescription: prodData.shortDescription || 'Descripción breve del producto',
      description: prodData.description || 'Descripción detallada del modelo y propuesta de valor.',
      category: prodData.category || 'General',
      status: prodData.status || 'saludable',
      currentStage: stage,
      priority: prodData.priority || 'Media',
      nextAction: prodData.nextAction || 'Definir propuesta de valor y validar con primeros usuarios.',
      businessModel: prodData.businessModel || 'SaaS B2B Mensual',
      priceDetail: prodData.priceDetail || '$49/mes base',
      mrr: baseMrr,
      arr: baseMrr * 12,
      activeClientsCount: prodData.activeClientsCount || 0,
      activeUsersCount: prodData.activeUsersCount || 0,
      currency: 'USD',
      financials: {
        mrr: baseMrr,
        arr: baseMrr * 12,
        nonRecurringMonthly: nonRec,
        monthlyCosts: baseCosts,
        monthlyRevenue: baseMrr + nonRec,
        annualRevenue: (baseMrr + nonRec) * 12,
        estimatedProfitMonthly: baseMrr + nonRec - baseCosts,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      createdAt: new Date().toISOString().split('T')[0],
      owner: currentUser.name,
      lastActivityDate: new Date().toISOString().split('T')[0],
      websiteUrl: prodData.websiteUrl || '',
      productionUrl: prodData.productionUrl || '',
      stagingUrl: prodData.stagingUrl || '',
      repoUrl: prodData.repoUrl || '',
      health: prodData.health || {
        producto: 50,
        tecnologia: 50,
        marketing: 30,
        ventas: 30,
        clientes: 20,
        finanzas: 40,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      bottleneck: prodData.bottleneck || {
        category: 'Desarrollo',
        description: 'Construir el MVP funcional.',
        recommendedAction: 'Establecer sprint de 2 semanas enfocado en el core value.',
        severity: 'alto',
        identifiedAt: new Date().toISOString().split('T')[0],
      },
      stageChecklists: initialChecklists,
      stageHistory: [
        {
          id: `hist-${Date.now()}`,
          previousStage: 'IDEA',
          newStage: stage,
          changedAt: new Date().toISOString().split('T')[0],
          changedBy: currentUser.name,
          comment: 'Creación inicial del producto en el Command Center.',
        },
      ],
    };

    setProducts((prev) => [newProduct, ...prev]);

    logAuditEvent('product', newProduct.id, 'create', `Nuevo producto creado: ${newProduct.name} en etapa ${stage}`);

    addActivity({
      productId: newProduct.id,
      type: 'Nota',
      userName: currentUser.name,
      contactName: newProduct.name,
      description: `Nuevo producto SaaS creado: "${newProduct.name}" en etapa ${stage}.`,
      date: new Date().toISOString(),
    });

    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<SaaSProduct>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates, lastActivityDate: new Date().toISOString().split('T')[0] };
          if (updates.mrr !== undefined) {
            updated.arr = updates.mrr * 12;
            updated.financials = {
              ...updated.financials,
              mrr: updates.mrr,
              arr: updates.mrr * 12,
              monthlyRevenue: updates.mrr + updated.financials.nonRecurringMonthly,
              annualRevenue: (updates.mrr + updated.financials.nonRecurringMonthly) * 12,
              estimatedProfitMonthly:
                updates.mrr + updated.financials.nonRecurringMonthly - updated.financials.monthlyCosts,
            };
          }
          return updated;
        }
        return p;
      })
    );
    logAuditEvent('product', id, 'update', `Producto ${id} actualizado`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    logAuditEvent('product', id, 'delete', `Producto ${id} eliminado`);
  };

  const changeProductStage = (id: string, newStage: ProductStage, comment?: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id && p.currentStage !== newStage) {
          const prevStage = p.currentStage;
          const newHistoryEntry = {
            id: `hist-${Date.now()}`,
            previousStage: prevStage,
            newStage,
            changedAt: new Date().toISOString().split('T')[0],
            changedBy: currentUser.name,
            comment: comment || `Etapa avanzada a ${newStage}`,
          };

          const hasChecklistForNewStage = p.stageChecklists.some((chk) => chk.stage === newStage);
          let updatedChecklists = [...p.stageChecklists];
          if (!hasChecklistForNewStage) {
            const templates = DEFAULT_STAGE_CHECKLIST_TEMPLATES[newStage] || [];
            const newStageChecklistItems = templates.map((label, idx) => ({
              id: `chk-${newStage}-${Date.now()}-${idx}`,
              stage: newStage,
              label,
              completed: false,
              requiredForNextStage: true,
            }));
            updatedChecklists = [...updatedChecklists, ...newStageChecklistItems];
          }

          if (['LANZAMIENTO', 'PRIMEROS CLIENTES', 'MONETIZACIÓN', 'CRECIMIENTO'].includes(newStage)) {
            try {
              confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            } catch {
              // fallback
            }
          }

          logAuditEvent('stage', p.id, 'stage_change', `${p.name} cambió de ${prevStage} a ${newStage}`);

          return {
            ...p,
            currentStage: newStage,
            stageChecklists: updatedChecklists,
            stageHistory: [newHistoryEntry, ...p.stageHistory],
            lastActivityDate: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
  };

  const toggleChecklistItem = (
    productId: string,
    checklistId: string,
    itemLabel?: string,
    stage?: ProductStage
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentList = p.stageChecklists || [];
          const exists = currentList.some((chk) => chk.id === checklistId);
          let updatedList: StageChecklistItem[];

          if (exists) {
            updatedList = currentList.map((chk) =>
              chk.id === checklistId ? { ...chk, completed: !chk.completed } : chk
            );
          } else {
            updatedList = [
              ...currentList,
              {
                id: checklistId,
                stage: stage || p.currentStage,
                label: itemLabel || 'Hito de etapa',
                completed: true,
                requiredForNextStage: true,
              },
            ];
          }

          return {
            ...p,
            stageChecklists: updatedList,
            lastActivityDate: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
  };

  const updateChecklistItemNote = (
    productId: string,
    checklistId: string,
    notes: string,
    itemLabel?: string,
    stage?: ProductStage
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentList = p.stageChecklists || [];
          const exists = currentList.some((chk) => chk.id === checklistId);
          let updatedList: StageChecklistItem[];

          if (exists) {
            updatedList = currentList.map((chk) =>
              chk.id === checklistId
                ? { ...chk, notes, updatedAt: new Date().toISOString() }
                : chk
            );
          } else {
            updatedList = [
              ...currentList,
              {
                id: checklistId,
                stage: stage || p.currentStage,
                label: itemLabel || 'Hito de etapa',
                completed: false,
                requiredForNextStage: true,
                notes,
                updatedAt: new Date().toISOString(),
              },
            ];
          }

          return {
            ...p,
            stageChecklists: updatedList,
            lastActivityDate: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
  };

  const updateProductBottleneck = (productId: string, bottleneck: BottleneckInfo) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, bottleneck, lastActivityDate: new Date().toISOString().split('T')[0] }
          : p
      )
    );
    logAuditEvent('product', productId, 'update', `Cuello de botella actualizado: ${bottleneck.category}`);
  };

  const updateProductHealth = (productId: string, healthUpdates: Partial<ProductHealthIndicators>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            health: {
              ...p.health,
              ...healthUpdates,
              lastUpdated: new Date().toISOString().split('T')[0],
            },
            lastActivityDate: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
  };

  const updateProductFinancials = (productId: string, financialsUpdates: Partial<FinancialMetrics>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedFinancials = { ...p.financials, ...financialsUpdates, lastUpdated: new Date().toISOString().split('T')[0] };
          const mrr = updatedFinancials.mrr;
          const nonRec = updatedFinancials.nonRecurringMonthly;
          const costs = updatedFinancials.monthlyCosts;
          updatedFinancials.monthlyRevenue = mrr + nonRec;
          updatedFinancials.arr = mrr * 12;
          updatedFinancials.annualRevenue = (mrr + nonRec) * 12;
          updatedFinancials.estimatedProfitMonthly = mrr + nonRec - costs;

          return {
            ...p,
            mrr,
            arr: mrr * 12,
            financials: updatedFinancials,
            lastActivityDate: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
    logAuditEvent('product', productId, 'update', 'Métricas financieras actualizadas');
  };

  // Task Actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'organizationId'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      organizationId: currentOrganization.id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    logAuditEvent('task', newTask.id, 'create', `Tarea creada: ${newTask.title}`);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    logAuditEvent('task', id, 'update', `Tarea ${id} actualizada`);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    logAuditEvent('task', id, 'delete', `Tarea ${id} eliminada`);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isNowCompleted = t.status !== 'Completada';
          const updated = {
            ...t,
            status: (isNowCompleted ? 'Completada' : 'Pendiente') as TaskStatus,
            completedAt: isNowCompleted ? new Date().toISOString().split('T')[0] : undefined,
          };
          logAuditEvent('task', id, 'status_change', `Tarea "${t.title}" marcada como ${updated.status}`);
          return updated;
        }
        return t;
      })
    );
  };

  const toggleTaskSubitem = (taskId: string, subitemId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            checklist: t.checklist.map((sub) =>
              sub.id === subitemId ? { ...sub, completed: !sub.completed } : sub
            ),
          };
        }
        return t;
      })
    );
  };

  // CRM Leads
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'organizationId'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      organizationId: currentOrganization.id,
      createdAt: new Date().toISOString().split('T')[0],
      inSalesPipeline: leadData.inSalesPipeline ?? false,
      processSteps: leadData.processSteps || createDefaultLeadSalesSteps(),
    };
    setLeads((prev) => [newLead, ...prev]);
    logAuditEvent('lead', newLead.id, 'create', `Prospecto registrado: ${newLead.name}`);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          if (status === 'CLIENTE') {
            try {
              confetti({ particleCount: 70, spread: 60 });
            } catch {
              // ignore
            }
          }
          logAuditEvent('lead', id, 'status_change', `Lead "${l.name}" movido a ${status}`);
          return { ...l, status };
        }
        return l;
      })
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // Activities
  const addActivity = (actData: Omit<CRMActivity, 'id' | 'organizationId'>) => {
    const newAct: CRMActivity = {
      ...actData,
      id: `act-${Date.now()}`,
      organizationId: currentOrganization.id,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Customers & Subscriptions
  const addCustomer = (custData: Omit<Customer, 'id' | 'organizationId'>) => {
    const newCust: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      organizationId: currentOrganization.id,
      processSteps: custData.processSteps || createDefaultCustomerOnboardingSteps(),
    };
    setCustomers((prev) => [newCust, ...prev]);
    logAuditEvent('customer', newCust.id, 'create', `Cliente creado: ${newCust.name}`);

    // Si tiene productos asignados, actualizar estadísticas del producto
    if (newCust.productIds && newCust.productIds.length > 0) {
      setProducts((prev) =>
        prev.map((p) => {
          if (newCust.productIds.includes(p.id)) {
            const addedUsers = newCust.usersCount || 0;
            const addedMrr = newCust.mrr || 0;
            const newMrr = (p.mrr || 0) + addedMrr;
            return {
              ...p,
              activeClientsCount: (p.activeClientsCount || 0) + 1,
              activeUsersCount: (p.activeUsersCount || 0) + addedUsers,
              mrr: newMrr,
              financials: {
                ...p.financials,
                mrr: newMrr,
                monthlyRevenue: newMrr + (p.financials?.nonRecurringMonthly || 0),
                annualRevenue: (newMrr + (p.financials?.nonRecurringMonthly || 0)) * 12,
                estimatedProfitMonthly: newMrr - (p.financials?.monthlyCosts || 0),
              },
            };
          }
          return p;
        })
      );
    }
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setSubscriptions((prev) => prev.filter((s) => s.customerId !== id));
  };

  const addSubscription = (subData: Omit<Subscription, 'id' | 'organizationId'>) => {
    const newSub: Subscription = {
      ...subData,
      id: `sub-${Date.now()}`,
      organizationId: currentOrganization.id,
    };
    setSubscriptions((prev) => [newSub, ...prev]);
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  // Roadmap
  const addRoadmapItem = (itemData: Omit<RoadmapItem, 'id' | 'organizationId'>) => {
    const newItem: RoadmapItem = {
      ...itemData,
      id: `road-${Date.now()}`,
      organizationId: currentOrganization.id,
    };
    setRoadmapItems((prev) => [newItem, ...prev]);
    logAuditEvent('milestone', newItem.id, 'create', `Hito de roadmap creado: ${newItem.title}`);
  };

  const updateRoadmapItem = (id: string, updates: Partial<RoadmapItem>) => {
    setRoadmapItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteRoadmapItem = (id: string) => {
    setRoadmapItems((prev) => prev.filter((r) => r.id !== id));
  };

  // Idea Vault
  const addIdea = (ideaData: Omit<IdeaItem, 'id' | 'createdAt' | 'organizationId'>) => {
    const newIdea: IdeaItem = {
      ...ideaData,
      id: `idea-${Date.now()}`,
      organizationId: currentOrganization.id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setIdeas((prev) => [newIdea, ...prev]);
    logAuditEvent('idea', newIdea.id, 'create', `Idea registrada en Idea Vault: ${newIdea.title}`);
  };

  const updateIdea = (id: string, updates: Partial<IdeaItem>) => {
    setIdeas((prev) => prev.map((idea) => (idea.id === id ? { ...idea, ...updates } : idea)));
  };

  const deleteIdea = (id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  };

  const promoteIdeaToProduct = (ideaId: string): SaaSProduct => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) throw new Error('Idea no encontrada');

    const createdProduct = addProduct({
      name: idea.title.split(':')[0].trim(),
      shortDescription: idea.problem,
      description: `${idea.description}\n\nSolución: ${idea.solution}\n\nPúblico Objetivo: ${idea.targetAudience}`,
      category: idea.category,
      currentStage: 'IDEA',
      priority: 'Alta',
    });

    updateIdea(ideaId, {
      status: 'MVP',
      convertedProductId: createdProduct.id,
    });

    logAuditEvent('idea', ideaId, 'update', `Idea "${idea.title}" promovida a producto SaaS`);

    return createdProduct;
  };

  // Bugs
  const addBug = (bugData: Omit<BugItem, 'id' | 'organizationId'>) => {
    const newBug: BugItem = {
      ...bugData,
      id: `bug-${Date.now()}`,
      organizationId: currentOrganization.id,
    };
    setBugs((prev) => [newBug, ...prev]);
    logAuditEvent('bug', newBug.id, 'create', `Bug reportado: ${newBug.title}`);
  };

  const updateBug = (id: string, updates: Partial<BugItem>) => {
    setBugs((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    logAuditEvent('bug', id, 'update', `Bug ${id} modificado`);
  };

  const deleteBug = (id: string) => {
    setBugs((prev) => prev.filter((b) => b.id !== id));
  };

  // Changelogs
  const addChangelog = (entryData: Omit<ChangelogEntry, 'id' | 'organizationId'>) => {
    const newEntry: ChangelogEntry = {
      ...entryData,
      id: `ch-${Date.now()}`,
      organizationId: currentOrganization.id,
    };
    setChangelogs((prev) => [newEntry, ...prev]);
    logAuditEvent('product', entryData.productId, 'version_published', `Changelog ${entryData.version}: ${entryData.change}`);
  };

  const deleteChangelog = (id: string) => {
    setChangelogs((prev) => prev.filter((c) => c.id !== id));
  };

  // Knowledge Docs
  const addKnowledgeDoc = (docData: Omit<KnowledgeDoc, 'id' | 'createdAt' | 'updatedAt' | 'organizationId'>) => {
    const newDoc: KnowledgeDoc = {
      ...docData,
      id: `doc-${Date.now()}`,
      organizationId: currentOrganization.id,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setKnowledgeDocs((prev) => [newDoc, ...prev]);
    logAuditEvent('doc', newDoc.id, 'create', `Documento Knowledge creado: ${newDoc.title}`);
  };

  const updateKnowledgeDoc = (id: string, updates: Partial<KnowledgeDoc>) => {
    setKnowledgeDocs((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : d
      )
    );
  };

  const deleteKnowledgeDoc = (id: string) => {
    setKnowledgeDocs((prev) => prev.filter((d) => d.id !== id));
  };

  // Competitors
  const addCompetitor = (compData: Omit<CompetitorItem, 'id' | 'organizationId'>) => {
    const newComp: CompetitorItem = {
      ...compData,
      id: `comp-${Date.now()}`,
      organizationId: currentOrganization.id,
    };
    setCompetitors((prev) => [newComp, ...prev]);
    logAuditEvent('product', compData.productId, 'create', `Competidor registrado: ${newComp.name}`);
  };

  const updateCompetitor = (id: string, updates: Partial<CompetitorItem>) => {
    setCompetitors((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCompetitor = (id: string) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
  };

  // Internal Alerts
  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, dismissed: true } : a)));
  };

  // Weekly Focus
  const updateWeeklyFocus = (focusUpdates: Partial<WeeklyFocus>) => {
    setWeeklyFocus((prev) => ({ ...prev, ...focusUpdates }));
  };

  const toggleWeeklyFocusComplete = () => {
    setWeeklyFocus((prev) => {
      const isNowCompleted = !prev.isCompleted;
      if (isNowCompleted) {
        try {
          confetti({ particleCount: 60, spread: 50 });
        } catch {
          // ignore
        }
      }
      return {
        ...prev,
        isCompleted: isNowCompleted,
        completedAt: isNowCompleted ? new Date().toISOString().split('T')[0] : undefined,
      };
    });
  };

  // Supabase Config
  const updateSupabaseConfig = (config: Partial<SupabaseConfig>) => {
    setSupabaseConfig((prev) => ({ ...prev, ...config }));
  };

  const testSupabaseConnection = async (): Promise<boolean> => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      setSupabaseConfig((prev) => ({ ...prev, isConnected: false }));
      return false;
    }
    try {
      const res = await fetch(`${supabaseConfig.url.replace(/\/$/, '')}/rest/v1/`, {
        headers: {
          apikey: supabaseConfig.anonKey,
          Authorization: `Bearer ${supabaseConfig.anonKey}`,
        },
      });
      const success = res.status < 500;
      setSupabaseConfig((prev) => ({
        ...prev,
        isConnected: success,
        lastTestedAt: new Date().toLocaleTimeString(),
      }));
      return success;
    } catch {
      const success = supabaseConfig.url.includes('supabase.co');
      setSupabaseConfig((prev) => ({
        ...prev,
        isConnected: success,
        lastTestedAt: new Date().toLocaleTimeString(),
      }));
      return success;
    }
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setTasks(INITIAL_TASKS);
    setLeads(INITIAL_LEADS);
    setActivities(INITIAL_ACTIVITIES);
    setCustomers(INITIAL_CUSTOMERS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setRoadmapItems(INITIAL_ROADMAP);
    setIdeas(INITIAL_IDEAS_VAULT);
    setBugs(INITIAL_BUGS);
    setChangelogs(INITIAL_CHANGELOG);
    setKnowledgeDocs(INITIAL_KNOWLEDGE);
    setCompetitors(INITIAL_COMPETITORS);
    setAlerts(INITIAL_ALERTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setWeeklyFocus(INITIAL_WEEKLY_FOCUS);
    setCurrentOrganization(DEFAULT_ORGANIZATION);
    setCurrentUser(INITIAL_USER);
    localStorage.clear();
  };

  const exportBackupJSON = (): string => {
    const backup = {
      exportedAt: new Date().toISOString(),
      organization: currentOrganization,
      user: currentUser,
      products,
      tasks,
      leads,
      activities,
      customers,
      subscriptions,
      roadmapItems,
      ideas,
      bugs,
      changelogs,
      knowledgeDocs,
      competitors,
      alerts,
      auditLogs,
      weeklyFocus,
    };
    return JSON.stringify(backup, null, 2);
  };

  const importBackupJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.organization) setCurrentOrganization(parsed.organization);
      if (parsed.user) setCurrentUser(parsed.user);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.tasks) setTasks(parsed.tasks);
      if (parsed.leads) setLeads(parsed.leads);
      if (parsed.activities) setActivities(parsed.activities);
      if (parsed.customers) setCustomers(parsed.customers);
      if (parsed.subscriptions) setSubscriptions(parsed.subscriptions);
      if (parsed.roadmapItems) setRoadmapItems(parsed.roadmapItems);
      if (parsed.ideas) setIdeas(parsed.ideas);
      if (parsed.bugs) setBugs(parsed.bugs);
      if (parsed.changelogs) setChangelogs(parsed.changelogs);
      if (parsed.knowledgeDocs) setKnowledgeDocs(parsed.knowledgeDocs);
      if (parsed.competitors) setCompetitors(parsed.competitors);
      if (parsed.alerts) setAlerts(parsed.alerts);
      if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      if (parsed.weeklyFocus) setWeeklyFocus(parsed.weeklyFocus);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const openProductDetail = (id: string, initialSubTab?: string) => {
    setSelectedProductId(id);
    if (initialSubTab) {
      // modal subtab handling
    }
  };

  const closeProductDetail = () => {
    setSelectedProductId(null);
  };

  // Feedback Methods
  const addFeedback = (fb: Omit<SaaSFeedback, 'id' | 'organizationId' | 'createdAt'>) => {
    const newFb: SaaSFeedback = {
      ...fb,
      id: `fb-${Date.now()}`,
      organizationId: currentOrganization.id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setFeedbacks((prev) => [newFb, ...prev]);
  };

  const updateFeedback = (id: string, updates: Partial<SaaSFeedback>) => {
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : f
      )
    );
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
  };

  // Import Leads Batch (Pegar lista rápida de prospectos)
  const importLeadsBatch = (leadsText: string, targetProductId: string): number => {
    if (!leadsText.trim()) return 0;
    const lines = leadsText.split('\n').map((l) => l.trim()).filter(Boolean);
    const newLeads: Lead[] = [];
    const today = new Date().toISOString().split('T')[0];

    lines.forEach((line, index) => {
      const parts = line.includes('\t')
        ? line.split('\t').map((p) => p.trim())
        : line.includes(',')
        ? line.split(',').map((p) => p.trim())
        : [line];

      const name = parts[0] || `Prospecto ${Date.now() + index}`;
      const company = parts[1] || '';
      const contactInfo = parts[2] || '';
      const notes = parts.slice(3).join(' - ');

      const isEmail = contactInfo.includes('@');
      const email = isEmail ? contactInfo : '';
      const phone = !isEmail ? contactInfo : '';

      newLeads.push({
        id: `lead-imp-${Date.now()}-${index}`,
        organizationId: currentOrganization.id,
        name,
        institutionOrCompany: company || name,
        email,
        phone,
        whatsapp: phone.replace(/[^0-9]/g, ''),
        productId: targetProductId,
        origin: 'Lista Rápida Pegada',
        status: 'LEAD',
        responsible: currentUser.name,
        contactDate: today,
        nextFollowUpDate: today,
        estimatedValue: 150,
        notes: notes || 'Prospecto importado desde lista rápida',
        createdAt: today,
      });
    });

    if (newLeads.length > 0) {
      setLeads((prev) => [...newLeads, ...prev]);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      } catch {}
    }
    return newLeads.length;
  };

  // Convert Lead to Customer
  const convertLeadToCustomer = (
    leadId: string,
    planName: string,
    monthlyPrice: number,
    usersCount?: number,
    contractStartDate?: string,
    billingDay?: number
  ) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const today = new Date().toISOString().split('T')[0];
    const customerId = `cust-${Date.now()}`;
    const addedUsers = usersCount && usersCount > 0 ? usersCount : 10;

    const newCust: Customer = {
      id: customerId,
      organizationId: currentOrganization.id,
      name: lead.name,
      company: lead.institutionOrCompany || lead.name,
      contactPerson: lead.name,
      email: lead.email,
      phone: lead.phone,
      whatsapp: lead.whatsapp || lead.phone,
      city: lead.city || 'Santo Domingo',
      usersCount: addedUsers,
      productIds: [lead.productId],
      plan: planName || 'Plan Estándar',
      startDate: contractStartDate || today,
      contractStartDate: contractStartDate || today,
      billingDay: billingDay || 5,
      status: 'Activo',
      mrr: monthlyPrice,
      notes: `Convertido desde prospecto: ${lead.notes}`,
      processSteps: createDefaultCustomerOnboardingSteps(),
    };

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      organizationId: currentOrganization.id,
      customerId,
      productId: lead.productId,
      planName: planName || 'Plan Estándar',
      price: monthlyPrice,
      frequency: 'mensual',
      startDate: today,
      renewalDate: today,
      status: 'Activa',
    };

    setCustomers((prev) => [newCust, ...prev]);
    setSubscriptions((prev) => [newSub, ...prev]);
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'CLIENTE' as LeadStatus } : l))
    );

    // Sumar MRR, usuarios y cliente al producto
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === lead.productId) {
          const newMrr = (p.mrr || 0) + monthlyPrice;
          return {
            ...p,
            mrr: newMrr,
            activeClientsCount: (p.activeClientsCount || 0) + 1,
            activeUsersCount: (p.activeUsersCount || 0) + addedUsers,
            financials: {
              ...p.financials,
              mrr: newMrr,
              monthlyRevenue: newMrr + (p.financials?.nonRecurringMonthly || 0),
              estimatedProfitMonthly: newMrr - (p.financials?.monthlyCosts || 0),
            },
          };
        }
        return p;
      })
    );

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  // Quick Financials
  const updateProductFinancialsQuick = (productId: string, mrr: number, monthlyCosts: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            mrr,
            financials: {
              ...p.financials,
              mrr,
              arr: mrr * 12,
              monthlyCosts,
              monthlyRevenue: mrr + (p.financials?.nonRecurringMonthly || 0),
              annualRevenue: (mrr + (p.financials?.nonRecurringMonthly || 0)) * 12,
              estimatedProfitMonthly: mrr - monthlyCosts,
              lastUpdated: new Date().toISOString(),
            },
          };
        }
        return p;
      })
    );
  };

  // Quick Stage Change
  const changeProductStageQuick = (productId: string, newStage: ProductStage) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            currentStage: newStage,
            lastActivityDate: new Date().toISOString().split('T')[0],
          };
        }
        return p;
      })
    );
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  // Select Project
  const selectProject = (id: string) => {
    setSelectedProductId(id);
    setActiveTab('project-detail');
  };

  // Add Task With Priority (1-10)
  const addTaskWithPriority = (
    title: string,
    productId: string,
    priorityScore: number,
    description?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const score = Math.min(10, Math.max(1, priorityScore));
    const newTask: Task = {
      id: `task-${Date.now()}`,
      organizationId: currentOrganization.id,
      title: title.trim(),
      description: description?.trim() || '',
      productId,
      priority: score >= 9 ? 'Crítica' : score >= 7 ? 'Alta' : score >= 4 ? 'Media' : 'Baja',
      priorityScore: score,
      status: 'Pendiente',
      responsible: currentUser.name,
      dueDate: today,
      tags: [`Prioridad ${score}`],
      checklist: [],
      comments: [],
      createdAt: today,
    };
    setTasks((prev) => [newTask, ...prev]);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProductId,
        openProductDetail,
        closeProductDetail,
        searchQuery,
        setSearchQuery,
        isCmdKOpen,
        setIsCmdKOpen,
        currentOrganization,
        setOrganizationName,
        currentUser,
        setUserRole,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        changeProductStage,
        toggleChecklistItem,
        updateChecklistItemNote,
        updateProductBottleneck,
        updateProductHealth,
        updateProductFinancials,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        toggleTaskSubitem,
        leads,
        addLead,
        updateLead,
        updateLeadStatus,
        deleteLead,
        activities,
        addActivity,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        subscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        roadmapItems,
        addRoadmapItem,
        updateRoadmapItem,
        deleteRoadmapItem,
        ideas,
        addIdea,
        updateIdea,
        deleteIdea,
        promoteIdeaToProduct,
        bugs,
        addBug,
        updateBug,
        deleteBug,
        changelogs,
        addChangelog,
        deleteChangelog,
        knowledgeDocs,
        addKnowledgeDoc,
        updateKnowledgeDoc,
        deleteKnowledgeDoc,
        competitors,
        addCompetitor,
        updateCompetitor,
        deleteCompetitor,
        alerts,
        dismissAlert,
        auditLogs,
        logAuditEvent,
        weeklyFocus,
        updateWeeklyFocus,
        toggleWeeklyFocusComplete,
        supabaseConfig,
        updateSupabaseConfig,
        testSupabaseConnection,
        resetToDefaults,
        exportBackupJSON,
        importBackupJSON,
        feedbacks,
        addFeedback,
        updateFeedback,
        deleteFeedback,
        importLeadsBatch,
        convertLeadToCustomer,
        updateProductFinancialsQuick,
        changeProductStageQuick,
        selectProject,
        addTaskWithPriority,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
