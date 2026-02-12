"use client";

import { signOut } from "next-auth/react";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={`flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium ${className}`}
    >
      <span className="material-symbols-outlined text-lg">logout</span>
      خروج
    </button>
  );
}
