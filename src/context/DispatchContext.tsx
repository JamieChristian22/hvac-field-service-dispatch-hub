import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, JobStatus, Priority, Technician, ProofOfService, ServiceType } from '../types';
import { INITIAL_JOBS, INITIAL_TECHNICIANS, INITIAL_PROOFS } from '../data/initialData';

export type ActiveView = 'dispatch' | 'map' | 'my-jobs' | 'team';

interface DispatchContextType {
  jobs: Job[];
  technicians: Technician[];
  proofs: Record<string, ProofOfService>;
  activeTechId: string;
  setActiveTechId: (id: string) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  
  // Modals
  selectedJobForDetail: Job | null;
  setSelectedJobForDetail: (job: Job | null) => void;
  jobForProofOfService: Job | null;
  setJobForProofOfService: (job: Job | null) => void;
  jobForProofReview: Job | null;
  setJobForProofReview: (job: Job | null) => void;
  isNewJobModalOpen: boolean;
  setIsNewJobModalOpen: (open: boolean) => void;

  // Actions
  addJob: (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'customerId'>) => Job;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  assignTechnician: (jobId: string, technicianId: string | null) => void;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  submitProofOfService: (data: Omit<ProofOfService, 'id' | 'completedAt'>) => void;
  getProofOfService: (jobId: string) => ProofOfService | undefined;
  updateTechnicianAvailability: (techId: string, availability: Technician['availability']) => void;
  resetAllData: () => void;
}

const STORAGE_KEYS = {
  JOBS: 'hvac_dispatch_hub_jobs_v1',
  TECHS: 'hvac_dispatch_hub_techs_v1',
  PROOFS: 'hvac_dispatch_hub_proofs_v1',
  ACTIVE_TECH: 'hvac_dispatch_hub_active_tech_v1',
};

const DispatchContext = createContext<DispatchContextType | undefined>(undefined);

export const DispatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
      return saved ? JSON.parse(saved) : INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  });

  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TECHS);
      return saved ? JSON.parse(saved) : INITIAL_TECHNICIANS;
    } catch {
      return INITIAL_TECHNICIANS;
    }
  });

  const [proofs, setProofs] = useState<Record<string, ProofOfService>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROOFS);
      return saved ? JSON.parse(saved) : INITIAL_PROOFS;
    } catch {
      return INITIAL_PROOFS;
    }
  });

  const [activeTechId, setActiveTechId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TECH);
      return saved || 'tech-1';
    } catch {
      return 'tech-1';
    }
  });

  const [activeView, setActiveView] = useState<ActiveView>('dispatch');
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [jobForProofOfService, setJobForProofOfService] = useState<Job | null>(null);
  const [jobForProofReview, setJobForProofReview] = useState<Job | null>(null);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    } catch (e) {
      console.warn('Failed to persist jobs:', e);
    }
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TECHS, JSON.stringify(technicians));
    } catch (e) {
      console.warn('Failed to persist technicians:', e);
    }
  }, [technicians]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROOFS, JSON.stringify(proofs));
    } catch (e) {
      console.warn('Failed to persist proofs:', e);
    }
  }, [proofs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TECH, activeTechId);
    } catch (e) {
      console.warn('Failed to persist active tech:', e);
    }
  }, [activeTechId]);

  // Keep selectedJobForDetail in sync with updated jobs array
  useEffect(() => {
    if (selectedJobForDetail) {
      const fresh = jobs.find((j) => j.id === selectedJobForDetail.id);
      if (fresh) {
        setSelectedJobForDetail(fresh);
      }
    }
  }, [jobs]);

  const addJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'customerId'>): Job => {
    // Generate next sequential HVAC ID
    const existingNums = jobs
      .map((j) => {
        const match = j.id.match(/\d+/);
        return match ? parseInt(match[0], 10) : 1000;
      })
      .filter((n) => !isNaN(n));
    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1050;
    const newId = `HVAC-${nextNum}`;

    let assignedTechName: string | undefined = undefined;
    if (jobData.assignedTechnicianId) {
      const tech = technicians.find((t) => t.id === jobData.assignedTechnicianId);
      if (tech) {
        assignedTechName = tech.name;
      }
    }

    const now = new Date().toISOString();
    const newJob: Job = {
      ...jobData,
      id: newId,
      customerId: `cust-${Date.now()}`,
      assignedTechnicianName: assignedTechName,
      status: jobData.status || (jobData.assignedTechnicianId ? 'Scheduled' : 'Unassigned'),
      createdAt: now,
      updatedAt: now,
    };

    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  };

  const updateJob = (jobId: string, updates: Partial<Job>) => {
    const now = new Date().toISOString();
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        const updated = { ...job, ...updates, updatedAt: now };
        if (updates.assignedTechnicianId !== undefined) {
          if (updates.assignedTechnicianId) {
            const tech = technicians.find((t) => t.id === updates.assignedTechnicianId);
            updated.assignedTechnicianName = tech ? tech.name : undefined;
            if (updated.status === 'Unassigned') {
              updated.status = 'Scheduled';
            }
          } else {
            updated.assignedTechnicianId = null;
            updated.assignedTechnicianName = undefined;
            if (updated.status === 'Scheduled') {
              updated.status = 'Unassigned';
            }
          }
        }
        return updated;
      })
    );
  };

  const assignTechnician = (jobId: string, technicianId: string | null) => {
    const tech = technicianId ? technicians.find((t) => t.id === technicianId) : null;
    const now = new Date().toISOString();

    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        return {
          ...job,
          assignedTechnicianId: technicianId,
          assignedTechnicianName: tech ? tech.name : undefined,
          status: technicianId && job.status === 'Unassigned' ? 'Scheduled' : job.status,
          updatedAt: now,
        };
      })
    );
  };

  const updateJobStatus = (jobId: string, newStatus: JobStatus) => {
    const now = new Date().toISOString();
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        return {
          ...job,
          status: newStatus,
          updatedAt: now,
        };
      })
    );
  };

  const submitProofOfService = (data: Omit<ProofOfService, 'id' | 'completedAt'>) => {
    const now = new Date().toISOString();
    const proofId = `pos-${Date.now()}`;
    const newProof: ProofOfService = {
      ...data,
      id: proofId,
      completedAt: now,
    };

    setProofs((prev) => ({
      ...prev,
      [data.jobId]: newProof,
    }));

    // Transition job status to Completed
    updateJobStatus(data.jobId, 'Completed');
  };

  const getProofOfService = (jobId: string): ProofOfService | undefined => {
    return proofs[jobId];
  };

  const updateTechnicianAvailability = (
    techId: string,
    availability: Technician['availability']
  ) => {
    setTechnicians((prev) =>
      prev.map((t) => (t.id === techId ? { ...t, availability } : t))
    );
  };

  const resetAllData = () => {
    setJobs(INITIAL_JOBS);
    setTechnicians(INITIAL_TECHNICIANS);
    setProofs(INITIAL_PROOFS);
    setActiveTechId('tech-1');
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.TECHS);
    localStorage.removeItem(STORAGE_KEYS.PROOFS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TECH);
  };

  return (
    <DispatchContext.Provider
      value={{
        jobs,
        technicians,
        proofs,
        activeTechId,
        setActiveTechId,
        activeView,
        setActiveView,
        selectedJobForDetail,
        setSelectedJobForDetail,
        jobForProofOfService,
        setJobForProofOfService,
        jobForProofReview,
        setJobForProofReview,
        isNewJobModalOpen,
        setIsNewJobModalOpen,
        addJob,
        updateJob,
        assignTechnician,
        updateJobStatus,
        submitProofOfService,
        getProofOfService,
        updateTechnicianAvailability,
        resetAllData,
      }}
    >
      {children}
    </DispatchContext.Provider>
  );
};

export const useDispatch = (): DispatchContextType => {
  const context = useContext(DispatchContext);
  if (!context) {
    throw new Error('useDispatch must be used within a DispatchProvider');
  }
  return context;
};
