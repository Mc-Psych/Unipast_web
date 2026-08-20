import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  PlusCircle,
  CheckCircle2,
  Users,
  FileText,
  MapPin,
  GraduationCap,
  Sparkles,
  KeyRound,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Trash2,
  School,
  Layers,
  BookOpen,
  Plus,
  AlertTriangle,
  RefreshCw,
  Search,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Camera,
  Palette,
} from 'lucide-react';
import { University, Faculty, Department, Programme, Course, ACADEMIC_DISCIPLINES } from '../../types';
import { cleanCourseTitle } from '../../utils/courseUtils';
import { ThemeTemplateEditor } from './ThemeTemplateEditor';
import { SectionContentEditor } from './SectionContentEditor';
import { Sliders } from 'lucide-react';

export const SystemConfig: React.FC = () => {
  const {
    currentUser,
    currentUniversity,
    universities,
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
    passcodes,
    generatePasscode,
    revokePasscode,
    papers,
  } = useApp();

  const isSysAdmin = currentUser.role === 'SYSTEM_ADMIN';
  const isSchoolAdmin = currentUser.role === 'SCHOOL_ADMIN';

  // Active university context
  const [selectedUniId, setSelectedUniId] = useState<string>(
    isSchoolAdmin
      ? currentUser.universityId || universities[0]?.id || 'univ-htu'
      : universities[0]?.id || 'univ-htu'
  );

  const selectedUni = universities.find((u) => u.id === selectedUniId) || universities[0];

  // Active Tab
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'courses' | 'branding' | 'passcodes' | 'institutions' | 'themes' | 'sections'>('hierarchy');

  // Search filters
  const [searchQuery, setSearchQuery] = useState('');
  const [courseLevelFilter, setCourseLevelFilter] = useState<number | 'all'>('all');
  const [courseSemesterFilter, setCourseSemesterFilter] = useState<number | 'all'>('all');

  // ----------------------------------------------------
  // Modals state
  // ----------------------------------------------------
  // University Modal
  const [isUniModalOpen, setIsUniModalOpen] = useState(false);
  const [editingUni, setEditingUni] = useState<University | null>(null);
  const [uniName, setUniName] = useState('');
  const [uniFullName, setUniFullName] = useState('');
  const [uniCode, setUniCode] = useState('');
  const [uniLogo, setUniLogo] = useState('🎓');
  const [uniLogoUrl, setUniLogoUrl] = useState('');
  const [uniLocation, setUniLocation] = useState('Ghana');
  const [uniMotto, setUniMotto] = useState('Knowledge & Excellence');
  const [uniCategory, setUniCategory] = useState<'TRADITIONAL' | 'TECHNICAL' | 'SPECIALIZED'>('TRADITIONAL');

  // Faculty Modal
  const [isFacModalOpen, setIsFacModalOpen] = useState(false);
  const [editingFac, setEditingFac] = useState<Faculty | null>(null);
  const [facName, setFacName] = useState('');
  const [facCode, setFacCode] = useState('');

  // Department Modal
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [targetFacId, setTargetFacId] = useState('');
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');

  // Programme Modal
  const [isProgModalOpen, setIsProgModalOpen] = useState(false);
  const [targetDeptId, setTargetDeptId] = useState('');
  const [editingProg, setEditingProg] = useState<Programme | null>(null);
  const [progName, setProgName] = useState('');
  const [progCode, setProgCode] = useState('');

  // Course Modal
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseCodeVal, setCourseCodeVal] = useState('');
  const [courseTitleVal, setCourseTitleVal] = useState('');
  const [courseLevelVal, setCourseLevelVal] = useState<100 | 200 | 300 | 400>(100);
  const [courseSemesterVal, setCourseSemesterVal] = useState<1 | 2>(1);
  const [courseCreditVal, setCourseCreditVal] = useState(3);
  const [courseCategoryVal, setCourseCategoryVal] = useState('General');
  const [courseDescVal, setCourseDescVal] = useState('');

  // Logo Upload State
  const logoFileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedLogoPreview, setUploadedLogoPreview] = useState<string | null>(selectedUni?.logoUrl || null);
  const [logoSaveSuccess, setLogoSaveSuccess] = useState(false);

  // Passcode Generator State
  const [passcodeRole, setPasscodeRole] = useState<'SCHOOL_ADMIN' | 'SYSTEM_ADMIN'>('SCHOOL_ADMIN');
  const [passcodeNote, setPasscodeNote] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // ----------------------------------------------------
  // Handlers for University
  // ----------------------------------------------------
  const handleOpenUniModal = (uni?: University) => {
    if (uni) {
      setEditingUni(uni);
      setUniName(uni.name);
      setUniFullName(uni.fullName);
      setUniCode(uni.code);
      setUniLogo(uni.logo);
      setUniLogoUrl(uni.logoUrl || '');
      setUniLocation(uni.location);
      setUniMotto(uni.motto);
      setUniCategory(uni.category);
    } else {
      setEditingUni(null);
      setUniName('');
      setUniFullName('');
      setUniCode('');
      setUniLogo('🏛️');
      setUniLogoUrl('');
      setUniLocation('Ghana');
      setUniMotto('Truth & Integrity');
      setUniCategory('TRADITIONAL');
    }
    setIsUniModalOpen(true);
  };

  const handleSaveUni = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniName.trim() || !uniCode.trim()) return;

    if (editingUni) {
      updateUniversity(editingUni.id, {
        name: uniName,
        fullName: uniFullName || uniName,
        code: uniCode.toUpperCase(),
        logo: uniLogo,
        logoUrl: uniLogoUrl || undefined,
        location: uniLocation,
        motto: uniMotto,
        category: uniCategory,
      });
    } else {
      addUniversity({
        name: uniName,
        fullName: uniFullName || uniName,
        code: uniCode.toUpperCase(),
        logo: uniLogo || '🎓',
        logoUrl: uniLogoUrl || undefined,
        location: uniLocation,
        motto: uniMotto,
        establishedYear: 1990,
        category: uniCategory,
        colorScheme: {
          primary: '#4F46E5',
          secondary: '#3730A3',
          accent: '#818CF8',
          badgeBg: 'bg-indigo-950',
          badgeText: 'text-indigo-300',
        },
      });
    }
    setIsUniModalOpen(false);
  };

  // ----------------------------------------------------
  // Handlers for Faculty
  // ----------------------------------------------------
  const handleOpenFacModal = (fac?: Faculty) => {
    if (fac) {
      setEditingFac(fac);
      setFacName(fac.name);
      setFacCode(fac.code);
    } else {
      setEditingFac(null);
      setFacName('');
      setFacCode('');
    }
    setIsFacModalOpen(true);
  };

  const handleSaveFac = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName.trim() || !facCode.trim()) return;

    if (editingFac) {
      updateFaculty(selectedUni.id, editingFac.id, {
        name: facName,
        code: facCode.toUpperCase(),
      });
    } else {
      addFaculty(selectedUni.id, {
        name: facName,
        code: facCode.toUpperCase(),
      });
    }
    setIsFacModalOpen(false);
  };

  // ----------------------------------------------------
  // Handlers for Department
  // ----------------------------------------------------
  const handleOpenDeptModal = (facId: string, dept?: Department) => {
    setTargetFacId(facId);
    if (dept) {
      setEditingDept(dept);
      setDeptName(dept.name);
      setDeptCode(dept.code);
    } else {
      setEditingDept(null);
      setDeptName('');
      setDeptCode('');
    }
    setIsDeptModalOpen(true);
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim() || !deptCode.trim() || !targetFacId) return;

    if (editingDept) {
      updateDepartment(selectedUni.id, targetFacId, editingDept.id, {
        name: deptName,
        code: deptCode.toUpperCase(),
      });
    } else {
      addDepartment(selectedUni.id, targetFacId, {
        name: deptName,
        code: deptCode.toUpperCase(),
      });
    }
    setIsDeptModalOpen(false);
  };

  // ----------------------------------------------------
  // Handlers for Programme
  // ----------------------------------------------------
  const handleOpenProgModal = (deptId: string, prog?: Programme) => {
    setTargetDeptId(deptId);
    if (prog) {
      setEditingProg(prog);
      setProgName(prog.name);
      setProgCode(prog.code);
    } else {
      setEditingProg(null);
      setProgName('');
      setProgCode('');
    }
    setIsProgModalOpen(true);
  };

  const handleSaveProg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progName.trim() || !progCode.trim() || !targetDeptId) return;

    if (editingProg) {
      updateProgramme(selectedUni.id, targetDeptId, targetDeptId, editingProg.id, {
        name: progName,
        code: progCode.toUpperCase(),
      });
    } else {
      addProgramme(selectedUni.id, targetDeptId, targetDeptId, {
        name: progName,
        code: progCode.toUpperCase(),
      });
    }
    setIsProgModalOpen(false);
  };

  // ----------------------------------------------------
  // Handlers for Course Management
  // ----------------------------------------------------
  const handleOpenCourseModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseCodeVal(course.code);
      setCourseTitleVal(cleanCourseTitle(course.title));
      setCourseLevelVal(course.level as 100 | 200 | 300 | 400);
      setCourseSemesterVal(course.semester as 1 | 2);
      setCourseCreditVal(course.creditHours || 3);
      setCourseCategoryVal(course.category || 'General');
      setCourseDescVal(course.description || '');
    } else {
      setEditingCourse(null);
      setCourseCodeVal('');
      setCourseTitleVal('');
      setCourseLevelVal(100);
      setCourseSemesterVal(1);
      setCourseCreditVal(3);
      setCourseCategoryVal('Computer Science');
      setCourseDescVal('');
    }
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCodeVal.trim() || !courseTitleVal.trim()) return;

    if (editingCourse) {
      updateCourse(editingCourse.id, {
        code: courseCodeVal.toUpperCase().trim(),
        title: cleanCourseTitle(courseTitleVal.trim()),
        level: courseLevelVal,
        semester: courseSemesterVal,
        creditHours: courseCreditVal,
        category: courseCategoryVal,
        description: courseDescVal.trim(),
      });
    } else {
      addCourse({
        universityId: selectedUni.id,
        code: courseCodeVal.toUpperCase().trim(),
        title: cleanCourseTitle(courseTitleVal.trim()),
        level: courseLevelVal,
        semester: courseSemesterVal,
        creditHours: courseCreditVal,
        category: courseCategoryVal,
        description: courseDescVal.trim(),
      });
    }
    setIsCourseModalOpen(false);
  };

  // ----------------------------------------------------
  // Handlers for Device Logo Upload
  // ----------------------------------------------------
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedLogoPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSchoolLogo = () => {
    if (!selectedUni) return;
    updateUniversity(selectedUni.id, {
      logoUrl: uploadedLogoPreview || undefined,
    });
    setLogoSaveSuccess(true);
    setTimeout(() => setLogoSaveSuccess(false), 3000);
  };

  // ----------------------------------------------------
  // Handlers for Passcode Generation
  // ----------------------------------------------------
  const handleGeneratePasscode = () => {
    const targetUni = isSysAdmin && passcodeRole === 'SYSTEM_ADMIN' ? 'global' : selectedUni.id;
    generatePasscode(targetUni, passcodeRole);
    setPasscodeNote('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter passcodes based on role and school (School admins MUST NOT see system admin passcodes)
  const visiblePasscodes = passcodes.filter((p) => {
    if (isSysAdmin) return true;
    return p.targetRole === 'SCHOOL_ADMIN' && p.universityId === selectedUni.id;
  });

  // Filter courses for active university
  const filteredCourses = courses.filter((c) => {
    const matchesUni = !selectedUniId || selectedUniId === 'all' || c.universityId === selectedUniId || c.universityId === 'all';
    const matchesQuery =
      !searchQuery.trim() ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel = courseLevelFilter === 'all' || c.level === courseLevelFilter;
    const matchesSemester = courseSemesterFilter === 'all' || c.semester === courseSemesterFilter;
    return matchesUni && matchesQuery && matchesLevel && matchesSemester;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {isSysAdmin ? 'Ghana Higher Education Registry & Administration' : `${selectedUni.name} Administration Hub`}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {isSysAdmin ? 'System Admin Scope' : 'School Admin Scope'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isSysAdmin
              ? 'Provision universities, manage faculties, academic courses, school crests/branding, and admin registration passcodes.'
              : `Manage faculties, departments, academic courses, school logo, and administrative credentials for ${selectedUni.name}.`}
          </p>
        </div>

        {/* University Switcher (for System Admin) */}
        {isSysAdmin && (
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <select
              value={selectedUniId}
              onChange={(e) => {
                setSelectedUniId(e.target.value);
                const target = universities.find((u) => u.id === e.target.value);
                setUploadedLogoPreview(target?.logoUrl || null);
              }}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.logo} {u.name} ({u.code}) {u.isDisabled ? '[Disabled]' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-3 sm:gap-6">
        {isSysAdmin && (
          <button
            onClick={() => setActiveTab('institutions')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'institutions'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>All Universities ({universities.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'hierarchy'
              ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{selectedUni.code} Faculties & Structure</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'courses'
              ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses & Syllabus ({filteredCourses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'branding'
              ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>School Logo & Crest</span>
        </button>

        <button
          onClick={() => setActiveTab('passcodes')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'passcodes'
              ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Security Passcodes ({visiblePasscodes.length})</span>
        </button>

        {isSysAdmin && (
          <button
            onClick={() => setActiveTab('themes')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'themes'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Theme Templates & Customizer</span>
          </button>
        )}

        {isSysAdmin && (
          <button
            onClick={() => setActiveTab('sections')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'sections'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>UI Sections, Badges & Texts</span>
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ALL UNIVERSITIES (SYSTEM ADMIN ONLY)              */}
      {/* ======================================================== */}
      {activeTab === 'institutions' && isSysAdmin && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Higher Education Institutions in Ghana</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add, edit details, or toggle operational status for universities.</p>
            </div>

            <button
              onClick={() => handleOpenUniModal()}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New University</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {universities.map((uni) => {
              const uniPapers = papers.filter((p) => p.universityId === uni.id);

              return (
                <div
                  key={uni.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    uni.isDisabled
                      ? 'bg-slate-100 dark:bg-slate-900/60 border-rose-200 dark:border-rose-900/40 opacity-60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                        {uni.logoUrl ? (
                          <img src={uni.logoUrl} alt={uni.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <span className="text-2xl">{uni.logo}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{uni.name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{uni.code} • {uni.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenUniModal(uni)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit University"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleUniversityStatus(uni.id)}
                        className={`p-1.5 rounded-lg transition ${
                          uni.isDisabled ? 'text-rose-500 hover:text-emerald-500' : 'text-emerald-500 hover:text-rose-500'
                        }`}
                        title={uni.isDisabled ? 'Enable University' : 'Disable University'}
                      >
                        {uni.isDisabled ? <ToggleLeft className="w-5 h-5 text-slate-400" /> : <ToggleRight className="w-5 h-5 text-emerald-500" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic">"{uni.motto}"</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{uni.faculties?.length || 0} Faculties</span>
                    <span>{uniPapers.length} Exam Papers</span>
                    <span className={uni.isDisabled ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
                      {uni.isDisabled ? 'Disabled' : 'Operational'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: FACULTIES, DEPARTMENTS & PROGRAMMES HIERARCHY      */}
      {/* ======================================================== */}
      {activeTab === 'hierarchy' && (
        <div className="space-y-6">
          {/* Institutional Banner Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                {selectedUni.logoUrl ? (
                  <img src={selectedUni.logoUrl} alt={selectedUni.name} className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-3xl">{selectedUni.logo}</span>
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{selectedUni.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedUni.fullName} • {selectedUni.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenFacModal()}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Faculty to {selectedUni.code}</span>
              </button>
            </div>
          </div>

          {/* Faculties List */}
          <div className="space-y-4">
            {(!selectedUni.faculties || selectedUni.faculties.length === 0) && (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No faculties configured for {selectedUni.name} yet.</p>
                <button
                  onClick={() => handleOpenFacModal()}
                  className="mt-3 px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg"
                >
                  Create First Faculty
                </button>
              </div>
            )}

            {selectedUni.faculties?.map((fac) => (
              <div
                key={fac.id}
                className={`rounded-2xl border transition ${
                  fac.isDisabled
                    ? 'bg-slate-100 dark:bg-slate-950/60 border-rose-200 dark:border-rose-950/60 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                {/* Faculty Title Bar */}
                <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {fac.code}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{fac.name}</h4>
                    {fac.isDisabled && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        Disabled
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDeptModal(fac.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                    >
                      <Plus className="w-3 h-3" /> Add Dept
                    </button>
                    <button
                      onClick={() => handleOpenFacModal(fac)}
                      className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                      title="Edit Faculty"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleFacultyStatus(selectedUni.id, fac.id)}
                      className="p-1 rounded-lg"
                      title={fac.isDisabled ? 'Enable Faculty' : 'Disable Faculty'}
                    >
                      {fac.isDisabled ? (
                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ToggleRight className="w-5 h-5 text-emerald-500" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteFaculty(selectedUni.id, fac.id)}
                      className="p-1 rounded-lg text-rose-500 hover:text-rose-600"
                      title="Delete Faculty"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Departments in Faculty */}
                <div className="p-4 space-y-3">
                  {(!fac.departments || fac.departments.length === 0) && (
                    <p className="text-xs text-slate-500 italic">No departments yet in this faculty.</p>
                  )}

                  {fac.departments?.map((dept) => (
                    <div
                      key={dept.id}
                      className={`p-3 rounded-xl border ${
                        dept.isDisabled
                          ? 'bg-slate-50 dark:bg-slate-900/30 border-rose-200 dark:border-rose-900/30 opacity-60'
                          : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {dept.code}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{dept.name}</span>
                          {dept.isDisabled && (
                            <span className="text-[9px] text-rose-500 font-bold">[Disabled]</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenProgModal(dept.id)}
                            className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
                          >
                            + Programme
                          </button>
                          <button
                            onClick={() => handleOpenDeptModal(fac.id, dept)}
                            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => toggleDepartmentStatus(selectedUni.id, fac.id, dept.id)}
                            className="p-1"
                            title={dept.isDisabled ? 'Enable' : 'Disable'}
                          >
                            {dept.isDisabled ? (
                              <ToggleLeft className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ToggleRight className="w-4 h-4 text-emerald-500" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteDepartment(selectedUni.id, fac.id, dept.id)}
                            className="p-1 text-rose-500 hover:text-rose-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Programmes List */}
                      {dept.programmes && dept.programmes.length > 0 && (
                        <div className="mt-2 pl-3 border-l border-slate-200 dark:border-slate-700 flex flex-wrap gap-1.5">
                          {dept.programmes.map((prog) => (
                            <div
                              key={prog.id}
                              className={`text-[10px] px-2 py-1 rounded-md border flex items-center gap-1.5 ${
                                prog.isDisabled
                                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              <span className="font-semibold">{prog.name} ({prog.code})</span>
                              <button
                                onClick={() => toggleProgrammeStatus(selectedUni.id, fac.id, dept.id, prog.id)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                title="Toggle Status"
                              >
                                {prog.isDisabled ? (
                                  <ToggleLeft className="w-3 h-3 text-rose-500" />
                                ) : (
                                  <ToggleRight className="w-3 h-3 text-emerald-500" />
                                )}
                              </button>
                              <button
                                onClick={() => deleteProgramme(selectedUni.id, fac.id, dept.id, prog.id)}
                                className="text-rose-500 hover:text-rose-600"
                                title="Delete"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: COURSES & SYLLABUS MANAGEMENT                     */}
      {/* ======================================================== */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Course Directory for {selectedUni.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                School Admins and System Admins can add, edit, categorize, or toggle active courses.
              </p>
            </div>

            <button
              onClick={() => handleOpenCourseModal()}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Course</span>
            </button>
          </div>

          {/* Search & Level Filters */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses by code or title..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Level:</span>
              {(['all', 100, 200, 300, 400] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setCourseLevelFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    courseLevelFilter === lvl
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lvl === 'all' ? 'All Levels' : `L${lvl}`}
                </button>
              ))}

              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-2">Sem:</span>
              {(['all', 1, 2] as const).map((sem) => (
                <button
                  key={sem}
                  onClick={() => setCourseSemesterFilter(sem)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    courseSemesterFilter === sem
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {sem === 'all' ? 'All' : `Sem ${sem}`}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid / Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No courses found matching the search criteria.</p>
                <button
                  onClick={() => handleOpenCourseModal()}
                  className="mt-3 px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg"
                >
                  Add First Course
                </button>
              </div>
            ) : (
              filteredCourses.map((c) => (
                <div
                  key={c.id}
                  className={`p-4 rounded-2xl border transition ${
                    c.isDisabled
                      ? 'bg-slate-100 dark:bg-slate-950/60 border-rose-200 dark:border-rose-950/60 opacity-60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono font-bold text-xs">
                          {c.code}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          Level {c.level} • Sem {c.semester}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {c.creditHours || 3} Credits
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">{cleanCourseTitle(c.title)}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{c.description}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenCourseModal(c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit Course"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleCourseStatus(c.id)}
                        className="p-1.5 rounded-lg"
                        title={c.isDisabled ? 'Enable Course' : 'Disable Course'}
                      >
                        {c.isDisabled ? (
                          <ToggleLeft className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ToggleRight className="w-5 h-5 text-emerald-500" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteCourse(c.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete Course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Department: {c.category || 'General Computing'}</span>
                    <span>{c.paperCount || 0} Past Exam Papers</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: SCHOOL LOGO & BRANDING UPLOAD (DEVICE PICKER)     */}
      {/* ======================================================== */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedUni.name} Official Emblem & Crest
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Upload an authentic school logo from your device (PNG, JPG, SVG, WebP) to display across the student portal, exam papers, and certificates.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {selectedUni.code}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Preview Card */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-28 h-28 rounded-2xl bg-white dark:bg-slate-950 border-2 border-indigo-500/40 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                  {uploadedLogoPreview ? (
                    <img
                      src={uploadedLogoPreview}
                      alt={selectedUni.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-5xl">{selectedUni.logo}</span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{selectedUni.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{selectedUni.motto}</p>
                </div>

                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-1 rounded-full">
                  ✓ Active Display Emblem
                </div>
              </div>

              {/* Upload & Choose Controls */}
              <div className="col-span-2 space-y-4">
                <div
                  onClick={() => logoFileInputRef.current?.click()}
                  className="p-8 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-500/40 hover:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/10 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 cursor-pointer flex flex-col items-center justify-center text-center transition space-y-2"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/40 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">Click or Drag & Drop School Logo from Device</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                    Supports high-resolution PNG, JPEG, SVG, or WebP formats up to 10MB.
                  </p>
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml, image/webp"
                    onChange={handleLogoFileChange}
                    className="hidden"
                  />
                </div>

                {/* Preset Emoji / Vector Crests */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Or select a fast university preset icon:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['🎓', '🏛️', '🔬', '⚙️', '🦅', '🦁', '🌿', '⚡', '💻', '🌍'].map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => {
                          setUploadedLogoPreview(null);
                          updateUniversity(selectedUni.id, { logo: em, logoUrl: undefined });
                        }}
                        className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition ${
                          selectedUni.logo === em && !uploadedLogoPreview
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSchoolLogo}
                    disabled={!uploadedLogoPreview}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply & Save Official Logo</span>
                  </button>

                  {logoSaveSuccess && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                      <Check className="w-4 h-4" /> Saved Successfully!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: ADMIN SECURITY PASSCODE GENERATOR                */}
      {/* ======================================================== */}
      {activeTab === 'passcodes' && (
        <div className="space-y-6">
          {/* Passcode Generator Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Generate Single-Use Admin Security Passcode</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Passcodes are required for new School Admins or System Admins during registration.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Target Role
                </label>
                <select
                  value={passcodeRole}
                  onChange={(e) => setPasscodeRole(e.target.value as any)}
                  disabled={!isSysAdmin}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="SCHOOL_ADMIN">School Admin ({selectedUni.code}-ADM-XXXX)</option>
                  {isSysAdmin && <option value="SYSTEM_ADMIN">System Admin (GH-SYSADMIN-XXXX)</option>}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Recipient Note / Scope
                </label>
                <input
                  type="text"
                  value={passcodeNote}
                  onChange={(e) => setPasscodeNote(e.target.value)}
                  placeholder="e.g. Dean / Head of Exam Board"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGeneratePasscode}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20 transition"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Generate New Passcode</span>
                </button>
              </div>
            </div>
          </div>

          {/* Passcodes Registry Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active & Historical Passcodes Registry</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">
                    <th className="pb-3">Passcode</th>
                    <th className="pb-3">Target Scope</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Created Date</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {visiblePasscodes.map((pc) => (
                    <tr key={pc.id} className="text-slate-700 dark:text-slate-300">
                      <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span>{pc.code}</span>
                          <button
                            onClick={() => copyToClipboard(pc.code)}
                            className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-sans"
                          >
                            {copiedCode === pc.code ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                      </td>
                      <td className="py-3">{pc.universityCode || 'Global GH'}</td>
                      <td className="py-3 font-semibold">
                        {pc.targetRole === 'SYSTEM_ADMIN' ? '⚡ System Admin' : '🛡️ School Admin'}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            pc.status === 'ACTIVE'
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : pc.status === 'USED'
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {pc.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{pc.createdAt}</td>
                      <td className="py-3 text-right">
                        {pc.status === 'ACTIVE' && (
                          <button
                            onClick={() => revokePasscode(pc.id)}
                            className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline font-semibold"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: THEME TEMPLATES & SYSTEM CUSTOMIZER (SYS ADMIN)   */}
      {/* ======================================================== */}
      {activeTab === 'themes' && isSysAdmin && (
        <ThemeTemplateEditor />
      )}

      {/* ======================================================== */}
      {/* TAB 7: SECTION & TEXT CUSTOMIZER (SYS ADMIN)             */}
      {/* ======================================================== */}
      {activeTab === 'sections' && isSysAdmin && (
        <SectionContentEditor />
      )}

      {/* ======================================================== */}
      {/* MODAL: UNIVERSITY PROVISIONING / EDITING                 */}
      {/* ======================================================== */}
      {isUniModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-slate-800 dark:text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingUni ? 'Edit University Details' : 'Add New University Tenant'}
              </h3>
              <button onClick={() => setIsUniModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUni} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Short Name *</label>
                  <input
                    type="text"
                    required
                    value={uniName}
                    onChange={(e) => setUniName(e.target.value)}
                    placeholder="e.g. Ashesi University"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Code *</label>
                  <input
                    type="text"
                    required
                    value={uniCode}
                    onChange={(e) => setUniCode(e.target.value)}
                    placeholder="ASHESI"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Full Legal Name</label>
                <input
                  type="text"
                  value={uniFullName}
                  onChange={(e) => setUniFullName(e.target.value)}
                  placeholder="e.g. Ashesi University Ghana"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={uniCategory}
                    onChange={(e) => setUniCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="TRADITIONAL">Traditional</option>
                    <option value="TECHNICAL">Technical University</option>
                    <option value="SPECIALIZED">Specialized</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Logo / Crest Emoji</label>
                  <input
                    type="text"
                    value={uniLogo}
                    onChange={(e) => setUniLogo(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Motto</label>
                <input
                  type="text"
                  value={uniMotto}
                  onChange={(e) => setUniMotto(e.target.value)}
                  placeholder="e.g. Knowledge & Excellence"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUniModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save University
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: FACULTY CREATE / EDIT                             */}
      {/* ======================================================== */}
      {isFacModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-slate-800 dark:text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingFac ? 'Edit Faculty' : `Add Faculty to ${selectedUni.code}`}
              </h3>
              <button onClick={() => setIsFacModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFac} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Faculty Name *</label>
                <input
                  type="text"
                  required
                  value={facName}
                  onChange={(e) => setFacName(e.target.value)}
                  placeholder="e.g. Faculty of Applied Sciences & Technology"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Faculty Code *</label>
                <input
                  type="text"
                  required
                  value={facCode}
                  onChange={(e) => setFacCode(e.target.value)}
                  placeholder="e.g. FAST"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold uppercase"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFacModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DEPARTMENT CREATE / EDIT                          */}
      {/* ======================================================== */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-slate-800 dark:text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingDept ? 'Edit Department' : 'Add Department'}
              </h3>
              <button onClick={() => setIsDeptModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDept} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Department Name *</label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Department Code *</label>
                <input
                  type="text"
                  required
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  placeholder="e.g. CS"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold uppercase"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PROGRAMME CREATE / EDIT                           */}
      {/* ======================================================== */}
      {isProgModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-slate-800 dark:text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingProg ? 'Edit Programme' : 'Add Programme'}
              </h3>
              <button onClick={() => setIsProgModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProg} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Programme Name *</label>
                <input
                  type="text"
                  required
                  value={progName}
                  onChange={(e) => setProgName(e.target.value)}
                  placeholder="e.g. BSc Computer Science"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Programme Code *</label>
                <input
                  type="text"
                  required
                  value={progCode}
                  onChange={(e) => setProgCode(e.target.value)}
                  placeholder="e.g. BCS"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold uppercase"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProgModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Programme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: COURSE CREATE / EDIT                              */}
      {/* ======================================================== */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-slate-800 dark:text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingCourse ? `Edit Course: ${editingCourse.code}` : `Add New Course to ${selectedUni.code}`}
              </h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={courseCodeVal}
                    onChange={(e) => setCourseCodeVal(e.target.value)}
                    placeholder="e.g. CS 201"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold uppercase"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={courseTitleVal}
                    onChange={(e) => setCourseTitleVal(cleanCourseTitle(e.target.value))}
                    placeholder="e.g. Data Structures and Algorithms"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Academic Level</label>
                  <select
                    value={courseLevelVal}
                    onChange={(e) => setCourseLevelVal(Number(e.target.value) as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  >
                    <option value={100}>Level 100</option>
                    <option value={200}>Level 200</option>
                    <option value={300}>Level 300</option>
                    <option value={400}>Level 400</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Semester</label>
                  <select
                    value={courseSemesterVal}
                    onChange={(e) => setCourseSemesterVal(Number(e.target.value) as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Credit Hours</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={courseCreditVal}
                    onChange={(e) => setCourseCreditVal(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Discipline / Category *</label>
                <select
                  value={courseCategoryVal}
                  onChange={(e) => setCourseCategoryVal(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {!ACADEMIC_DISCIPLINES.includes(courseCategoryVal) && courseCategoryVal && (
                    <option value={courseCategoryVal}>{courseCategoryVal}</option>
                  )}
                  {ACADEMIC_DISCIPLINES.map((discipline) => (
                    <option key={discipline} value={discipline}>
                      {discipline}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Course Description / Learning Objectives</label>
                <textarea
                  rows={3}
                  value={courseDescVal}
                  onChange={(e) => setCourseDescVal(e.target.value)}
                  placeholder="Brief synopsis of topics covered..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
