export type HospitalVerification = {
  regId: string;
  name?: string;
  certificateName?: string;
  proofs?: string;
  submittedAt: number;
};

const APPROVED_KEY = 'jh_approved_hospitals_v1';
const PENDING_KEY = 'jh_pending_verifications_v1';

function loadApproved(): Record<string, { regId: string; name?: string }> {
  try {
    const raw = localStorage.getItem(APPROVED_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    "HOSP-2024-0042": { regId: "HOSP-2024-0042", name: "AIIMS Delhi" },
    "HOSP-2024-0156": { regId: "HOSP-2024-0156", name: "Fortis Mumbai" },
  };
}

function loadPending(): HospitalVerification[] {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveApproved(m: Record<string, { regId: string; name?: string }>) {
  try { localStorage.setItem(APPROVED_KEY, JSON.stringify(m)); } catch (e) {}
}

function savePending(list: HospitalVerification[]) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(list)); } catch (e) {}
}

// persisted stores
export const approvedHospitals: Record<string, { regId: string; name?: string }> = loadApproved();
export const pendingVerifications: HospitalVerification[] = loadPending();

const REGISTERED_KEY = 'jh_registered_hospitals_v1';
const SUBMISSIONS_KEY = 'jh_hospital_submissions_v1';

type RegisteredHospital = {
  regId: string;
  name: string;
  email: string;
  address?: string;
  certificates?: string;
  password?: string;
};

function loadRegistered(): Record<string, RegisteredHospital> {
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {};
}

function saveRegistered(m: Record<string, RegisteredHospital>) {
  try { localStorage.setItem(REGISTERED_KEY, JSON.stringify(m)); } catch (e) {}
}

function loadSubmissions() {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveSubmissions(s: any[]) {
  try { localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(s)); } catch (e) {}
}

export const registeredHospitals: Record<string, RegisteredHospital> = loadRegistered();
export const hospitalSubmissions: any[] = loadSubmissions();

export function validateHospitalRegNumber(reg: string) {
  // Expected format HOSP-YYYY-NNNN
  return /^HOSP-\d{4}-\d{4}$/.test(reg);
}

export function validateHospitalEmail(email: string) {
  try {
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1].toLowerCase();
    return /hospital|health|clinic/.test(domain) || domain.endsWith('.edu') || domain.endsWith('.org');
  } catch (e) { return false; }
}

export function registerHospital(h: RegisteredHospital) {
  if (registeredHospitals[h.regId] || approvedHospitals[h.regId]) return false;
  registeredHospitals[h.regId] = h;
  saveRegistered(registeredHospitals);
  return true;
}

export function authenticateHospital(regId: string, password: string) {
  const r = registeredHospitals[regId];
  if (!r) return false;
  return r.password === password;
}

export function submitPatientCase(regId: string, data: any) {
  const entry = { regId, ...data, submittedAt: Date.now(), status: 'pending' };
  hospitalSubmissions.push(entry);
  saveSubmissions(hospitalSubmissions);
  return true;
}

export function isHospitalApproved(regId: string) {
  return Boolean(approvedHospitals[regId]);
}

export function submitHospitalVerification(v: Omit<HospitalVerification, 'submittedAt'>) {
  const exists = pendingVerifications.find(p => p.regId === v.regId) || approvedHospitals[v.regId];
  if (!exists) {
    const nv: HospitalVerification = { ...v, submittedAt: Date.now() };
    pendingVerifications.push(nv);
    savePending(pendingVerifications);
    try { window.dispatchEvent(new CustomEvent('jh:pending-updated')); } catch (e) {}
    try { console.log('[hospitals] submitted verification', nv); } catch (e) {}
    return true;
  }
  return false;
}

export function getPendingVerifications() {
  return pendingVerifications;
}

export function approveVerification(regId: string) {
  const idx = pendingVerifications.findIndex(p => p.regId === regId);
  if (idx === -1) return false;
  const v = pendingVerifications.splice(idx, 1)[0];
  approvedHospitals[regId] = { regId: v.regId, name: v.name };
  savePending(pendingVerifications);
  saveApproved(approvedHospitals);
  return true;
}

export function rejectVerification(regId: string) {
  const idx = pendingVerifications.findIndex(p => p.regId === regId);
  if (idx === -1) return false;
  pendingVerifications.splice(idx, 1);
  savePending(pendingVerifications);
  return true;
}
