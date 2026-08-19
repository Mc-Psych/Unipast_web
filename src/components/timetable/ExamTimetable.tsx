import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Play,
  PlusCircle,
  AlertCircle,
  FileText,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { ExamSchedule } from '../../types';
import { cleanCourseTitle } from '../../utils/courseUtils';

export const ExamTimetable: React.FC = () => {
  const {
    currentUser,
    currentUniversity,
    selectedUniversityId,
    universities,
    timetables,
    papers,
    courses,
    addTimetable,
    setActivePaper,
    setActiveView,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter available courses for dropdown
  const relevantCourses = courses.filter(
    (c) => !c.isDisabled && (selectedUniversityId === 'all' || !currentUniversity || c.universityId === currentUniversity.id)
  );

  // Form State
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [isCustomCourse, setIsCustomCourse] = useState<boolean>(false);
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [examDate, setExamDate] = useState('2024-05-18');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('11:30 AM');
  const [venue, setVenue] = useState('Great Hall & Examination Complex');
  const [level, setLevel] = useState<100 | 200 | 300 | 400>(200);
  const [semester, setSemester] = useState<1 | 2>(1);

  // Handle course selection from dropdown
  const handleCourseSelect = (val: string) => {
    setSelectedCourseId(val);
    if (val === '__custom__') {
      setIsCustomCourse(true);
      setCourseCode('');
      setCourseTitle('');
      return;
    }

    setIsCustomCourse(false);
    const matched = courses.find((c) => c.id === val || c.code === val);
    if (matched) {
      setCourseCode(matched.code);
      setCourseTitle(cleanCourseTitle(matched.title));
      if (matched.level) setLevel(matched.level as 100 | 200 | 300 | 400);
      if (matched.semester) setSemester(matched.semester as 1 | 2);
    }
  };

  // Filter timetables
  const filteredTimetables = timetables
    .filter((item) => selectedUniversityId === 'all' || item.universityId === selectedUniversityId)
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  const handleCreateTimetable = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = courseCode.trim().toUpperCase();
    const finalTitle = cleanCourseTitle(courseTitle.trim());
    if (!finalCode || !finalTitle) return;

    addTimetable({
      universityId: currentUniversity?.id || universities[0]?.id || 'univ-htu',
      courseCode: finalCode,
      courseTitle: finalTitle,
      examDate,
      startTime,
      endTime,
      venue,
      level,
      semester,
      lecturer: 'Department Examination Officer',
    });

    setIsAddModalOpen(false);
    setSelectedCourseId('');
    setIsCustomCourse(false);
    setCourseCode('');
    setCourseTitle('');
  };

  const handlePracticePaper = (item: ExamSchedule) => {
    const matchedPaper = papers.find((p) => p.courseCode.toLowerCase() === item.courseCode.toLowerCase());
    if (matchedPaper) {
      setActivePaper(matchedPaper);
      setActiveView('paper-viewer');
    } else {
      setActiveView('papers');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Official Examination Timetable
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              {filteredTimetables.length} Scheduled Exams
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Confirmed date schedules, examination venues, and fast shortcuts to practice past papers.
          </p>
        </div>

        {currentUser.role !== 'STUDENT' && (
          <button
            onClick={() => {
              // Pre-select first course if available
              if (relevantCourses.length > 0 && !selectedCourseId) {
                const first = relevantCourses[0];
                setSelectedCourseId(first.id);
                setCourseCode(first.code);
                setCourseTitle(cleanCourseTitle(first.title));
                if (first.level) setLevel(first.level as 100 | 200 | 300 | 400);
                if (first.semester) setSemester(first.semester as 1 | 2);
                setIsCustomCourse(false);
              }
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-600/20 self-start sm:self-auto transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Schedule New Exam</span>
          </button>
        )}
      </div>

      {/* Timetable Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTimetables.map((item) => {
          const matchedUni = universities.find((u) => u.id === item.universityId);
          const hasPastPaper = papers.some(
            (p) => p.courseCode.toLowerCase() === item.courseCode.toLowerCase()
          );

          // Calculate countdown in days
          const examEpoch = new Date(`${item.examDate} ${item.startTime}`).getTime();
          const daysLeft = Math.ceil((examEpoch - new Date().getTime()) / (1000 * 60 * 60 * 24));

          return (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500/40 transition space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{matchedUni?.logo || '🎓'}</span>
                  <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {item.courseCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Level {item.level}</span>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    daysLeft <= 3
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 animate-pulse'
                      : daysLeft <= 14
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {daysLeft <= 0 ? 'Today' : `${daysLeft} days away`}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {cleanCourseTitle(item.courseTitle)}
                </h3>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold">{item.examDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>
                    {item.startTime} — {item.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>{item.venue}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {hasPastPaper ? 'Verified past papers on file' : 'Standard syllabus exam'}
                </span>

                <button
                  onClick={() => handlePracticePaper(item)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                >
                  <Play className="w-3 h-3" />
                  <span>Practice Questions</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Schedule University Exam</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Select course to auto-fill details</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTimetable} className="space-y-4 text-xs">
              {/* Course Selection Dropdown */}
              <div>
                <label className="block font-bold text-[10px] uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Select Course Code (Catalog) *
                </label>
                <select
                  value={isCustomCourse ? '__custom__' : selectedCourseId}
                  onChange={(e) => handleCourseSelect(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="" disabled>-- Choose Course Code --</option>
                  {relevantCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {cleanCourseTitle(c.title)} (Level {c.level})
                    </option>
                  ))}
                  <option value="__custom__">+ Enter Custom Course Code Manually...</option>
                </select>
              </div>

              {/* Custom Code Input if selected */}
              {isCustomCourse && (
                <div>
                  <label className="block font-bold text-[10px] uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Custom Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. CS 201"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Course Title - Auto-populated */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-[10px] uppercase text-slate-500 dark:text-slate-400">
                    Course Title {isCustomCourse ? '*' : '(Auto-Populated • Locked)'}
                  </label>
                  {!isCustomCourse && (
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      🔒 Read-Only
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  readOnly={!isCustomCourse}
                  value={cleanCourseTitle(courseTitle)}
                  onChange={(e) => isCustomCourse && setCourseTitle(cleanCourseTitle(e.target.value))}
                  placeholder="e.g. Data Structures & Algorithms"
                  className={`w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white transition ${
                    !isCustomCourse
                      ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 cursor-not-allowed select-none text-slate-600 dark:text-slate-400'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-[10px] uppercase text-slate-500 dark:text-slate-400">Level</label>
                    {!isCustomCourse && <span className="text-[9px] text-slate-400">Locked</span>}
                  </div>
                  <select
                    disabled={!isCustomCourse}
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value) as 100 | 200 | 300 | 400)}
                    className={`w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white ${
                      !isCustomCourse
                        ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 cursor-not-allowed text-slate-600 dark:text-slate-400'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none'
                    }`}
                  >
                    <option value={100}>Level 100</option>
                    <option value={200}>Level 200</option>
                    <option value={300}>Level 300</option>
                    <option value={400}>Level 400</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-[10px] uppercase text-slate-500 dark:text-slate-400">Semester</label>
                    {!isCustomCourse && <span className="text-[9px] text-slate-400">Locked</span>}
                  </div>
                  <select
                    disabled={!isCustomCourse}
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value) as 1 | 2)}
                    className={`w-full p-2.5 rounded-xl border font-bold text-slate-900 dark:text-white ${
                      !isCustomCourse
                        ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 cursor-not-allowed text-slate-600 dark:text-slate-400'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none'
                    }`}
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-[10px] uppercase text-slate-500 dark:text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[10px] uppercase text-slate-500 dark:text-slate-400 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[10px] uppercase text-slate-500 dark:text-slate-400 mb-1">End Time</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="11:30 AM"
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[10px] uppercase text-slate-500 dark:text-slate-400 mb-1">Exam Venue</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Great Hall & Examination Complex"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
