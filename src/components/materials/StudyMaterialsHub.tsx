import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Download,
  Search,
  Filter,
  PlusCircle,
  FileText,
  Bookmark,
  CheckCircle2,
  Share2,
  Eye,
  Building2,
  Clock,
  Sparkles,
  Tag,
} from 'lucide-react';
import { StudyMaterial } from '../../types';

export const StudyMaterialsHub: React.FC = () => {
  const {
    currentUser,
    currentUniversity,
    selectedUniversityId,
    universities,
    materials,
    addMaterial,
    recordDownload,
    toggleBookmark,
    isBookmarked,
    searchQuery,
    setSearchQuery,
    openAiWithContext,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // New Material Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCategory, setNewCategory] = useState<StudyMaterial['category']>('FORMULA_SHEET');
  const [newLevel, setNewLevel] = useState<number>(200);
  const [newDesc, setNewDesc] = useState('');
  const [newFormat, setNewFormat] = useState<'PDF' | 'DOCX' | 'ZIP' | 'EPUB'>('PDF');
  const [newFileSize, setNewFileSize] = useState('2.4 MB');

  // Preview Modal
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  // Filter materials
  const filteredMaterials = materials.filter((item) => {
    if (selectedUniversityId !== 'all' && item.universityId !== selectedUniversityId) {
      return false;
    }
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCode = item.courseCode.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCode && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  const handleDownload = (mat: StudyMaterial) => {
    recordDownload(mat.id);
    // Generate sample download trigger
    const blob = new Blob(
      [
        `UniPast Academic Resource Hub\n===============================\nTitle: ${mat.title}\nCourse: ${mat.courseCode} - ${mat.courseTitle}\nInstitution: ${currentUniversity?.name || 'UniPast'}\n\nDescription:\n${mat.description}\n\nKey Concepts:\n${mat.tags.join(', ')}\n\n(Verified University Material - Prepared for Academic Year 2023/2024)`
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mat.courseCode}_${mat.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCourseCode.trim()) return;

    addMaterial({
      universityId: currentUniversity?.id || universities[0]?.id || 'univ-htu',
      courseId: `course-${newCourseCode.toLowerCase().replace(/\s+/g, '-')}`,
      courseCode: newCourseCode.toUpperCase(),
      courseTitle: newCourseTitle || `${newCourseCode.toUpperCase()} Core Concepts`,
      title: newTitle,
      category: newCategory,
      fileSize: newFileSize,
      fileFormat: newFormat,
      uploaderName: currentUser.name,
      uploaderRole: currentUser.role,
      description: newDesc || 'Verified academic study guide and lecture notes.',
      previewPages: ['Page 1: Core Theorems and Definitions', 'Page 2: Exam Worked Examples and Formulas'],
      tags: ['Study Guide', 'Revision', newCourseCode.toUpperCase()],
    });

    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewCourseCode('');
    setNewCourseTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Study Materials & Formula Hub
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
              {filteredMaterials.length} Resources
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Download verified lecture handouts, formula cheat sheets, lab experiment manuals, and quick revision slides.
          </p>
        </div>

        {currentUser.role !== 'STUDENT' && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload New Resource</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search study materials, formula sheets, course code (e.g. Master Theorem, Calculus, SQL)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">
              Resource Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
            >
              <option value="all">All Categories</option>
              <option value="FORMULA_SHEET">Formula Sheets & Cheat Guides</option>
              <option value="LECTURE_NOTES">Lecture Notes & Slides</option>
              <option value="SUMMARY_GUIDE">Exam High-Yield Summaries</option>
              <option value="LAB_MANUAL">Lab Manuals & Code Guides</option>
              <option value="SLIDE_DECK">Lecture Slide Decks</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">
              Academic Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
            >
              <option value="all">All Levels</option>
              <option value="100">Level 100</option>
              <option value="200">Level 200</option>
              <option value="300">Level 300</option>
              <option value="400">Level 400</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => openAiWithContext({ topic: 'Study Material Recommendation' })}
              className="w-full py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-indigo-100 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ask AI for Formula Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((mat) => {
          const matUni = universities.find((u) => u.id === mat.universityId);
          const saved = isBookmarked('material', mat.id);

          return (
            <div
              key={mat.id}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-lg hover:border-indigo-500/40 transition flex flex-col justify-between"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                      {mat.fileFormat}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {mat.courseCode}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      toggleBookmark({
                        targetType: 'material',
                        targetId: mat.id,
                        title: `${mat.courseCode}: ${mat.title}`,
                        courseCode: mat.courseCode,
                        universityId: mat.universityId,
                      })
                    }
                    className={`p-2 rounded-xl transition ${
                      saved
                        ? 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                  {mat.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {mat.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    {mat.category}
                  </span>
                  <span className="text-[10px] text-slate-400 px-2 py-0.5">
                    Level {mat.level} • {mat.fileSize}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">By {mat.uploadedBy}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMaterial(mat)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                    title="Preview Notes"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDownload(mat)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Resource Preview Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                  {previewMaterial.courseCode} • {previewMaterial.category}
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                  {previewMaterial.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong>Overview:</strong> {previewMaterial.description}
              </p>
              <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px]">
                {previewMaterial.courseCode} Master Formulas & Key Theorem Reference Sheet (Verified)
              </div>
              <p className="text-slate-500">
                Uploaded by {previewMaterial.uploadedBy} on {previewMaterial.uploadedAt}. Compatible with all standard PDF viewers.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewMaterial(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleDownload(previewMaterial);
                  setPreviewMaterial(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Resource Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Upload New Academic Study Material
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    placeholder="e.g. CS 201"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Formula Sheet">Formula Sheet</option>
                    <option value="Lecture Note">Lecture Note</option>
                    <option value="Exam Summary">Exam Summary</option>
                    <option value="Lab Guide">Lab Guide</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Asymptotic Analysis and Recurrence Relations Cheat Sheet"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Level</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value={100}>Level 100</option>
                    <option value={200}>Level 200</option>
                    <option value={300}>Level 300</option>
                    <option value={400}>Level 400</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">File Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="DOCX">Word Document</option>
                    <option value="PPTX">PowerPoint Slides</option>
                    <option value="ZIP">ZIP Archive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Brief Summary & Topics Covered
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Key concepts, formulas, and derivations included in this resource..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
