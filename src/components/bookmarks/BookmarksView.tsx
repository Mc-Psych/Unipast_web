import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bookmark, FileText, BookOpen, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';

export const BookmarksView: React.FC = () => {
  const { bookmarks, toggleBookmark, papers, materials, setActivePaper, setActiveView } = useApp();

  const handleOpenItem = (bm: (typeof bookmarks)[0]) => {
    if (bm.targetType === 'paper') {
      const p = papers.find((paper) => paper.id === bm.targetId);
      if (p) {
        setActivePaper(p);
        setActiveView('paper-viewer');
      }
    } else {
      setActiveView('materials');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Saved Exam Papers & Study Resources
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fast access to your pinned examination questions, marking schemes, and formula guides.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
          {bookmarks.length} Bookmarks
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">No saved bookmarks yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any past exam paper or formula sheet to keep it handy for quick revision.
          </p>
          <button
            onClick={() => setActiveView('papers')}
            className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            Explore Exam Papers
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/40 transition flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  {bm.targetType === 'paper' ? <FileText className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {bm.targetType === 'paper' ? 'Past Exam Paper' : 'Study Resource'}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1 line-clamp-1">
                    {bm.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Course: {bm.courseCode}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenItem(bm)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => toggleBookmark(bm)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
