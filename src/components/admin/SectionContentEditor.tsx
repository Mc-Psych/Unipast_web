import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Type,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  Layout,
  CheckCircle2,
  RotateCcw,
  Save,
  Globe,
  ShieldAlert,
  GraduationCap,
  Sparkle,
  Sliders,
  Compass,
  FileText,
  Building2,
  Info,
  Check,
} from 'lucide-react';
import { SystemContentConfig, DEFAULT_SYSTEM_CONTENT_CONFIG } from '../../types';

export const SectionContentEditor: React.FC = () => {
  const { systemContentConfig, updateSystemContentConfig, resetSystemContentConfig, currentUser } = useApp();

  const [formState, setFormState] = useState<SystemContentConfig>({ ...systemContentConfig });
  const [activeCategory, setActiveCategory] = useState<'navbar' | 'welcome' | 'sidebar' | 'dashboards'>('navbar');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleFieldChange = <K extends keyof SystemContentConfig>(field: K, value: SystemContentConfig[K]) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await updateSystemContentConfig(formState);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = async () => {
    if (window.confirm('Reset all section texts, labels, and badges back to original system defaults?')) {
      await resetSystemContentConfig();
      setFormState({ ...DEFAULT_SYSTEM_CONTENT_CONFIG });
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  // Quick Preset Actions
  const handleApplyMinimalistNav = () => {
    const updated = {
      ...formState,
      showCloudBadge: false,
      showScopeBadge: false,
      showAiTutorNavButton: false,
      showBrandSubtitle: false,
    };
    setFormState(updated);
    updateSystemContentConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleApplyFullAcademic = () => {
    const updated = {
      ...formState,
      showCloudBadge: true,
      showScopeBadge: true,
      showAiTutorNavButton: true,
      showBrandSubtitle: true,
      showCurriculumBadge: true,
      showSidebarScopeBadge: true,
      showSidebarAiWidget: true,
    };
    setFormState(updated);
    updateSystemContentConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200 animate-in fade-in duration-300">
      {/* Top Banner & Quick Info */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Sliders className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Section, Badges & UI Text Customizer
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Customize branding, rename labels, or remove badges such as <strong>Ghana Cloud</strong>,{' '}
            <strong>System Admin Scope</strong>, <strong>Ghanaian Curriculum</strong>, and the <strong>AI Tutor</strong> navbar button.
          </p>
        </div>

        {/* Global Save / Reset / Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleApplyMinimalistNav}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
            title="Hide Ghana Cloud, Admin Scope, and AI Tutor with 1-click"
          >
            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
            <span>Minimalist Navbar Preset</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banners */}
      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>System section texts and visibility settings saved and synchronized across all active users!</span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <RotateCcw className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>Restored all section titles, badges, and slogans back to original defaults.</span>
        </div>
      )}

      {/* Live Interactive Preview Box of Custom Navbar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Preview: Dynamic Navigation Bar</span>
          </div>
          <span className="text-[11px] text-slate-400">Updates dynamically as you edit</span>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-3 overflow-x-auto">
          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
              {formState.brandLogoChar || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  {formState.brandName || 'UniPast'}
                </span>
                {formState.showCloudBadge && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {formState.cloudBadgeText || 'Ghana Cloud'}
                  </span>
                )}
              </div>
              {formState.showBrandSubtitle && formState.brandSubtitle && (
                <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                  {formState.brandSubtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Live Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {formState.showScopeBadge && (
              <span className="px-2.5 py-1 rounded-xl border border-amber-900/50 bg-amber-950/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span>{formState.sysAdminScopeText || 'System Admin Scope'}</span>
              </span>
            )}

            {formState.showAiTutorNavButton && (
              <span className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>{formState.aiTutorNavButtonText || 'AI Tutor'}</span>
              </span>
            )}

            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-indigo-500/40">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6">
        <button
          onClick={() => setActiveCategory('navbar')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeCategory === 'navbar'
              ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Navbar & Badges (Ghana Cloud, AI Tutor, Scope)</span>
        </button>

        <button
          onClick={() => setActiveCategory('welcome')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeCategory === 'welcome'
              ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Landing / Welcome Page (Curriculum & Hero)</span>
        </button>

        <button
          onClick={() => setActiveCategory('sidebar')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeCategory === 'sidebar'
              ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Sidebar & AI Widget</span>
        </button>

        <button
          onClick={() => setActiveCategory('dashboards')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeCategory === 'dashboards'
              ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Dashboard Titles & Subtitles</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CATEGORY 1: NAVBAR & BADGES                                               */}
      {/* ========================================================================= */}
      {activeCategory === 'navbar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-200">
          {/* Card 1: Cloud Badge (Ghana Cloud) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Globe className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cloud Status Badge</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Controls the badge next to the brand logo</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => handleFieldChange('showCloudBadge', !formState.showCloudBadge)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formState.showCloudBadge ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                title={formState.showCloudBadge ? 'Click to Remove/Hide Ghana Cloud' : 'Click to Enable/Show Ghana Cloud'}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    formState.showCloudBadge ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Badge Text (Current: "{formState.cloudBadgeText}")
              </label>
              <input
                type="text"
                value={formState.cloudBadgeText}
                onChange={(e) => handleFieldChange('cloudBadgeText', e.target.value)}
                placeholder="e.g. Ghana Cloud, National Portal, Academic Cloud"
                disabled={!formState.showCloudBadge}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Toggle the switch OFF to completely remove "Ghana Cloud" from the header.
              </p>
            </div>
          </div>

          {/* Card 2: AI Tutor Button on Navbar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Tutor Header Button</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">The quick AI study assistant launcher on navbar</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => handleFieldChange('showAiTutorNavButton', !formState.showAiTutorNavButton)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formState.showAiTutorNavButton ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                title={formState.showAiTutorNavButton ? 'Click to Remove AI Tutor from navbar' : 'Click to Show AI Tutor on navbar'}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    formState.showAiTutorNavButton ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Button Label (Current: "{formState.aiTutorNavButtonText}")
              </label>
              <input
                type="text"
                value={formState.aiTutorNavButtonText}
                onChange={(e) => handleFieldChange('aiTutorNavButtonText', e.target.value)}
                placeholder="e.g. AI Tutor, Study Assistant, Smart Bot"
                disabled={!formState.showAiTutorNavButton}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Toggle the switch OFF to remove the "AI Tutor" button from the top navigation bar.
              </p>
            </div>
          </div>

          {/* Card 3: Admin Scope Badge on Navbar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Admin Scope Indicator Badge</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Role indicator badge next to user profile</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => handleFieldChange('showScopeBadge', !formState.showScopeBadge)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formState.showScopeBadge ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                title={formState.showScopeBadge ? 'Click to Remove Scope badge' : 'Click to Enable Scope badge'}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    formState.showScopeBadge ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  System Admin Badge Label
                </label>
                <input
                  type="text"
                  value={formState.sysAdminScopeText}
                  onChange={(e) => handleFieldChange('sysAdminScopeText', e.target.value)}
                  placeholder="e.g. System Admin Scope, Global Administrator"
                  disabled={!formState.showScopeBadge}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  School Admin Badge Label
                </label>
                <input
                  type="text"
                  value={formState.schoolAdminScopeText}
                  onChange={(e) => handleFieldChange('schoolAdminScopeText', e.target.value)}
                  placeholder="e.g. School Admin, Institutional Officer"
                  disabled={!formState.showScopeBadge}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Brand Name & Subtitle */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Type className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Brand Name & Subtitle</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Platform logo text and descriptive tagline</p>
                </div>
              </div>

              {/* Subtitle Toggle */}
              <button
                type="button"
                onClick={() => handleFieldChange('showBrandSubtitle', !formState.showBrandSubtitle)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formState.showBrandSubtitle ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                title="Toggle Subtitle Visibility"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    formState.showBrandSubtitle ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={formState.brandName}
                    onChange={(e) => handleFieldChange('brandName', e.target.value)}
                    placeholder="e.g. UniPast"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Logo Icon Letter
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formState.brandLogoChar}
                    onChange={(e) => handleFieldChange('brandLogoChar', e.target.value.toUpperCase())}
                    placeholder="U"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-center font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Brand Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={formState.brandSubtitle}
                  onChange={(e) => handleFieldChange('brandSubtitle', e.target.value)}
                  placeholder="e.g. All Traditional & Technical Universities Portal"
                  disabled={!formState.showBrandSubtitle}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 2: LANDING & WELCOME PAGE                                        */}
      {/* ========================================================================= */}
      {activeCategory === 'welcome' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Card: Ghanaian Curriculum Top Badge */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <GraduationCap className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Curriculum / Region Top Badge</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Badge displayed above the welcome hero header</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => handleFieldChange('showCurriculumBadge', !formState.showCurriculumBadge)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formState.showCurriculumBadge ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                title="Toggle Curriculum Badge Visibility"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    formState.showCurriculumBadge ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Badge Text (Current: "{formState.curriculumBadgeText}")
              </label>
              <input
                type="text"
                value={formState.curriculumBadgeText}
                onChange={(e) => handleFieldChange('curriculumBadgeText', e.target.value)}
                placeholder="e.g. Ghana Higher Education Past Exam & Solution Hub"
                disabled={!formState.showCurriculumBadge}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Toggle the switch OFF to remove the "Ghanaian Curriculum" badge from the welcome screen.
              </p>
            </div>
          </div>

          {/* Card: Hero Title & Description */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Welcome Screen Hero Headline & Description
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Hero Title (First Line)
                </label>
                <input
                  type="text"
                  value={formState.welcomeHeroTitle}
                  onChange={(e) => handleFieldChange('welcomeHeroTitle', e.target.value)}
                  placeholder="Master Your Exams Across"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Hero Title Highlight (Gradient Line)
                </label>
                <input
                  type="text"
                  value={formState.welcomeHeroHighlight}
                  onChange={(e) => handleFieldChange('welcomeHeroHighlight', e.target.value)}
                  placeholder="Every Ghanaian University"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Hero Description Paragraph
              </label>
              <textarea
                rows={3}
                value={formState.welcomeHeroDesc}
                onChange={(e) => handleFieldChange('welcomeHeroDesc', e.target.value)}
                placeholder="Seamless past questions, step-by-step marking rubrics..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
              />
            </div>
          </div>

          {/* Card: 3 Feature Cards */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Welcome Screen Highlight Cards (3 Columns)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Feature 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">Feature 1 Title</label>
                <input
                  type="text"
                  value={formState.feature1Title}
                  onChange={(e) => handleFieldChange('feature1Title', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">Description</label>
                <textarea
                  rows={3}
                  value={formState.feature1Desc}
                  onChange={(e) => handleFieldChange('feature1Desc', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              {/* Feature 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">Feature 2 Title</label>
                <input
                  type="text"
                  value={formState.feature2Title}
                  onChange={(e) => handleFieldChange('feature2Title', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">Description</label>
                <textarea
                  rows={3}
                  value={formState.feature2Desc}
                  onChange={(e) => handleFieldChange('feature2Desc', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              {/* Feature 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">Feature 3 Title</label>
                <input
                  type="text"
                  value={formState.feature3Title}
                  onChange={(e) => handleFieldChange('feature3Title', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">Description</label>
                <textarea
                  rows={3}
                  value={formState.feature3Desc}
                  onChange={(e) => handleFieldChange('feature3Desc', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Card: Bottom CTA Banner */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Welcome Bottom Call-to-Action Banner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  CTA Banner Title
                </label>
                <input
                  type="text"
                  value={formState.ctaBannerTitle}
                  onChange={(e) => handleFieldChange('ctaBannerTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  CTA Banner Description
                </label>
                <input
                  type="text"
                  value={formState.ctaBannerDesc}
                  onChange={(e) => handleFieldChange('ctaBannerDesc', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 3: SIDEBAR & WIDGETS                                             */}
      {/* ========================================================================= */}
      {activeCategory === 'sidebar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-200">
          {/* Sidebar Scope Badge */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sidebar Scope Label</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Scope text under the institution card</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleFieldChange('showSidebarScopeBadge', !formState.showSidebarScopeBadge)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formState.showSidebarScopeBadge ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                title="Toggle Sidebar Scope Visibility"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    formState.showSidebarScopeBadge ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Sidebar Scope Text
              </label>
              <input
                type="text"
                value={formState.sidebarScopeText}
                onChange={(e) => handleFieldChange('sidebarScopeText', e.target.value)}
                placeholder="e.g. System Admin Scope"
                disabled={!formState.showSidebarScopeBadge}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white disabled:opacity-50"
              />
            </div>
          </div>

          {/* Sidebar AI Exam Tutor Widget */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sidebar AI Exam Tutor Widget</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Quick action card at the bottom of the sidebar</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleFieldChange('showSidebarAiWidget', !formState.showSidebarAiWidget)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formState.showSidebarAiWidget ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                title="Toggle Sidebar AI Widget Visibility"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    formState.showSidebarAiWidget ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Widget Title
                </label>
                <input
                  type="text"
                  value={formState.sidebarAiWidgetTitle}
                  onChange={(e) => handleFieldChange('sidebarAiWidgetTitle', e.target.value)}
                  placeholder="e.g. AI Exam Tutor"
                  disabled={!formState.showSidebarAiWidget}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Widget Subtitle / Description
                </label>
                <input
                  type="text"
                  value={formState.sidebarAiWidgetDesc}
                  onChange={(e) => handleFieldChange('sidebarAiWidgetDesc', e.target.value)}
                  placeholder="e.g. Instant step-by-step solutions..."
                  disabled={!formState.showSidebarAiWidget}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 4: DASHBOARD HEADINGS                                            */}
      {/* ========================================================================= */}
      {activeCategory === 'dashboards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-200">
          {/* Student Dashboard Header */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Student Dashboard Main Heading</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Main Header Title
              </label>
              <input
                type="text"
                value={formState.studentDashboardTitle}
                onChange={(e) => handleFieldChange('studentDashboardTitle', e.target.value)}
                placeholder="e.g. Academic Revision Hub"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Subtitle Description
              </label>
              <textarea
                rows={2}
                value={formState.studentDashboardSubtitle}
                onChange={(e) => handleFieldChange('studentDashboardSubtitle', e.target.value)}
                placeholder="Verified exam questions, step-by-step marking rubrics..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* System Admin Registry Header */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>System Admin Registry Heading</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Registry Title
              </label>
              <input
                type="text"
                value={formState.sysAdminHubTitle}
                onChange={(e) => handleFieldChange('sysAdminHubTitle', e.target.value)}
                placeholder="e.g. Ghana Higher Education Registry & Administration"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Registry Subtitle
              </label>
              <textarea
                rows={2}
                value={formState.sysAdminHubSubtitle}
                onChange={(e) => handleFieldChange('sysAdminHubSubtitle', e.target.value)}
                placeholder="Provision universities, manage faculties, academic courses..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Action Bar */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-slate-900/90 dark:bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl flex items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <p className="text-xs text-slate-300">
            Changes apply instantly to the active session and synchronize to all connected students and administrators.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Save & Apply Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
