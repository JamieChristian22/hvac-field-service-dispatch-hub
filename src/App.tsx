import React from 'react';
import { DispatchProvider, useDispatch } from './context/DispatchContext';
import { Navbar } from './components/Navbar';
import { DispatchDashboard } from './components/DispatchDashboard';
import { MapView } from './components/MapView';
import { MyJobsView } from './components/MyJobsView';
import { TeamView } from './components/TeamView';
import { NewJobModal } from './components/NewJobModal';
import { JobDetailModal } from './components/JobDetailModal';
import { ProofOfServiceModal } from './components/ProofOfServiceModal';
import { ProofOfServiceViewerModal } from './components/ProofOfServiceViewerModal';

const AppContent: React.FC = () => {
  const { activeView } = useDispatch();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top and Mobile Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-8">
        {activeView === 'dispatch' && <DispatchDashboard />}
        {activeView === 'map' && <MapView />}
        {activeView === 'my-jobs' && <MyJobsView />}
        {activeView === 'team' && <TeamView />}
      </main>

      {/* Persistent Global Modals */}
      <NewJobModal />
      <JobDetailModal />
      <ProofOfServiceModal />
      <ProofOfServiceViewerModal />
    </div>
  );
};

export default function App() {
  return (
    <DispatchProvider>
      <AppContent />
    </DispatchProvider>
  );
}
