import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Bookmark,
  Share2,
  Printer,
  Play,
  Pause,
  RotateCcw,
  Award,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Eye,
  Check,
  FileDown,
  Layers,
  GraduationCap,
  Download,
  Image as ImageIcon,
  FileText,
  Loader2,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PastPaper, QuestionItem, SolutionStep, University } from '../../types';
import { cleanCourseTitle } from '../../utils/courseUtils';

// =========================================================================
// REUSABLE PRINTABLE EXAM PAPER SHEET (WITH SAFE INLINE HEX/RGB STYLING)
// =========================================================================
const ExamPaperSheet: React.FC<{
  paper: PastPaper;
  uni: University | undefined;
  withSolutions: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  isOffscreen?: boolean;
}> = ({ paper, uni, withSolutions, containerRef, isOffscreen }) => {
  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        borderColor: '#cbd5e1',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
      className={
        isOffscreen
          ? 'p-8 sm:p-12 space-y-8 max-w-4xl'
          : 'max-w-4xl mx-auto p-8 sm:p-12 bg-white text-slate-900 rounded-3xl border border-slate-300 shadow-xl space-y-8 print:p-0 print:border-0 print:shadow-none print:max-w-full'
      }
    >
      {/* Institutional Exam Header */}
      <div
        style={{ borderColor: '#0f172a', color: '#0f172a' }}
        className="text-center pb-6 border-b-2 space-y-1"
      >
        <div className="flex justify-center items-center mb-2">
          {uni?.logoUrl ? (
            <img
              src={uni.logoUrl}
              alt={uni.name}
              className="h-16 w-16 object-contain rounded-xl shadow-xs"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-4xl">{uni?.logo || '🎓'}</div>
          )}
        </div>
        <h2 style={{ color: '#0f172a' }} className="text-xl font-black uppercase tracking-wider">
          {uni?.fullName || uni?.name || 'UNIVERSITY EXAMINATION BOARD'}
        </h2>
        <p style={{ color: '#475569' }} className="text-xs uppercase tracking-widest font-bold">
          {uni?.motto || 'Excellence, Truth and Integrity'}
        </p>
        <h3 style={{ color: '#0f172a' }} className="text-sm font-bold mt-2">
          {paper.examType.toUpperCase()} — {paper.academicYear}
        </h3>
        <p style={{ color: '#1e293b' }} className="text-xs font-semibold">
          COURSE: {paper.courseCode} — {cleanCourseTitle(paper.courseTitle)} (LEVEL {paper.level})
        </p>
        <p style={{ color: '#334155' }} className="text-xs font-mono mt-1">
          TIME ALLOWED: {paper.durationMinutes} MINUTES | TOTAL MARKS: {paper.totalMarks}
        </p>
        {withSolutions && (
          <div
            style={{
              backgroundColor: '#dcfce7',
              color: '#14532d',
              borderColor: '#86efac',
            }}
            className="inline-block mt-2 px-3 py-1 border rounded-lg text-xs font-black uppercase tracking-wider"
          >
            OFFICIAL MARKING SCHEME & SOLUTION GUIDE
          </div>
        )}
      </div>

      {/* Student Candidate Details Block */}
      <div
        style={{ borderColor: '#cbd5e1', color: '#0f172a' }}
        className="grid grid-cols-2 gap-4 p-4 rounded-xl border text-xs"
      >
        <div>
          <span className="font-bold">CANDIDATE INDEX NO:</span> ___________________
        </div>
        <div>
          <span className="font-bold">SIGNATURE / DATE:</span> ___________________
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-1 text-xs" style={{ color: '#0f172a' }}>
        <p className="font-bold uppercase">INSTRUCTIONS TO CANDIDATES:</p>
        <ol style={{ color: '#334155' }} className="list-decimal list-inside space-y-0.5">
          {paper.instructions.map((inst, i) => (
            <li key={i}>{inst}</li>
          ))}
        </ol>
      </div>

      {/* Sections and Questions */}
      <div className="space-y-8 pt-4">
        {paper.sections.map((sec) => (
          <div key={sec.id} className="space-y-4">
            <div style={{ borderColor: '#cbd5e1' }} className="border-b pb-1">
              <h4 style={{ color: '#0f172a' }} className="font-black text-sm uppercase">{sec.title}</h4>
              <p style={{ color: '#475569' }} className="text-xs italic">{sec.instructions}</p>
            </div>

            <div className="space-y-6">
              {sec.questions.map((q) => (
                <div
                  key={q.id}
                  style={{ borderColor: '#e2e8f0', color: '#0f172a' }}
                  className="space-y-2 text-xs border-b pb-4 last:border-b-0"
                >
                  <div className="flex justify-between font-bold text-sm" style={{ color: '#0f172a' }}>
                    <span>QUESTION {q.number}</span>
                    <span>[{q.marks} MARKS]</span>
                  </div>
                  <p
                    style={{ color: '#1e293b' }}
                    className="leading-relaxed whitespace-pre-line font-serif text-sm"
                  >
                    {q.questionText}
                  </p>
                  {q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 pt-1 font-serif">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="text-xs" style={{ color: '#1e293b' }}>
                          <span className="font-bold">({String.fromCharCode(65 + oIdx)})</span> {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Solutions if enabled */}
                  {withSolutions && (
                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        borderColor: '#e2e8f0',
                        color: '#0f172a',
                      }}
                      className="mt-3 p-3 border rounded-xl space-y-2 text-xs"
                    >
                      <div style={{ color: '#047857' }} className="font-bold uppercase tracking-wider">
                        Model Answer & Marking Breakdown
                      </div>
                      {q.correctOptionIndex !== undefined && q.options && (
                        <p style={{ color: '#065f46' }} className="font-semibold">
                          Correct Answer: ({String.fromCharCode(65 + q.correctOptionIndex)}) {q.options[q.correctOptionIndex]}
                        </p>
                      )}
                      <p style={{ color: '#334155' }} className="leading-relaxed font-serif">
                        {q.finalAnswer}
                      </p>
                      {q.solutionSteps && q.solutionSteps.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <p style={{ color: '#64748b' }} className="font-bold text-[11px] uppercase">
                            Step-by-Step Marking Steps:
                          </p>
                          {q.solutionSteps.map((step) => (
                            <div
                              key={step.stepNumber}
                              style={{
                                borderLeftColor: '#059669',
                                color: '#334155',
                              }}
                              className="pl-3 border-l-2 text-xs"
                            >
                              <span className="font-bold" style={{ color: '#0f172a' }}>
                                Step {step.stepNumber} ({step.title}):
                              </span>{' '}
                              {step.content}
                              {step.formula && (
                                <div
                                  style={{
                                    backgroundColor: '#ffffff',
                                    borderColor: '#e2e8f0',
                                    color: '#0f172a',
                                  }}
                                  className="font-mono p-1 rounded border text-[11px] my-0.5"
                                >
                                  {step.formula}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{ borderColor: '#cbd5e1', color: '#94a3b8' }}
        className="text-center pt-8 border-t text-xs font-bold uppercase tracking-widest"
      >
        *** END OF EXAMINATION PAPER ***
      </div>
    </div>
  );
};

export const PastPaperViewer: React.FC = () => {
  const {
    activePaper,
    setActiveView,
    universities,
    toggleBookmark,
    isBookmarked,
    openAiWithContext,
    recordPaperView,
    recordPaperDownload,
    recordSolutionRead,
    recordPracticeCompletion,
  } = useApp();

  // Track paper view on mount
  useEffect(() => {
    if (activePaper?.id) {
      recordPaperView(activePaper.id);
    }
  }, [activePaper?.id]);

  if (!activePaper) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No exam paper selected</h3>
        <button
          onClick={() => setActiveView('papers')}
          className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          Return to Exam Papers
        </button>
      </div>
    );
  }

  const paperUni = universities.find((u) => u.id === activePaper.universityId);

  // Viewer modes: 'study' (solution breakdown), 'practice' (timer & mock test), 'printable' (clean exam sheet)
  const [viewMode, setViewMode] = useState<'study' | 'practice' | 'printable'>('study');

  // Printable element reference for PDF and JPEG rendering
  const printableRef = useRef<HTMLDivElement>(null);
  const offscreenPrintableRef = useRef<HTMLDivElement>(null);

  // Export and download states
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportType, setExportType] = useState<'pdf' | 'jpeg' | 'docx' | null>(null);
  const [includeSolutionsInPrint, setIncludeSolutionsInPrint] = useState<boolean>(false);
  const [exportWithSolutions, setExportWithSolutions] = useState<boolean>(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // Question selection in study/practice mode
  const allQuestions: { sectionTitle: string; question: QuestionItem; sectionIndex: number }[] = [];
  activePaper.sections.forEach((section, sIdx) => {
    section.questions.forEach((q) => {
      allQuestions.push({ sectionTitle: section.title, question: q, sectionIndex: sIdx });
    });
  });

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const currentQObj = allQuestions[selectedQuestionIndex] || allQuestions[0];

  // Solution Step visibility toggles (mapped by questionId)
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});

  // Practice Mode state
  const [timerSeconds, setTimerSeconds] = useState<number>(activePaper.durationMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [selfGradingScores, setSelfGradingScores] = useState<Record<string, number>>({});

  // Countdown timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      handleSubmitPracticeExam();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : ''}${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSolution = (qId: string) => {
    setRevealedSolutions((prev) => {
      const willReveal = !prev[qId];
      if (willReveal) {
        recordSolutionRead(activePaper.id, qId);
      }
      return { ...prev, [qId]: willReveal };
    });
  };

  const toggleHint = (qId: string) => {
    setRevealedHints((prev) => {
      const willReveal = !prev[qId];
      if (willReveal) {
        recordSolutionRead(activePaper.id, qId);
      }
      return { ...prev, [qId]: willReveal };
    });
  };

  const handleSubmitPracticeExam = () => {
    setIsTimerRunning(false);
    setIsExamSubmitted(true);
    recordPracticeCompletion(activePaper.id);
    // Trigger celebratory confetti for completing revision
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // AI Explanation Modal Trigger
  const handleAskAiForQuestion = (q: QuestionItem, step?: SolutionStep) => {
    openAiWithContext({
      questionText: q.questionText,
      courseCode: activePaper.courseCode,
      topic: q.topic || 'Exam Question Solution Step',
    });
  };

  // -------------------------------------------------------------------------
  // EXPORT HANDLERS: PDF, JPEG & PRINT (WITH OKLCH COLOR SANITIZATION)
  // -------------------------------------------------------------------------
  const captureElementToCanvas = async (targetElement: HTMLElement) => {
    return await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: targetElement.scrollWidth || 800,
      onclone: (clonedDoc, clonedElement) => {
        // 1. Force light background and remove shadows in cloned document
        const styleOverride = clonedDoc.createElement('style');
        styleOverride.innerHTML = `
          *, *::before, *::after {
            box-shadow: none !important;
            text-shadow: none !important;
          }
        `;
        clonedDoc.head.appendChild(styleOverride);

        // 2. Translate any oklch(...) color strings to standard RGB using browser 2D canvas context
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 1;
        tempCanvas.height = 1;
        const ctx = tempCanvas.getContext('2d');

        const toSafeRgb = (colorVal: string, fallback: string): string => {
          if (!colorVal || typeof colorVal !== 'string') return fallback;
          if (!colorVal.includes('oklch') && !colorVal.includes('color(')) return colorVal;
          try {
            if (ctx) {
              ctx.fillStyle = '#000000';
              ctx.fillStyle = colorVal;
              return ctx.fillStyle;
            }
          } catch {
            // fallback
          }
          return fallback;
        };

        const sanitizeEl = (el: HTMLElement) => {
          try {
            const comp = window.getComputedStyle(el);
            if (comp.color && comp.color.includes('oklch')) {
              el.style.color = toSafeRgb(comp.color, '#0f172a');
            }
            if (comp.backgroundColor && comp.backgroundColor.includes('oklch')) {
              el.style.backgroundColor = toSafeRgb(comp.backgroundColor, '#ffffff');
            }
            if (comp.borderTopColor && comp.borderTopColor.includes('oklch')) {
              el.style.borderTopColor = toSafeRgb(comp.borderTopColor, '#cbd5e1');
            }
            if (comp.borderRightColor && comp.borderRightColor.includes('oklch')) {
              el.style.borderRightColor = toSafeRgb(comp.borderRightColor, '#cbd5e1');
            }
            if (comp.borderBottomColor && comp.borderBottomColor.includes('oklch')) {
              el.style.borderBottomColor = toSafeRgb(comp.borderBottomColor, '#cbd5e1');
            }
            if (comp.borderLeftColor && comp.borderLeftColor.includes('oklch')) {
              el.style.borderLeftColor = toSafeRgb(comp.borderLeftColor, '#cbd5e1');
            }
            if (comp.outlineColor && comp.outlineColor.includes('oklch')) {
              el.style.outlineColor = toSafeRgb(comp.outlineColor, '#3b82f6');
            }
            if (comp.textDecorationColor && comp.textDecorationColor.includes('oklch')) {
              el.style.textDecorationColor = toSafeRgb(comp.textDecorationColor, '#0f172a');
            }
            if (comp.boxShadow && comp.boxShadow.includes('oklch')) {
              el.style.boxShadow = 'none';
            }
          } catch {
            // Ignore node style reading errors
          }
        };

        sanitizeEl(clonedElement);
        const children = clonedElement.querySelectorAll('*');
        children.forEach((child) => {
          if (child instanceof HTMLElement) {
            sanitizeEl(child);
          }
        });
      },
    });
  };

  const handleDownloadPdf = async (withSolutions: boolean = includeSolutionsInPrint) => {
    setIsExporting(true);
    setExportType('pdf');
    setIsDownloadMenuOpen(false);

    try {
      setExportWithSolutions(withSolutions);
      if (viewMode === 'printable') {
        setIncludeSolutionsInPrint(withSolutions);
      }
      // Wait for state update to settle
      await new Promise((resolve) => setTimeout(resolve, 150));

      const targetElement = (viewMode === 'printable' && printableRef.current)
        ? printableRef.current
        : offscreenPrintableRef.current || printableRef.current;

      if (!targetElement) {
        throw new Error('Printable element not found');
      }

      const canvas = await captureElementToCanvas(targetElement);

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      const cleanCode = activePaper.courseCode.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanYear = activePaper.academicYear.replace(/[^a-zA-Z0-9]/g, '_');
      const suffix = withSolutions ? 'Complete_Solutions' : 'Exam_Question_Paper';
      pdf.save(`${cleanCode}_${cleanYear}_${suffix}.pdf`);

      recordPaperDownload(activePaper.id, withSolutions);
      setExportSuccessMessage('PDF downloaded successfully!');
      setTimeout(() => setExportSuccessMessage(null), 3500);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Unable to generate PDF directly. You can also print the page to PDF via your browser.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const handleDownloadJpeg = async () => {
    setIsExporting(true);
    setExportType('jpeg');
    setIsDownloadMenuOpen(false);

    try {
      setExportWithSolutions(includeSolutionsInPrint);
      await new Promise((resolve) => setTimeout(resolve, 150));

      const targetElement = (viewMode === 'printable' && printableRef.current)
        ? printableRef.current
        : offscreenPrintableRef.current || printableRef.current;

      if (!targetElement) {
        throw new Error('Printable element not found');
      }

      const canvas = await captureElementToCanvas(targetElement);

      const cleanCode = activePaper.courseCode.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanYear = activePaper.academicYear.replace(/[^a-zA-Z0-9]/g, '_');
      const suffix = includeSolutionsInPrint ? 'With_Solutions' : 'Exam_Paper';

      const link = document.createElement('a');
      link.download = `${cleanCode}_${cleanYear}_${suffix}.jpeg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();

      recordPaperDownload(activePaper.id, includeSolutionsInPrint);
      setExportSuccessMessage('JPEG image downloaded successfully!');
      setTimeout(() => setExportSuccessMessage(null), 3500);
    } catch (err) {
      console.error('JPEG export failed:', err);
      alert('Unable to generate JPEG image. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const handleDownloadDocx = () => {
    setIsExporting(true);
    setExportType('docx');
    setIsDownloadMenuOpen(false);

    try {
      const cleanCode = activePaper.courseCode.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanYear = activePaper.academicYear.replace(/[^a-zA-Z0-9]/g, '_');
      const suffix = includeSolutionsInPrint ? 'With_Solutions' : 'Exam_Questions';

      let docContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${activePaper.courseCode} ${activePaper.courseTitle}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.5; padding: 20px; }
          h1 { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 2px; }
          h2 { font-size: 12pt; text-align: center; color: #475569; margin-top: 0; }
          h3 { font-size: 11pt; font-weight: bold; margin-top: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; }
          .header-box { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; }
          .meta { font-size: 10pt; color: #334155; margin: 3px 0; }
          .question-box { margin-bottom: 15px; padding: 10px; background-color: #f8fafc; border-left: 3px solid #6366f1; }
          .q-title { font-weight: bold; color: #0f172a; }
          .solution-box { margin-top: 8px; padding: 8px; background-color: #f0fdf4; border-left: 3px solid #22c55e; font-size: 10pt; }
        </style>
        </head>
        <body>
          <div class="header-box">
            <h1>${paperUni?.fullName || paperUni?.name || 'GHANA UNIVERSITY EXAMINATION BOARD'}</h1>
            <h2>${activePaper.examType.toUpperCase()} — ${activePaper.academicYear}</h2>
            <div class="meta"><strong>COURSE:</strong> ${activePaper.courseCode} — ${activePaper.courseTitle} (LEVEL ${activePaper.level})</div>
            <div class="meta"><strong>DURATION:</strong> ${activePaper.durationMinutes} MINUTES | <strong>TOTAL MARKS:</strong> ${activePaper.totalMarks}</div>
            ${includeSolutionsInPrint ? '<div style="color: #16a34a; font-weight: bold; margin-top: 5px;">[ OFFICIAL MARKING SCHEME & MODEL SOLUTIONS ]</div>' : ''}
          </div>

          <div style="margin-bottom: 15px;">
            <strong>INSTRUCTIONS TO CANDIDATES:</strong>
            <ol>
              ${activePaper.instructions.map((inst) => `<li>${inst}</li>`).join('')}
            </ol>
          </div>

          ${activePaper.sections
            .map(
              (sec) => `
            <h3>${sec.title.toUpperCase()} (${sec.marks} MARKS)</h3>
            <p style="font-style: italic; color: #64748b;">${sec.instructions}</p>
            ${sec.questions
              .map(
                (q) => `
              <div class="question-box">
                <div class="q-title">QUESTION ${q.number} [${q.marks} MARKS]</div>
                <p>${q.questionText.replace(/\n/g, '<br/>')}</p>
                ${
                  q.options
                    ? `<ul>${q.options.map((opt) => `<li>${opt}</li>`).join('')}</ul>`
                    : ''
                }
                ${
                  includeSolutionsInPrint && q.solutionSteps && q.solutionSteps.length > 0
                    ? `
                  <div class="solution-box">
                    <strong>MODEL SOLUTION:</strong>
                    ${q.solutionSteps
                      .map(
                        (s) => `
                      <p><strong>Step ${s.stepNumber} (${s.title}):</strong> ${s.content.replace(
                          /\n/g,
                          '<br/>'
                        )} ${s.formulaOrCode ? `<code>${s.formulaOrCode}</code>` : ''}</p>
                    `
                      )
                      .join('')}
                  </div>
                `
                    : ''
                }
              </div>
            `
              )
              .join('')}
          `
            )
            .join('')}
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff' + docContent], {
        type: 'application/msword;charset=utf-8',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${cleanCode}_${cleanYear}_${suffix}.docx`;
      link.click();
      URL.revokeObjectURL(link.href);

      recordPaperDownload(activePaper.id, includeSolutionsInPrint);
      setExportSuccessMessage('Word Document (DOCX) downloaded successfully!');
      setTimeout(() => setExportSuccessMessage(null), 3500);
    } catch (err) {
      console.error('DOCX export failed:', err);
      alert('Unable to generate DOCX file.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const handleNativePrint = () => {
    setIsDownloadMenuOpen(false);
    recordPaperDownload(activePaper.id, includeSolutionsInPrint);
    if (viewMode !== 'printable') {
      setViewMode('printable');
      setTimeout(() => {
        window.print();
      }, 300);
    } else {
      window.print();
    }
  };

  const isPaperSaved = isBookmarked('paper', activePaper.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveView('papers')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Past Papers List</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('study')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                viewMode === 'study'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Study & Solutions</span>
            </button>

            <button
              onClick={() => {
                setViewMode('practice');
                setIsTimerRunning(true);
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                viewMode === 'practice'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timed Practice Exam</span>
            </button>

            <button
              onClick={() => setViewMode('printable')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                viewMode === 'printable'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Printable View</span>
            </button>
          </div>

          {/* Download & Export Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
              disabled={isExporting}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Exporting ({exportType?.toUpperCase()})...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export / Print</span>
                  <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>

            {isDownloadMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Download Options
                </div>

                <button
                  onClick={() => handleDownloadPdf(false)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                >
                  <FileDown className="w-4 h-4 text-red-500" />
                  <div>
                    <div className="font-bold">Download Exam PDF</div>
                    <div className="text-[10px] text-slate-400">Questions only (clean exam sheet)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleDownloadPdf(true)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                >
                  <FileCheck className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="font-bold">Download Full Solutions PDF</div>
                    <div className="text-[10px] text-slate-400">Questions + step-by-step solutions</div>
                  </div>
                </button>

                <button
                  onClick={handleDownloadDocx}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-bold">Download Word (DOCX)</div>
                    <div className="text-[10px] text-slate-400">Editable Word document</div>
                  </div>
                </button>

                <button
                  onClick={handleDownloadJpeg}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                >
                  <ImageIcon className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-bold">Download Image (JPEG)</div>
                    <div className="text-[10px] text-slate-400">High-resolution single image</div>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  onClick={handleNativePrint}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                >
                  <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <div>
                    <div className="font-bold">Print Official Exam Sheet</div>
                    <div className="text-[10px] text-slate-400">Opens browser system print dialog</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() =>
              toggleBookmark({
                targetType: 'paper',
                targetId: activePaper.id,
                title: `${activePaper.courseCode}: ${cleanCourseTitle(activePaper.courseTitle)} (${activePaper.academicYear})`,
                courseCode: activePaper.courseCode,
                universityId: activePaper.universityId,
              })
            }
            className={`p-2 rounded-xl border transition ${
              isPaperSaved
                ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 text-amber-600'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
            title={isPaperSaved ? 'Bookmarked' : 'Save paper'}
          >
            <Bookmark className={`w-4 h-4 ${isPaperSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {exportSuccessMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-200 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{exportSuccessMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. STUDY MODE (Step-by-step interactive solution breakdown) */}
      {/* ========================================================================= */}
      {viewMode === 'study' && (
        <div className="space-y-6">
          {/* Paper Header Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{paperUni?.logo || '🎓'}</span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    {paperUni?.name || 'University Examination Portal'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Level {activePaper.level} • Semester {activePaper.semester}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {activePaper.courseCode}: {cleanCourseTitle(activePaper.courseTitle)}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activePaper.examType} • Academic Year {activePaper.academicYear} • Total Marks: {activePaper.totalMarks} ({activePaper.durationMinutes} Minutes)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAiWithContext({ topic: cleanCourseTitle(activePaper.courseTitle), courseCode: activePaper.courseCode })}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explain Paper with AI</span>
                </button>
              </div>
            </div>

            {/* General Instructions Accordion */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Official Examination Instructions:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                {activePaper.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section & Question Browser Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar: Question Navigator */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Question Index ({allQuestions.length})
                  </h3>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    All Solutions Verified
                  </span>
                </div>

                <div className="space-y-2">
                  {activePaper.sections.map((section, sIdx) => (
                    <div key={section.id} className="space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate">
                        {section.title} ({section.marks} Marks)
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {section.questions.map((q) => {
                          const globalIdx = allQuestions.findIndex((item) => item.question.id === q.id);
                          const isCurrent = selectedQuestionIndex === globalIdx;
                          const hasRevealed = !!revealedSolutions[q.id];

                          return (
                            <button
                              key={q.id}
                              onClick={() => setSelectedQuestionIndex(globalIdx)}
                              className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 ${
                                isCurrent
                                  ? 'bg-blue-600 text-white shadow-xs scale-102'
                                  : hasRevealed
                                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              <span>Q{q.number}</span>
                              <span className="text-[9px] font-normal opacity-80">{q.marks}M</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick AI Study Buddy Widget */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs">
                <div className="flex items-center gap-2 font-bold text-indigo-950 dark:text-indigo-200">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Interactive Marking Scheme</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed text-[11px]">
                  Examiners award partial marks for every structured step. Click "Reveal Verified Solution" on any question to examine point allocations.
                </p>
              </div>
            </div>

            {/* Right: Active Question Detail with Step-by-Step Marking Breakdown */}
            <div className="lg:col-span-3 space-y-5">
              {currentQObj && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                  {/* Question Header & Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold px-3 py-1 rounded-xl bg-blue-600 text-white">
                        Question {currentQObj.question.number}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {currentQObj.question.marks} Marks
                      </span>
                      {currentQObj.question.difficulty && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            currentQObj.question.difficulty === 'Easy'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : currentQObj.question.difficulty === 'Medium'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {currentQObj.question.difficulty}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAskAiForQuestion(currentQObj.question)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs hover:bg-indigo-100 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>AI Tutor Breakdown</span>
                      </button>
                    </div>
                  </div>

                  {/* Section Title Context */}
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {currentQObj.sectionTitle}
                  </p>

                  {/* Question Prompt */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white font-medium text-sm leading-relaxed whitespace-pre-line">
                    {currentQObj.question.questionText}
                  </div>

                  {/* MCQ Options (if questionType is MCQ) */}
                  {currentQObj.question.options && currentQObj.question.options.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Multiple Choice Options:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentQObj.question.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                              revealedSolutions[currentQObj.question.id] && opt === currentQObj.question.correctAnswer
                                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-400 text-emerald-800 dark:text-emerald-300'
                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span>{opt}</span>
                            {revealedSolutions[currentQObj.question.id] && opt === currentQObj.question.correctAnswer && (
                              <Check className="w-4 h-4 text-emerald-600 ml-auto" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Examiner Hint Accordion */}
                  {currentQObj.question.keyTakeaway && (
                    <div>
                      <button
                        onClick={() => toggleHint(currentQObj.question.id)}
                        className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 hover:underline"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>
                          {revealedHints[currentQObj.question.id] ? 'Hide Study Hint' : 'Need a Hint? (Key Formula & Concept)'}
                        </span>
                      </button>
                      {revealedHints[currentQObj.question.id] && (
                        <div className="mt-2 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
                          <strong>💡 Concept Takeaway:</strong> {currentQObj.question.keyTakeaway}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Solution Step-by-Step Toggle & Breakdown */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleSolution(currentQObj.question.id)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-xs ${
                          revealedSolutions[currentQObj.question.id]
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {revealedSolutions[currentQObj.question.id]
                            ? 'Hide Solution Marking Scheme'
                            : 'Reveal Verified Step-by-Step Solution'}
                        </span>
                        {revealedSolutions[currentQObj.question.id] ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {revealedSolutions[currentQObj.question.id] && (
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {currentQObj.question.solutionSteps.length} Step Breakdown
                        </span>
                      )}
                    </div>

                    {/* Step by Step Breakdown Cards */}
                    {revealedSolutions[currentQObj.question.id] && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        {currentQObj.question.solutionSteps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                                  {step.stepNumber}
                                </span>
                                <h4 className="font-bold text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
                                  {step.title}
                                </h4>
                              </div>

                              <div className="flex items-center gap-2">
                                {step.marksAwarded && (
                                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                                    +{step.marksAwarded} Marks
                                  </span>
                                )}
                                <button
                                  onClick={() => handleAskAiForQuestion(currentQObj.question, step)}
                                  className="p-1 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-[11px] flex items-center gap-1 font-semibold"
                                  title="Explain this specific step"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Explain</span>
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed pl-8">
                              {step.content}
                            </p>

                            {step.formulaOrCode && (
                              <div className="ml-8 mt-2 p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner">
                                <pre>{step.formulaOrCode}</pre>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Examiner Notes & Scoring Criteria */}
                        {currentQObj.question.examinerNotes && (
                          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-950 dark:text-blue-200 space-y-1">
                            <p className="font-bold flex items-center gap-1.5 text-blue-900 dark:text-blue-300">
                              <Award className="w-4 h-4 text-blue-600" />
                              <span>Examiner's Marking Criteria & Pitfall Notes:</span>
                            </p>
                            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                              {currentQObj.question.examinerNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Navigation footer between questions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      disabled={selectedQuestionIndex === 0}
                      onClick={() => setSelectedQuestionIndex((prev) => prev - 1)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 transition"
                    >
                      ← Previous Question
                    </button>

                    <button
                      disabled={selectedQuestionIndex === allQuestions.length - 1}
                      onClick={() => setSelectedQuestionIndex((prev) => prev + 1)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1"
                    >
                      <span>Next Question</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TIMED PRACTICE / EXAM MODE */}
      {/* ========================================================================= */}
      {viewMode === 'practice' && (
        <div className="space-y-6">
          {/* Practice Floating Timer Header */}
          <div className="sticky top-18 z-30 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  Timed Practice Examination Mode
                </p>
                <h3 className="font-extrabold text-sm sm:text-base">
                  {activePaper.courseCode}: {activePaper.courseTitle}
                </h3>
              </div>
            </div>

            {/* Countdown Display & Controls */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-1.5 rounded-xl bg-black/40 border border-white/10 font-mono text-lg font-black text-amber-300">
                {formatTimer(timerSeconds)}
              </div>

              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  setTimerSeconds(activePaper.durationMinutes * 60);
                  setIsTimerRunning(false);
                  setIsExamSubmitted(false);
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {!isExamSubmitted ? (
                <button
                  onClick={handleSubmitPracticeExam}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/30"
                >
                  Submit & Evaluate
                </button>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-400/40">
                  Submitted ✓
                </span>
              )}
            </div>
          </div>

          {/* Exam Questions Form */}
          <div className="space-y-6">
            {activePaper.sections.map((section) => (
              <div
                key={section.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6"
              >
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{section.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{section.instructions}</p>
                </div>

                <div className="space-y-6">
                  {section.questions.map((q) => (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Question {q.number}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                          {q.marks} Marks
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line">
                        {q.questionText}
                      </p>

                      {/* Input for Answer (MCQ options or Scratchpad text) */}
                      {q.options && q.options.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Select Answer:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, i) => (
                              <label
                                key={i}
                                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition ${
                                  userAnswers[q.id] === opt
                                    ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-900 dark:text-blue-200'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  value={opt}
                                  checked={userAnswers[q.id] === opt}
                                  onChange={() => setUserAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                                  className="text-blue-600 focus:ring-blue-500"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                            Your Working / Solution Draft:
                          </label>
                          <textarea
                            rows={4}
                            value={userAnswers[q.id] || ''}
                            onChange={(e) => setUserAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                            placeholder="Write your step-by-step derivation, formula substitutions, or code here..."
                            className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                        </div>
                      )}

                      {/* If Submitted: Self-Grading Score Card with Official Solution */}
                      {isExamSubmitted && (
                        <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" />
                              Official Marking Criteria
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-500">Self Grade:</span>
                              <select
                                value={selfGradingScores[q.id] ?? q.marks}
                                onChange={(e) =>
                                  setSelfGradingScores((prev) => ({ ...prev, [q.id]: Number(e.target.value) }))
                                }
                                className="py-1 px-2 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                              >
                                {Array.from({ length: q.marks + 1 }).map((_, m) => (
                                  <option key={m} value={m}>
                                    {m} / {q.marks} Marks
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs">
                            {q.solutionSteps.map((step) => (
                              <div key={step.stepNumber} className="pl-3 border-l-2 border-emerald-500 text-slate-700 dark:text-slate-300">
                                <strong>Step {step.stepNumber} ({step.title}):</strong> {step.content}
                              </div>
                            ))}
                          </div>
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

      {/* ========================================================================= */}
      {/* 3. PRINTABLE / FORMAL PDF VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'printable' && (
        <div className="space-y-6">
          {/* Printable Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={includeSolutionsInPrint}
                  onChange={(e) => setIncludeSolutionsInPrint(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Include step-by-step solutions & answer key in sheet</span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleDownloadPdf(includeSolutionsInPrint)}
                disabled={isExporting}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition disabled:opacity-50"
              >
                {isExporting && exportType === 'pdf' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileDown className="w-3.5 h-3.5" />
                )}
                <span>Download PDF</span>
              </button>

              <button
                onClick={handleDownloadJpeg}
                disabled={isExporting}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition disabled:opacity-50"
              >
                {isExporting && exportType === 'jpeg' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5" />
                )}
                <span>Download JPEG</span>
              </button>

              <button
                onClick={handleNativePrint}
                className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-2 shadow-xs transition hover:opacity-90"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>System Print</span>
              </button>
            </div>
          </div>

          {/* Printable Exam Paper Container (Captured for PDF/JPEG) */}
          <ExamPaperSheet
            paper={activePaper}
            uni={paperUni}
            withSolutions={includeSolutionsInPrint}
            containerRef={printableRef}
          />
        </div>
      )}

      {/* Always-mounted off-screen container for 100% reliable PDF and JPEG export from any mode */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '800px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -9999,
        }}
      >
        <ExamPaperSheet
          paper={activePaper}
          uni={paperUni}
          withSolutions={exportWithSolutions}
          containerRef={offscreenPrintableRef}
          isOffscreen
        />
      </div>
    </div>
  );
};
