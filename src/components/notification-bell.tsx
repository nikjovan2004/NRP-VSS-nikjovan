"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  getNotificationsForUser,
  getUnreadCount,
  markAllRead,
  type Notification,
} from "@/lib/notificationsData";
import { getCurrentUser } from "@/lib/auth";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("sl-SI", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const user = getCurrentUser();

  const refresh = async () => {
    if (!user) return;
    const [notifs, count] = await Promise.all([
      getNotificationsForUser(user.id),
      getUnreadCount(user.id),
    ]);
    setNotifications(notifs);
    setUnread(count);
  };

  useEffect(() => {
    void refresh();
    const interval = setInterval(() => void refresh(), 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen((v) => !v);
    if (!open && user) {
      void markAllRead(user.id);
      setUnread(0);
    }
  };

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative rounded-lg p-1.5 text-[#6b7280] hover:bg-[#f8f9fa]"
        aria-label="Obvestila"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-[#e5e7eb] bg-white shadow-lg">
          <div className="border-b border-[#e5e7eb] px-4 py-3">
            <h3 className="font-semibold text-[#1d283a]">Obvestila</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-[#6b7280]">
                Ni obvestil.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`border-b border-[#e5e7eb] px-4 py-3 last:border-0 ${
                    !n.read ? "bg-blue-50" : ""
                  }`}
                >
                  {n.link ? (
                    <Link
                      href={n.link}
                      onClick={() => setOpen(false)}
                      className="block"
                    >
                      <p className="text-sm font-medium text-[#1d283a]">
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[#6b7280]">
                        {n.message}
                      </p>
                      <p className="mt-1 text-xs text-[#9ca3af]">
                        {formatTime(n.createdAt)}
                      </p>
                    </Link>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-[#1d283a]">
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[#6b7280]">
                        {n.message}
                      </p>
                      <p className="mt-1 text-xs text-[#9ca3af]">
                        {formatTime(n.createdAt)}
                      </p>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
