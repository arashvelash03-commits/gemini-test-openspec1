"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";

export function DoctorSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  return (
    <aside className="w-64 bg-white border-l border-slate-200 h-screen flex flex-col hidden md:flex sticky top-0">
      <div className="p-6 border-b border-slate-100 flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-blue-600">stethoscope</span>
        <span className="mr-2 font-black text-xl text-slate-800">پنل پزشک</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/dashboard') ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600 hover:bg-slate-50"}`}
        >
            <span className="material-symbols-outlined">dashboard</span>
            <span>داشبورد</span>
        </Link>
        <Link
            href="/patients" // Assuming this route exists or maps to (doctor)/patient
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/patient') ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600 hover:bg-slate-50"}`}
        >
            <span className="material-symbols-outlined">personal_injury</span>
            <span>بیماران</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <LogoutButton className="w-full justify-center" />
      </div>
    </aside>
  );
}
