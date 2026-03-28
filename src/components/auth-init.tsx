"use client";

import { useEffect } from "react";
import { initAuthListener } from "@/lib/auth";

export function AuthInit() {
  useEffect(() => {
    initAuthListener();
  }, []);
  return null;
}
