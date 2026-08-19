export type UserRole = 'STUDENT' | 'SCHOOL_ADMIN' | 'SYSTEM_ADMIN';
export type UniversityCategory = 'TRADITIONAL' | 'TECHNICAL' | 'SPECIALIZED';

export interface University {
  id: string;
  code: string; // e.g. "HTU", "KNUST", "UG", "UCC", "ATU"
  name: string;
  fullName: string;
  category: UniversityCategory;
  region: string;
  motto: string;
  location: string;
  logo: string;
  logoUrl?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    badgeBg: string;
    badgeText: string;
  };
  faculties: Faculty[];
  establishedYear: number;
  activeStudents: number;
  totalPapers: number;
  isDisabled?: boolean;
  contactEmail?: string;
  contactPhone?: string;
}

export interface Faculty {
  id: string;
  universityId: string;
  name: string;
  code: string;
  departments: Department[];
  isDisabled?: boolean;
}

export interface Department {
  id: string;
  facultyId: string;
  name: string;
  code: string;
  programmes: Programme[];
  isDisabled?: boolean;
}

export interface Programme {
  id: string;
  departmentId: string;
  name: string;
  code: string;
  durationYears?: number;
  isDisabled?: boolean;
}

export interface Course {
  id: string;
  universityId: string;
  facultyId?: string;
  departmentId?: string;
  programmeId?: string;
  code: string; // e.g. "CSC 201"
  title: string; // e.g. "Data Structures and Algorithms"
  level: 100 | 200 | 300 | 400;
  semester: 1 | 2;
  creditHours: number;
  description: string;
  category: string;
  paperCount?: number;
  materialCount?: number;
  isDisabled?: boolean;
}

export type QuestionType = 'mcq' | 'theory' | 'calculation' | 'code' | 'proof';

export interface SolutionStep {
  stepNumber: number;
  title: string;
  content: string;
  formulaOrCode?: string;
  marksAwarded?: number;
}

export interface QuestionDiagram {
  type: 'circuit' | 'tree' | 'graph' | 'flowchart' | 'geometry' | 'logic_gate' | 'custom_svg';
  title?: string;
  svgContent?: string;
  caption?: string;
}

export interface QuestionItem {
  id: string;
  number: string; // "1(a)", "2", "3(b)(i)"
  questionText: string;
  marks: number;
  questionType: QuestionType;
  options?: string[]; // for MCQ
  correctAnswer?: string;
  solutionSteps: SolutionStep[];
  examinerNotes?: string;
  keyTakeaway?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  topic?: string;
  userAnswer?: string; // for practice mode
  diagram?: QuestionDiagram;
  scannedSnippetUrl?: string;
}

export interface PaperSection {
  id: string;
  title: string; // "Section A: Multiple Choice / Short Answer", "Section B: Core Problems"
  instructions: string; // "Answer all questions in this section"
  marks: number;
  questions: QuestionItem[];
}

export type PaperStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface PastPaper {
  id: string;
  universityId: string;
  universityName?: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  academicYear: string; // "2023/2024", "2022/2023"
  semester: 1 | 2;
  level: 100 | 200 | 300 | 400;
  examType: 'End of Semester Examination' | 'Mid-Semester Examination' | 'Supplementary / Resit';
  durationMinutes: number;
  totalMarks: number;
  instructions: string[];
  sections: PaperSection[];
  status: PaperStatus;
  publishedBy: string;
  publishDate: string;
  downloadsCount: number;
  viewsCount: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  averageRating: number;
  tags: string[];
  hasScannedHardcopy?: boolean;
  originalScannedDocUrl?: string;
  isDisabled?: boolean;
}

export type MaterialCategory = 'LECTURE_NOTES' | 'FORMULA_SHEET' | 'SUMMARY_GUIDE' | 'LAB_MANUAL' | 'SLIDE_DECK';

export type MaterialFileFormat = 'PDF' | 'DOCX' | 'JPEG';

export interface StudyMaterial {
  id: string;
  universityId: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  description: string;
  category: MaterialCategory;
  fileFormat: MaterialFileFormat;
  fileSize: string;
  uploaderName: string;
  uploaderRole: string;
  uploadDate: string;
  downloadsCount: number;
  viewsCount: number;
  rating: number;
  verified: boolean;
  previewPages: string[];
  tags: string[];
  isDisabled?: boolean;
}

export interface ExamSchedule {
  id: string;
  universityId: string;
  courseCode: string;
  courseTitle: string;
  examDate: string; // YYYY-MM-DD
  startTime: string; // "09:00 AM"
  endTime: string; // "12:00 PM"
  venue: string;
  level: 100 | 200 | 300 | 400;
  semester: 1 | 2;
  seatIndexRange?: string;
  lecturer: string;
  notes?: string;
  reminderSet?: boolean;
  isDisabled?: boolean;
}

export interface BookmarkItem {
  id: string;
  userId: string;
  targetType: 'paper' | 'material' | 'question';
  targetId: string;
  title: string;
  courseCode: string;
  universityId: string;
  savedAt: string;
  note?: string;
}

export interface User {
  id: string;
  name: string;
  email: string; // Personal email used as username
  password?: string;
  role: UserRole;
  universityId?: string;
  facultyId?: string;
  department?: string;
  programme?: string;
  level?: 100 | 200 | 300 | 400;
  studentId?: string; // Optional for students
  avatarUrl?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  securityQuestion?: string;
  securityAnswer?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminPasscode {
  id: string;
  code: string; // e.g. "HTU-ADM-7842" or "KNUST-ADM-3019"
  universityId: string;
  universityCode: string;
  universityName: string;
  targetRole: 'SCHOOL_ADMIN' | 'SYSTEM_ADMIN';
  status: 'ACTIVE' | 'USED' | 'REVOKED';
  generatedByUserId: string;
  generatedByName: string;
  createdAt: string;
  usedByEmail?: string;
  usedAt?: string;
  expiresAt?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  universityId?: string;
  timestamp: string;
  details: string;
}

export interface SchoolAnalytics {
  totalPapers: number;
  totalMaterials: number;
  totalStudents: number;
  totalDownloads: number;
  weeklyViews: number;
  topCourses: { code: string; title: string; views: number; papers: number }[];
  levelDistribution: { level: string; students: number; papers: number }[];
  passRateProjection: number;
}

export interface GlobalAnalyticsMetrics {
  totalDownloads: number;
  solutionMarkingReads: number;
  practiceExamCompletions: number;
  verifiedStudyGuides: number;
  totalPaperViews: number;
  monthlyActiveLearners?: number;
  lastUpdated?: string;
}

export const ACADEMIC_DISCIPLINES: string[] = [
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Cybersecurity & Networking',
  'Computer Engineering',
  'Electrical & Electronic Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Petroleum & Energy Engineering',
  'Chemical & Materials Engineering',
  'Biomedical Engineering',
  'Mathematics & Statistics',
  'Physics & Physical Sciences',
  'Chemistry & Biological Sciences',
  'Business Administration & Management',
  'Accounting & Finance',
  'Economics',
  'Marketing & Supply Chain',
  'Health & Medical Sciences',
  'Nursing & Midwifery',
  'Pharmacy & Pharmaceutical Sciences',
  'Law & Legal Studies',
  'Arts & Humanities',
  'Social Sciences & Psychology',
  'Agriculture & Natural Resources',
  'Built Environment & Architecture',
  'Education & Pedagogical Studies',
  'General & Interdisciplinary Studies',
];

// =========================================================================
// SYSTEM THEME TEMPLATES & SYSTEM-WIDE CUSTOMIZER TYPES
// =========================================================================
export interface ThemeColors {
  primary: string; // Hex color (e.g. #4F46E5)
  primaryHover: string;
  primaryLight: string;
  accent: string;
  bgLight: string; // Light mode canvas background
  bgDark: string; // Dark mode canvas background
  cardLight: string; // Light mode card background
  cardDark: string; // Dark mode card background
  surfaceLight: string;
  surfaceDark: string;
  textPrimaryLight: string;
  textPrimaryDark: string;
  textSecondaryLight: string;
  textSecondaryDark: string;
  borderLight: string;
  borderDark: string;
  sidebarLight: string;
  sidebarDark: string;
  navbarLight: string;
  navbarDark: string;
}

export interface ThemeTypography {
  fontFamily: 'sans' | 'serif' | 'mono' | 'rounded' | 'display';
  fontFamilyName: string;
  headingFontFamily: 'sans' | 'serif' | 'mono' | 'rounded' | 'display';
  baseFontSize: 'compact' | 'standard' | 'large';
  headingWeight: 'normal' | 'semibold' | 'bold' | 'black';
  letterSpacing: 'tight' | 'normal' | 'wide';
}

export interface ThemeLayout {
  borderRadius: 'sharp' | 'subtle' | 'rounded' | 'pill'; // 0px | 8px | 16px | 24px
  cardStyle: 'bordered' | 'shadowed' | 'flat' | 'glass';
  density: 'compact' | 'comfortable' | 'spacious';
  navbarStyle: 'solid' | 'translucent' | 'accent';
  sidebarStyle: 'default' | 'compact' | 'floating';
  maxWidth: 'standard' | 'wide' | 'full';
}

export interface ThemeTemplate {
  id: string;
  name: string;
  description: string;
  isBuiltIn: boolean;
  isEnabled: boolean; // System admins can disable/enable templates
  isDefault?: boolean;
  category: 'Modern' | 'Academic' | 'High-Contrast' | 'Minimalist' | 'Prestigious' | 'Custom';
  colors: ThemeColors;
  typography: ThemeTypography;
  layout: ThemeLayout;
  createdAt: string;
  updatedAt: string;
  authorName?: string;
}


