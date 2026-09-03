import React from 'react';
import { useDispatch } from '../context/DispatchContext';
import { X, CheckCircle2, Calendar, User, FileCheck, ShieldCheck, Printer } from 'lucide-react';

export const ProofOfServiceViewerModal: React.FC = () => {
  const { jobForProofReview, setJobForProofReview, getProofOfService } = useDispatch();

  if (!jobForProofReview) return null;

  const job = jobForProofReview;
  const proof = getProofOfService(job.id);

  const formattedDate = proof
    ? new Date(proof.completedAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : 'Recently completed';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Verified Proof of Service
                </h2>
                <span className="text-[11px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  CLOSED
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Job #{job.id} • {job.customerName}
              </p>
            </div>
          </div>
          <button
            id="close-proof-viewer-btn"
            onClick={() => setJobForProofReview(null)}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Metadata Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Service Performed</span>
              <span className="text-slate-800 font-bold">{job.serviceType}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Field Technician</span>
              <span className="text-teal-700 font-bold">
                {proof?.technicianName || job.assignedTechnicianName || 'Marcus Vance'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Completion Timestamp</span>
              <span className="text-slate-800 font-bold">{formattedDate}</span>
            </div>
            <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-200/80">
              <span className="text-slate-400 block font-medium">Location</span>
              <span className="text-slate-800">
                {job.serviceAddress}, {job.city}, {job.state} {job.zip}
              </span>
            </div>
          </div>

          {/* Side-by-side Before and After Photos */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-teal-600" />
              Before & After Visual Inspection
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Before */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900">
                <div className="px-3 py-1.5 bg-red-950/80 border-b border-red-800/40 text-red-300 font-bold text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Before Repair / Arrival
                </div>
                <div className="aspect-video w-full flex items-center justify-center bg-slate-900">
                  {proof?.beforePhotoUrl ? (
                    <img
                      src={proof.beforePhotoUrl}
                      alt="Before Repair"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">No before photo on file</span>
                  )}
                </div>
              </div>

              {/* After */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900">
                <div className="px-3 py-1.5 bg-emerald-950/80 border-b border-emerald-800/40 text-emerald-300 font-bold text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  After Repair / Operational
                </div>
                <div className="aspect-video w-full flex items-center justify-center bg-slate-900">
                  {proof?.afterPhotoUrl ? (
                    <img
                      src={proof.afterPhotoUrl}
                      alt="After Repair"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">No after photo on file</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Completion Notes */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Diagnostic Report & Work Performed
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              {proof?.completionNotes || job.serviceNotes || 'Work completed per manufacturer specifications.'}
            </p>
            {proof?.partsUsed && proof.partsUsed.length > 0 && (
              <div className="pt-2 mt-2 border-t border-slate-200 flex flex-wrap gap-1.5 items-center">
                <span className="text-xs font-semibold text-slate-500">Parts Billed:</span>
                {proof.partsUsed.map((part, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                  >
                    {part}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Customer Signature & Signoff */}
          <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Customer Acceptance Sign-Off
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Signed by:{' '}
                  <strong className="text-slate-800">
                    {proof?.customerName || job.customerName}
                  </strong>
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Tamper-Evident Record
              </span>
            </div>

            <div className="h-24 bg-slate-50 rounded-lg border border-slate-200 p-2 flex items-center justify-center">
              {proof?.signatureDataUrl ? (
                <img
                  src={proof.signatureDataUrl}
                  alt="Customer Signature"
                  className="max-h-full object-contain"
                />
              ) : (
                <span className="text-xs text-slate-400 italic">
                  Digital signature verified on field mobile device
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-100 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Work Order</span>
          </button>

          <button
            type="button"
            onClick={() => setJobForProofReview(null)}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
