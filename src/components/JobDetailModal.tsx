import React, { useState, useEffect } from 'react';
import { useDispatch } from '../context/DispatchContext';
import { Job, JobStatus, Priority, Technician } from '../types';
import { PriorityBadge, StatusBadge } from './StatusBadge';
import {
  X,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Wrench,
  User,
  ShieldCheck,
  FileCheck,
  Check,
  Navigation,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const JobDetailModal: React.FC = () => {
  const {
    selectedJobForDetail,
    setSelectedJobForDetail,
    updateJob,
    technicians,
    getProofOfService,
    setJobForProofReview,
    setJobForProofOfService,
    setActiveView,
  } = useDispatch();

  const [techId, setTechId] = useState<string>('');
  const [status, setStatus] = useState<JobStatus>('Unassigned');
  const [priority, setPriority] = useState<Priority>('Standard');
  const [serviceNotes, setServiceNotes] = useState<string>('');
  const [isSavedBanner, setIsSavedBanner] = useState<boolean>(false);

  useEffect(() => {
    if (selectedJobForDetail) {
      setTechId(selectedJobForDetail.assignedTechnicianId || '');
      setStatus(selectedJobForDetail.status);
      setPriority(selectedJobForDetail.priority);
      setServiceNotes(selectedJobForDetail.serviceNotes);
      setIsSavedBanner(false);
    }
  }, [selectedJobForDetail]);

  if (!selectedJobForDetail) return null;

  const job = selectedJobForDetail;
  const proof = getProofOfService(job.id);

  const handleSaveAssignment = () => {
    updateJob(job.id, {
      assignedTechnicianId: techId || null,
      status,
      priority,
      serviceNotes,
    });
    setIsSavedBanner(true);
    setTimeout(() => setIsSavedBanner(false), 2500);
  };

  const statusOptions: JobStatus[] = [
    'Unassigned',
    'Scheduled',
    'En Route',
    'In Progress',
    'Completed',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-black bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-1 rounded-md">
              {job.id}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {job.serviceType}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{job.customerName}</span>
                <span>•</span>
                <span>{job.appointmentDate} at {job.appointmentTime}</span>
              </div>
            </div>
          </div>
          <button
            id="close-job-detail-modal-btn"
            onClick={() => setSelectedJobForDetail(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved feedback toast banner */}
        {isSavedBanner && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Job details & assignment saved successfully!</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Top Status & Priority Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Current Status
                </div>
                <StatusBadge status={job.status} />
              </div>
              <div className="h-7 w-px bg-slate-200"></div>
              <div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Urgency
                </div>
                <PriorityBadge priority={job.priority} />
              </div>
            </div>

            {/* Proof of service button if completed */}
            {job.status === 'Completed' && (
              <button
                id="view-proof-from-detail-btn"
                onClick={() => {
                  setSelectedJobForDetail(null);
                  setJobForProofReview(job);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <FileCheck className="w-4 h-4" />
                <span>View Verified Proof of Service</span>
              </button>
            )}
          </div>

          {/* Customer & Location Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                Customer Contact
              </h3>
              <div>
                <div className="text-base font-bold text-slate-900">{job.customerName}</div>
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href={`tel:${job.customerPhone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/60 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{job.customerPhone}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Location Box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                Service Address
              </h3>
              <div>
                <div className="text-sm font-semibold text-slate-800">{job.serviceAddress}</div>
                <div className="text-xs text-slate-500">
                  {job.city}, {job.state} {job.zip}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${job.serviceAddress}, ${job.city}, ${job.state} ${job.zip}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open in Maps</span>
                  </a>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={() => {
                      setSelectedJobForDetail(null);
                      setActiveView('map');
                    }}
                    className="text-xs text-teal-600 hover:text-teal-800 font-medium"
                  >
                    Locate on Fleet Map
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dispatcher Controls: Technician Assignment & Status */}
          <div className="p-5 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Dispatcher Controls & Assignment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Assign / Change Technician */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Assigned Technician
                </label>
                <select
                  id="modal-assign-tech-select"
                  value={techId}
                  onChange={(e) => setTechId(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Unassigned (Queue)</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.vanNumber.split('(')[0]} ({t.availability})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  {techId
                    ? `Currently assigned to ${technicians.find((t) => t.id === techId)?.name || 'tech'}`
                    : 'No technician currently dispatched'}
                </p>
              </div>

              {/* Change Status */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Job Workflow Status
                </label>
                <select
                  id="modal-change-status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as JobStatus)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Manual status override for dispatchers
                </p>
              </div>
            </div>

            {/* Save Assignment Button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Changes take effect immediately across all dispatch dashboards.
              </div>
              <button
                type="button"
                id="save-job-assignment-btn"
                onClick={handleSaveAssignment}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Assignment</span>
              </button>
            </div>
          </div>

          {/* Service Notes */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-teal-600" />
              Service Notes & Symptoms
            </h3>
            <textarea
              id="job-detail-service-notes"
              rows={3}
              value={serviceNotes}
              onChange={(e) => setServiceNotes(e.target.value)}
              placeholder="Notes from customer call or technician findings..."
              className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Quick Technician Workflow Actions from inside details */}
          {job.status !== 'Completed' && job.assignedTechnicianId && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
              <div className="text-xs font-bold text-teal-900 mb-2">
                Quick Technician Workflow Transition:
              </div>
              <div className="flex flex-wrap gap-2">
                {job.status === 'Scheduled' && (
                  <button
                    onClick={() => {
                      updateJob(job.id, { status: 'En Route' });
                    }}
                    className="px-3.5 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Transition to "En Route"</span>
                  </button>
                )}
                {job.status === 'En Route' && (
                  <button
                    onClick={() => {
                      updateJob(job.id, { status: 'In Progress' });
                    }}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Start Job ("In Progress")</span>
                  </button>
                )}
                {job.status === 'In Progress' && (
                  <button
                    onClick={() => {
                      setSelectedJobForDetail(null);
                      setJobForProofOfService(job);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Complete Job & Submit Proof</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setSelectedJobForDetail(null)}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
