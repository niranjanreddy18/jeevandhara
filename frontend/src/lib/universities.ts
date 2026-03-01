export type UniversityVerification = {
  uniId: string;
  name?: string;
  certificateName?: string;
  proofs?: string;
  submittedAt: number;
};

type RegisteredUniversity = {
  uniId: string;
  name: string;
  email: string;
  address?: string;
  certificates?: string;
  password?: string;
};

const APPROVED_KEY = 'jh_approved_universities_v1';
const PENDING_KEY = 'jh_pending_university_verifications_v1';
const PASSWORDS_KEY = 'jh_university_passwords_v1';

function loadApproved(): Record<string, { uniId: string; name?: string }> {
  try {
    const raw = localStorage.getItem(APPROVED_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    "UNI-2024-0001": { uniId: "UNI-2024-0001", name: "IIT Delhi" },
    "UNI-2024-0002": { uniId: "UNI-2024-0002", name: "IIT Bombay" },
  };
}

function loadPending(): UniversityVerification[] {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveApproved(m: Record<string, { uniId: string; name?: string }>) {
  try { localStorage.setItem(APPROVED_KEY, JSON.stringify(m)); } catch (e) {}
}

function savePending(list: UniversityVerification[]) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(list)); } catch (e) {}
}

function loadPasswords(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PASSWORDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    "UNI-2024-0001": "admin123",
    "UNI-2024-0002": "admin123",
  };
}

function savePasswords(m: Record<string, string>) {
  try { localStorage.setItem(PASSWORDS_KEY, JSON.stringify(m)); } catch (e) {}
}

// persisted stores
export const approvedUniversities: Record<string, { uniId: string; name?: string }> = loadApproved();
export const pendingUniversityVerifications: UniversityVerification[] = loadPending();
export const universityPasswords: Record<string, string> = loadPasswords();

export const registeredUniversities: Record<string, RegisteredUniversity> = {};

export function validateUniversityId(id: string) {
  // Expected format: UNI-YYYY-NNNN (similar to hospitals)
  return /^UNI-\d{4}-\d{4}$/.test(id);
}

export function validateUniversityEmail(email: string, universityName: string) {
  try {
    const lowerEmail = email.toLowerCase();
    const lowerName = universityName.toLowerCase();
    // Email must contain university name and end with professional university domain
    const hasName = lowerEmail.includes(lowerName.split(' ')[0]); // check first word of university name
    const hasDomain = lowerEmail.endsWith('.ac.in') || lowerEmail.endsWith('.edu.in') || lowerEmail.endsWith('.res.in');
    return hasName && hasDomain;
  } catch (e) { return false; }
}

export function registerUniversity(u: RegisteredUniversity) {
  // Check if already registered or approved
  const exists = registeredUniversities[u.uniId] || approvedUniversities[u.uniId] || pendingUniversityVerifications.find(p => p.uniId === u.uniId);
  if (exists) return false;
  
  // Store the password separately
  universityPasswords[u.uniId] = u.password || '';
  savePasswords(universityPasswords);
  
  // Create a pending verification request
  const pendingReq: UniversityVerification = {
    uniId: u.uniId,
    name: u.name,
    certificateName: u.certificates,
    proofs: u.address,
    submittedAt: Date.now(),
  };
  
  pendingUniversityVerifications.push(pendingReq);
  savePending(pendingUniversityVerifications);
  
  try { window.dispatchEvent(new CustomEvent('jh:pending-updated')); } catch (e) {}
  
  return true;
}

export function authenticateUniversity(uniId: string, password: string) {
  // Only allow login if university is approved
  if (!approvedUniversities[uniId]) return false;
  
  const storedPassword = universityPasswords[uniId];
  if (!storedPassword) return false;
  return storedPassword === password;
}

export function getPendingUniversityVerifications() {
  return pendingUniversityVerifications;
}

export function approveUniversityVerification(uniId: string) {
  const idx = pendingUniversityVerifications.findIndex(p => p.uniId === uniId);
  if (idx === -1) return false;
  const v = pendingUniversityVerifications.splice(idx, 1)[0];
  approvedUniversities[uniId] = { uniId: v.uniId, name: v.name };
  savePending(pendingUniversityVerifications);
  saveApproved(approvedUniversities);
  return true;
}

export function rejectUniversityVerification(uniId: string) {
  const idx = pendingUniversityVerifications.findIndex(p => p.uniId === uniId);
  if (idx === -1) return false;
  pendingUniversityVerifications.splice(idx, 1);
  savePending(pendingUniversityVerifications);
  return true;
}
