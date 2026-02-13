"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";

export function PortalSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  return (
    <aside className="w-64 bg-white border-l border-slate-200 h-screen flex flex-col hidden md:flex sticky top-0">
      <div className="p-6 border-b border-slate-100 flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-teal-500">health_and_safety</span>
        <span className="mr-2 font-black text-xl text-slate-800">پرتال بیمار</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/dashboard') ? "bg-teal-50 text-teal-600 font-bold" : "text-slate-600 hover:bg-slate-50"}`}
        >
            <span className="material-symbols-outlined">dashboard</span>
            <span>داشبورد</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <LogoutButton className="w-full justify-center" />
      </div>
    </aside>
  );
}
