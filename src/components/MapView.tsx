import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from '../context/DispatchContext';
import { Job, JobStatus, Priority } from '../types';
import { PriorityBadge, StatusBadge } from './StatusBadge';
import {
  MapPin,
  Truck,
  Phone,
  Clock,
  User,
  Filter,
  Layers,
  ChevronRight,
  ExternalLink,
  Navigation
} from 'lucide-react';
import L from 'leaflet';

export const MapView: React.FC = () => {
  const { jobs, technicians, setSelectedJobForDetail } = useDispatch();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showVans, setShowVans] = useState<boolean>(true);

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || null;

  // Filter jobs for map
  const displayJobs = jobs.filter((job) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'in-field')
      return job.status === 'En Route' || job.status === 'In Progress';
    return job.status === filterStatus;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered around Austin metro
    const map = L.map(mapContainerRef.current, {
      center: [30.2762, -97.7415],
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    (Object.values(markersRef.current) as L.Marker[]).forEach((marker) => {
      marker.remove();
    });
    markersRef.current = {};

    const bounds = L.latLngBounds([]);

    // 1. Plot Jobs
    displayJobs.forEach((job) => {
      if (!job.lat || !job.lng) return;

      const isEmergency = job.priority === 'Emergency';
      const isHigh = job.priority === 'High';
      const isCompleted = job.status === 'Completed';
      const isInProgress = job.status === 'In Progress' || job.status === 'En Route';

      let pinColor = '#0d9488'; // teal default
      if (isEmergency) pinColor = '#dc2626'; // red
      else if (isHigh) pinColor = '#ea580c'; // orange
      else if (isCompleted) pinColor = '#10b981'; // green
      else if (isInProgress) pinColor = '#0284c7'; // blue

      const isSelected = selectedJobId === job.id;

      // Custom SVG Marker Icon
      const iconHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -100%); cursor: pointer;">
          <div style="
            background-color: ${pinColor};
            width: ${isSelected ? '38px' : '30px'};
            height: ${isSelected ? '38px' : '30px'};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2.5px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          ">
            <span style="transform: rotate(45deg); color: #ffffff; font-size: ${isSelected ? '12px' : '10px'}; font-weight: 800; font-family: monospace;">
              ${job.id.split('-')[1] || ''}
            </span>
          </div>
          ${
            isEmergency
              ? `<div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(220, 38, 38, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; z-index: -1;"></div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-hvac-pin',
        iconSize: [30, 42],
        iconAnchor: [15, 42],
      });

      const marker = L.marker([job.lat, job.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedJobId(job.id);
      });

      markersRef.current[`job-${job.id}`] = marker;
      bounds.extend([job.lat, job.lng]);
    });

    // 2. Plot Technicians' Vans
    if (showVans) {
      technicians.forEach((tech) => {
        if (!tech.currentLocation) return;
        const { lat, lng } = tech.currentLocation;

        const vanIconHtml = `
          <div style="transform: translate(-50%, -50%); cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <div style="
              background-color: #0f172a;
              color: #2dd4bf;
              padding: 4px 8px;
              border-radius: 9999px;
              border: 2px solid #2dd4bf;
              font-size: 11px;
              font-weight: bold;
              display: flex;
              align-items: center;
              gap: 4px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.4);
              white-space: nowrap;
            ">
              <span>🚐 ${tech.vanNumber.split(' ')[0]}</span>
            </div>
          </div>
        `;

        const vanIcon = L.divIcon({
          html: vanIconHtml,
          className: 'custom-van-marker',
          iconSize: [80, 30],
          iconAnchor: [40, 15],
        });

        const marker = L.marker([lat, lng], { icon: vanIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; padding: 2px;">
            <strong style="color: #0f172a;">${tech.name}</strong><br/>
            <span style="color: #64748b;">${tech.vanNumber}</span><br/>
            <span style="color: #0d9488; font-weight: bold;">Status: ${tech.availability}</span>
          </div>
        `);

        markersRef.current[`tech-${tech.id}`] = marker;
        bounds.extend([lat, lng]);
      });
    }

    if (bounds.isValid() && displayJobs.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [displayJobs, technicians, showVans, selectedJobId]);

  // Center on selected job
  const handleSelectJob = (job: Job) => {
    setSelectedJobId(job.id);
    const map = mapInstanceRef.current;
    if (map && job.lat && job.lng) {
      map.flyTo([job.lat, job.lng], 14, { duration: 0.8 });
    }
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Map Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            Field Dispatch & Territory Map
          </h2>
          <p className="text-xs text-slate-500">
            Real-time visual map of all customer service calls and active technician van locations
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            id="map-filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Statuses ({jobs.length})</option>
            <option value="Unassigned">Unassigned Only</option>
            <option value="Scheduled">Scheduled</option>
            <option value="in-field">In Field (En Route & Working)</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            id="toggle-vans-btn"
            onClick={() => setShowVans(!showVans)}
            className={`text-xs px-3 py-2 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
              showVans
                ? 'bg-slate-900 text-teal-300 border-slate-800'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{showVans ? 'Vans Shown' : 'Hide Vans'}</span>
          </button>
        </div>
      </div>

      {/* Main Map & Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[620px]">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-full">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Map Legend Floating Tag */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-md text-[11px] space-y-1.5 hidden sm:block">
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Map Pin Key
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Emergency
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> Standard
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completed
              </span>
            </div>
          </div>
        </div>

        {/* Selected Job Card & Service Directory */}
        <div className="h-full flex flex-col space-y-3 overflow-hidden">
          {/* Selected Job Details Drawer */}
          {selectedJob ? (
            <div className="bg-white rounded-2xl border border-teal-300 shadow-md p-4 space-y-3 shrink-0 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {selectedJob.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <PriorityBadge priority={selectedJob.priority} size="sm" />
                  <StatusBadge status={selectedJob.status} size="sm" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {selectedJob.serviceType}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  {selectedJob.customerName}
                </p>
              </div>

              <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    {selectedJob.serviceAddress}, {selectedJob.city}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {selectedJob.appointmentDate} at {selectedJob.appointmentTime}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Tech: {selectedJob.assignedTechnicianName || 'Unassigned'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${selectedJob.customerPhone.replace(/[^0-9]/g, '')}`}
                  className="flex-1 text-center py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors flex items-center justify-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  Call Customer
                </a>
                <button
                  id="open-job-from-map-btn"
                  onClick={() => setSelectedJobForDetail(selectedJob)}
                  className="flex-1 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1"
                >
                  Open Full Ticket
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center text-xs text-slate-500 shrink-0">
              <MapPin className="w-6 h-6 mx-auto mb-1 text-slate-400" />
              Click any pin on the map or select a service order below to inspect details
            </div>
          )}

          {/* Job List Scroll Area */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-3 overflow-y-auto space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Active Jobs on Map ({displayJobs.length})
            </div>
            {displayJobs.map((job) => {
              const isSelected = job.id === selectedJobId;
              return (
                <div
                  key={job.id}
                  onClick={() => handleSelectJob(job)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-slate-800">{job.id}</span>
                    <PriorityBadge priority={job.priority} size="sm" />
                  </div>
                  <div className="font-semibold text-slate-900 truncate">{job.serviceType}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {job.customerName} • {job.serviceAddress}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
