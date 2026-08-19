import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Search,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  PlusCircle,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Layers,
  Clock,
  Award,
  Printer,
  Download,
} from 'lucide-react';
import { PastPaper } from '../../types';
import { cleanCourseTitle } from '../../utils/courseUtils';

export const PastPaperList: React.FC = () => {
  const {
    currentUser,
    currentUniversity,
    selectedUniversityId,
    setSelectedUniversityId,
    universities,
    papers,
    updatePaper,
    deletePaper,
    bookmarks,
    toggleBookmark,
    isBookmarked,
    setActivePaper,
    setActiveView,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const isStaff = currentUser.role === 'SCHOOL_ADMIN' || currentUser.role === 'SYSTEM_ADMIN';

  // Tabs: 'all' | 'published' | 'drafts' | 'bookmarked'
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts' | 'bookmarked'>('all');

  // Filters state
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [semesterFilter, setSemesterFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Filter papers
  const filteredPapers = papers.filter((paper) => {
    // School filter
    if (selectedUniversityId !== 'all' && paper.universityId !== selectedUniversityId) {
      return false;
    }
    // Tab filter
    if (activeTab === 'published' && paper.status === 'DRAFT') {
      return false;
    }
    if (activeTab === 'drafts' && paper.status !== 'DRAFT') {
      return false;
    }
    if (activeTab === 'bookmarked' && !isBookmarked('paper', paper.id)) {
      return false;
    }
    // Non-staff students cannot see DRAFT papers
    if (!isStaff && paper.status === 'DRAFT') {
      return false;
    }
    // Level filter
    if (levelFilter !== 'all' && paper.level.toString() !== levelFilter) {
      return false;
    }
    // Semester filter
    if (semesterFilter !== 'all' && paper.semester.toString() !== semesterFilter) {
      return false;
    }
    // Year filter
    if (yearFilter !== 'all' && paper.academicYear !== yearFilter) {
      return false;
    }
    // Difficulty filter
    if (difficultyFilter !== 'all' && paper.difficulty !== difficultyFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchCode = paper.courseCode.toLowerCase().includes(q);
      const matchTitle = paper.courseTitle.toLowerCase().includes(q);
      const matchYear = paper.academicYear.toLowerCase().includes(q);
      const matchTags = paper.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchCode && !matchTitle && !matchYear && !matchTags) return false;
    }
    return true;
  });

  const handleOpenPaper = (paper: PastPaper) => {
    setActivePaper(paper);
    setActiveView('paper-viewer');
  };

  const handleEditPaper = (paper: PastPaper) => {
    setActivePaper(paper);
    setActiveView('digitizer');
  };

  const handleTogglePublish = (paper: PastPaper) => {
    const newStatus = paper.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    updatePaper(paper.id, { status: newStatus });
  };

  // Drafts count for admin
  const draftsCount = papers.filter(
    (p) =>
      p.status === 'DRAFT' &&
      (currentUser.role === 'SYSTEM_ADMIN' || p.universityId === currentUser.universityId)
  ).length;

  const publishedCount = papers.filter((p) => p.status === 'PUBLISHED').length;
  const bookmarkedCount = papers.filter((p) => isBookmarked('paper', p.id)).length;

  // Get distinct academic years for filter dropdown
  const academicYears = Array.from(new Set(papers.map((p) => p.academicYear)));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              University Past Examination Papers
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
              {filteredPapers.length} Papers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access past semester papers with verified solutions, marking scheme step breakdowns, and timed mock exam modes.
          </p>
        </div>

        {isStaff && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setActivePaper(null);
                setActiveView('digitizer');
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 self-start sm:self-auto transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Digitize / Upload Paper</span>
            </button>
          </div>
        )}
      </div>

      {/* Scope Navigation Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>All Papers ({papers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('published')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'published'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Published ({publishedCount})</span>
        </button>

        {isStaff && (
          <button
            onClick={() => setActiveTab('drafts')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'drafts'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Drafts & Pending Uploads ({draftsCount})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('bookmarked')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'bookmarked'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>My Bookmarks ({bookmarkedCount})</span>
        </button>
      </div>

      {/* Filter Bar & Search controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course code, title, topic or tags (e.g. CS 201, Normalization, Trees)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Clear All Filters */}
          {(levelFilter !== 'all' || semesterFilter !== 'all' || yearFilter !== 'all' || difficultyFilter !== 'all') && (
            <button
              onClick={() => {
                setLevelFilter('all');
                setSemesterFilter('all');
                setYearFilter('all');
                setDifficultyFilter('all');
              }}
              className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Level Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">
              Academic Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-medium"
            >
              <option value="all">All Levels (100 - 400)</option>
              <option value="100">Level 100 (First Year)</option>
              <option value="200">Level 200 (Second Year)</option>
              <option value="300">Level 300 (Third Year)</option>
              <option value="400">Level 400 (Final Year)</option>
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">
              Semester
            </label>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-medium"
            >
              <option value="all">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>

          {/* Academic Year Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">
              Academic Year
            </label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-medium"
            >
              <option value="all">All Academic Years</option>
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">
              Paper Difficulty
            </label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-medium"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy (Fundamentals)</option>
              <option value="Moderate">Moderate (Standard)</option>
              <option value="Challenging">Challenging (Distinction)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Papers Grid */}
      {filteredPapers.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No exam papers match your criteria</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search query, level, semester, or tab filter to locate relevant papers.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setLevelFilter('all');
              setSemesterFilter('all');
              setYearFilter('all');
              setActiveTab('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPapers.map((paper) => {
            const paperUni = universities.find((u) => u.id === paper.universityId);
            const totalQuestionsCount = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);
            const saved = isBookmarked('paper', paper.id);
            const isDraft = paper.status === 'DRAFT';

            return (
              <div
                key={paper.id}
                className={`group rounded-3xl border p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between ${
                  isDraft
                    ? 'bg-amber-950/10 dark:bg-amber-950/20 border-amber-500/40 hover:border-amber-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500/40'
                }`}
              >
                <div>
                  {/* Top Bar: Uni Logo, Course Badge & Actions */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                        {paperUni?.logoUrl ? (
                          <img src={paperUni.logoUrl} alt={paperUni.name} className="w-full h-full object-contain p-0.5" />
                        ) : (
                          <span className="text-base">{paperUni?.logo || '🎓'}</span>
                        )}
                      </div>
                      <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {paper.courseCode}
                      </span>
                      {isDraft && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                          Draft / Unshared
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {isStaff && (
                        <button
                          onClick={() => handleTogglePublish(paper)}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          title={isDraft ? 'Toggle to Publish' : 'Toggle to Draft'}
                        >
                          {isDraft ? (
                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ToggleRight className="w-5 h-5 text-emerald-500" />
                          )}
                        </button>
                      )}

                      <button
                        onClick={() =>
                          toggleBookmark({
                            targetType: 'paper',
                            targetId: paper.id,
                            title: `${paper.courseCode}: ${cleanCourseTitle(paper.courseTitle)} (${paper.academicYear})`,
                            courseCode: paper.courseCode,
                            universityId: paper.universityId,
                          })
                        }
                        className={`p-2 rounded-xl transition ${
                          saved
                            ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={saved ? 'Remove Bookmark' : 'Save Paper to Bookmarks'}
                      >
                        <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Course Title & Metadata */}
                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {cleanCourseTitle(paper.courseTitle)}
                  </h3>

                  <div className="mt-2.5 flex flex-wrap items-center gap-y-1 gap-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{paper.academicYear}</span>
                    <span>•</span>
                    <span>Level {paper.level}</span>
                    <span>•</span>
                    <span>Sem {paper.semester}</span>
                    <span>•</span>
                    <span>{paper.durationMinutes} mins</span>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-400">
                    {paper.examType} • {paper.totalMarks} Total Marks ({totalQuestionsCount} Questions)
                  </div>

                  {/* Topic Tags */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {paper.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Step-by-Step Solutions</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isStaff && (
                      <button
                        onClick={() => handleEditPaper(paper)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
                        title="Edit / Digitize in Editor"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenPaper(paper)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
                      title="Download / Print Paper"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenPaper(paper)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs active:scale-95"
                    >
                      <span>Study & Solutions</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
