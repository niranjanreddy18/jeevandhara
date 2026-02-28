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
