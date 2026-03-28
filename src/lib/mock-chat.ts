export interface ChatMessage {
  id: string;
  orderId: string;
  senderRole: "customer" | "provider";
  senderName: string;
  text: string;
  createdAt: string; // ISO string
}

const CHAT_KEY = "domservices-mock-chat";

function getStoredMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStoredMessages(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
}

export function getMessagesForOrder(orderId: string): ChatMessage[] {
  return getStoredMessages()
    .filter((m) => m.orderId === orderId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function sendMessage(
  orderId: string,
  senderRole: "customer" | "provider",
  senderName: string,
  text: string
): ChatMessage {
  const messages = getStoredMessages();
  const msg: ChatMessage = {
    id: `msg-${Date.now()}`,
    orderId,
    senderRole,
    senderName,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
  messages.push(msg);
  setStoredMessages(messages);
  return msg;
}
