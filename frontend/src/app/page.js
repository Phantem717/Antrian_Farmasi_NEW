"use client";

import { useEffect } from "react";

export default function Home() {
  const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
  const PORT = process.env.NEXT_PUBLIC_API_PORT_FE

  useEffect(() => {
    window.location.href = `http://${HOST}:${PORT}/login`; // 🔀 Redirect langsung ke login RBAC
  }, []);

  return null; // Tidak perlu menampilkan apapun karena langsung redirect
}
                                                             