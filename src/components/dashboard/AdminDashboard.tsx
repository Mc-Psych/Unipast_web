import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PlusCircle,
  FileText,
  Users,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  History,
  Calendar,
} from 'lucide-react';
import { PastPaper } from '../../types';
import { cleanCourseTitle } from '../../utils/courseUtils';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    currentUniversity,
    selectedUniversityId,
    papers,
    materials,
    users,
    auditLogs,
    setActiveView,
    setActivePaper,
    updatePaper,
  } = useApp();

  const isGlobal = currentUser.role === 'SYSTEM_ADMIN' && selectedUniversityId === 'all';

  // Scoped papers
  const scopedPapers = isGlobal
    ? papers.filter((p) => !p.isDisabled)
    : papers.filter((p) => !p.isDisabled && (!currentUniversity || p.universityId === currentUniversity.id));

  const scopedMaterials = isGlobal
    ? materials.filter((m) => !m.isDisabled)
    : materials.filter((m) => !m.isDisabled && (!currentUniversity || m.universityId === currentUniversity.id));

  const scopedUsers = isGlobal
    ? users
    : users.filter((u) => !currentUniversity || u.universityId === currentUniversity.id);

  const totalDownloads =
    scopedPapers.reduce((acc, p) => acc + (p.downloadsCount || 0), 0) +
    scopedMaterials.reduce((acc, m) => acc + (m.downloadsCount || 0), 0);

  const totalViews =
    scopedPapers.reduce((acc, p) => acc + (p.viewsCount || 0), 0) +
    scopedMaterials.reduce((acc, m) => acc + (m.viewsCount || 0), 0);

  const totalPaperOnlyViews = scopedPapers.reduce((acc, p) => acc + (p.viewsCount || 0), 0);

  const realEnrolledStudents = scopedUsers.filter((u) => u.role === 'STUDENT' && !u.isDisabled).length;

  const publishedCount = scopedPapers.filter((p) => p.status === 'PUBLISHED').length;
  const draftCount = scopedPapers.filter((p) => p.status === 'DRAFT').length;

  const handleEditPaper = (paper: PastPaper) => {
    setActivePaper(paper);
    setActiveView('digitizer');
  };

  const handleToggleStatus = (paper: PastPaper) => {
    const newStatus = paper.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    updatePaper(paper.id, { status: newStatus });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              {currentUser.role === 'SYSTEM_ADMIN' ? 'System Administrator Console' : 'School Admin Console'}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Scope: {isGlobal ? 'Global Multi-Tenant' : currentUniversity?.name || 'Assigned University'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Management & Digitizer
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Transcribe, structure, and publish university past exam papers with step-by-step marking schemes, and monitor student academic performance in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setActivePaper(null); // new draft
              setActiveView('digitizer');
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Digitize New Exam Paper</span>
          </button>

          <button
            onClick={() => setActiveView('timetable')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Manage Exam Schedule</span>
          </button>

          {currentUser.role === 'SYSTEM_ADMIN' && (
            <button
              onClick={() => setActiveView('system-config')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs flex items-center gap-2 transition"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>University Config</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Metric Cards with Live Synchronization */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Digitized Papers</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl font-black text-slate-900 dark:text-white">{scopedPapers.length}</p>
            <span className="text-xs font-semibold text-emerald-600">({publishedCount} Live)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{draftCount} draft in progress</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Paper Views</span>
            <Eye className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{totalPaperOnlyViews.toLocaleString()}</p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live paper reader interactions
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Study Materials</span>
            <Download className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{scopedMaterials.length}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
            {totalDownloads.toLocaleString()} total downloads
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Enrolled Students</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {realEnrolledStudents}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Active enrolled student accounts</p>
        </div>
      </div>

      {/* Main Admin Section: Papers Publisher Table & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Paper Digitizer Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Exam Paper Repository & Publication Status</span>
            </h2>
            <button
              onClick={() => setActiveView('papers')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Year / Sem</th>
                    <th className="py-3 px-4">Level</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Engagement</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {scopedPapers.map((paper) => (
                    <tr key={paper.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{paper.courseCode}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {cleanCourseTitle(paper.courseTitle)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {paper.academicYear} (Sem {paper.semester})
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Level {paper.level}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(paper)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition cursor-pointer ${
                            paper.status === 'PUBLISHED'
                              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                              : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                          }`}
                        >
                          {paper.status === 'PUBLISHED' ? '● Published' : '○ Draft'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {paper.viewsCount || 0} views
                        </span>{' '}
                        • {paper.downloadsCount || 0} dl
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setActivePaper(paper);
                              setActiveView('paper-viewer');
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Preview Exam & Solutions"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditPaper(paper)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 font-semibold text-[11px] transition"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Security Audit Log & Quick Tools */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Institutional Audit Log</span>
            </h2>
            <button
              onClick={() => setActiveView('audit-logs')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              All Logs
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 text-xs"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{log.userName}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{log.action}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{log.details}</p>
              </div>
            ))}
          </div>

          {/* Institutional Compliance Notice */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 text-xs text-indigo-950 dark:text-indigo-200">
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Ghana Higher Ed Standard</span>
            </div>
            <p className="text-[11px] text-indigo-900/80 dark:text-indigo-300 leading-relaxed">
              All digitized papers are verified against university academic standards and structured with full marking schemes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
