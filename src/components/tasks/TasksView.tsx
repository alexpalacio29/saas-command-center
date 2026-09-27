import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Filter,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  MessageSquare,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../../types';

export const TasksView: React.FC = () => {
  const {
    tasks,
    products,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    toggleTaskSubitem,
    currentUser,
    searchQuery,
  } = useApp();

  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('ALL');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // New task form state
  const [newTaskData, setNewTaskData] = useState<{
    title: string;
    description: string;
    productId: string;
    responsible: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
    tags: string;
    checklistRaw: string;
  }>({
    title: '',
    description: '',
    productId: products[0]?.id || '',
    responsible: currentUser.name,
    priority: 'Media',
    status: 'Pendiente',
    dueDate: new Date().toISOString().split('T')[0],
    tags: 'Core, Feature',
    checklistRaw: 'Diseño y especificación\nImplementación\nQA',
  });

  const filteredTasks = tasks.filter((t) => {
    if (selectedProductFilter !== 'ALL' && t.productId !== selectedProductFilter) return false;
    if (selectedStatusFilter !== 'ALL' && t.status !== selectedStatusFilter) return false;
    if (selectedPriorityFilter !== 'ALL' && t.priority !== selectedPriorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskData.title) return;

    const checklistItems = newTaskData.checklistRaw
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((text, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        text: text.trim(),
        completed: false,
      }));

    const tagsList = newTaskData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addTask({
      title: newTaskData.title,
      description: newTaskData.description,
      productId: newTaskData.productId,
      responsible: newTaskData.responsible,
      priority: newTaskData.priority,
      status: newTaskData.status,
      dueDate: newTaskData.dueDate,
      tags: tagsList,
      checklist: checklistItems,
      comments: [],
    });

    setShowNewTaskModal(false);
    setNewTaskData({
      title: '',
      description: '',
      productId: products[0]?.id || '',
      responsible: currentUser.name,
      priority: 'Media',
      status: 'Pendiente',
      dueDate: new Date().toISOString().split('T')[0],
      tags: 'Core',
      checklistRaw: '',
    });
  };

  const priorityColors = {
    Crítica: 'bg-red-500/20 text-red-300 border-red-500/30',
    Alta: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Media: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    Baja: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const statusColors = {
    Pendiente: 'text-slate-400',
    'En progreso': 'text-blue-400',
    Bloqueada: 'text-red-400',
    Completada: 'text-emerald-400 line-through',
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-400" />
            <span>Gestor Global de Tareas</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {tasks.filter((t) => t.status !== 'Completada').length} pendientes de {tasks.length} tareas totales
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-300">Filtrar:</span>
        </div>

        <select
          value={selectedProductFilter}
          onChange={(e) => setSelectedProductFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
        >
          <option value="ALL">Todos los Productos</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En progreso">En progreso</option>
          <option value="Bloqueada">Bloqueada</option>
          <option value="Completada">Completada</option>
        </select>

        <select
          value={selectedPriorityFilter}
          onChange={(e) => setSelectedPriorityFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
        >
          <option value="ALL">Todas las Prioridades</option>
          <option value="Crítica">Crítica</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>

        {(selectedProductFilter !== 'ALL' ||
          selectedStatusFilter !== 'ALL' ||
          selectedPriorityFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSelectedProductFilter('ALL');
              setSelectedStatusFilter('ALL');
              setSelectedPriorityFilter('ALL');
            }}
            className="text-indigo-400 hover:text-indigo-300 font-medium ml-auto"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const prod = products.find((p) => p.id === task.productId);
          const isDone = task.status === 'Completada';

          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all text-xs space-y-3 ${
                isDone
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                  : task.status === 'Bloqueada'
                  ? 'bg-red-950/15 border-red-500/30'
                  : 'bg-slate-900 border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition shrink-0 ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-slate-700 bg-slate-800 hover:border-indigo-500 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-1">
                    <h3 className={`text-sm font-bold text-white ${isDone ? 'line-through text-slate-500' : ''}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-slate-400 text-xs leading-relaxed max-w-3xl">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      priorityColors[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>

                  <select
                    value={task.status}
                    onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                    className="bg-slate-950 border border-slate-700 rounded-lg text-[10px] px-2 py-1 text-slate-300"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Bloqueada">Bloqueada</option>
                    <option value="Completada">Completada</option>
                  </select>
                </div>
              </div>

              {/* Subtasks Checklist */}
              {task.checklist && task.checklist.length > 0 && (
                <div className="ml-8 pl-3 border-l-2 border-slate-800 space-y-1.5 pt-1">
                  {task.checklist.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => toggleTaskSubitem(task.id, sub.id)}
                      className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        readOnly
                        className="rounded border-slate-700 accent-indigo-500 cursor-pointer"
                      />
                      <span className={sub.completed ? 'line-through text-slate-500' : ''}>
                        {sub.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer Meta */}
              <div className="ml-8 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-3">
                  {prod && (
                    <span className="font-semibold text-slate-400 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-indigo-400" /> {prod.name}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3 h-3" /> Vence: <strong className="text-slate-300">{task.dueDate}</strong>
                    </span>
                  )}
                  <span>Resp: {task.responsible}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
            No hay tareas que coincidan con los filtros seleccionados.
          </div>
        )}
      </div>

      {/* NEW TASK MODAL */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Crear Nueva Tarea</h3>
              <button onClick={() => setShowNewTaskModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs text-slate-300">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Título de la Tarea *</label>
                <input
                  type="text"
                  required
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  placeholder="Ej: Implementar webhooks de facturación"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Descripción</label>
                <textarea
                  rows={2}
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                  placeholder="Contexto, criterios de aceptación o detalles técnicos..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Producto SaaS</label>
                  <select
                    value={newTaskData.productId}
                    onChange={(e) => setNewTaskData({ ...newTaskData, productId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Prioridad</label>
                  <select
                    value={newTaskData.priority}
                    onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value as TaskPriority })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Fecha Límite</label>
                  <input
                    type="date"
                    value={newTaskData.dueDate}
                    onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Etiquetas (separadas por coma)</label>
                  <input
                    type="text"
                    value={newTaskData.tags}
                    onChange={(e) => setNewTaskData({ ...newTaskData, tags: e.target.value })}
                    placeholder="Backend, DGII, Bug"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  Sub-tareas / Checklist (1 por línea)
                </label>
                <textarea
                  rows={3}
                  value={newTaskData.checklistRaw}
                  onChange={(e) => setNewTaskData({ ...newTaskData, checklistRaw: e.target.value })}
                  placeholder="Paso 1&#10;Paso 2&#10;Paso 3"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
