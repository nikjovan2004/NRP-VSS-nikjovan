/**
 * Mock authentication for MVP.
 * Replace with Firebase Auth when API keys are provided.
 */

export type UserRole = "customer" | "provider";

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  /** Provider profile id (p1-p5) - links to mock-providers. Set on provider registration. */
  providerProfileId?: string;
}

const MOCK_USERS_KEY = "domservices-mock-users";

function getStoredUsers(): MockUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MOCK_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStoredUsers(users: MockUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

/** Po ID-ju (npr. order.customerId) – za e-pošto obvestila. */
export function getMockUserById(userId: string): MockUser | undefined {
  return getStoredUsers().find((u) => u.id === userId);
}

export function getCurrentUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("domservices-current-user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: MockUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("domservices-current-user", JSON.stringify(user));
  } else {
    localStorage.removeItem("domservices-current-user");
  }
}

export function mockLogin(
  email: string,
  password: string,
  role: UserRole
): { success: boolean; user?: MockUser; error?: string } {
  const users = getStoredUsers();
  const user = users.find(
    (u) => u.email === email && u.role === role
  );
  if (!user) {
    return { success: false, error: "Uporabnik ni najden. Preverite e-pošto in vlogo." };
  }
  setCurrentUser(user);
  return { success: true, user };
}

export function mockRegister(
  email: string,
  password: string,
  name: string,
  role: UserRole
): { success: boolean; user?: MockUser; error?: string } {
  const users = getStoredUsers();
  if (users.some((u) => u.email === email && u.role === role)) {
    return { success: false, error: "Uporabnik s tem e-poštnim naslovom že obstaja." };
  }
  const providerProfileId =
    role === "provider" ? `dyn-${Date.now()}` : undefined;

  const user: MockUser = {
    id: `mock-${Date.now()}`,
    email,
    name,
    role,
    providerProfileId,
  };
  users.push(user);
  setStoredUsers(users);
  setCurrentUser(user);
  return { success: true, user };
}

export function mockLogout() {
  setCurrentUser(null);
}
