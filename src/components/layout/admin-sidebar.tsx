"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";

export function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  return (
    <aside className="flex-none w-64 lg:w-72 flex flex-col bg-card-light dark:bg-card-dark border-l border-border-light dark:border-border-dark shadow-sm h-screen sticky top-0 overflow-hidden">
      <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-primary">admin_panel_settings</span>
        <span className="mr-2 font-black text-xl text-text-primary-light dark:text-text-primary-dark">پنل مدیریت</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/dashboard') ? "bg-primary-light text-primary-dark font-bold" : "text-text-secondary-light hover:bg-gray-50 dark:text-text-secondary-dark dark:hover:bg-gray-800"}`}
        >
            <span className="material-symbols-outlined">dashboard</span>
            <span>داشبورد</span>
        </Link>
        <Link
            href="/admin/users"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/admin/users') ? "bg-primary-light text-primary-dark font-bold" : "text-text-secondary-light hover:bg-gray-50 dark:text-text-secondary-dark dark:hover:bg-gray-800"}`}
        >
            <span className="material-symbols-outlined">group</span>
            <span>کاربران</span>
        </Link>
        <Link
            href="/admin/audit-logs"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/admin/audit-logs') ? "bg-primary-light text-primary-dark font-bold" : "text-text-secondary-light hover:bg-gray-50 dark:text-text-secondary-dark dark:hover:bg-gray-800"}`}
        >
            <span className="material-symbols-outlined">security</span>
            <span>گزارش‌ها</span>
        </Link>
        <Link
            href="/admin/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/admin/profile') ? "bg-primary-light text-primary-dark font-bold" : "text-text-secondary-light hover:bg-gray-50 dark:text-text-secondary-dark dark:hover:bg-gray-800"}`}
        >
            <span className="material-symbols-outlined">person</span>
            <span>پروفایل</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-border-light dark:border-border-dark">
        <LogoutButton className="w-full justify-center" />
      </div>
    </aside>
  );
}
