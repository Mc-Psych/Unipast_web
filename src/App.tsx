import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { PastPaperList } from './components/papers/PastPaperList';
import { PastPaperViewer } from './components/papers/PastPaperViewer';
import { PaperDigitizer } from './components/admin/PaperDigitizer';
import { StudyMaterialsHub } from './components/materials/StudyMaterialsHub';
import { ExamTimetable } from './components/timetable/ExamTimetable';
import { BookmarksView } from './components/bookmarks/BookmarksView';
import { UserManagement } from './components/admin/UserManagement';
import { SystemConfig } from './components/admin/SystemConfig';
import { AuditLogsView } from './components/admin/AuditLogsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AiTutorModal } from './components/ai/AiTutorModal';
import { WelcomeAuthView } from './components/auth/WelcomeAuthView';

const AppContent: React.FC = () => {
  const { currentUser, activeView, theme, isAuthenticated } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If user is not authenticated, show Welcome Screen & Auth Flow
  if (!isAuthenticated) {
    return <WelcomeAuthView />;
  }

  // Strict role-based guard for Students: Students CANNOT access admin views
  const isStudent = currentUser.role === 'STUDENT';
  const adminOnlyViews = ['digitizer', 'users', 'system-config', 'audit-logs'];

  const renderActiveView = () => {
    if (isStudent && adminOnlyViews.includes(activeView)) {
      return <StudentDashboard />;
    }

    switch (activeView) {
      case 'dashboard':
        return isStudent ? <StudentDashboard /> : <AdminDashboard />;
      case 'papers':
        return <PastPaperList />;
      case 'paper-viewer':
        return <PastPaperViewer />;
      case 'digitizer':
        return <PaperDigitizer />;
      case 'materials':
        return <StudyMaterialsHub />;
      case 'timetable':
        return <ExamTimetable />;
      case 'bookmarks':
        return <BookmarksView />;
      case 'users':
        return <UserManagement />;
      case 'system-config':
        return <SystemConfig />;
      case 'audit-logs':
        return <AuditLogsView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return isStudent ? <StudentDashboard /> : <AdminDashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#0F0F12] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${theme}`}>
      {/* Top Navbar */}
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-full overflow-x-hidden bg-slate-50 dark:bg-[#0F0F12] transition-colors duration-200">
          {renderActiveView()}
        </main>
      </div>

      {/* Global AI Tutor Popup */}
      <AiTutorModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
