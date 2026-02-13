"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";

export function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  return (
    <aside className="w-64 bg-slate-900 border-l border-slate-800 h-screen flex flex-col hidden md:flex sticky top-0 text-slate-300">
      <div className="p-6 border-b border-slate-800 flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-emerald-500">admin_panel_settings</span>
        <span className="mr-2 font-black text-xl text-white">پنل مدیریت</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/dashboard') ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white"}`}
        >
            <span className="material-symbols-outlined">dashboard</span>
            <span>داشبورد</span>
        </Link>
        <Link
            href="/admin/users"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/admin/users') ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white"}`}
        >
            <span className="material-symbols-outlined">group</span>
            <span>کاربران</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <LogoutButton className="w-full justify-center text-red-400 hover:bg-slate-800 border border-slate-800" />
      </div>
    </aside>
  );
}
