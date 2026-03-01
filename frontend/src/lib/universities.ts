type RegisteredUniversity = {
  uniId: string;
  name: string;
  email: string;
  address?: string;
  certificates?: string;
  password?: string;
};

const REGISTERED_KEY = 'jh_registered_universities_v1';

function loadRegistered(): Record<string, RegisteredUniversity> {
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {};
}

function saveRegistered(m: Record<string, RegisteredUniversity>) {
  try { localStorage.setItem(REGISTERED_KEY, JSON.stringify(m)); } catch (e) {}
}

export const registeredUniversities: Record<string, RegisteredUniversity> = loadRegistered();

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
  if (registeredUniversities[u.uniId]) return false;
  registeredUniversities[u.uniId] = u;
  saveRegistered(registeredUniversities);
  return true;
}

export function authenticateUniversity(uniId: string, password: string) {
  const u = registeredUniversities[uniId];
  if (!u) return false;
  return u.password === password;
}
