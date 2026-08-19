import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  BookOpen,
  Calendar,
  Bookmark,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Download,
  Flame,
  Award,
  ChevronRight,
  Filter,
  Play,
  Layers,
  GraduationCap,
  Eye,
  Users,
} from 'lucide-react';
import { PastPaper } from '../../types';
import { cleanCourseTitle } from '../../utils/courseUtils';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    currentUniversity,
    universities,
    papers,
    materials,
    timetables,
    bookmarks,
    users,
    setActiveView,
    setActivePaper,
    openAiWithContext,
  } = useApp();

  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');

  // Filter papers for student's view
  const universityPapers = papers.filter(
    (p) => !p.isDisabled && p.status === 'PUBLISHED' && (!currentUniversity || p.universityId === currentUniversity.id)
  );

  const displayedPapers = universityPapers.filter((p) => {
    const levelMatch = selectedLevel === 'all' || p.level === selectedLevel;
    const semMatch = selectedSemester === 'all' || p.semester === selectedSemester;
    return levelMatch && semMatch;
  });

  // Calculate real-time metrics
  const totalPaperViews = universityPapers.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const enrolledStudents = users.filter(
    (u) => u.role === 'STUDENT' && !u.isDisabled && (!currentUniversity || u.universityId === currentUniversity.id)
  ).length;

  // Next upcoming exam
  const nextExam = timetables
    .filter((t) => !currentUniversity || t.universityId === currentUniversity.id)
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())[0];

  // Calculate dynamic countdown for next exam
  const [countdownStr, setCountdownStr] = useState('');
  useEffect(() => {
    if (!nextExam) return;
    const calculateTime = () => {
      const examTime = new Date(`${nextExam.examDate} 09:00:00`).getTime();
      const now = new Date().getTime();
      const diff = examTime - now;
      if (diff <= 0) {
        setCountdownStr('Today / In Progress');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setCountdownStr(`${days}d ${hours}h ${minutes}m remaining`);
    };
    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [nextExam]);

  const handleOpenPaper = (paper: PastPaper) => {
    setActivePaper(paper);
    setActiveView('paper-viewer');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome & Institutional Hero */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 p-6 rounded-3xl bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {currentUniversity?.name || 'UniPast Student Hub'}
            </span>
            <span className="text-xs text-slate-300">
              Level {currentUser.level || 200} • {currentUser.department || 'Applied Sciences'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Academic Revision Hub</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Welcome back, {currentUser.name}. Verified exam questions, step-by-step marking rubrics, and schedules are synchronized.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveView('timetable')}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            Exam Schedule
          </button>
          <button
            onClick={() => setActiveView('papers')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Practice Papers</span>
          </button>
          <button
            onClick={() => openAiWithContext({ topic: 'Exam Preparation Tips' })}
            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-400/30 px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Ask AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Metrics Row - 4 Real-time Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Exam Papers</p>
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{universityPapers.length}</h3>
          <div className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">Available to study</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Paper Views</p>
            <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{totalPaperViews.toLocaleString()}</h3>
          <div className="mt-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">Real-time student reads</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Study Guides</p>
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{materials.length}</h3>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Verified resources</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Enrolled Students</p>
            <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{enrolledStudents}</h3>
          <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">Active campus learners</div>
        </div>
      </div>

      {/* Grid Split: Recent Past Questions & Exam Countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Past Questions Container */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col shadow-xs">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">Recent Past Questions</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Verified marking schemes & step-by-step proofs</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Level Filter Tabs */}
              <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl text-xs">
                {(['all', 100, 200, 300, 400] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-2.5 py-1 rounded-lg transition text-[11px] font-bold ${
                      selectedLevel === lvl
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {lvl === 'all' ? 'All' : `L${lvl}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayedPapers.slice(0, 5).map((paper) => (
              <div
                key={paper.id}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{paper.courseCode}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {cleanCourseTitle(paper.courseTitle)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {paper.universityName || currentUniversity?.name || 'University Exam'} • {paper.academicYear} • Sem {paper.semester} • {paper.viewsCount || 0} views
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenPaper(paper)}
                    className="text-blue-600 dark:text-blue-400 text-xs font-bold bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 px-3 py-1.5 rounded-xl transition border border-blue-200 dark:border-blue-800/60"
                  >
                    Interactive Mode
                  </button>
                  <button
                    onClick={() => handleOpenPaper(paper)}
                    className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-xl transition"
                  >
                    Solutions
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-200 dark:border-slate-800 text-center">
            <button
              onClick={() => setActiveView('papers')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline transition"
            >
              Browse all {displayedPapers.length} past exam papers →
            </button>
          </div>
        </div>

        {/* Right 1 Col: Exam Countdown & Mock Exam Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white text-base">Exam Countdown</h2>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Timetable</span>
            </div>

            {/* Timeline entries */}
            <div className="space-y-4">
              {timetables.slice(0, 3).map((item, idx) => (
                <div
                  key={item.id}
                  className={`relative pl-6 pb-3 ${idx < 2 ? 'border-l-2 border-blue-500/30' : 'border-l-2 border-slate-200 dark:border-slate-800'}`}
                >
                  <div
                    className={`absolute top-0 -left-[7px] w-3 h-3 rounded-full ${
                      idx === 0
                        ? 'bg-blue-600 ring-4 ring-blue-500/20'
                        : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                  ></div>
                  <p className={`text-[11px] font-bold ${idx === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {idx === 0 ? countdownStr || item.examDate : item.examDate}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-900 dark:text-white font-bold mt-0.5">
                    {item.courseCode}: {cleanCourseTitle(item.courseTitle)}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Venue: {item.venue} • {item.startTime}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Mock Exam Callout */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60">
            <p className="text-xs text-blue-900 dark:text-blue-300 font-bold">Timed Revision Mode</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 mb-3 leading-relaxed">
              Practice under real examination conditions with live timers and complete marking schemes.
            </p>
            <button
              onClick={() => {
                if (displayedPapers[0]) handleOpenPaper(displayedPapers[0]);
                else setActiveView('papers');
              }}
              className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-xl text-xs font-bold text-white transition tracking-wider uppercase shadow-xs"
            >
              Start Practice Session
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Study Guides & Formula Cheat Sheets */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Recommended Study Guides & Formula Cheat Sheets</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified handouts, summaries, and lecture notes prepared by university departments
            </p>
          </div>
          <button
            onClick={() => setActiveView('materials')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All Materials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {materials.slice(0, 2).map((mat) => (
            <div
              key={mat.id}
              onClick={() => setActiveView('materials')}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500/50 cursor-pointer transition flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-black text-xs shrink-0">
                  {mat.fileFormat}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                      {mat.courseCode}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{mat.fileSize}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mt-1 line-clamp-1">
                    {mat.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {mat.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-slate-400 shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
