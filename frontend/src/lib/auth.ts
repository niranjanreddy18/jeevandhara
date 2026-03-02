// Global authentication state for managing user sessions
// Only one user type can be logged in at a time

export type UserType = 'hospital' | 'university' | 'admin' | null;

const SESSION_KEY = 'jh_current_session';

export interface SessionData {
  userType: UserType;
  userId: string; // regId for hospital, uniId for university, 'admin' for admin
}

export function getSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

export function setSession(userType: UserType, userId: string): void {
  try {
    if (userType) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ userType, userId }));
      window.dispatchEvent(new CustomEvent('jh:session-changed', { detail: { userType, userId } }));
    }
  } catch (e) {}
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new CustomEvent('jh:session-changed', { detail: null }));
  } catch (e) {}
}

export function isUserLoggedIn(userType: UserType): boolean {
  const session = getSession();
  return session?.userType === userType;
}

export function getLoggedInUserType(): UserType {
  const session = getSession();
  return session?.userType || null;
}

export function getLoggedInUserId(): string {
  const session = getSession();
  return session?.userId || '';
}

// Check if any user is logged in
export function isAnyUserLoggedIn(): boolean {
  const session = getSession();
  return session?.userType !== null;
}
