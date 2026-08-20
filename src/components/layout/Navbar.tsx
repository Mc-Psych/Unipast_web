import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Moon,
  Sun,
  GraduationCap,
  ShieldAlert,
  UserCheck,
  Sparkles,
  ChevronDown,
  Building2,
  Bookmark,
  LogOut,
  Menu,
  X,
  Camera,
  Upload,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const {
    currentUser,
    switchRole,
    universities,
    selectedUniversityId,
    setSelectedUniversityId,
    currentUniversity,
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    bookmarks,
    setActiveView,
    openAiWithContext,
    logout,
    updateUserProfile,
    changePassword,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isUniDropdownOpen, setIsUniDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<'details' | 'security'>('details');

  // Level change state
  const [selectedLevel, setSelectedLevel] = useState<number>(currentUser.level || 200);
  const [isSavingLevel, setIsSavingLevel] = useState(false);
  const [levelSuccessMsg, setLevelSuccessMsg] = useState<string | null>(null);

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isSavingPass, setIsSavingPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  // Photo upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoFeedback, setPhotoFeedback] = useState<string | null>(null);

  const isStudent = currentUser.role === 'STUDENT';
  const isSchoolAdmin = currentUser.role === 'SCHOOL_ADMIN';
  const isSysAdmin = currentUser.role === 'SYSTEM_ADMIN';

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'SCHOOL_ADMIN',
      label: 'School Admin',
      icon: <UserCheck className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />,
      desc: 'Manage school faculty, courses, hardcopy digitizer & exam timetables.',
    },
    {
      role: 'SYSTEM_ADMIN',
      label: 'System Admin',
      icon: <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-400" />,
      desc: 'Cross-institutional registry, global passcodes, audit logs & governance.',
    },
  ];

  const handleLevelChange = async (lvl: number) => {
    setSelectedLevel(lvl);
    setIsSavingLevel(true);
    await updateUserProfile({ level: lvl as any });
    setIsSavingLevel(false);
    setLevelSuccessMsg(`Level updated to L${lvl}!`);
    setTimeout(() => setLevelSuccessMsg(null), 3000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (under 3MB)
    if (file.size > 3 * 1024 * 1024) {
      setPhotoFeedback('Passport photo must be under 3MB');
      setTimeout(() => setPhotoFeedback(null), 3500);
      return;
    }

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      await updateUserProfile({ avatarUrl: dataUrl });
      setIsUploadingPhoto(false);
      setPhotoFeedback('Passport photo uploaded successfully!');
      setTimeout(() => setPhotoFeedback(null), 3500);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    await updateUserProfile({ avatarUrl: '' });
    setPhotoFeedback('Photo removed.');
    setTimeout(() => setPhotoFeedback(null), 3000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (!currentPass) {
      setPassError('Current password is required.');
      return;
    }
    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }

    setIsSavingPass(true);
    const result = await changePassword(currentPass, newPass);
    setIsSavingPass(false);

    if (result.success) {
      setPassSuccess('Password updated successfully!');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setPassSuccess(null), 3500);
    } else {
      setPassError(result.message || 'Failed to update password');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur text-slate-800 dark:text-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              U
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Uni<span className="text-indigo-600 dark:text-indigo-400">Past</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Ghana Cloud
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                All Traditional & Technical Universities Portal
              </p>
            </div>
          </button>
        </div>

        {/* Center: Search */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, question topics, or formulas..."
              className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* University Tenant Display (Interactive only for System Admin) */}
          <div className="relative shrink-0">
            {isSysAdmin ? (
              <button
                onClick={() => setIsUniDropdownOpen(!isUniDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                title="Select University Scope"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="max-w-[70px] xs:max-w-[90px] sm:max-w-[130px] truncate">
                  {selectedUniversityId === 'all' ? 'All' : currentUniversity?.code || 'School'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center overflow-hidden shrink-0">
                  {currentUniversity?.logoUrl ? (
                    <img src={currentUniversity.logoUrl} alt={currentUniversity.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xs sm:text-sm">{currentUniversity?.logo || '🎓'}</span>
                  )}
                </div>
                <span className="max-w-[65px] sm:max-w-[100px] truncate">{currentUniversity?.code || 'Campus'}</span>
              </div>
            )}

            {isUniDropdownOpen && isSysAdmin && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select University Tenant
                </div>
                <button
                  onClick={() => {
                    setSelectedUniversityId('all');
                    setIsUniDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition ${
                    selectedUniversityId === 'all'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌐</span>
                    <span>All Universities (Global Scope)</span>
                  </div>
                </button>
                {universities.map((uni) => (
                  <button
                    key={uni.id}
                    onClick={() => {
                      setSelectedUniversityId(uni.id);
                      setIsUniDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition ${
                      selectedUniversityId === uni.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 flex items-center justify-center overflow-hidden shrink-0">
                        {uni.logoUrl ? (
                          <img src={uni.logoUrl} alt={uni.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-base">{uni.logo || '🎓'}</span>
                        )}
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{uni.name}</p>
                        <p className="text-[10px] text-slate-500">{uni.location}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {uni.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Indicator Badge */}
          {isStudent ? (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Student (L{currentUser.level || 200})</span>
            </div>
          ) : isSysAdmin ? (
            <div className="relative shrink-0">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-950/50 transition shrink-0"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="hidden sm:inline">System Admin</span>
                <ChevronDown className="w-3 h-3 text-amber-500 dark:text-amber-400 shrink-0" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">System Admin Scope</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Switch admin perspective</p>
                  </div>
                  <div className="space-y-1 mt-1">
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition ${
                          currentUser.role === r.role
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500 dark:ring-indigo-700'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5">{r.icon}</div>
                        <div>
                          <p className="text-xs font-semibold">{r.label}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{r.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shrink-0">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>{currentUniversity?.code} Admin</span>
            </div>
          )}

          {/* AI Study Assistant */}
          <button
            onClick={() => openAiWithContext({ topic: 'General Revision' })}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition active:scale-95 shrink-0"
            title="Open Gemini AI Study Tutor"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
            <span className="hidden md:inline">AI Tutor</span>
          </button>

          {/* Saved Bookmarks for Student */}
          {isStudent && (
            <button
              onClick={() => setActiveView('bookmarks')}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
              title="Saved Papers & Bookmarks"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarks.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {bookmarks.length}
                </span>
              )}
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
            aria-label="Toggle light/dark theme"
            title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* User Profile Avatar & Anchored Pop-Up Trigger - Guaranteed Always Visible */}
          <div className="relative shrink-0 ml-1">
            <button
              onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
              className="flex items-center gap-2 p-0.5 rounded-full ring-2 ring-indigo-500/40 hover:ring-indigo-600 text-left focus:outline-none transition group shrink-0"
              title={`View & Edit Profile (${currentUser.name})`}
              aria-label="User Profile Menu"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUser.name.charAt(0)
                )}
              </div>
            </button>

            {/* Anchored Pop-Up Window Directly Below Profile Icon (Mobile Responsive) */}
            {isProfileModalOpen && (
              <>
                {/* Backdrop to dismiss when clicking outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileModalOpen(false)}
                />

                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4 sm:p-5 text-slate-800 dark:text-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Top Header & Tabs */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                      <button
                        onClick={() => setProfileTab('details')}
                        className={`px-3 py-1 rounded-lg font-bold transition ${
                          profileTab === 'details'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => setProfileTab('security')}
                        className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                          profileTab === 'security'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        <span>Security</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setIsProfileModalOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {photoFeedback && (
                    <div className="mt-3 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{photoFeedback}</span>
                    </div>
                  )}

                  {/* TAB 1: Profile Details & Level & Passport Upload */}
                  {profileTab === 'details' && (
                    <div className="mt-4 space-y-4">
                      {/* Avatar / Passport Picture Upload Header */}
                      <div className="flex items-center gap-3.5">
                        <div className="relative group/avatar shrink-0">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-indigo-600 text-white text-2xl font-bold flex items-center justify-center shadow-lg shadow-indigo-600/30 border-2 border-indigo-400/40">
                            {currentUser.avatarUrl ? (
                              <img
                                src={currentUser.avatarUrl}
                                alt={currentUser.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              currentUser.name.charAt(0)
                            )}
                          </div>

                          {/* Upload / Camera overlay button */}
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingPhoto}
                            className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition border-2 border-white dark:border-slate-900"
                            title="Upload Passport Picture"
                          >
                            <Camera className="w-3.5 h-3.5" />
                          </button>

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            className="hidden"
                            onChange={handlePhotoUpload}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{currentUser.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isStudent
                                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : isSchoolAdmin
                                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                  : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              }`}
                            >
                              {currentUser.role}
                            </span>
                            {currentUser.studentId && (
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                ID: {currentUser.studentId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Photo Upload Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingPhoto}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                        >
                          <Upload className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>{isUploadingPhoto ? 'Uploading...' : 'Upload Passport Photo'}</span>
                        </button>

                        {currentUser.avatarUrl && (
                          <button
                            onClick={handleRemovePhoto}
                            className="py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 text-xs font-semibold transition"
                            title="Remove Photo"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Student Academic Level Selector (Students can change level) */}
                      {isStudent && (
                        <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>Academic Level</span>
                            </label>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              Level {currentUser.level || selectedLevel}
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-1.5">
                            {[100, 200, 300, 400].map((lvl) => (
                              <button
                                key={lvl}
                                onClick={() => handleLevelChange(lvl)}
                                disabled={isSavingLevel}
                                className={`py-1.5 rounded-xl text-xs font-bold transition border ${
                                  (currentUser.level || selectedLevel) === lvl
                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                L{lvl}
                              </button>
                            ))}
                          </div>

                          {levelSuccessMsg && (
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{levelSuccessMsg}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Institutional Details */}
                      <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-xs border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400">Institution:</span>
                          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[170px]">
                            {currentUniversity?.name || 'All Institutions'}
                          </span>
                        </div>
                        {currentUser.department && (
                          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                            <span className="text-slate-500 dark:text-slate-400">Department:</span>
                            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[170px]">
                              {currentUser.department}
                            </span>
                          </div>
                        )}
                        {currentUser.programme && (
                          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                            <span className="text-slate-500 dark:text-slate-400">Programme:</span>
                            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[170px]">
                              {currentUser.programme}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500 dark:text-slate-400">Status:</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Active Account
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Change Password (For all users) */}
                  {profileTab === 'security' && (
                    <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 pb-1 text-xs font-bold text-slate-900 dark:text-white">
                        <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Change Account Password</span>
                      </div>

                      {passError && (
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{passError}</span>
                        </div>
                      )}

                      {passSuccess && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{passSuccess}</span>
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPass ? 'text' : 'password'}
                            value={currentPass}
                            onChange={(e) => setCurrentPass(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          >
                            {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          New Password (min. 6 characters)
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPass ? 'text' : 'password'}
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          >
                            {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingPass || !newPass}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition mt-2"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>{isSavingPass ? 'Updating...' : 'Update Password'}</span>
                      </button>
                    </form>
                  )}

                  {/* Bottom Logout Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(false);
                        logout();
                      }}
                      className="flex-1 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-800 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>

                    <button
                      onClick={() => setIsProfileModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
