"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href = "http://172.16.85.27:3200/RBAC"; // 🔀 Redirect langsung ke login RBAC
  }, []);

  return null; // Tidak perlu menampilkan apapun karena langsung redirect
}
