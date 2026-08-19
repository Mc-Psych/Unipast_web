import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Calendar,
  Bookmark,
  PlusCircle,
  Users,
  BarChart3,
  Building2,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Layers,
  History,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    currentUser,
    currentUniversity,
    selectedUniversityId,
    activeView,
    setActiveView,
    papers,
    materials,
    bookmarks,
    openAiWithContext,
  } = useApp();

  const handleNavClick = (view: string) => {
    setActiveView(view);
    if (onCloseMobile) onCloseMobile();
  };

  // Student Nav Items
  const studentNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'papers',
      label: 'Past Exam Papers',
      icon: FileText,
      badge: papers.filter((p) => p.status === 'PUBLISHED' && !p.isDisabled).length,
    },
    {
      id: 'materials',
      label: 'Study Materials Hub',
      icon: BookOpen,
      badge: materials.filter((m) => !m.isDisabled).length,
    },
    { id: 'timetable', label: 'Exam Timetable', icon: Calendar },
    {
      id: 'bookmarks',
      label: 'Saved & Bookmarks',
      icon: Bookmark,
      badge: bookmarks.length > 0 ? bookmarks.length : undefined,
    },
  ];

  // School Admin Nav Items
  const schoolAdminNav = [
    { id: 'dashboard', label: 'School Overview', icon: LayoutDashboard },
    { id: 'digitizer', label: 'Paper Digitizer', icon: PlusCircle, isHighlight: true },
    { id: 'papers', label: 'Manage Exam Papers', icon: FileText },
    { id: 'system-config', label: 'Faculties & Courses', icon: Building2 },
    { id: 'materials', label: 'Study Resources', icon: BookOpen },
    { id: 'timetable', label: 'Exam Timetables', icon: Calendar },
    { id: 'users', label: 'Student & Staff Roster', icon: Users },
    { id: 'analytics', label: 'School Analytics', icon: BarChart3 },
  ];

  // System Admin Nav Items
  const sysAdminNav = [
    { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
    { id: 'system-config', label: 'Universities & Faculties', icon: Building2, isHighlight: true },
    { id: 'digitizer', label: 'Paper Digitizer', icon: PlusCircle },
    { id: 'papers', label: 'Global Exam Papers', icon: FileText },
    { id: 'materials', label: 'Global Materials Hub', icon: BookOpen },
    { id: 'users', label: 'Global User Directory', icon: Users },
    { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
    { id: 'audit-logs', label: 'Audit Logs & Security', icon: History },
  ];

  const currentNav =
    currentUser.role === 'STUDENT'
      ? studentNav
      : currentUser.role === 'SCHOOL_ADMIN'
      ? schoolAdminNav
      : sysAdminNav;

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between py-4 px-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200">
      <div className="space-y-4">
        {/* University Crest / Context Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg shrink-0 overflow-hidden p-1 shadow-xs">
              {selectedUniversityId === 'all' ? (
                '🌐'
              ) : currentUniversity?.logoUrl ? (
                <img src={currentUniversity.logoUrl} alt={currentUniversity.name} className="w-full h-full object-contain" />
              ) : (
                currentUniversity?.logo || '🎓'
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {selectedUniversityId === 'all' ? 'All Institutions' : currentUniversity?.name || 'UniPast Portal'}
                </p>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mt-0.5 truncate">
                {currentUser.role === 'STUDENT'
                  ? `Level ${currentUser.level || 200} • Student`
                  : currentUser.role === 'SCHOOL_ADMIN'
                  ? 'Institutional Admin'
                  : 'System Admin Scope'}
              </p>
            </div>
          </div>

          {currentUniversity && selectedUniversityId !== 'all' && (
            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <strong className="text-slate-900 dark:text-slate-200">
                  {papers.filter((p) => p.universityId === currentUniversity.id && !p.isDisabled).length}
                </strong>{' '}
                papers
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <strong className="text-slate-900 dark:text-slate-200">
                  {currentUniversity.activeStudents.toLocaleString()}
                </strong>{' '}
                students
              </span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <div className="px-3 pt-2 text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
            Menu
          </div>
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 font-bold shadow-xs border border-indigo-200 dark:border-indigo-800/60'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* AI Quick Tutor Action */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 text-slate-800 dark:text-slate-200 relative overflow-hidden shadow-xs">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span>AI Exam Tutor</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
              Instant step-by-step solutions and mathematical proofs.
            </p>
            <button
              onClick={() => {
                openAiWithContext({ topic: 'General Revision' });
                if (onCloseMobile) onCloseMobile();
              }}
              className="mt-2.5 w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Ask AI Tutor
            </button>
          </div>
        </div>
      </div>

      {/* Footer User Info */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-1.5">
          <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-white">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-slate-900 h-full shadow-2xl z-10 border-r border-slate-200 dark:border-slate-800">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
