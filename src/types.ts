export type JobStatus = 'Unassigned' | 'Scheduled' | 'En Route' | 'In Progress' | 'Completed';

export type Priority = 'Low' | 'Standard' | 'High' | 'Emergency';

export type ServiceType =
  | 'AC Repair & Diagnostics'
  | 'Furnace / Heating Tune-Up'
  | 'Heat Pump Emergency No-Heat'
  | 'Compressor & Refrigerant Leak'
  | 'Smart Thermostat Installation'
  | 'Blower Motor Replacement'
  | 'Ductwork & Airflow Inspection'
  | 'Seasonal Preventive Maintenance';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

export interface Job {
  id: string; // e.g. "HVAC-1042"
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceAddress: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // "09:30 AM"
  serviceType: ServiceType;
  priority: Priority;
  serviceNotes: string;
  status: JobStatus;
  assignedTechnicianId: string | null;
  assignedTechnicianName?: string;
  createdAt: string;
  updatedAt: string;
}

export type AvailabilityStatus = 'Available' | 'In Field' | 'On Call' | 'Off Duty';

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  vanNumber: string;
  availability: AvailabilityStatus;
  active: boolean;
  specialty: string;
  avatarColor: string;
  currentLocation?: {
    lat: number;
    lng: number;
    label: string;
  };
}

export interface ProofOfService {
  id: string;
  jobId: string;
  technicianId: string;
  technicianName: string;
  completedAt: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  completionNotes: string;
  customerName: string;
  signatureDataUrl: string; // Base64 data URL from canvas
  partsUsed?: string[];
}
