export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

const NOTIF_KEY = "domservices-mock-notifications";

function getStoredNotifications(): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStoredNotifications(notifs: Notification[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
}

export function addNotification(
  userId: string,
  title: string,
  message: string,
  link?: string
): Notification {
  const notifs = getStoredNotifications();
  const notif: Notification = {
    id: `notif-${Date.now()}`,
    userId,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString(),
    link,
  };
  notifs.unshift(notif);
  setStoredNotifications(notifs);
  return notif;
}

export function getNotificationsForUser(userId: string): Notification[] {
  return getStoredNotifications().filter((n) => n.userId === userId);
}

export function getUnreadCount(userId: string): number {
  return getStoredNotifications().filter(
    (n) => n.userId === userId && !n.read
  ).length;
}

export function markAllRead(userId: string) {
  const notifs = getStoredNotifications().map((n) =>
    n.userId === userId ? { ...n, read: true } : n
  );
  setStoredNotifications(notifs);
}

export function markRead(notifId: string) {
  const notifs = getStoredNotifications().map((n) =>
    n.id === notifId ? { ...n, read: true } : n
  );
  setStoredNotifications(notifs);
}
