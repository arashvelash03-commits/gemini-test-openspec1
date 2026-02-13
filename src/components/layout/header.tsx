"use client";

import { useSession } from "next-auth/react";
import { LogoutButton } from "../auth/logout-button";
import Link from "next/link";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      {/* Mobile Logo / Title */}
      <div className="flex items-center gap-2 md:hidden">
        <span className="material-symbols-outlined text-3xl text-primary">health_and_safety</span>
        <span className="font-black text-lg text-slate-800">سامانه سلامت</span>
      </div>

      {/* Desktop Placeholder (Space) */}
      <div className="hidden md:block"></div>

      <div className="flex items-center gap-3">
          {/* Settings Icon (Links to Profile) */}
          <Link href="/profile" className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors" title="تنظیمات / پروفایل">
            <span className="material-symbols-outlined text-xl">settings</span>
          </Link>

          {/* Notifications Placeholder */}
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Mobile Logout (Desktop uses Sidebar) */}
          <div className="md:hidden">
             {session && (
                 <LogoutButton className="p-2 text-red-500 hover:bg-red-50 rounded-full bg-transparent border-none !px-2" />
             )}
          </div>

          {/* Mobile Menu Button */}
          <button className="p-2 text-slate-600 md:hidden">
            <span className="material-symbols-outlined">menu</span>
          </button>
      </div>
    </header>
  );
}
