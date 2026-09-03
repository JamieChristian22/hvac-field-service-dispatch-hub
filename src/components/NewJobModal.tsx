import React, { useState } from 'react';
import { useDispatch } from '../context/DispatchContext';
import { Priority, ServiceType } from '../types';
import { X, Calendar, Clock, MapPin, User, Phone, Wrench, AlertTriangle, FileText, Check } from 'lucide-react';

export const NewJobModal: React.FC = () => {
  const { isNewJobModalOpen, setIsNewJobModalOpen, addJob, technicians } = useDispatch();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [city, setCity] = useState('Austin');
  const [state, setState] = useState('TX');
  const [zip, setZip] = useState('78701');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  const [appointmentTime, setAppointmentTime] = useState('10:00 AM');
  const [serviceType, setServiceType] = useState<ServiceType>('AC Repair & Diagnostics');
  const [priority, setPriority] = useState<Priority>('Standard');
  const [serviceNotes, setServiceNotes] = useState('');
  const [assignedTechnicianId, setAssignedTechnicianId] = useState<string>('');

  if (!isNewJobModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !serviceAddress.trim()) {
      alert('Please provide customer name and service address.');
      return;
    }

    // Generate random jitter coordinates near Austin metro for map positioning
    const lat = 30.2672 + (Math.random() - 0.5) * 0.12;
    const lng = -97.7431 + (Math.random() - 0.5) * 0.12;

    addJob({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || '(512) 555-0100',
      serviceAddress: serviceAddress.trim(),
      city: city.trim() || 'Austin',
      state: state.trim() || 'TX',
      zip: zip.trim() || '78701',
      lat,
      lng,
      appointmentDate,
      appointmentTime,
      serviceType,
      priority,
      serviceNotes: serviceNotes.trim(),
      status: assignedTechnicianId ? 'Scheduled' : 'Unassigned',
      assignedTechnicianId: assignedTechnicianId || null,
    });

    // Reset and close
    setIsNewJobModalOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setServiceAddress('');
    setServiceNotes('');
    setAssignedTechnicianId('');
  };

  const serviceOptions: ServiceType[] = [
    'AC Repair & Diagnostics',
    'Furnace / Heating Tune-Up',
    'Heat Pump Emergency No-Heat',
    'Compressor & Refrigerant Leak',
    'Smart Thermostat Installation',
    'Blower Motor Replacement',
    'Ductwork & Airflow Inspection',
    'Seasonal Preventive Maintenance',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <Wrench className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create New Service Job</h2>
              <p className="text-xs text-slate-400">Dispatch a new HVAC work order into the queue</p>
            </div>
          </div>
          <button
            id="close-new-job-modal-btn"
            onClick={() => setIsNewJobModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Customer Details */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Customer Name *
                </label>
                <div className="relative">
                  <input
                    id="new-job-customer-name"
                    type="text"
                    required
                    placeholder="e.g. Robert Henderson"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Customer Phone *
                </label>
                <div className="relative">
                  <input
                    id="new-job-customer-phone"
                    type="tel"
                    placeholder="(512) 555-0199"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service Address */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              Service Address
            </h3>
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Street Address *
                </label>
                <input
                  id="new-job-address"
                  type="text"
                  required
                  placeholder="e.g. 2408 South Lamar Blvd, Suite 104"
                  value={serviceAddress}
                  onChange={(e) => setServiceAddress(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                  <input
                    id="new-job-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">State</label>
                  <input
                    id="new-job-state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ZIP Code</label>
                  <input
                    id="new-job-zip"
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Schedule */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              Appointment Time
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Appointment Date
                </label>
                <input
                  id="new-job-date"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Appointment Window / Time
                </label>
                <select
                  id="new-job-time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                >
                  <option value="08:00 AM">08:00 AM (First Call)</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="01:00 PM">01:00 PM (Afternoon)</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="04:00 PM">04:00 PM (Late Window)</option>
                  <option value="Emergency (Immediate)">Emergency (Immediate Dispatch)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Service Specs & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Service Type *
              </label>
              <select
                id="new-job-service-type"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                {serviceOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Priority Level *
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Low', 'Standard', 'High', 'Emergency'] as Priority[]).map((p) => {
                  const isSelected = priority === p;
                  let colorClasses = '';
                  if (p === 'Emergency') {
                    colorClasses = isSelected
                      ? 'bg-red-600 text-white font-bold border-red-600'
                      : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
                  } else if (p === 'High') {
                    colorClasses = isSelected
                      ? 'bg-amber-600 text-white font-bold border-amber-600'
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100';
                  } else if (p === 'Standard') {
                    colorClasses = isSelected
                      ? 'bg-teal-700 text-white font-bold border-teal-700'
                      : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100';
                  } else {
                    colorClasses = isSelected
                      ? 'bg-slate-700 text-white font-bold border-slate-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
                  }

                  return (
                    <button
                      type="button"
                      key={p}
                      id={`new-job-priority-${p.toLowerCase()}`}
                      onClick={() => setPriority(p)}
                      className={`text-xs py-2 px-1 rounded-lg border text-center transition-colors font-medium ${colorClasses}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Assign Technician (Optional) */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Assign Field Technician (Optional)
            </label>
            <select
              id="new-job-assign-tech"
              value={assignedTechnicianId}
              onChange={(e) => setAssignedTechnicianId(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            >
              <option value="">Leave Unassigned (Queue for Dispatch)</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} — {tech.vanNumber} ({tech.availability})
                </option>
              ))}
            </select>
          </div>

          {/* Service Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Service Notes & Dispatch Symptoms
            </label>
            <textarea
              id="new-job-notes"
              rows={3}
              placeholder="e.g. Customer reports outdoor condenser fan not spinning, blowing warm air inside. Breaker tested OK. Dog locked in backyard."
              value={serviceNotes}
              onChange={(e) => setServiceNotes(e.target.value)}
              className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              id="cancel-new-job-btn"
              onClick={() => setIsNewJobModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-new-job-btn"
              className="px-5 py-2.5 rounded-lg text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Dispatch Job</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
