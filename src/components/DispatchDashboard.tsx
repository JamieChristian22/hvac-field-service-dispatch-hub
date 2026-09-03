import React, { useState } from 'react';
import { useDispatch } from '../context/DispatchContext';
import { Job, JobStatus, Priority } from '../types';
import { PriorityBadge, StatusBadge } from './StatusBadge';
import {
  AlertTriangle,
  Clock,
  User,
  MapPin,
  Calendar,
  HardHat,
  Search,
  Filter,
  Plus,
  Flame,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const DispatchDashboard: React.FC = () => {
  const {
    jobs,
    technicians,
    setSelectedJobForDetail,
    setIsNewJobModalOpen,
    updateJobStatus,
    setJobForProofOfService,
  } = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [techFilter, setTechFilter] = useState<string>('all');

  // Metrics
  const todayTotal = jobs.length;
  const inField = jobs.filter((j) => j.status === 'En Route' || j.status === 'In Progress').length;
  const unassigned = jobs.filter((j) => j.status === 'Unassigned').length;
  const completed = jobs.filter((j) => j.status === 'Completed').length;

  // "Needs Attention" section: Emergency and High Priority jobs that are not completed
  const needsAttentionJobs = jobs.filter(
    (j) => (j.priority === 'Emergency' || j.priority === 'High') && j.status !== 'Completed'
  );

  // Column definitions
  const columns: { status: JobStatus; title: string; color: string; border: string; bg: string }[] = [
    {
      status: 'Unassigned',
      title: 'Unassigned',
      color: 'text-slate-700',
      border: 'border-slate-300',
      bg: 'bg-slate-50/80',
    },
    {
      status: 'Scheduled',
      title: 'Scheduled',
      color: 'text-blue-700',
      border: 'border-blue-300',
      bg: 'bg-blue-50/40',
    },
    {
      status: 'En Route',
      title: 'En Route',
      color: 'text-cyan-800',
      border: 'border-cyan-300',
      bg: 'bg-cyan-50/40',
    },
    {
      status: 'In Progress',
      title: 'In Progress',
      color: 'text-amber-800',
      border: 'border-amber-300',
      bg: 'bg-amber-50/40',
    },
    {
      status: 'Completed',
      title: 'Completed',
      color: 'text-emerald-800',
      border: 'border-emerald-300',
      bg: 'bg-emerald-50/40',
    },
  ];

  // Filtering
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.serviceAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.serviceType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    const matchesTech =
      techFilter === 'all' ||
      (techFilter === 'unassigned' && !job.assignedTechnicianId) ||
      job.assignedTechnicianId === techFilter;

    return matchesSearch && matchesPriority && matchesTech;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Metrics Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Today's Dispatch Board
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Live fleet routing, active work orders, and field service queue
            </p>
          </div>

          {/* New Job CTA */}
          <div className="flex items-center gap-2">
            <button
              id="dashboard-new-job-btn"
              onClick={() => setIsNewJobModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ New Job</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Today Total */}
          <div
            id="metric-card-today-total"
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Today Total
              </p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{todayTotal}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Active HVAC tickets</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          {/* In Field */}
          <div
            id="metric-card-in-field"
            className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-teal-200 shadow-xs flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                In Field
              </p>
              <p className="text-2xl sm:text-3xl font-black text-teal-950 mt-1">{inField}</p>
              <p className="text-[11px] text-teal-700 mt-0.5">En Route & In Progress</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <HardHat className="w-5 h-5" />
            </div>
          </div>

          {/* Unassigned */}
          <div
            id="metric-card-unassigned"
            className={`p-4 rounded-xl bg-white border shadow-xs flex items-center justify-between ${
              unassigned > 0 ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Unassigned
              </p>
              <p
                className={`text-2xl sm:text-3xl font-black mt-1 ${
                  unassigned > 0 ? 'text-amber-700' : 'text-slate-800'
                }`}
              >
                {unassigned}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Pending tech assignment</p>
            </div>
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                unassigned > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Completed */}
          <div
            id="metric-card-completed"
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Completed
              </p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">{completed}</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">With verified sign-off</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <span className="text-lg font-bold">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* "Needs Attention" Section (Emergency & High Priority) */}
      {needsAttentionJobs.length > 0 && (
        <div id="needs-attention-section" className="rounded-2xl border border-red-200 bg-red-50/50 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
                <Flame className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-950 uppercase tracking-wide">
                  Needs Attention ({needsAttentionJobs.length})
                </h3>
                <p className="text-xs text-red-700">
                  Critical Emergency and High Priority tickets requiring immediate dispatching
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {needsAttentionJobs.map((job) => (
              <div
                key={job.id}
                id={`attention-card-${job.id}`}
                onClick={() => setSelectedJobForDetail(job)}
                className="bg-white rounded-xl p-3.5 border border-red-200 hover:border-red-400 hover:shadow-md transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-800">{job.id}</span>
                  <PriorityBadge priority={job.priority} size="sm" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                    {job.serviceType}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-1">{job.customerName}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {job.appointmentTime}
                  </span>
                  <span
                    className={`font-medium ${
                      job.assignedTechnicianName ? 'text-teal-700' : 'text-amber-700 font-bold'
                    }`}
                  >
                    {job.assignedTechnicianName || '⚠️ Unassigned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-job-input"
            type="text"
            placeholder="Search by customer, address, service type, or job ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Priority filter */}
          <select
            id="filter-priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Priorities</option>
            <option value="Emergency">Emergency</option>
            <option value="High">High</option>
            <option value="Standard">Standard</option>
            <option value="Low">Low</option>
          </select>

          {/* Tech filter */}
          <select
            id="filter-technician"
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Technicians</option>
            <option value="unassigned">Unassigned Only</option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {(searchQuery || priorityFilter !== 'all' || techFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPriorityFilter('all');
                setTechFilter('all');
              }}
              className="text-xs text-teal-700 hover:text-teal-900 font-semibold px-2 py-1 whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 5-Column Dispatch Job Board */}
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-w-[900px] md:min-w-0">
          {columns.map((col) => {
            const colJobs = filteredJobs.filter((j) => j.status === col.status);

            return (
              <div
                key={col.status}
                id={`column-${col.status.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex flex-col rounded-2xl border ${col.border} ${col.bg} p-3 min-h-[500px]`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <h3 className={`text-xs font-black uppercase tracking-wider ${col.color}`}>
                      {col.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-xs">
                    {colJobs.length}
                  </span>
                </div>

                {/* Job Cards in Column */}
                <div className="space-y-3 flex-1">
                  {colJobs.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs text-center p-3 font-medium">
                      No jobs in {col.title}
                    </div>
                  ) : (
                    colJobs.map((job) => (
                      <div
                        key={job.id}
                        id={`job-card-${job.id}`}
                        onClick={() => setSelectedJobForDetail(job)}
                        className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-400 transition-all cursor-pointer space-y-2.5 group relative"
                      >
                        {/* Top Line: ID & Priority */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                            {job.id}
                          </span>
                          <PriorityBadge priority={job.priority} size="sm" />
                        </div>

                        {/* Service Type & Customer */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                            {job.serviceType}
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1 font-medium">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{job.customerName}</span>
                          </p>
                        </div>

                        {/* Address snippet */}
                        <p className="text-[11px] text-slate-500 flex items-start gap-1 line-clamp-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          <span className="truncate">{job.serviceAddress}</span>
                        </p>

                        {/* Time & Technician Footer */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 text-slate-500 font-medium">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {job.appointmentTime}
                          </span>

                          <span
                            className={`truncate max-w-[110px] font-semibold text-right ${
                              job.assignedTechnicianName
                                ? 'text-teal-700'
                                : 'text-slate-400 italic'
                            }`}
                          >
                            {job.assignedTechnicianName
                              ? job.assignedTechnicianName.split(' ')[0] + ' ' + (job.assignedTechnicianName.split(' ')[1]?.[0] || '') + '.'
                              : 'Unassigned'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
