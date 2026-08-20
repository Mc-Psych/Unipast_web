import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  University,
  Course,
  PastPaper,
  StudyMaterial,
  ExamSchedule,
  User,
  AuditLog,
  BookmarkItem,
  UserRole,
  AdminPasscode,
  GlobalAnalyticsMetrics,
  ThemeTemplate,
} from '../types';
import {
  INITIAL_UNIVERSITIES,
  INITIAL_COURSES,
  INITIAL_PAPERS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_TIMETABLES,
  INITIAL_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PASSCODES,
  INITIAL_THEME_TEMPLATES,
} from '../data/mockData';

export type AuthScreenMode = 'welcome' | 'login' | 'signup' | 'forgot_password';

interface AppContextType {
  // Authentication & RBAC
  currentUser: User;
  isAuthenticated: boolean;
  authMode: AuthScreenMode;
  setAuthMode: (mode: AuthScreenMode) => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  signup: (formData: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    universityId?: string;
    facultyId?: string;
    department?: string;
    programme?: string;
    level?: 100 | 200 | 300 | 400;
    studentId?: string;
    passcode?: string;
    securityQuestion?: string;
    securityAnswer?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  recoverPassword: (email: string, securityAnswer: string, newPassword?: string) => Promise<{ success: boolean; message?: string }>;
  getUserSecurityQuestion: (email: string) => string | null;
  switchRole: (role: UserRole) => void;

  // Passcodes for School & System Admins
  passcodes: AdminPasscode[];
  generatePasscode: (universityId: string, targetRole: 'SCHOOL_ADMIN' | 'SYSTEM_ADMIN') => Promise<AdminPasscode>;
  revokePasscode: (id: string) => Promise<void>;

  // Multi-Tenancy & Institutions
  universities: University[];
  selectedUniversityId: string; // 'all' or specific university id
  setSelectedUniversityId: (id: string) => void;
  currentUniversity?: University;
  addUniversity: (uni: Omit<University, 'id' | 'activeStudents' | 'totalPapers'>) => Promise<void>;
  updateUniversity: (id: string, updates: Partial<University>) => Promise<void>;
  deleteUniversity: (id: string) => Promise<void>;
  toggleUniversityStatus: (id: string) => void;

  // Institutional Hierarchy CRUD
  addFaculty: (universityId: string, faculty: { name: string; code: string }) => void;
  updateFaculty: (universityId: string, facultyId: string, updates: { name: string; code: string }) => void;
  deleteFaculty: (universityId: string, facultyId: string) => void;
  toggleFacultyStatus: (universityId: string, facultyId: string) => void;

  addDepartment: (universityId: string, facultyId: string, dept: { name: string; code: string }) => void;
  updateDepartment: (universityId: string, facultyId: string, deptId: string, updates: { name: string; code: string }) => void;
  deleteDepartment: (universityId: string, facultyId: string, deptId: string) => void;
  toggleDepartmentStatus: (universityId: string, facultyId: string, deptId: string) => void;

  addProgramme: (universityId: string, facultyId: string, deptId: string, prog: { name: string; code: string; durationYears?: number }) => void;
  updateProgramme: (universityId: string, facultyId: string, deptId: string, progId: string, updates: { name: string; code: string; durationYears?: number }) => void;
  deleteProgramme: (universityId: string, facultyId: string, deptId: string, progId: string) => void;
  toggleProgrammeStatus: (universityId: string, facultyId: string, deptId: string, progId: string) => void;

  // Courses
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (courseId: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  toggleCourseStatus: (courseId: string) => void;

  // Papers & Solutions
  papers: PastPaper[];
  activePaper: PastPaper | null;
  setActivePaper: (paper: PastPaper | null) => void;
  addPaper: (paper: Omit<PastPaper, 'id' | 'publishDate' | 'downloadsCount' | 'viewsCount' | 'averageRating'>) => Promise<PastPaper>;
  updatePaper: (id: string, updates: Partial<PastPaper>) => Promise<void>;
  deletePaper: (id: string) => Promise<void>;
  togglePaperStatus: (id: string) => void;

  // Study Materials
  materials: StudyMaterial[];
  addMaterial: (mat: Omit<StudyMaterial, 'id' | 'uploadDate' | 'downloadsCount' | 'viewsCount' | 'rating' | 'verified'>) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
  recordDownload: (id: string) => Promise<void>;
  toggleMaterialStatus: (id: string) => void;

  // Timetables
  timetables: ExamSchedule[];
  addTimetable: (entry: Omit<ExamSchedule, 'id'>) => Promise<void>;
  updateTimetable: (id: string, updates: Partial<ExamSchedule>) => Promise<void>;
  deleteTimetable: (id: string) => Promise<void>;
  toggleReminder: (id: string) => void;
  toggleScheduleStatus: (id: string) => void;

  // Users & RBAC
  users: User[];
  addUser: (user: Omit<User, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateUserStatus: (id: string, status: 'ACTIVE' | 'SUSPENDED') => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;

  auditLogs: AuditLog[];

  // Real-Time Dynamic Analytics & Engagement Tracking
  analyticsMetrics: GlobalAnalyticsMetrics;
  recordPaperView: (paperId: string) => Promise<void>;
  recordPaperDownload: (paperId: string, withSolutions?: boolean) => Promise<void>;
  recordSolutionRead: (paperId?: string, questionId?: string) => Promise<void>;
  recordPracticeCompletion: (paperId?: string, score?: number, totalMarks?: number) => Promise<void>;

  // Bookmarks
  bookmarks: BookmarkItem[];
  toggleBookmark: (item: Omit<BookmarkItem, 'id' | 'userId' | 'savedAt'>) => void;
  isBookmarked: (targetType: string, targetId: string) => boolean;

  // System Theme Templates & Customizer
  themeTemplates: ThemeTemplate[];
  activeThemeTemplateId: string;
  activeThemeTemplate: ThemeTemplate;
  addThemeTemplate: (template: Omit<ThemeTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateThemeTemplate: (id: string, updates: Partial<ThemeTemplate>) => Promise<void>;
  deleteThemeTemplate: (id: string) => Promise<void>;
  toggleThemeTemplateStatus: (id: string) => Promise<void>;
  setActiveThemeTemplate: (id: string) => void;

  // Theme & Navigation
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // AI Assistant Modal
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  aiPromptContext?: { questionText?: string; courseCode?: string; topic?: string };
  openAiWithContext: (context: { questionText?: string; courseCode?: string; topic?: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state (default dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unipast_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('unipast_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // State initialization
  const [themeTemplates, setThemeTemplates] = useState<ThemeTemplate[]>(INITIAL_THEME_TEMPLATES);
  const [activeThemeTemplateId, setActiveThemeTemplateId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('unipast_active_theme_id') || 'theme-ghana-indigo';
    }
    return 'theme-ghana-indigo';
  });

  const [universities, setUniversities] = useState<University[]>(INITIAL_UNIVERSITIES);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [papers, setPapers] = useState<PastPaper[]>(INITIAL_PAPERS);
  const [materials, setMaterials] = useState<StudyMaterial[]>(INITIAL_STUDY_MATERIALS);
  const [timetables, setTimetables] = useState<ExamSchedule[]>(INITIAL_TIMETABLES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [passcodes, setPasscodes] = useState<AdminPasscode[]>(INITIAL_PASSCODES);
  const [analyticsMetrics, setAnalyticsMetrics] = useState<GlobalAnalyticsMetrics>({
    totalDownloads: 9850 + 5890,
    solutionMarkingReads: 42890,
    practiceExamCompletions: 3120,
    verifiedStudyGuides: INITIAL_STUDY_MATERIALS.filter((m) => m.verified).length,
    totalPaperViews: 38400,
    monthlyActiveLearners: INITIAL_USERS.filter((u) => u.status === 'ACTIVE').length,
    lastUpdated: new Date().toISOString(),
  });
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
    {
      id: 'bm-1',
      userId: 'usr-student-1',
      targetType: 'paper',
      targetId: 'paper-htu-cs201-2024',
      title: 'CS 201: Data Structures and Algorithms (2023/2024)',
      courseCode: 'CS 201',
      universityId: 'univ-htu',
      savedAt: '2026-08-16',
      note: 'Need to review AVL tree rotations and Master Theorem before exam.',
    },
  ]);

  const activeThemeTemplate: ThemeTemplate =
    themeTemplates.find((t) => t.id === activeThemeTemplateId && t.isEnabled) ||
    themeTemplates.find((t) => t.isDefault && t.isEnabled) ||
    themeTemplates.find((t) => t.isEnabled) ||
    themeTemplates[0] ||
    INITIAL_THEME_TEMPLATES[0];

  // Dynamic Theme & CSS Variable Injector
  useEffect(() => {
    if (!activeThemeTemplate) return;
    const root = document.documentElement;
    const isDark = theme === 'dark';

    // Primary Colors
    root.style.setProperty('--color-primary', activeThemeTemplate.colors.primary);
    root.style.setProperty('--color-primary-hover', activeThemeTemplate.colors.primaryHover);
    root.style.setProperty('--color-primary-light', activeThemeTemplate.colors.primaryLight);
    root.style.setProperty('--color-accent', activeThemeTemplate.colors.accent);

    // Dynamic Backgrounds & Surfaces
    root.style.setProperty('--bg-main', isDark ? activeThemeTemplate.colors.bgDark : activeThemeTemplate.colors.bgLight);
    root.style.setProperty('--bg-card', isDark ? activeThemeTemplate.colors.cardDark : activeThemeTemplate.colors.cardLight);
    root.style.setProperty('--bg-surface', isDark ? activeThemeTemplate.colors.surfaceDark : activeThemeTemplate.colors.surfaceLight);
    root.style.setProperty('--text-primary', isDark ? activeThemeTemplate.colors.textPrimaryDark : activeThemeTemplate.colors.textPrimaryLight);
    root.style.setProperty('--text-secondary', isDark ? activeThemeTemplate.colors.textSecondaryDark : activeThemeTemplate.colors.textSecondaryLight);
    root.style.setProperty('--border-subtle', isDark ? activeThemeTemplate.colors.borderDark : activeThemeTemplate.colors.borderLight);

    // Border Radius Map
    const radiusMap: Record<string, string> = {
      sharp: '0px',
      subtle: '8px',
      rounded: '16px',
      pill: '24px',
    };
    root.style.setProperty('--radius-base', radiusMap[activeThemeTemplate.layout.borderRadius] || '16px');

    // Font attributes
    root.setAttribute('data-theme-font', activeThemeTemplate.typography.fontFamily);
    root.setAttribute('data-theme-layout', activeThemeTemplate.layout.density);
    root.setAttribute('data-theme-radius', activeThemeTemplate.layout.borderRadius);

    localStorage.setItem('unipast_active_theme_id', activeThemeTemplate.id);
  }, [theme, activeThemeTemplateId, activeThemeTemplate]);


  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('unipast_auth_active');
      return savedAuth === 'true';
    }
    return false;
  });

  const [authMode, setAuthMode] = useState<AuthScreenMode>('welcome');

  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('unipast_auth_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_USERS[0];
  });

  const [selectedUniversityId, setSelectedUniversityId] = useState<string>(() => {
    return currentUser.universityId || 'univ-htu';
  });

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activePaper, setActivePaper] = useState<PastPaper | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // AI Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPromptContext, setAiPromptContext] = useState<{ questionText?: string; courseCode?: string; topic?: string } | undefined>(undefined);

  const openAiWithContext = (context: { questionText?: string; courseCode?: string; topic?: string }) => {
    setAiPromptContext(context);
    setIsAiModalOpen(true);
  };

  // Sync state with local storage
  useEffect(() => {
    localStorage.setItem('unipast_auth_active', isAuthenticated ? 'true' : 'false');
    localStorage.setItem('unipast_auth_user', JSON.stringify(currentUser));
  }, [isAuthenticated, currentUser]);

  // Background Real-Time Data Sync with Server (Broadcasts changes to all connected users)
  const syncDataWithServer = async () => {
    try {
      const [uniRes, courseRes, paperRes, matRes, ttRes, userRes, logRes, passRes, analyticsRes, themeRes] = await Promise.allSettled([
        fetch('/api/universities').then((r) => r.json()),
        fetch('/api/courses').then((r) => r.json()),
        fetch('/api/papers').then((r) => r.json()),
        fetch('/api/materials').then((r) => r.json()),
        fetch('/api/timetables').then((r) => r.json()),
        fetch('/api/users').then((r) => r.json()),
        fetch('/api/audit-logs').then((r) => r.json()),
        fetch('/api/passcodes').then((r) => r.json()),
        fetch('/api/analytics').then((r) => r.json()),
        fetch('/api/theme-templates').then((r) => r.json()),
      ]);

      if (uniRes.status === 'fulfilled' && Array.isArray(uniRes.value)) setUniversities(uniRes.value);
      if (courseRes.status === 'fulfilled' && Array.isArray(courseRes.value)) setCourses(courseRes.value);
      if (paperRes.status === 'fulfilled' && Array.isArray(paperRes.value)) setPapers(paperRes.value);
      if (matRes.status === 'fulfilled' && Array.isArray(matRes.value)) setMaterials(matRes.value);
      if (ttRes.status === 'fulfilled' && Array.isArray(ttRes.value)) setTimetables(ttRes.value);
      if (userRes.status === 'fulfilled' && Array.isArray(userRes.value)) setUsers(userRes.value);
      if (logRes.status === 'fulfilled' && Array.isArray(logRes.value)) setAuditLogs(logRes.value);
      if (passRes.status === 'fulfilled' && Array.isArray(passRes.value)) setPasscodes(passRes.value);
      if (themeRes.status === 'fulfilled' && Array.isArray(themeRes.value)) setThemeTemplates(themeRes.value);
      if (analyticsRes.status === 'fulfilled' && analyticsRes.value && typeof analyticsRes.value === 'object') {
        setAnalyticsMetrics((prev) => ({
          ...prev,
          totalDownloads: analyticsRes.value.totalDownloads ?? prev.totalDownloads,
          solutionMarkingReads: analyticsRes.value.solutionMarkingReads ?? prev.solutionMarkingReads,
          practiceExamCompletions: analyticsRes.value.practiceExamCompletions ?? prev.practiceExamCompletions,
          verifiedStudyGuides: analyticsRes.value.verifiedStudyGuides ?? prev.verifiedStudyGuides,
          totalPaperViews: analyticsRes.value.totalViews ?? prev.totalPaperViews,
          monthlyActiveLearners: analyticsRes.value.monthlyActiveLearners ?? prev.monthlyActiveLearners,
          lastUpdated: new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.warn('Server sync error, local store in use:', err);
    }
  };

  // Real-time automatic sync: SSE Push Notifications + Cross-tab BroadcastChannel + Polling
  useEffect(() => {
    syncDataWithServer();

    // 1. Cross-tab instant communication via BroadcastChannel
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        broadcastChannel = new BroadcastChannel('unipast_realtime_sync');
        broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'SYNC_REQUIRED') {
            syncDataWithServer();
          }
        };
      }
    } catch {
      // ignore
    }

    // 2. Server-Sent Events (SSE) for instant cross-device and cross-account updates
    let eventSource: EventSource | null = null;
    try {
      if (typeof window !== 'undefined' && 'EventSource' in window) {
        eventSource = new EventSource('/api/sync/events');
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data?.entity) {
              syncDataWithServer();
            }
          } catch {
            // ignore
          }
        };
      }
    } catch {
      // ignore
    }

    // 3. Resilient polling fallback every 3.5s
    const interval = setInterval(() => {
      syncDataWithServer();
    }, 3500);

    const handleFocus = () => {
      syncDataWithServer();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        syncDataWithServer();
      }
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      if (broadcastChannel) broadcastChannel.close();
      if (eventSource) eventSource.close();
    };
  }, []);

  const notifyLocalSync = () => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('unipast_realtime_sync');
        bc.postMessage({ type: 'SYNC_REQUIRED', timestamp: Date.now() });
        bc.close();
      }
    } catch {
      // ignore
    }
  };

  // Strict role switcher (used internally or testing)
  const switchRole = (role: UserRole) => {
    if (role === 'STUDENT') {
      const studentUser = users.find((u) => u.role === 'STUDENT' && u.universityId === 'univ-htu') || INITIAL_USERS[0];
      setCurrentUser(studentUser);
      setSelectedUniversityId(studentUser.universityId || 'univ-htu');
      if (activeView === 'digitizer' || activeView === 'users' || activeView === 'system-config' || activeView === 'passcodes') {
        setActiveView('dashboard');
      }
    } else if (role === 'SCHOOL_ADMIN') {
      const schoolAdminUser = users.find((u) => u.role === 'SCHOOL_ADMIN' && u.universityId === 'univ-htu') || INITIAL_USERS[2];
      setCurrentUser(schoolAdminUser);
      setSelectedUniversityId(schoolAdminUser.universityId || 'univ-htu');
    } else {
      const sysAdminUser = users.find((u) => u.role === 'SYSTEM_ADMIN') || INITIAL_USERS[4];
      setCurrentUser(sysAdminUser);
      setSelectedUniversityId('all');
    }
  };

  // Helper to resolve email/alias to account
  const resolveUserByCredential = (credential: string): User | undefined => {
    const clean = credential.trim().toLowerCase();
    
    // Check direct email match
    let found = users.find((u) => u.email.toLowerCase() === clean);
    if (found) return found;

    // Check studentId match
    found = users.find((u) => u.studentId && u.studentId.toLowerCase() === clean);
    if (found) return found;

    // Demo aliases fallback matching
    if (clean === 'student.cs@htu.edu.gh' || clean === 'student@htu.edu.gh' || clean === 'student' || clean === 'kofi.mensah@gmail.com') {
      return users.find((u) => u.id === 'usr-student-1') || users.find((u) => u.role === 'STUDENT');
    }
    if (clean === 'admin.ict@htu.edu.gh' || clean === 'admin@htu.edu.gh' || clean === 'admin.htu@gmail.com' || clean === 'schooladmin') {
      return users.find((u) => u.id === 'usr-school-admin-htu') || users.find((u) => u.role === 'SCHOOL_ADMIN');
    }
    if (
      clean === 'director@gtec.edu.gh' ||
      clean === 'sysadmin@unipast.gh' ||
      clean === 'kekesicourage@gmail.com' ||
      clean === 'courage' ||
      clean === 'sysadmin' ||
      clean === 'admin'
    ) {
      return users.find((u) => u.email.toLowerCase() === 'kekesicourage@gmail.com') ||
             users.find((u) => u.id === 'usr-sysadmin-1') ||
             users.find((u) => u.role === 'SYSTEM_ADMIN');
    }

    return undefined;
  };

  // Helper to retrieve security question for forgot password screen
  const getUserSecurityQuestion = (email: string): string | null => {
    const user = resolveUserByCredential(email);
    if (user && user.securityQuestion) {
      return user.securityQuestion;
    }
    return null;
  };

  // Auth: Login
  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    if (!email || !email.trim()) {
      return { success: false, message: 'Please enter your email or username.' };
    }

    const existing = resolveUserByCredential(email);

    if (!existing) {
      return {
        success: false,
        message: 'Account not found with this email. Please check your credentials or create a new account.',
      };
    }

    if (existing.status === 'SUSPENDED') {
      return { success: false, message: 'This account has been suspended by the University Academic Board.' };
    }

    // If password is provided, verify it (allow correct user password or standard demo fallbacks)
    if (password !== undefined && password !== '') {
      const userPass = existing.password || 'password123';
      const isMasterPass = password === 'GH-SYSADMIN-2024' || password === 'admin123';
      const isMatch = password === userPass || (existing.role === 'SYSTEM_ADMIN' && isMasterPass);

      if (!isMatch) {
        return {
          success: false,
          message: 'Invalid password. Please check your password or click "Forgot Password?" below.',
        };
      }
    }

    setCurrentUser(existing);
    setIsAuthenticated(true);
    if (existing.role === 'STUDENT' || existing.role === 'SCHOOL_ADMIN') {
      setSelectedUniversityId(existing.universityId || 'univ-htu');
    } else {
      setSelectedUniversityId('all');
    }
    setActiveView('dashboard');
    return { success: true };
  };

  // Auth: Sign Up
  const signup = async (formData: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    universityId?: string;
    facultyId?: string;
    department?: string;
    programme?: string;
    level?: 100 | 200 | 300 | 400;
    studentId?: string;
    passcode?: string;
    securityQuestion?: string;
    securityAnswer?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = formData.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please Sign In.' };
    }

    if (!formData.password || formData.password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    // Role specific validation
    if (formData.role === 'SCHOOL_ADMIN') {
      if (!formData.passcode) {
        return { success: false, message: 'Admin security passcode is required for School Admin accounts.' };
      }
      const trimmedCode = formData.passcode.trim().toUpperCase();
      const codeMatch = passcodes.find((p) => p.code.toUpperCase() === trimmedCode && p.status === 'ACTIVE');
      if (!codeMatch) {
        return { success: false, message: 'Invalid or expired School Admin security passcode.' };
      }
      if (formData.universityId && codeMatch.universityId !== 'global' && codeMatch.universityId !== formData.universityId) {
        return { success: false, message: `Passcode ${trimmedCode} is assigned to a different university.` };
      }
      // Mark passcode as used
      codeMatch.status = 'USED';
      codeMatch.usedByEmail = cleanEmail;
      codeMatch.usedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    }

    if (formData.role === 'SYSTEM_ADMIN') {
      if (!formData.passcode) {
        return { success: false, message: 'Master System Passcode is required for System Admin accounts.' };
      }
      const trimmedCode = formData.passcode.trim().toUpperCase();
      if (trimmedCode !== 'GH-SYSADMIN-2024') {
        const sysMatch = passcodes.find((p) => p.code.toUpperCase() === trimmedCode && p.targetRole === 'SYSTEM_ADMIN' && p.status === 'ACTIVE');
        if (!sysMatch) {
          return { success: false, message: 'Invalid Master System Admin passcode.' };
        }
        sysMatch.status = 'USED';
      }
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: formData.name.trim(),
      email: cleanEmail,
      password: formData.password,
      role: formData.role,
      universityId: formData.universityId || (formData.role === 'SYSTEM_ADMIN' ? undefined : 'univ-htu'),
      facultyId: formData.facultyId,
      department: formData.department,
      programme: formData.programme,
      level: formData.level,
      studentId: formData.studentId?.trim() || undefined,
      securityQuestion: formData.securityQuestion,
      securityAnswer: formData.securityAnswer?.trim(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    if (newUser.role === 'SYSTEM_ADMIN') {
      setSelectedUniversityId('all');
    } else {
      setSelectedUniversityId(newUser.universityId || 'univ-htu');
    }
    setActiveView('dashboard');

    // Async server persistence
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    }).catch((e) => console.warn('Failed to sync new user to server:', e));

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      action: 'USER_REGISTERED',
      userId: newUser.id,
      userName: newUser.name,
      universityId: newUser.universityId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      details: `New ${newUser.role} registered: ${newUser.name} (${newUser.email}) for ${newUser.universityId || 'Global System'}`,
    });

    return { success: true };
  };

  // Auth: Logout
  const logout = () => {
    setIsAuthenticated(false);
    setAuthMode('welcome');
    setActivePaper(null);
  };

  // Auth: Password recovery via Security Question
  const recoverPassword = async (email: string, securityAnswer: string, newPassword?: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const user = resolveUserByCredential(cleanEmail);
    if (!user) {
      return { success: false, message: 'No registered user found with this email address.' };
    }
    if (!user.securityAnswer) {
      return { success: false, message: 'No security question was configured for this user. Please contact University Administrator.' };
    }
    if (user.securityAnswer.toLowerCase().trim() !== securityAnswer.toLowerCase().trim()) {
      return { success: false, message: 'Security answer does not match our records. Please try again.' };
    }

    // If new password provided, update user password
    if (newPassword && newPassword.trim().length >= 4) {
      user.password = newPassword.trim();
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, password: newPassword.trim() } : u)));
    }

    // Success - log in user
    setCurrentUser(user);
    setIsAuthenticated(true);
    if (user.role === 'SYSTEM_ADMIN') {
      setSelectedUniversityId('all');
    } else {
      setSelectedUniversityId(user.universityId || 'univ-htu');
    }
    setActiveView('dashboard');
    return { success: true, message: 'Identity verified successfully! Password updated and access granted.' };
  };

  // Passcode Generator
  const generatePasscode = async (universityId: string, targetRole: 'SCHOOL_ADMIN' | 'SYSTEM_ADMIN'): Promise<AdminPasscode> => {
    let uniCode = 'GH';
    let uniName = 'Ghana Higher Education System Admin';

    if (universityId && universityId !== 'global' && universityId !== 'all') {
      const uni = universities.find((u) => u.id === universityId);
      if (uni) {
        uniCode = uni.code;
        uniName = uni.name;
      }
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000).toString();
    const code = `${uniCode}-ADM-${randomNum}`;

    const newPasscode: AdminPasscode = {
      id: `passcode-${Date.now()}`,
      code,
      universityId: universityId || 'global',
      universityCode: uniCode,
      universityName: uniName,
      targetRole,
      status: 'ACTIVE',
      generatedByUserId: currentUser.id,
      generatedByName: currentUser.name,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    setPasscodes((prev) => [newPasscode, ...prev]);

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      action: 'PASSCODE_GENERATED',
      userId: currentUser.id,
      userName: currentUser.name,
      universityId: universityId !== 'global' ? universityId : undefined,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      details: `Generated security passcode ${code} for ${uniName} (${targetRole})`,
    });

    try {
      fetch('/api/passcodes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId,
          targetRole,
          generatedByUserId: currentUser.id,
          generatedByName: currentUser.name,
        }),
      });
    } catch {
      // local fallback
    }

    return newPasscode;
  };

  const revokePasscode = async (id: string) => {
    setPasscodes((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'REVOKED' } : p)));
    try {
      fetch(`/api/passcodes/${id}`, { method: 'DELETE' });
    } catch {
      // client update
    }
  };

  // University CRUD & Toggles
  const currentUniversity = universities.find((u) => u.id === selectedUniversityId);

  const addUniversity = async (uniData: Omit<University, 'id' | 'activeStudents' | 'totalPapers'>) => {
    const newUni: University = {
      ...uniData,
      id: `univ-${Date.now()}`,
      activeStudents: 1200,
      totalPapers: 0,
      isDisabled: false,
    };
    setUniversities((prev) => [...prev, newUni]);
    notifyLocalSync();
    try {
      await fetch('/api/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUni),
      });
      syncDataWithServer();
    } catch {
      // client fallback
    }
  };

  const updateUniversity = async (id: string, updates: Partial<University>) => {
    setUniversities((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    notifyLocalSync();
    try {
      await fetch(`/api/universities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      syncDataWithServer();
    } catch {
      // client fallback
    }
  };

  const deleteUniversity = async (id: string) => {
    setUniversities((prev) => prev.filter((u) => u.id !== id));
    notifyLocalSync();
    try {
      await fetch(`/api/universities/${id}`, { method: 'DELETE' });
      syncDataWithServer();
    } catch {
      // client fallback
    }
  };

  const toggleUniversityStatus = (id: string) => {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const next = { ...u, isDisabled: !u.isDisabled };
          fetch(`/api/universities/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDisabled: next.isDisabled }),
          })
            .then(() => syncDataWithServer())
            .catch(() => {});
          return next;
        }
        return u;
      })
    );
    notifyLocalSync();
  };

  // Helper to persist updated university faculties/departments/programmes to the server
  const persistUniversityFaculties = (universityId: string, updatedFaculties: any[]) => {
    fetch(`/api/universities/${universityId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faculties: updatedFaculties }),
    })
      .then(() => syncDataWithServer())
      .catch(() => {});
  };

  // Faculty CRUD & Status Toggles
  const addFaculty = (universityId: string, faculty: { name: string; code: string }) => {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.id !== universityId) return u;
        const newFac = {
          id: `fac-${Date.now()}`,
          universityId,
          name: faculty.name,
          code: faculty.code.toUpperCase(),
          departments: [],
          isDisabled: false,
        };
        const updatedFaculties = [...u.faculties, newFac];
        persistUniversityFaculties(universityId, updatedFaculties);
        return { ...u, faculties: updatedFaculties };
      })
    );
  };

  const updateFaculty = (universityId: string, facultyId: string, updates: { name: string; code: string }) => {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.id !== universityId) return u;
        const updatedFaculties = u.faculties.map((f) =>
          f.id === facultyId ? { ...f, name: updates.name, code: updates.code.toUpperCase() } : f
        );
        persistUniversityFaculties(universityId, updatedFaculties);
        return {
          ...u,
          faculties: updatedFaculties,
        };
      })
    );
  };

  const deleteFaculty = (universityId: string, facultyId: string) => {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.id !== universityId) return u;
        const updatedFaculties = u.faculties.filter((f) => f.id !== facultyId);
        persistUniversityFaculties(universityId, updatedFaculties);
        return {
          ...u,
          faculties: updatedFaculties,
        };
      })
    );
  };

  const toggleFacultyStatus = (universityId: string, facultyId: string) => {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.id !== universityId) return u;
        const updatedFaculties = u.faculties.map((f) => (f.id === facultyId ? { ...f, isDisabled: !f.isDisabled } : f));
        persistUniversityFaculties(universityId, updatedFaculties);
        return {
          ...u,
          faculties: updatedFaculties,
        };
      })
    );
  };

  // Department CRUD & Status Toggles
  const addDepartment = (universityId: string, facultyId: string, dept: { name: string; code: string }) => {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.id !== universityId) return u;
        const updatedFaculties = u.faculties.map((f) => {
          if (f.id !== facultyId) return f;
          const newDept = {
            id: `dept-${Date.now()}`,
            facultyId,
            name: dept.name,
            code: dept.code.toUpperCase(),
            programmes: [],
            isDisabled: false,
          };
          return { ...f, departments: [...f.departments, newDept] };
        });
        persistUniversityFaculties(universityId, updatedFaculties);
        return { ...u, faculties: updatedFaculties };
      })
    );
  };

  const updateDepartment = (universityId: string, facultyId: string, deptId: string, updates: { name: string; code: string }) => {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.id !== universityId) return u;
        const updatedFaculties = u.faculties.map((f) => {
          if (f.id !== facultyId) return f;
          return {
            ...f,
            departments: f.departments.map((d) =>
              d.id === deptId ? { ...d, name: updates.name, code: updates.code.toUpperCase() } : d
            ),
          };
        });
        persistUniversityFaculties(universityId, updatedFaculties);
        return {
          ...u,
          faculties: updatedFaculties,
        };
      })
    );
  };

  const deleteDepartment = (universityId: string, facultyId: string, deptId: string) => {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.id !== universityId) return u;
        const updatedFaculties = u.faculties.map((f) => {
          if (f.id !== facultyId) return f;
          return {
            ...f,
            departments: f.departments.filter((d) => d.id !== deptId),
          };
        });
        persistUniversityFaculties(universityId, updatedFaculties);
        return {
          ...u,
          faculties: updatedFaculties,
        };
      })
    );
  };

  const toggleDepartmentStatus = (universityId: string, facultyId: string, deptId: string) => {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.id !== universityId) return u;
        const updatedFaculties = u.faculties.map((f) => {
          if (f.id !== facultyId) return f;
          return {
            ...f,
            departments: f.departments.map((d) => (d.id === deptId ? { ...d, isDisabled: !d.isDisabled } : d)),
          };
        });
        persistUniversityFaculties(universityId, updatedFaculties);
        return {
          ...u,
          faculties: updatedFaculties,
        };
      })
    );
  };

  // Programme CRUD & Status Toggles
  const addProgramme = (universityId: string, facultyId: string, deptId: string, prog: { name: string; code: string; durationYears?: number }) => {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.id !== universityId) return u;
        const updatedFaculties = u.faculties.map((f) => {
          if (f.id !== facultyId) return f;
          return {
            ...f,
            departments: f.departments.map((d) => {
              if (d.id !== deptId) return d;
              const newProg = {
                id: `prog-${Date.now()}`,
                departmentId: deptId,
                name: prog.name,
                code: prog.code.toUpperCase(),
                durationYears: prog.durationYears || 4,
                isDisabled: false,
              };
              return { ...d, programmes: [...d.programmes, newProg] };
            }),
          };
        });
        persistUniversityFaculties(universityId, updatedFaculties);
        return { ...u, faculties: updatedFaculties };
      })
    );
  };

  const updateProgramme = (universityId: string, facultyId: string, deptId: string, progId: string, updates: { name: string; code: string; durationYears?: number }) => {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.id !== universityId) return u;
        const updatedFaculties = u.faculties.map((f) => {
          if (f.id !== facultyId) return f;
          return {
            ...f,
            departments: f.departments.map((d) => {
              if (d.id !== deptId) return d;
              return {
                ...d,
                programmes: d.programmes.map((p) =>
                  p.id === progId ? { ...p, ...updates, code: updates.code.toUpperCase() } : p
                ),
              };
            }),
          };
        });
        persistUniversityFaculties(universityId, updatedFaculties);
        return {
          ...u,
          faculties: updatedFaculties,
        };
      })
    );
  };

  const deleteProgramme = (universityId: string, facultyId: string, deptId: string, progId: string) => {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.id !== universityId) return u;
        const updatedFaculties = u.faculties.map((f) => {
          if (f.id !== facultyId) return f;
          return {
            ...f,
            departments: f.departments.map((d) => {
              if (d.id !== deptId) return d;
              return {
                ...d,
                programmes: d.programmes.filter((p) => p.id !== progId),
              };
            }),
          };
        });
        persistUniversityFaculties(universityId, updatedFaculties);
        return {
          ...u,
          faculties: updatedFaculties,
        };
      })
    );
  };

  const toggleProgrammeStatus = (universityId: string, facultyId: string, deptId: string, progId: string) => {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.id !== universityId) return u;
        const updatedFaculties = u.faculties.map((f) => {
          if (f.id !== facultyId) return f;
          return {
            ...f,
            departments: f.departments.map((d) => {
              if (d.id !== deptId) return d;
              return {
                ...d,
                programmes: d.programmes.map((p) => (p.id === progId ? { ...p, isDisabled: !p.isDisabled } : p)),
              };
            }),
          };
        });
        persistUniversityFaculties(universityId, updatedFaculties);
        return {
          ...u,
          faculties: updatedFaculties,
        };
      })
    );
  };

  // Course Actions
  const addCourse = async (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = { ...courseData, id: `course-${Date.now()}`, paperCount: 0, materialCount: 0, isDisabled: false };
    setCourses((prev) => [...prev, newCourse]);
    try {
      await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });
      syncDataWithServer();
    } catch {
      // client fallback
    }
  };

  const updateCourse = async (courseId: string, updates: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, ...updates } : c)));
    try {
      await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      syncDataWithServer();
    } catch {
      // client update
    }
  };

  const deleteCourse = async (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    try {
      await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
      syncDataWithServer();
    } catch {
      // client update
    }
  };

  const toggleCourseStatus = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const next = { ...c, isDisabled: !c.isDisabled };
          fetch(`/api/courses/${courseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDisabled: next.isDisabled }),
          })
            .then(() => syncDataWithServer())
            .catch(() => {});
          return next;
        }
        return c;
      })
    );
  };

  // Paper Actions
  const addPaper = async (paperData: Omit<PastPaper, 'id' | 'publishDate' | 'downloadsCount' | 'viewsCount' | 'averageRating'>): Promise<PastPaper> => {
    const uni = universities.find((u) => u.id === paperData.universityId);
    const newPaper: PastPaper = {
      ...paperData,
      id: `paper-${Date.now()}`,
      universityName: uni?.name || paperData.universityName || 'Ghana Higher Education',
      publishDate: new Date().toISOString().split('T')[0],
      downloadsCount: 0,
      viewsCount: 1,
      averageRating: 5.0,
      publishedBy: currentUser.name,
      isDisabled: false,
    };
    setPapers((prev) => [newPaper, ...prev]);
    try {
      await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPaper),
      });
      syncDataWithServer();
    } catch {
      // client fallback
    }
    return newPaper;
  };

  const updatePaper = async (id: string, updates: Partial<PastPaper>) => {
    setPapers((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    try {
      await fetch(`/api/papers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      syncDataWithServer();
    } catch {
      // client update
    }
  };

  const deletePaper = async (id: string) => {
    setPapers((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/papers/${id}`, { method: 'DELETE' });
      syncDataWithServer();
    } catch {
      // client update
    }
  };

  const togglePaperStatus = (id: string) => {
    setPapers((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = { ...p, isDisabled: !p.isDisabled };
          fetch(`/api/papers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDisabled: next.isDisabled }),
          })
            .then(() => syncDataWithServer())
            .catch(() => {});
          return next;
        }
        return p;
      })
    );
  };

  // Material Actions
  const addMaterial = async (matData: Omit<StudyMaterial, 'id' | 'uploadDate' | 'downloadsCount' | 'viewsCount' | 'rating' | 'verified'>) => {
    const newMat: StudyMaterial = {
      ...matData,
      id: `mat-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      downloadsCount: 0,
      viewsCount: 1,
      rating: 5.0,
      verified: true,
      uploaderName: currentUser.name,
      uploaderRole: currentUser.role,
      isDisabled: false,
    };
    setMaterials((prev) => [newMat, ...prev]);
    try {
      await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMat),
      });
      syncDataWithServer();
    } catch {
      // client fallback
    }
  };

  const deleteMaterial = async (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    try {
      await fetch(`/api/materials/${id}`, { method: 'DELETE' });
      syncDataWithServer();
    } catch {
      // client update
    }
  };

  const recordDownload = async (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, downloadsCount: (m.downloadsCount || 0) + 1 } : m))
    );
    setAnalyticsMetrics((prev) => ({
      ...prev,
      totalDownloads: prev.totalDownloads + 1,
      lastUpdated: new Date().toISOString(),
    }));
    try {
      fetch(`/api/materials/${id}/download`, { method: 'POST' });
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'MATERIAL_DOWNLOAD', materialId: id }),
      });
    } catch {
      // ignore
    }
  };

  const recordPaperView = async (paperId: string) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === paperId ? { ...p, viewsCount: (p.viewsCount || 0) + 1 } : p))
    );
    setAnalyticsMetrics((prev) => ({
      ...prev,
      totalViews: prev.totalViews + 1,
      lastUpdated: new Date().toISOString(),
    }));
    try {
      await fetch(`/api/papers/${paperId}/view`, { method: 'POST' });
    } catch {
      // ignore
    }
  };

  const recordPaperDownload = async (paperId: string, withSolutions: boolean = false) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === paperId ? { ...p, downloadsCount: (p.downloadsCount || 0) + 1 } : p))
    );
    setAnalyticsMetrics((prev) => ({
      ...prev,
      totalDownloads: prev.totalDownloads + 1,
      solutionMarkingReads: withSolutions ? prev.solutionMarkingReads + 1 : prev.solutionMarkingReads,
      lastUpdated: new Date().toISOString(),
    }));
    try {
      fetch(`/api/papers/${paperId}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withSolutions }),
      });
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'PAPER_DOWNLOAD', paperId, withSolutions }),
      });
    } catch {
      // ignore
    }
  };

  const recordSolutionRead = async (paperId?: string, questionId?: string) => {
    setAnalyticsMetrics((prev) => ({
      ...prev,
      solutionMarkingReads: prev.solutionMarkingReads + 1,
      lastUpdated: new Date().toISOString(),
    }));
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'SOLUTION_READ', paperId, questionId }),
      });
    } catch {
      // ignore
    }
  };

  const recordPracticeCompletion = async (paperId?: string, score?: number, totalMarks?: number) => {
    setAnalyticsMetrics((prev) => ({
      ...prev,
      practiceExamCompletions: prev.practiceExamCompletions + 1,
      lastUpdated: new Date().toISOString(),
    }));
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'PRACTICE_COMPLETION', paperId, score, totalMarks }),
      });
    } catch {
      // ignore
    }
  };

  const toggleMaterialStatus = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const next = { ...m, isDisabled: !m.isDisabled };
          fetch(`/api/materials/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDisabled: next.isDisabled }),
          })
            .then(() => syncDataWithServer())
            .catch(() => {});
          return next;
        }
        return m;
      })
    );
  };

  // Timetable Actions
  const addTimetable = async (entry: Omit<ExamSchedule, 'id'>) => {
    const newEntry: ExamSchedule = { ...entry, id: `tt-${Date.now()}`, isDisabled: false };
    setTimetables((prev) => [...prev, newEntry]);
    try {
      await fetch('/api/timetables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
      syncDataWithServer();
    } catch {
      // client fallback
    }
  };

  const updateTimetable = async (id: string, updates: Partial<ExamSchedule>) => {
    setTimetables((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    try {
      await fetch(`/api/timetables/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      syncDataWithServer();
    } catch {
      // client update
    }
  };

  const deleteTimetable = async (id: string) => {
    setTimetables((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/timetables/${id}`, { method: 'DELETE' });
      syncDataWithServer();
    } catch {
      // client update
    }
  };

  const toggleReminder = (id: string) => {
    setTimetables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, reminderSet: !t.reminderSet } : t))
    );
  };

  const toggleScheduleStatus = (id: string) => {
    setTimetables((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = { ...t, isDisabled: !t.isDisabled };
          fetch(`/api/timetables/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDisabled: next.isDisabled }),
          })
            .then(() => syncDataWithServer())
            .catch(() => {});
          return next;
        }
        return t;
      })
    );
  };

  // User Actions
  const addUser = async (userData: Omit<User, 'id' | 'status' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      syncDataWithServer();
    } catch {
      // client fallback
    }
  };

  const updateUserStatus = async (id: string, status: 'ACTIVE' | 'SUSPENDED') => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    try {
      await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      syncDataWithServer();
    } catch {
      // client fallback
    }
  };

  const deleteUser = async (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      syncDataWithServer();
    } catch {
      // client fallback
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem('unipast_auth_user', JSON.stringify(updatedUser));
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u)));

    try {
      await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      syncDataWithServer();
      return true;
    } catch {
      return true;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/users/${currentUser.id}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to update password' };
      }
      setCurrentUser((prev) => {
        const updated = { ...prev, password: newPassword };
        localStorage.setItem('unipast_auth_user', JSON.stringify(updated));
        return updated;
      });
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, password: newPassword } : u)));
      return { success: true, message: 'Password updated successfully!' };
    } catch {
      setCurrentUser((prev) => {
        const updated = { ...prev, password: newPassword };
        localStorage.setItem('unipast_auth_user', JSON.stringify(updated));
        return updated;
      });
      return { success: true, message: 'Password updated successfully!' };
    }
  };

  // Bookmarks
  const toggleBookmark = (item: Omit<BookmarkItem, 'id' | 'userId' | 'savedAt'>) => {
    const existing = bookmarks.find((b) => b.targetType === item.targetType && b.targetId === item.targetId);
    if (existing) {
      setBookmarks((prev) => prev.filter((b) => b.id !== existing.id));
    } else {
      const newBm: BookmarkItem = {
        ...item,
        id: `bm-${Date.now()}`,
        userId: currentUser.id,
        savedAt: new Date().toISOString().split('T')[0],
      };
      setBookmarks((prev) => [newBm, ...prev]);
    }
  };

  const isBookmarked = (targetType: string, targetId: string) => {
    return bookmarks.some((b) => b.targetType === targetType && b.targetId === targetId);
  };

  // Theme Templates Actions
  const addThemeTemplate = async (templateData: Omit<ThemeTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: ThemeTemplate = {
      ...templateData,
      id: `theme-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setThemeTemplates((prev) => [...prev, newTemplate]);
    try {
      await fetch('/api/theme-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate),
      });
      syncDataWithServer();
    } catch {
      // client fallback
    }
  };

  const updateThemeTemplate = async (id: string, updates: Partial<ThemeTemplate>) => {
    setThemeTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
    try {
      await fetch(`/api/theme-templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      syncDataWithServer();
    } catch {
      // client fallback
    }
  };

  const deleteThemeTemplate = async (id: string) => {
    setThemeTemplates((prev) => prev.filter((t) => t.id !== id));
    if (activeThemeTemplateId === id) {
      setActiveThemeTemplateId('theme-ghana-indigo');
    }
    try {
      await fetch(`/api/theme-templates/${id}`, { method: 'DELETE' });
      syncDataWithServer();
    } catch {
      // client fallback
    }
  };

  const toggleThemeTemplateStatus = async (id: string) => {
    const target = themeTemplates.find((t) => t.id === id);
    if (!target) return;
    const nextEnabled = !target.isEnabled;
    setThemeTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isEnabled: nextEnabled, updatedAt: new Date().toISOString() } : t))
    );
    try {
      await fetch(`/api/theme-templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: nextEnabled }),
      });
      syncDataWithServer();
    } catch {
      // client fallback
    }
  };

  const setActiveThemeTemplate = (id: string) => {
    setActiveThemeTemplateId(id);
    localStorage.setItem('unipast_active_theme_id', id);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        authMode,
        setAuthMode,
        login,
        signup,
        logout,
        recoverPassword,
        getUserSecurityQuestion,
        switchRole,
        passcodes,
        generatePasscode,
        revokePasscode,
        universities,
        selectedUniversityId,
        setSelectedUniversityId,
        currentUniversity,
        addUniversity,
        updateUniversity,
        deleteUniversity,
        toggleUniversityStatus,
        addFaculty,
        updateFaculty,
        deleteFaculty,
        toggleFacultyStatus,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        toggleDepartmentStatus,
        addProgramme,
        updateProgramme,
        deleteProgramme,
        toggleProgrammeStatus,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        toggleCourseStatus,
        papers,
        activePaper,
        setActivePaper,
        addPaper,
        updatePaper,
        deletePaper,
        togglePaperStatus,
        materials,
        addMaterial,
        deleteMaterial,
        recordDownload,
        toggleMaterialStatus,
        timetables,
        addTimetable,
        updateTimetable,
        deleteTimetable,
        toggleReminder,
        toggleScheduleStatus,
        users,
        addUser,
        updateUserStatus,
        deleteUser,
        updateUserProfile,
        changePassword,
        auditLogs,
        analyticsMetrics,
        recordPaperView,
        recordPaperDownload,
        recordSolutionRead,
        recordPracticeCompletion,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        themeTemplates,
        activeThemeTemplateId,
        activeThemeTemplate,
        addThemeTemplate,
        updateThemeTemplate,
        deleteThemeTemplate,
        toggleThemeTemplateStatus,
        setActiveThemeTemplate,
        theme,
        toggleTheme,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        isAiModalOpen,
        setIsAiModalOpen,
        aiPromptContext,
        openAiWithContext,
      }}
    >
      {children}
    </AppContext.Provider>
  );

};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
