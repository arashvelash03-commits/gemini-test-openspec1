"use client";

import { signOut } from "next-auth/react";
import { trpc } from "@/app/_trpc/client";

export function LogoutButton({ className }: { className?: string }) {
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout audit failed", error);
    } finally {
      signOut({ callbackUrl: "/login" });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium ${className}`}
    >
      <span className="material-symbols-outlined text-lg">logout</span>
      خروج
    </button>
  );
}
