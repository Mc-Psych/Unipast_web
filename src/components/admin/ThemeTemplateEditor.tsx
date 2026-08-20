import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeTemplate, ThemeColors, ThemeTypography, ThemeLayout } from '../../types';
import {
  Palette,
  Check,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  Sparkles,
  Layout,
  Type,
  Sun,
  Moon,
  Layers,
  Sliders,
  ShieldCheck,
  RefreshCw,
  Copy,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  Laptop,
} from 'lucide-react';

const DEFAULT_NEW_THEME: Omit<ThemeTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'Custom Ghana Academic Theme',
  description: 'Customized institutional palette with tailored colors, fonts, and layout.',
  isBuiltIn: false,
  isEnabled: true,
  category: 'Custom',
  authorName: 'System Administrator',
  colors: {
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    primaryLight: '#EEF2FF',
    accent: '#F59E0B',
    bgLight: '#F8FAFC',
    bgDark: '#0F0F12',
    cardLight: '#FFFFFF',
    cardDark: '#171821',
    surfaceLight: '#F1F5F9',
    surfaceDark: '#1F212E',
    textPrimaryLight: '#0F172A',
    textPrimaryDark: '#F8FAFC',
    textSecondaryLight: '#64748B',
    textSecondaryDark: '#94A3B8',
    borderLight: '#E2E8F0',
    borderDark: '#27273A',
    sidebarLight: '#FFFFFF',
    sidebarDark: '#13141C',
    navbarLight: '#FFFFFF',
    navbarDark: '#13141C',
  },
  typography: {
    fontFamily: 'sans',
    fontFamilyName: 'Plus Jakarta Sans',
    headingFontFamily: 'sans',
    baseFontSize: 'standard',
    headingWeight: 'bold',
    letterSpacing: 'normal',
  },
  layout: {
    borderRadius: 'rounded',
    cardStyle: 'bordered',
    density: 'comfortable',
    navbarStyle: 'solid',
    sidebarStyle: 'default',
    maxWidth: 'standard',
  },
};

export const ThemeTemplateEditor: React.FC = () => {
  const {
    themeTemplates,
    activeThemeTemplateId,
    setActiveThemeTemplate,
    addThemeTemplate,
    updateThemeTemplate,
    deleteThemeTemplate,
    toggleThemeTemplateStatus,
    theme,
    toggleTheme,
  } = useApp();

  // State for Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ThemeTemplate | null>(null);
  const [formData, setFormData] = useState<Omit<ThemeTemplate, 'id' | 'createdAt' | 'updatedAt'>>(DEFAULT_NEW_THEME);
  const [modalTab, setModalTab] = useState<'colors' | 'typography' | 'layout' | 'general'>('colors');
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>(theme);

  // Quick Demo Login Toggle state
  const [isDemoSectionEnabled, setIsDemoSectionEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unipast_enable_demo_logins');
      return saved === 'true'; // Disabled by default for production security
    }
    return false;
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleDemoSection = () => {
    const nextVal = !isDemoSectionEnabled;
    setIsDemoSectionEnabled(nextVal);
    localStorage.setItem('unipast_enable_demo_logins', nextVal ? 'true' : 'false');
    showNotification('success', nextVal ? 'Quick Demo Login Section Enabled' : 'Quick Demo Login Section Disabled for Production');
  };

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setFormData({
      ...DEFAULT_NEW_THEME,
      name: `Custom Theme #${themeTemplates.length + 1}`,
    });
    setModalTab('colors');
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (template: ThemeTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      isBuiltIn: template.isBuiltIn,
      isEnabled: template.isEnabled,
      isDefault: template.isDefault,
      category: template.category,
      colors: { ...template.colors },
      typography: { ...template.typography },
      layout: { ...template.layout },
      authorName: template.authorName,
    });
    setModalTab('colors');
    setIsEditModalOpen(true);
  };

  const handleDuplicate = (template: ThemeTemplate) => {
    setEditingTemplate(null);
    setFormData({
      name: `${template.name} (Copy)`,
      description: `Custom variation of ${template.name}`,
      isBuiltIn: false,
      isEnabled: true,
      category: 'Custom',
      colors: { ...template.colors },
      typography: { ...template.typography },
      layout: { ...template.layout },
      authorName: 'System Administrator',
    });
    setModalTab('colors');
    setIsEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showNotification('error', 'Please provide a valid template name.');
      return;
    }

    if (editingTemplate) {
      await updateThemeTemplate(editingTemplate.id, formData);
      showNotification('success', `Theme "${formData.name}" updated successfully.`);
    } else {
      await addThemeTemplate(formData);
      showNotification('success', `Theme "${formData.name}" created and added to library.`);
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the theme template "${name}"?`)) {
      await deleteThemeTemplate(id);
      showNotification('success', `Theme "${name}" deleted.`);
    }
  };

  const handleToggleStatus = async (id: string, name: string) => {
    await toggleThemeTemplateStatus(id);
    showNotification('success', `Toggled availability status for "${name}".`);
  };

  const handleApplyTheme = (id: string, name: string) => {
    setActiveThemeTemplate(id);
    showNotification('success', `"${name}" is now the active global theme template!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-semibold animate-in slide-in-from-top-3 ${
            notification.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
              : 'bg-rose-950 text-rose-200 border-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              System Theme Templates & Live Customizer
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            System Administrators can create, edit, enable/disable, and live-switch university themes.
            Control primary and accent palettes, dark/light canvas backgrounds, typography weights, and border geometry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Theme Template</span>
          </button>
        </div>
      </div>

      {/* Login Interface Quick Demo Control */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-amber-300">
                Login Interface: Quick Demo 1-Click Accounts Section
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isDemoSectionEnabled
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30'
                }`}
              >
                {isDemoSectionEnabled ? 'ENABLED (Testing Mode)' : 'DISABLED (Production Secure)'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Disable the quick demo evaluation buttons on the login screen to ensure a clean, production-ready sign-in experience requiring real student/admin credentials.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleDemoSection}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 shrink-0 ${
            isDemoSectionEnabled
              ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-700 shadow-sm'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-700 shadow-sm'
          }`}
        >
          {isDemoSectionEnabled ? (
            <>
              <ToggleRight className="w-4 h-4" />
              <span>Disable Quick Demo Section</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-4 h-4" />
              <span>Enable Quick Demo Section</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of Theme Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {themeTemplates.map((tpl) => {
          const isActive = tpl.id === activeThemeTemplateId;
          return (
            <div
              key={tpl.id}
              className={`rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-white dark:bg-[#15161E] shadow-xl'
                  : tpl.isEnabled
                  ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#13141C] hover:border-slate-300 dark:hover:border-slate-700'
                  : 'border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 opacity-70'
              }`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl shadow-md flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>ACTIVE GLOBAL THEME</span>
                </div>
              )}

              <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 pr-12">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{tpl.name}</h3>
                      {tpl.isBuiltIn && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Built-in
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>
                </div>

                {/* Color Palette Swatches */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Palette Swatches
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg border border-black/10 shadow-sm flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ backgroundColor: tpl.colors.primary }}
                      title={`Primary: ${tpl.colors.primary}`}
                    >
                      P
                    </div>
                    <div
                      className="w-8 h-8 rounded-lg border border-black/10 shadow-sm flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ backgroundColor: tpl.colors.accent }}
                      title={`Accent: ${tpl.colors.accent}`}
                    >
                      A
                    </div>
                    <div
                      className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-center text-[9px] font-bold text-slate-800"
                      style={{ backgroundColor: tpl.colors.bgLight }}
                      title={`Light Canvas: ${tpl.colors.bgLight}`}
                    >
                      L
                    </div>
                    <div
                      className="w-8 h-8 rounded-lg border border-slate-700 shadow-sm flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ backgroundColor: tpl.colors.bgDark }}
                      title={`Dark Canvas: ${tpl.colors.bgDark}`}
                    >
                      D
                    </div>
                    <div
                      className="w-8 h-8 rounded-lg border border-slate-700 shadow-sm flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ backgroundColor: tpl.colors.cardDark }}
                      title={`Dark Card: ${tpl.colors.cardDark}`}
                    >
                      C
                    </div>
                  </div>
                </div>

                {/* Attributes Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Font: {tpl.typography.fontFamilyName}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Radius: {tpl.layout.borderRadius}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Density: {tpl.layout.density}
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(tpl.id, tpl.name)}
                    className={`text-[11px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                      tpl.isEnabled
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {tpl.isEnabled ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    <span>{tpl.isEnabled ? 'Enabled' : 'Disabled'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(tpl)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                    title="Duplicate Theme"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(tpl)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                    title="Edit Theme"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {!tpl.isBuiltIn && (
                    <button
                      type="button"
                      onClick={() => handleDelete(tpl.id, tpl.name)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                      title="Delete Theme"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyTheme(tpl.id, tpl.name)}
                  disabled={!tpl.isEnabled || isActive}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-default'
                      : tpl.isEnabled
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isActive ? 'Current' : 'Apply'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Theme Template Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#15161E] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {editingTemplate ? `Edit Theme: ${editingTemplate.name}` : 'Create New Theme Template'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configure colors, typography, layout geometry, and preview in real time.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 gap-4">
              <button
                type="button"
                onClick={() => setModalTab('colors')}
                className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
                  modalTab === 'colors'
                    ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Colors & Palettes</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('typography')}
                className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
                  modalTab === 'typography'
                    ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Typography</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('layout')}
                className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
                  modalTab === 'layout'
                    ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Layout & Geometry</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('general')}
                className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
                  modalTab === 'general'
                    ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>General Details</span>
              </button>
            </div>

            {/* Modal Body: Two Columns (Form + Live Interactive Preview) */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form Controls */}
              <div className="lg:col-span-7 space-y-5">
                {modalTab === 'colors' && (
                  <div className="space-y-5">
                    {/* Primary & Accent */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Brand Core Colors
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Primary Color
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={formData.colors.primary}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colors: { ...prev.colors, primary: e.target.value },
                                }))
                              }
                              className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent"
                            />
                            <input
                              type="text"
                              value={formData.colors.primary}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colors: { ...prev.colors, primary: e.target.value },
                                }))
                              }
                              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Accent Color
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={formData.colors.accent}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colors: { ...prev.colors, accent: e.target.value },
                                }))
                              }
                              className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent"
                            />
                            <input
                              type="text"
                              value={formData.colors.accent}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colors: { ...prev.colors, accent: e.target.value },
                                }))
                              }
                              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Backgrounds */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Page & Card Surfaces
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Light Canvas Background
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={formData.colors.bgLight}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colors: { ...prev.colors, bgLight: e.target.value },
                                }))
                              }
                              className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={formData.colors.bgLight}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colors: { ...prev.colors, bgLight: e.target.value },
                                }))
                              }
                              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Dark Canvas Background
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={formData.colors.bgDark}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colors: { ...prev.colors, bgDark: e.target.value },
                                }))
                              }
                              className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={formData.colors.bgDark}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colors: { ...prev.colors, bgDark: e.target.value },
                                }))
                              }
                              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Light Card Surface
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={formData.colors.cardLight}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colors: { ...prev.colors, cardLight: e.target.value },
                                }))
                              }
                              className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={formData.colors.cardLight}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colors: { ...prev.colors, cardLight: e.target.value },
                                }))
                              }
                              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Dark Card Surface
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={formData.colors.cardDark}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colors: { ...prev.colors, cardDark: e.target.value },
                                }))
                              }
                              className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={formData.colors.cardDark}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  colors: { ...prev.colors, cardDark: e.target.value },
                                }))
                              }
                              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Text and Borders */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Typography & Border Colors
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Light Text Primary
                          </label>
                          <input
                            type="text"
                            value={formData.colors.textPrimaryLight}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                colors: { ...prev.colors, textPrimaryLight: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Dark Text Primary
                          </label>
                          <input
                            type="text"
                            value={formData.colors.textPrimaryDark}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                colors: { ...prev.colors, textPrimaryDark: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {modalTab === 'typography' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Font Family Configuration
                      </label>
                      <select
                        value={formData.typography.fontFamily}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          const nameMap: Record<string, string> = {
                            sans: 'Plus Jakarta Sans & Inter',
                            serif: 'Playfair Display & Merriweather',
                            mono: 'JetBrains Mono & Fira Code',
                            rounded: 'Outfit & Quicksand',
                            display: 'Cabinet Grotesk & Clash',
                          };
                          setFormData((prev) => ({
                            ...prev,
                            typography: {
                              ...prev.typography,
                              fontFamily: val,
                              fontFamilyName: nameMap[val] || 'Custom',
                            },
                          }));
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="sans">Modern Sans (Plus Jakarta Sans / Inter)</option>
                        <option value="rounded">Academic Rounded (Outfit / Quicksand)</option>
                        <option value="display">Prestigious Display (Cabinet Grotesk)</option>
                        <option value="serif">Classical Academic Serif (Playfair / Merriweather)</option>
                        <option value="mono">Technical Monospace (JetBrains Mono)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Heading Font Weight
                        </label>
                        <select
                          value={formData.typography.headingWeight}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              typography: { ...prev.typography, headingWeight: e.target.value as any },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        >
                          <option value="normal">Normal (400)</option>
                          <option value="semibold">Semi-Bold (600)</option>
                          <option value="bold">Bold (700)</option>
                          <option value="black">Extra Black (900)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Base Typography Size
                        </label>
                        <select
                          value={formData.typography.baseFontSize}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              typography: { ...prev.typography, baseFontSize: e.target.value as any },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        >
                          <option value="compact">Compact (Dense Exam Tables)</option>
                          <option value="standard">Standard (Optimized for Reading)</option>
                          <option value="large">Spacious (Enhanced Legibility)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {modalTab === 'layout' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Border Radius Geometry
                        </label>
                        <select
                          value={formData.layout.borderRadius}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              layout: { ...prev.layout, borderRadius: e.target.value as any },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        >
                          <option value="sharp">Sharp (0px, Traditional Academic)</option>
                          <option value="subtle">Subtle (8px, Clean & Crisp)</option>
                          <option value="rounded">Rounded (16px, Modern Fluid)</option>
                          <option value="pill">Pill Smooth (24px, Playful)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Layout Spacing Density
                        </label>
                        <select
                          value={formData.layout.density}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              layout: { ...prev.layout, density: e.target.value as any },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        >
                          <option value="compact">Compact (High Information Density)</option>
                          <option value="comfortable">Comfortable (Balanced UI)</option>
                          <option value="spacious">Spacious (Generous Negative Space)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Card Elevation Style
                        </label>
                        <select
                          value={formData.layout.cardStyle}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              layout: { ...prev.layout, cardStyle: e.target.value as any },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        >
                          <option value="bordered">Subtle Bordered</option>
                          <option value="shadowed">Elevated Soft Shadow</option>
                          <option value="flat">Flat Minimalist</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Sidebar Presentation
                        </label>
                        <select
                          value={formData.layout.sidebarStyle}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              layout: { ...prev.layout, sidebarStyle: e.target.value as any },
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        >
                          <option value="default">Full Standard Sidebar</option>
                          <option value="compact">Compact Slim Sidebar</option>
                          <option value="floating">Floating Island Sidebar</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {modalTab === 'general' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Theme Template Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Ghana Modern Indigo"
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Description & Intent
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief summary of this visual identity theme..."
                        rows={3}
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Category Archetype
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as any }))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        >
                          <option value="Modern">Modern</option>
                          <option value="Academic">Academic</option>
                          <option value="Prestigious">Prestigious</option>
                          <option value="High-Contrast">High-Contrast</option>
                          <option value="Minimalist">Minimalist</option>
                          <option value="Custom">Custom</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Template Author
                        </label>
                        <input
                          type="text"
                          value={formData.authorName || 'System Administrator'}
                          onChange={(e) => setFormData((prev) => ({ ...prev, authorName: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Live Interactive Card Preview */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Theme Preview</span>
                  </span>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPreviewMode('light')}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                        previewMode === 'light'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500'
                      }`}
                    >
                      <Sun className="w-3 h-3" />
                      <span>Light</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('dark')}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                        previewMode === 'dark'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500'
                      }`}
                    >
                      <Moon className="w-3 h-3" />
                      <span>Dark</span>
                    </button>
                  </div>
                </div>

                {/* Simulated Container */}
                <div
                  className="p-5 rounded-2xl border transition-all duration-300 space-y-4"
                  style={{
                    backgroundColor: previewMode === 'light' ? formData.colors.bgLight : formData.colors.bgDark,
                    borderColor: previewMode === 'light' ? formData.colors.borderLight : formData.colors.borderDark,
                  }}
                >
                  {/* Simulated Component Card */}
                  <div
                    className="p-4 rounded-xl border transition shadow-sm space-y-3"
                    style={{
                      backgroundColor: previewMode === 'light' ? formData.colors.cardLight : formData.colors.cardDark,
                      borderColor: previewMode === 'light' ? formData.colors.borderLight : formData.colors.borderDark,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${formData.colors.primary}20`,
                          color: formData.colors.primary,
                        }}
                      >
                        CS 201 • Level 200
                      </span>
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: formData.colors.accent }}
                      >
                        ★ 4.9 (480 Solves)
                      </span>
                    </div>

                    <div>
                      <h5
                        className="text-xs font-black"
                        style={{
                          color: previewMode === 'light' ? formData.colors.textPrimaryLight : formData.colors.textPrimaryDark,
                        }}
                      >
                        Data Structures & Algorithms Exam
                      </h5>
                      <p
                        className="text-[11px] mt-1 line-clamp-2"
                        style={{
                          color: previewMode === 'light' ? formData.colors.textSecondaryLight : formData.colors.textSecondaryDark,
                        }}
                      >
                        Complete verified marking scheme with step-by-step tree derivations and code snippets.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        className="flex-1 py-1.5 rounded-lg text-white text-[11px] font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                        style={{ backgroundColor: formData.colors.primary }}
                      >
                        <span>View Past Paper</span>
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold border transition"
                        style={{
                          color: previewMode === 'light' ? formData.colors.textPrimaryLight : formData.colors.textPrimaryDark,
                          borderColor: previewMode === 'light' ? formData.colors.borderLight : formData.colors.borderDark,
                        }}
                      >
                        Practice
                      </button>
                    </div>
                  </div>

                  {/* Header Title Visibility Check */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Header Contrast Check
                    </span>
                    <h4
                      className="text-base font-black"
                      style={{
                        color: previewMode === 'light' ? formData.colors.textPrimaryLight : formData.colors.textPrimaryDark,
                      }}
                    >
                      Past Papers & Solution Archive
                    </h4>
                    <p
                      className="text-[11px]"
                      style={{
                        color: previewMode === 'light' ? formData.colors.textSecondaryLight : formData.colors.textSecondaryDark,
                      }}
                    >
                      High-distinction Ghanaian university examinations and step-by-step marking rubrics.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="lg:col-span-12 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingTemplate ? 'Update Theme Template' : 'Save Theme Template'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
