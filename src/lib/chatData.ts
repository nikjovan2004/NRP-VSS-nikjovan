/**
 * Chat data layer: Firestore when configured, else mock.
 */

import { isFirebaseConfigured } from "./firebase";
import {
  getFirestoreMessagesForOrder,
  sendFirestoreMessage,
} from "./firestoreClient";
import {
  getMessagesForOrder as mockGetMessagesForOrder,
  sendMessage as mockSendMessage,
} from "@/lib/mock-chat";

export interface ChatMessage {
  id: string;
  orderId: string;
  senderRole: "customer" | "provider";
  senderName: string;
  text: string;
  createdAt: string;
}

export async function getMessagesForOrder(orderId: string): Promise<ChatMessage[]> {
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    return getFirestoreMessagesForOrder(orderId);
  }
  return mockGetMessagesForOrder(orderId);
}

export async function sendMessage(
  orderId: string,
  senderRole: "customer" | "provider",
  senderName: string,
  text: string
): Promise<ChatMessage> {
  const msg = mockSendMessage(orderId, senderRole, senderName, text);
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    try {
      return await sendFirestoreMessage(orderId, senderRole, senderName, text);
    } catch {
      return msg;
    }
  }
  return msg;
}
