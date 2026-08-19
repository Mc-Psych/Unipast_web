import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload,
  RefreshCw,
  Eye,
  Layers,
  ArrowLeft,
  Image as ImageIcon,
  StopCircle,
  ToggleLeft,
  ToggleRight,
  FolderOpen,
  X,
  BookOpen,
  Lock,
} from 'lucide-react';
import { PastPaper, PaperSection, QuestionItem } from '../../types';
import { cleanCourseTitle } from '../../utils/courseUtils';

export const PaperDigitizer: React.FC = () => {
  const {
    currentUser,
    currentUniversity,
    universities,
    courses,
    papers,
    activePaper,
    setActivePaper,
    addPaper,
    updatePaper,
    deletePaper,
    setActiveView,
  } = useApp();

  // University scope
  const [universityId, setUniversityId] = useState<string>(
    currentUser.role === 'SCHOOL_ADMIN'
      ? currentUser.universityId || 'univ-htu'
      : activePaper?.universityId || currentUniversity?.id || universities[0]?.id || 'univ-htu'
  );

  const selectedUni = universities.find((u) => u.id === universityId);

  // Available courses for the selected university
  const availableCourses = courses.filter(
    (c) => !c.isDisabled && (!universityId || c.universityId === universityId || c.universityId === 'all')
  );
  const fallbackCourses = availableCourses.length > 0 ? availableCourses : courses.filter((c) => !c.isDisabled);

  // Form State
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    activePaper?.courseId || fallbackCourses[0]?.id || '__custom__'
  );
  const [courseCode, setCourseCode] = useState<string>(
    activePaper?.courseCode || fallbackCourses[0]?.code || 'CS 201'
  );
  const [courseTitle, setCourseTitle] = useState<string>(
    cleanCourseTitle(activePaper?.courseTitle || fallbackCourses[0]?.title || 'Data Structures and Algorithms')
  );
  const [isCustomCourse, setIsCustomCourse] = useState<boolean>(
    !fallbackCourses.some((c) => c.id === activePaper?.courseId || c.code === activePaper?.courseCode)
  );
  const [academicYear, setAcademicYear] = useState<string>(activePaper?.academicYear || '2023/2024');
  const [semester, setSemester] = useState<1 | 2>(activePaper?.semester || 1);
  const [level, setLevel] = useState<100 | 200 | 300 | 400>(activePaper?.level || 200);
  const [examType, setExamType] = useState<string>(activePaper?.examType || 'End of Semester Examination');
  const [durationMinutes, setDurationMinutes] = useState<number>(activePaper?.durationMinutes || 120);
  const [totalMarks, setTotalMarks] = useState<number>(activePaper?.totalMarks || 100);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Moderate' | 'Challenging'>(
    activePaper?.difficulty || 'Moderate'
  );
  const [isPublished, setIsPublished] = useState<boolean>(
    activePaper ? activePaper.status === 'PUBLISHED' : true
  );
  const [tagsStr, setTagsStr] = useState<string>(
    activePaper ? activePaper.tags.join(', ') : 'Scanned Exam, Balanced Trees, Algorithms, Derivations'
  );
  const [instructionsStr, setInstructionsStr] = useState<string>(
    activePaper
      ? activePaper.instructions.join('\n')
      : 'Answer ALL questions in Section A (40 Marks).\nAnswer ANY TWO questions in Section B (60 Marks).\nShow all intermediate calculation steps and stated assumptions.'
  );

  // Hardcopy Capture & Camera States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(activePaper?.originalScannedDocUrl || null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [ocrRawText, setOcrRawText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanEngine, setScanEngine] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [isDraftsDrawerOpen, setIsDraftsDrawerOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sections and Questions
  const [sections, setSections] = useState<PaperSection[]>(
    activePaper?.sections || [
      {
        id: 'sec-1',
        title: 'SECTION A: Core Fundamentals & Theory',
        instructions: 'Answer all questions in this section.',
        marks: 40,
        questions: [
          {
            id: 'q-1',
            number: '1(a)',
            questionText: 'Define an AVL tree and demonstrate step-by-step single left rotation when inserting keys [10, 20, 30].',
            marks: 15,
            topic: 'Self Balancing Trees',
            difficulty: 'Medium',
            questionType: 'calculation',
            diagram: {
              type: 'tree',
              title: 'Figure 1: AVL Tree Balance Vector',
              caption: 'Node balance factor representation after insertion of node 30.',
              svgContent: `<svg viewBox="0 0 300 120" class="w-full max-w-sm mx-auto my-2">
                <line x1="150" y1="25" x2="80" y2="70" stroke="#6366F1" stroke-width="2" />
                <line x1="150" y1="25" x2="220" y2="70" stroke="#6366F1" stroke-width="2" />
                <circle cx="150" cy="25" r="18" fill="#4F46E5" />
                <text x="150" y="30" text-anchor="middle" fill="#FFF" font-size="12" font-weight="bold">20 (BF:0)</text>
                <circle cx="80" cy="70" r="16" fill="#10B981" />
                <text x="80" y="75" text-anchor="middle" fill="#FFF" font-size="11">10</text>
                <circle cx="220" cy="70" r="16" fill="#3B82F6" />
                <text x="220" y="75" text-anchor="middle" fill="#FFF" font-size="11">30</text>
              </svg>`,
            },
            solutionSteps: [
              {
                stepNumber: 1,
                title: 'AVL Invariant Definition',
                content:
                  'An AVL tree is a self-balancing binary search tree where the difference between heights of left and right subtrees (Balance Factor) for any node is at most 1 (-1, 0, +1).',
                marksAwarded: 5,
              },
              {
                stepNumber: 2,
                title: 'Rotation Transformation Execution',
                content:
                  'Inserting 30 causes a Right-Right (RR) imbalance at root 10. Perform a single left rotation around node 10. Node 20 becomes the new root with children 10 and 30.',
                formulaOrCode: 'BF(root) = height(left) - height(right) = -2 (Requires Left Rotation)',
                marksAwarded: 10,
              },
            ],
            keyTakeaway: 'Always calculate and annotate the balance factor for each node.',
            examinerNotes: 'Check that students clearly show intermediate height calculations.',
          },
        ],
      },
    ]
  );

  // User's accessible draft papers
  const userDrafts = papers.filter(
    (p) =>
      p.status === 'DRAFT' &&
      (currentUser.role === 'SYSTEM_ADMIN' || p.universityId === currentUser.universityId)
  );

  // Camera Management
  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API is not supported in this browser. Please upload an exam image file directly.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsCameraActive(true);
        }
      } catch {
        setCameraError('Unable to open camera stream. Please use "Upload Scanned Image" or load sample.');
        setIsCameraActive(false);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCapturedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper to load sample sheet
  const loadSampleSheet = () => {
    setCameraError(null);
    setSaveFeedback(null);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FDFBF7';
      ctx.fillRect(0, 0, 1200, 800);
      ctx.strokeStyle = '#1E1E24';
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, 1140, 740);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 26px serif';
      ctx.textAlign = 'center';
      ctx.fillText('HO TECHNICAL UNIVERSITY', 600, 85);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('FACULTY OF APPLIED SCIENCES & TECHNOLOGY', 600, 115);
      ctx.fillText('DEPARTMENT OF COMPUTER SCIENCE', 600, 140);
      ctx.font = 'italic 16px serif';
      ctx.fillText('END OF FIRST SEMESTER EXAMINATION - 2023/2024 ACADEMIC YEAR', 600, 170);

      ctx.textAlign = 'left';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('COURSE CODE: CS 201', 60, 210);
      ctx.fillText('COURSE TITLE: DATA STRUCTURES & ALGORITHMS', 420, 210);
      ctx.fillText('TIME ALLOWED: 3 HOURS', 960, 210);

      ctx.font = '14px sans-serif';
      ctx.fillText('INSTRUCTIONS: Answer ALL questions in Section A and any THREE in Section B.', 60, 240);

      const sampleDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImage(sampleDataUrl);
      setOcrRawText(`HO TECHNICAL UNIVERSITY
FACULTY OF APPLIED SCIENCES & TECHNOLOGY
DEPARTMENT OF COMPUTER SCIENCE
END OF FIRST SEMESTER EXAMINATION - 2023/2024
CS 201: DATA STRUCTURES & ALGORITHMS (3 HOURS, 100 MARKS)

SECTION A: CORE THEORETICAL FOUNDATIONS & BALANCED TREES [40 MARKS]
Q1(a) Distinguish between an AVL Tree and a standard Binary Search Tree in terms of worst-case search complexity. [6 Marks]
Q1(b) Construct an AVL Tree by sequentially inserting the integer keys: 10, 20, 30, 40, 50, 25. Show the balance factor (BF) at each insertion step and specify the required rotation (LL, RR, LR, or RL). [14 Marks]

SECTION B: GRAPH ALGORITHMS & DYNAMIC PROGRAMMING [60 MARKS]
Q2 Given an adjacency matrix for a weighted undirected network graph G = (V, E), execute Dijkstra's algorithm to compute the shortest distance from Source Node S to all reachable vertices.`);
    }
  };

  // Run AI Hardcopy OCR
  const handleRunOcr = async () => {
    if (!capturedImage && !ocrRawText.trim()) {
      setCameraError('Please capture a photo, upload an exam sheet, or paste raw question text.');
      return;
    }

    setIsScanning(true);
    setCameraError(null);
    setSaveFeedback(null);

    try {
      const res = await fetch('/api/ai/scan-hardcopy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: capturedImage,
          rawText: ocrRawText,
          universityCode: selectedUni?.code || 'GH',
          courseCode: courseCode || 'CS 201',
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.data) {
          const d = result.data;
          if (d.courseCode) setCourseCode(d.courseCode);
          if (d.courseTitle) setCourseTitle(cleanCourseTitle(d.courseTitle));
          if (d.academicYear) setAcademicYear(d.academicYear);
          if (d.level) setLevel(d.level);
          if (d.semester) setSemester(d.semester);
          if (d.durationMinutes) setDurationMinutes(d.durationMinutes);
          if (d.totalMarks) setTotalMarks(d.totalMarks);
          if (d.instructions && Array.isArray(d.instructions)) {
            setInstructionsStr(d.instructions.join('\n'));
          }
          if (d.tags && Array.isArray(d.tags)) {
            setTagsStr(d.tags.join(', '));
          }
          if (d.sections && Array.isArray(d.sections) && d.sections.length > 0) {
            setSections(d.sections);
          }
          setScanEngine(result.engine || 'Gemini 2.5 Flash Vision');
          setSaveFeedback('Exam hardcopy transcribed with exact questions, options, and vector SVG diagrams!');
        }
      } else {
        setCameraError('OCR transcription encountered an issue. Using raw extracted format.');
      }
    } catch (err: any) {
      setCameraError('Failed to contact OCR engine: ' + err.message);
    } finally {
      setIsScanning(false);
    }
  };

  // Load an existing draft paper into the editor
  const handleLoadDraft = (paper: PastPaper) => {
    setActivePaper(paper);
    setUniversityId(paper.universityId);
    setCourseCode(paper.courseCode);
    setCourseTitle(cleanCourseTitle(paper.courseTitle));
    setAcademicYear(paper.academicYear);
    setSemester(paper.semester);
    setLevel(paper.level);
    setDurationMinutes(paper.durationMinutes);
    setTotalMarks(paper.totalMarks);
    setDifficulty(paper.difficulty);
    setIsPublished(paper.status === 'PUBLISHED');
    setTagsStr(paper.tags.join(', '));
    setInstructionsStr(paper.instructions.join('\n'));
    setSections(paper.sections);
    if (paper.originalScannedDocUrl) {
      setCapturedImage(paper.originalScannedDocUrl);
    }
    setIsDraftsDrawerOpen(false);
    setSaveFeedback(`Loaded draft: ${paper.courseCode} (${paper.academicYear})`);
  };

  // Section and Question modifications
  const addSection = () => {
    const newSecNum = sections.length + 1;
    const newSec: PaperSection = {
      id: `sec-${Date.now()}`,
      title: `SECTION ${String.fromCharCode(64 + newSecNum)}: Advanced Problems`,
      instructions: 'Answer any two questions in this section.',
      marks: 30,
      questions: [],
    };
    setSections([...sections, newSec]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const addQuestion = (sId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sId) return sec;
        const newQ: QuestionItem = {
          id: `q-${Date.now()}`,
          number: `${sec.questions.length + 1}(a)`,
          questionText: 'State the formal definition and analyze the algorithmic time complexity.',
          marks: 10,
          topic: 'Algorithm Analysis',
          difficulty: 'Medium',
          questionType: 'calculation',
          solutionSteps: [
            {
              stepNumber: 1,
              title: 'Problem Formalization',
              content: 'Define the mathematical relation and state all boundary conditions.',
              formulaOrCode: 'T(n) = 2T(n/2) + O(n)',
              marksAwarded: 5,
            },
            {
              stepNumber: 2,
              title: 'Final Derivation',
              content: 'Show inductive step and confirm convergence.',
              marksAwarded: 5,
            },
          ],
        };
        return { ...sec, questions: [...sec.questions, newQ] };
      })
    );
  };

  const updateQuestion = (sId: string, qId: string, updates: Partial<QuestionItem>) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sId) return sec;
        return {
          ...sec,
          questions: sec.questions.map((q) => (q.id === qId ? { ...q, ...updates } : q)),
        };
      })
    );
  };

  const removeQuestion = (sId: string, qId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sId) return sec;
        return {
          ...sec,
          questions: sec.questions.filter((q) => q.id !== qId),
        };
      })
    );
  };

  // Save / Publish
  const handleSave = (statusToSave?: 'DRAFT' | 'PUBLISHED') => {
    const finalStatus = statusToSave || (isPublished ? 'PUBLISHED' : 'DRAFT');

    const paperData: Omit<PastPaper, 'id'> = {
      universityId,
      courseId: (isCustomCourse ? '' : selectedCourseId) || '',
      courseCode: courseCode.toUpperCase().trim(),
      courseTitle: cleanCourseTitle(courseTitle.trim()),
      academicYear: academicYear.trim(),
      semester,
      level,
      examType,
      durationMinutes,
      totalMarks,
      difficulty,
      status: finalStatus,
      tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      instructions: instructionsStr.split('\n').map((i) => i.trim()).filter(Boolean),
      sections,
      originalScannedDocUrl: capturedImage || undefined,
      publishedBy: currentUser.name,
      publishDate: activePaper?.publishDate || new Date().toISOString().split('T')[0],
      viewsCount: activePaper?.viewsCount || 0,
      downloadsCount: activePaper?.downloadsCount || 0,
      averageRating: activePaper?.averageRating || 5.0,
      isDisabled: false,
    };

    if (activePaper) {
      updatePaper(activePaper.id, paperData);
      setSaveFeedback(`Updated exam paper ${courseCode} (${finalStatus}) successfully!`);
    } else {
      addPaper(paperData);
      setSaveFeedback(`Created and saved exam paper ${courseCode} (${finalStatus}) successfully!`);
    }

    setTimeout(() => setSaveFeedback(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 text-slate-800 dark:text-slate-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('papers')}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>Exam Paper Digitizer & Scanner</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold uppercase tracking-wider">
                Ghanaian Curriculum
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Capture hardcopy exam papers via camera or image upload to transcribe questions, marking schemes, and SVG diagrams.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Load Drafts Button */}
          <button
            type="button"
            onClick={() => setIsDraftsDrawerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <FolderOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Drafts ({userDrafts.length})</span>
          </button>

          {/* Toggle Publish State */}
          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5"
            title="Toggle Live Publish Status"
          >
            {isPublished ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ToggleRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Published
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <ToggleLeft className="w-5 h-5 text-slate-400 dark:text-slate-500" /> Draft
              </span>
            )}
          </button>

          <button
            onClick={() => handleSave('DRAFT')}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition border border-slate-300 dark:border-slate-700"
          >
            Save Draft
          </button>

          <button
            onClick={() => handleSave('PUBLISHED')}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/25 transition"
          >
            <Save className="w-4 h-4" />
            <span>Publish to Portal</span>
          </button>
        </div>
      </div>

      {saveFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 animate-in zoom-in-95">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold text-xs">{saveFeedback}</span>
        </div>
      )}

      {cameraError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="font-semibold text-xs leading-relaxed">{cameraError}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={loadSampleSheet}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Image</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 1: HARDCOPY SCANNER & OCR CONTROLS               */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Direct Hardcopy Paper Scanner</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Transcribe exact questions from photos or scanned documents with SVG diagram generation
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Open Device Camera</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Stop Camera</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Scanned Image</span>
            </button>

            <button
              type="button"
              onClick={loadSampleSheet}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Load Sample Exam Sheet</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Live Camera View */}
        {isCameraActive && (
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-300 dark:border-gray-800 aspect-video max-h-96 flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />
            <canvas ref={canvasRef} className="hidden" />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <button
                type="button"
                onClick={captureFrame}
                className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/40"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Exam Page</span>
              </button>
            </div>
          </div>
        )}

        {/* Scanned Document Preview & OCR Action */}
        {capturedImage && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 shrink-0">
                <img src={capturedImage} alt="Scanned Document" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Hardcopy Document Captured</span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Ready to trigger Gemini Vision OCR to parse questions and build marking structure.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isScanning}
                onClick={handleRunOcr}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{isScanning ? 'Transcribing with Gemini Vision...' : 'Trigger AI Vision OCR'}</span>
              </button>
              <button
                type="button"
                onClick={() => setCapturedImage(null)}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300"
                title="Discard Image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* OCR Text Fallback input */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Or Paste Raw Exam OCR Text Directly:
          </label>
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={ocrRawText}
              onChange={(e) => setOcrRawText(e.target.value)}
              placeholder="Paste raw exam text here..."
              className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button
              type="button"
              disabled={isScanning || !ocrRawText.trim()}
              onClick={handleRunOcr}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-slate-200 dark:border-slate-700 disabled:opacity-40 transition"
            >
              Parse Text
            </button>
          </div>
        </div>

        {scanEngine && (
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-indigo-800 dark:text-indigo-300 text-[11px] flex items-center justify-between">
            <span>OCR Parsing Engine: <strong>{scanEngine}</strong></span>
            <span className="text-slate-500 dark:text-slate-400">Ghana Higher Education Verified</span>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: EXAM PAPER METADATA FORM                      */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Institutional Exam Paper Metadata</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* University Selector */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Target University
            </label>
            <select
              value={universityId}
              disabled={currentUser.role === 'SCHOOL_ADMIN'}
              onChange={(e) => setUniversityId(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:outline-none"
            >
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.logo} {u.name} ({u.code})
                </option>
              ))}
            </select>
          </div>

          {/* Course Title Dropdown Selector */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
              <span>Course Title (Select from Catalog) *</span>
              {isCustomCourse && (
                <button
                  type="button"
                  onClick={() => setIsCustomCourse(false)}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline capitalize font-bold"
                >
                  ← Select from standard list
                </button>
              )}
            </label>

            {!isCustomCourse ? (
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCourseId(val);
                  if (val === '__custom__') {
                    setIsCustomCourse(true);
                  } else {
                    const found = courses.find((c) => c.id === val);
                    if (found) {
                      setCourseTitle(cleanCourseTitle(found.title));
                      setCourseCode(found.code);
                      if (found.level) setLevel(found.level as 100 | 200 | 300 | 400);
                      if (found.semester) setSemester(found.semester as 1 | 2);
                    }
                  }
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <optgroup label="Standard University Courses">
                  {fallbackCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {cleanCourseTitle(c.title)} (Level {c.level})
                    </option>
                  ))}
                </optgroup>
                <option value="__custom__">➕ Type Custom / Unlisted Course Code & Title...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(cleanCourseTitle(e.target.value))}
                  placeholder="Enter custom course title..."
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-indigo-500 font-semibold text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomCourse(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  List
                </button>
              </div>
            )}
          </div>

          {/* Course Code (Read-only when auto-populated from catalog) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                Course Code *
              </label>
              {!isCustomCourse && (
                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> Locked
                </span>
              )}
            </div>
            <input
              type="text"
              required
              readOnly={!isCustomCourse}
              value={courseCode}
              onChange={(e) => isCustomCourse && setCourseCode(e.target.value.toUpperCase())}
              placeholder="e.g. CS 201"
              className={`w-full py-2 px-3 rounded-xl border font-mono font-bold text-slate-900 dark:text-white transition ${
                !isCustomCourse
                  ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 cursor-not-allowed text-slate-600 dark:text-slate-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50'
              }`}
            />
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Academic Year
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="2023/2024"
              className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Semester */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                Semester
              </label>
              {!isCustomCourse && <span className="text-[9px] text-slate-400">Auto-filled</span>}
            </div>
            <select
              disabled={!isCustomCourse}
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value) as 1 | 2)}
              className={`w-full py-2 px-3 rounded-xl border font-bold text-slate-900 dark:text-white ${
                !isCustomCourse
                  ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 cursor-not-allowed text-slate-600 dark:text-slate-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50'
              }`}
            >
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                Academic Level
              </label>
              {!isCustomCourse && <span className="text-[9px] text-slate-400">Auto-filled</span>}
            </div>
            <select
              disabled={!isCustomCourse}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value) as 100 | 200 | 300 | 400)}
              className={`w-full py-2 px-3 rounded-xl border font-bold text-slate-900 dark:text-white ${
                !isCustomCourse
                  ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 cursor-not-allowed text-slate-600 dark:text-slate-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50'
              }`}
            >
              <option value={100}>Level 100</option>
              <option value={200}>Level 200</option>
              <option value={300}>Level 300</option>
              <option value={400}>Level 400</option>
            </select>
          </div>

          {/* Duration & Marks */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Duration & Marks
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                placeholder="120 min"
                className="w-1/2 py-2 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-bold text-slate-900 dark:text-white"
              />
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                placeholder="100 Mks"
                className="w-1/2 py-2 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Exam Header Instructions
          </label>
          <textarea
            rows={2}
            value={instructionsStr}
            onChange={(e) => setInstructionsStr(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 3: SECTIONS, QUESTIONS & DIAGRAMS                */}
      {/* ======================================================== */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Exam Sections & Digitized Questions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review and adjust question texts, marking schemes, and vector diagrams.
            </p>
          </div>

          <button
            type="button"
            onClick={addSection}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Section</span>
          </button>
        </div>

        {sections.map((sec) => (
          <div key={sec.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex-1 mr-4">
                <input
                  type="text"
                  value={sec.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSections((prev) =>
                      prev.map((s) => (s.id === sec.id ? { ...s, title: val } : s))
                    );
                  }}
                  className="w-full bg-transparent font-bold text-slate-900 dark:text-white text-sm focus:outline-none border-b border-transparent focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addQuestion(sec.id)}
                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Question
                </button>
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(sec.id)}
                    className="p-1 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Questions in section */}
            <div className="space-y-4">
              {sec.questions.map((q) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-16 shrink-0">
                      <input
                        type="text"
                        value={q.number}
                        onChange={(e) => updateQuestion(sec.id, q.id, { number: e.target.value })}
                        className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white text-xs text-center"
                      />
                    </div>
                    <div className="flex-1">
                      <textarea
                        rows={2}
                        value={q.questionText}
                        onChange={(e) => updateQuestion(sec.id, q.id, { questionText: e.target.value })}
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="w-20 shrink-0 flex items-center gap-1">
                      <input
                        type="number"
                        value={q.marks}
                        onChange={(e) => updateQuestion(sec.id, q.id, { marks: Number(e.target.value) })}
                        className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-bold text-amber-600 dark:text-amber-400 text-xs"
                      />
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Mks</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(sec.id, q.id)}
                      className="p-1 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* SVG Diagram Preview */}
                  {q.diagram && q.diagram.svgContent && (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-indigo-200 dark:border-indigo-900/50 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-indigo-700 dark:text-indigo-300 font-bold">
                        <span>Generated SVG Schematic: {q.diagram.title || 'Exam Diagram'}</span>
                        <button
                          type="button"
                          onClick={() => updateQuestion(sec.id, q.id, { diagram: undefined })}
                          className="text-rose-500 hover:underline text-[10px]"
                        >
                          Remove Diagram
                        </button>
                      </div>
                      <div
                        className="w-full max-w-sm mx-auto flex justify-center"
                        dangerouslySetInnerHTML={{ __html: q.diagram.svgContent }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================== */}
      {/* DRAWER / MODAL: DRAFT PAPERS & PENDING UPLOADS          */}
      {/* ======================================================== */}
      {isDraftsDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] flex flex-col text-slate-800 dark:text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Draft Papers & Uploads Repository ({userDrafts.length})
                </h3>
              </div>
              <button
                onClick={() => setIsDraftsDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {userDrafts.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-2">
                  <FileText className="w-8 h-8 mx-auto opacity-40" />
                  <p className="text-xs">No saved drafts currently in repository.</p>
                </div>
              ) : (
                userDrafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-amber-400/40 transition flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
                          {draft.courseCode}
                        </span>
                        <span className="text-[11px] text-slate-800 dark:text-slate-300 font-semibold">{cleanCourseTitle(draft.courseTitle)}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {draft.academicYear} • Level {draft.level} • Sem {draft.semester} • {draft.sections.length} Sections
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadDraft(draft)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition"
                      >
                        Load into Editor
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePaper(draft.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-slate-200 dark:hover:bg-slate-800"
                        title="Delete Draft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDraftsDrawerOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
