import React, { useState, useEffect } from 'react';
import { useApp, AuthScreenMode } from '../../context/AppContext';
import { CarouselSlideshow } from '../common/CarouselSlideshow';
import {
  GraduationCap,
  ShieldAlert,
  UserCheck,
  Building2,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
  BookOpen,
  Camera,
  Layers,
  ChevronRight,
  HelpCircle,
  RefreshCw,
  School,
  FileText,
  Eye,
  EyeOff,
  Info,
  ShieldCheck,
  Check,
  Copy,
} from 'lucide-react';
import { UserRole } from '../../types';

const SECURITY_QUESTIONS = [
  'What is the name of your first primary school in Ghana?',
  "What is your mother's maiden name?",
  'What was the name of your first childhood pet?',
  'What is your favorite high school academic subject?',
  'In which Ghanaian city or town was your father born?',
  'What was the model of your first mobile phone?',
];

export const WelcomeAuthView: React.FC = () => {
  const {
    authMode,
    setAuthMode,
    login,
    signup,
    recoverPassword,
    getUserSecurityQuestion,
    universities,
    passcodes,
  } = useApp();

  // Active universities list
  const activeUnis = universities.filter((u) => !u.isDisabled);

  // Form states - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign up state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [signupRole, setSignupRole] = useState<UserRole>('STUDENT');
  const [signupUniId, setSignupUniId] = useState<string>(activeUnis[0]?.id || 'univ-htu');
  const [signupFacultyId, setSignupFacultyId] = useState<string>('');
  const [signupDepartment, setSignupDepartment] = useState<string>('');
  const [signupProgramme, setSignupProgramme] = useState<string>('');
  const [signupLevel, setSignupLevel] = useState<100 | 200 | 300 | 400>(200);
  const [signupStudentId, setSignupStudentId] = useState('');
  const [signupPasscode, setSignupPasscode] = useState('');
  const [signupSecQuestion, setSignupSecQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [signupSecAnswer, setSignupSecAnswer] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSecAnswer, setForgotSecAnswer] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [discoveredQuestion, setDiscoveredQuestion] = useState<string | null>(null);

  // UI helpers
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showAdminDetails, setShowAdminDetails] = useState(false);
  const [isDemoSectionEnabled, setIsDemoSectionEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unipast_enable_demo_logins');
      return saved === 'true'; // Disabled by default for production security
    }
    return false;
  });

  // Status feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Selected University for signup
  const selectedUni = universities.find((u) => u.id === signupUniId) || activeUnis[0];
  const availableFaculties = (selectedUni?.faculties || []).filter((f) => !f.isDisabled);
  const selectedFaculty = availableFaculties.find((f) => f.id === signupFacultyId) || availableFaculties[0];
  const availableDepartments = (selectedFaculty?.departments || []).filter((d) => !d.isDisabled);
  const selectedDepartmentObj = availableDepartments.find((d) => d.name === signupDepartment) || availableDepartments[0];
  const availableProgrammes = (selectedDepartmentObj?.programmes || []).filter((p) => !p.isDisabled);

  // Update discovered security question dynamically when forgotEmail changes
  useEffect(() => {
    if (forgotEmail.trim()) {
      const q = getUserSecurityQuestion(forgotEmail);
      setDiscoveredQuestion(q);
    } else {
      setDiscoveredQuestion(null);
    }
  }, [forgotEmail, getUserSecurityQuestion]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your personal email address or username.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (!res.success) {
        setErrorMessage(res.message || 'Login failed. Please verify your credentials.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!signupName.trim() || !signupEmail.trim()) {
      setErrorMessage('Please provide your full name and a valid personal email.');
      return;
    }

    if (!signupPassword || signupPassword.length < 4) {
      setErrorMessage('Please create a password of at least 4 characters.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both password fields.');
      return;
    }

    if (!signupSecAnswer.trim()) {
      setErrorMessage('Please provide a security answer for password recovery.');
      return;
    }

    if (signupRole === 'SCHOOL_ADMIN' && !signupPasscode.trim()) {
      setErrorMessage(`Please enter your School Admin passcode (e.g. ${selectedUni?.code || 'HTU'}-ADM-XXXX).`);
      return;
    }

    if (signupRole === 'SYSTEM_ADMIN' && !signupPasscode.trim()) {
      setErrorMessage('Master System Admin passcode is required for this role (e.g. GH-SYSADMIN-2024).');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
        universityId: signupRole === 'SYSTEM_ADMIN' ? undefined : signupUniId,
        facultyId: signupFacultyId || availableFaculties[0]?.id,
        department: signupDepartment || availableDepartments[0]?.name,
        programme: signupProgramme || availableProgrammes[0]?.name,
        level: signupRole === 'STUDENT' ? signupLevel : undefined,
        studentId: signupStudentId.trim() || undefined,
        passcode: signupPasscode,
        securityQuestion: signupSecQuestion,
        securityAnswer: signupSecAnswer,
      });

      if (!res.success) {
        setErrorMessage(res.message || 'Registration failed. Please check your details.');
      }
    } catch {
      setErrorMessage('An error occurred during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Recovery
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!forgotEmail.trim() || !forgotSecAnswer.trim()) {
      setErrorMessage('Please enter your registered email and answer your security question.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await recoverPassword(forgotEmail, forgotSecAnswer, forgotNewPassword || undefined);
      if (!res.success) {
        setErrorMessage(res.message || 'Recovery failed. Please check your email and answer.');
      } else {
        setSuccessMessage('Identity verified! Access granted.');
      }
    } catch {
      setErrorMessage('Recovery operation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Fast-Login Helpers (Fully working with instant login)
  const quickDemoLogin = async (email: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await login(email);
      if (!res.success) {
        setErrorMessage(res.message || 'Quick login failed.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during demo login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0D12] text-gray-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Welcome Header */}
      <header className="border-b border-gray-800/80 bg-[#12131A]/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-600/30">
              U
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Uni<span className="text-indigo-400">Past</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                  Ghana Academic Cloud
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                Ghanaian Universities Exam Papers, Marking Schemes & LMS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {authMode !== 'welcome' ? (
              <button
                onClick={() => setAuthMode('welcome')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/60 transition"
              >
                ← Back to Welcome
              </button>
            ) : null}

            {authMode !== 'login' && (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition shadow-xs"
              >
                Sign In
              </button>
            )}

            {authMode !== 'signup' && (
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex items-center justify-center">
        {/* ======================================================== */}
        {/* VIEW 1: WELCOME SCREEN */}
        {/* ======================================================== */}
        {authMode === 'welcome' && (
          <div className="w-full max-w-5xl animate-in fade-in zoom-in-98 duration-300 space-y-10">
            {/* Hero Greeting Section */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/80 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ghana Higher Education Past Exam & Solution Hub</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Master Your Exams Across <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-amber-300">
                  Every Ghanaian University
                </span>
              </h1>
              <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Seamless past questions, step-by-step marking rubrics, verified lecture notes, direct hardcopy camera scanning for digitizers, and institutional management.
              </p>
            </div>

            {/* Carousel Slideshow with students studying and celebrating */}
            <div className="pt-2">
              <CarouselSlideshow />
            </div>

            {/* Key Platform Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-[#14151D] border border-gray-800/80 space-y-2 hover:border-emerald-500/40 transition">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">Student Focused Access</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Filtered past questions, step-by-step mathematical derivations, downloadable materials, and exam schedules strictly customized to your university, faculty, and level.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#14151D] border border-gray-800/80 space-y-2 hover:border-indigo-500/40 transition">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                  <Camera className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">Hardcopy Camera Digitizer</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  School Admins can snap hardcopy past question sheets with their camera or upload scans. Gemini AI extracts text, question rubrics, and reconstructs diagrams.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#14151D] border border-gray-800/80 space-y-2 hover:border-amber-500/40 transition">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">Passcode Protected Admin Roles</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Institutional segregation ensures student accounts have zero admin panel access. Admins register using single-use university passcodes (e.g. HTU-ADM-XXXX).
                </p>
              </div>
            </div>

            {/* Action Buttons: Get Started & Existing Member Sign In (Placed below the feature section) */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-[#15161E] to-blue-950/40 border border-indigo-900/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>Ready to elevate your academic preparations?</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Join students and lecturers across Ho Technical University, KNUST, UG, and all campuses nationwide.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => setAuthMode('signup')}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition transform hover:-translate-y-0.5"
                >
                  <span>Get Started — Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAuthMode('login')}
                  className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs sm:text-sm border border-gray-700 transition"
                >
                  Existing Member? Sign In
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: LOGIN SCREEN */}
        {/* ======================================================== */}
        {authMode === 'login' && (
          <div className="w-full max-w-md bg-[#15161E] rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-200 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30">
                U
              </div>
              <h2 className="text-xl font-bold text-white">Sign In to UniPast</h2>
              <p className="text-xs text-gray-400">
                Enter your personal email and password to access your portal
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Personal Email / Username *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. kekesicourage@gmail.com or kofi.mensah@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Password *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot_password');
                      setForgotEmail(loginEmail);
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 transition underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition p-1"
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Panel (Enabled only if System Admin explicitly enables it) */}
            {isDemoSectionEnabled && (
              <div className="pt-4 border-t border-gray-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Quick Evaluation Demo Logins
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAdminDetails(!showAdminDetails)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                  >
                    <Info className="w-3 h-3" />
                    <span>{showAdminDetails ? 'Hide Details' : 'View SysAdmin Courage'}</span>
                  </button>
                </div>

                {/* 1-Click Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('kofi.mensah@gmail.com');
                      setLoginPassword('password123');
                      quickDemoLogin('kofi.mensah@gmail.com');
                    }}
                    className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-emerald-900/60 hover:border-emerald-500 text-center transition"
                  >
                    <span className="block text-[11px] font-bold text-emerald-400">Student</span>
                    <span className="block text-[9px] text-gray-400">Kofi Mensah</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('admin.htu@gmail.com');
                      setLoginPassword('password123');
                      quickDemoLogin('admin.htu@gmail.com');
                    }}
                    className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-indigo-900/60 hover:border-indigo-500 text-center transition"
                  >
                    <span className="block text-[11px] font-bold text-indigo-400">School Admin</span>
                    <span className="block text-[9px] text-gray-400">Dr. Kwasi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('kekesicourage@gmail.com');
                      setLoginPassword('admin123');
                      quickDemoLogin('kekesicourage@gmail.com');
                    }}
                    className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-amber-900/60 hover:border-amber-500 text-center transition"
                  >
                    <span className="block text-[11px] font-bold text-amber-400">SysAdmin</span>
                    <span className="block text-[9px] text-gray-400">Courage K.</span>
                  </button>
                </div>

                {/* Expanded Courage Credentials Display */}
                {showAdminDetails && (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/70 text-xs text-amber-200 space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between font-bold text-amber-300">
                      <span>👑 System Admin Login Details</span>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail('kekesicourage@gmail.com');
                          setLoginPassword('admin123');
                        }}
                        className="px-2 py-0.5 rounded bg-amber-800/60 hover:bg-amber-700 text-[10px] text-white"
                      >
                        Fill Form
                      </button>
                    </div>
                    <p><strong>Name:</strong> Courage Kekesi (Lead Architect)</p>
                    <p><strong>Email:</strong> <code className="bg-black/40 px-1 py-0.5 rounded font-mono">kekesicourage@gmail.com</code> (or <code className="bg-black/40 px-1 py-0.5 rounded font-mono">sysadmin@unipast.gh</code>)</p>
                    <p><strong>Password:</strong> <code className="bg-black/40 px-1 py-0.5 rounded font-mono">admin123</code></p>
                    <p><strong>Security Question:</strong> <em>What is the name of your first primary school in Ghana?</em></p>
                    <p><strong>Security Answer:</strong> <code className="bg-black/40 px-1 py-0.5 rounded font-mono">St. Paul Primary Ho</code></p>
                    <p><strong>Master Passcode:</strong> <code className="bg-black/40 px-1 py-0.5 rounded font-mono">GH-SYSADMIN-2024</code></p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Switch to Sign Up */}
            <div className="pt-4 border-t border-gray-800/80 text-center">
              <p className="text-xs text-gray-400">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="font-bold text-indigo-400 hover:text-indigo-300 ml-1 underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: SIGN UP SCREEN (WITH PASSWORD CREATION & VISIBILITY TOGGLE) */}
        {/* ======================================================== */}
        {authMode === 'signup' && (
          <div className="w-full max-w-2xl bg-[#15161E] rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1.5 mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-[11px] font-bold">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Account Registration</span>
              </div>
              <h2 className="text-2xl font-black text-white">Join UniPast Ghana</h2>
              <p className="text-xs text-gray-400">
                Create your account, set your password, and specify your academic placement
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-5">
              {/* MANDATORY USER ACCESS LEVEL SECTION */}
              <div className="p-4 rounded-2xl bg-gray-900/80 border border-indigo-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-indigo-400" />
                    <span>Select User Access Level</span>
                  </label>
                  <span className="text-[10px] text-gray-500 font-semibold">Strict Role Enforced</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Student Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSignupRole('STUDENT');
                      setSignupPasscode('');
                    }}
                    className={`p-3 rounded-xl border text-left transition ${
                      signupRole === 'STUDENT'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
                        : 'bg-gray-800/40 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <GraduationCap className={`w-4 h-4 ${signupRole === 'STUDENT' ? 'text-emerald-400' : 'text-gray-500'}`} />
                      <span>Student</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 leading-snug">
                      Access past questions, solutions, materials & timetable.
                    </p>
                  </button>

                  {/* School Admin Option */}
                  <button
                    type="button"
                    onClick={() => setSignupRole('SCHOOL_ADMIN')}
                    className={`p-3 rounded-xl border text-left transition ${
                      signupRole === 'SCHOOL_ADMIN'
                        ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500'
                        : 'bg-gray-800/40 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <UserCheck className={`w-4 h-4 ${signupRole === 'SCHOOL_ADMIN' ? 'text-indigo-400' : 'text-gray-500'}`} />
                      <span>School Admin</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 leading-snug">
                      Digitize papers, CRUD faculties, courses, timetables.
                    </p>
                  </button>

                  {/* System Admin Option */}
                  <button
                    type="button"
                    onClick={() => setSignupRole('SYSTEM_ADMIN')}
                    className={`p-3 rounded-xl border text-left transition ${
                      signupRole === 'SYSTEM_ADMIN'
                        ? 'bg-amber-950/40 border-amber-500 text-amber-200 ring-1 ring-amber-500'
                        : 'bg-gray-800/40 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <ShieldAlert className={`w-4 h-4 ${signupRole === 'SYSTEM_ADMIN' ? 'text-amber-400' : 'text-gray-500'}`} />
                      <span>System Admin</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 leading-snug">
                      Manage all universities, global passcodes, audit logs.
                    </p>
                  </button>
                </div>
              </div>

              {/* Personal Details: Full Name & Personal Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Personal Email (Username) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. kwame.mensah@gmail.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* PASSWORD CREATION WITH SHOW/HIDE VISIBILITY TOGGLE */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Create & Confirm Password *</span>
                  </span>
                  <span className="text-[10px] text-gray-400">Min. 4 characters</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Create password"
                        className="w-full pl-3.5 pr-10 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition p-1"
                        title={showSignupPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupConfirmPassword ? 'text' : 'password'}
                        required
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-3.5 pr-10 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition p-1"
                        title={showSignupConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSignupConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {signupPassword && signupConfirmPassword && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {signupPassword === signupConfirmPassword ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* University & Academic Placement (for Student & School Admin) */}
              {signupRole !== 'SYSTEM_ADMIN' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Enrolled University *
                    </label>
                    <select
                      value={signupUniId}
                      onChange={(e) => {
                        setSignupUniId(e.target.value);
                        setSignupFacultyId('');
                        setSignupDepartment('');
                        setSignupProgramme('');
                      }}
                      className="w-full px-3 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      {activeUnis.map((uni) => (
                        <option key={uni.id} value={uni.id}>
                          {uni.logo} {uni.name} ({uni.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {signupRole === 'STUDENT' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Academic Level *
                      </label>
                      <select
                        value={signupLevel}
                        onChange={(e) => setSignupLevel(Number(e.target.value) as 100 | 200 | 300 | 400)}
                        className="w-full px-3 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value={100}>Level 100 (Freshman / Year 1)</option>
                        <option value={200}>Level 200 (Sophomore / Year 2)</option>
                        <option value={300}>Level 300 (Junior / Year 3)</option>
                        <option value={400}>Level 400 (Senior / Final Year)</option>
                      </select>
                    </div>
                  )}

                  {/* Optional Index Number */}
                  {signupRole === 'STUDENT' && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Student ID / Index Number <span className="text-gray-500 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={signupStudentId}
                        onChange={(e) => setSignupStudentId(e.target.value)}
                        placeholder="e.g. 0320140029 (Optional - leave blank if not yet issued)"
                        className="w-full px-3.5 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Faculty / Department / Programme Hierarchy for Student and School Admin */}
              {signupRole !== 'SYSTEM_ADMIN' && availableFaculties.length > 0 && (
                <div className="p-3.5 rounded-xl bg-gray-900/50 border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                      Academic Faculty & Programme Details
                    </p>
                    <span className="text-[10px] text-gray-400">Customizable</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Faculty Dropdown */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 mb-1">Faculty / School</label>
                      <select
                        value={signupFacultyId || availableFaculties[0]?.id}
                        onChange={(e) => {
                          setSignupFacultyId(e.target.value);
                          setSignupDepartment('');
                          setSignupProgramme('');
                        }}
                        className="w-full px-2.5 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        {availableFaculties.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.code ? `[${f.code}] ` : ''}{f.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Department Dropdown */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 mb-1">Department</label>
                      <select
                        value={signupDepartment || availableDepartments[0]?.name}
                        onChange={(e) => {
                          setSignupDepartment(e.target.value);
                          setSignupProgramme('');
                        }}
                        className="w-full px-2.5 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        {availableDepartments.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name} {d.code ? `(${d.code})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Programme Dropdown */}
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 mb-1">Programme of Study</label>
                      <select
                        value={signupProgramme || availableProgrammes[0]?.name}
                        onChange={(e) => setSignupProgramme(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        {availableProgrammes.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name} {p.durationYears ? `(${p.durationYears} Yrs)` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Passcode Input for School & System Admin Roles */}
              {signupRole !== 'STUDENT' && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>
                        {signupRole === 'SCHOOL_ADMIN'
                          ? `Security Passcode for ${selectedUni?.code || 'School'} Admin *`
                          : 'Master System Admin Security Passcode *'}
                      </span>
                    </label>
                    <span className="text-[10px] text-amber-400 font-mono">Single-Use Code</span>
                  </div>

                  <input
                    type="text"
                    required
                    value={signupPasscode}
                    onChange={(e) => setSignupPasscode(e.target.value.toUpperCase())}
                    placeholder={
                      signupRole === 'SCHOOL_ADMIN'
                        ? `e.g. ${selectedUni?.code || 'HTU'}-ADM-9281`
                        : 'e.g. GH-SYSADMIN-2024'
                    }
                    className="w-full px-3.5 py-2.5 bg-gray-900 border border-amber-700/60 rounded-xl text-xs sm:text-sm font-mono text-amber-200 uppercase tracking-widest placeholder-gray-600 focus:outline-none focus:border-amber-400"
                  />

                  {/* Sample Available Passcodes helper */}
                  <div className="text-[11px] text-gray-400 pt-1">
                    <span className="text-gray-500">Quick-click demo passcodes: </span>
                    {signupRole === 'SYSTEM_ADMIN' ? (
                      <button
                        type="button"
                        onClick={() => setSignupPasscode('GH-SYSADMIN-2024')}
                        className="mr-2 font-mono text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-amber-300 hover:bg-gray-700 underline"
                      >
                        GH-SYSADMIN-2024
                      </button>
                    ) : (
                      passcodes
                        .filter((p) => p.status === 'ACTIVE')
                        .slice(0, 3)
                        .map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSignupPasscode(p.code);
                              if (p.universityId && p.universityId !== 'global') {
                                setSignupUniId(p.universityId);
                              }
                            }}
                            className="mr-2 font-mono text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-amber-300 hover:bg-gray-700 underline"
                          >
                            {p.code}
                          </button>
                        ))
                    )}
                  </div>
                </div>
              )}

              {/* Security Question for Password Recovery */}
              <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span>Security Question (For Account Recovery) *</span>
                </div>

                <div className="space-y-2">
                  <select
                    value={signupSecQuestion}
                    onChange={(e) => setSignupSecQuestion(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none"
                  >
                    {SECURITY_QUESTIONS.map((q, i) => (
                      <option key={i} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    required
                    value={signupSecAnswer}
                    onChange={(e) => setSignupSecAnswer(e.target.value)}
                    placeholder="Enter your security answer (e.g. St. Paul JHS)"
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Registering Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-400">
                Already registered on UniPast?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="font-bold text-indigo-400 hover:text-indigo-300 ml-1 underline"
                >
                  Sign In Here
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: FORGOT PASSWORD (SECURITY QUESTION RECOVERY)      */}
        {/* ======================================================== */}
        {authMode === 'forgot_password' && (
          <div className="w-full max-w-md bg-[#15161E] rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-200 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 font-bold text-2xl mx-auto flex items-center justify-center border border-amber-700/50">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Account & Password Recovery</h2>
              <p className="text-xs text-gray-400">
                Enter your registered email and answer your security question to reset access
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Your Registered Personal Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. kekesicourage@gmail.com or kofi.mensah@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Dynamic Security Question Banner if recognized */}
              {discoveredQuestion && (
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-xs text-indigo-200 space-y-1 animate-in fade-in duration-200">
                  <span className="font-bold text-indigo-300 block">Your Registered Security Question:</span>
                  <p className="italic text-white">"{discoveredQuestion}"</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Security Answer *
                </label>
                <input
                  type="text"
                  required
                  value={forgotSecAnswer}
                  onChange={(e) => setForgotSecAnswer(e.target.value)}
                  placeholder="Enter your security answer (e.g. St. Paul Primary Ho)"
                  className="w-full px-3.5 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Optional New Password creation */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Set New Password <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showForgotNewPassword ? 'text' : 'password'}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Enter new password (optional)"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-900/80 border border-gray-700 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition p-1"
                  >
                    {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Identity...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Identity & Access Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Recovery Helper */}
            <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-[11px] text-gray-400 space-y-1">
              <span className="font-bold text-gray-300 block">Demo Accounts Recovery Hints:</span>
              <p>• <strong>Courage (SysAdmin):</strong> Answer = <button type="button" onClick={() => { setForgotEmail('kekesicourage@gmail.com'); setForgotSecAnswer('St. Paul Primary Ho'); }} className="text-amber-400 underline font-mono">St. Paul Primary Ho</button></p>
              <p>• <strong>Kofi (Student):</strong> Answer = <button type="button" onClick={() => { setForgotEmail('kofi.mensah@gmail.com'); setForgotSecAnswer('Mawuli School'); }} className="text-emerald-400 underline font-mono">Mawuli School</button></p>
              <p>• <strong>Dr. Kwasi (School Admin):</strong> Answer = <button type="button" onClick={() => { setForgotEmail('admin.htu@gmail.com'); setForgotSecAnswer('Algorithms'); }} className="text-indigo-400 underline font-mono">Algorithms</button></p>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
              >
                ← Back to Regular Sign In
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 bg-[#12131A] py-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>UniPast Ghana © {new Date().getFullYear()} • Multi-Tenant Academic Repository System</span>
          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <span>Traditional & Technical Universities</span>
            <span>GTEC Aligned</span>
            <span>Examiner Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
