import React, { useState } from 'react';
import { useDispatch } from '../context/DispatchContext';
import { PriorityBadge, StatusBadge, AvailabilityBadge } from './StatusBadge';
import { Job, JobStatus } from '../types';
import {
  HardHat,
  Truck,
  Phone,
  MapPin,
  Clock,
  Navigation,
  Wrench,
  CheckCircle2,
  FileCheck,
  ChevronRight,
  ExternalLink,
  Calendar,
  AlertTriangle,
  Flame,
  Info
} from 'lucide-react';

export const MyJobsView: React.FC = () => {
  const {
    jobs,
    technicians,
    activeTechId,
    setActiveTechId,
    updateJobStatus,
    setJobForProofOfService,
    setJobForProofReview,
    setSelectedJobForDetail,
  } = useDispatch();

  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed'>('all');

  const currentTech = technicians.find((t) => t.id === activeTechId) || technicians[0];
  const techJobs = jobs.filter((j) => j.assignedTechnicianId === activeTechId);

  const activeJobs = techJobs.filter((j) => j.status !== 'Completed');
  const completedJobs = techJobs.filter((j) => j.status === 'Completed');

  const displayedJobs =
    filterTab === 'active'
      ? activeJobs
      : filterTab === 'completed'
      ? completedJobs
      : techJobs;

  return (
    <div className="space-y-5 pb-16 max-w-3xl mx-auto">
      {/* Technician Selector & Persona Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl ${currentTech.avatarColor} text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0`}
            >
              {currentTech.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{currentTech.name}</h2>
                <AvailabilityBadge availability={currentTech.availability} />
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <Truck className="w-3.5 h-3.5 text-teal-400" />
                <span>{currentTech.vanNumber}</span>
                <span className="text-slate-500">•</span>
                <span>{currentTech.specialty}</span>
              </p>
            </div>
          </div>

          {/* Quick Switch Technician Dropdown */}
          <div className="bg-slate-800/90 rounded-xl p-2 border border-slate-700">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 px-1">
              Switch Field Technician View:
            </label>
            <select
              id="my-jobs-tech-switcher"
              value={activeTechId}
              onChange={(e) => setActiveTechId(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-900 text-white border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.vanNumber.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Tech Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-center">
          <div className="bg-slate-800/60 rounded-lg py-2">
            <div className="text-xs text-slate-400 font-medium">Assigned Today</div>
            <div className="text-lg font-black text-white mt-0.5">{techJobs.length}</div>
          </div>
          <div className="bg-slate-800/60 rounded-lg py-2">
            <div className="text-xs text-teal-400 font-medium">Active In Queue</div>
            <div className="text-lg font-black text-teal-300 mt-0.5">{activeJobs.length}</div>
          </div>
          <div className="bg-slate-800/60 rounded-lg py-2">
            <div className="text-xs text-emerald-400 font-medium">Completed</div>
            <div className="text-lg font-black text-emerald-300 mt-0.5">{completedJobs.length}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-2">
          <button
            id="tab-tech-all"
            onClick={() => setFilterTab('all')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              filterTab === 'all'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Work Orders ({techJobs.length})
          </button>
          <button
            id="tab-tech-active"
            onClick={() => setFilterTab('active')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              filterTab === 'active'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Active & Pending ({activeJobs.length})
          </button>
          <button
            id="tab-tech-completed"
            onClick={() => setFilterTab('completed')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              filterTab === 'completed'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Completed ({completedJobs.length})
          </button>
        </div>
      </div>

      {/* Assigned Job Cards List */}
      <div className="space-y-4">
        {displayedJobs.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No jobs in this view</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No HVAC tickets are currently assigned to {currentTech.name} matching this filter.
            </p>
          </div>
        ) : (
          displayedJobs.map((job) => (
            <div
              key={job.id}
              id={`tech-job-card-${job.id}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:shadow-md"
            >
              {/* Card Top Strip */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                      {job.id}
                    </span>
                    <PriorityBadge priority={job.priority} size="sm" />
                  </div>
                  <StatusBadge status={job.status} size="sm" />
                </div>

                {/* Service Type & Customer */}
                <div>
                  <h3 className="text-base font-bold text-slate-900">{job.serviceType}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-slate-800">{job.customerName}</span>
                    <a
                      href={`tel:${job.customerPhone.replace(/[^0-9]/g, '')}`}
                      className="inline-flex items-center gap-1 text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium hover:bg-teal-100"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{job.customerPhone}</span>
                    </a>
                  </div>
                </div>

                {/* Address & Appointment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-800">{job.serviceAddress}</div>
                      <div className="text-[11px] text-slate-500">
                        {job.city}, {job.state} {job.zip}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 sm:justify-end">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-800">{job.appointmentTime}</div>
                      <div className="text-[11px] text-slate-500">{job.appointmentDate}</div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {job.serviceNotes && (
                  <p className="text-xs text-slate-600 bg-amber-50/60 border border-amber-200/60 p-2.5 rounded-lg line-clamp-2">
                    <strong className="text-amber-900 font-semibold">Dispatcher Note:</strong>{' '}
                    {job.serviceNotes}
                  </p>
                )}
              </div>

              {/* Workflow Actions Footer */}
              <div className="px-4 sm:px-5 py-3.5 bg-slate-50/90 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                {/* View Details Button */}
                <button
                  onClick={() => setSelectedJobForDetail(job)}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
                >
                  View Full Details & Map
                </button>

                {/* Workflow Buttons based on status */}
                <div className="flex items-center gap-2">
                  {job.status === 'Scheduled' && (
                    <button
                      id={`tech-action-en-route-${job.id}`}
                      onClick={() => updateJobStatus(job.id, 'En Route')}
                      className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Mark En Route</span>
                    </button>
                  )}

                  {job.status === 'En Route' && (
                    <button
                      id={`tech-action-start-job-${job.id}`}
                      onClick={() => updateJobStatus(job.id, 'In Progress')}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Start Job</span>
                    </button>
                  )}

                  {job.status === 'In Progress' && (
                    <button
                      id={`tech-action-complete-job-${job.id}`}
                      onClick={() => setJobForProofOfService(job)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Complete Job</span>
                    </button>
                  )}

                  {job.status === 'Completed' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1">
                        ✓ Job Completed
                      </span>
                      <button
                        id={`tech-review-proof-${job.id}`}
                        onClick={() => setJobForProofReview(job)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                      >
                        <FileCheck className="w-3 h-3 text-teal-600" />
                        <span>Proof of Service</span>
                      </button>
                    </div>
                  )}

                  {job.status === 'Unassigned' && (
                    <span className="text-xs text-slate-500 italic">
                      Awaiting dispatcher assignment
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
