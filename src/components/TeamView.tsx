import React from 'react';
import { useDispatch } from '../context/DispatchContext';
import { AvailabilityBadge, StatusBadge, PriorityBadge } from './StatusBadge';
import { Technician, AvailabilityStatus } from '../types';
import {
  HardHat,
  Truck,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Briefcase,
  Wrench,
  ChevronRight
} from 'lucide-react';

export const TeamView: React.FC = () => {
  const {
    technicians,
    jobs,
    activeTechId,
    setActiveTechId,
    setActiveView,
    updateTechnicianAvailability,
    setSelectedJobForDetail,
  } = useDispatch();

  const availabilityOptions: AvailabilityStatus[] = [
    'Available',
    'In Field',
    'On Call',
    'Off Duty',
  ];

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HardHat className="w-6 h-6 text-teal-600" />
            Field Service Technician Roster
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor technician fleet readiness, assigned van inventories, and real-time active
            ticket workloads
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold px-3 py-1.5 bg-slate-100 rounded-lg text-slate-700">
            Total Fleet: <span className="text-teal-700 font-bold">{technicians.length} Techs</span>
          </div>
        </div>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {technicians.map((tech) => {
          // Workload: jobs assigned to this tech that are not completed
          const activeJobs = jobs.filter(
            (j) => j.assignedTechnicianId === tech.id && j.status !== 'Completed'
          );
          const completedJobs = jobs.filter(
            (j) => j.assignedTechnicianId === tech.id && j.status === 'Completed'
          );

          const isCurrentActivePersona = activeTechId === tech.id;

          return (
            <div
              key={tech.id}
              id={`team-tech-card-${tech.id}`}
              className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                isCurrentActivePersona ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-13 h-13 rounded-2xl ${tech.avatarColor} text-white flex items-center justify-center font-black text-lg shadow-md shrink-0`}
                    >
                      {tech.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{tech.name}</h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 border border-slate-200">
                          {tech.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{tech.specialty}</p>
                    </div>
                  </div>

                  {/* Availability Dropdown */}
                  <div className="text-right">
                    <select
                      id={`tech-avail-${tech.id}`}
                      value={tech.availability}
                      onChange={(e) =>
                        updateTechnicianAvailability(
                          tech.id,
                          e.target.value as AvailabilityStatus
                        )
                      }
                      className="text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {availabilityOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Van & Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Truck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="font-medium truncate">{tech.vanNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                    <a
                      href={`tel:${tech.phone.replace(/[^0-9]/g, '')}`}
                      className="hover:underline hover:text-teal-800 font-medium"
                    >
                      {tech.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 sm:col-span-2">
                    <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="text-slate-600 truncate">{tech.email}</span>
                  </div>
                </div>

                {/* Workload Stats Bar */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px] font-medium">Current Workload</span>
                      <span className="font-extrabold text-sm text-slate-900">
                        {activeJobs.length} active {activeJobs.length === 1 ? 'ticket' : 'tickets'}
                      </span>
                    </div>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-medium">Completed Today</span>
                      <span className="font-extrabold text-sm text-emerald-700">
                        {completedJobs.length} closed
                      </span>
                    </div>
                  </div>

                  {/* Switch to this tech's mobile view */}
                  <button
                    id={`switch-persona-btn-${tech.id}`}
                    onClick={() => {
                      setActiveTechId(tech.id);
                      setActiveView('my-jobs');
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                      isCurrentActivePersona
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{isCurrentActivePersona ? 'Active Tech View' : 'View Mobile Queue'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Active Jobs Mini List */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Active Jobs Assigned ({activeJobs.length})
                  </div>
                  {activeJobs.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-1">
                      No active tickets in queue. Ready for next dispatch.
                    </div>
                  ) : (
                    activeJobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJobForDetail(job)}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-teal-50/60 border border-slate-200/80 cursor-pointer transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2 truncate mr-2">
                          <span className="font-mono font-bold text-slate-800 shrink-0">
                            {job.id}
                          </span>
                          <span className="text-slate-800 font-medium truncate">
                            {job.customerName}
                          </span>
                          <span className="text-slate-400 shrink-0">•</span>
                          <span className="text-slate-500 truncate">{job.serviceType}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <PriorityBadge priority={job.priority} size="sm" />
                          <StatusBadge status={job.status} size="sm" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
