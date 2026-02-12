"use client";

import { useSession } from "next-auth/react";
import { LogoutButton } from "../auth/logout-button";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 md:hidden">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-3xl text-primary">health_and_safety</span>
        <span className="font-black text-lg text-slate-800">سامانه سلامت</span>
      </div>

      <div className="flex items-center gap-2">
          {session && (
              <LogoutButton className="p-2 text-red-500 hover:bg-red-50 rounded-full bg-transparent border-none" />
          )}
          {/* Mobile Menu Button - Placeholder */}
          <button className="p-2 text-slate-600">
            <span className="material-symbols-outlined">menu</span>
          </button>
      </div>
    </header>
  );
}
