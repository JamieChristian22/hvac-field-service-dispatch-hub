import React from 'react';
import { useDispatch, ActiveView } from '../context/DispatchContext';
import {
  LayoutDashboard,
  MapPin,
  Briefcase,
  Users,
  Plus,
  Flame,
  Radio,
  RefreshCw,
  HardHat,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    setIsNewJobModalOpen,
    jobs,
    technicians,
    activeTechId,
    setActiveTechId,
    resetAllData,
  } = useDispatch();

  const activeTech = technicians.find((t) => t.id === activeTechId) || technicians[0];
  const emergencyCount = jobs.filter(
    (j) => (j.priority === 'Emergency' || j.priority === 'High') && j.status !== 'Completed'
  ).length;

  const techAssignedCount = jobs.filter(
    (j) => j.assignedTechnicianId === activeTechId && j.status !== 'Completed'
  ).length;

  const navItems: { id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dispatch',
      label: 'Dispatch',
      icon: LayoutDashboard,
      badge: emergencyCount > 0 ? emergencyCount : undefined,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'map',
      label: 'Map',
      icon: MapPin,
    },
    {
      id: 'my-jobs',
      label: 'My Jobs',
      icon: Briefcase,
      badge: techAssignedCount > 0 ? techAssignedCount : undefined,
      badgeColor: 'bg-teal-700 text-white',
    },
    {
      id: 'team',
      label: 'Team',
      icon: Users,
    },
  ];

  return (
    <>
      {/* Desktop & Mobile Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-teal-500/20">
                <span className="text-xl font-mono tracking-tighter">HVAC</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                    Dispatch Hub
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                    <Radio className="w-3 h-3 animate-pulse text-teal-400" />
                    LIVE FLEET
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Field Service & Technician Management
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => setActiveView(item.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-inner'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${item.badgeColor || 'bg-slate-700 text-white'}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Action Bar */}
            <div className="flex items-center gap-2.5">
              {/* Technician Switcher for "My Jobs" simulation */}
              <div className="relative flex items-center">
                <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg p-1 text-xs">
                  <div className="hidden lg:flex items-center gap-1.5 text-slate-400 px-2 border-r border-slate-700/60 font-medium">
                    <HardHat className="w-3.5 h-3.5 text-teal-400" />
                    <span>Tech Profile:</span>
                  </div>
                  <select
                    id="tech-profile-selector"
                    value={activeTechId}
                    onChange={(e) => setActiveTechId(e.target.value)}
                    className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none pl-1 pr-6 py-1 cursor-pointer appearance-none"
                    title="Switch active field technician view"
                  >
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                        {t.name} ({t.vanNumber.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none -ml-4 mr-1.5" />
                </div>
              </div>

              {/* Reset Data Button (Helper for testing) */}
              <button
                id="reset-sample-data-btn"
                onClick={() => {
                  if (window.confirm('Reset to initial HVAC test jobs and sample technicians?')) {
                    resetAllData();
                  }
                }}
                className="hidden xl:flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700/50 transition-colors"
                title="Reset sample HVAC data"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Data</span>
              </button>

              {/* + New Job Primary Button */}
              <button
                id="btn-open-new-job"
                onClick={() => setIsNewJobModalOpen(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-sm shadow-md shadow-teal-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="whitespace-nowrap">+ New Job</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-1.5">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-xs transition-colors relative ${
                  isActive ? 'text-teal-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 mb-0.5" />
                  {item.badge !== undefined && (
                    <span
                      className={`absolute -top-1 -right-2 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${item.badgeColor || 'bg-slate-700 text-white'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] truncate max-w-full">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
