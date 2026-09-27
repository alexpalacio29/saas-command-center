import React, { useState, useEffect, useMemo } from 'react';
import {
  Rocket,
  DollarSign,
  Users,
  CheckSquare,
  Lightbulb,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Check,
  Building,
  Target,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  MapPin,
  Compass,
  Sparkles,
  Phone,
  Map,
  ChevronDown,
  ChevronUp,
  Building2,
  FileText,
  Save,
  Edit3,
  Globe,
  Search,
  Filter,
  Layers,
  Calendar,
  Bell,
  Navigation,
  X,
  RotateCcw,
  ListChecks,
  CreditCard,
  Clock,
  Eye,
  BookmarkCheck,
  Tag,
  GraduationCap,
  Scissors,
  Church,
  BookOpen,
  Shield,
  Key,
  Copy,
  Server,
  HardDrive,
  Lock,
  Unlock,
  FolderArchive,
  EyeOff,
  Database,
  Mail,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { STAGES_LIST, normalizeStage } from '../portfolio/SimplePortfolioView';
import { ProductStage, Task, BusinessProcessStep, Customer, Lead, ViewedCenter, SaaSProduct, SaaSPricingPlan, SaaSCredential, SaaSInfrastructureVault } from '../../types';
import {
  CANONICAL_STAGE_DEFINITIONS,
  createDefaultCustomerOnboardingSteps,
  createDefaultLeadSalesSteps,
} from '../../data/defaultData';
import {
  getProductTargetAudience,
  getSmartSuggestionsForProductAndCity,
  normalizeCityKey,
  SmartProspectSuggestion,
  TargetAudienceProfile,
} from '../../data/radarDatabase';

const DOMINICAN_CITIES = [
  'Santo Domingo (Distrito Nacional)',
  'Santo Domingo Este',
  'Santo Domingo Oeste',
  'Santo Domingo Norte',
  'Santiago de los Caballeros',
  'La Vega',
  'San Cristóbal',
  'Puerto Plata',
  'San Pedro de Macorís',
  'La Romana',
  'Higüey',
  'Punta Cana / Bávaro',
  'San Francisco de Macorís',
  'Moca (Espaillat)',
  'Bonao (Monseñor Nouel)',
  'Baní (Peravia)',
  'Azua',
  'Barahona',
  'San Juan de la Maguana',
  'Samaná',
  'Las Terrenas',
  'Montecristi',
  'Nagua (María Trinidad Sánchez)',
  'Cotuí (Sánchez Ramírez)',
  'Mao (Valverde)',
  'Dajabón',
  'Salcedo (Hermanas Mirabal)',
  'Neyba (Bahoruco)',
  'Pedernales',
  'Jarabacoa',
  'Constanza',
  'Haina',
  'Boca Chica',
  'Monte Plata',
  'Hato Mayor',
  'El Seibo',
  'Sabana de la Mar',
  'Las Matas de Farfán',
  'Santiago Rodríguez',
  'Jimaní (Independencia)',
  'Elías Piña',
];

const INTERNATIONAL_CITIES = [
  'Miami (EE.UU.)',
  'Orlando (EE.UU.)',
  'Nueva York (EE.UU.)',
  'Madrid (España)',
  'Barcelona (España)',
  'Ciudad de México (México)',
  'Guadalajara (México)',
  'Monterrey (México)',
  'Bogotá (Colombia)',
  'Medellín (Colombia)',
  'Cali (Colombia)',
  'San José (Costa Rica)',
  'Ciudad de Panamá (Panamá)',
  'San Juan (Puerto Rico)',
  'Buenos Aires (Argentina)',
  'Santiago (Chile)',
  'Lima (Perú)',
  'Caracas (Venezuela)',
  'Quito (Ecuador)',
  'Guayaquil (Ecuador)',
  'Montevideo (Uruguay)',
  'Asunción (Paraguay)',
  'Guatemala (Guatemala)',
  'San Salvador (El Salvador)',
  'Tegucigalpa (Honduras)',
  'Managua (Nicaragua)',
  'Sao Paulo (Brasil)',
  'Londres (Reino Unido)',
  'París (Francia)',
  'Roma (Italia)',
  'Toronto (Canadá)',
];

const GLOBAL_CITY_OPTIONS = [...DOMINICAN_CITIES, ...INTERNATIONAL_CITIES];
const CITY_OPTIONS = GLOBAL_CITY_OPTIONS;

interface CenterCoordinates {
  xRD: number;
  yRD: number;
  xWorld: number;
  yWorld: number;
  isRD: boolean;
  regionLabel: string;
}

function resolveCoordinates(cityInput: string = ''): CenterCoordinates {
  const norm = cityInput
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // Diccionario República Dominicana
  if (norm.includes('este') && (norm.includes('santo domingo') || norm.includes('sd'))) {
    return { xRD: 505, yRD: 255, xWorld: 262, yWorld: 186, isRD: true, regionLabel: 'Santo Domingo Este' };
  }
  if (norm.includes('oeste') && (norm.includes('santo domingo') || norm.includes('sd'))) {
    return { xRD: 435, yRD: 255, xWorld: 258, yWorld: 186, isRD: true, regionLabel: 'Santo Domingo Oeste' };
  }
  if (norm.includes('norte') && (norm.includes('santo domingo') || norm.includes('sd'))) {
    return { xRD: 465, yRD: 235, xWorld: 260, yWorld: 185, isRD: true, regionLabel: 'Santo Domingo Norte' };
  }
  if (norm.includes('santo domingo') || norm.includes('distrito') || norm.includes('d.n.') || norm.includes('dn')) {
    return { xRD: 470, yRD: 260, xWorld: 260, yWorld: 186, isRD: true, regionLabel: 'Distrito Nacional / SD' };
  }
  if (norm.includes('santiago') && !norm.includes('chile') && !norm.includes('rodriguez')) {
    return { xRD: 345, yRD: 155, xWorld: 258, yWorld: 183, isRD: true, regionLabel: 'Cibao Central / Santiago' };
  }
  if (norm.includes('la vega') || norm.includes('vega')) {
    return { xRD: 385, yRD: 185, xWorld: 259, yWorld: 184, isRD: true, regionLabel: 'La Vega' };
  }
  if (norm.includes('puerto plata')) {
    return { xRD: 375, yRD: 105, xWorld: 259, yWorld: 181, isRD: true, regionLabel: 'Costa Norte / Puerto Plata' };
  }
  if (norm.includes('punta cana') || norm.includes('bavaro')) {
    return { xRD: 705, yRD: 245, xWorld: 267, yWorld: 186, isRD: true, regionLabel: 'Punta Cana / Bávaro' };
  }
  if (norm.includes('higuey') || norm.includes('altagracia')) {
    return { xRD: 645, yRD: 240, xWorld: 265, yWorld: 186, isRD: true, regionLabel: 'Higüey / La Altagracia' };
  }
  if (norm.includes('romana')) {
    return { xRD: 605, yRD: 265, xWorld: 264, yWorld: 187, isRD: true, regionLabel: 'La Romana' };
  }
  if (norm.includes('san pedro')) {
    return { xRD: 545, yRD: 260, xWorld: 262, yWorld: 187, isRD: true, regionLabel: 'San Pedro de Macorís' };
  }
  if (norm.includes('san cristobal')) {
    return { xRD: 440, yRD: 280, xWorld: 259, yWorld: 187, isRD: true, regionLabel: 'San Cristóbal' };
  }
  if (norm.includes('san francisco') || norm.includes('macoris') || norm.includes('duarte')) {
    return { xRD: 435, yRD: 165, xWorld: 260, yWorld: 183, isRD: true, regionLabel: 'San Francisco de Macorís' };
  }
  if (norm.includes('moca') || norm.includes('espaillat')) {
    return { xRD: 375, yRD: 150, xWorld: 259, yWorld: 183, isRD: true, regionLabel: 'Moca' };
  }
  if (norm.includes('bonao') || norm.includes('monsenor')) {
    return { xRD: 410, yRD: 215, xWorld: 259, yWorld: 185, isRD: true, regionLabel: 'Bonao' };
  }
  if (norm.includes('bani') || norm.includes('peravia')) {
    return { xRD: 415, yRD: 295, xWorld: 259, yWorld: 188, isRD: true, regionLabel: 'Baní' };
  }
  if (norm.includes('azua')) {
    return { xRD: 360, yRD: 275, xWorld: 257, yWorld: 187, isRD: true, regionLabel: 'Azua' };
  }
  if (norm.includes('barahona')) {
    return { xRD: 310, yRD: 315, xWorld: 256, yWorld: 189, isRD: true, regionLabel: 'Barahona' };
  }
  if (norm.includes('san juan')) {
    return { xRD: 270, yRD: 230, xWorld: 255, yWorld: 185, isRD: true, regionLabel: 'San Juan de la Maguana' };
  }
  if (norm.includes('samana') || norm.includes('terrenas')) {
    return { xRD: 540, yRD: 140, xWorld: 263, yWorld: 182, isRD: true, regionLabel: 'Samaná / Las Terrenas' };
  }
  if (norm.includes('montecristi') || norm.includes('monte cristi')) {
    return { xRD: 230, yRD: 115, xWorld: 254, yWorld: 181, isRD: true, regionLabel: 'Montecristi' };
  }
  if (norm.includes('dajabon')) {
    return { xRD: 215, yRD: 155, xWorld: 253, yWorld: 183, isRD: true, regionLabel: 'Dajabón' };
  }
  if (norm.includes('mao') || norm.includes('valverde')) {
    return { xRD: 290, yRD: 145, xWorld: 256, yWorld: 183, isRD: true, regionLabel: 'Mao / Valverde' };
  }
  if (norm.includes('nagua') || norm.includes('trinidad')) {
    return { xRD: 490, yRD: 145, xWorld: 261, yWorld: 183, isRD: true, regionLabel: 'Nagua' };
  }
  if (norm.includes('cotui') || norm.includes('sanchez ramirez')) {
    return { xRD: 445, yRD: 200, xWorld: 260, yWorld: 184, isRD: true, regionLabel: 'Cotuí' };
  }
  if (norm.includes('jarabacoa')) {
    return { xRD: 365, yRD: 200, xWorld: 258, yWorld: 184, isRD: true, regionLabel: 'Jarabacoa' };
  }
  if (norm.includes('constanza')) {
    return { xRD: 360, yRD: 225, xWorld: 258, yWorld: 185, isRD: true, regionLabel: 'Constanza' };
  }
  if (norm.includes('pedernales')) {
    return { xRD: 240, yRD: 365, xWorld: 254, yWorld: 191, isRD: true, regionLabel: 'Pedernales' };
  }
  if (norm.includes('haina')) {
    return { xRD: 450, yRD: 270, xWorld: 259, yWorld: 187, isRD: true, regionLabel: 'Haina' };
  }
  if (norm.includes('boca chica')) {
    return { xRD: 520, yRD: 260, xWorld: 261, yWorld: 187, isRD: true, regionLabel: 'Boca Chica' };
  }

  // Diccionario Internacional
  if (norm.includes('miami') || norm.includes('florida')) {
    return { xRD: 470, yRD: 260, xWorld: 230, yWorld: 155, isRD: false, regionLabel: 'Miami, EE.UU.' };
  }
  if (norm.includes('orlando')) {
    return { xRD: 470, yRD: 260, xWorld: 228, yWorld: 148, isRD: false, regionLabel: 'Orlando, EE.UU.' };
  }
  if (norm.includes('york') || norm.includes('ny')) {
    return { xRD: 470, yRD: 260, xWorld: 260, yWorld: 125, isRD: false, regionLabel: 'Nueva York, EE.UU.' };
  }
  if (norm.includes('madrid')) {
    return { xRD: 470, yRD: 260, xWorld: 435, yWorld: 135, isRD: false, regionLabel: 'Madrid, España' };
  }
  if (norm.includes('barcelona')) {
    return { xRD: 470, yRD: 260, xWorld: 455, yWorld: 132, isRD: false, regionLabel: 'Barcelona, España' };
  }
  if (norm.includes('mexico') || norm.includes('cdmx')) {
    return { xRD: 470, yRD: 260, xWorld: 180, yWorld: 185, isRD: false, regionLabel: 'México' };
  }
  if (norm.includes('bogota') || norm.includes('colombia')) {
    return { xRD: 470, yRD: 260, xWorld: 255, yWorld: 235, isRD: false, regionLabel: 'Bogotá, Colombia' };
  }
  if (norm.includes('medellin')) {
    return { xRD: 470, yRD: 260, xWorld: 248, yWorld: 225, isRD: false, regionLabel: 'Medellín, Colombia' };
  }
  if (norm.includes('san jose') || norm.includes('costa rica')) {
    return { xRD: 470, yRD: 260, xWorld: 220, yWorld: 215, isRD: false, regionLabel: 'San José, Costa Rica' };
  }
  if (norm.includes('panama')) {
    return { xRD: 470, yRD: 260, xWorld: 235, yWorld: 220, isRD: false, regionLabel: 'Panamá' };
  }
  if (norm.includes('puerto rico') || norm.includes('san juan pr')) {
    return { xRD: 705, yRD: 245, xWorld: 285, yWorld: 190, isRD: false, regionLabel: 'Puerto Rico' };
  }
  if (norm.includes('buenos aires') || norm.includes('argentina')) {
    return { xRD: 470, yRD: 260, xWorld: 295, yWorld: 360, isRD: false, regionLabel: 'Buenos Aires, Argentina' };
  }
  if (norm.includes('santiago') && norm.includes('chile')) {
    return { xRD: 470, yRD: 260, xWorld: 260, yWorld: 355, isRD: false, regionLabel: 'Santiago de Chile' };
  }
  if (norm.includes('lima') || norm.includes('peru')) {
    return { xRD: 470, yRD: 260, xWorld: 240, yWorld: 275, isRD: false, regionLabel: 'Lima, Perú' };
  }

  // Detección si es internacional
  const isForeign =
    norm.includes('usa') ||
    norm.includes('eeuu') ||
    norm.includes('estados unidos') ||
    norm.includes('espana') ||
    norm.includes('europa') ||
    norm.includes('chile') ||
    norm.includes('argentina') ||
    norm.includes('brasil') ||
    norm.includes('brazil') ||
    norm.includes('colombia');

  // Hash determinista para texto libre
  let hash = 0;
  for (let i = 0; i < norm.length; i++) {
    hash = (hash << 5) - hash + norm.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);

  if (isForeign) {
    return {
      xRD: 470,
      yRD: 260,
      xWorld: 200 + (posHash % 280),
      yWorld: 140 + ((posHash >> 2) % 180),
      isRD: false,
      regionLabel: cityInput || 'Internacional',
    };
  }

  return {
    xRD: 300 + (posHash % 320),
    yRD: 160 + ((posHash >> 2) % 120),
    xWorld: 260,
    yWorld: 186,
    isRD: true,
    regionLabel: cityInput || 'República Dominicana',
  };
}

// Motor de sugerencias provisto por radarDatabase (cero muestras falsas)

function getBillingStatus(billingDay?: number) {
  if (!billingDay) {
    return {
      label: 'Día no fijado',
      badgeClass: 'bg-slate-800 text-slate-400',
      daysUntil: 0,
      isDueSoon: false,
    };
  }

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let daysUntil = billingDay - currentDay;
  if (daysUntil < 0) {
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    daysUntil = daysInCurrentMonth - currentDay + billingDay;
  }

  if (daysUntil === 0) {
    return {
      label: '¡Cobro Hoy!',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-black animate-pulse',
      daysUntil: 0,
      isDueSoon: true,
    };
  } else if (daysUntil <= 3) {
    return {
      label: `Cobro en ${daysUntil} ${daysUntil === 1 ? 'día' : 'días'}`,
      badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold',
      daysUntil,
      isDueSoon: true,
    };
  } else if (daysUntil <= 7) {
    return {
      label: `Cobro en ${daysUntil} días`,
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium',
      daysUntil,
      isDueSoon: false,
    };
  }

  return {
    label: `Cobro día ${billingDay}`,
    badgeClass: 'bg-slate-800/80 text-slate-400 border border-slate-700 font-medium',
    daysUntil,
    isDueSoon: false,
  };
}

function getCollectionWhatsAppLink(customer: any, productName: string) {
  const cleanPhone = (customer.whatsapp || customer.phone || '').replace(/\D/g, '');
  const day = customer.billingDay || 5;
  const mrr = customer.mrr || 0;
  const text = `Hola ${customer.contactPerson || customer.name}, un cordial saludo del equipo de ${productName}. Le escribimos para recordarle que su cuota mensual de $${mrr} USD tiene fecha programada para el día ${day} de este mes. Agradecemos su puntualidad y confianza. ¡Que tenga un excelente día!`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export const ProjectDetailView: React.FC = () => {
  const {
    selectedProductId,
    products,
    customers,
    leads,
    tasks,
    feedbacks,
    changeProductStageQuick,
    updateProductFinancialsQuick,
    addTaskWithPriority,
    toggleTaskComplete,
    deleteTask,
    addCustomer,
    deleteCustomer,
    importLeadsBatch,
    convertLeadToCustomer,
    deleteLead,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    toggleChecklistItem,
    updateChecklistItemNote,
    addLead,
    updateCustomer,
    updateLead,
    updateProduct,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'description' | 'stages' | 'customers' | 'leads' | 'finances' | 'tasks' | 'feedback'>('description');
  const [leadsSubTab, setLeadsSubTab] = useState<'radar' | 'map' | 'viewed'>('radar');
  const [editingNoteChkId, setEditingNoteChkId] = useState<string | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState<string>('');

  // Estados del Mapa de Centros Geográfico
  const [mapScope, setMapScope] = useState<'RD' | 'WORLD'>('RD');
  const [mapTypeFilter, setMapTypeFilter] = useState<'all' | 'clients' | 'leads' | 'suggestions'>('all');
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [selectedMapCenterId, setSelectedMapCenterId] = useState<string | null>(null);

  // Buscar el producto seleccionado
  const product = products.find((p) => p.id === selectedProductId) || products[0];

  // Si no hay producto
  if (!product) {
    return (
      <div className="p-8 text-center text-slate-400">
        No se ha seleccionado ningún proyecto.
      </div>
    );
  }

  const normStage = normalizeStage(product.currentStage);
  const currentStageObj = STAGES_LIST.find((s) => s.id === normStage) || STAGES_LIST[0];

  // Datos filtrados para este proyecto
  const projectCustomers = customers.filter(
    (c) => c.productIds.includes(product.id) && c.status === 'Activo'
  );
  const projectLeads = leads.filter(
    (l) => l.productId === product.id && l.status !== 'CLIENTE' && l.status !== 'PERDIDO'
  );
  const projectTasks = tasks
    .filter((t) => t.productId === product.id)
    .sort((a, b) => (b.priorityScore || 5) - (a.priorityScore || 5));
  const projectFeedbacks = feedbacks.filter((f) => f.productId === product.id);

  // Finanzas del proyecto
  const mrr = product.mrr || 0;
  const costs = product.financials?.monthlyCosts || 0;
  const profit = mrr - costs;
  const margin = mrr > 0 ? Math.round((profit / mrr) * 100) : 0;

  // Total de usuarios registrados en clientes
  const totalRegisteredUsers = projectCustomers.reduce((acc, c) => acc + (c.usersCount || 0), 0);
  const effectiveUsersCount = totalRegisteredUsers > 0 ? totalRegisteredUsers : (product.activeUsersCount || 500);

  // Sincronizar finanzas
  const [finMrr, setFinMrr] = useState(mrr);
  const [finCosts, setFinCosts] = useState(costs);
  const [finSaved, setFinSaved] = useState(false);

  useEffect(() => {
    setFinMrr(product.mrr || 0);
    setFinCosts(product.financials?.monthlyCosts || 0);
  }, [product.id, product.mrr, product.financials?.monthlyCosts]);

  // Estados nueva tarea
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<number>(10);
  const [taskDesc, setTaskDesc] = useState('');

  // Estados modal nuevo cliente activo
  const [isAddCustModalOpen, setIsAddCustModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustContact, setNewCustContact] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustCity, setNewCustCity] = useState('Santo Domingo');
  const [newCustUsers, setNewCustUsers] = useState<number>(150);
  const [newCustMrr, setNewCustMrr] = useState<number>(180);
  const [newCustPlan, setNewCustPlan] = useState('Plan Estándar');
  const [newCustContractDate, setNewCustContractDate] = useState(new Date().toISOString().split('T')[0]);
  const [newCustBillingDay, setNewCustBillingDay] = useState<number>(5);

  // Estados nuevo prospecto manual
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadCity, setNewLeadCity] = useState('Santo Domingo');
  const [newLeadUsers, setNewLeadUsers] = useState<number>(200);

  // Estados pegar lista de prospectos
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [batchText, setBatchText] = useState('');
  const [importCountMessage, setImportCountMessage] = useState<string | null>(null);

  // Estados convertir prospecto a cliente
  const [leadToConvert, setLeadToConvert] = useState<any>(null);
  const [convertAmount, setConvertAmount] = useState(120);
  const [convertUsers, setConvertUsers] = useState(150);
  const [convertContractDate, setConvertContractDate] = useState(new Date().toISOString().split('T')[0]);
  const [convertBillingDay, setConvertBillingDay] = useState<number>(5);

  // Estados modal editar cliente activo
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editCustName, setEditCustName] = useState('');
  const [editCustContact, setEditCustContact] = useState('');
  const [editCustPhone, setEditCustPhone] = useState('');
  const [editCustCity, setEditCustCity] = useState('');
  const [editCustUsers, setEditCustUsers] = useState<number>(1);
  const [editCustMrr, setEditCustMrr] = useState<number>(0);
  const [editCustPlan, setEditCustPlan] = useState('');
  const [editCustContractDate, setEditCustContractDate] = useState('');
  const [editCustBillingDay, setEditCustBillingDay] = useState<number>(5);
  const [editCustNotes, setEditCustNotes] = useState('');

  // Estados modal editar prospecto
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editLeadName, setEditLeadName] = useState('');
  const [editLeadCompany, setEditLeadCompany] = useState('');
  const [editLeadPhone, setEditLeadPhone] = useState('');
  const [editLeadCity, setEditLeadCity] = useState('');
  const [editLeadValue, setEditLeadValue] = useState<number>(120);
  const [editLeadNotes, setEditLeadNotes] = useState('');

  // Estados para Ventanillas de Procesos y Pipeline por Negocio
  const [selectedCustomerForProcess, setSelectedCustomerForProcess] = useState<Customer | null>(null);
  const [selectedLeadForProcess, setSelectedLeadForProcess] = useState<Lead | null>(null);
  const [selectedCustomerFicha, setSelectedCustomerFicha] = useState<Customer | null>(null);
  const [selectedLeadFicha, setSelectedLeadFicha] = useState<Lead | null>(null);
  const [leadViewMode, setLeadViewMode] = useState<'all' | 'pipeline'>('all');

  // Estados para agregar paso personalizado en proceso
  const [isAddingCustStep, setIsAddingCustStep] = useState(false);
  const [newCustStepTitle, setNewCustStepTitle] = useState('');
  const [newCustStepDesc, setNewCustStepDesc] = useState('');

  const [isAddingLeadStep, setIsAddingLeadStep] = useState(false);
  const [newLeadStepTitle, setNewLeadStepTitle] = useState('');
  const [newLeadStepDesc, setNewLeadStepDesc] = useState('');

  // Estados para edición en línea de notas y títulos de pasos
  const [editingNoteStepId, setEditingNoteStepId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  const [editingTitleStepId, setEditingTitleStepId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');

  // Modo de mapa: 'google' (Google Maps real en vivo) o 'vector' (Pines territoriales)
  const [mapEngineMode, setMapEngineMode] = useState<'google' | 'vector'>('google');
  const [googleCustomQuery, setGoogleCustomQuery] = useState('');

  // Helper para generar filtros según el SaaS registrado
  const getProductNicheFilters = (prod: SaaSProduct): { title: string; queries: string[] } => {
    const pId = prod.id;
    const cat = (prod.category || '').toLowerCase();
    const name = (prod.name || '').toLowerCase();

    if (pId === 'prod-edugest' || cat.includes('educa') || name.includes('edu')) {
      return {
        title: 'Centros Educativos',
        queries: [
          'Colegios Privados',
          'Institutos Politécnicos',
          'Liceos Secundarios',
          'Escuelas Primarias',
          'Colegios Bilingües',
          'Preescolar & Maternal',
          'Universidades & Academias',
        ],
      };
    }
    if (pId === 'prod-gestify' || cat.includes('finan') || cat.includes('conta') || cat.includes('factura')) {
      return {
        title: 'Comercios y Finanzas',
        queries: [
          'Empresas y Oficinas',
          'Ferreterías',
          'Distribuidores y Mayoristas',
          'Plazas Comerciales',
          'Comercios Minoristas',
          'Almacenes y Repuestos',
        ],
      };
    }
    if (pId === 'prod-myturn' || cat.includes('turno') || cat.includes('cita') || name.includes('turn')) {
      return {
        title: 'Servicios de Citas y Turnos',
        queries: [
          'Barberías & Salones',
          'Spas & Centros de Estética',
          'Consultorios Odontológicos',
          'Centros Médicos & Clínicas',
          'Veterinarias',
        ],
      };
    }
    if (pId === 'prod-biblos' || name.includes('biblos') || cat.includes('juego') || cat.includes('gamifi')) {
      return {
        title: 'Centros Bíblicos y Academias',
        queries: [
          'Librerías Cristianas',
          'Colegios Cristianos',
          'Líderes Juveniles',
          'Academias y Seminarios',
        ],
      };
    }
    if (pId === 'prod-igleconet' || name.includes('igle') || cat.includes('igle')) {
      return {
        title: 'Iglesias y Comunidades',
        queries: [
          'Iglesias y Parroquias',
          'Centros Cristianos',
          'Ministerios y Sedes',
          'Comunidades Religiosas',
        ],
      };
    }
    return {
      title: prod.category || prod.name,
      queries: [
        `Empresas de ${prod.category || prod.name}`,
        `Comercios y Servicios`,
        `Centros Especializados`,
        `Oficinas Corporativas`,
      ],
    };
  };

  // Filtros personalizados creados por el usuario
  const [customMapFilters, setCustomMapFilters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`saas_custom_map_filters_${product.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return product.id === 'prod-edugest'
      ? ['Colegios Católicos', 'Colegios Bilingües', 'Politécnicos']
      : ['Negocios Prioritarios', 'Zona Centro'];
  });

  const [newCustomFilterInput, setNewCustomFilterInput] = useState('');
  const [isAddingCustomFilter, setIsAddingCustomFilter] = useState(false);
  const [activeSaaSNicheId, setActiveSaaSNicheId] = useState<string>(product.id);

  // Guardar filtros personalizados
  useEffect(() => {
    try {
      localStorage.setItem(`saas_custom_map_filters_${product.id}`, JSON.stringify(customMapFilters));
    } catch (e) {
      console.error(e);
    }
  }, [customMapFilters, product.id]);

  // Centros vistos en el mapa
  const [viewedCenters, setViewedCenters] = useState<ViewedCenter[]>(() => {
    try {
      const saved = localStorage.getItem(`saas_viewed_centers_${product.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    if (product.id === 'prod-edugest') {
      return [
        {
          id: 'viewed-edugest-1',
          productId: product.id,
          name: 'Colegio Cristiano Logos',
          city: 'Santo Domingo',
          sector: 'El Millón',
          phone: '18095554321',
          whatsapp: '18095554321',
          contactName: 'Lic. Miriam Santos',
          potentialUsers: 320,
          notes: 'Visto en Google Maps. Institución privada con 300+ alumnos y primaria completa.',
          seenAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          status: 'visto',
        },
        {
          id: 'viewed-edugest-2',
          productId: product.id,
          name: 'Instituto Politécnico Max Henríquez Ureña',
          city: 'Santo Domingo',
          sector: 'Los Alcarrizos',
          phone: '18095558833',
          whatsapp: '18095558833',
          contactName: 'Ing. Carlos Medina',
          potentialUsers: 550,
          notes: 'Visto en el mapa satelital. Tienen bachilleratos técnicos en informática.',
          seenAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          status: 'visto',
        },
      ];
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(`saas_viewed_centers_${product.id}`, JSON.stringify(viewedCenters));
    } catch (e) {
      console.error(e);
    }
  }, [viewedCenters, product.id]);

  // Motor Inteligente de Prospectos
  const [selectedCity, setSelectedCity] = useState<string>('Santo Domingo');
  const [selectedPin, setSelectedPin] = useState<SmartProspectSuggestion | null>(null);

  const [viewedFilterStatus, setViewedFilterStatus] = useState<'all' | 'pending' | 'converted'>('all');
  const [isAddViewedModalOpen, setIsAddViewedModalOpen] = useState(false);
  const [viewedFormName, setViewedFormName] = useState('');
  const [viewedFormCity, setViewedFormCity] = useState(selectedCity || 'Santo Domingo');
  const [viewedFormSector, setViewedFormSector] = useState('');
  const [viewedFormPhone, setViewedFormPhone] = useState('');
  const [viewedFormContact, setViewedFormContact] = useState('');
  const [viewedFormUsers, setViewedFormUsers] = useState<number>(200);
  const [viewedFormNotes, setViewedFormNotes] = useState('');
  const [viewedSuccessToast, setViewedSuccessToast] = useState<string | null>(null);

  // Estados feedback
  const [fbTitle, setFbTitle] = useState('');
  const [fbType, setFbType] = useState<'Opinion' | 'Mejora' | 'Bug'>('Mejora');
  const [fbSource, setFbSource] = useState('');

  // Etapa desplegada en vista de etapas
  const [expandedStageStep, setExpandedStageStep] = useState<number>(currentStageObj.step);

  // Perfil del Público Objetivo del SaaS
  const targetAudience = getProductTargetAudience(product);

  // Instituciones reales añadidas por el usuario en el Radar para este SaaS
  const [userCustomRadarSuggestions, setUserCustomRadarSuggestions] = useState<SmartProspectSuggestion[]>(() => {
    try {
      const saved = localStorage.getItem(`saas_user_radar_suggestions_${product.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`saas_user_radar_suggestions_${product.id}`, JSON.stringify(userCustomRadarSuggestions));
    } catch (e) {
      console.error(e);
    }
  }, [userCustomRadarSuggestions, product.id]);

  // Buscador y filtro en tiempo real dentro del Radar
  const [radarSearchQuery, setRadarSearchQuery] = useState('');

  // =========================================================================
  // ESTADOS DEL MÓDULO DE DESCRIPCIÓN DEL SAAS (DEFINICIÓN DEL PRODUCTO)
  // =========================================================================
  const [descName, setDescName] = useState(product.name);
  const [descCategory, setDescCategory] = useState(product.category || '');
  const [descShort, setDescShort] = useState(product.shortDescription || '');
  const [descFull, setDescFull] = useState(product.description || '');
  const [descWebsite, setDescWebsite] = useState(product.websiteUrl || '');
  const [descProductionUrl, setDescProductionUrl] = useState(product.productionUrl || '');
  const [descRepoUrl, setDescRepoUrl] = useState(product.repoUrl || '');
  const [descTargetAudience, setDescTargetAudience] = useState(product.targetAudience || '');
  const [descTargetKeywords, setDescTargetKeywords] = useState(product.targetSearchKeywords || '');
  const [descIdealProfile, setDescIdealProfile] = useState(product.idealCustomerProfile || '');
  const [descActiveModules, setDescActiveModules] = useState<string[]>(product.activeModules || []);
  const [descFutureModules, setDescFutureModules] = useState<string[]>(product.futureModules || []);
  const [descPricingPlans, setDescPricingPlans] = useState<SaaSPricingPlan[]>(product.pricingPlans || []);

  // =========================================================================
  // ESTADO BÓVEDA DE INFRAESTRUCTURA, ACCESOS Y RECUPERACIÓN ANTE DESASTRES
  // =========================================================================
  const [infraFrontendHost, setInfraFrontendHost] = useState(product.infrastructureVault?.frontendHost || 'Vercel');
  const [infraFrontendDashboard, setInfraFrontendDashboard] = useState(product.infrastructureVault?.frontendDashboardUrl || '');
  const [infraBackendHost, setInfraBackendHost] = useState(product.infrastructureVault?.backendHost || 'Railway');
  const [infraBackendDashboard, setInfraBackendDashboard] = useState(product.infrastructureVault?.backendDashboardUrl || '');
  const [infraAssociatedEmail, setInfraAssociatedEmail] = useState(product.infrastructureVault?.associatedEmail || '');
  const [infraEmailProvider, setInfraEmailProvider] = useState(product.infrastructureVault?.emailServiceProvider || 'Resend');
  const [infraTransactionalSender, setInfraTransactionalSender] = useState(product.infrastructureVault?.transactionalSenderEmail || '');
  const [infraDomainRegistrar, setInfraDomainRegistrar] = useState(product.infrastructureVault?.domainRegistrar || 'Cloudflare');
  const [infraDomainDashboard, setInfraDomainDashboard] = useState(product.infrastructureVault?.domainDashboardUrl || '');
  const [infraDbProvider, setInfraDbProvider] = useState(product.infrastructureVault?.databaseProvider || 'Supabase');
  const [infraDbHostOrUri, setInfraDbHostOrUri] = useState(product.infrastructureVault?.databaseHostOrUri || '');
  const [infraDbDashboard, setInfraDbDashboard] = useState(product.infrastructureVault?.databaseDashboardUrl || '');
  const [infraDriveFolderUrl, setInfraDriveFolderUrl] = useState(product.infrastructureVault?.backupCloudFolderUrl || '');
  const [infraLastBackupDate, setInfraLastBackupDate] = useState(product.infrastructureVault?.lastBackupDate || '');
  const [infraBackupFrequency, setInfraBackupFrequency] = useState(product.infrastructureVault?.backupFrequency || 'Semanal');
  const [infraBackupNotes, setInfraBackupNotes] = useState(product.infrastructureVault?.backupTypeNotes || '');
  const [infraStorageProvider, setInfraStorageProvider] = useState(product.infrastructureVault?.fileStorageProvider || 'Supabase Storage');
  const [infraEnvBackupText, setInfraEnvBackupText] = useState(product.infrastructureVault?.envBackupText || '');
  const [infraRecoveryNotes, setInfraRecoveryNotes] = useState(product.infrastructureVault?.disasterRecoveryNotes || '');
  const [infraCredentials, setInfraCredentials] = useState<SaaSCredential[]>(product.infrastructureVault?.credentials || []);

  // UI States para Bóveda
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [isEnvVisible, setIsEnvVisible] = useState(false);
  const [isDbUriVisible, setIsDbUriVisible] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Formulario nueva credencial
  const [isAddingCredential, setIsAddingCredential] = useState(false);
  const [newCredService, setNewCredService] = useState('');
  const [newCredUser, setNewCredUser] = useState('');
  const [newCredPassword, setNewCredPassword] = useState('');
  const [newCredDashboard, setNewCredDashboard] = useState('');
  const [newCredNotes, setNewCredNotes] = useState('');

  const [newActiveModuleInput, setNewActiveModuleInput] = useState('');
  const [newFutureModuleInput, setNewFutureModuleInput] = useState('');
  const [isAddingPricingPlan, setIsAddingPricingPlan] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState('');
  const [newPlanPeriod, setNewPlanPeriod] = useState('mensual');
  const [newPlanDesc, setNewPlanDesc] = useState('');
  const [newPlanFeatures, setNewPlanFeatures] = useState('');
  const [descSaveSuccess, setDescSaveSuccess] = useState(false);

  // Sincronizar cuando cambia el producto seleccionado
  useEffect(() => {
    setDescName(product.name);
    setDescCategory(product.category || '');
    setDescShort(product.shortDescription || '');
    setDescFull(product.description || '');
    setDescWebsite(product.websiteUrl || '');
    setDescProductionUrl(product.productionUrl || '');
    setDescRepoUrl(product.repoUrl || '');
    setDescTargetAudience(product.targetAudience || targetAudience.nicheTitle);
    setDescTargetKeywords(product.targetSearchKeywords || targetAudience.googleSearchQuery);
    setDescIdealProfile(product.idealCustomerProfile || targetAudience.defaultContactRole);
    setDescActiveModules(product.activeModules || []);
    setDescFutureModules(product.futureModules || []);
    setDescPricingPlans(product.pricingPlans || []);

    // Sincronizar bóveda de infraestructura
    setInfraFrontendHost(product.infrastructureVault?.frontendHost || 'Vercel');
    setInfraFrontendDashboard(product.infrastructureVault?.frontendDashboardUrl || '');
    setInfraBackendHost(product.infrastructureVault?.backendHost || 'Railway');
    setInfraBackendDashboard(product.infrastructureVault?.backendDashboardUrl || '');
    setInfraAssociatedEmail(product.infrastructureVault?.associatedEmail || '');
    setInfraEmailProvider(product.infrastructureVault?.emailServiceProvider || 'Resend');
    setInfraTransactionalSender(product.infrastructureVault?.transactionalSenderEmail || '');
    setInfraDomainRegistrar(product.infrastructureVault?.domainRegistrar || 'Cloudflare');
    setInfraDomainDashboard(product.infrastructureVault?.domainDashboardUrl || '');
    setInfraDbProvider(product.infrastructureVault?.databaseProvider || 'Supabase');
    setInfraDbHostOrUri(product.infrastructureVault?.databaseHostOrUri || '');
    setInfraDbDashboard(product.infrastructureVault?.databaseDashboardUrl || '');
    setInfraDriveFolderUrl(product.infrastructureVault?.backupCloudFolderUrl || '');
    setInfraLastBackupDate(product.infrastructureVault?.lastBackupDate || '');
    setInfraBackupFrequency(product.infrastructureVault?.backupFrequency || 'Semanal');
    setInfraBackupNotes(product.infrastructureVault?.backupTypeNotes || '');
    setInfraStorageProvider(product.infrastructureVault?.fileStorageProvider || 'Supabase Storage');
    setInfraEnvBackupText(product.infrastructureVault?.envBackupText || '');
    setInfraRecoveryNotes(product.infrastructureVault?.disasterRecoveryNotes || '');
    setInfraCredentials(product.infrastructureVault?.credentials || []);
  }, [product.id, product.targetAudience, product.targetSearchKeywords, product.description, product.infrastructureVault]);

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCredService.trim() || !newCredPassword.trim()) return;
    const cred: SaaSCredential = {
      id: `cred-${Date.now()}`,
      service: newCredService.trim(),
      emailOrUser: newCredUser.trim(),
      passwordOrKey: newCredPassword.trim(),
      dashboardUrl: newCredDashboard.trim() || undefined,
      notes: newCredNotes.trim() || undefined,
    };
    setInfraCredentials([...infraCredentials, cred]);
    setNewCredService('');
    setNewCredUser('');
    setNewCredPassword('');
    setNewCredDashboard('');
    setNewCredNotes('');
    setIsAddingCredential(false);
  };

  const handleRemoveCredential = (credId: string) => {
    setInfraCredentials(infraCredentials.filter((c) => c.id !== credId));
  };

  const handleAddActiveModule = () => {
    if (!newActiveModuleInput.trim()) return;
    setDescActiveModules([...descActiveModules, newActiveModuleInput.trim()]);
    setNewActiveModuleInput('');
  };

  const handleRemoveActiveModule = (index: number) => {
    setDescActiveModules(descActiveModules.filter((_, i) => i !== index));
  };

  const handleAddFutureModule = () => {
    if (!newFutureModuleInput.trim()) return;
    setDescFutureModules([...descFutureModules, newFutureModuleInput.trim()]);
    setNewFutureModuleInput('');
  };

  const handleRemoveFutureModule = (index: number) => {
    setDescFutureModules(descFutureModules.filter((_, i) => i !== index));
  };

  const handlePromoteFutureToActive = (index: number) => {
    const mod = descFutureModules[index];
    setDescFutureModules(descFutureModules.filter((_, i) => i !== index));
    setDescActiveModules([...descActiveModules, mod]);
  };

  const handleAddPricingPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim() || !newPlanPrice.trim()) return;
    const featuresArr = newPlanFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const newPlan: SaaSPricingPlan = {
      id: `plan-${Date.now()}`,
      name: newPlanName.trim(),
      price: newPlanPrice.trim(),
      period: newPlanPeriod.trim(),
      description: newPlanDesc.trim(),
      features: featuresArr.length > 0 ? featuresArr : ['Acceso general al sistema'],
    };

    setDescPricingPlans([...descPricingPlans, newPlan]);
    setNewPlanName('');
    setNewPlanPrice('');
    setNewPlanDesc('');
    setNewPlanFeatures('');
    setIsAddingPricingPlan(false);
  };

  const handleRemovePricingPlan = (planId: string) => {
    setDescPricingPlans(descPricingPlans.filter((p) => p.id !== planId));
  };

  const handleSaveProductDescription = () => {
    const updatedVault: SaaSInfrastructureVault = {
      frontendHost: infraFrontendHost.trim() || undefined,
      frontendDashboardUrl: infraFrontendDashboard.trim() || undefined,
      backendHost: infraBackendHost.trim() || undefined,
      backendDashboardUrl: infraBackendDashboard.trim() || undefined,
      associatedEmail: infraAssociatedEmail.trim() || undefined,
      emailServiceProvider: infraEmailProvider.trim() || undefined,
      transactionalSenderEmail: infraTransactionalSender.trim() || undefined,
      domainRegistrar: infraDomainRegistrar.trim() || undefined,
      domainDashboardUrl: infraDomainDashboard.trim() || undefined,
      databaseProvider: infraDbProvider.trim() || undefined,
      databaseHostOrUri: infraDbHostOrUri.trim() || undefined,
      databaseDashboardUrl: infraDbDashboard.trim() || undefined,
      backupCloudFolderUrl: infraDriveFolderUrl.trim() || undefined,
      lastBackupDate: infraLastBackupDate.trim() || undefined,
      backupFrequency: infraBackupFrequency.trim() || undefined,
      backupTypeNotes: infraBackupNotes.trim() || undefined,
      fileStorageProvider: infraStorageProvider.trim() || undefined,
      envBackupText: infraEnvBackupText,
      disasterRecoveryNotes: infraRecoveryNotes.trim() || undefined,
      credentials: infraCredentials,
    };

    updateProduct(product.id, {
      name: descName.trim() || product.name,
      category: descCategory.trim() || product.category,
      shortDescription: descShort.trim(),
      description: descFull.trim(),
      websiteUrl: descWebsite.trim() || undefined,
      productionUrl: descProductionUrl.trim() || undefined,
      repoUrl: descRepoUrl.trim() || undefined,
      targetAudience: descTargetAudience.trim(),
      targetSearchKeywords: descTargetKeywords.trim(),
      idealCustomerProfile: descIdealProfile.trim(),
      activeModules: descActiveModules,
      futureModules: descFutureModules,
      pricingPlans: descPricingPlans,
      infrastructureVault: updatedVault,
    });
    setDescSaveSuccess(true);
    setTimeout(() => setDescSaveSuccess(false), 3000);
  };

  // Modal para configurar el público objetivo del SaaS desde el radar
  const [isTargetAudienceModalOpen, setIsTargetAudienceModalOpen] = useState(false);
  const [editTargetAudience, setEditTargetAudience] = useState('');
  const [editTargetKeywords, setEditTargetKeywords] = useState('');
  const [editIdealProfile, setEditIdealProfile] = useState('');

  const handleOpenTargetAudienceModal = () => {
    setEditTargetAudience(product.targetAudience || targetAudience.nicheTitle);
    setEditTargetKeywords(product.targetSearchKeywords || targetAudience.googleSearchQuery);
    setEditIdealProfile(product.idealCustomerProfile || targetAudience.defaultContactRole);
    setIsTargetAudienceModalOpen(true);
  };

  const handleSaveTargetAudience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    updateProduct(product.id, {
      targetAudience: editTargetAudience.trim(),
      targetSearchKeywords: editTargetKeywords.trim(),
      idealCustomerProfile: editIdealProfile.trim(),
    });
    setIsTargetAudienceModalOpen(false);
  };

  // Modal para registrar una nueva institución real descubierta
  const [isAddRealCenterModalOpen, setIsAddRealCenterModalOpen] = useState(false);
  const [realCenterName, setRealCenterName] = useState('');
  const [realCenterSector, setRealCenterSector] = useState('');
  const [realCenterPhone, setRealCenterPhone] = useState('');
  const [realCenterContact, setRealCenterContact] = useState('');
  const [realCenterUsers, setRealCenterUsers] = useState<number>(350);
  const [realCenterReason, setRealCenterReason] = useState('');

  // Sugerencias auténticas para el SaaS y ciudad actual (CERO MUESTRAS FALSAS)
  const baseCitySuggestions: SmartProspectSuggestion[] = useMemo(() => {
    const defaultList = getSmartSuggestionsForProductAndCity(product.id, selectedCity);
    const normCity = normalizeCityKey(selectedCity);
    const userAdded = userCustomRadarSuggestions.filter(
      (s) => normalizeCityKey(s.city) === normCity
    );
    return [...defaultList, ...userAdded];
  }, [product.id, selectedCity, userCustomRadarSuggestions]);

  const currentCitySuggestions: SmartProspectSuggestion[] = useMemo(() => {
    if (!radarSearchQuery.trim()) return baseCitySuggestions;
    const q = radarSearchQuery.toLowerCase();
    return baseCitySuggestions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q) ||
        s.contactName.toLowerCase().includes(q) ||
        s.matchReason.toLowerCase().includes(q)
    );
  }, [baseCitySuggestions, radarSearchQuery]);

  const handleSaveRealCenterToRadar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!realCenterName.trim()) return;

    const newSuggestion: SmartProspectSuggestion = {
      id: `custom-sug-${Date.now()}`,
      name: realCenterName.trim(),
      sector: realCenterSector.trim() || 'Sector Central',
      city: selectedCity,
      phone: realCenterPhone.trim() || '18095550000',
      contactName: realCenterContact.trim() || targetAudience.defaultContactRole,
      potentialUsers: Number(realCenterUsers) || 250,
      latRatio: 40 + Math.floor(Math.random() * 25),
      lngRatio: 40 + Math.floor(Math.random() * 25),
      matchReason: realCenterReason.trim() || `${targetAudience.nicheShort} verificado en ${selectedCity}.`,
    };

    setUserCustomRadarSuggestions((prev) => [newSuggestion, ...prev]);
    setIsAddRealCenterModalOpen(false);
    setRealCenterName('');
    setRealCenterSector('');
    setRealCenterPhone('');
    setRealCenterContact('');
    setRealCenterUsers(350);
    setRealCenterReason('');
  };

  // Instancias actualizadas reactivas
  const currentCustomerForProcess = selectedCustomerForProcess
    ? customers.find((c) => c.id === selectedCustomerForProcess.id) || selectedCustomerForProcess
    : null;

  const currentLeadForProcess = selectedLeadForProcess
    ? leads.find((l) => l.id === selectedLeadForProcess.id) || selectedLeadForProcess
    : null;

  const currentCustomerFicha = selectedCustomerFicha
    ? customers.find((c) => c.id === selectedCustomerFicha.id) || selectedCustomerFicha
    : null;

  const currentLeadFicha = selectedLeadFicha
    ? leads.find((l) => l.id === selectedLeadFicha.id) || selectedLeadFicha
    : null;

  // Manejadores de Proceso de Clientes
  const handleToggleCustomerStep = (cust: Customer, stepId: string) => {
    const steps = cust.processSteps && cust.processSteps.length > 0 ? cust.processSteps : createDefaultCustomerOnboardingSteps();
    const updated = steps.map((s) => {
      if (s.id === stepId) {
        const nextCompleted = !s.completed;
        return {
          ...s,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return s;
    });
    updateCustomer(cust.id, { processSteps: updated });
    setSelectedCustomerForProcess((prev) => (prev && prev.id === cust.id ? { ...prev, processSteps: updated } : prev));
  };

  const handleSaveCustomerStepNote = (cust: Customer, stepId: string, note: string) => {
    const steps = cust.processSteps && cust.processSteps.length > 0 ? cust.processSteps : createDefaultCustomerOnboardingSteps();
    const updated = steps.map((s) => (s.id === stepId ? { ...s, notes: note.trim() } : s));
    updateCustomer(cust.id, { processSteps: updated });
    setSelectedCustomerForProcess((prev) => (prev && prev.id === cust.id ? { ...prev, processSteps: updated } : prev));
    setEditingNoteStepId(null);
    setEditingNoteText('');
  };

  const handleSaveCustomerStepTitle = (cust: Customer, stepId: string, title: string) => {
    if (!title.trim()) return;
    const steps = cust.processSteps && cust.processSteps.length > 0 ? cust.processSteps : createDefaultCustomerOnboardingSteps();
    const updated = steps.map((s) => (s.id === stepId ? { ...s, title: title.trim() } : s));
    updateCustomer(cust.id, { processSteps: updated });
    setSelectedCustomerForProcess((prev) => (prev && prev.id === cust.id ? { ...prev, processSteps: updated } : prev));
    setEditingTitleStepId(null);
    setEditingTitleText('');
  };

  const handleDeleteCustomerStep = (cust: Customer, stepId: string) => {
    const steps = cust.processSteps && cust.processSteps.length > 0 ? cust.processSteps : createDefaultCustomerOnboardingSteps();
    const updated = steps.filter((s) => s.id !== stepId);
    updateCustomer(cust.id, { processSteps: updated });
    setSelectedCustomerForProcess((prev) => (prev && prev.id === cust.id ? { ...prev, processSteps: updated } : prev));
  };

  const handleAddCustomerStep = (cust: Customer) => {
    if (!newCustStepTitle.trim()) return;
    const steps = cust.processSteps && cust.processSteps.length > 0 ? cust.processSteps : createDefaultCustomerOnboardingSteps();
    const newStep: BusinessProcessStep = {
      id: `cust-step-${Date.now()}`,
      title: newCustStepTitle.trim(),
      description: newCustStepDesc.trim() || undefined,
      completed: false,
    };
    const updated = [...steps, newStep];
    updateCustomer(cust.id, { processSteps: updated });
    setSelectedCustomerForProcess((prev) => (prev && prev.id === cust.id ? { ...prev, processSteps: updated } : prev));
    setNewCustStepTitle('');
    setNewCustStepDesc('');
    setIsAddingCustStep(false);
  };

  const handleResetCustomerSteps = (cust: Customer) => {
    const defaultSteps = createDefaultCustomerOnboardingSteps();
    updateCustomer(cust.id, { processSteps: defaultSteps });
    setSelectedCustomerForProcess((prev) => (prev && prev.id === cust.id ? { ...prev, processSteps: defaultSteps } : prev));
  };

  // Manejadores de Proceso de Ventas / Prospectos
  const handleToggleLeadStep = (lead: Lead, stepId: string) => {
    const steps = lead.processSteps && lead.processSteps.length > 0 ? lead.processSteps : createDefaultLeadSalesSteps();
    const updated = steps.map((s) => {
      if (s.id === stepId) {
        const nextCompleted = !s.completed;
        return {
          ...s,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return s;
    });
    updateLead(lead.id, { processSteps: updated });
    setSelectedLeadForProcess((prev) => (prev && prev.id === lead.id ? { ...prev, processSteps: updated } : prev));
  };

  const handleSaveLeadStepNote = (lead: Lead, stepId: string, note: string) => {
    const steps = lead.processSteps && lead.processSteps.length > 0 ? lead.processSteps : createDefaultLeadSalesSteps();
    const updated = steps.map((s) => (s.id === stepId ? { ...s, notes: note.trim() } : s));
    updateLead(lead.id, { processSteps: updated });
    setSelectedLeadForProcess((prev) => (prev && prev.id === lead.id ? { ...prev, processSteps: updated } : prev));
    setEditingNoteStepId(null);
    setEditingNoteText('');
  };

  const handleSaveLeadStepTitle = (lead: Lead, stepId: string, title: string) => {
    if (!title.trim()) return;
    const steps = lead.processSteps && lead.processSteps.length > 0 ? lead.processSteps : createDefaultLeadSalesSteps();
    const updated = steps.map((s) => (s.id === stepId ? { ...s, title: title.trim() } : s));
    updateLead(lead.id, { processSteps: updated });
    setSelectedLeadForProcess((prev) => (prev && prev.id === lead.id ? { ...prev, processSteps: updated } : prev));
    setEditingTitleStepId(null);
    setEditingTitleText('');
  };

  const handleDeleteLeadStep = (lead: Lead, stepId: string) => {
    const steps = lead.processSteps && lead.processSteps.length > 0 ? lead.processSteps : createDefaultLeadSalesSteps();
    const updated = steps.filter((s) => s.id !== stepId);
    updateLead(lead.id, { processSteps: updated });
    setSelectedLeadForProcess((prev) => (prev && prev.id === lead.id ? { ...prev, processSteps: updated } : prev));
  };

  const handleAddLeadStep = (lead: Lead) => {
    if (!newLeadStepTitle.trim()) return;
    const steps = lead.processSteps && lead.processSteps.length > 0 ? lead.processSteps : createDefaultLeadSalesSteps();
    const newStep: BusinessProcessStep = {
      id: `lead-step-${Date.now()}`,
      title: newLeadStepTitle.trim(),
      description: newLeadStepDesc.trim() || undefined,
      completed: false,
    };
    const updated = [...steps, newStep];
    updateLead(lead.id, { processSteps: updated });
    setSelectedLeadForProcess((prev) => (prev && prev.id === lead.id ? { ...prev, processSteps: updated } : prev));
    setNewLeadStepTitle('');
    setNewLeadStepDesc('');
    setIsAddingLeadStep(false);
  };

  const handleResetLeadSteps = (lead: Lead) => {
    const defaultSteps = createDefaultLeadSalesSteps();
    updateLead(lead.id, { processSteps: defaultSteps });
    setSelectedLeadForProcess((prev) => (prev && prev.id === lead.id ? { ...prev, processSteps: defaultSteps } : prev));
  };

  const handleToggleLeadPipeline = (lead: Lead) => {
    const nextVal = !lead.inSalesPipeline;
    updateLead(lead.id, { inSalesPipeline: nextVal });
    setSelectedLeadForProcess((prev) => (prev && prev.id === lead.id ? { ...prev, inSalesPipeline: nextVal } : prev));
  };

  // Helpers de guardado
  const handleSaveFinances = (e: React.FormEvent) => {
    e.preventDefault();
    updateProductFinancialsQuick(product.id, finMrr, finCosts);
    setFinSaved(true);
    setTimeout(() => setFinSaved(false), 2000);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTaskWithPriority(taskTitle.trim(), product.id, taskPriority, taskDesc.trim());
    setTaskTitle('');
    setTaskDesc('');
    setTaskPriority(10);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;
    const cleanPhone = newCustPhone.replace(/\D/g, '');
    addCustomer({
      name: newCustName.trim(),
      company: newCustName.trim(),
      contactPerson: newCustContact.trim() || newCustName.trim(),
      email: `${newCustName.toLowerCase().replace(/\s+/g, '')}@ejemplo.com`,
      phone: newCustPhone.trim() || '+1 (809) 555-0000',
      whatsapp: cleanPhone || '18095550000',
      city: newCustCity,
      usersCount: Number(newCustUsers) || 10,
      productIds: [product.id],
      plan: newCustPlan,
      startDate: newCustContractDate || new Date().toISOString().split('T')[0],
      contractStartDate: newCustContractDate || new Date().toISOString().split('T')[0],
      billingDay: Number(newCustBillingDay) || 5,
      status: 'Activo',
      mrr: Number(newCustMrr) || 0,
      notes: `Cliente activo registrado manualmente en ${newCustCity}`,
    });
    setNewCustName('');
    setNewCustContact('');
    setNewCustPhone('');
    setIsAddCustModalOpen(false);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadCompany.trim()) return;
    const cleanPhone = newLeadPhone.replace(/\D/g, '');
    addLead({
      name: newLeadName.trim() || newLeadCompany.trim(),
      institutionOrCompany: newLeadCompany.trim(),
      email: 'contacto@prospecto.com',
      phone: newLeadPhone.trim() || '+1 (809) 555-1234',
      whatsapp: cleanPhone || '18095551234',
      city: newLeadCity,
      productId: product.id,
      origin: 'Prospección Directa',
      status: 'INTERESADO',
      responsible: 'Alex Palacio',
      contactDate: new Date().toISOString().split('T')[0],
      nextFollowUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      estimatedValue: 120,
      notes: `Prospecto con aprox. ${newLeadUsers} usuarios potenciales en ${newLeadCity}`,
    });
    setNewLeadCompany('');
    setNewLeadName('');
    setNewLeadPhone('');
    setIsAddLeadModalOpen(false);
  };

  const handleOpenEditCustomer = (cust: Customer) => {
    setEditingCustomer(cust);
    setEditCustName(cust.name);
    setEditCustContact(cust.contactPerson || '');
    setEditCustPhone(cust.whatsapp || cust.phone || '');
    setEditCustCity(cust.city || 'Santo Domingo');
    setEditCustUsers(cust.usersCount || 1);
    setEditCustMrr(cust.mrr || 0);
    setEditCustPlan(cust.plan || 'Plan Institucional Completo');
    setEditCustContractDate(cust.contractStartDate || cust.startDate || '');
    setEditCustBillingDay(cust.billingDay || 5);
    setEditCustNotes(cust.notes || '');
  };

  const handleUpdateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !editCustName.trim()) return;

    const cleanPhone = editCustPhone.replace(/\D/g, '');
    const updates: Partial<Customer> = {
      name: editCustName.trim(),
      company: editCustName.trim(),
      contactPerson: editCustContact.trim() || editCustName.trim(),
      phone: editCustPhone.trim() || '+1 (809) 555-0000',
      whatsapp: cleanPhone || editCustPhone.trim(),
      city: editCustCity.trim(),
      usersCount: Number(editCustUsers) || 1,
      mrr: Number(editCustMrr) || 0,
      plan: editCustPlan.trim() || editingCustomer.plan,
      startDate: editCustContractDate || editingCustomer.startDate,
      contractStartDate: editCustContractDate || undefined,
      billingDay: Number(editCustBillingDay) || 5,
      notes: editCustNotes.trim(),
    };

    updateCustomer(editingCustomer.id, updates);
    setSelectedCustomerForProcess((prev) => (prev && prev.id === editingCustomer.id ? { ...prev, ...updates } : prev));
    setEditingCustomer(null);
  };

  const handleOpenEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setEditLeadName(lead.name);
    setEditLeadCompany(lead.institutionOrCompany || lead.name);
    setEditLeadPhone(lead.whatsapp || lead.phone || '');
    setEditLeadCity(lead.city || 'Santo Domingo');
    setEditLeadValue(lead.estimatedValue || 120);
    setEditLeadNotes(lead.notes || '');
  };

  const handleUpdateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead || !editLeadCompany.trim()) return;

    const cleanPhone = editLeadPhone.replace(/\D/g, '');
    const updates: Partial<Lead> = {
      name: editLeadName.trim() || editLeadCompany.trim(),
      institutionOrCompany: editLeadCompany.trim(),
      phone: editLeadPhone.trim() || '+1 (809) 555-1234',
      whatsapp: cleanPhone || editLeadPhone.trim(),
      city: editLeadCity.trim(),
      estimatedValue: Number(editLeadValue) || 120,
      notes: editLeadNotes.trim(),
    };

    updateLead(editingLead.id, updates);
    setSelectedLeadForProcess((prev) => (prev && prev.id === editingLead.id ? { ...prev, ...updates } : prev));
    setEditingLead(null);
  };

  const handleAddSmartProspect = (sug: SmartProspectSuggestion) => {
    addLead({
      name: sug.contactName,
      institutionOrCompany: sug.name,
      email: `${sug.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@contacto.com`,
      phone: sug.phone,
      whatsapp: sug.phone,
      city: sug.city,
      productId: product.id,
      origin: 'Motor Inteligente Radar',
      status: 'INTERESADO',
      responsible: 'Alex Palacio',
      contactDate: new Date().toISOString().split('T')[0],
      nextFollowUpDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      estimatedValue: Math.round(sug.potentialUsers * 0.8),
      notes: `${sug.matchReason}. Sector: ${sug.sector}. Usuarios estimados: ${sug.potentialUsers}`,
    });
    setSelectedPin(sug);
  };

  const handleAddCustomFilter = () => {
    const trimmed = newCustomFilterInput.trim();
    if (!trimmed) return;
    if (!customMapFilters.includes(trimmed)) {
      setCustomMapFilters((prev) => [...prev, trimmed]);
    }
    setGoogleCustomQuery(`${trimmed} en ${selectedCity}, Republica Dominicana`);
    setNewCustomFilterInput('');
    setIsAddingCustomFilter(false);
  };

  const handleRemoveCustomFilter = (filterText: string) => {
    setCustomMapFilters((prev) => prev.filter((f) => f !== filterText));
  };

  const handleMarkAsViewed = (centerData: {
    name: string;
    city: string;
    sector?: string;
    phone?: string;
    contactName?: string;
    potentialUsers?: number;
    notes?: string;
  }) => {
    const existing = viewedCenters.find(
      (v) =>
        v.name.toLowerCase() === centerData.name.toLowerCase() &&
        v.city.toLowerCase() === centerData.city.toLowerCase()
    );
    if (existing) {
      setViewedSuccessToast(`ℹ️ "${centerData.name}" ya estaba en tu lista de Centros Vistos.`);
      setTimeout(() => setViewedSuccessToast(null), 3000);
      return;
    }

    const newViewed: ViewedCenter = {
      id: `viewed-${Date.now()}`,
      productId: product.id,
      name: centerData.name,
      city: centerData.city,
      sector: centerData.sector,
      phone: centerData.phone,
      whatsapp: centerData.phone,
      contactName: centerData.contactName,
      potentialUsers: centerData.potentialUsers || 150,
      notes: centerData.notes || `Centro explorado en el mapa de ${centerData.city}.`,
      seenAt: new Date().toISOString(),
      status: 'visto',
    };

    setViewedCenters((prev) => [newViewed, ...prev]);
    setViewedSuccessToast(`👀 ¡"${centerData.name}" se enlistó como Visto exitosamente!`);
    setTimeout(() => setViewedSuccessToast(null), 3500);
  };

  const handleCreateManualViewedCenter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewedFormName.trim()) return;

    handleMarkAsViewed({
      name: viewedFormName.trim(),
      city: viewedFormCity || selectedCity,
      sector: viewedFormSector.trim() || undefined,
      phone: viewedFormPhone.trim() || undefined,
      contactName: viewedFormContact.trim() || undefined,
      potentialUsers: viewedFormUsers,
      notes: viewedFormNotes.trim() || `Centro visto en Google Maps (${viewedFormCity || selectedCity}).`,
    });

    setIsAddViewedModalOpen(false);
    setViewedFormName('');
    setViewedFormSector('');
    setViewedFormPhone('');
    setViewedFormContact('');
    setViewedFormNotes('');
  };

  const handlePromoteViewedToLead = (viewed: ViewedCenter) => {
    const alreadyLead = projectLeads.some(
      (l) => (l.institutionOrCompany || l.name).toLowerCase() === viewed.name.toLowerCase()
    );

    if (alreadyLead) {
      setViewedCenters((prev) =>
        prev.map((c) => (c.id === viewed.id ? { ...c, status: 'convertido_a_lead' } : c))
      );
      setViewedSuccessToast(`ℹ️ "${viewed.name}" ya forma parte de tus Posibles Clientes.`);
      setTimeout(() => setViewedSuccessToast(null), 3000);
      return;
    }

    addLead({
      name: viewed.contactName || viewed.name,
      institutionOrCompany: viewed.name,
      email: `${viewed.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@contacto.com`,
      phone: viewed.phone || '',
      whatsapp: viewed.whatsapp || viewed.phone || '',
      city: viewed.city,
      productId: product.id,
      origin: 'Mapa (Centro Visto)',
      status: 'LEAD',
      responsible: 'Alex Palacio',
      contactDate: new Date().toISOString().split('T')[0],
      nextFollowUpDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      estimatedValue: viewed.potentialUsers ? Math.round(viewed.potentialUsers * 0.8) : 120,
      notes: `${viewed.notes || 'Centro visto en el mapa'}. Sector: ${viewed.sector || 'N/A'}.`,
      inSalesPipeline: true,
    });

    setViewedCenters((prev) =>
      prev.map((c) => (c.id === viewed.id ? { ...c, status: 'convertido_a_lead' } : c))
    );

    setViewedSuccessToast(`✨ ¡"${viewed.name}" se pasó a Posible Cliente! Listo para venta.`);
    setTimeout(() => setViewedSuccessToast(null), 4000);
  };

  const handleDeleteViewedCenter = (id: string) => {
    setViewedCenters((prev) => prev.filter((c) => c.id !== id));
  };

  const handleImportBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchText.trim()) return;
    const count = importLeadsBatch(batchText, product.id);
    setImportCountMessage(`✅ ¡${count} prospectos agregados exitosamente!`);
    setTimeout(() => {
      setImportCountMessage(null);
      setIsImportModalOpen(false);
      setBatchText('');
    }, 1200);
  };

  const handleExecuteConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadToConvert) return;
    convertLeadToCustomer(
      leadToConvert.id,
      'Plan Convertido',
      convertAmount,
      convertUsers,
      convertContractDate || new Date().toISOString().split('T')[0],
      Number(convertBillingDay) || 5
    );
    setLeadToConvert(null);
  };

  const handleCreateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbTitle.trim()) return;
    addFeedback({
      productId: product.id,
      title: fbTitle.trim(),
      description: fbTitle.trim(),
      type: fbType,
      priority: 'Media',
      status: 'Pendiente',
      source: fbSource.trim() || undefined,
    });
    setFbTitle('');
    setFbSource('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in">
      {/* 1. CABECERA DEL PROYECTO */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 font-black text-lg flex items-center justify-center border border-indigo-500/30 shrink-0">
            {product.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {product.name}
              </h1>
              {product.websiteUrl && (
                <a
                  href={product.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-indigo-400 transition"
                  title="Abrir URL del SaaS"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${currentStageObj.color}`}>
                Paso {currentStageObj.step}: {currentStageObj.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{product.shortDescription}</p>
          </div>
        </div>

        {/* 4 KPIs Clave del Proyecto */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center shrink-0">
          <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">MRR</span>
            <span className="text-sm font-bold text-emerald-400">${mrr}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Gastos</span>
            <span className="text-sm font-bold text-rose-400">${costs}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Clientes B2B</span>
            <span className="text-sm font-bold text-blue-400">{projectCustomers.length}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Usuarios Finales</span>
            <span className="text-sm font-bold text-cyan-400">{effectiveUsersCount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 2. PESTAÑAS DE NAVEGACIÓN DENTRO DEL PROYECTO (LINEAL) */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('description')}
          className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            activeTab === 'description'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Descripción</span>
        </button>

        <button
          onClick={() => setActiveTab('stages')}
          className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            activeTab === 'stages'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>Etapas</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            activeTab === 'customers'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Clientes ({projectCustomers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            activeTab === 'leads'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Prospectos ({projectLeads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finances')}
          className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            activeTab === 'finances'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Finanzas</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            activeTab === 'tasks'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Procesos y tareas</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            activeTab === 'feedback'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Opiniones y mejoras</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PESTAÑA 0: DESCRIPCIÓN Y DEFINICIÓN COMPLETA DEL SAAS                      */}
      {/* ========================================================================= */}
      {activeTab === 'description' && (
        <div className="space-y-6 animate-in fade-in">
          {/* HEADER PRINCIPAL DE DEFINICIÓN */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 text-xs flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Ficha Técnica & Definición</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {descCategory || product.category}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1.5">
                Definición y Propuesta de Valor de {descName || product.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                Define el propósito del software, sus módulos activos, hoja de ruta futura, modelos de precios y mercado objetivo.
                El <strong className="text-indigo-300">Radar Geográfico</strong> y las búsquedas se alimentan directamente de esta configuración.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSaveProductDescription}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition active:scale-95"
              >
                {descSaveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>¡Guardado con éxito!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* COLUMNA IZQUIERDA: 1. DESCRIPCIÓN Y PROPUESTA DE VALOR + 2. MERCADO OBJETIVO (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. DESCRIPCIÓN GENERAL & PROPUESTA */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-indigo-400" />
                    <span>1. Identidad y Propuesta de Valor</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">ID: {product.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Nombre del SaaS</label>
                    <input
                      type="text"
                      value={descName}
                      onChange={(e) => setDescName(e.target.value)}
                      placeholder="Ej: GestiFy RD, EduGest..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Categoría / Industria</label>
                    <input
                      type="text"
                      value={descCategory}
                      onChange={(e) => setDescCategory(e.target.value)}
                      placeholder="Ej: Gestión Pública Escolar, EdTech, Turnos..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Propuesta de Valor Comercial (Descripción corta)
                  </label>
                  <input
                    type="text"
                    value={descShort}
                    onChange={(e) => setDescShort(e.target.value)}
                    placeholder="Ej: Software para centros educativos públicos y liceos con Junta Descentralizada (MINERD)."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Frase corta de posicionamiento que resume el valor central del producto.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Descripción Detallada del Sistema
                  </label>
                  <textarea
                    rows={4}
                    value={descFull}
                    onChange={(e) => setDescFull(e.target.value)}
                    placeholder="Describe en detalle qué hace el software, a quién le resuelve dolores críticos y cómo funciona..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-indigo-400" />
                      Sitio Web
                    </label>
                    <input
                      type="url"
                      value={descWebsite}
                      onChange={(e) => setDescWebsite(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3 text-emerald-400" />
                      App en Producción
                    </label>
                    <input
                      type="url"
                      value={descProductionUrl}
                      onChange={(e) => setDescProductionUrl(e.target.value)}
                      placeholder="https://app..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-amber-400" />
                      Repositorio
                    </label>
                    <input
                      type="url"
                      value={descRepoUrl}
                      onChange={(e) => setDescRepoUrl(e.target.value)}
                      placeholder="https://github..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. MERCADO OBJETIVO (ALIMENTA EL RADAR) */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-4 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-400" />
                    <span>2. Mercado Objetivo (Alimenta el Radar & Google Maps)</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-[10px] border border-indigo-500/30">
                    Sincronizado con Radar
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Esta configuración le dice al Radar y a Google Maps <strong>a qué tipo exacto de clientes buscar</strong> en cada ciudad. Cuando cambies las palabras clave o el nicho, el Radar y el escaneo en vivo se adaptarán de inmediato.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>¿A quién va dirigido? (Público Objetivo / Nicho Principal) *</span>
                      <span className="text-[10px] text-indigo-400 font-normal">Tipo de institución o empresa</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={descTargetAudience}
                      onChange={(e) => setDescTargetAudience(e.target.value)}
                      placeholder="Ej: Centros Educativos Públicos con Junta Descentralizada (Liceos y Escuelas Públicas MINERD)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Palabras Clave para Búsqueda (Google Maps & Radar) *</span>
                      <span className="text-[10px] text-cyan-400 font-normal">Términos para el motor de rastreo</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={descTargetKeywords}
                      onChange={(e) => setDescTargetKeywords(e.target.value)}
                      placeholder="Ej: liceos publicos escuelas publicas politécnico"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-[11px] text-slate-400">
                      Términos que el motor buscará en Google Maps en cada ciudad (ej. Higüey, Santo Domingo, Santiago).
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Perfil del Cliente Ideal / Cargo de Contacto Clave</span>
                      <span className="text-[10px] text-amber-400 font-normal">Tomador de decisión</span>
                    </label>
                    <input
                      type="text"
                      value={descIdealProfile}
                      onChange={(e) => setDescIdealProfile(e.target.value)}
                      placeholder="Ej: Director(a) de Centro Educativo / Presidente de Junta Descentralizada"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: 3. MÓDULOS ACTIVOS + 4. MÓDULOS FUTUROS (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* 3. MÓDULOS ACTIVOS */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>3. Módulos Activos que tiene el SaaS</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Funcionalidades operables y listas hoy ({descActiveModules.length})
                    </p>
                  </div>
                </div>

                {/* Lista de Módulos Activos */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {descActiveModules.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500">
                      No hay módulos activos registrados. Agrega el primero abajo.
                    </div>
                  ) : (
                    descActiveModules.map((mod, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950 border border-emerald-500/20 text-xs text-slate-200 group hover:border-emerald-500/40 transition"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate font-semibold">{mod}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveActiveModule(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1 opacity-60 group-hover:opacity-100 transition shrink-0"
                          title="Eliminar módulo activo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Input para Agregar Módulo Activo */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newActiveModuleInput}
                    onChange={(e) => setNewActiveModuleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddActiveModule();
                      }
                    }}
                    placeholder="Nuevo módulo activo..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddActiveModule}
                    disabled={!newActiveModuleInput.trim()}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs shadow transition shrink-0 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>

              {/* 4. MÓDULOS FUTUROS O MÁS PREMIUM */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>4. Módulos Futuros o Más Premium</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Roadmap de funciones o planes Enterprise ({descFutureModules.length})
                    </p>
                  </div>
                </div>

                {/* Lista de Módulos Futuros */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {descFutureModules.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500">
                      No hay módulos futuros registrados en el roadmap.
                    </div>
                  ) : (
                    descFutureModules.map((mod, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950 border border-purple-500/20 text-xs text-slate-200 group hover:border-purple-500/40 transition"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="truncate font-semibold">{mod}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handlePromoteFutureToActive(idx)}
                            className="px-2 py-0.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white font-bold text-[10px] transition"
                            title="Mover a Módulos Activos"
                          >
                            Activar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFutureModule(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1 opacity-60 group-hover:opacity-100 transition"
                            title="Eliminar módulo futuro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input para Agregar Módulo Futuro */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newFutureModuleInput}
                    onChange={(e) => setNewFutureModuleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFutureModule();
                      }
                    }}
                    placeholder="Nueva función futura o premium..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFutureModule}
                    disabled={!newFutureModuleInput.trim()}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs shadow transition shrink-0 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 5. PLANES Y PRECIOS DEL SAAS */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>5. Estructura de Planes y Precios</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Define las opciones comerciales, paquetes y suscripciones que ofreces al mercado.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingPricingPlan(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-indigo-500/30 font-bold text-xs shadow transition shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Nuevo Plan</span>
              </button>
            </div>

            {/* Grid de Planes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {descPricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-5 rounded-3xl bg-slate-950 border flex flex-col justify-between relative transition hover:border-slate-700 ${
                    plan.isPopular ? 'border-indigo-500/50 shadow-indigo-500/10 shadow-lg' : 'border-slate-800'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-[9px] uppercase tracking-wider shadow">
                      Popular / Recomendado
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-black text-white text-sm">{plan.name}</h4>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-black text-white">{plan.price}</span>
                          <span className="text-xs text-slate-400 font-semibold">/ {plan.period}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePricingPlan(plan.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 opacity-60 hover:opacity-100 transition"
                        title="Eliminar este plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {plan.description && (
                      <p className="text-xs text-slate-400 leading-relaxed">{plan.description}</p>
                    )}

                    <div className="pt-2 border-t border-slate-900 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Qué incluye:
                      </span>
                      <ul className="space-y-1.5">
                        {plan.features.map((feat, fIdx) => (
                          <li key={fIdx} className="text-xs text-slate-300 flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulario Modal/Inline para agregar nuevo plan */}
            {isAddingPricingPlan && (
              <form
                onSubmit={handleAddPricingPlan}
                className="p-5 rounded-3xl bg-slate-950 border border-indigo-500/40 space-y-4 animate-in fade-in"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Configurar Nuevo Plan de Precio
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingPricingPlan(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Nombre del Plan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Plan Básico, Plan Escolar..."
                      value={newPlanName}
                      onChange={(e) => setNewPlanName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Precio *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: $49, $89 USD..."
                      value={newPlanPrice}
                      onChange={(e) => setNewPlanPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Periodicidad</label>
                    <select
                      value={newPlanPeriod}
                      onChange={(e) => setNewPlanPeriod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    >
                      <option value="mensual">Mensual</option>
                      <option value="anual">Anual</option>
                      <option value="pago único">Pago único</option>
                      <option value="por alumno/mes">Por alumno / mes</option>
                      <option value="por sucursal/mes">Por sucursal / mes</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Descripción Breve del Plan</label>
                  <input
                    type="text"
                    placeholder="Ej: Ideal para centros educativos pequeños que inician."
                    value={newPlanDesc}
                    onChange={(e) => setNewPlanDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Características incluidas (una por línea)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Hasta 500 alumnos&#10;1 cuenta bancaria institucional&#10;Soporte estándar"
                    value={newPlanFeatures}
                    onChange={(e) => setNewPlanFeatures(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingPricingPlan(false)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow"
                  >
                    Guardar Plan
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECCIÓN 6: BÓVEDA DE INFRAESTRUCTURA, ACCESOS & RECUPERACIÓN ANTE DESASTRES */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            {/* Header de la Bóveda */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                    6. Bóveda de Infraestructura, Accesos & Recuperación ante Desastres
                  </h3>
                </div>
                <p className="text-xs text-slate-400 max-w-3xl">
                  Registra servidores de despliegue (Vercel, Railway), bases de datos, credenciales críticas, copias de seguridad de carpetas en Google Drive y variables <span className="font-mono text-cyan-400">.env</span> para proteger tu SaaS ante caídas o pérdida de tu computadora.
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Frontend: <strong className="text-white">{infraFrontendHost || 'Vercel'}</strong></span>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  <span>BD: <strong className="text-white">{infraDbProvider || 'Supabase'}</strong></span>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5">
                  <FolderArchive className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Backup: <strong className="text-emerald-400">{infraBackupFrequency || 'Semanal'}</strong></span>
                </div>
              </div>
            </div>

            {/* Grid 1: Hosting, Despliegue & Dominio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Frontend */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5" /> Frontend Hosting
                  </span>
                  {infraFrontendDashboard && (
                    <a
                      href={infraFrontendDashboard}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-cyan-400 transition"
                      title="Abrir Dashboard de Frontend"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Proveedor / Plataforma</label>
                    <input
                      type="text"
                      placeholder="Ej: Vercel, Netlify, Cloudflare Pages"
                      value={infraFrontendHost}
                      onChange={(e) => setInfraFrontendHost(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">URL del Dashboard / Proyecto</label>
                    <input
                      type="url"
                      placeholder="https://vercel.com/tu-equipo/proyecto"
                      value={infraFrontendDashboard}
                      onChange={(e) => setInfraFrontendDashboard(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Backend */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5" /> Backend Hosting & API
                  </span>
                  {infraBackendDashboard && (
                    <a
                      href={infraBackendDashboard}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-400 transition"
                      title="Abrir Dashboard de Backend"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Proveedor / Servidor</label>
                    <input
                      type="text"
                      placeholder="Ej: Railway, Render, Fly.io, DigitalOcean"
                      value={infraBackendHost}
                      onChange={(e) => setInfraBackendHost(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">URL del Dashboard / Service</label>
                    <input
                      type="url"
                      placeholder="https://railway.com/project/..."
                      value={infraBackendDashboard}
                      onChange={(e) => setInfraBackendDashboard(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dominio & DNS */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Dominio & DNS Registrar
                  </span>
                  {infraDomainDashboard && (
                    <a
                      href={infraDomainDashboard}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-amber-400 transition"
                      title="Abrir Gestión de DNS"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Registrador de Dominio</label>
                    <input
                      type="text"
                      placeholder="Ej: Cloudflare, Namecheap, GoDaddy"
                      value={infraDomainRegistrar}
                      onChange={(e) => setInfraDomainRegistrar(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">URL Consola DNS / Dominio</label>
                    <input
                      type="url"
                      placeholder="https://dash.cloudflare.com/..."
                      value={infraDomainDashboard}
                      onChange={(e) => setInfraDomainDashboard(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 2: Base de Datos, Archivos & Google Drive Backup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Base de Datos & Storage */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-4 h-4" /> Base de Datos & Almacenamiento
                  </span>
                  {infraDbDashboard && (
                    <a
                      href={infraDbDashboard}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition"
                    >
                      <span>Abrir Consola BD</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Motor / Proveedor BD</label>
                    <input
                      type="text"
                      placeholder="Ej: Supabase PostgreSQL, Railway Postgres, Neon"
                      value={infraDbProvider}
                      onChange={(e) => setInfraDbProvider(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Almacenamiento de Archivos</label>
                    <input
                      type="text"
                      placeholder="Ej: Supabase Storage, Cloudflare R2, S3"
                      value={infraStorageProvider}
                      onChange={(e) => setInfraStorageProvider(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                      Host o Connection String de BD (Sensible)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsDbUriVisible(!isDbUriVisible)}
                        className="text-[10px] font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        {isDbUriVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{isDbUriVisible ? 'Ocultar' : 'Revelar'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(infraDbHostOrUri, 'db-uri')}
                        className="text-[10px] font-semibold text-slate-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        {copiedId === 'db-uri' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === 'db-uri' ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>
                  <input
                    type={isDbUriVisible ? 'text' : 'password'}
                    placeholder="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
                    value={infraDbHostOrUri}
                    onChange={(e) => setInfraDbHostOrUri(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-purple-300 text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">URL Consola / Dashboard Supabase</label>
                  <input
                    type="url"
                    placeholder="https://supabase.com/dashboard/project/..."
                    value={infraDbDashboard}
                    onChange={(e) => setInfraDbDashboard(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Copias de Seguridad & Carpeta Google Drive */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderArchive className="w-4 h-4" /> Copias de Seguridad & Carpeta en Nube
                  </span>
                  {infraDriveFolderUrl && (
                    <a
                      href={infraDriveFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition"
                    >
                      <span>Abrir Google Drive</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Enlace a Carpeta del Proyecto en Google Drive / Dropbox
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={infraDriveFolderUrl}
                    onChange={(e) => setInfraDriveFolderUrl(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Frecuencia de Backup</label>
                    <select
                      value={infraBackupFrequency}
                      onChange={(e) => setInfraBackupFrequency(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Diario">Diario</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Quincenal">Quincenal</option>
                      <option value="Mensual">Mensual</option>
                      <option value="Automático Nube">Automático Nube</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Fecha Último Backup</label>
                    <input
                      type="date"
                      value={infraLastBackupDate}
                      onChange={(e) => setInfraLastBackupDate(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Qué se respalda / Notas del Backup
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Dump SQL .sql.gz + .zip del código fuente y assets en Google Drive"
                    value={infraBackupNotes}
                    onChange={(e) => setInfraBackupNotes(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Grid 3: Correos Asociados & Notificaciones */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> Correos Asociados & Email Transaccional
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Correo Propietario / Cuenta Asociada
                  </label>
                  <input
                    type="email"
                    placeholder="palacioalexander51@gmail.com"
                    value={infraAssociatedEmail}
                    onChange={(e) => setInfraAssociatedEmail(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Servicio Transaccional
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Resend, SendGrid, Google Workspace SMTP"
                    value={infraEmailProvider}
                    onChange={(e) => setInfraEmailProvider(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Remitente Notificaciones (From)
                  </label>
                  <input
                    type="email"
                    placeholder="notificaciones@edugest.rd"
                    value={infraTransactionalSender}
                    onChange={(e) => setInfraTransactionalSender(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Llavero de Credenciales & Llaves API */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-emerald-400" />
                    Llavero de Credenciales & Llaves API ({infraCredentials.length})
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Contraseñas de bases de datos, tokens de despliegue y API keys con revelación segura y copia rápida.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingCredential(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white border border-emerald-500/30 font-bold text-xs shadow transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Agregar Credencial</span>
                </button>
              </div>

              {/* Formulario para agregar credencial */}
              {isAddingCredential && (
                <form
                  onSubmit={handleAddCredential}
                  className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Nueva Credencial / Llave API
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingCredential(false)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Servicio / Sistema *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Supabase DB Root, Resend API Key"
                        value={newCredService}
                        onChange={(e) => setNewCredService(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Usuario / Correo</label>
                      <input
                        type="text"
                        placeholder="Ej: palacioalexander51@gmail.com"
                        value={newCredUser}
                        onChange={(e) => setNewCredUser(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Contraseña / Token *</label>
                      <input
                        type="text"
                        required
                        placeholder="•••••••••• o re_123456..."
                        value={newCredPassword}
                        onChange={(e) => setNewCredPassword(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Dashboard URL (Opcional)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newCredDashboard}
                        onChange={(e) => setNewCredDashboard(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Notas / Instrucción</label>
                      <input
                        type="text"
                        placeholder="Ej: Llave de producción, no compartir"
                        value={newCredNotes}
                        onChange={(e) => setNewCredNotes(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddingCredential(false)}
                      className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                    >
                      Guardar Credencial
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de Credenciales */}
              {infraCredentials.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  No hay credenciales registradas. Haz clic en <strong className="text-emerald-400">+ Agregar Credencial</strong> para guardar contraseñas y llaves de acceso.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {infraCredentials.map((cred) => {
                    const isVisible = showPasswordMap[cred.id];
                    return (
                      <div
                        key={cred.id}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-slate-700 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="font-bold text-white text-xs flex items-center gap-1.5">
                              <Lock className="w-3 h-3 text-emerald-400" />
                              {cred.service}
                            </span>
                            {cred.emailOrUser && (
                              <span className="text-[11px] text-slate-400 font-mono block">
                                {cred.emailOrUser}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {cred.dashboardUrl && (
                              <a
                                href={cred.dashboardUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-lg text-slate-500 hover:text-cyan-400 transition"
                                title="Abrir Dashboard"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveCredential(cred.id)}
                              className="p-1 rounded-lg text-slate-600 hover:text-rose-400 transition"
                              title="Eliminar credencial"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Valor de contraseña o token */}
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-2">
                          <span className="text-xs font-mono text-emerald-300 truncate">
                            {isVisible ? cred.passwordOrKey : '••••••••••••••••••••'}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(cred.id)}
                              className="p-1 text-slate-400 hover:text-white transition"
                              title={isVisible ? 'Ocultar' : 'Ver'}
                            >
                              {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(cred.passwordOrKey, cred.id)}
                              className="p-1 text-slate-400 hover:text-emerald-300 transition"
                              title="Copiar contraseña"
                            >
                              {copiedId === cred.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {cred.notes && (
                          <span className="text-[10px] text-slate-500 italic block">{cred.notes}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sección: Respaldo de Variables de Entorno (.env) */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-4 h-4" /> Respaldo de Variables de Entorno (.env)
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Guarda una copia de tu archivo <span className="font-mono text-amber-300">.env.production</span> para restaurar el SaaS en un nuevo computador en segundos.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEnvVisible(!isEnvVisible)}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 flex items-center gap-1 transition"
                  >
                    {isEnvVisible ? <EyeOff className="w-3 h-3 text-slate-400" /> : <Eye className="w-3 h-3 text-slate-400" />}
                    <span>{isEnvVisible ? 'Ocultar .env' : 'Mostrar .env'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(infraEnvBackupText, 'env-copy')}
                    className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-[11px] font-bold text-amber-300 flex items-center gap-1 transition"
                  >
                    {copiedId === 'env-copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'env-copy' ? '¡Copiado!' : 'Copiar .env'}</span>
                  </button>
                </div>
              </div>

              {isEnvVisible ? (
                <textarea
                  rows={6}
                  placeholder={`DATABASE_URL=postgresql://...\nNEXT_PUBLIC_SUPABASE_URL=https://...\nRESEND_API_KEY=re_...\nNEXTAUTH_SECRET=...`}
                  value={infraEnvBackupText}
                  onChange={(e) => setInfraEnvBackupText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-amber-500 placeholder-slate-600"
                />
              ) : (
                <div
                  onClick={() => setIsEnvVisible(true)}
                  className="p-4 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center cursor-pointer hover:border-slate-700 transition"
                >
                  <span className="text-xs text-slate-400 flex items-center justify-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Contenido del archivo .env oculto por seguridad. Haz clic para revelar y editar.
                  </span>
                </div>
              )}
            </div>

            {/* Sección: Protocolo de Recuperación ante Desastres (Disaster Recovery Notes) */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4" /> Protocolo de Recuperación ante Desastres (Paso a Paso)
              </span>
              <p className="text-[11px] text-slate-400">
                Anota el checklist exacto para levantar este SaaS si te roban la laptop o necesitas delegar la restauración a otro desarrollador:
              </p>
              <textarea
                rows={3}
                placeholder="1. Clonar repositorio desde GitHub.&#10;2. Copiar variables de entorno del bloque .env de esta bóveda.&#10;3. Ejecutar 'npm install' y verificar conexión a Supabase.&#10;4. En caso de pérdida total, restaurar el último dump de BD desde la carpeta de Google Drive."
                value={infraRecoveryNotes}
                onChange={(e) => setInfraRecoveryNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* BARRA INFERIOR DE GUARDADO */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              ¿Listo con la definición de <strong>{descName}</strong>? Guarda para sincronizar en tiempo real el Radar.
            </span>
            <button
              type="button"
              onClick={handleSaveProductDescription}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition active:scale-95 shrink-0"
            >
              {descSaveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>¡Cambios guardados!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Definición del SaaS</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 1: ETAPAS DE DESARROLLO CON LISTAS DESPLEGABLES Y % EN VIVO      */}
      {/* ========================================================================= */}
      {activeTab === 'stages' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Rocket className="w-4 h-4 text-indigo-400" />
                <span>Ruta de Desarrollo & Checklists por Etapa</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Despliega cada etapa para cotejar las tareas logradas. Puedes abrir y revisar cualquier etapa libremente.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Etapa Oficial:</span>
              <span className={`px-2.5 py-1 rounded-xl font-bold border ${currentStageObj.color}`}>
                Paso {currentStageObj.step}: {currentStageObj.label}
              </span>
            </div>
          </div>

          {/* LISTA DE LAS 5 ETAPAS DESPLEGABLES */}
          <div className="space-y-3">
            {CANONICAL_STAGE_DEFINITIONS.map((stageDef) => {
              const isCurrent = stageDef.step === currentStageObj.step;
              const isExpanded = expandedStageStep === stageDef.step;

              // Obtener items con estado completado y notas
              const itemsWithStatus = stageDef.items.map((item) => {
                const existing = product.stageChecklists?.find(
                  (chk) => chk.id === `${product.id}-${item.id}` || chk.label === item.label
                );
                return {
                  ...item,
                  completed: existing ? existing.completed : false,
                  notes: existing?.notes || '',
                  updatedAt: existing?.updatedAt,
                };
              });

              const completedCount = itemsWithStatus.filter((i) => i.completed).length;
              const totalCount = itemsWithStatus.length;
              const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <div
                  key={stageDef.id}
                  className={`rounded-3xl border transition overflow-hidden ${
                    isCurrent
                      ? 'bg-slate-900/90 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/20'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  {/* Encabezado de la Etapa (Clic para desplegar/plegar) */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none">
                    <div
                      className="flex items-center gap-3.5 flex-1"
                      onClick={() => setExpandedStageStep(isExpanded ? 0 : stageDef.step)}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${
                          isCurrent
                            ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                            : progressPct === 100
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {progressPct === 100 ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          stageDef.step
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-white">
                            {stageDef.label}
                          </h3>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                              Etapa Actual del SaaS
                            </span>
                          )}
                          {progressPct === 100 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              100% Completada
                            </span>
                          )}
                        </div>

                        {/* Barra de Progreso y conteo */}
                        <div className="flex items-center gap-3 mt-1.5 max-w-md">
                          <div className="flex-1 h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                            <div
                              style={{ width: `${progressPct}%` }}
                              className={`h-full rounded-full transition-all duration-300 ${
                                progressPct === 100
                                  ? 'bg-emerald-400'
                                  : progressPct >= 50
                                  ? 'bg-indigo-400'
                                  : 'bg-amber-400'
                              }`}
                            />
                          </div>
                          <span className="text-xs font-bold text-white shrink-0">
                            {progressPct}% ({completedCount}/{totalCount})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción rápida en la etapa */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {!isCurrent && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeProductStageQuick(product.id, stageDef.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
                          title="Fijar como la etapa en la que se encuentra el SaaS actualmente"
                        >
                          Fijar como Actual
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedStageStep(isExpanded ? 0 : stageDef.step)}
                        className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
                        title={isExpanded ? 'Contraer checklist' : 'Desplegar checklist'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* CHECKLIST INTERACTIVO DESPLEGADO */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 bg-slate-950/60 border-t border-slate-800/80 space-y-2.5 animate-in fade-in">
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Tareas & Requerimientos Clave (Coteja y añade notas/bitácora):
                        </span>
                        <span className="text-xs text-indigo-400 font-semibold">
                          Progreso: {progressPct}%
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {itemsWithStatus.map((item) => {
                          const chkId = `${product.id}-${item.id}`;
                          const isEditingThisNote = editingNoteChkId === chkId;

                          return (
                            <div
                              key={item.id}
                              className={`p-3.5 rounded-2xl border transition text-left flex flex-col justify-between ${
                                item.completed
                                  ? 'bg-emerald-950/20 border-emerald-600/30 text-slate-200'
                                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div
                                onClick={() => toggleChecklistItem(product.id, chkId, item.label, stageDef.id)}
                                className="flex items-start gap-3 cursor-pointer select-none"
                              >
                                <button
                                  type="button"
                                  className={`w-5 h-5 rounded-lg flex items-center justify-center mt-0.5 shrink-0 transition border ${
                                    item.completed
                                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                                      : 'bg-slate-950 border-slate-700 hover:border-slate-500'
                                  }`}
                                >
                                  {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </button>

                                <div className="flex-1 min-w-0">
                                  <span
                                    className={`text-xs font-bold block ${
                                      item.completed ? 'text-white line-through opacity-85' : 'text-slate-200'
                                    }`}
                                  >
                                    {item.label}
                                  </span>
                                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                    {item.description}
                                  </p>
                                </div>
                              </div>

                              {/* NOTA / REGISTRO DE ESTE HITO */}
                              <div className="mt-2.5 pt-2 border-t border-slate-800/60">
                                {isEditingThisNote ? (
                                  <div
                                    className="p-2.5 rounded-xl bg-slate-950 border border-indigo-500/50 space-y-2 animate-in fade-in"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                                        <FileText className="w-3 h-3 text-indigo-400" />
                                        Bitácora / Nota de este hito:
                                      </span>
                                    </div>
                                    <textarea
                                      rows={2}
                                      value={currentNoteText}
                                      onChange={(e) => setCurrentNoteText(e.target.value)}
                                      placeholder="Guarda detalles, acuerdos, fechas o avances sobre este hito..."
                                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                                      autoFocus
                                    />
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setEditingNoteChkId(null)}
                                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition"
                                      >
                                        Cancelar
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateChecklistItemNote(product.id, chkId, currentNoteText.trim(), item.label, stageDef.id);
                                          setEditingNoteChkId(null);
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition flex items-center gap-1 shadow-sm"
                                      >
                                        <Save className="w-3 h-3" />
                                        <span>Guardar nota</span>
                                      </button>
                                    </div>
                                  </div>
                                ) : item.notes ? (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 rounded-xl bg-slate-950/80 border border-amber-500/30 text-slate-300 text-[11px] flex items-start gap-2"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-0.5">
                                        <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider">
                                          Registro Guardado
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingNoteChkId(chkId);
                                            setCurrentNoteText(item.notes || '');
                                          }}
                                          className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                                        >
                                          <Edit3 className="w-2.5 h-2.5" />
                                          <span>Editar</span>
                                        </button>
                                      </div>
                                      <p className="text-slate-300 text-[11px] leading-relaxed whitespace-pre-wrap break-words">
                                        {item.notes}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingNoteChkId(chkId);
                                        setCurrentNoteText('');
                                      }}
                                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-400 transition"
                                    >
                                      <FileText className="w-3 h-3" />
                                      <span>+ Agregar nota / registro</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 2: CLIENTES ACTIVOS (SLIM, RECTANGULAR Y HORIZONTAL)              */}
      {/* ========================================================================= */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          {/* Barra Superior de Clientes Activos */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>Cartera de Clientes Activos</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">
                    {projectCustomers.length} empresas
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {effectiveUsersCount.toLocaleString()} usuarios finales &bull; ${mrr.toLocaleString()} MRR recurrente
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAddCustModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm ml-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Agregar Cliente Activo</span>
            </button>
          </div>

          {/* Tarjetas de Resumen Rápido */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Empresas Clientes</span>
                <p className="text-base font-black text-white">{projectCustomers.length} empresas</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Usuarios Finales Totales</span>
                <p className="text-base font-black text-cyan-400">{effectiveUsersCount.toLocaleString()} personas</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">MRR Mensual Aportado</span>
                <p className="text-base font-black text-emerald-400">${mrr.toLocaleString()} / mes</p>
              </div>
            </div>
          </div>

          {/* LISTA ADAPTABLE DE CLIENTES ACTIVOS: RECTÁNGULOS HORIZONTALES SLIM */}
          {projectCustomers.length === 0 ? (
            <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <Building className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-white">No tienes clientes activos registrados todavía para este SaaS</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Haz clic en el botón de arriba para registrar tu primera empresa cliente con sus usuarios y enlace de WhatsApp.
              </p>
              <button
                onClick={() => setIsAddCustModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Primer Cliente Activo</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {projectCustomers.map((c) => {
                const cleanPhone = (c.whatsapp || c.phone || '').replace(/\D/g, '');
                const waLink = `https://wa.me/${cleanPhone}`;
                const billingInfo = getBillingStatus(c.billingDay || 5);
                const reminderWaLink = getCollectionWhatsAppLink(c, product.name);

                return (
                  <div
                    key={c.id}
                    className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-center gap-1 shadow-sm group"
                  >
                    {/* Línea 1: Identidad (Nombre, Ciudad, Contacto) + Acciones Rápidas */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-5 h-5 rounded-md bg-emerald-500/15 text-emerald-400 font-black text-[10px] flex items-center justify-center shrink-0 border border-emerald-500/25">
                          {c.name.charAt(0)}
                        </div>
                        <h4
                          onClick={() => setSelectedCustomerFicha(c)}
                          className="text-xs font-bold text-white hover:text-indigo-300 cursor-pointer truncate max-w-[180px] sm:max-w-xs transition"
                          title="Clic para abrir ficha completa"
                        >
                          {c.name}
                        </h4>
                        <span className="text-slate-600 hidden sm:inline">&bull;</span>
                        <span className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                          <MapPin className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                          <span>{c.city || 'Santo Domingo'}</span>
                        </span>
                        {c.contactPerson && (
                          <>
                            <span className="text-slate-600 hidden md:inline">&bull;</span>
                            <span className="text-[10px] sm:text-[11px] text-slate-400 truncate hidden md:inline">
                              {c.contactPerson}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Botones de acción compactos */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Botón Proceso */}
                        {(() => {
                          const steps = c.processSteps && c.processSteps.length > 0 ? c.processSteps : createDefaultCustomerOnboardingSteps();
                          const completedCount = steps.filter((s) => s.completed).length;
                          const totalCount = steps.length;
                          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                          return (
                            <button
                              type="button"
                              onClick={() => setSelectedCustomerForProcess(c)}
                              className="px-2 py-0.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold flex items-center gap-1 transition"
                              title="Ver y gestionar etapas del proceso de onboarding"
                            >
                              <ListChecks className="w-3 h-3 text-indigo-400" />
                              <span>{completedCount}/{totalCount} · {pct}%</span>
                            </button>
                          );
                        })()}

                        {/* Botón Recordatorio WhatsApp */}
                        <a
                          href={reminderWaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 sm:px-2 sm:py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 transition"
                          title="Enviar recordatorio formal de cobro por WhatsApp"
                        >
                          <Bell className="w-3 h-3" />
                          <span className="hidden md:inline">Cobro</span>
                        </a>

                        {/* Botón WhatsApp Directo */}
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 sm:px-2 sm:py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 transition shadow-sm"
                          title={`Chatear por WhatsApp con ${c.contactPerson}`}
                        >
                          <MessageCircle className="w-3 h-3 fill-white" />
                          <span className="hidden md:inline">WhatsApp</span>
                        </a>

                        {/* Botón Ficha Detallada */}
                        <button
                          type="button"
                          onClick={() => setSelectedCustomerFicha(c)}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold flex items-center gap-1 transition border border-slate-700/60"
                          title="Abrir ficha con todos los detalles del negocio"
                        >
                          <FileText className="w-3 h-3 text-cyan-400" />
                          <span>Ficha</span>
                        </button>

                        {/* Editar */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditCustomer(c)}
                          className="p-1 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition"
                          title="Editar datos del negocio cliente"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>

                        {/* Eliminar */}
                        <button
                          onClick={() => deleteCustomer(c.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                          title="Eliminar cliente"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Línea 2: Métricas en una sola línea de texto pequeña */}
                    <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400 overflow-x-auto no-scrollbar whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                        <span className="text-slate-500">Contrato:</span>
                        <strong className="text-slate-300 font-semibold">{c.contractStartDate || c.startDate || 'No fijada'}</strong>
                      </span>
                      <span className="text-slate-700">&bull;</span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                        <span className="text-slate-500">Cobro:</span>
                        <strong className="text-amber-300 font-bold">Día {c.billingDay || 5}</strong>
                        <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-semibold ${billingInfo.badgeClass}`}>
                          {billingInfo.label}
                        </span>
                      </span>
                      <span className="text-slate-700">&bull;</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                        <strong className="text-cyan-300 font-bold">{(c.usersCount || 1).toLocaleString()}</strong>
                        <span className="text-slate-500">usuarios</span>
                      </span>
                      <span className="text-slate-700">&bull;</span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        <strong className="text-emerald-300 font-bold">${(c.mrr || 0).toLocaleString()}</strong>
                        <span className="text-slate-500">/mes</span>
                      </span>
                      {c.plan && (
                        <>
                          <span className="text-slate-700">&bull;</span>
                          <span className="text-slate-500 truncate max-w-[130px]">{c.plan}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 3: PROSPECTOS & RADAR B2B (CON RADAR Y MAPA GEOGRÁFICO)           */}
      {/* ========================================================================= */}
      {activeTab === 'leads' && (
        <div className="space-y-5">
          {/* Sub-Navegación de Prospectos y Acciones */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setLeadsSubTab('radar')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                  leadsSubTab === 'radar'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Cartera & Radar ({projectLeads.length})</span>
              </button>

              <button
                onClick={() => setLeadsSubTab('map')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                  leadsSubTab === 'map'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>🗺️ Google Maps & Centros ({projectCustomers.length + projectLeads.length})</span>
              </button>

              <button
                onClick={() => setLeadsSubTab('viewed')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                  leadsSubTab === 'viewed'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>👀 Centros Vistos ({viewedCenters.filter((c) => c.status === 'visto').length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setIsAddLeadModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Agregar Prospecto</span>
              </button>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>📥 Pegar Lista</span>
              </button>
            </div>
          </div>

          {/* Notificación Toast de Centros Vistos */}
          {viewedSuccessToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{viewedSuccessToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setViewedSuccessToast(null)}
                className="text-emerald-400 hover:text-white text-xs p-1 rounded-lg hover:bg-emerald-500/20 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* SUB-PANTALLA A: PROSPECTOS CON MOTOR INTELIGENTE Y RADAR POR CIUDAD   */}
          {/* --------------------------------------------------------------------- */}
          {leadsSubTab === 'radar' && (
            <div className="space-y-6">
              {/* MOTOR INTELIGENTE CON RADAR GEOGRÁFICO */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>Motor Inteligente de Sugerencias B2B & Radar Geográfico</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Identifica automáticamente negocios cualificados para <strong>{product.name}</strong> según la ciudad.
                    </p>
                  </div>

                  {/* Selector de Ciudad */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      Ciudad:
                    </span>
                    <select
                      value={selectedCity}
                      onChange={(e) => {
                        setSelectedCity(e.target.value);
                        setSelectedPin(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                    >
                      {CITY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* BARRA LIMPIA Y COMPACTA: EL RADAR SE ALIMENTA DE LA DEFINICIÓN DEL SAAS */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Mercado: {product.targetAudience || targetAudience.nicheShort}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('description')}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-300 font-medium transition underline"
                      title="Editar la definición, módulos activos, precios y mercado en la pestaña Descripción"
                    >
                      <FileText className="w-3 h-3 text-indigo-400" />
                      <span>Configurar en pestaña Descripción</span>
                    </button>
                  </div>

                  {/* Botón de Escaneo en Vivo en Google Maps */}
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(`${product.targetSearchKeywords || targetAudience.googleSearchQuery} en ${selectedCity}, Republica Dominicana`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition shrink-0"
                    title={`Abrir búsqueda real en Google Maps para ${product.targetSearchKeywords || targetAudience.googleSearchQuery} en ${selectedCity}`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Escanear en Google Maps ({selectedCity})</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* RADAR / MAPA GEOGRÁFICO ESTILIZADO */}
                  <div className="lg:col-span-5 rounded-2xl bg-slate-950 border border-slate-800 p-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
                    {/* Anillos de Radar / Coordenadas */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 rounded-full border border-indigo-500/20" />
                      <div className="w-36 h-36 rounded-full border border-indigo-500/30" />
                      <div className="w-20 h-20 rounded-full border border-indigo-500/40" />
                      <div className="absolute w-full h-[1px] bg-indigo-500/10" />
                      <div className="absolute h-full w-[1px] bg-indigo-500/10" />
                    </div>

                    {/* Coordenadas de Ciudad */}
                    <div className="absolute top-2.5 left-3 text-[10px] font-mono text-indigo-400 flex items-center gap-1">
                      <Compass className="w-3 h-3 animate-spin" style={{ animationDuration: '10s' }} />
                      <span>RADAR B2B: {selectedCity.toUpperCase()}</span>
                    </div>

                    {/* Pines Geolocalizados Interactivos en el Radar */}
                    {currentCitySuggestions.map((sug) => {
                      const isSelected = selectedPin?.id === sug.id;

                      return (
                        <div
                          key={sug.id}
                          style={{
                            top: `${sug.latRatio}%`,
                            left: `${sug.lngRatio}%`,
                          }}
                          onClick={() => setSelectedPin(sug)}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                        >
                          <span className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                            <span
                              className={`relative inline-flex rounded-full h-4 w-4 border-2 border-slate-950 items-center justify-center ${
                                isSelected ? 'bg-amber-400 scale-125' : 'bg-indigo-500'
                              }`}
                            />
                          </span>

                          {/* Tooltip flotante en hover */}
                          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[10px] text-white shadow-xl z-20 pointer-events-none">
                            {sug.name} ({sug.sector})
                          </div>
                        </div>
                      );
                    })}

                    <div className="absolute bottom-2 right-3 text-[10px] text-slate-500">
                      {currentCitySuggestions.length} centros reales
                    </div>
                  </div>

                  {/* LISTA DE SUGERENCIAS CUALIFICADAS POR EL MOTOR */}
                  <div className="lg:col-span-7 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Oportunidades Reales en {selectedCity} ({currentCitySuggestions.length}):
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRealCenterName('');
                            setRealCenterSector('');
                            setRealCenterPhone('');
                            setRealCenterContact('');
                            setRealCenterUsers(350);
                            setRealCenterReason('');
                            setIsAddRealCenterModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-[11px] flex items-center gap-1 transition shrink-0"
                          title="Registrar una institución real encontrada en Google Maps o en tu ciudad"
                        >
                          <Plus className="w-3 h-3 text-indigo-400" />
                          <span>+ Registrar Real</span>
                        </button>
                      </div>
                    </div>

                    {/* Barra de Filtro en Vivo */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={radarSearchQuery}
                        onChange={(e) => setRadarSearchQuery(e.target.value)}
                        placeholder={`Buscar por nombre, sector o contacto en ${selectedCity}...`}
                        className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                      {radarSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setRadarSearchQuery('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Resultados del Radar: CERO MUESTRAS FALSAS */}
                    {currentCitySuggestions.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-3">
                        <div className="w-10 h-10 mx-auto rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                          <MapPin className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            {radarSearchQuery
                              ? `No hay coincidencias con "${radarSearchQuery}" en ${selectedCity}`
                              : `No hay instituciones pre-cargadas para ${selectedCity}`}
                          </h4>
                          <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1">
                            {radarSearchQuery
                              ? 'Prueba con otra palabra clave o limpia el filtro de búsqueda.'
                              : `Usa el escaneo en vivo de Google Maps para explorar ${targetAudience.nicheShort.toLowerCase()} en ${selectedCity}, o añade una que conozcas.`}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                          <a
                            href={`https://www.google.com/maps/search/${encodeURIComponent(`${targetAudience.googleSearchQuery} en ${selectedCity}, Republica Dominicana`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                          >
                            <Search className="w-3.5 h-3.5" />
                            <span>Escanear en Google Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setRealCenterName('');
                              setRealCenterSector('');
                              setRealCenterPhone('');
                              setRealCenterContact('');
                              setRealCenterUsers(350);
                              setRealCenterReason('');
                              setIsAddRealCenterModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5 text-indigo-400" />
                            <span>+ Registrar Institución</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {currentCitySuggestions.map((sug) => {
                          const isSelected = selectedPin?.id === sug.id;
                          const isAlreadyLead = projectLeads.some(
                            (l) => l.institutionOrCompany.toLowerCase() === sug.name.toLowerCase()
                          );
                          const isAlreadyViewed = viewedCenters.some(
                            (v) => v.name.toLowerCase() === sug.name.toLowerCase()
                          );

                          return (
                            <div
                              key={sug.id}
                              className={`p-3 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                isSelected
                                  ? 'bg-indigo-950/40 border-indigo-500 text-white'
                                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white text-xs">{sug.name}</span>
                                  <span className="px-1.5 py-0.2 rounded-md bg-slate-800 text-slate-400 text-[10px]">
                                    {sug.sector}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                  {sug.contactName} {sug.phone ? `• ${sug.phone}` : ''}
                                </p>
                                <p className="text-[10px] text-amber-400/90 font-medium">{sug.matchReason}</p>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                <span className="text-[11px] font-bold text-cyan-400 whitespace-nowrap">
                                  ~{sug.potentialUsers} {targetAudience.metricLabel.split(' ')[0]}
                                </span>

                                {/* Botón Marcar Visto */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMarkAsViewed({
                                      name: sug.name,
                                      city: sug.city || selectedCity,
                                      sector: sug.sector,
                                      phone: sug.phone,
                                      contactName: sug.contactName,
                                      potentialUsers: sug.potentialUsers,
                                      notes: `Detectado en el Radar B2B de ${sug.city || selectedCity}. ${sug.matchReason}`,
                                    })
                                  }
                                  disabled={isAlreadyViewed}
                                  className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition border ${
                                    isAlreadyViewed
                                      ? 'bg-slate-900 border-slate-800 text-amber-400/80 cursor-default'
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                                  }`}
                                  title={isAlreadyViewed ? 'Ya enlistado como visto' : 'Enlistar en centros vistos'}
                                >
                                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{isAlreadyViewed ? '✓ Visto' : '👀 Visto'}</span>
                                </button>

                                {/* Botón Agregar a Prospectos */}
                                {isAlreadyLead ? (
                                  <span className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-emerald-400 text-xs font-bold border border-emerald-500/30 whitespace-nowrap">
                                    ✓ En Prospectos
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleAddSmartProspect(sug)}
                                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 transition shadow-sm whitespace-nowrap"
                                    title="Agregar a mi lista de prospectos en 1 clic"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>+ Prospecto</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* LISTA ACTUAL DE PROSPECTOS EN SEGUIMIENTO Y PIPELINE DE VENTA */}
              {(() => {
                const pipelineLeads = projectLeads.filter((l) => l.inSalesPipeline);
                const displayedLeads = leadViewMode === 'pipeline' ? pipelineLeads : projectLeads;

                return (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Target className="w-4 h-4 text-purple-400" />
                          <span>Cartera de Negocios y Ventas ({displayedLeads.length})</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {leadViewMode === 'pipeline'
                            ? 'Mostrando solo los negocios que seleccionaste para llevar activamente el proceso comercial de venta.'
                            : 'Mostrando todos los posibles clientes registrados en tu cartera.'}
                        </p>
                      </div>

                      {/* SELECTOR ENTRE TODOS Y EN PROCESO ACTIVO DE VENTA */}
                      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs shrink-0 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setLeadViewMode('all')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                            leadViewMode === 'all'
                              ? 'bg-slate-700 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Building className="w-3.5 h-3.5" />
                          <span>Todos los Negocios ({projectLeads.length})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeadViewMode('pipeline')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                            leadViewMode === 'pipeline'
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>En Proceso de Venta ({pipelineLeads.length})</span>
                        </button>
                      </div>
                    </div>

                    {displayedLeads.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 space-y-2">
                        <Target className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="font-semibold text-white">
                          {leadViewMode === 'pipeline'
                            ? 'No has seleccionado prospectos para el Proceso Activo de Venta todavía.'
                            : 'No tienes prospectos guardados aún.'}
                        </p>
                        <p className="text-slate-500">
                          {leadViewMode === 'pipeline'
                            ? 'Haz clic en "Todos los Negocios" y presiona "+ Llevar Proceso" en los negocios que deseas priorizar.'
                            : 'Usa el radar de arriba o agrega uno manualmente para comenzar.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {displayedLeads.map((lead) => {
                          const cleanPhone = (lead.whatsapp || lead.phone || '').replace(/\D/g, '');
                          const waLink = `https://wa.me/${cleanPhone}`;
                          const steps = lead.processSteps && lead.processSteps.length > 0 ? lead.processSteps : createDefaultLeadSalesSteps();
                          const completedCount = steps.filter((s) => s.completed).length;
                          const totalCount = steps.length;
                          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                          const leadTitle = lead.institutionOrCompany || lead.name;

                          return (
                            <div
                              key={lead.id}
                              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border transition flex flex-col justify-center gap-1 shadow-sm group ${
                                lead.inSalesPipeline
                                  ? 'bg-slate-900/90 border-purple-500/40 hover:border-purple-500/60'
                                  : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                              }`}
                            >
                              {/* Línea 1: Estado + Nombre + Ciudad + Contacto + Acciones Rápidas */}
                              <div className="flex items-center justify-between gap-2 min-w-0">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleLeadPipeline(lead)}
                                    className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold transition flex items-center gap-1 shrink-0 ${
                                      lead.inSalesPipeline
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                                    }`}
                                    title={lead.inSalesPipeline ? 'En proceso activo de venta (clic para quitar)' : 'Clic para incluir en proceso activo de venta'}
                                  >
                                    <Target className="w-2.5 h-2.5 text-purple-400" />
                                    <span>{lead.inSalesPipeline ? 'Activo' : '+ Proceso'}</span>
                                  </button>

                                  <h4
                                    onClick={() => setSelectedLeadFicha(lead)}
                                    className="text-xs font-bold text-white hover:text-purple-300 cursor-pointer truncate max-w-[180px] sm:max-w-xs transition"
                                    title="Clic para abrir ficha completa del prospecto"
                                  >
                                    {leadTitle}
                                  </h4>

                                  <span className="text-slate-600 hidden sm:inline">&bull;</span>
                                  <span className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                                    <MapPin className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                                    <span>{lead.city || 'Santo Domingo'}</span>
                                  </span>

                                  {lead.institutionOrCompany && lead.name && lead.name !== lead.institutionOrCompany && (
                                    <>
                                      <span className="text-slate-600 hidden md:inline">&bull;</span>
                                      <span className="text-[10px] sm:text-[11px] text-slate-400 truncate hidden md:inline">
                                        {lead.name}
                                      </span>
                                    </>
                                  )}
                                </div>

                                {/* Botones compactos */}
                                <div className="flex items-center gap-1 shrink-0">
                                  {/* Botón Proceso */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedLeadForProcess(lead)}
                                    className="px-2 py-0.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1 transition"
                                    title="Abrir ventanilla de proceso de ventas de este negocio"
                                  >
                                    <ListChecks className="w-3 h-3 text-purple-400" />
                                    <span>{completedCount}/{totalCount} · {pct}%</span>
                                  </button>

                                  {/* WhatsApp */}
                                  {cleanPhone && (
                                    <a
                                      href={waLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1 sm:px-2 sm:py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 transition shadow-sm"
                                      title={`Chatear por WhatsApp con ${lead.name}`}
                                    >
                                      <MessageCircle className="w-3 h-3 fill-white" />
                                      <span className="hidden md:inline">WhatsApp</span>
                                    </a>
                                  )}

                                  {/* Botón Activar / Convertir */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setLeadToConvert(lead);
                                      setConvertAmount(lead.estimatedValue || 120);
                                      setConvertUsers(200);
                                    }}
                                    className="px-2 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold flex items-center gap-1 transition shadow-sm"
                                    title="Convertir a cliente activo"
                                  >
                                    <span>✨ Activar</span>
                                  </button>

                                  {/* Ficha */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedLeadFicha(lead)}
                                    className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold flex items-center gap-1 transition border border-slate-700/60"
                                    title="Abrir ficha con todos los detalles del prospecto"
                                  >
                                    <FileText className="w-3 h-3 text-purple-400" />
                                    <span>Ficha</span>
                                  </button>

                                  {/* Editar */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditLead(lead)}
                                    className="p-1 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition"
                                    title="Editar datos del prospecto"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>

                                  {/* Eliminar */}
                                  <button
                                    type="button"
                                    onClick={() => deleteLead(lead.id)}
                                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                                    title="Eliminar prospecto"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Línea 2: Métricas en una sola línea de texto pequeña */}
                              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400 overflow-x-auto no-scrollbar whitespace-nowrap">
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 shrink-0">
                                  {lead.status}
                                </span>
                                <span className="text-slate-700">&bull;</span>
                                <span className="flex items-center gap-1">
                                  <span className="text-slate-500">Valor est.:</span>
                                  <strong className="text-emerald-400 font-bold">${lead.estimatedValue || 0}/mes</strong>
                                </span>
                                {lead.contactedAt && (
                                  <>
                                    <span className="text-slate-700">&bull;</span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                                      <span className="text-slate-500">Contactado:</span>
                                      <span className="text-slate-300">{lead.contactedAt}</span>
                                    </span>
                                  </>
                                )}
                                {lead.followUpDate && (
                                  <>
                                    <span className="text-slate-700">&bull;</span>
                                    <span className="flex items-center gap-1 text-amber-300">
                                      <Clock className="w-2.5 h-2.5 shrink-0" />
                                      <span className="text-slate-500">Seguimiento:</span>
                                      <span className="font-semibold">{lead.followUpDate}</span>
                                    </span>
                                  </>
                                )}
                                {lead.notes && (
                                  <>
                                    <span className="text-slate-700">&bull;</span>
                                    <span className="text-slate-400 truncate max-w-[280px]" title={lead.notes}>
                                      "{lead.notes}"
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ===================================================================== */}
          {/* SUB-PANTALLA C: MAPA GEOGRÁFICO DE CENTROS (RD Y MUNDIAL)             */}
          {/* ===================================================================== */}
          {leadsSubTab === 'map' && (
            <div className="space-y-5 animate-in fade-in">
              {(() => {
                // 1. Construir lista unificada de todos los centros para el mapa
                const allCentersList = [
                  ...projectCustomers.map((c) => ({
                    id: c.id,
                    name: c.name,
                    type: 'client' as const,
                    city: c.city || 'Santo Domingo',
                    users: c.usersCount || 1,
                    contactName: c.contactPerson,
                    phone: c.whatsapp || c.phone,
                    mrr: c.mrr,
                    sector: 'Empresa Cliente',
                    coords: resolveCoordinates(c.city || 'Santo Domingo'),
                    rawItem: c,
                  })),
                  ...projectLeads.map((l) => ({
                    id: l.id,
                    name: l.institutionOrCompany || l.name,
                    type: 'lead' as const,
                    city: l.city || 'Santo Domingo',
                    users: (l as any).potentialUsers || 50,
                    contactName: l.name,
                    phone: l.phone,
                    sector: 'Prospecto Calificado',
                    coords: resolveCoordinates(l.city || 'Santo Domingo'),
                    rawItem: l,
                  })),
                  ...currentCitySuggestions.map((s) => ({
                    id: s.id,
                    name: s.name,
                    type: 'suggestion' as const,
                    city: s.city,
                    users: s.potentialUsers,
                    contactName: s.contactName,
                    phone: s.phone,
                    sector: s.sector,
                    matchReason: s.matchReason,
                    coords: resolveCoordinates(s.city),
                    rawItem: s,
                  })),
                ];

                // 2. Filtros activos
                const filteredMapCenters = allCentersList.filter((center) => {
                  if (mapTypeFilter === 'clients' && center.type !== 'client') return false;
                  if (mapTypeFilter === 'leads' && center.type !== 'lead') return false;
                  if (mapTypeFilter === 'suggestions' && center.type !== 'suggestion') return false;

                  if (mapSearchQuery.trim()) {
                    const q = mapSearchQuery.toLowerCase();
                    return (
                      center.name.toLowerCase().includes(q) ||
                      center.city.toLowerCase().includes(q) ||
                      (center.contactName && center.contactName.toLowerCase().includes(q))
                    );
                  }
                  return true;
                });

                // Centros visibles en el mapa según el scope (RD o WORLD)
                const visibleOnMapCenters = filteredMapCenters.filter((c) =>
                  mapScope === 'RD' ? c.coords.isRD : true
                );

                // Centro actualmente seleccionado
                const activeCenter =
                  filteredMapCenters.find((c) => c.id === selectedMapCenterId) ||
                  filteredMapCenters[0] ||
                  null;

                // Métricas consolidadas del mapa
                const totalUsersOnMap = filteredMapCenters.reduce((acc, c) => acc + (c.users || 0), 0);
                const uniqueCitiesCount = new Set(filteredMapCenters.map((c) => c.city)).size;
                const totalMrrOnMap = filteredMapCenters
                  .filter((c) => c.type === 'client')
                  .reduce((acc, c) => acc + (c.mrr || 0), 0);

                // Agrupador para evitar solapamientos exactos de pines
                const cityClusterMap: Record<string, number> = {};

                return (
                  <div className="space-y-4">
                    {/* SELECTOR PRINCIPAL: GOOGLE MAPS REAL VS MAPA DE CLIENTES */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                          <Navigation className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-white">Motor de Geolocalización y Prospección</h4>
                            {mapEngineMode === 'google' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                🗺️ Google Maps Oficial En Vivo
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                                📍 Clientes y Prospectos Registrados
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {mapEngineMode === 'google'
                              ? 'Detección de colegios, liceos y negocios reales en Google Maps con visualización de calles y satélite.'
                              : 'Lienzo territorial de cobertura con clientes activos, prospectos calificados y métricas de MRR.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs shrink-0">
                        <button
                          type="button"
                          onClick={() => setMapEngineMode('google')}
                          className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
                            mapEngineMode === 'google'
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Navigation className="w-3.5 h-3.5 text-blue-200" />
                          <span>Google Maps Real</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMapEngineMode('vector')}
                          className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
                            mapEngineMode === 'vector'
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Map className="w-3.5 h-3.5 text-indigo-200" />
                          <span>Mapa de Clientes</span>
                        </button>
                      </div>
                    </div>

                    {mapEngineMode === 'google' ? (
                      /* ======================================================= */
                      /* MODO A: GOOGLE MAPS REAL EN VIVO                        */
                      /* ======================================================= */
                      <div className="space-y-4">
                        {/* PANEL DE CONTROL DE BÚSQUEDA EN GOOGLE MAPS */}
                        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-blue-500/30 shadow-lg space-y-3">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                            <div>
                              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                <Navigation className="w-5 h-5 text-blue-400" />
                                <span>Detector de Colegios e Instituciones en Google Maps ({selectedCity})</span>
                              </h3>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Conexión directa a Google Maps para encontrar colegios reales, direcciones, teléfonos y valoraciones.
                              </p>
                            </div>

                            {/* Acciones principales de exploración */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-auto">
                              <button
                                type="button"
                                onClick={() => {
                                  setViewedFormCity(selectedCity);
                                  setIsAddViewedModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                                title="Enlistar un centro que viste en Google Maps para guardarlo"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <Eye className="w-3.5 h-3.5" />
                                <span>Enlistar Centro Visto</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setLeadsSubTab('viewed')}
                                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5"
                                title="Ver lista de centros vistos y pasarlos a posibles clientes"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Ver Vistos ({viewedCenters.filter((c) => c.status === 'visto').length})</span>
                              </button>

                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  googleCustomQuery.trim() ||
                                    (product.id === 'edugest'
                                      ? `colegios y centros educativos en ${selectedCity}, Republica Dominicana`
                                      : `empresas y comercios en ${selectedCity}, Republica Dominicana`)
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition flex items-center gap-1.5"
                              >
                                <span>Abrir Google Maps</span>
                                <ExternalLink className="w-3 h-3 text-blue-400" />
                              </a>
                            </div>
                          </div>

                          {/* BARRA DE BÚSQUEDA Y SELECTOR DE CIUDAD */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            {/* Selector de Ciudad */}
                            <div className="md:col-span-4 space-y-1">
                              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-cyan-400" />
                                <span>Ciudad / Territorio</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  list="google-maps-cities-list"
                                  value={selectedCity}
                                  onChange={(e) => {
                                    setSelectedCity(e.target.value);
                                    setGoogleCustomQuery('');
                                  }}
                                  placeholder="Escribe o elige ciudad..."
                                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                                />
                                <datalist id="google-maps-cities-list">
                                  {GLOBAL_CITY_OPTIONS.map((city) => (
                                    <option key={city} value={city} />
                                  ))}
                                </datalist>
                              </div>
                            </div>

                            {/* Búsqueda específica en Google Maps */}
                            <div className="md:col-span-8 space-y-1">
                              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                                <Search className="w-3 h-3 text-blue-400" />
                                <span>Buscar Colegios / Negocios Específicos</span>
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={googleCustomQuery}
                                  onChange={(e) => setGoogleCustomQuery(e.target.value)}
                                  placeholder={
                                    product.id === 'edugest'
                                      ? `Ej: Colegios privados en ${selectedCity}, Colegio Loyola, Carol Morgan...`
                                      : `Ej: Empresas en ${selectedCity}...`
                                  }
                                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 font-semibold"
                                />
                                {googleCustomQuery && (
                                  <button
                                    type="button"
                                    onClick={() => setGoogleCustomQuery('')}
                                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold shrink-0"
                                    title="Restablecer búsqueda automática"
                                  >
                                    Limpiar
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* ========================================== */}
                          {/* FILTROS ACORDE A TUS SAAS REGISTRADOS      */}
                          {/* ========================================== */}
                          <div className="pt-2 border-t border-slate-800/80 space-y-2">
                            {/* Selector de SaaS para filtros */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                <span>Filtros según tus SaaS:</span>
                              </span>
                              {products.map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => setActiveSaaSNicheId(p.id)}
                                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                                    activeSaaSNicheId === p.id
                                      ? 'bg-blue-600 text-white shadow-sm'
                                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                                  }`}
                                >
                                  <span>{p.name}</span>
                                  {p.id === product.id && (
                                    <span className="text-[9px] opacity-75">(Actual)</span>
                                  )}
                                </button>
                              ))}
                            </div>

                            {/* Categorías del SaaS seleccionado */}
                            {(() => {
                              const activeProd = products.find((p) => p.id === activeSaaSNicheId) || product;
                              const nicheData = getProductNicheFilters(activeProd);

                              return (
                                <div className="flex flex-wrap items-center gap-1.5 text-xs pl-2 border-l-2 border-blue-500/30">
                                  <span className="text-[10px] font-semibold text-blue-300/80 mr-1">
                                    {nicheData.title}:
                                  </span>
                                  {nicheData.queries.map((category) => (
                                    <button
                                      key={category}
                                      type="button"
                                      onClick={() =>
                                        setGoogleCustomQuery(
                                          `${category} en ${selectedCity}, Republica Dominicana`
                                        )
                                      }
                                      className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 text-[10px] font-medium transition"
                                    >
                                      {category}
                                    </button>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>

                          {/* ========================================== */}
                          {/* FILTROS PERSONALIZADOS (QUE TÚ CREES)      */}
                          {/* ========================================== */}
                          <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                              <Tag className="w-3 h-3 text-purple-400" />
                              <span>Filtros que creaste:</span>
                            </span>

                            {customMapFilters.map((filter) => (
                              <div
                                key={filter}
                                className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-200 text-[10px] font-medium"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    setGoogleCustomQuery(
                                      `${filter} en ${selectedCity}, Republica Dominicana`
                                    )
                                  }
                                  className="hover:underline hover:text-white"
                                  title="Aplicar este filtro a la búsqueda"
                                >
                                  {filter}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCustomFilter(filter)}
                                  className="text-purple-400 hover:text-rose-400 ml-0.5"
                                  title="Eliminar este filtro"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}

                            {isAddingCustomFilter ? (
                              <div className="inline-flex items-center gap-1">
                                <input
                                  type="text"
                                  value={newCustomFilterInput}
                                  onChange={(e) => setNewCustomFilterInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddCustomFilter();
                                    if (e.key === 'Escape') setIsAddingCustomFilter(false);
                                  }}
                                  placeholder="Ej: Colegios Católicos, Ferreterías..."
                                  className="px-2 py-0.5 rounded-md bg-slate-950 border border-purple-500 text-white text-[10px] focus:outline-none w-48"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={handleAddCustomFilter}
                                  className="px-2 py-0.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold"
                                >
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsAddingCustomFilter(false)}
                                  className="px-1.5 py-0.5 rounded-md text-slate-400 hover:text-white text-[10px]"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setIsAddingCustomFilter(true)}
                                className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white border border-dashed border-purple-500/40 text-[10px] font-bold transition flex items-center gap-1"
                              >
                                <Plus className="w-2.5 h-2.5" />
                                <span>+ Crear Filtro</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* CONTENEDOR DEL MAPA REAL + LATERAL DE COLEGIOS DETECTADOS */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                          {/* GOOGLE MAPS IFRAME (8 COLUMNAS) */}
                          <div className="lg:col-span-8 rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between">
                            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2 text-blue-300 font-bold">
                                <Compass className="w-4 h-4 text-blue-400" />
                                <span className="truncate max-w-md">
                                  Buscando: "
                                  {googleCustomQuery.trim() ||
                                    (product.id === 'edugest'
                                      ? `colegios y centros educativos en ${selectedCity}, Republica Dominicana`
                                      : `empresas y comercios en ${selectedCity}, Republica Dominicana`)}
                                  "
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">
                                Google Maps Real con Zoom y Satélite
                              </span>
                            </div>

                            <div className="w-full h-[520px] relative bg-slate-950">
                              <iframe
                                title="Google Maps Real View"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                  googleCustomQuery.trim() ||
                                    (product.id === 'edugest'
                                      ? `colegios y centros educativos en ${selectedCity}, Republica Dominicana`
                                      : `empresas y comercios en ${selectedCity}, Republica Dominicana`)
                                )}&t=m&z=13&ie=UTF8&iwloc=&output=embed`}
                                className="w-full h-full border-0 select-none"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                              />
                            </div>

                            <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                              <span>
                                💡 Puedes moverte por el mapa, acercar calles o hacer clic en los marcadores de Google Maps para ver detalles.
                              </span>
                              <button
                                type="button"
                                onClick={() => setGoogleCustomQuery('')}
                                className="text-blue-400 hover:underline font-bold text-[11px]"
                              >
                                Centrar en {selectedCity}
                              </button>
                            </div>
                          </div>

                          {/* LATERAL: COLEGIOS E INSTITUCIONES RECOMENDADAS PARA PROSPECCIÓN (4 COLUMNAS) */}
                          <div className="lg:col-span-4 rounded-3xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between space-y-3 shadow-xl">
                            <div>
                              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    <span>Colegios & Negocios en {selectedCity}</span>
                                  </h4>
                                  <p className="text-[11px] text-slate-400">
                                    Oportunidades listas para contactar o registrar
                                  </p>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {currentCitySuggestions.length} centros
                                </span>
                              </div>

                              <div className="space-y-2.5 mt-3 max-h-[460px] overflow-y-auto pr-1">
                                {currentCitySuggestions.map((sug) => {
                                  const alreadyLead = projectLeads.some(
                                    (l) =>
                                      (l.institutionOrCompany || l.name).toLowerCase() ===
                                      sug.name.toLowerCase()
                                  );
                                  const isViewed = viewedCenters.some(
                                    (v) => v.name.toLowerCase() === sug.name.toLowerCase()
                                  );
                                  const cleanPhone = sug.phone.replace(/\D/g, '');

                                  return (
                                    <div
                                      key={sug.id}
                                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-2"
                                    >
                                      <div className="flex items-start justify-between gap-1">
                                        <div>
                                          <h5 className="font-bold text-white text-xs leading-snug">
                                            {sug.name}
                                          </h5>
                                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                            <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                                            <span>{sug.city}</span>
                                            <span className="text-slate-500">· {sug.sector}</span>
                                          </p>
                                        </div>
                                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shrink-0">
                                          👥 {sug.potentialUsers}
                                        </span>
                                      </div>

                                      <div className="text-[11px] text-slate-300">
                                        <p className="font-medium text-slate-400">
                                          Contacto: <strong className="text-white">{sug.contactName}</strong>
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-900">
                                        {alreadyLead ? (
                                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            En mis prospectos
                                          </span>
                                        ) : (
                                          <>
                                            {isViewed ? (
                                              <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[10px] flex items-center gap-1">
                                                <Eye className="w-3 h-3 text-amber-400" />
                                                <span>Visto</span>
                                              </span>
                                            ) : (
                                              <button
                                                type="button"
                                                onClick={() => handleMarkAsViewed(sug)}
                                                className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px] flex items-center gap-1 transition"
                                                title="Enlistar en centros vistos para evaluar luego"
                                              >
                                                <Eye className="w-3 h-3 text-amber-400" />
                                                <span>Visto</span>
                                              </button>
                                            )}

                                            <button
                                              type="button"
                                              onClick={() => handleAddSmartProspect(sug)}
                                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1 transition shadow-sm"
                                              title="Pasar a posible cliente directo"
                                            >
                                              <Sparkles className="w-3 h-3 text-amber-300" />
                                              <span>+ Prospecto</span>
                                            </button>
                                          </>
                                        )}

                                        <button
                                          type="button"
                                          onClick={() =>
                                            setGoogleCustomQuery(
                                              `${sug.name}, ${sug.city}, Republica Dominicana`
                                            )
                                          }
                                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition"
                                          title="Buscar este centro en Google Maps"
                                        >
                                          🔍 Enfocar
                                        </button>

                                        {cleanPhone && (
                                          <a
                                            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                              `Hola ${sug.contactName}, le escribo respecto a ${product.name} para ${sug.name}. ¿Tiene unos minutos para conversar?`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-auto p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition flex items-center gap-1 text-[10px]"
                                            title="Enviar WhatsApp directo"
                                          >
                                            <MessageCircle className="w-3 h-3" />
                                            <span>WhatsApp</span>
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-300">
                              <p className="font-semibold flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>Radar Proactivo de Prospección</span>
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                Combina Google Maps en vivo con la base territorial de prospectos para acelerar las ventas de {product.name}.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* ======================================================= */
                      /* MODO B: MAPA VECTORIAL DE CENTROS REGISTRADOS           */
                      /* ======================================================= */
                      <div className="space-y-4">
                        {/* ENCABEZADO Y CONTROLES DEL MAPA */}
                        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-lg space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                            <Map className="w-5 h-5 text-cyan-400" />
                            <span>Mapa Geográfico de Centros ({product.name})</span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Ubica espacialmente tus clientes activos, prospectos y oportunidades en todo el país y el mundo.
                          </p>
                        </div>

                        {/* SELECTOR DE ALCANCE: RD O MUNDO */}
                        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs shrink-0 self-start md:self-auto">
                          <button
                            type="button"
                            onClick={() => setMapScope('RD')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                              mapScope === 'RD'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>🇩🇴 Rep. Dominicana</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMapScope('WORLD')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                              mapScope === 'WORLD'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>🌍 Internacional / Mundo</span>
                          </button>
                        </div>
                      </div>

                      {/* FILTROS RÁPIDOS Y BUSCADOR */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                          <button
                            type="button"
                            onClick={() => setMapTypeFilter('all')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition ${
                              mapTypeFilter === 'all'
                                ? 'bg-slate-700 text-white'
                                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            Todos ({allCentersList.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setMapTypeFilter('clients')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                              mapTypeFilter === 'clients'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-950 text-emerald-400 hover:bg-slate-800 border border-emerald-600/30'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                            <span>Clientes Activos ({projectCustomers.length})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMapTypeFilter('leads')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                              mapTypeFilter === 'leads'
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-950 text-purple-400 hover:bg-slate-800 border border-purple-600/30'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
                            <span>Prospectos ({projectLeads.length})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMapTypeFilter('suggestions')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                              mapTypeFilter === 'suggestions'
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-950 text-amber-400 hover:bg-slate-800 border border-amber-600/30'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                            <span>Radar ({currentCitySuggestions.length})</span>
                          </button>
                        </div>

                        {/* Buscador de centros */}
                        <div className="relative min-w-[220px]">
                          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={mapSearchQuery}
                            onChange={(e) => setMapSearchQuery(e.target.value)}
                            placeholder="Buscar centro o ciudad..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      {/* KPIS RÁPIDOS DEL MAPA */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/60">
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Centros Ubicados</span>
                          <span className="text-base font-black text-white">{filteredMapCenters.length} negocios</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Usuarios Finales</span>
                          <span className="text-base font-black text-cyan-400">{totalUsersOnMap.toLocaleString()} personas</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Ciudades Activas</span>
                          <span className="text-base font-black text-indigo-400">{uniqueCitiesCount} ubicaciones</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">MRR Mensual en Mapa</span>
                          <span className="text-base font-black text-emerald-400">${totalMrrOnMap.toLocaleString()} / mes</span>
                        </div>
                      </div>
                    </div>

                    {/* LIENZO VECTORIAL DEL MAPA + TARJETA DEL CENTRO SELECCIONADO */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      {/* ÁREA DEL MAPA INTERACTIVO (8 COLUMNAS) */}
                      <div className="lg:col-span-8 rounded-3xl bg-slate-950 border border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-2xl">
                        {/* Brújula / Indicador Superior */}
                        <div className="flex items-center justify-between pb-2 text-[11px] font-mono text-slate-400 z-10">
                          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '20s' }} />
                            <span>
                              {mapScope === 'RD' ? 'VISTA TERRITORIAL: REPÚBLICA DOMINICANA' : 'VISTA GLOBAL: MAPA MUNDIAL'}
                            </span>
                          </div>
                          <span className="text-slate-500">
                            {visibleOnMapCenters.length} centros graficados en esta vista
                          </span>
                        </div>

                        {/* MAPA SVG VECTORIAL */}
                        <div className="w-full relative flex items-center justify-center my-auto py-2">
                          <svg
                            viewBox="0 0 800 460"
                            className="w-full h-auto max-h-[380px] select-none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <defs>
                              {/* Filtro de resplandor para pines */}
                              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                              </filter>
                              {/* Gradiente para masa territorial de RD */}
                              <linearGradient id="rdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#1e293b" />
                                <stop offset="100%" stopColor="#0f172a" />
                              </linearGradient>
                            </defs>

                            {/* Guías de Latitud / Longitud / Cuadrícula náutica */}
                            <line x1="50" y1="120" x2="750" y2="120" stroke="rgba(99, 102, 241, 0.08)" strokeDasharray="3 6" />
                            <line x1="50" y1="230" x2="750" y2="230" stroke="rgba(99, 102, 241, 0.08)" strokeDasharray="3 6" />
                            <line x1="50" y1="340" x2="750" y2="340" stroke="rgba(99, 102, 241, 0.08)" strokeDasharray="3 6" />
                            <line x1="240" y1="50" x2="240" y2="420" stroke="rgba(99, 102, 241, 0.08)" strokeDasharray="3 6" />
                            <line x1="470" y1="50" x2="470" y2="420" stroke="rgba(99, 102, 241, 0.08)" strokeDasharray="3 6" />
                            <line x1="680" y1="50" x2="680" y2="420" stroke="rgba(99, 102, 241, 0.08)" strokeDasharray="3 6" />

                            {mapScope === 'RD' ? (
                              /* =================== MAPA REPÚBLICA DOMINICANA =================== */
                              <g>
                                {/* Silueta de República Dominicana */}
                                <path
                                  d="M 215,145 C 230,120 260,110 300,115 C 340,110 380,100 420,110 C 460,115 480,130 500,140 C 520,135 550,130 570,145 C 580,155 570,165 540,165 C 515,165 490,165 480,175 C 530,190 590,200 640,215 C 680,225 720,235 730,250 C 720,265 670,270 630,270 C 580,275 540,270 510,265 C 480,265 450,270 435,285 C 420,295 400,310 375,300 C 350,290 330,300 315,325 C 300,345 280,380 260,395 C 245,400 235,385 240,360 C 245,330 250,295 245,260 C 230,240 220,200 215,160 Z"
                                  fill="url(#rdGradient)"
                                  stroke="rgba(99, 102, 241, 0.45)"
                                  strokeWidth="2.5"
                                  className="transition-all duration-300"
                                />

                                {/* Islas Adyacentes (Saona, Beata, Catalina) */}
                                <ellipse cx="640" cy="295" rx="18" ry="9" fill="url(#rdGradient)" stroke="rgba(99, 102, 241, 0.35)" strokeWidth="1.5" />
                                <ellipse cx="250" cy="425" rx="12" ry="7" fill="url(#rdGradient)" stroke="rgba(99, 102, 241, 0.35)" strokeWidth="1.5" />
                                <circle cx="595" cy="285" r="4.5" fill="url(#rdGradient)" stroke="rgba(99, 102, 241, 0.35)" strokeWidth="1" />

                                {/* Líneas Regionales / Cordilleras sutiles */}
                                <path d="M 230,175 Q 360,180 480,180" stroke="rgba(99, 102, 241, 0.2)" strokeDasharray="4 4" strokeWidth="1.5" fill="none" />
                                <path d="M 480,180 Q 480,220 480,265" stroke="rgba(99, 102, 241, 0.2)" strokeDasharray="4 4" strokeWidth="1.5" fill="none" />
                                <path d="M 370,180 Q 370,240 375,300" stroke="rgba(99, 102, 241, 0.2)" strokeDasharray="4 4" strokeWidth="1.5" fill="none" />

                                {/* Rótulos geográficos en marcas de agua */}
                                <text x="345" y="140" fill="rgba(148, 163, 184, 0.35)" fontSize="11" fontWeight="bold" letterSpacing="2">CIBAO CENTRAL</text>
                                <text x="375" y="95" fill="rgba(148, 163, 184, 0.35)" fontSize="10" fontWeight="bold" letterSpacing="2">COSTA NORTE</text>
                                <text x="450" y="245" fill="rgba(148, 163, 184, 0.45)" fontSize="11" fontWeight="bold" letterSpacing="2">SANTO DOMINGO</text>
                                <text x="615" y="235" fill="rgba(148, 163, 184, 0.35)" fontSize="11" fontWeight="bold" letterSpacing="2">REGIÓN ESTE</text>
                                <text x="290" y="280" fill="rgba(148, 163, 184, 0.35)" fontSize="11" fontWeight="bold" letterSpacing="2">SUR / VALLE</text>
                              </g>
                            ) : (
                              /* =================== MAPA CONTINENTAL / MUNDIAL =================== */
                              <g>
                                {/* Siluetas Continentales estilizadas */}
                                {/* Norteamérica */}
                                <path d="M 120,80 L 250,70 L 280,110 L 250,150 L 230,170 L 190,190 L 150,160 L 110,120 Z" fill="url(#rdGradient)" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" />
                                {/* Centroamérica & Caribe */}
                                <path d="M 190,190 L 220,215 L 245,225 L 275,190 L 250,180 Z" fill="url(#rdGradient)" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" />
                                {/* Sudamérica */}
                                <path d="M 235,225 L 290,230 L 340,280 L 330,340 L 290,390 L 260,370 L 235,280 Z" fill="url(#rdGradient)" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" />
                                {/* Europa */}
                                <path d="M 400,90 L 480,85 L 490,140 L 450,160 L 420,150 L 415,115 Z" fill="url(#rdGradient)" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" />
                                {/* África */}
                                <path d="M 410,170 L 490,170 L 510,230 L 480,310 L 450,330 L 420,260 L 400,210 Z" fill="url(#rdGradient)" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" />

                                <text x="170" y="110" fill="rgba(148, 163, 184, 0.35)" fontSize="11" fontWeight="bold">NORTEAMÉRICA</text>
                                <text x="250" y="180" fill="rgba(56, 189, 248, 0.55)" fontSize="11" fontWeight="bold">CARIBE (RD)</text>
                                <text x="260" y="290" fill="rgba(148, 163, 184, 0.35)" fontSize="11" fontWeight="bold">SUDAMÉRICA</text>
                                <text x="430" y="110" fill="rgba(148, 163, 184, 0.35)" fontSize="11" fontWeight="bold">EUROPA</text>
                              </g>
                            )}

                            {/* PINES INTERACTIVOS DE CENTROS SOBRE EL MAPA */}
                            {visibleOnMapCenters.map((center) => {
                              const isSelected = activeCenter?.id === center.id;

                              // Calcular posición según scope
                              const baseX = mapScope === 'RD' ? center.coords.xRD : center.coords.xWorld;
                              const baseY = mapScope === 'RD' ? center.coords.yRD : center.coords.yWorld;

                              // Cálculo de offset para evitar que múltiples centros de la misma ciudad se tapen entre sí
                              const cityKey = `${Math.round(baseX)}-${Math.round(baseY)}`;
                              const clusterIndex = cityClusterMap[cityKey] || 0;
                              cityClusterMap[cityKey] = clusterIndex + 1;

                              const angle = (clusterIndex * 2 * Math.PI) / 6;
                              const radius = clusterIndex > 0 ? 16 : 0;
                              const pinX = baseX + Math.cos(angle) * radius;
                              const pinY = baseY + Math.sin(angle) * radius;

                              const pinColor =
                                center.type === 'client'
                                  ? '#10b981' // Esmeralda
                                  : center.type === 'lead'
                                  ? '#a855f7' // Violeta
                                  : '#f59e0b'; // Ámbar

                              return (
                                <g
                                  key={center.id}
                                  transform={`translate(${pinX}, ${pinY})`}
                                  onClick={() => setSelectedMapCenterId(center.id)}
                                  className="cursor-pointer group"
                                >
                                  {/* Resplandor o Anillo exterior */}
                                  <circle
                                    r={isSelected ? 16 : 9}
                                    fill={center.type === 'client' ? 'rgba(16, 185, 129, 0.2)' : center.type === 'lead' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(245, 158, 11, 0.2)'}
                                    stroke={pinColor}
                                    strokeWidth={isSelected ? '2.5' : '1'}
                                    className={isSelected ? 'animate-ping' : 'transition-all'}
                                  />

                                  {/* Centro del Pin */}
                                  <circle
                                    r={isSelected ? 7 : 5}
                                    fill={pinColor}
                                    stroke="#020617"
                                    strokeWidth="2"
                                  />

                                  {/* Etiqueta flotante con cantidad de usuarios */}
                                  <g className={isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100 transition'}>
                                    <rect
                                      x="-36"
                                      y="-23"
                                      width="72"
                                      height="15"
                                      rx="7.5"
                                      fill="rgba(2, 6, 23, 0.88)"
                                      stroke={isSelected ? pinColor : 'rgba(71, 85, 105, 0.6)'}
                                      strokeWidth="1"
                                    />
                                    <text
                                      x="0"
                                      y="-12.5"
                                      textAnchor="middle"
                                      fill="#f8fafc"
                                      fontSize="8.5"
                                      fontWeight="bold"
                                      className="select-none pointer-events-none"
                                    >
                                      👥 {center.users} u.
                                    </text>
                                  </g>
                                </g>
                              );
                            })}
                          </svg>
                        </div>

                        {/* Leyenda de Colores */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                              Cliente Activo
                            </span>
                            <span className="flex items-center gap-1.5 font-medium text-purple-400">
                              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                              Prospecto
                            </span>
                            <span className="flex items-center gap-1.5 font-medium text-amber-400">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                              Radar Sugerido
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            Haz clic en cualquier pin para ver el contacto y enlace de WhatsApp
                          </span>
                        </div>
                      </div>

                      {/* FICHA DETALLADA DEL CENTRO SELECCIONADO (4 COLUMNAS) */}
                      <div className="lg:col-span-4 rounded-3xl bg-slate-900/90 border border-slate-800 p-5 flex flex-col justify-between space-y-4 shadow-xl">
                        {activeCenter ? (
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                              <div>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-block mb-1.5 ${
                                    activeCenter.type === 'client'
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                      : activeCenter.type === 'lead'
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  }`}
                                >
                                  {activeCenter.type === 'client'
                                    ? `Cliente Activo ($${activeCenter.mrr}/mes)`
                                    : activeCenter.type === 'lead'
                                    ? 'Prospecto en Seguimiento'
                                    : 'Oportunidad Sugerida B2B'}
                                </span>
                                <h4 className="text-base font-bold text-white leading-snug">
                                  {activeCenter.name}
                                </h4>
                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                  <span>{activeCenter.city}</span>
                                  {activeCenter.sector && (
                                    <span className="text-slate-500">({activeCenter.sector})</span>
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* MÉTRICAS DEL CENTRO */}
                            <div className="grid grid-cols-2 gap-2.5">
                              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                  Usuarios Finales
                                </span>
                                <p className="text-lg font-black text-cyan-400">
                                  👥 {activeCenter.users.toLocaleString()}
                                </p>
                              </div>

                              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                  {activeCenter.type === 'client' ? 'MRR Mensual' : 'Potencial'}
                                </span>
                                <p className="text-lg font-black text-emerald-400">
                                  {activeCenter.type === 'client'
                                    ? `$${activeCenter.mrr}/mes`
                                    : 'Alta afinidad'}
                                </p>
                              </div>
                            </div>

                            {/* CONTACTO */}
                            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-medium">Persona de Contacto:</span>
                                <span className="font-bold text-white text-right">
                                  {activeCenter.contactName || 'No registrada'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-medium">Teléfono / WhatsApp:</span>
                                <span className="font-mono text-slate-300">
                                  {activeCenter.phone || 'No registrado'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-medium">Zona Geográfica:</span>
                                <span className="text-indigo-400 font-semibold text-right">
                                  {activeCenter.coords.regionLabel}
                                </span>
                              </div>
                            </div>

                            {/* BOTONES DE ACCIÓN: WHATSAPP DIRECTO Y CONVERTIR */}
                            <div className="space-y-2 pt-2">
                              {activeCenter.phone && (
                                <a
                                  href={`https://wa.me/${activeCenter.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
                                >
                                  <MessageCircle className="w-4 h-4 fill-white" />
                                  <span>Escribir por WhatsApp</span>
                                </a>
                              )}

                              {activeCenter.type === 'lead' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLeadToConvert(activeCenter.rawItem);
                                    setConvertAmount(activeCenter.rawItem.estimatedValue || 120);
                                    setConvertUsers(activeCenter.users || 200);
                                  }}
                                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Convertir a Cliente Activo</span>
                                </button>
                              )}

                              {activeCenter.type === 'suggestion' && (() => {
                                const isActiveViewed = viewedCenters.some(
                                  (v) => v.name.toLowerCase() === activeCenter.name.toLowerCase()
                                );

                                return (
                                  <div className="space-y-1.5">
                                    {!isActiveViewed ? (
                                      <button
                                        type="button"
                                        onClick={() => handleMarkAsViewed(activeCenter.rawItem)}
                                        className="w-full py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                                      >
                                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                                        <span>👀 Enlistar como Visto</span>
                                      </button>
                                    ) : (
                                      <div className="w-full py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center justify-center gap-1.5">
                                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Enlistado como Visto</span>
                                      </div>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => handleAddSmartProspect(activeCenter.rawItem)}
                                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                                    >
                                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                      <span>✨ Pasar a Posible Cliente</span>
                                    </button>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 text-center text-slate-500 space-y-2 my-auto">
                            <MapPin className="w-8 h-8 mx-auto text-slate-600" />
                            <p className="text-xs">No hay centros que coincidan con los filtros actuales.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                    {/* DIRECTORIO COMPLETO DE CENTROS EN TABLA / GRID */}
                    <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Directorio de Centros del SaaS ({filteredMapCenters.length}):
                        </span>
                        <span className="text-xs text-slate-500">
                          Haz clic en cualquier fila para ubicarlo en el mapa
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {filteredMapCenters.map((center) => {
                          const isSelected = activeCenter?.id === center.id;

                          return (
                            <div
                              key={center.id}
                              onClick={() => setSelectedMapCenterId(center.id)}
                              className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-1.5">
                                  <span className="font-bold text-white text-xs truncate">
                                    {center.name}
                                  </span>
                                  <span
                                    className={`px-1.5 py-0.2 rounded-md text-[9px] font-black shrink-0 ${
                                      center.type === 'client'
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : center.type === 'lead'
                                        ? 'bg-purple-500/20 text-purple-300'
                                        : 'bg-amber-500/20 text-amber-300'
                                    }`}
                                  >
                                    {center.type === 'client' ? 'Cliente' : center.type === 'lead' ? 'Prospecto' : 'Sugerido'}
                                  </span>
                                </div>

                                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                                  <span>{center.city}</span>
                                  <span className="text-slate-500">· {center.coords.regionLabel}</span>
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-900 text-xs">
                                <span className="font-bold text-cyan-400 text-[11px]">
                                  👥 {center.users.toLocaleString()} usuarios
                                </span>

                                {center.phone && (
                                  <a
                                    href={`https://wa.me/${center.phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition flex items-center gap-1 text-[10px]"
                                    title="Chatear por WhatsApp"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ===================================================================== */}
          {/* SUB-PANTALLA D: CENTROS VISTOS EN EL MAPA & CONVERSIÓN A PROSPECTOS   */}
          {/* ===================================================================== */}
          {leadsSubTab === 'viewed' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Barra superior con métricas y acciones */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                      <Eye className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-white">
                          Centros Vistos en el Mapa
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {viewedCenters.filter((c) => c.status === 'visto').length} pendientes de prospectar
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Centros que has explorado en Google Maps, listos para pasarlos a Posibles Clientes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setViewedFormCity(selectedCity);
                        setIsAddViewedModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Enlistar Centro Visto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLeadsSubTab('map')}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Map className="w-4 h-4 text-cyan-400" />
                      <span>Ir al Mapa</span>
                    </button>
                  </div>
                </div>

                {/* Filtros de estado para vistos */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setViewedFilterStatus('all')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition ${
                        viewedFilterStatus === 'all'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Todos ({viewedCenters.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewedFilterStatus('pending')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                        viewedFilterStatus === 'pending'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-amber-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                      <span>Pendientes ({viewedCenters.filter((c) => c.status === 'visto').length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewedFilterStatus('converted')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                        viewedFilterStatus === 'converted'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-emerald-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      <span>Ya en Posibles Clientes ({viewedCenters.filter((c) => c.status === 'convertido_a_lead').length})</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-500">
                    💡 Presiona <strong>"✨ Pasar a Posible Cliente"</strong> para pasarlo inmediatamente al embudo de ventas.
                  </span>
                </div>
              </div>

              {/* Lista de centros vistos */}
              {(() => {
                const displayedViewed = viewedCenters.filter((c) => {
                  if (viewedFilterStatus === 'pending') return c.status === 'visto';
                  if (viewedFilterStatus === 'converted') return c.status === 'convertido_a_lead';
                  return true;
                });

                if (displayedViewed.length === 0) {
                  return (
                    <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                      <Eye className="w-10 h-10 text-slate-600 mx-auto" />
                      <h4 className="text-sm font-bold text-white">
                        {viewedFilterStatus === 'pending'
                          ? 'No tienes centros vistos pendientes en este momento.'
                          : viewedFilterStatus === 'converted'
                          ? 'Aún no has pasado centros vistos a posibles clientes.'
                          : 'No has enlistado centros vistos todavía.'}
                      </h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Al explorar en el mapa o en Google Maps, puedes hacer clic en "👀 Visto" en cualquier centro o usar el botón "+ Enlistar Centro Visto" para guardarlo aquí.
                      </p>
                      <div className="pt-2 flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLeadsSubTab('map')}
                          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                        >
                          Explorar en el Mapa
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setViewedFormCity(selectedCity);
                            setIsAddViewedModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                        >
                          + Enlistar Manualmente
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2.5">
                    {displayedViewed.map((item) => {
                      const cleanPhone = (item.phone || item.whatsapp || '').replace(/\D/g, '');
                      const waLink = `https://wa.me/${cleanPhone}`;
                      const isConverted = item.status === 'convertido_a_lead';

                      return (
                        <div
                          key={item.id}
                          className={`p-3.5 sm:p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm ${
                            isConverted
                              ? 'bg-slate-900/60 border-slate-800/80 opacity-80'
                              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 ${
                                  isConverted
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                }`}
                              >
                                {isConverted ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Ya en Posibles Clientes</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3 h-3" />
                                    <span>Visto (Pendiente)</span>
                                  </>
                                )}
                              </span>

                              <h4 className="text-sm font-bold text-white truncate max-w-sm">
                                {item.name}
                              </h4>

                              <span className="text-slate-600 hidden sm:inline">&bull;</span>
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-cyan-400" />
                                <span>{item.city}</span>
                                {item.sector && <span className="text-slate-500">· {item.sector}</span>}
                              </span>
                            </div>

                            {/* Fila secundaria de detalles */}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                              {item.contactName && (
                                <span>
                                  Contacto: <strong className="text-slate-300">{item.contactName}</strong>
                                </span>
                              )}
                              {item.phone && (
                                <span className="text-slate-300 font-mono">
                                  📞 {item.phone}
                                </span>
                              )}
                              {item.potentialUsers && (
                                <span className="text-cyan-400 font-semibold">
                                  👥 {item.potentialUsers} usuarios est.
                                </span>
                              )}
                              <span className="text-slate-500 text-[11px]">
                                Visto: {new Date(item.seenAt).toLocaleDateString()}
                              </span>
                            </div>

                            {item.notes && (
                              <p className="text-xs text-slate-400 italic pt-1 line-clamp-2">
                                "{item.notes}"
                              </p>
                            )}
                          </div>

                          {/* Botones de acción del centro visto */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                            {cleanPhone && (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition"
                                title="Chatear por WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">WhatsApp</span>
                              </a>
                            )}

                            {!isConverted ? (
                              <button
                                type="button"
                                onClick={() => handlePromoteViewedToLead(item)}
                                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md"
                                title="Transferir este centro a la lista de posibles clientes y abrir su proceso comercial"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                <span>✨ Pasar a Posible Cliente</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setLeadsSubTab('radar')}
                                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold transition flex items-center gap-1"
                              >
                                <span>Ver en Prospectos</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteViewedCenter(item.id)}
                              className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                              title="Eliminar de centros vistos"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 3: FINANZAS                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'finances' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-sm max-w-xl space-y-5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Registrar Ingresos & Gastos de {product.name}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Actualiza los valores mensuales recurrentes para alimentar los gráficos del dashboard.
            </p>
          </div>

          <form onSubmit={handleSaveFinances} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Ingresos Mensuales Recurrentes (MRR en $)
              </label>
              <input
                type="number"
                min="0"
                value={finMrr}
                onChange={(e) => setFinMrr(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Gastos Fijos Mensuales (Servidores, APIs, dominios en $)
              </label>
              <input
                type="number"
                min="0"
                value={finCosts}
                onChange={(e) => setFinCosts(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Margen Neto Limpio:</span>
                <span className="text-lg font-black text-emerald-400">
                  ${(finMrr - finCosts).toLocaleString()} /mes
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">ARR Proyectado:</span>
                <span className="text-lg font-black text-white">
                  ${(finMrr * 12).toLocaleString()} /año
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{finSaved ? '¡Guardado Correctamente!' : 'Guardar Finanzas'}</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 4: PROCESOS & TAREAS (PRIORIDAD 1 AL 10)                           */}
      {/* ========================================================================= */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Formulario Nueva Tarea con Prioridad 1-10 */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-400" />
              <span>Agregar Nuevo Proceso o Tarea (Prioridad del 1 al 10)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Estas tareas se reflejan automáticamente en el <strong>Gráfico 3</strong> del Dashboard General en orden de prioridad.
            </p>

            <form onSubmit={handleCreateTask} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-6">
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nombre del proceso / tarea *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Resolver webhook de DGII, Terminar onboarding..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Prioridad: <strong className="text-amber-400">{taskPriority} / 10</strong>
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value={10}>10 - Máxima / Inmediata 🚨</option>
                  <option value={9}>9 - Crítica</option>
                  <option value={8}>8 - Muy Alta</option>
                  <option value={7}>7 - Alta</option>
                  <option value={6}>6 - Media-Alta</option>
                  <option value={5}>5 - Media</option>
                  <option value={4}>4 - Moderada</option>
                  <option value={3}>3 - Baja</option>
                  <option value={2}>2 - Muy Baja</option>
                  <option value={1}>1 - Mínima</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Proceso</span>
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Tareas Ordenadas por Prioridad */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Procesos Activos ({projectTasks.length})
            </span>

            {projectTasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No hay procesos registrados para este proyecto.</p>
            ) : (
              <div className="space-y-2">
                {projectTasks.map((t, idx) => {
                  const isCompleted = t.status === 'Completada';
                  const score = t.priorityScore || 5;

                  return (
                    <div
                      key={t.id}
                      className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        isCompleted
                          ? 'bg-slate-950/40 border-slate-850 opacity-60'
                          : idx === 0
                          ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskComplete(t.id)}
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                            isCompleted
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'border-slate-600 hover:border-slate-400'
                          }`}
                        >
                          {isCompleted && <Check className="w-3.5 h-3.5" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                              {t.title}
                            </span>
                            {idx === 0 && !isCompleted && (
                              <span className="px-2 py-0.2 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                                Próximo Paso
                              </span>
                            )}
                          </div>
                          {t.description && (
                            <p className="text-[11px] text-slate-400 mt-0.5">{t.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 text-xs font-black">
                          {score}/10
                        </span>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 5: OPINIONES & MEJORAS                                            */}
      {/* ========================================================================= */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Registrar Opinión o Sugerencia para {product.name}</span>
            </h2>

            <form onSubmit={handleCreateFeedback} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tipo</label>
                <select
                  value={fbType}
                  onChange={(e) => setFbType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Mejora">Mejora Futura</option>
                  <option value="Opinion">Opinión de Cliente</option>
                  <option value="Bug">Error / Bug</option>
                </select>
              </div>

              <div className="sm:col-span-6">
                <label className="text-xs font-semibold text-slate-300 block mb-1">Descripción breve *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. El cliente pide descargar reportes en PDF..."
                  value={fbTitle}
                  onChange={(e) => setFbTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Guardar Nota</span>
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projectFeedbacks.map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/15 text-indigo-300 mb-1 inline-block">
                    {fb.type}
                  </span>
                  <p className="text-white font-semibold">{fb.title}</p>
                  {fb.source && <span className="text-[11px] text-slate-500 block mt-1">Por: {fb.source}</span>}
                </div>
                <button
                  onClick={() => deleteFeedback(fb.id)}
                  className="p-1 text-slate-500 hover:text-red-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: PEGAR LISTA DE PROSPECTOS */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
              <span>Pegar Lista de Prospectos para {product.name}</span>
            </h3>

            <p className="text-xs text-slate-400">
              Pega varios contactos (uno por línea o separados por comas):
              <br />
              <code className="text-indigo-300 text-[11px] block mt-1 bg-slate-950 p-2 rounded-lg border border-slate-800">
                Colegio Santa Rosa, Lic. Gómez, director@santarosa.edu, 809-555-0100
                <br />
                Clínica Dental Moderna, Dr. Carlos, 829-555-0200
              </code>
            </p>

            <form onSubmit={handleImportBatch} className="space-y-3.5">
              <textarea
                required
                rows={6}
                placeholder="Pega aquí los contactos..."
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />

              {importCountMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                  {importCountMessage}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow-sm"
                >
                  Procesar e Importar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AGREGAR CLIENTE ACTIVO */}
      {isAddCustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Registrar Cliente Activo en {product.name}</span>
              </h3>
              <button
                onClick={() => setIsAddCustModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Nombre de la Empresa / Institución *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Colegio Santa Teresita, Ferretería Central..."
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Contacto Principal</label>
                  <input
                    type="text"
                    placeholder="Ej: Lic. Roberto Pérez"
                    value={newCustContact}
                    onChange={(e) => setNewCustContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">WhatsApp / Teléfono *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 809-555-1234"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">Ciudad o País *</label>
                    <span className="text-[10px] text-indigo-400 font-semibold">Escribe directo o elige</span>
                  </div>
                  <input
                    type="text"
                    required
                    list="global-cities-list"
                    placeholder="Ej: Santo Domingo, Santiago, Miami, Madrid..."
                    value={newCustCity}
                    onChange={(e) => setNewCustCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                  <datalist id="global-cities-list">
                    {GLOBAL_CITY_OPTIONS.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Usuarios Finales</label>
                  <input
                    type="number"
                    min="1"
                    value={newCustUsers}
                    onChange={(e) => setNewCustUsers(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">MRR Mensual ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCustMrr}
                    onChange={(e) => setNewCustMrr(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Fecha Inicio de Contrato</span>
                  </label>
                  <input
                    type="date"
                    value={newCustContractDate}
                    onChange={(e) => setNewCustContractDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>Día de Cobro Mensual (1-31)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    placeholder="Ej: 5 (cobro día 5)"
                    value={newCustBillingDay}
                    onChange={(e) => setNewCustBillingDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCustModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                >
                  Guardar Cliente Activo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR NEGOCIO CLIENTE */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <span>Editar Datos del Cliente: {editingCustomer.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Nombre de la Empresa / Institución *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Colegio Santa Teresita, Ferretería Central..."
                  value={editCustName}
                  onChange={(e) => setEditCustName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Contacto Principal</label>
                  <input
                    type="text"
                    placeholder="Ej: Lic. Roberto Pérez"
                    value={editCustContact}
                    onChange={(e) => setEditCustContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">WhatsApp / Teléfono *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 809-555-1234"
                    value={editCustPhone}
                    onChange={(e) => setEditCustPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">Ciudad o País *</label>
                  </div>
                  <input
                    type="text"
                    required
                    list="global-cities-list-edit"
                    placeholder="Ej: Santo Domingo, Santiago..."
                    value={editCustCity}
                    onChange={(e) => setEditCustCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                  <datalist id="global-cities-list-edit">
                    {GLOBAL_CITY_OPTIONS.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Usuarios Finales</label>
                  <input
                    type="number"
                    min="1"
                    value={editCustUsers}
                    onChange={(e) => setEditCustUsers(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">MRR Mensual ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={editCustMrr}
                    onChange={(e) => setEditCustMrr(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Fecha Inicio de Contrato</span>
                  </label>
                  <input
                    type="date"
                    value={editCustContractDate}
                    onChange={(e) => setEditCustContractDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Día de Cobro Mensual (1-31)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    placeholder="Ej: 5 (cobro día 5)"
                    value={editCustBillingDay}
                    onChange={(e) => setEditCustBillingDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Notas / Observaciones</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre el contrato, condiciones particulares, etc."
                  value={editCustNotes}
                  onChange={(e) => setEditCustNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIGURAR PÚBLICO OBJETIVO & MOTOR DE BÚSQUEDA DEL SAAS */}
      {isTargetAudienceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Target className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Público Objetivo & Motor de Búsqueda
                  </h3>
                  <p className="text-xs text-slate-400">
                    Define claramente a qué clientes o instituciones va dirigido <strong>{product.name}</strong>.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTargetAudienceModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTargetAudience} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>1. Público Objetivo / Nicho Principal *</span>
                  <span className="text-[10px] text-indigo-400 font-normal">Tipo de cliente / Institución</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={editTargetAudience}
                  onChange={(e) => setEditTargetAudience(e.target.value)}
                  placeholder="Ej: Centros Educativos Públicos con Junta Descentralizada (Liceos y Escuelas MINERD)..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
                <p className="text-[11px] text-slate-400">
                  Ejemplo para <em>GestiFy RD</em>: Centros públicos con junta descentralizada. Para <em>EduGest</em>: Colegios privados. Para <em>MyTurn</em>: Barberías y clínicas.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>2. Palabras Clave de Búsqueda (Google Maps / Radar) *</span>
                  <span className="text-[10px] text-cyan-400 font-normal">Términos para el motor</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTargetKeywords}
                  onChange={(e) => setEditTargetKeywords(e.target.value)}
                  placeholder="Ej: liceos publicos escuelas publicas politécnico"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-400">
                  Son las palabras con las que el Radar y el escaneo en vivo de Google Maps buscarán clientes reales en la ciudad seleccionada.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>3. Perfil del Cliente Ideal / Cargo de Contacto Clave</span>
                  <span className="text-[10px] text-amber-400 font-normal">Tomador de decisión</span>
                </label>
                <input
                  type="text"
                  value={editIdealProfile}
                  onChange={(e) => setEditIdealProfile(e.target.value)}
                  placeholder="Ej: Director(a) de Centro Educativo / Presidente de Junta Descentralizada"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-400">
                  Cargo del decisor a contactar (ej: Director de Centro, Pastor, Administrador, Gerente).
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sincronización en tiempo real</span>
                </div>
                <p className="text-slate-400">
                  Al guardar, el Radar geográfico, el mapa y el botón de búsqueda en Google Maps adaptarán sus sugerencias automáticamente a esta definición.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTargetAudienceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Configuración</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AGREGAR PROSPECTO MANUAL */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Nuevo Prospecto para {product.name}</span>
              </h3>
              <button
                onClick={() => setIsAddLeadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Empresa o Institución *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Colegio San Miguel, Ferretería El Sol..."
                  value={newLeadCompany}
                  onChange={(e) => setNewLeadCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Nombre del Contacto</label>
                <input
                  type="text"
                  placeholder="Ej: Lic. Carmen Rosario"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">WhatsApp / Teléfono</label>
                  <input
                    type="tel"
                    placeholder="809-555-0142"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">Ciudad o País *</label>
                    <span className="text-[10px] text-indigo-400 font-semibold">Escribe directo o elige</span>
                  </div>
                  <input
                    type="text"
                    required
                    list="global-cities-list"
                    placeholder="Ej: Santo Domingo, Santiago, Miami, Madrid..."
                    value={newLeadCity}
                    onChange={(e) => setNewLeadCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
                >
                  Guardar Prospecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR PROSPECTO */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <span>Editar Prospecto: {editingLead.institutionOrCompany || editingLead.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingLead(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateLead} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Empresa / Institución *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Colegio San Judas Tadeo"
                  value={editLeadCompany}
                  onChange={(e) => setEditLeadCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Persona de Contacto</label>
                <input
                  type="text"
                  placeholder="Ej: Lic. Marcos Santana"
                  value={editLeadName}
                  onChange={(e) => setEditLeadName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">WhatsApp / Teléfono</label>
                  <input
                    type="tel"
                    placeholder="Ej: 809-555-5555"
                    value={editLeadPhone}
                    onChange={(e) => setEditLeadPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Valor Estimado ($/mes)</label>
                  <input
                    type="number"
                    min="0"
                    value={editLeadValue}
                    onChange={(e) => setEditLeadValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Ciudad o País *</label>
                </div>
                <input
                  type="text"
                  required
                  list="global-cities-list-lead-edit"
                  placeholder="Ej: Santo Domingo, Santiago..."
                  value={editLeadCity}
                  onChange={(e) => setEditLeadCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
                <datalist id="global-cities-list-lead-edit">
                  {GLOBAL_CITY_OPTIONS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Notas Comerciales</label>
                <textarea
                  rows={2}
                  placeholder="Observaciones de seguimiento, objeciones, requisitos..."
                  value={editLeadNotes}
                  onChange={(e) => setEditLeadNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONVERTIR PROSPECTO */}
      {leadToConvert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              <span>Convertir a Cliente Activo</span>
            </h3>

            <p className="text-xs text-slate-300">
              Vas a activar como cliente a: <strong className="text-white">{leadToConvert.institutionOrCompany || leadToConvert.name}</strong>
            </p>

            <form onSubmit={handleExecuteConvert} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Usuarios Finales
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={convertUsers}
                    onChange={(e) => setConvertUsers(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    MRR Mensual ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={convertAmount}
                    onChange={(e) => setConvertAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Inicio de Contrato
                  </label>
                  <input
                    type="date"
                    value={convertContractDate}
                    onChange={(e) => setConvertContractDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Día Cobro (1-31)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={convertBillingDay}
                    onChange={(e) => setConvertBillingDay(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLeadToConvert(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow-sm"
                >
                  🎉 Activar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VENTANILLA / MODAL DESPLEGABLE: PROCESO & ONBOARDING DE CLIENTE ACTIVO */}
      {/* ===================================================================== */}
      {currentCustomerForProcess && (() => {
        const cust = currentCustomerForProcess;
        const steps = cust.processSteps && cust.processSteps.length > 0 ? cust.processSteps : createDefaultCustomerOnboardingSteps();
        const completedCount = steps.filter((s) => s.completed).length;
        const totalCount = steps.length;
        const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
            <div className="w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[92vh] rounded-none sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
              {/* Encabezado */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800 gap-3 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Onboarding & Proceso del Cliente
                    </span>
                    <span className="text-xs text-slate-400">· {product.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span className="truncate">{cust.name}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleOpenEditCustomer(cust)}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition border border-slate-700/60"
                      title="Editar datos de este cliente"
                    >
                      <Edit3 className="w-3 h-3 text-indigo-400" />
                      <span>Editar</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                    <span>{cust.city || 'Santo Domingo'}</span>
                    <span>&bull;</span>
                    <span>Contacto: <strong className="text-slate-200">{cust.contactPerson}</strong></span>
                    <span>&bull;</span>
                    <span className="text-emerald-400 font-bold">${cust.mrr}/mes MRR</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCustomerForProcess(null);
                    setIsAddingCustStep(false);
                    setEditingNoteStepId(null);
                    setEditingTitleStepId(null);
                  }}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Barra de Progreso General */}
              <div className="py-3 px-4 my-3 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4 text-emerald-400" />
                    <span>Progreso de Activación e Inducción</span>
                  </span>
                  <span className="font-black text-emerald-400">
                    {completedCount} de {totalCount} pasos completados ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Barra de Herramientas: Agregar Paso y Restablecer */}
              <div className="flex items-center justify-between gap-2 pb-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddingCustStep(!isAddingCustStep)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingCustStep ? 'Cancelar' : 'Agregar Paso Personalizado'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResetCustomerSteps(cust)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Restablecer los 8 pasos recomendados por expertos de SaaS"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>Plantilla Experta</span>
                </button>
              </div>

              {/* Formulario nuevo paso */}
              {isAddingCustStep && (
                <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 mb-3 shrink-0 space-y-2.5 animate-in fade-in">
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Nuevo Paso para {cust.name}</span>
                  </h5>
                  <input
                    type="text"
                    placeholder="Título del paso (ej: Configuración de módulo contable)"
                    value={newCustStepTitle}
                    onChange={(e) => setNewCustStepTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Descripción o entregable (opcional)"
                    value={newCustStepDesc}
                    onChange={(e) => setNewCustStepDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingCustStep(false)}
                      className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddCustomerStep(cust)}
                      className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                    >
                      Guardar Paso
                    </button>
                  </div>
                </div>
              )}

              {/* Lista Scrollable de Pasos */}
              <div className="overflow-y-auto flex-1 pr-1 space-y-2.5 my-1">
                {steps.map((step, idx) => {
                  const isEditingNote = editingNoteStepId === step.id;
                  const isEditingTitle = editingTitleStepId === step.id;

                  return (
                    <div
                      key={step.id}
                      className={`p-3.5 rounded-2xl border transition space-y-2 ${
                        step.completed
                          ? 'bg-slate-950/90 border-emerald-500/30'
                          : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox botón */}
                        <button
                          type="button"
                          onClick={() => handleToggleCustomerStep(cust, step.id)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                            step.completed
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                              : 'bg-slate-900 border border-slate-700 hover:border-slate-500 text-transparent'
                          }`}
                          title={step.completed ? 'Marcar como pendiente' : 'Marcar como completado'}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            {isEditingTitle ? (
                              <div className="flex items-center gap-1.5 w-full">
                                <input
                                  type="text"
                                  value={editingTitleText}
                                  onChange={(e) => setEditingTitleText(e.target.value)}
                                  className="w-full px-2 py-1 text-xs bg-slate-900 border border-indigo-500 rounded-lg text-white font-bold focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveCustomerStepTitle(cust, step.id, editingTitleText)}
                                  className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold"
                                >
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingTitleStepId(null)}
                                  className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-[10px]"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <h4
                                className={`text-xs font-bold leading-snug cursor-pointer flex items-center gap-1.5 ${
                                  step.completed ? 'text-emerald-300' : 'text-white'
                                }`}
                                onClick={() => handleToggleCustomerStep(cust, step.id)}
                              >
                                <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                                <span className={step.completed ? 'line-through opacity-80' : ''}>
                                  {step.title}
                                </span>
                              </h4>
                            )}

                            <div className="flex items-center gap-1 shrink-0">
                              {step.completed && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  {step.completedAt ? `Listo ${step.completedAt}` : 'Completado'}
                                </span>
                              )}
                              {!isEditingTitle && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingTitleStepId(step.id);
                                    setEditingTitleText(step.title);
                                  }}
                                  className="p-1 text-slate-500 hover:text-slate-300 rounded"
                                  title="Editar título del paso"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomerStep(cust, step.id)}
                                className="p-1 text-slate-500 hover:text-rose-400 rounded"
                                title="Eliminar este paso"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {step.description && !isEditingTitle && (
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                              {step.description}
                            </p>
                          )}

                          {/* Notas del Paso */}
                          {step.notes && !isEditingNote && (
                            <div className="mt-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-start justify-between gap-2">
                              <div className="flex items-start gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                                <span>{step.notes}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteStepId(step.id);
                                  setEditingNoteText(step.notes || '');
                                }}
                                className="text-[10px] text-indigo-400 hover:underline shrink-0"
                              >
                                Editar
                              </button>
                            </div>
                          )}

                          {isEditingNote && (
                            <div className="mt-2 space-y-1.5">
                              <textarea
                                value={editingNoteText}
                                onChange={(e) => setEditingNoteText(e.target.value)}
                                rows={2}
                                placeholder="Escribe observaciones, acuerdos o fechas de este paso..."
                                className="w-full p-2 text-xs bg-slate-900 border border-indigo-500 rounded-xl text-white focus:outline-none resize-none"
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingNoteStepId(null)}
                                  className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px]"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveCustomerStepNote(cust, step.id, editingNoteText)}
                                  className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold"
                                >
                                  Guardar Nota
                                </button>
                              </div>
                            </div>
                          )}

                          {!step.notes && !isEditingNote && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNoteStepId(step.id);
                                setEditingNoteText('');
                              }}
                              className="text-[10px] text-slate-500 hover:text-indigo-400 font-medium mt-1 flex items-center gap-1 transition"
                            >
                              <FileText className="w-3 h-3" />
                              <span>+ Agregar nota a este paso</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pie de ventanilla */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
                <span className="text-[11px] text-slate-500">
                  {completedCount === totalCount
                    ? '🎉 ¡Todas las etapas de onboarding completadas!'
                    : `Quedan ${totalCount - completedCount} etapas pendientes de completar.`}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCustomerForProcess(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================== */}
      {/* VENTANILLA / MODAL DESPLEGABLE: PROCESO COMERCIAL DE VENTA (PROSPECTO) */}
      {/* ===================================================================== */}
      {currentLeadForProcess && (() => {
        const lead = currentLeadForProcess;
        const steps = lead.processSteps && lead.processSteps.length > 0 ? lead.processSteps : createDefaultLeadSalesSteps();
        const completedCount = steps.filter((s) => s.completed).length;
        const totalCount = steps.length;
        const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        const cleanPhone = (lead.whatsapp || lead.phone || '').replace(/\D/g, '');

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
            <div className="w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[92vh] rounded-none sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
              {/* Encabezado */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800 gap-3 shrink-0">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Pipeline Comercial & Proceso de Venta
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleLeadPipeline(lead)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition flex items-center gap-1 ${
                        lead.inSalesPipeline
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Target className="w-3 h-3" />
                      <span>{lead.inSalesPipeline ? 'En Proceso Activo' : '+ Activar en Proceso'}</span>
                    </button>
                  </div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400 shrink-0" />
                    <span className="truncate">{lead.institutionOrCompany || lead.name}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                    <span>{lead.city || 'Santo Domingo'}</span>
                    <span>&bull;</span>
                    <span>Contacto: <strong className="text-slate-200">{lead.name}</strong></span>
                    {cleanPhone && (
                      <>
                        <span>&bull;</span>
                        <a
                          href={`https://wa.me/${cleanPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLeadForProcess(null);
                    setIsAddingLeadStep(false);
                    setEditingNoteStepId(null);
                    setEditingTitleStepId(null);
                  }}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Barra de Progreso de Ventas */}
              <div className="py-3 px-4 my-3 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span>Embudo de Venta Comercial</span>
                  </span>
                  <span className="font-black text-purple-400">
                    {completedCount} de {totalCount} pasos ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Botón de Cierre Destacado: Activar a Cliente */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 mb-2 shrink-0 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="font-bold text-emerald-300 block">¿Llegaste al acuerdo comercial?</span>
                  <span className="text-[11px] text-slate-400">Convierte este prospecto en cliente activo en 1 clic</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLeadForProcess(null);
                    setLeadToConvert(lead);
                    setConvertAmount(lead.estimatedValue || 120);
                    setConvertUsers(150);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>🎉 Activar como Cliente</span>
                </button>
              </div>

              {/* Barra de Herramientas: Agregar Paso y Restablecer */}
              <div className="flex items-center justify-between gap-2 pb-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddingLeadStep(!isAddingLeadStep)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingLeadStep ? 'Cancelar' : 'Agregar Paso Personalizado'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResetLeadSteps(lead)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Restablecer los 7 pasos comerciales recomendados"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>Pasos por Defecto</span>
                </button>
              </div>

              {/* Formulario nuevo paso comercial */}
              {isAddingLeadStep && (
                <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 mb-3 shrink-0 space-y-2.5 animate-in fade-in">
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-purple-400" />
                    <span>Nuevo Paso de Venta para {lead.institutionOrCompany || lead.name}</span>
                  </h5>
                  <input
                    type="text"
                    placeholder="Título del paso (ej: Reunión con el comité de compras)"
                    value={newLeadStepTitle}
                    onChange={(e) => setNewLeadStepTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Descripción o detalle (opcional)"
                    value={newLeadStepDesc}
                    onChange={(e) => setNewLeadStepDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingLeadStep(false)}
                      className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddLeadStep(lead)}
                      className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                    >
                      Guardar Paso
                    </button>
                  </div>
                </div>
              )}

              {/* Lista Scrollable de Pasos Comerciales */}
              <div className="overflow-y-auto flex-1 pr-1 space-y-2.5 my-1">
                {steps.map((step, idx) => {
                  const isEditingNote = editingNoteStepId === step.id;
                  const isEditingTitle = editingTitleStepId === step.id;

                  return (
                    <div
                      key={step.id}
                      className={`p-3.5 rounded-2xl border transition space-y-2 ${
                        step.completed
                          ? 'bg-slate-950/90 border-purple-500/30'
                          : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox botón */}
                        <button
                          type="button"
                          onClick={() => handleToggleLeadStep(lead, step.id)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                            step.completed
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                              : 'bg-slate-900 border border-slate-700 hover:border-slate-500 text-transparent'
                          }`}
                          title={step.completed ? 'Marcar como pendiente' : 'Marcar como completado'}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            {isEditingTitle ? (
                              <div className="flex items-center gap-1.5 w-full">
                                <input
                                  type="text"
                                  value={editingTitleText}
                                  onChange={(e) => setEditingTitleText(e.target.value)}
                                  className="w-full px-2 py-1 text-xs bg-slate-900 border border-purple-500 rounded-lg text-white font-bold focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveLeadStepTitle(lead, step.id, editingTitleText)}
                                  className="px-2 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-bold"
                                >
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingTitleStepId(null)}
                                  className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-[10px]"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <h4
                                className={`text-xs font-bold leading-snug cursor-pointer flex items-center gap-1.5 ${
                                  step.completed ? 'text-purple-300' : 'text-white'
                                }`}
                                onClick={() => handleToggleLeadStep(lead, step.id)}
                              >
                                <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                                <span className={step.completed ? 'line-through opacity-80' : ''}>
                                  {step.title}
                                </span>
                              </h4>
                            )}

                            <div className="flex items-center gap-1 shrink-0">
                              {step.completed && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                  {step.completedAt ? `Listo ${step.completedAt}` : 'Completado'}
                                </span>
                              )}
                              {!isEditingTitle && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingTitleStepId(step.id);
                                    setEditingTitleText(step.title);
                                  }}
                                  className="p-1 text-slate-500 hover:text-slate-300 rounded"
                                  title="Editar título del paso"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteLeadStep(lead, step.id)}
                                className="p-1 text-slate-500 hover:text-rose-400 rounded"
                                title="Eliminar este paso"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {step.description && !isEditingTitle && (
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                              {step.description}
                            </p>
                          )}

                          {/* Notas del Paso */}
                          {step.notes && !isEditingNote && (
                            <div className="mt-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-start justify-between gap-2">
                              <div className="flex items-start gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                                <span>{step.notes}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteStepId(step.id);
                                  setEditingNoteText(step.notes || '');
                                }}
                                className="text-[10px] text-purple-400 hover:underline shrink-0"
                              >
                                Editar
                              </button>
                            </div>
                          )}

                          {isEditingNote && (
                            <div className="mt-2 space-y-1.5">
                              <textarea
                                value={editingNoteText}
                                onChange={(e) => setEditingNoteText(e.target.value)}
                                rows={2}
                                placeholder="Escribe observaciones, objeciones o acuerdos de este paso..."
                                className="w-full p-2 text-xs bg-slate-900 border border-purple-500 rounded-xl text-white focus:outline-none resize-none"
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingNoteStepId(null)}
                                  className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px]"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveLeadStepNote(lead, step.id, editingNoteText)}
                                  className="px-2.5 py-0.5 rounded-lg bg-purple-600 text-white text-[10px] font-bold"
                                >
                                  Guardar Nota
                                </button>
                              </div>
                            </div>
                          )}

                          {!step.notes && !isEditingNote && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNoteStepId(step.id);
                                setEditingNoteText('');
                              }}
                              className="text-[10px] text-slate-500 hover:text-purple-400 font-medium mt-1 flex items-center gap-1 transition"
                            >
                              <FileText className="w-3 h-3" />
                              <span>+ Agregar nota a este paso</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pie de ventanilla */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
                <span className="text-[11px] text-slate-500">
                  {completedCount === totalCount
                    ? '🎉 ¡Todas las etapas del embudo comercial completadas!'
                    : `Quedan ${totalCount - completedCount} etapas para completar la venta.`}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedLeadForProcess(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL FICHA DE DETALLES DEL CLIENTE ACTIVO */}
      {currentCustomerFicha && (() => {
        const cust = currentCustomerFicha;
        const cleanPhone = (cust.whatsapp || cust.phone || '').replace(/\D/g, '');
        const waLink = `https://wa.me/${cleanPhone}`;
        const reminderWaLink = getCollectionWhatsAppLink(cust, product.name);
        const billingInfo = getBillingStatus(cust.billingDay || 5);
        const steps = cust.processSteps && cust.processSteps.length > 0 ? cust.processSteps : createDefaultCustomerOnboardingSteps();
        const completedCount = steps.filter((s) => s.completed).length;
        const totalCount = steps.length;
        const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black text-base flex items-center justify-center shrink-0">
                    {cust.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white truncate">{cust.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                        Cliente Activo
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-400" />
                        <span>{cust.city || 'Santo Domingo'}</span>
                      </span>
                      <span>&bull;</span>
                      <span>{cust.plan || 'Plan Activo'}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCustomerFicha(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[calc(92vh-140px)]">
                {/* Métricas Principales */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-850/60 border border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      MRR / Mensual
                    </span>
                    <p className="text-base font-black text-emerald-400">
                      ${cust.mrr}
                      <span className="text-[10px] font-normal text-slate-500">/mes</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-850/60 border border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Usuarios
                    </span>
                    <p className="text-base font-black text-cyan-400 flex items-center gap-1">
                      <Users className="w-4 h-4 text-cyan-500" />
                      <span>{cust.usersCount}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-850/60 border border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Inicio Contrato
                    </span>
                    <p className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{cust.contractStartDate || cust.startDate || 'No fijada'}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-850/60 border border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Día de Cobro
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-black text-amber-300">Día {cust.billingDay || 5}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${billingInfo.badgeClass}`}>
                        {billingInfo.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contacto & Datos Operativos */}
                <div className="p-4 rounded-2xl bg-slate-850/40 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Datos de Contacto y Representante</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Representante / Contacto:</span>
                      <span className="text-white font-medium">{cust.contactPerson || 'No especificado'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Teléfono / WhatsApp:</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-white font-medium">{cust.whatsapp || cust.phone || 'Sin número'}</span>
                        {cleanPhone && (
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-[10px] font-bold flex items-center gap-1 transition"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Correo Electrónico:</span>
                      <span className="text-white font-medium">{cust.email || 'Sin correo registrado'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Ciudad y Territorio:</span>
                      <span className="text-white font-medium">{cust.city || 'Santo Domingo'}</span>
                    </div>
                  </div>
                </div>

                {/* Estado del Proceso de Onboarding */}
                <div className="p-4 rounded-2xl bg-slate-850/40 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-xs font-bold text-white">Etapas de Implementación / Onboarding</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCustomerFicha(null);
                        setSelectedCustomerForProcess(cust);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 flex items-center gap-1 transition"
                    >
                      <ListChecks className="w-3 h-3" />
                      <span>Gestionar Pasos ({completedCount}/{totalCount})</span>
                    </button>
                  </div>

                  {/* Barra de progreso */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400 font-medium">Progreso de incorporación</span>
                      <span className="font-bold text-indigo-300">{pct}% completado</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Lista de pasos en miniatura */}
                  <div className="space-y-1.5 pt-1">
                    {steps.slice(0, 5).map((step) => (
                      <div
                        key={step.id}
                        onClick={() => handleToggleCustomerStep(cust, step.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2.5 cursor-pointer transition ${
                          step.completed
                            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            step.completed
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'border-slate-600 bg-slate-800'
                          }`}
                        >
                          {step.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`flex-1 truncate ${step.completed ? 'line-through text-slate-400' : 'font-medium text-slate-200'}`}>
                          {step.title}
                        </span>
                        {step.notes && (
                          <span className="text-[10px] text-slate-500 italic max-w-[120px] truncate">
                            "{step.notes}"
                          </span>
                        )}
                      </div>
                    ))}
                    {steps.length > 5 && (
                      <p className="text-[10px] text-slate-500 text-right">
                        +{steps.length - 5} pasos adicionales en la ventanilla de proceso
                      </p>
                    )}
                  </div>
                </div>

                {/* Notas */}
                {cust.notes && (
                  <div className="p-3.5 rounded-2xl bg-slate-850/30 border border-slate-800 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Observaciones y Acuerdos:
                    </span>
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{cust.notes}</p>
                  </div>
                )}
              </div>

              {/* Footer Acciones */}
              <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <a
                    href={reminderWaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Recordatorio Cobro</span>
                  </a>

                  {cleanPhone && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Directo</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenEditCustomer(cust);
                      setSelectedCustomerFicha(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Datos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCustomerFicha(null)}
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    Cerrar Ficha
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL FICHA DE DETALLES DEL PROSPECTO */}
      {currentLeadFicha && (() => {
        const lead = currentLeadFicha;
        const cleanPhone = (lead.whatsapp || lead.phone || '').replace(/\D/g, '');
        const waLink = `https://wa.me/${cleanPhone}`;
        const steps = lead.processSteps && lead.processSteps.length > 0 ? lead.processSteps : createDefaultLeadSalesSteps();
        const completedCount = steps.filter((s) => s.completed).length;
        const totalCount = steps.length;
        const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        const leadTitle = lead.institutionOrCompany || lead.name;

        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-black text-base flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white truncate">{leadTitle}</h3>
                      <button
                        type="button"
                        onClick={() => handleToggleLeadPipeline(lead)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition flex items-center gap-1 shrink-0 ${
                          lead.inSalesPipeline
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        <Target className="w-3 h-3 text-purple-400" />
                        <span>{lead.inSalesPipeline ? 'En Proceso Activo' : '+ Llevar Proceso'}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{lead.city || 'Santo Domingo'}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="text-indigo-400 font-semibold">{lead.status}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLeadFicha(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[calc(92vh-140px)]">
                {/* Métricas Principales */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-850/60 border border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Valor Estimado
                    </span>
                    <p className="text-base font-black text-emerald-400">
                      ${lead.estimatedValue || 0}
                      <span className="text-[10px] font-normal text-slate-500">/mes</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-850/60 border border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Estado Embudo
                    </span>
                    <p className="text-xs font-bold text-indigo-300">
                      {lead.status}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-850/60 border border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Contactado
                    </span>
                    <p className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{lead.contactedAt || 'Pendiente'}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-850/60 border border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Seguimiento
                    </span>
                    <p className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lead.followUpDate || 'Sin fecha'}</span>
                    </p>
                  </div>
                </div>

                {/* Contacto & Datos del Negocio */}
                <div className="p-4 rounded-2xl bg-slate-850/40 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-purple-400" />
                    <span>Datos de Contacto y Representante</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Empresa / Institución:</span>
                      <span className="text-white font-medium">{lead.institutionOrCompany || 'No especificada'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Persona de Contacto:</span>
                      <span className="text-white font-medium">{lead.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Teléfono / WhatsApp:</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-white font-medium">{lead.whatsapp || lead.phone || 'Sin número'}</span>
                        {cleanPhone && (
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-[10px] font-bold flex items-center gap-1 transition"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Ciudad:</span>
                      <span className="text-white font-medium">{lead.city || 'Santo Domingo'}</span>
                    </div>
                  </div>
                </div>

                {/* Embudo de Venta y Proceso */}
                <div className="p-4 rounded-2xl bg-slate-850/40 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-purple-400" />
                      <h4 className="text-xs font-bold text-white">Etapas del Proceso de Ventas</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLeadFicha(null);
                        setSelectedLeadForProcess(lead);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-[10px] font-bold border border-purple-500/30 flex items-center gap-1 transition"
                    >
                      <ListChecks className="w-3 h-3" />
                      <span>Gestionar Pasos ({completedCount}/{totalCount})</span>
                    </button>
                  </div>

                  {/* Barra de progreso */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400 font-medium">Progreso del embudo</span>
                      <span className="font-bold text-purple-300">{pct}% completado</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Lista de pasos en miniatura */}
                  <div className="space-y-1.5 pt-1">
                    {steps.slice(0, 5).map((step) => (
                      <div
                        key={step.id}
                        onClick={() => handleToggleLeadStep(lead, step.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2.5 cursor-pointer transition ${
                          step.completed
                            ? 'bg-purple-500/10 border-purple-500/25 text-purple-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            step.completed
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'border-slate-600 bg-slate-800'
                          }`}
                        >
                          {step.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`flex-1 truncate ${step.completed ? 'line-through text-slate-400' : 'font-medium text-slate-200'}`}>
                          {step.title}
                        </span>
                        {step.notes && (
                          <span className="text-[10px] text-slate-500 italic max-w-[120px] truncate">
                            "{step.notes}"
                          </span>
                        )}
                      </div>
                    ))}
                    {steps.length > 5 && (
                      <p className="text-[10px] text-slate-500 text-right">
                        +{steps.length - 5} pasos adicionales en la ventanilla de ventas
                      </p>
                    )}
                  </div>
                </div>

                {/* Notas */}
                {lead.notes && (
                  <div className="p-3.5 rounded-2xl bg-slate-850/30 border border-slate-800 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Notas del Prospecto:
                    </span>
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{lead.notes}</p>
                  </div>
                )}
              </div>

              {/* Footer Acciones */}
              <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setLeadToConvert(lead);
                      setConvertAmount(lead.estimatedValue || 120);
                      setConvertUsers(200);
                      setSelectedLeadFicha(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <span>✨ Activar como Cliente</span>
                  </button>

                  {cleanPhone && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenEditLead(lead);
                      setSelectedLeadFicha(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedLeadFicha(null)}
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    Cerrar Ficha
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL: ENLISTAR CENTRO VISTO EN EL MAPA */}
      {isAddViewedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Enlistar Centro Visto</h3>
                  <p className="text-xs text-slate-400">Guarda un centro que encontraste en Google Maps para prospectarlo.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddViewedModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualViewedCenter} className="p-4 sm:p-5 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Nombre del Centro / Institución / Negocio *
                </label>
                <input
                  type="text"
                  required
                  value={viewedFormName}
                  onChange={(e) => setViewedFormName(e.target.value)}
                  placeholder="Ej: Colegio San Judas Tadeo, Ferretería El Progreso..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Ciudad / Territorio</label>
                  <input
                    type="text"
                    list="google-maps-cities-list"
                    value={viewedFormCity}
                    onChange={(e) => setViewedFormCity(e.target.value)}
                    placeholder="Santo Domingo, Santiago..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Sector o Dirección</label>
                  <input
                    type="text"
                    value={viewedFormSector}
                    onChange={(e) => setViewedFormSector(e.target.value)}
                    placeholder="Ej: Naco, Bella Vista, Av. Principal"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={viewedFormPhone}
                    onChange={(e) => setViewedFormPhone(e.target.value)}
                    placeholder="Ej: 18095551234"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Persona de Contacto</label>
                  <input
                    type="text"
                    value={viewedFormContact}
                    onChange={(e) => setViewedFormContact(e.target.value)}
                    placeholder="Director, Gerente, Administrador..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Usuarios / Alumnos Estimados</label>
                <input
                  type="number"
                  min="1"
                  value={viewedFormUsers}
                  onChange={(e) => setViewedFormUsers(parseInt(e.target.value) || 100)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Notas / Observaciones Vistas</label>
                <textarea
                  rows={2}
                  value={viewedFormNotes}
                  onChange={(e) => setViewedFormNotes(e.target.value)}
                  placeholder="Lo que viste en Google Maps (ej. excelente reputación, 4.8 estrellas, nivel secundario)..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddViewedModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Guardar en Vistos</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR CENTRO / INSTITUCIÓN REAL EN EL RADAR */}
      {isAddRealCenterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Registrar Institución Real</h3>
                  <p className="text-xs text-slate-400">
                    Añade un centro real verificado para el Radar de <strong>{selectedCity}</strong> ({targetAudience.nicheShort}).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddRealCenterModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRealCenterToRadar} className="p-4 sm:p-5 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Nombre de la Institución / Empresa *
                </label>
                <input
                  type="text"
                  required
                  value={realCenterName}
                  onChange={(e) => setRealCenterName(e.target.value)}
                  placeholder="Ej: Colegio Nuestra Señora de la Altagracia, Ferretería El Detallista..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Ciudad</label>
                  <input
                    type="text"
                    disabled
                    value={selectedCity}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Sector o Calle</label>
                  <input
                    type="text"
                    value={realCenterSector}
                    onChange={(e) => setRealCenterSector(e.target.value)}
                    placeholder="Ej: Centro, La Malena, Av. Principal"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={realCenterPhone}
                    onChange={(e) => setRealCenterPhone(e.target.value)}
                    placeholder="Ej: 18095542450"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Contacto Principal</label>
                  <input
                    type="text"
                    value={realCenterContact}
                    onChange={(e) => setRealCenterContact(e.target.value)}
                    placeholder={`Ej: Sor María Hernández (${targetAudience.defaultContactRole})`}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Cantidad Estimada ({targetAudience.metricLabel})
                </label>
                <input
                  type="number"
                  min="1"
                  value={realCenterUsers}
                  onChange={(e) => setRealCenterUsers(parseInt(e.target.value) || 100)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Motivo / Razón de prospección</label>
                <textarea
                  rows={2}
                  value={realCenterReason}
                  onChange={(e) => setRealCenterReason(e.target.value)}
                  placeholder="Ej: Institución privada de alta matrícula que requiere automatización..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddRealCenterModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar en Radar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
