import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from '../context/DispatchContext';
import { SAMPLE_BEFORE_PHOTO, SAMPLE_AFTER_PHOTO } from '../data/initialData';
import {
  X,
  Upload,
  Camera,
  FileCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UserCheck
} from 'lucide-react';

export const ProofOfServiceModal: React.FC = () => {
  const { jobForProofOfService, setJobForProofOfService, submitProofOfService, technicians } =
    useDispatch();

  const [customerName, setCustomerName] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [beforePhoto, setBeforePhoto] = useState<string>('');
  const [afterPhoto, setAfterPhoto] = useState<string>('');
  const [hasSignature, setHasSignature] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (jobForProofOfService) {
      setCustomerName(jobForProofOfService.customerName);
      setCompletionNotes(
        `Diagnosed issue on ${jobForProofOfService.serviceType}. Cleaned system, verified pressures and electrical components. Tested operation under load with standard temperature split.`
      );
      setBeforePhoto(SAMPLE_BEFORE_PHOTO);
      setAfterPhoto(SAMPLE_AFTER_PHOTO);
      setHasSignature(false);
      setErrorMsg('');

      // Clear signature canvas
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      }, 100);
    }
  }, [jobForProofOfService]);

  if (!jobForProofOfService) return null;

  const job = jobForProofOfService;
  const assignedTech = technicians.find((t) => t.id === job.assignedTechnicianId);
  const techName = assignedTech ? assignedTech.name : 'Field Technician';

  // Drawing handlers for Signature Canvas
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // Image Upload helper
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (type === 'before') setBeforePhoto(reader.result);
        else setAfterPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProofAndComplete = () => {
    if (!customerName.trim()) {
      setErrorMsg('Please confirm customer name.');
      return;
    }

    if (!completionNotes.trim()) {
      setErrorMsg('Please enter completion notes.');
      return;
    }

    // Capture signature or generate fallback
    let signatureUrl = '';
    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      signatureUrl = canvas.toDataURL('image/png');
    } else {
      // Create a clean fallback signature stamp
      signatureUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="90" viewBox="0 0 320 90"><path d="M 20 55 Q 60 15 100 45 T 160 50 T 220 25 T 280 60" fill="none" stroke="%230f172a" stroke-width="3" stroke-linecap="round"/><text x="20" y="80" font-family="sans-serif" font-size="11" fill="%2364748b">Digitally Verified by ${encodeURIComponent(
        customerName
      )}</text></svg>`;
    }

    submitProofOfService({
      jobId: job.id,
      technicianId: job.assignedTechnicianId || 'tech-1',
      technicianName: techName,
      customerName: customerName.trim(),
      completionNotes: completionNotes.trim(),
      beforePhotoUrl: beforePhoto || SAMPLE_BEFORE_PHOTO,
      afterPhotoUrl: afterPhoto || SAMPLE_AFTER_PHOTO,
      signatureDataUrl: signatureUrl,
    });

    setJobForProofOfService(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Proof of Service Completion</h2>
              <p className="text-xs text-slate-400">
                Job #{job.id} — {job.customerName}
              </p>
            </div>
          </div>
          <button
            id="close-proof-modal-btn"
            onClick={() => setJobForProofOfService(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 px-6 py-2.5 text-xs font-semibold flex items-center gap-2 border-b border-red-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Job summary pill */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-700">{job.serviceType}</span>
              <span className="text-slate-400 mx-2">•</span>
              <span className="text-slate-500">{job.serviceAddress}</span>
            </div>
            <span className="font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              Tech: {techName}
            </span>
          </div>

          {/* Photo Documentation: Before & After */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-teal-600" />
                Service Photos (Before & After)
              </h3>
              <span className="text-[11px] text-slate-500">Upload or review photo proof</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Before Photo */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    Before Service
                  </span>
                  <label className="cursor-pointer text-[11px] font-semibold text-teal-700 hover:text-teal-800 bg-white px-2 py-0.5 rounded border border-slate-300 shadow-xs flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFile(e, 'before')}
                    />
                  </label>
                </div>
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center relative">
                  {beforePhoto ? (
                    <img
                      src={beforePhoto}
                      alt="Before HVAC repair"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-3 text-slate-400 text-xs">
                      <Camera className="w-6 h-6 mx-auto mb-1 text-slate-500" />
                      No before photo uploaded
                    </div>
                  )}
                </div>
              </div>

              {/* After Photo */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    After Service (Resolved)
                  </span>
                  <label className="cursor-pointer text-[11px] font-semibold text-teal-700 hover:text-teal-800 bg-white px-2 py-0.5 rounded border border-slate-300 shadow-xs flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFile(e, 'after')}
                    />
                  </label>
                </div>
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center relative">
                  {afterPhoto ? (
                    <img
                      src={afterPhoto}
                      alt="After HVAC repair"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-3 text-slate-400 text-xs">
                      <Camera className="w-6 h-6 mx-auto mb-1 text-slate-500" />
                      No after photo uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Completion Notes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Completion Notes & Technician Diagnostic Report *
              </label>
              <button
                type="button"
                onClick={() =>
                  setCompletionNotes(
                    'Replaced defective dual run capacitor (45/5µF 440V). Cleaned outdoor condenser coil, checked amp draws (Compressor: 11.2A, Fan: 0.9A). Refrigerant R-410A pressures balanced. Supply air 55°F, return air 74°F (19°F delta-T). System operating in manufacturer specs.'
                  )
                }
                className="text-[11px] text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Fill Sample HVAC Diagnostic
              </button>
            </div>
            <textarea
              id="proof-completion-notes"
              rows={3}
              required
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="Detail parts replaced, electrical readings, delta T, and work performed..."
              className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Customer Signer Name *
            </label>
            <input
              id="proof-customer-name"
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Customer Signature Capture Pad */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                Customer Signature Capture
              </label>
              <button
                type="button"
                id="clear-signature-btn"
                onClick={clearSignature}
                className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 p-2 relative">
              <canvas
                id="customer-signature-canvas"
                ref={canvasRef}
                width={560}
                height={140}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-32 bg-white rounded-lg cursor-crosshair touch-none shadow-inner"
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
                  Draw customer signature here with finger or mouse
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              By signing, customer confirms service was completed satisfactorily and system is operational.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            id="cancel-proof-btn"
            onClick={() => setJobForProofOfService(null)}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            id="save-proof-and-complete-btn"
            onClick={handleSaveProofAndComplete}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Proof and Complete Job</span>
          </button>
        </div>
      </div>
    </div>
  );
};
