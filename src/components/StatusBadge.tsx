import React from 'react';
import { Priority, JobStatus, AvailabilityStatus } from '../types';
import { AlertTriangle, Flame, Clock, CheckCircle2, Navigation, Wrench, Calendar, UserX } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1 font-semibold';

  switch (priority) {
    case 'Emergency':
      return (
        <span
          id={`priority-badge-${priority.toLowerCase()}`}
          className={`inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 border border-red-200 tracking-wide font-medium ${sizeClasses}`}
        >
          <Flame className="w-3.5 h-3.5 text-red-600 animate-pulse shrink-0" />
          Emergency
        </span>
      );
    case 'High':
      return (
        <span
          id={`priority-badge-${priority.toLowerCase()}`}
          className={`inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 tracking-wide font-medium ${sizeClasses}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          High
        </span>
      );
    case 'Standard':
      return (
        <span
          id={`priority-badge-${priority.toLowerCase()}`}
          className={`inline-flex items-center gap-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 tracking-wide font-medium ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          Standard
        </span>
      );
    case 'Low':
    default:
      return (
        <span
          id={`priority-badge-${priority.toLowerCase()}`}
          className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 tracking-wide font-medium ${sizeClasses}`}
        >
          Low
        </span>
      );
  }
};

interface StatusBadgeProps {
  status: JobStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1 font-medium';

  switch (status) {
    case 'Unassigned':
      return (
        <span
          id="status-badge-unassigned"
          className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}
        >
          <UserX className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          Unassigned
        </span>
      );
    case 'Scheduled':
      return (
        <span
          id="status-badge-scheduled"
          className={`inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}
        >
          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          Scheduled
        </span>
      );
    case 'En Route':
      return (
        <span
          id="status-badge-en-route"
          className={`inline-flex items-center gap-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold ${sizeClasses}`}
        >
          <Navigation className="w-3.5 h-3.5 text-cyan-600 shrink-0 animate-bounce" />
          En Route
        </span>
      );
    case 'In Progress':
      return (
        <span
          id="status-badge-in-progress"
          className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold ${sizeClasses}`}
        >
          <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          In Progress
        </span>
      );
    case 'Completed':
      return (
        <span
          id="status-badge-completed"
          className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          Completed
        </span>
      );
    default:
      return null;
  }
};

export const AvailabilityBadge: React.FC<{ availability: AvailabilityStatus }> = ({ availability }) => {
  switch (availability) {
    case 'Available':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Available
        </span>
      );
    case 'In Field':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-800 border border-cyan-200">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          In Field
        </span>
      );
    case 'On Call':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          On Call
        </span>
      );
    case 'Off Duty':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          Off Duty
        </span>
      );
  }
};
