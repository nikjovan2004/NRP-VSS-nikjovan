"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import type { Order } from "@/types/order";
import { getOrderById } from "@/lib/mock-orders";
import {
  getMessagesForOrder,
  sendMessage,
  type ChatMessage,
} from "@/lib/chatData";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("sl-SI", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderChatPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const user = mounted ? getCurrentUser() : null;

  const loadOrderAndMessages = useCallback(async () => {
    const o = getOrderById(id);
    setOrder(o ?? null);
    if (o) {
      const msgs = await getMessagesForOrder(o.id);
      setMessages(msgs);
    }
  }, [id]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    void loadOrderAndMessages();
  }, [loadOrderAndMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !order) return;
    setInput("");
    await sendMessage(order.id, "customer", user.name, input.trim());
    const msgs = await getMessagesForOrder(order.id);
    setMessages(msgs);
  };

  if (mounted && (!user || user.role !== "customer")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#6b7280]">Za klepet se morate prijaviti.</p>
        <Link href="/auth/customer/login" className="rounded-lg bg-[#1d283a] px-4 py-2 text-white">
          Prijava
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-[#6b7280]">Naročilo ni najdeno.</p>
        <Link href="/customer/orders" className="mt-4 inline-block text-[#1d283a] hover:underline">
          ← Moja naročila
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col px-4 py-8">
      <Link href={`/customer/orders/${order.id}`} className="text-[#6b7280] hover:text-[#1d283a]">
        ← Nazaj na naročilo
      </Link>

      <div className="mt-6 rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-[#e5e7eb] px-4 py-3">
          <h1 className="font-semibold text-[#1d283a]">Varni klepet</h1>
          <p className="text-sm text-[#6b7280]">Naročilo: {order.providerName}</p>
        </div>

        <div className="flex h-80 flex-col overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-[#6b7280]">
              Še ni sporočil. Začnite klepet.
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 ${
                  msg.senderRole === "customer"
                    ? "ml-auto max-w-[80%] text-right"
                    : "mr-auto max-w-[80%] text-left"
                }`}
              >
                <div
                  className={`inline-block rounded-lg px-3 py-2 ${
                    msg.senderRole === "customer"
                      ? "bg-[#1d283a] text-white"
                      : "bg-[#e5e7eb] text-[#1d283a]"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p
                    className={`mt-1 text-xs ${
                      msg.senderRole === "customer"
                        ? "text-white/80"
                        : "text-[#6b7280]"
                    }`}
                  >
                    {msg.senderName} • {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex gap-2 border-t border-[#e5e7eb] p-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Vaše sporočilo..."
            className="flex-1 rounded-lg border border-[#e5e7eb] px-4 py-2 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-lg bg-[#1d283a] px-4 py-2 font-medium text-white hover:bg-[#2a3a4f] disabled:opacity-50"
          >
            Pošlji
          </button>
        </form>
      </div>
    </main>
  );
}
